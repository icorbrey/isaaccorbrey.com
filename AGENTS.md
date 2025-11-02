# AGENTS Handbook

A living field guide for working inside this repository. Read it before you cut
code, keep it handy while you iterate, and update it the moment a maintainer
asks you to "remember" something.

---

## 1. Project Topography

- `src/pages` – Route entrypoints (Astro + Svelte islands)
- `src/layouts` – Shared shells and page chrome
- `src/components` – Feature UI; prefer PascalCase filenames
- `src/content` – Markdown collections
- `src/utils`, `src/stores` – Helpers and shared state (camelCase exports)
- `src/tapes` – VHS demo scripts
- `public/` – Static assets
- `astro.config.mjs`, `tailwind.config.mjs` – Global configuration

Keep naming consistent: directories in kebab-case, components in PascalCase,
stores in camelCase.

---

## 2. Build & Development Loop

| Task                | Command                                       | Notes               |
|---------------------|-----------------------------------------------|---------------------|
| Install             | `pnpm install`                                | Repo uses Node 20   |
| Dev server          | `pnpm run dev` (alias: `pnpm run start`)      |                     |
| Type/frontmatter    | `pnpm run build` (runs `astro check` + build) |                     |
| Preview build       | `pnpm run preview`                            | Serves from `dist/` |
| Astro tooling       | `pnpm run astro -- <cmd>`                     | e.g., `sync`        |

`dist/`, `.netlify/`, `.astro/`, `.cache/`, `public/demos/`, and `node_modules/`
stay untracked.

---

## 3. Jujutsu Workflow Essentials

### 3.1 Daily Habits

1. `jj git fetch --remote origin`
2. Inspect stack: `jj status`, `jj log -r 'trunk()..@'`
3. Bookmark active change: `jj bookmark set icorbrey/<topic> -r @`
4. Start new work from trunk: `jj new trunk() -m "area: Subject"`

Subjects are `<area>: <Topic>` with a lowercase area and capitalized topic.

### 3.2 Commit Hygiene

- Prefer TypeScript and two-space indentation in `.astro`, `.ts`, `.svelte`
- Keep each change tightly scoped; if you typo inside an existing idea, run
  `jj absorb` or `jj squash -r @` before stacking new commits.
- Review diffs with `jj diff` or `jj diff -r @-..@` before you move on.

### 3.3 Managing Megamerges

- Always work **under** the repository megamerge (look for the merge commit
  named `merge` or `megamerge`—it is typically the lone merge node in the
  workspace). The stack should read `megamerge → docs/help commits → feature
  work`.
- Use `jj log -r 'change_id(<id>)'` prior to restacking to confirm there is only
  a single revision for that change ID.
- `jj stage`/`jj stack` move work from the WIP zone (megamerge descendants) into
  the submission zone between `trunk()` and the megamerge. Run them only when
  you are ready to publish. Any other heavy alias is **last resort**—double
  check restacking is required and that you are not duplicating commits.
- When parallelizing several commits, use `jj parallelize` only for genuinely
  divergent work streams. Otherwise keep the history linear and fold tweaks
  back with `jj absorb` (default behavior) or explicitly target the move with
  `jj squash -f <from> -t <into>` when you know the exact commit pair.

### 3.4 Undo & Cleanup

- Misstep? Immediately undo with `jj undo` / `jj op revert`.
- If duplicate commits appear, abandon the stray one (`jj abandon <commit_id>`)
  instead of layering new fixes.
- For stuck restacks, `jj restore --from <clean_commit> <paths>` is safer than
  mass rebases.

---

## 4. Coding & Style Norms

- Tailwind powers most styling; extract shared CSS only when duplication justifies
  a file in `src/styles`.
- Svelte/TypeScript components should export typed props and keep logic inside
  modules rather than inline scripts when possible.
- Keep demos (`src/tapes`) reproducible; avoid hard-coded timestamps unless the
  VHS script manages them.

---

## 5. Testing & Validation

- `pnpm run build` → runs `astro check` plus the production build.
- If you skip the build, at least run `pnpm run astro -- check` manually.
- No automated browser suite; smoke test `/`, `/notes`, `/tags/{tag}` in a real
  browser when you change layouts or routing.
- New helpers in `src/utils` must ship with Vitest coverage.

---

## 6. Maintainer Expectations

- Update this handbook the moment a maintainer says "remember" (put instructions
  here so future work follows them).
- Keep change history in clean, well-scoped commits.
- When stacking under the megamerge, format subjects as `<area>: <Topic>`.
- Fold tweaks with `jj absorb` (default) or `jj squash -f <from> -t <into>` when
  you know the exact commit pair; avoid spawning parallel commits unnecessarily.
- Inspect change IDs before running heavy restack helpers; do not create duplicate
  revisions of the same change.
- If you generate unnecessary conflicts or duplicate parents, unwind immediately
  with `jj undo`, `jj op revert`, or `jj abandon` before proceeding.
- When you modify tapes, run `just render` locally and commit the resulting
  `public/demos/**` assets so Netlify can serve them without rebuilding.

---

## 7. Quick JJ Reference

| Intent                         | Command |
|--------------------------------|---------|
| Snapshot working copy          | `jj status` |
| Inspect stack                  | `jj log -r 'trunk()..@'` |
| Create change atop trunk       | `jj new trunk() -m "area: Topic"` |
| Fold fixups into current commit| `jj absorb` (or `jj squash -r @`) |
| Rebase stack onto trunk        | `jj rebase -r @ -d trunk()` |
| Split staged work              | `jj split -r @` |
| Abandon stray commit           | `jj abandon <commit_id>` |
| Undo last operation            | `jj op log -n 5` (inspect) → `jj op revert <id>` |

---

## 8. When in Doubt

- Stop and inspect: `jj`, `jj log`, `jj file show` keep you grounded.
- Make changes incremental; big jumps without checkpoints are a recipe for
  divergent stacks.
- Document every new rule of thumb here so the next pass goes smoother.
