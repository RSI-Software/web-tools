# External tools

This directory holds external tools that are wired into the dashboard but
maintained as their own repositories. They are pulled in as **git submodules**
and can be any framework (Next.js, Vite, Astro, plain SPA, etc.).

The dashboard does **not** import code from external tools. It only links
out to the external's dev URL (or prod URL).

## URL model

Each external owns its origin:

- dev: `https://<subdomain>.web-tools.localhost/`
- prod: `https://<subdomain>.donjor.net/` (flat — Cloudflare Free Universal
  SSL only covers 1-level wildcards; bases live in `urls.config.ts`)

In a worktree, externals are namespaced the same way as the host:
`https://<subdomain>.<branch>.web-tools.localhost/`. Each worktree gets its
own instances so the dashboard links route locally; ports are offset by a
branch-deterministic hash so checkouts don't collide.

## Add a new external tool

```bash
# 1. Add the submodule
git submodule add <repo-url> apps/external/<slug>

# 2. Pick a port the external will bind to. You'll declare the launch command
#    explicitly in step 4 — the submodule's own `dev` script is not invoked.
```

```ts
// 3. tools.config.ts — add an entry:
{
  slug: "<slug>",
  title: "<Title>",
  description: "<one-line description>",
  icon: "<LucideIconName>",
  kind: "external",
  subdomain: "<subdomain>",          // becomes <subdomain>.web-tools.localhost in dev
  repo: "<repo-url>",                // documentary
  tags: ["<optional>"],
}
```

```toml
# 4. Create scripts/externals/<slug>.toml:
#
#   port = <port>                            # what the dev command binds to
#   dev  = "<launch cmd with {PORT}>"        # e.g. bunx vite --port {PORT}
#                                            #      next dev -p {PORT}
#                                            #      astro dev --port {PORT}
#
# Slug = filename. Directory is conventional (apps/external/<slug>).
# scripts/dev.sh (orchestrator) and scripts/postinstall.sh (deps installer)
# auto-discover every toml under scripts/externals/.
```

```bash
# 5. From the repo root:
bun install           # root postinstall installs the submodule's deps too
bun run dev           # host + every external (worktrees too, branch-namespaced)
```

The external is now reachable at `https://<subdomain>.web-tools.localhost/`,
and the dashboard card opens it in a new tab.

## Conventions

- External submodules are **independent**. Their `package.json`, lockfile,
  and node_modules are theirs. No workspace linking required.
- The launch command lives in `scripts/externals/<slug>.toml` (`dev` field
  with `{PORT}` substituted at start). That's authoritative — the
  submodule's own `dev` script is not invoked. This keeps the orchestrator
  framework-agnostic and lets worktrees override the port without touching
  the submodule.
- If you want to share UI between the host and an external, copy the
  needed bits into the external — don't symlink across the submodule
  boundary.
- Each external should have its own README explaining how to develop it
  standalone (outside web-tools).
