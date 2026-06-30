export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 45 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const PRICING = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
            "5 fact-checks per day",
            "Text & URL inputs",
            "Image uploads",
            "Source citations",
        ],
        cta: "Get started free",
        href: "/sign-up",
        highlighted: false,
    },
    {
        name: "Pro",
        price: "$9",
        period: "per month",
        features: [
            "50 fact-checks per day",
            "All input types",
            "Video transcription",
            "Priority processing",
            "Full check history",
        ],
        cta: "Upgrade to Pro",
        href: "/sign-up",
        highlighted: true,
    },
];

export const DEMO_CLAIMS = [
    {
        claim: "The Eiffel Tower is located in London, England.",
        verdict: "false" as const,
        confidence: 100,
        reasoning:
            "The Eiffel Tower is located in Paris, France — not London. It was built in 1889 and stands on the Champ de Mars.",
        source: "britannica.com",
    },
    {
        claim: "NASA's Artemis program aims to return humans to the Moon.",
        verdict: "true" as const,
        confidence: 98,
        reasoning:
            "NASA's Artemis program is specifically designed to land the first woman and next man on the Moon, confirmed by multiple official NASA sources.",
        source: "nasa.gov",
    },
    {
        claim: "Coffee is the most consumed beverage in the world.",
        verdict: "misleading" as const,
        confidence: 78,
        reasoning:
            "Water and tea are consumed more globally. Coffee ranks third. The claim is misleading without proper context.",
        source: "worldatlas.com",
    },
];
