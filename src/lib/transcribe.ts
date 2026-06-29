import { geminiModel } from "@/lib/gemini";

export async function transcribeVideo(
    fileBuffer: ArrayBuffer,
    mimeType: string
): Promise<string> {
    const base64 = Buffer.from(fileBuffer).toString("base64");

    const result = await geminiModel.generateContent([
        {
            inlineData: {
                mimeType,
                data: base64,
            },
        },
        {
            text: "Transcribe all spoken content in this video accurately. Return only the transcription, no extra commentary.",
        },
    ]);

    return result.response.text();
}

export async function extractTextFromImage(
    fileBuffer: ArrayBuffer,
    mimeType: string
): Promise<string> {
    const base64 = Buffer.from(fileBuffer).toString("base64");

    const result = await geminiModel.generateContent([
        {
            inlineData: {
                mimeType,
                data: base64,
            },
        },
        {
            text: "Extract all text and factual claims visible in this image. Return only the extracted content, no extra commentary.",
        },
    ]);

    return result.response.text();
}
