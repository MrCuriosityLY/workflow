# QMS OpenSpec Template

## proposal.md

```md
# <Change Title>

## Why

## What Changes

## Impact

- Affected modules:
- Affected APIs:
- Affected SQL:
- Affected workflow:

## Out Of Scope
```

## design.md

```md
# Design

## Current Behavior

## Target Behavior

## Data Model

## API Contract

## Service Flow

## Workflow/BPM

## SQL And Migration

## Compatibility

## Verification
```

## tasks.md

```md
# Tasks

- [ ] 1. Read existing implementation and dependency classes.
- [ ] 2. Confirm API/data/SQL/workflow impacts.
- [ ] 3. Implement data model changes.
- [ ] 4. Implement service and controller behavior.
- [ ] 5. Update SQL and full.sql if needed.
- [ ] 6. Run focused verification.
- [ ] 7. Archive or update durable memory.
```

## specs/<domain>/spec.md

```md
## ADDED Requirements

### Requirement: <Behavior>
The system SHALL ...

#### Scenario: <Happy Path>
- GIVEN ...
- WHEN ...
- THEN ...

## MODIFIED Requirements

## REMOVED Requirements
```
