"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import VerdictBadge from "./VerdictBadge";
import ConfidenceBar from "./ConfidenceBar";
import { Claim } from "@/types";

export default function ClaimCard({ claim }: { claim: Claim }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl bg-surface border border-border-custom overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-sm leading-relaxed text-primary/90 flex-1">
            {claim.claim_text}
          </p>
          <VerdictBadge verdict={claim.verdict} />
        </div>
        <ConfidenceBar value={claim.confidence} verdict={claim.verdict} />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border-custom text-xs text-muted hover:text-primary hover:bg-white/3 transition-colors"
      >
        <span className="font-mono">
          {expanded ? "Hide" : "Show"} reasoning + {claim.sources.length} source
          {claim.sources.length !== 1 ? "s" : ""}
        </span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border-custom">
          <p className="text-sm leading-relaxed text-muted mt-4 mb-4">
            {claim.reasoning}
          </p>
          <div className="space-y-2">
            {claim.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border-custom hover:border-accent/30 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-primary/80 group-hover:text-accent transition-colors truncate">
                    {source.title}
                  </p>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    {source.snippet}
                  </p>
                </div>
                <ExternalLink
                  size={12}
                  className="text-subtle group-hover:text-accent transition-colors mt-0.5 shrink-0"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
