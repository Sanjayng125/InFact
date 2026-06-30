import { BAR_COLOR } from "@/lib/ui/config";
import { Verdict } from "@/types";

export default function ConfidenceBar({
  value,
  verdict,
}: {
  value: number;
  verdict: Verdict;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${BAR_COLOR[verdict]}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-xs text-subtle">{value}%</span>
    </div>
  );
}
