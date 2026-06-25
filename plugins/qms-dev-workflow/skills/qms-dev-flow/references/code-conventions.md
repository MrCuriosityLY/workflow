# QMS Code Conventions

Use before writing or reviewing Java code.

## Naming

| Type | Rule | Example |
| --- | --- | --- |
| Entity | table name in CamelCase, no suffix | `QmsQcPlan` |
| DTO | module name + `Dto` | `QmsQcPlanDto` |
| VO | module name + `Vo` | `QmsQcPlanVo` |
| Query DTO | module name + `QueryDto` or semantic suffix | `QmsQcPlanDashboardQueryDto` |
| Service | module name + `Service` | `QmsQcPlanService` |
| Workflow service | `I` prefix | `IQmsQcPlanWorkflowService` |
| Service impl | module name + `ServiceImpl` | `QmsQcPlanServiceImpl` |
| Mapper | module name + `Mapper` | `QmsQcPlanMapper` |
| Controller | module name + `Controller` | `QmsQcPlanController` |
| Converter | module name + `Converter` | `QmsQcPlanConverter` |
| Support | business semantic + `Support` or `Validator` | `QmsQcPlanValidator` |
| Manager | business semantic + `Manager` | `QmsQcPlanExcelManager` |
| Constants | module/business + `Constants` or `Constant` | `QcConstants` |
| Enum | business semantic + `Enum` | `BusinessKeyEnum` |

## Java Style

- Use 4-space indentation.
- Use Lombok consistently:
  - `@Data` for Entity/DTO/VO.
  - `@Slf4j` for Service/Controller.
  - `@AllArgsConstructor` or `@RequiredArgsConstructor` for controller constructor injection.
- Controllers use constructor injection.
- Services commonly use `@Resource` field injection.
- Write operations use `@Transactional(rollbackFor = Exception.class)`.
- Business exceptions use `com.transsion.framework.exception.BusinessException`.
- Prefer `LambdaQueryWrapper`, `Wrappers.lambdaQuery()`, and MyBatis-Plus service APIs.

## JavaDoc

Classes should include:

```java
/**
 * 中文简述
 *
 * @version 1.0
 * @date yyyy-MM-dd HH:mm:ss
 * @author author.id
 */
```

Methods should include:

```java
/**
 * 中文摘要
 *
 * @param xxx 参数说明
 * @return 返回值说明
 * @date yyyy/M/d HH:mm
 * @version 1.0
 * @author author.id
 */
```

## Entity

- Extend `com.baomidou.mybatisplus.extension.BaseEntity<String>`.
- Use `@TableName("snake_case_table")`.
- Use explicit `@TableField("snake_case_column")`.
- Use `LocalDateTime` or `LocalDate` for time/date fields.

## Controller

- Use `@RestController`, `@RequestMapping`, and Swagger `@Api`.
- Return `BaseResponse<T>`.
- Pagination uses `BaseRequest<QueryDto>`.
- Common endpoints:
  - detail: `GET /get/{id}`
  - page: `POST /page`
  - create/update/delete: `POST`
- Log key operations with JSON payloads.

## Workflow

- Separate CRUD controllers from workflow controllers.
- Share the same request prefix and place workflow operations under `/workflow/*`.
- Callback handlers implement the workflow callback contract and register via `getBusinessKey()`.
- Business keys live in `BusinessKeyEnum`.

## Feign

Use:

```java
@FeignClient(
    value = ServiceConst.XXX,
    path = "/xxx",
    fallbackFactory = BaseFeinClientFallbackFactory.class
)
```

Service names belong in `ServiceConst`.
