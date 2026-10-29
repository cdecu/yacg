<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Project Guidelines (yacg)

## Stack

- Node 24 (CI), npm (install with `npm install --legacy-peer-deps`)
- Nx 24 (orchestrator only) - Angular 22.2 - TypeScript ~6.0 (Angular 22 requires `>=6.0 <6.1`, do not bump to 7)
- Vite+ (`vite-plus`, CLI `vp`) 1.4: Vitest (`vp test`), Oxlint (`vp lint`), Oxfmt (`vp fmt`), tsdown (`vp pack`); config in root `vite.config.ts` and per-project `vite.config.ts`
- Tailwind CSS 4 via `@tailwindcss/postcss` (`.postcssrc.json`); no `tailwind.config.js`
- No Jest, ESLint, Prettier, esbuild executors or SSR: do not reintroduce them

## Projects

- `apps/yacg-ng`: Angular app (standalone components, signals, `OnPush`, `@for`/`@if` control flow), builder `@angular/build`
- `apps/yacg-cmd`: Node CLI (yargs, cosmiconfig), built with `vp pack` to `dist/apps/yacg-cmd/main.js`, bundles `@yacg/core`
- `libs/core`: code generation library (Handlebars), built with `vp pack` (ESM + CJS + d.ts) to `dist/libs/core`

## Commands

- `npm exec nx run-many -t lint test build` - must pass before finishing a task
- `npm exec nx build yacg-ng`, `npm exec nx test core`, `npm run cmd`
- `npm run fmt` - format with Oxfmt

## Conventions

- Component styles are plain `.css` (never `.scss`: Tailwind 4 does not support preprocessors); use `@reference "../../styles.css";` before `@apply`
- Tests use explicit imports from `vite-plus/test`
- Nx targets for Vite+ tools are `nx:run-commands` with `cwd: "."`
