import { tavilySearch, tavilyExtract } from "@/lib/tavily";
import { SearchWebArgs, ExtractUrlArgs } from "@/types";

export async function executeTool(
    name: string,
    args: SearchWebArgs | ExtractUrlArgs
): Promise<string> {
    try {
        if (name === "search_web") {
            const { query, topic } = args as SearchWebArgs;
            const results = await tavilySearch(query, topic);

            if (results.length === 0) return "No results found for this query.";

            return results
                .map(
                    (r, i) =>
                        `[${i + 1}] ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`
                )
                .join("\n---\n");
        }

        if (name === "extract_url") {
            const { urls, query } = args as ExtractUrlArgs;
            const results = await tavilyExtract(urls, query);

            if (results.length === 0) return "Could not extract content from URLs.";

            return results
                .map((r) => `URL: ${r.url}\nContent:\n${r.rawContent}`)
                .join("\n\n---\n\n");
        }

        return "Unknown tool.";
    } catch (err) {
        return `Tool execution failed: ${err instanceof Error ? err.message : "Unknown error"}`;
    }
}
