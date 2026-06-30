"use client";

import { CTA_CONFIG } from "@/lib/ui/config";
import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border-custom">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono font-extrabold text-lg tracking-tight"
        >
          in<span className="text-accent">Fact</span>
        </Link>
        <div className="flex items-center gap-3">
          <Show when={"signed-out"}>
            <Link
              href="/sign-in"
              className="text-sm text-muted hover:text-primary transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm px-3 py-1.5 rounded-lg font-medium bg-accent text-background hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </Show>
          <Show when={"signed-in"}>
            {CTA_CONFIG[pathname] && (
              <Link
                href={CTA_CONFIG[pathname].href}
                className="text-sm px-3 py-1.5 rounded-lg font-medium bg-accent text-background hover:opacity-90 transition-opacity"
              >
                {CTA_CONFIG[pathname].label}
              </Link>
            )}

            <div className="rounded-full border-2 border-accent flex items-center justify-center">
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}

export default Header;
