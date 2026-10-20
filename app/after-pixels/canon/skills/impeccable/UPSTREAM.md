# Upstream: Impeccable

- **Source repo:** https://github.com/pbakaus/impeccable (author Paul Bakaus; homepage https://impeccable.style)
- **Version:** 4.5.0 (`version: 4.5.0` in upstream's `SKILL.md` frontmatter)
- **Taken:** 2026-10-06, from the installed plugin's cache, `~/.claude/plugins/cache/impeccable/impeccable/4.5.0/skills/impeccable/`. The cache is built output and carries no commit id, so no commit is recorded; the version is the pin.
- **Licence:** Apache 2.0, in `LICENSE` here (identical to the repo's `LICENSE` on its default branch, checked 2026-10-06). Third-party notice in `NOTICE.md`: `reference/ios.md` and `reference/android.md` are distilled from `ehmo/platform-design-skills` (MIT), whose licence text is in `LICENSE-ehmo-platform-design-skills-MIT`. `NOTICE.md` is copied from the repo, the same check.
- **Changes made to upstream's files:** none. `SKILL.md` and every file under `reference/` are byte-identical to the 4.5.0 originals, under upstream's own names (`reference/`, not `references/`). The only changes are omissions, listed below. The files added beside them are `LICENSE`, `NOTICE.md`, `LICENSE-ehmo-platform-design-skills-MIT` and this file.

LatentMagic's own text for this skill is not in this folder. It is in `../impeccable-local/SKILL.md`, which the agent reads first.

## Files omitted, and why

Upstream's `SKILL.md` and several kept references still link to the omitted files; those links dangle here by design, and the adapter says what to do instead.

Whole directory:

- `scripts/` (every file: `impeccable`, `impeccable.cmd`, `VERSION`, `command-metadata.json`, `live-browser.js`, `live-browser-dom.js`, `live-browser-ignores.js`, `live-browser-session.js`, `modern-screenshot.umd.js`, `data/font-index.json`, `data/font-index-failures.json`): only works by executing (a launcher binary, a browser overlay). About 1.7 MB.

Under `reference/`, each needs the CLI, the hooks, a browser, or the `.impeccable/` state they manage:

- `init.md` — writes upstream's own `PRODUCT.md` through the CLI.
- `document.md` — writes `DESIGN.md` through the CLI.
- `doctor.md` — repairs drift between upstream's own artifacts and the version.
- `hooks.md` — manages the design detector hook.
- `live.md`, `live-setup.md`, `generate.md` — the live browser overlay and its helper.
- `routing.md` — the no-argument menu, which is built from CLI context.
- `component-review.md`, `region-map.md`, `visualize.md` — comp capture, `.impeccable/` manifests and image generation; little but script and image steps remains in them.
- `degraded/asset-producer.md`, `degraded/documenter.md`, `degraded/finish-reviewer.md`, `degraded/manual-edit-applier.md` — briefs for sub-agents that assume the CLI.

Outside `skills/impeccable/` in the plugin, not taken at all: `agents/` (four sub-agent definitions), `hooks/hooks.json`, `.claude-plugin/plugin.json`, `.grok-plugin/plugin.json`. Hooks and sub-agents do not run in Claude Design.

Kept although several steps in them call a script (`detect`, `critique-storage`, `concept-seed`, `build-phase`, `generate-image`, `comp-spec`): `audit.native.md`, `layout.md`, `mode-operate.md`, `mode-persuade.md`, `mode-read.md`, `critique.md`, `polish.md`, `new-work.md`, `typeset.md`. They still work as text; the adapter says to skip the script steps.

## Refresh

1. Update the installed plugin (or pull `pbakaus/impeccable`) to the version to take.
2. Replace `SKILL.md` and `reference/` here from the new version's `skills/impeccable/`, then delete the omitted set above (and any file the new version adds that only works by executing).
3. Compare the new `SKILL.md`'s Setup, Routing and Commands against what `../impeccable-local/SKILL.md` assumes; update the adapter, not upstream's file.
4. Check the new version's `NOTICE.md` and `LICENSE` against the copies here.
5. Run `diff -rq` between this folder's `SKILL.md` and `reference/` and the source: only the omitted files may differ.
6. Update the version and date in this file.
