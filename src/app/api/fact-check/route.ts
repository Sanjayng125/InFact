import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import { runFactCheckAgent } from "@/lib/agent";
import { factCheckRateLimit } from "@/lib/redis/ratelimit";
import { checkUsageLimit } from "@/lib/redis/usage";
import { uploadToStorage, getSignedUrl } from "@/lib/storage";
import { transcribeVideo, extractTextFromImage } from "@/lib/transcribe";
import { NextRequest } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 45 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, is_pro")
            .eq("id", userId)
            .single();

        if (userError || !user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const { success } = await factCheckRateLimit.limit(userId);
        if (!success) {
            return Response.json(
                { error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }

        const { allowed, remaining, resetIn } = await checkUsageLimit(
            userId,
            user.is_pro
        );
        if (!allowed) {
            return Response.json(
                {
                    error: `Daily limit reached. Resets in ${Math.ceil(resetIn / 3600)} hours.`,
                    upgradeRequired: !user.is_pro,
                },
                { status: 429 }
            );
        }

        // ---------------------------------------------------------

        const formData = await req.formData();
        const inputType = formData.get("inputType") as string;
        const rawInput = formData.get("rawInput") as string | null;
        const file = formData.get("file") as File | null;

        if (!inputType) {
            return Response.json({ error: "inputType is required" }, { status: 400 });
        }

        let agentInput = "";
        let fileUrl: string | null = null;

        if (inputType === "text") {
            if (!rawInput?.trim()) {
                return Response.json({ error: "Text input is required" }, { status: 400 });
            }
            agentInput = rawInput;

        } else if (inputType === "url") {
            if (!rawInput?.trim()) {
                return Response.json({ error: "URL is required" }, { status: 400 });
            }
            agentInput = `Please fact-check the content at this URL: ${rawInput}`;

        } else if (inputType === "image" || inputType === "video") {
            if (!file) {
                return Response.json({ error: "File is required" }, { status: 400 });
            }

            const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
            const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

            if (!isImage && !isVideo) {
                return Response.json({ error: "Invalid file type" }, { status: 400 });
            }

            const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
            if (file.size > maxSize) {
                return Response.json(
                    { error: `File too large. Max size is ${isImage ? "5MB" : "45MB"}.` },
                    { status: 400 }
                );
            }

            const filePath = await uploadToStorage(file, userId);
            fileUrl = await getSignedUrl(filePath);

            const buffer = await file.arrayBuffer();
            const extractedContent = isVideo
                ? await transcribeVideo(buffer, file.type)
                : await extractTextFromImage(buffer, file.type);

            if (!extractedContent?.trim()) {
                return Response.json(
                    {
                        error: `Could not extract content from the ${inputType}. Please try a clearer ${isImage ? "image with visible text" : "video with clear audio"}.`,
                    },
                    { status: 400 }
                );
            }

            agentInput = `Please fact-check the following content extracted from a ${inputType}:\n\n${extractedContent}`;

        } else {
            return Response.json({ error: "Invalid inputType" }, { status: 400 });
        }

        const { data: check, error: checkError } = await supabase
            .from("checks")
            .insert({
                user_id: userId,
                input_type: inputType,
                raw_input: rawInput ?? null,
                file_url: fileUrl,
                status: "processing",
            })
            .select()
            .single();

        if (checkError || !check) {
            return Response.json({ error: "Failed to create check" }, { status: 500 });
        }

        const result = await runFactCheckAgent(agentInput);

        for (const claim of result.claims) {
            const { data: claimRow, error: claimError } = await supabase
                .from("claims")
                .insert({
                    check_id: check.id,
                    claim_text: claim.claim_text,
                    verdict: claim.verdict,
                    confidence: claim.confidence,
                    reasoning: claim.reasoning,
                })
                .select()
                .single();

            if (claimError || !claimRow) continue;

            if (claim.sources.length > 0) {
                await supabase.from("sources").insert(
                    claim.sources.map((s) => ({
                        claim_id: claimRow.id,
                        title: s.title,
                        url: s.url,
                        snippet: s.snippet,
                    }))
                );
            }
        }

        await supabase
            .from("checks")
            .update({ status: "completed" })
            .eq("id", check.id);

        return Response.json({
            checkId: check.id,
            result,
            remaining,
        });

    } catch (err) {
        console.error("Fact check error:", err);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
