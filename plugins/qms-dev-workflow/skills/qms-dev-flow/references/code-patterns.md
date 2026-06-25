# QMS Code Patterns

Load this file only when implementing or reviewing similar code.

## ServiceImpl CRUD

```java
@Slf4j
@Service
public class QmsQcPlanServiceImpl
        extends ServiceImpl<QmsQcPlanMapper, QmsQcPlan>
        implements QmsQcPlanService {

    @Resource
    private QmsQcPlanValidator qmsQcPlanValidator;

    @Override
    public QmsQcPlanPageVo pageList(BaseRequest<QmsQcPlanDto> request) {
        Page<QmsQcPlan> page = new Page<>(request.getPageNum(), request.getPageSize());
        LambdaQueryWrapper<QmsQcPlan> wrapper = Wrappers.lambdaQuery();
        Page<QmsQcPlan> result = this.page(page, wrapper);
        return QmsQcPageHelper.toPlanPage(result, QmsQcPlanConverter::toVo);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String saveData(QmsQcPlanDto dto) {
        qmsQcPlanValidator.validate(dto);
        QmsQcPlan entity = QmsQcPlanConverter.toEntity(dto);
        this.save(entity);
        return entity.getId();
    }
}
```

## Controller Response

```java
@Api(tags = "质控计划")
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/qmsQcPlan")
public class QmsQcPlanController {
    private final QmsQcPlanService service;

    @ApiOperation("分页查询")
    @PostMapping("/page")
    public BaseResponse<QmsQcPlanPageVo> pageList(@RequestBody BaseRequest<QmsQcPlanDto> request) {
        return BaseResponse.success(service.pageList(request));
    }
}
```

## Workflow Controller

```java
@RestController
@RequestMapping("/qmsQcPlan")
@AllArgsConstructor
public class QmsQcPlanWorkflowController {
    private final IQmsQcPlanWorkflowService workflowService;

    @PostMapping("/workflow/node1/saveDraft")
    public BaseResponse<Boolean> node1SaveDraft(@RequestBody QmsQcPlanWorkflowNode1DraftDto dto) {
        return BaseResponse.success(workflowService.node1SaveDraft(dto));
    }
}
```

## Workflow Callback

```java
@Component
public class QcPlanFlowCallback extends AbstractWorkFlowCallbackHandler {

    @Override
    public String getBusinessKey() {
        return BusinessKeyEnum.QC_PLAN_APPROVAL.getCode();
    }

    @Override
    protected Boolean doWorkFlowCallBack(WorkFlowCallbackDto dto) {
        return true;
    }
}
```

## Converter

```java
public final class QmsQcPlanConverter {
    private QmsQcPlanConverter() {
    }

    public static QmsQcPlanVo toVo(QmsQcPlan entity) {
        QmsQcPlanVo vo = new QmsQcPlanVo();
        BeanUtil.copyProperties(entity, vo);
        return vo;
    }
}
```

## Support Validator

```java
@Component
public class QmsQcPlanValidator {
    public void validate(QmsQcPlanDto dto) {
        if (CharSequenceUtil.isBlank(dto.getLabKey())) {
            throw new BusinessException(ErrorMsgEnum.LAB_KEY_REQUIRED.getMsg());
        }
    }
}
```
