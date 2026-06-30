export type InputType = "text" | "url" | "image" | "video";

export type Verdict = "true" | "false" | "misleading" | "unverified";

export interface Check {
    id: string;
    input_type: string;
    raw_input: string | null;
    file_url: string | null;
    extracted_content: string | null;
    created_at: string;
    claims: Claim[];
}

export interface Claim {
    id: string;
    claim_text: string;
    verdict: Verdict;
    confidence: number;
    reasoning: string;
    sources: Source[];
}

export interface Source {
    title: string;
    url: string;
    snippet: string;
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
