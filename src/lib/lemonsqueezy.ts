import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function setupLemonSqueezy() {
    const requiredVars = [
        'LEMON_SQUEEZY_API_KEY',
        'LEMON_SQUEEZY_STORE_ID',
        'LEMON_SQUEEZY_VARIANT_ID',
        'LEMON_SQUEEZY_WEBHOOK_SECRET',
    ]

    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required LEMON SQUEEZY env variables: ${missingVars.join(
                ', '
            )}. Please, set them in your .env file.`
        )
    }

    lemonSqueezySetup({
        apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
        onError: (error) => {
            console.error("LemonSqueezy error:", error)
            throw error;
        },
    });
}
