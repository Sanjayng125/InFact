import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        const supabase = createAdminClient();
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url)
        const sort = searchParams.get('sort') ?? 'desc'
        const limit = parseInt(isNaN(Number(searchParams.get('limit'))) ? '10' : searchParams.get('limit') ?? '10')
        const page = parseInt(isNaN(Number(searchParams.get('page'))) ? '1' : searchParams.get('page') ?? '1')

        const start = (page - 1) * limit
        const end = start + limit - 1

        const { data, error, count: totalChecks } = await supabase
            .from("checks")
            .select(`
        id,
        input_type,
        raw_input,
        file_url,
        extracted_content,
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
      `, { count: "exact" })
            .eq("user_id", userId)
            .order("created_at", { ascending: sort === 'asc' })
            .range(start, end)

        if (error) {
            return Response.json({ error: "Failed to fetch history" }, { status: 500 });
        }

        return Response.json({
            checks: data,
            totalChecks,
            currentPage: page,
            totalPages: Math.ceil((totalChecks ?? limit) / limit)
        });
    } catch {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
