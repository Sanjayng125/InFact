"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import VerdictBadge from "@/components/fact-check/VerdictBadge";
import ClaimCard from "@/components/fact-check/ClaimCard";
import { Check, Verdict } from "@/types";
import { formatDate, truncate } from "@/utils";
import { INPUT_TYPE_CONFIG } from "@/lib/ui/config";

export default function HistoryCard({ check }: { check: Check }) {
  const [expanded, setExpanded] = useState(false);
  const config = INPUT_TYPE_CONFIG[check.input_type] ?? INPUT_TYPE_CONFIG.text;
  const Icon = config.icon;

  const verdictCounts = check.claims.reduce(
    (acc, claim) => {
      acc[claim.verdict] = (acc[claim.verdict] ?? 0) + 1;
      return acc;
    },
    {} as Record<Verdict, number>,
  );

  return (
    <div className="rounded-xl bg-surface border border-border-custom overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={13} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono text-muted mb-1">
                {config.label}
              </p>
              <p className="text-sm text-primary/80 truncate max-w-xs">
                {truncate(
                  check?.raw_input
                    ? check.raw_input
                    : check?.file_url
                      ? (check.extracted_content ?? "Uploaded file")
                      : "-",
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-subtle shrink-0">
            <Clock size={11} />
            {formatDate(check.created_at)}
          </div>
        </div>

        {check.claims.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.entries(verdictCounts) as [Verdict, number][]).map(
              ([verdict, count]) => (
                <div key={verdict} className="flex items-center gap-1">
                  <VerdictBadge verdict={verdict} />
                  <span className="text-xs font-mono text-muted">×{count}</span>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {check.claims.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border-custom text-xs text-muted hover:text-primary hover:bg-white/3 transition-colors"
        >
          <span className="font-mono">
            {expanded ? "Hide" : "View"} {check.claims.length} claim
            {check.claims.length !== 1 ? "s" : ""}
          </span>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      )}

      {expanded && (
        <div className="p-4 border-t border-border-custom space-y-3">
          {check.claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
}
