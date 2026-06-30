import { Verdict } from "@/types";
import { FileText, ImageIcon, LinkIcon, Video, AlertTriangle, CheckCircle2, HelpCircle, XCircle } from "lucide-react";

export const INPUT_TYPE_CONFIG: Record<
    string,
    { label: string; icon: React.ElementType }
> = {
    text: { label: "Text", icon: FileText },
    url: { label: "URL", icon: LinkIcon },
    image: { label: "Image", icon: ImageIcon },
    video: { label: "Video", icon: Video },
};

export const CTA_CONFIG: Record<string, { href: string; label: string }> = {
    "/": { href: "/check", label: "Open app" },
    "/check": { href: "/dashboard", label: "Dashboard" },
    "/dashboard": { href: "/check", label: "New check" },
};

export const VERDICT_CONFIG: Record<
    Verdict,
    {
        label: string;
        textColor: string;
        bg: string;
        border: string;
        icon: React.ElementType;
    }
> = {
    true: {
        label: "True",
        textColor: "text-accent",
        bg: "bg-accent/8",
        border: "border-accent/20",
        icon: CheckCircle2,
    },
    false: {
        label: "False",
        textColor: "text-red-400",
        bg: "bg-red-400/8",
        border: "border-red-400/20",
        icon: XCircle,
    },
    misleading: {
        label: "Misleading",
        textColor: "text-orange-400",
        bg: "bg-orange-400/8",
        border: "border-orange-400/20",
        icon: AlertTriangle,
    },
    unverified: {
        label: "Unverified",
        textColor: "text-slate-400",
        bg: "bg-slate-400/8",
        border: "border-slate-400/20",
        icon: HelpCircle,
    },
};

export const BAR_COLOR: Record<Verdict, string> = {
    true: "bg-accent",
    false: "bg-red-400",
    misleading: "bg-orange-400",
    unverified: "bg-slate-400",
};
