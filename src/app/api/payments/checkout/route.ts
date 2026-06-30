import { auth, currentUser } from "@clerk/nextjs/server";
import { checkoutRateLimit } from "@/lib/redis/ratelimit";
import { setupLemonSqueezy } from "@/lib/lemonsqueezy";
import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { success } = await checkoutRateLimit.limit(userId);
        if (!success) {
            return Response.json(
                { error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }

        setupLemonSqueezy();

        const supabase = createAdminClient();
        const { data: userData } = await supabase
            .from("users")
            .select("is_pro, email, full_name")
            .eq("id", userId)
            .single();

        if (userData?.is_pro) {
            return NextResponse.json({ error: "You are already a Pro user" }, { status: 400 });
        }

        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;
        const fullName = user?.fullName;

        const checkout = await createCheckout(
            process.env.LEMON_SQUEEZY_STORE_ID!,
            process.env.LEMON_SQUEEZY_VARIANT_ID!,
            {
                checkoutOptions: {
                    embed: false,
                    media: false,
                },
                checkoutData: {
                    email: email ?? userData?.email ?? "",
                    name: fullName ?? userData?.full_name ?? "",
                    custom: {
                        user_id: userId,
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/check`,
                    receiptButtonText: "Go to Dashboard",
                    receiptThankYouNote: "Thank you for upgrading to InFact Pro!",
                },
                expiresAt: new Date(new Date().getTime() + 1000 * 60 * 10).toISOString(), // 10 minutes
                testMode: process.env.LEMON_SQUEEZY_ENV === "production" ? false : true,
            }
        );

        const checkoutUrl = checkout.data?.data.attributes.url;
        if (!checkoutUrl) throw new Error("Failed to create checkout URL");

        return Response.json({ checkoutUrl });
    } catch (err) {
        console.error("Checkout error:", err);
        return Response.json({ error: "Failed to create checkout" }, { status: 500 });
    }
}