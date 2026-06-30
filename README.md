# inFact

AI-powered fact-checking SaaS that verifies claims from text, URLs, images, and videos using an agentic Gemini function-calling pipeline.

## Overview

inFact lets a user paste a claim, share a URL, or upload a screenshot/video, and returns a verdict (`true` / `false` / `misleading` / `unverified`) for each claim found, backed by cited sources. The core of the project is a raw agentic loop built directly on Gemini's function calling, with no framework abstraction — the agent decides what to search, when to search again, and when it has enough evidence to form a verdict.

## How it works

1. Input is normalized to text — typed claims are used directly, URLs are extracted via Tavily, images are read with Gemini vision, and videos are transcribed with Gemini's native audio understanding.
2. The text is handed to the agent loop along with two tools: `search_web` and `extract_url`.
3. Gemini decides which tool to call and with what query, the tool executes, and the result is fed back to Gemini. This repeats until Gemini has cross-referenced enough sources.
4. Gemini returns a structured JSON verdict per claim, which is parsed, stored, and rendered with confidence scores and source citations.

## Tech stack

- **Framework** — Next.js (App Router), TypeScript, Tailwind CSS
- **Auth** — Clerk
- **Database & Storage** — Supabase (private bucket + signed URLs)
- **AI** — Gemini (multimodal: vision, audio, function calling)
- **Web search/extract** — Tavily
- **Rate limiting & usage quotas** — Upstash Redis
- **Payments** — Lemon Squeezy (checkout + webhook-driven subscription state)
- **State management** — TanStack Query
- **UI** — shadcn/ui, Sonner, lucide-react

## Features

- Multi-input fact-checking: text, URL, image, video
- Agentic verification loop with multi-source cross-referencing
- Confidence-scored verdicts with full reasoning and cited sources
- Check history per user
- Free / Pro tiers with daily quota enforcement (Redis-tracked, Supabase-defined limits)
- Subscription upgrade flow via Lemon Squeezy, kept in sync via signed webhooks

## Getting started

Create a `.env` with the following:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# Gemini
GEMINI_API_KEY=
# Tavily
TAVILY_API_KEY=
# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_VARIANT_ID=
LEMON_SQUEEZY_WEBHOOK_SECRET=
LEMON_SQUEEZY_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
pnpm install
pnpm dev
```
