export function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export const truncate = (s: string, n = 80) =>
    (s.length > n ? s.slice(0, n) + "..." : s);
