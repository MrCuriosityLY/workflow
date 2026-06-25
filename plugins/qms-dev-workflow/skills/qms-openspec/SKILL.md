---
name: qms-openspec
description: Use for QMS OpenSpec-style specification-driven changes: creating change proposals, tasks, design documents, requirement deltas, validating specs, archiving completed changes, or when the user mentions OpenSpec, specs, proposal, tasks, design.md, spec.md, or .openspec.
---

# QMS OpenSpec

Use this skill to manage specification-first QMS changes.

## Workflow

1. Identify the change ID in kebab-case.
2. Create or update `.openspec/changes/<change-id>/`.
3. Write `proposal.md`, `tasks.md`, `design.md`, and domain `spec.md` files.
4. Validate the spec manually or with an installed `openspec` CLI.
5. Treat approved specs as the source of truth for implementation.
6. After delivery, archive or fold durable decisions into `.dev-flow/memory/`.

## Read References

- Read `references/qms-openspec-template.md` when creating files.
- Read the active repository's `.openspec/project.md` if it exists.
- Read existing `.openspec/specs/` for affected domains before modifying behavior.

## Rules

- Specs must be behavior-oriented, not implementation-only.
- Every task must be actionable and verifiable.
- SQL, API, workflow, and compatibility impacts must be explicit.
- Do not invent acceptance criteria that contradict existing code or product memory.
- Do not mark tasks complete until verification has run.
