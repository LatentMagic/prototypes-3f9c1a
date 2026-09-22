---
name: future-fragility
description: Stress-test current work against future failure — the likeliest reason it breaks in three months. Declared, not auto-invoked.
argument-hint: "[optional target, e.g. the auth flow]"
metadata:
  version: '1.0.0'
  author: LatentMagic
---

# future-fragility

Look hard at the current work — or, if `$ARGUMENTS` is set, at: $ARGUMENTS — and answer:

**If this breaks three months from now, what is the most likely reason?**

Reason from how it actually fails over time, not how it looks today: hidden coupling, unstated assumptions, load or scale, edge cases skipped, things that rot as the surrounding code changes. Name the 2–3 most probable failure modes, most likely first. For each, say what would prevent it, and point at the specific line, decision, or gap.
