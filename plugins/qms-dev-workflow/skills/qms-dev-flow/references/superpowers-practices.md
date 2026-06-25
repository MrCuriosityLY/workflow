# Superpowers-Style Practices

This plugin embeds lightweight engineering habits inspired by Superpowers workflows. If Superpowers skills are installed in the active Codex environment, prefer invoking the matching skill explicitly. If not, follow this reference.

## Before Building

- Understand the current code and project memory first.
- For creative or ambiguous work, produce a small design before implementation.
- Propose alternatives when the architecture decision matters.
- Keep the user involved at phase boundaries for full-flow work.

## TDD Bias

When tests are practical:

1. Identify the behavior to prove.
2. Add or update the smallest meaningful test.
3. Confirm it fails for the right reason when possible.
4. Implement.
5. Re-run the test.

If the project lacks a test harness for the touched area, document the gap and run the strongest available compile or smoke check.

## Debugging

Use a loop:

1. Observe the exact symptom or failure.
2. Read the relevant code path.
3. Form one hypothesis.
4. Test the hypothesis with the smallest command or code inspection.
5. Fix only the proven cause.
6. Re-run verification.

## Completion Discipline

- Evidence before claims.
- Do not say "fixed", "complete", or "passing" until verification confirms it.
- Summaries must mention commands run and any commands that could not be run.
- Preserve user changes and avoid unrelated refactors.
