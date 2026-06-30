"use client";

import { toast } from "sonner";
import InputPanel from "@/components/fact-check/InputPanel";
import ResultsPanel from "@/components/fact-check/ResultsPanel";
import { FactCheckResult } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsage } from "@/providers/UsageProvider";
import { useState } from "react";
import UpgradeModal from "@/components/payments/UpgradeModal";
import { Crown } from "lucide-react";

function CheckPage() {
  const { usage, refresh } = useUsage();
  const queryClient = useQueryClient();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleFactCheck = async (formData: FormData) => {
    const inputType = formData.get("inputType") as string;
    const rawInput = formData.get("rawInput") as string | null;
    const file = formData.get("file") as File | null;

    if (inputType === "text" && !rawInput?.trim()) {
      throw new Error("Please enter some text to fact-check.");
    }
    if (inputType === "url" && !rawInput?.trim()) {
      throw new Error("Please enter a URL to fact-check.");
    }
    if ((inputType === "image" || inputType === "video") && !file) {
      throw new Error(`Please upload a ${inputType} file.`);
    }

    const res = await fetch("/api/fact-check", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (data?.upgradeRequired) {
        setUpgradeModalOpen(true);
      }
      throw new Error(data.error ?? "Something went wrong.");
    }

    return data;
  };

  const {
    mutate: factCheck,
    isPending,
    data,
  } = useMutation({
    mutationFn: handleFactCheck,
    onSuccess: (data) => {
      toast.success("Fact-check complete.");
      refresh();
      queryClient.refetchQueries({ queryKey: ["history"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const result = data?.result as FactCheckResult | null;

  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-7xl mx-auto px-6 pt-2 flex flex-wrap gap-2 items-center justify-between">
        <p className="text-xs font-mono text-muted">
          <span className="text-primary">
            {usage?.remaining ?? "—"}/{usage?.limit ?? "—"}
          </span>{" "}
          checks left today
        </p>
        {usage?.isPro ? (
          <p className="rounded-lg px-2 py-1 bg-accent/20 border border-accent/15 flex items-center justify-center gap-2 text-sm font-semibold">
            Pro <Crown size={15} />
          </p>
        ) : (
          <UpgradeModal
            open={upgradeModalOpen}
            setOpen={(open) => setUpgradeModalOpen(open)}
          />
        )}
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          <div className="w-full lg:w-105 lg:shrink-0">
            <InputPanel loading={isPending} onSubmit={factCheck} />
          </div>
          <div className="flex-1 min-w-0">
            <ResultsPanel loading={isPending} result={result} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CheckPage;
