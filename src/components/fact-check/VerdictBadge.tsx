import { Verdict } from "@/types";
import { VERDICT_CONFIG } from "@/lib/ui/config";

export default function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const config = VERDICT_CONFIG[verdict];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${config.textColor} ${config.bg} ${config.border}`}
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
}
