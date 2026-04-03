# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server at localhost:3000
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Stack

- **Next.js 16** with App Router (TypeScript)
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css` and PostCSS
- **React 19**
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`

## Architecture

This is a minimal Next.js App Router project. All routes live under `app/`:

- `app/layout.tsx` — root layout, sets up fonts and global metadata
- `app/page.tsx` — home page (`/`)
- `app/globals.css` — Tailwind import + CSS custom properties for `--background` / `--foreground` with dark mode via `prefers-color-scheme`

Tailwind v4 uses the `@theme inline` block in `globals.css` to map design tokens (colors, fonts) to utility classes — no `tailwind.config.js` needed.
