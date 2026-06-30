"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Usage {
  used: number;
  limit: number;
  remaining: number;
  isPro: boolean;
}

interface UsageContextType {
  usage: Usage | null;
  isLoading: boolean;
  refresh: () => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

async function fetchUsage(): Promise<Usage> {
  const res = await fetch("/api/usage");
  if (!res.ok) throw new Error("Failed to fetch usage");
  return res.json();
}

export default function UsageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: usage, isLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage,
  });

  const refresh = useCallback(() => {
    queryClient.refetchQueries({ queryKey: ["usage"] });
  }, [queryClient]);

  return (
    <UsageContext.Provider value={{ usage: usage ?? null, isLoading, refresh }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used within UsageProvider");
  return ctx;
}
