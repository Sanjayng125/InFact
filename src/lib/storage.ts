import { createAdminClient } from "@/lib/supabase";

export async function uploadToStorage(
    file: File,
    userId: string
): Promise<string> {
    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const filePath = `${userId}/${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { error } = await supabase.storage
        .from("infact-uploads")
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
        });

    if (error) throw new Error("Upload failed");

    return filePath;
}

export async function getSignedUrl(filePath: string): Promise<string> {
    const supabase = createAdminClient();

    const { data, error } = await supabase.storage
        .from("infact-uploads")
        .createSignedUrl(filePath, 60 * 60 * 24);

    if (error || !data) throw new Error("Failed to generate signed URL");

    return data.signedUrl;
}
