import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";

function verifySignature(payload: string, signature: string): boolean {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;

    if (!secret) {
        console.error("No LEMON_SQUEEZY_WEBHOOK_SECRET environment variable");
        return false;
    }

    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    try {
        return crypto.timingSafeEqual(
            Buffer.from(digest, "hex"),
            Buffer.from(signature, "hex")
        );
    } catch (error) {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-signature") ?? "";

        if (!verifySignature(rawBody, signature)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        if (!payload?.meta) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const eventName = payload.meta?.event_name as string;
        const userId = payload.meta?.custom_data?.user_id as string;
        const attributes = payload.data?.attributes;

        if (!userId) {
            return Response.json({ received: true }, { status: 200 });
        }

        const supabase = createAdminClient();
        const { data: user } = await supabase.from("users").select("is_pro, credits").eq("id", userId).single();

        if (!user) return Response.json({ received: true }, { status: 200 });

        switch (eventName) {
            case "subscription_created":
            case "subscription_resumed":
            case "subscription_unpaused": {
                const endsAt = attributes?.ends_at ?? attributes?.renews_at ?? null;
                // console.log("Upgrading to pro", { eventName, endsAt });
                await supabase
                    .from("users")
                    .update({
                        is_pro: true,
                        plan_expires_at: endsAt,
                        credits: user?.credits ? user.credits + 50 : 50,
                    })
                    .eq("id", userId);
                break;
            }

            case "subscription_payment_success": {
                // console.log("Payment success, confirming pro", { eventName });
                await supabase
                    .from("users")
                    .update({ is_pro: true })
                    .eq("id", userId);
                break;
            }

            case "subscription_expired":
            case "subscription_payment_failed": {
                // console.log("Downgrading to free", { eventName });
                await supabase
                    .from("users")
                    .update({
                        is_pro: false,
                        plan_expires_at: null,
                    })
                    .eq("id", userId);
                break;
            }

            case "subscription_cancelled":
            case "subscription_paused": {
                // console.log("Subscription paused/cancelled", { eventName });
                const endsAt = attributes?.ends_at ?? null;
                await supabase
                    .from("users")
                    .update({
                        plan_expires_at: endsAt,
                    })
                    .eq("id", userId);
                break;
            }

            case "subscription_updated": {
                const endsAt = attributes?.ends_at ?? attributes?.renews_at ?? null;
                const status = attributes?.status as string;
                const isActive = ["active", "on_trial"].includes(status);
                // console.log("Subscription updated", { eventName, isActive, endsAt });
                await supabase
                    .from("users")
                    .update({
                        is_pro: isActive,
                        plan_expires_at: isActive ? endsAt : null,
                    })
                    .eq("id", userId);
                break;
            }

            default:
                console.log(`Unhandled event: ${eventName}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}