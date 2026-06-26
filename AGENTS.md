# QMS Agent Workflow Package

This repository packages reusable QMS development workflows for multiple coding
agents. The generic workflow is plain Markdown under `workflows/`, while the
Codex plugin under `plugins/` is an optional adapter.

## Editing Rules

- Keep skill frontmatter concise and trigger-focused.
- Keep `SKILL.md` files under 500 lines where possible.
- Put project conventions, examples, and long process details in `references/`.
- Do not add placeholder TODO implementations or fake validation.
- Validate every changed skill with `skill-creator/scripts/quick_validate.py`.
- Validate the plugin with `plugin-creator/scripts/validate_plugin.py`.

## Layout

- `workflows/qms-dev-workflow`: generic Markdown workflow for coding agents.
- `.agents/plugins/marketplace.json`: optional Codex marketplace catalog entry.
- `plugins/qms-dev-workflow`: optional installable Codex plugin adapter.
- `plugins/qms-dev-workflow/skills/qms-dev-flow`: Codex skill adapter for the main QMS workflow.
- `plugins/qms-dev-workflow/skills/qms-openspec`: Codex skill adapter for OpenSpec-style change/spec lifecycle.
- `plugins/qms-dev-workflow/skills/qms-sql-full`: Codex skill adapter for SQL/full.sql synchronization.
