"use client";

import { useState } from "react";
import { Zap, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PLANS } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";

interface UpgradeModalProps {
  open?: boolean;
  setOpen: (o: boolean) => void;
}

export default function UpgradeModal({ open, setOpen }: UpgradeModalProps) {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleUpgradeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/payments/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to start checkout.");
      }

      return data;
    },
    onSuccess: (res) => {
      window.location.href = res?.checkoutUrl;
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog
      open={upgradeModalOpen || open}
      onOpenChange={(isOpen) => {
        setUpgradeModalOpen(isOpen);
        setOpen(isOpen);
      }}
    >
      <DialogTrigger className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-accent/8 border border-accent/20 text-accent hover:bg-accent/15 transition-colors">
        <Zap size={12} />
        Upgrade
      </DialogTrigger>

      <DialogContent
        className="bg-surface border-border-custom max-w-sm p-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="p-5 border-b border-border-custom">
          <DialogTitle className="flex items-center gap-2 text-sm font-mono font-medium text-primary">
            <div className="w-7 h-7 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            Upgrade to Pro
          </DialogTitle>
          <DialogClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={"rounded-lg bg-accent/8 border border-accent/15"}
              >
                <X className="text-accent" />
              </Button>
            }
            className={"absolute top-5 right-5"}
          />
        </DialogHeader>

        <div className="p-5">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-mono font-extrabold text-3xl tracking-tight text-primary">
              ₹899
            </span>
            <span className="text-sm text-muted">/month</span>
          </div>
          <p className="text-xs text-muted mb-5">
            Cancel anytime. No hidden fees.
          </p>

          <ul className="space-y-2.5 mb-6">
            {PLANS.pro.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-primary/80"
              >
                <Check size={13} className="text-accent shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            onClick={() => handleUpgradeMutation.mutate()}
            disabled={handleUpgradeMutation.isPending}
            className="w-full rounded-lg font-mono bg-accent text-background"
          >
            {handleUpgradeMutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Redirecting...
              </>
            ) : (
              "Upgrade now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
