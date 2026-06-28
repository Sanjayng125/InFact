import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);
        const supabase = createAdminClient();

        if (evt.type === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const full_name = `${first_name} ${last_name}`;

            const { error } = await supabase.from("users").insert({
                id,
                email: email_addresses[0].email_address,
                full_name: full_name ?? null,
                image_url: image_url ?? null,
            });

            if (error) return new Response("DB insert failed", { status: 500 });
        }

        if (evt.type === "user.updated") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const full_name = `${first_name} ${last_name}`;

            const { error } = await supabase.from("users").update({
                email: email_addresses[0].email_address,
                full_name: full_name ?? null,
                image_url: image_url ?? null,
                updated_at: new Date().toISOString(),
            }).eq("id", id);

            if (error) return new Response("DB update failed", { status: 500 });
        }

        if (evt.type === "user.deleted") {
            const { id } = evt.data;

            const { error } = await supabase.from("users").delete().eq("id", id);

            if (error) return new Response("DB delete failed", { status: 500 });
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}
