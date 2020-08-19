import http from "utils/http";
import qs from "qs";
// ----------------------------------------------------------医疗器械等级评定---------------------------------------------------------
/**
 * 、医疗器械等级评定主体分页
 * /maai/rating/entity/:pageNum/:pageSize
 */
export function listRatingPage(page) {
  return http({
    method: 'post',
    url: '/maai/rating/entity/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}
/**
 * 、医疗器械等级评定记录分页
 * /maai/rating/record/:pageNum/:pageSize
 */
export function listLevelAssessRecord(page) {
  return http({
    method: 'post',
    url: '/maai/rating/record/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}
/**
* 、医疗器械年份查询
* /maai/rating/time/:entityId
*/
export function getTime(page) {
  return http({
    method: 'get',
    url: '/maai/rating/time/' + page
  });
}
/**
 * 、医疗器械评定主体等级
 * /maai/rating/assess/level
 */
export function updateAssessRecord(obj) {
  return http({
    method: 'post',
    url: '/maai/rating/assess/level',
    data: obj
  });
}
// ----------------------------------------------------------医疗器械限期整改---------------------------------------------------------
/**
 * 、医疗器械限期整改 - 复查和已复查列表
 * /maai/repatrol/page/{pageNum}/{pageSize}
 */
export function page(page) {
  return http({
    method: 'post',
    url: '/maai/repatrol/page/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}

/**
 * 、医疗器械限期整改 - 根据区域获取整改复查记录数量
 * /maai/repatrol/count
 */
export function countByStateAndAreaCode() {
  return http({
    method: 'post',
    url: '/maai/repatrol/count',
  });
}


/**
 * 、医疗器械限期整改 - 复查基础信息
 *'/maai/repatrol/detail/bascInfo'
 */
export function getBascInfo(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/bascInfo',
    data: obj
  });
}


/**
 * 、医疗器械限期整改 - 详情巡查项
 *'/maai/repatrol/detail/patrolContext'
 */
export function listRepatrolRecordContext(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/patrolContext',
    data: obj
  });
}


/**
 * 、医疗器械限期整改 - 详情巡查项
 *'/maai/repatrol/detail/result'
 */
export function getResultInfo(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/result',
    data: obj
  });
}


/**
 * 、医疗器械限期整改 - 监管人员/陪同人员（信息员）
 *'/maai/repatrol/supPerson
 */
export function get_soList_or_infoList(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/supPerson',
  });
}

/**
 * 、医疗器械限期整改 - 添加复查记录

 *'/maai/repatrol/update
 */
export function update(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/update',
    data: obj
  });
}
// ----------------------------------------------------------医疗器械专项计划管理---------------------------------------------------------


// 当前用户所在部门等级
export function getAreaLevel(){
  return http({
    method:"post",
    url:"maai/planspecial/areaLevel"
  })
}

/**
 * 、医疗器械专项计划管理接口 - 查询专项任务分配列表
 * /maai/planspecial/list/plandept
 */
export function getExecutesArray(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/list/plandept',
    data: obj
  });
}

/**
 * 、医疗器械专项计划管理接口 - 查询主体类型列表
 * /maai/planspecial/list/biztype
 */
export function loadBizType() {
  return http({
    method: 'get',
    url: '/maai/planspecial/list/biztype'
  });
}
/**
 * 、医疗器械专项计划管理接口 - 查询量化等级列表
 * /maai/planspecial/list/quantify
 */
export function loadQuantify() {
  return http({
    method: 'get',
    url: '/maai/planspecial/list/quantify'
  });
}


/**
医疗器械专项计划管理接口 - 查询主体类型关联的巡查要点列表
 * /maai/planspecial/list/patrolTable
 */
export function listTableByType(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/list/patrolTable',
    data: obj
  });
}


/**
 * 、医疗器械专项计划管理接口 - 添加专项计划
 * /maai/planspecial/add
 */
export function addSpceial(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/add',
    data: obj
  });
}


/**
 * 、医疗器械专项计划管理接口 - 制定机构下拉表
 * /maai/planspecial/list/agencies
 */
export function getAgencies() {
  return http({
    method: 'get',
    url: '/maai/planspecial/list/agencies',
  });
}


/**
 * 、医疗器械专项计划管理接口 - 查询各状态的计划数量

 * /maai/planspecial/total
 */
export function getPlanState() {
  return http({
    method: 'get',
    url: '/maai/planspecial/total',
  });
}

/**
 * 、医疗器械专项计划管理接口 - 列表分页

 * /maai/planspecial/list/plan
 */
export function getPage(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/list/plan',
    data: obj
  });
}


/**
 * 、医疗器械专项计划管理接口 -  编辑执行中的专项计划==》改日期

 * /maai/planspecial/updateExecuting
 */
export function updateEndDateById(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/updateExecuting',
    data: obj
  });
}

/**
 * 、医疗器械专项计划管理接口 -  完成
 * /maai/planspecial/complete/:id
 */
export function complete(planId) {
  return http({
    method: 'get',
    url: '/maai/planspecial/complete/' + planId
  });
}



/**
 * 、医疗器械专项计划管理接口 -  启动
 * /maai/planspecial/start/:id
 */
export function startPlan(planId) {
  return http({
    method: 'get',
    url: '/maai/planspecial/start/' + planId
  });
}

/**
 * 、医疗器械专项计划管理接口 - 专项计划详情
 * /maai/planspecial/detail/:id
 */
export function getInfo(planId) {
  return http({
    method: 'get',
    url: '/maai/planspecial/detail/' + planId
  });
}

/**
 * 、医疗器械专项计划管理接口 - 列表删除
 * /maai/planspecial/remove/:id
 */
export function deletePlan(planId) {
  return http({
    method: 'get',
    url: '/maai/planspecial/remove/' + planId
  });
}

/**
 * 、医疗器械专项计划管理接口 - 编辑
 * /maai/planspecial/update
 */
export function planspecial_update(obj) {
  return http({
    method: 'post',
    url: '/maai/planspecial/update',
    data: obj
  });
}
// ----------------------------------------------------------医疗器械监管巡查统计概况---------------------------------------------------------

/**
 * 、巡查统计概况 - 专项巡查概况
 * /maai/statistics/special/comPlan
 */
export function getStatPlanStateSpecial() {
  return http({
    method: 'post',
    url: '/maai/statistics/special/comPlan',
  });
}

/**
 * 、巡查统计概况- 日常综合数据
 * /maai/statistics/daily/comPlan
 */
export function getDaily(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/daily/comPlan',
    data:obj
  });
}
/**
 * 、巡查统计概况-  巡查结果分布
 * /maai/statistics/getResult
 */
export function getResult(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/getResult',
    data:obj
  });
}
/**
 * 、巡查统计概况- 处理方式
 * /maai/statistics/getTreat
 */
export function getTreat(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/getTreat',
    data:obj
  });
}

/**
 * 、巡查统计概况-  巡查动态
 * /maai/statistics/dynamicsRecord/:pageNum/:pageSize
 */
export function dynamicsRecord(size,num) {
  return http({
    method: 'post',
    url: '/maai/statistics/dynamicsRecord/'+num+'/'+size,
  });
}
/**
 * 、巡查统计概况-  统计报表
 * /maai/statistics/findStatisticalData
 */
export function getReportFormsDaily(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/findStatisticalData',
    data:obj
  });
}

/**
 * 、巡查统计概况-  累计巡查
 * /maai/statistics/patrolTotal
 */
export function getPatrolTotal(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/patrolTotal',
    data:obj
  });
}

/**
 * 、巡查统计概况-  主体覆盖率
 * /maai/statistics/coverage
 */
export function getCoverage(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/coverage',
    data:obj
  });
}

/**
 * 、巡查统计概况-  逾期未巡查数
 * /maai/statistics/overdues
 */
export function getoverdues(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/overdues',
    data:obj
  });
}
/**
 * 、巡查统计概况-  报表导出
 * /maai/statistics/excelStatisticalData
 */
export function excelStatisticalData(obj) {
  return http({
    method: 'post',
    url: '/maai/statistics/excelStatisticalData',
    data:obj
  });
}

// ----------------------------------------------------------医疗器械专项计划统计分析---------------------------------------------------------

/**
 * 、专项计划统计分析-  根据专项计划ID获取累计巡查次数和状态
 * /maai/statistics/overdues
 */
export function getSpecialData(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/specialRecordCount/'+id,
  });
}

/**
 * 、专项计划统计分析-  巡查动态
 * /maai/statistics/dynamicsRecord/:specialId
 */
export function getDynamic(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/dynamicsRecord/'+id,
  });
}

/**
 * 、专项计划统计分析-  处理结果
 * /maai/statistics/getResult/:specialId
 */
export function getPatrolResult(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/getResult/'+id,
  });
}
/**
 * 、专项计划统计分析-  处理方式
 * /maai/statistics/getResult/:specialId
 */
export function getProcessingType(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/getTreat/'+id,
  });
}
/**
 * 、专项计划统计分析-  处理方式
 * /maai/statistics/patrolTotal/:specialId
 */
export function getTotalPatrol(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/patrolTotal/'+id,
  });
}
/**
 * 、专项计划统计分析-  报表导出
 * /maai/statistics/excelStatisticalDataBySpecialId/:specialId
 */
export function exportExcel(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/excelStatisticalDataBySpecialId/'+id,
  });
}

/**
 * 、专项计划统计分析-  报表
 * /maai/statistics/excelStatisticalDataBySpecialId/:specialId
 */
export function getReportSpecial(id) {
  return http({
    method: 'post',
    url: '/maai/statistics/findStatisticalData/'+id,
  });
}
