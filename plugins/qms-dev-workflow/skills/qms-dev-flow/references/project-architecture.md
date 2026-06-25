# qms-lab-control Architecture

Use this reference when identifying module boundaries, affected files, or implementation order.

## Project Shape

- Java 17 Maven multi-module project.
- Root artifact: `com.transsion:qms-lab-control:1.0.0-SNAPSHOT`.
- Parent BOM: `com.transsion.hulk:hulk-framework-bom:3.0.0.RELEASE`.
- Runtime service name: `qms-lab-control`.
- Default port from project memory: `8099`.

## Modules

```text
qms-lab-control
├── qms-lab-entity    # Entity, DTO, VO, Excel, workflow objects
├── qms-lab-client    # Feign clients and service constants
├── qms-lab-core      # Mapper, service, support, manager, workflow handlers
└── qms-lab-manage    # Spring Boot app and REST controllers
```

## Dependency Direction

- `qms-lab-manage` depends on `qms-lab-core`.
- `qms-lab-core` depends on `qms-lab-entity` and `qms-lab-client`.
- `qms-lab-client` depends on `qms-lab-entity`.
- Do not introduce reverse dependencies.

## Main Capabilities

- QMS quality control plans.
- Internal and external ledgers.
- BPM workflow approval.
- Attachment binding and deletion.
- Excel import/export and print metadata.
- PowerJob-based automatic plan generation.
- Workflow callbacks from `qms-workflow`.

## Persistence

- MyBatis-Plus with `BaseMapper`, `ServiceImpl`, `LambdaQueryWrapper`.
- Project memory reports no custom MyBatis XML files.
- Entity classes inherit `com.baomidou.mybatisplus.extension.BaseEntity<String>`.
- SQL scripts live under `qms-lab-manage/src/main/resources/sql/`.

## External Integrations

- Nacos config/discovery.
- OpenFeign for other QMS services.
- Redis/Redisson.
- PowerJob.
- Swagger.
- Hulk framework libraries.
