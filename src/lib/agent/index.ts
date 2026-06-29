import { geminiModel } from "@/lib/gemini";
import { executeTool } from "./tools";
import { SYSTEM_PROMPT } from "./prompts";
import { FactCheckResult } from "@/types";
import { SchemaType } from "@google/generative-ai";

export async function runFactCheckAgent(
    input: string
): Promise<FactCheckResult> {
    const chat = geminiModel.startChat({
        systemInstruction: {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
        },
        tools: [{
            functionDeclarations: [{
                name: "search_web",
                description:
                    "Search the web for information about a claim. Use this multiple times with different queries to gather evidence from multiple angles.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: "The search query to find information about the claim",
                        },
                        topic: {
                            type: SchemaType.STRING,
                            enum: ["general", "news", "finance"],
                            format: "enum",
                            description:
                                "Use 'news' for recent events, politics, sports. Use 'general' for everything else. can use 'finance' for stocks, crypto, and more.",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "extract_url",
                description: "Extract the full content from one or more URLs. Use this when the user provides a URL to fact-check, or when you want to read a specific source in depth.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        urls: {
                            type: SchemaType.ARRAY,
                            items: { type: SchemaType.STRING },
                            description: "List of URLs to extract content from",
                        },
                        query: {
                            type: SchemaType.STRING,
                            description:
                                "Optional query to rerank extracted chunks by relevance",
                        },
                    },
                    required: ["urls"]
                }
            }
            ]
        }],
    });

    let response = await chat.sendMessage(input);

    while (true) {
        const candidate = response.response.candidates?.[0];
        if (!candidate) throw new Error("No response from Gemini");

        const parts = candidate.content.parts;
        const toolCalls = parts.filter((p) => p.functionCall);

        if (toolCalls.length === 0) {
            const text = parts.find((p) => p.text)?.text ?? "";

            try {
                const clean = text.replace(/```json|```/g, "").trim();
                return JSON.parse(clean) as FactCheckResult;
            } catch {
                throw new Error("Failed to parse agent response as JSON");
            }
        }

        const toolResults = await Promise.all(
            toolCalls.map(async (part) => {
                const { name, args } = part.functionCall!;
                const result = await executeTool(name, args as any);

                return {
                    functionResponse: {
                        name,
                        response: { content: result },
                    },
                };
            })
        );

        response = await chat.sendMessage(toolResults);
    }
}