import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export interface TavilyResult {
    title: string;
    url: string;
    content: string;
    score: number;
}

export interface TavilyExtractResult {
    url: string;
    rawContent: string;
}

export async function tavilySearch(
    query: string,
    topic: "general" | "news" | "finance" = "general"
): Promise<TavilyResult[]> {
    const response = await tvly.search(query, {
        searchDepth: "advanced",
        maxResults: 5,
        chunksPerSource: 3,
        topic,
    });

    return response?.results?.map((r) => ({
        title: r?.title,
        url: r?.url,
        content: r?.content,
        score: r?.score,
    }));
}

export async function tavilyExtract(
    urls: string[],
    query?: string
): Promise<TavilyExtractResult[]> {
    const response = await tvly.extract(urls, {
        extractDepth: "advanced",
        format: "markdown",
        ...(query && { query, chunksPerSource: 5 }),
    });

    return response?.results?.map((r) => ({
        url: r?.url,
        rawContent: r?.rawContent,
    }));
}
