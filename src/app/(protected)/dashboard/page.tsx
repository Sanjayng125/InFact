"use client";

import Link from "next/link";
import { Plus, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Check } from "@/types";
import HistoryCard from "@/components/dashboard/HistoryCard";
import { PaginationControls } from "@/components/data-fetching/PaginationControls";
import { useState } from "react";

export default function DashboardPage() {
  const [page, setPage] = useState(1);

  async function fetchHistory() {
    const res = await fetch(`/api/history?page=${page}&limit=10&sort=desc`);
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "Failed to fetch history");
    return data;
  }

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["history", page],
    queryFn: fetchHistory,
  });

  const checks = (data?.checks ?? []) as Check[];
  const totalChecks = data?.totalChecks || data?.checks.length || 0;
  const currentPage = data?.currentPage || 1;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <History size={16} className="text-muted" />
          <h1 className="text-sm font-mono text-muted">Check history</h1>
          {totalChecks > 0 && (
            <p className="text-sm text-muted">
              {" "}
              - {totalChecks} check{totalChecks !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {(isLoading || isFetching) && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-surface border border-border-custom animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="h-40 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border-custom">
            <p className="text-sm font-mono text-muted">
              Failed to load history
            </p>
            <p className="text-xs text-subtle mt-1">Please refresh the page</p>
          </div>
        )}

        {!isLoading && !isFetching && !isError && checks?.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border-custom">
            <History size={32} className="text-subtle mb-3" />
            <p className="text-sm font-mono text-muted">No checks yet</p>
            <p className="text-xs text-subtle mt-1 mb-4">
              Start fact-checking to see your history here
            </p>
            <Link
              href="/check"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-accent text-background hover:opacity-90 transition-opacity"
            >
              <Plus size={13} />
              New check
            </Link>
          </div>
        )}

        {!isLoading &&
          !isFetching &&
          !isError &&
          checks &&
          checks.length > 0 && (
            <>
              <div className="space-y-3">
                {checks.map((check) => (
                  <HistoryCard key={check.id} check={check} />
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                disabled={isLoading || isFetching}
              />
            </>
          )}
      </main>
    </div>
  );
}
