import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import UsageProvider from "@/providers/UsageProvider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "InFact",
  description: "AI-powered fact checking - check if it's in-fact true or false",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"}>
      <html lang="en">
        <body
          className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
        >
          <QueryProvider>
            <UsageProvider>
              <Header />
              {children}
            </UsageProvider>
          </QueryProvider>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
