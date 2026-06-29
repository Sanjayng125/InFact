import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("checks")
            .select(`
        id,
        input_type,
        raw_input,
        file_url,
        status,
        created_at,
        claims (
          id,
          claim_text,
          verdict,
          confidence,
          reasoning,
          sources (
            title,
            url,
            snippet
          )
        )
      `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            return Response.json({ error: "Failed to fetch history" }, { status: 500 });
        }

        return Response.json(data);
    } catch {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
