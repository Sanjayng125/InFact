import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";
import { redis } from "@/lib/redis/redis";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const supabase = createAdminClient();
        const { data: user } = await supabase
            .from("users")
            .select("is_pro, credits")
            .eq("id", userId)
            .single();

        const isPro = user?.is_pro ?? false;
        const limit = user?.credits ?? 5;
        const key = `infact:usage:${userId}:${new Date().toISOString().split("T")[0]}`;
        const used = (await redis.get<number>(key)) ?? 0;

        return Response.json({
            used,
            limit,
            remaining: Math.max(0, limit - used),
            isPro,
        });
    } catch {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
