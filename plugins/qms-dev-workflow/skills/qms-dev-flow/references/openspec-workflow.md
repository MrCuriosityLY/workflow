# OpenSpec-Style Workflow

Use this reference for feature work, behavior changes, API changes, data model changes, and workflow changes.

## Principles

- Specs describe the intended behavior before implementation.
- Changes are isolated in a change folder until delivered.
- Tasks are explicit and checked off only after verification.
- Implementation follows the accepted spec and design contract.
- Archive or fold accepted changes into durable project memory after delivery.

## Folder Layout

```text
.openspec/
├── project.md
├── specs/
│   └── <domain>/spec.md
└── changes/
    └── <change-id>/
        ├── proposal.md
        ├── tasks.md
        ├── design.md
        └── specs/
            └── <domain>/spec.md
```

## Change ID

Use kebab-case with an action verb:

- `add-qc-plan-approval-submit-time`
- `change-qc-ledger-review-result`
- `fix-qc-plan-import-i18n`

## proposal.md

Required sections:

```md
# <Change Title>

## Why

## What Changes

## Impact

## Out Of Scope
```

## design.md

Required sections:

```md
# Design

## Current Behavior

## Target Behavior

## Data Model

## API Contract

## Service Flow

## SQL And Migration

## Compatibility

## Verification
```

## tasks.md

Use checkboxes:

```md
# Tasks

- [ ] 1. Read existing implementation and dependency classes.
- [ ] 2. Update SQL and full.sql, if needed.
- [ ] 3. Implement entity/DTO/VO changes.
- [ ] 4. Implement service/controller changes.
- [ ] 5. Run focused verification.
- [ ] 6. Update memory or archive spec.
```

## spec.md

Use requirement-oriented language:

```md
## ADDED Requirements

### Requirement: <Behavior>
The system SHALL ...

#### Scenario: <Case>
- GIVEN ...
- WHEN ...
- THEN ...

## MODIFIED Requirements

## REMOVED Requirements
```

## Validation

If an `openspec` CLI is installed in the target repo, prefer its validation command. Otherwise validate manually:

- proposal explains why and scope,
- tasks are actionable and ordered,
- design covers data/API/service/SQL/verification,
- spec uses ADDED/MODIFIED/REMOVED sections,
- scenarios are testable.
