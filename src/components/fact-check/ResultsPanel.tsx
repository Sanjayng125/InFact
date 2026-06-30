import { ShieldCheck, Loader2 } from "lucide-react";
import ClaimCard from "./ClaimCard";
import { FactCheckResult } from "@/types";

interface ResultsPanelProps {
  loading: boolean;
  result: FactCheckResult | null;
}

export default function ResultsPanel({ loading, result }: ResultsPanelProps) {
  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border-custom">
        <Loader2 size={28} className="text-accent animate-spin mb-3" />
        <p className="text-sm font-mono text-primary">Agent is searching...</p>
        <p className="text-xs text-muted mt-1">
          This may take 15&ndash;30 seconds
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border-custom">
        <ShieldCheck size={32} className="text-subtle mb-3" />
        <p className="text-sm font-mono text-muted">Results will appear here</p>
        <p className="text-xs text-subtle mt-1">
          Submit a claim to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <p className="text-xs font-mono text-muted">
          {result.claims.length} claim{result.claims.length !== 1 ? "s" : ""}{" "}
          verified
        </p>
      </div>
      {result.claims.map((claim, i) => (
        <ClaimCard key={i} claim={claim} />
      ))}
    </div>
  );
}
