export type InputType = "text" | "url" | "image" | "video";

export type Verdict = "true" | "false" | "misleading" | "unverified";

export interface Source {
    title: string;
    url: string;
    snippet: string;
}

export interface Claim {
    claim_text: string;
    verdict: Verdict;
    confidence: number;
    reasoning: string;
    sources: Source[];
}

export interface FactCheckResult {
    claims: Claim[];
}

export interface SearchWebArgs {
    query: string;
    topic?: "general" | "news" | "finance";
}

export interface ExtractUrlArgs {
    urls: string[];
    query?: string;
}
