# QMS OpenSpec Workflow

Use this workflow for OpenSpec-style QMS change management in any agent
environment.

## Goals

- Capture why a change is needed before implementation.
- Make tasks reviewable and traceable.
- Keep spec deltas aligned with implemented behavior.

## Directory Pattern

Use the target repository's existing OpenSpec directory if present. Common
locations include:

```text
openspec/
specs/
docs/openspec/
```

If the repository has no established location, propose one before creating new
structure.

## Change Lifecycle

1. Choose a short change id using lower-case hyphen-case, such as
   `add-sample-retention-check`.
2. Create a proposal that states the problem, scope, non-goals, and expected
   user or system behavior.
3. Create a task list with independently verifiable steps.
4. Add spec deltas for changed capabilities, requirements, and scenarios.
5. Validate manually or with the repository's installed `openspec` CLI.
6. Update the task list as implementation proceeds.
7. Archive or close the change only after implementation and verification are
   complete.

## Proposal Checklist

- Problem statement is concrete.
- Scope and non-goals are explicit.
- Affected modules, APIs, database tables, and integrations are listed.
- Acceptance criteria are testable.
- Migration and rollback implications are documented when data changes.

## Spec Delta Checklist

- Requirements use normative language such as MUST or SHOULD.
- Scenarios describe observable behavior.
- Each requirement maps to implementation or verification work.
- Removed or changed behavior is called out explicitly.

## Validation

If an `openspec` CLI exists in the target repository, prefer its validation
command. Otherwise validate manually:

- Proposal, tasks, and spec deltas are present.
- Change id is consistent across files.
- Every task is actionable.
- Every requirement has at least one scenario or acceptance check.
- SQL changes also follow `qms-sql-full.md`.
