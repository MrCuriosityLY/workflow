# QMS Codex Workflow Plugin

This repository is a Codex plugin marketplace for QMS development workflows.

## Editing Rules

- Keep skill frontmatter concise and trigger-focused.
- Keep `SKILL.md` files under 500 lines where possible.
- Put project conventions, examples, and long process details in `references/`.
- Do not add placeholder TODO implementations or fake validation.
- Validate every changed skill with `skill-creator/scripts/quick_validate.py`.
- Validate the plugin with `plugin-creator/scripts/validate_plugin.py`.

## Layout

- `.agents/plugins/marketplace.json`: marketplace catalog entry.
- `plugins/qms-dev-workflow`: installable Codex plugin.
- `plugins/qms-dev-workflow/skills/qms-dev-flow`: main QMS workflow.
- `plugins/qms-dev-workflow/skills/qms-openspec`: OpenSpec-style change/spec lifecycle.
- `plugins/qms-dev-workflow/skills/qms-sql-full`: SQL/full.sql synchronization rule.
