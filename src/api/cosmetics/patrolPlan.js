import http from "utils/http";
import qs from "qs";
// ----------------------------------------------------------化妆品等级评定---------------------------------------------------------
/**
 * 、化妆品等级评定主体分页
 * /cosmetic/rating/entity/:pageNum/:pageSize
 */
export function listRatingPage(page) {
  return http({
    method: 'post',
    url: '/cosmetic/rating/entity/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}
/**
 * 、化妆品等级评定记录分页
 * /cosmetic/rating/record/:pageNum/:pageSize
 */
export function listLevelAssessRecord(page) {
  return http({
    method: 'post',
    url: '/cosmetic/rating/record/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}
/**
* 、化妆品年份查询
* /cosmetic/rating/time/:entityId
*/
export function getTime(page) {
  return http({
    method: 'get',
    url: '/cosmetic/rating/time/' + page
  });
}
/**
 * 、化妆品评定主体等级
 * /cosmetic/rating/assess/level
 */
export function updateAssessRecord(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/rating/assess/level',
    data: obj
  });
}
// ----------------------------------------------------------化妆品限期整改---------------------------------------------------------
/**
 * 、化妆品限期整改 - 复查和已复查列表
 * /cosmetic/repatrol/page/{pageNum}/{pageSize}
 */
export function page(page) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/page/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}

/**
 * 、化妆品限期整改 - 根据区域获取整改复查记录数量
 * /cosmetic/repatrol/count
 */
export function countByStateAndAreaCode() {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/count',
  });
}


/**
 * 、化妆品限期整改 - 复查基础信息
 *'/cosmetic/repatrol/detail/bascInfo'
 */
export function getBascInfo(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/detail/bascInfo',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 详情巡查项
 *'/cosmetic/repatrol/detail/patrolContext'
 */
export function listRepatrolRecordContext(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/detail/patrolContext',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 详情巡查项
 *'/cosmetic/repatrol/detail/result'
 */
export function getResultInfo(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/detail/result',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 监管人员/陪同人员（信息员）
 *'/cosmetic/repatrol/supPerson
 */
export function get_soList_or_infoList(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/supPerson',
  });
}

/**
 * 、化妆品限期整改 - 添加复查记录

 *'/cosmetic/repatrol/update
 */
export function update(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/repatrol/update',
    data: obj
  });
}
// ----------------------------------------------------------化妆品专项计划管理---------------------------------------------------------
/**
 * 、化妆品专项计划管理接口 - 查询专项任务分配列表
 * /comsmetic/planspecial/list/plandept
 */
export function getExecutesArray(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/list/plandept',
    data: obj
  });
}


/**
化妆品专项计划管理接口 - 查询主体类型关联的巡查要点列表
 * /comsmetic/planspecial/list/patrolTable
 */
export function listTableByType(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/list/patrolTable',
    data: obj
  });
}


/**
 * 、化妆品专项计划管理接口 - 添加专项计划
 * /comsmetic/planspecial/add
 */
export function addSpceial(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/add',
    data: obj
  });
}


/**
 * 、化妆品专项计划管理接口 - 制定机构下拉表
 * /comsmetic/planspecial/list/agencies
 */
export function getAgencies() {
  return http({
    method: 'get',
    url: '/comsmetic/planspecial/list/agencies',
  });
}


/**
 * 、化妆品专项计划管理接口 - 查询各状态的计划数量

 * /comsmetic/planspecial/total
 */
export function getPlanState() {
  return http({
    method: 'get',
    url: '/comsmetic/planspecial/total',
  });
}

/**
 * 、化妆品专项计划管理接口 - 列表分页

 * /comsmetic/planspecial/list/plan
 */
export function getPage(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/list/plan',
    data: obj
  });
}


/**
 * 、化妆品专项计划管理接口 -  编辑执行中的专项计划==》改日期

 * /comsmetic/planspecial/updateExecuting
 */
export function updateEndDateById(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/updateExecuting',
    data: obj
  });
}

/**
 * 、化妆品专项计划管理接口 -  完成
 * /comsmetic/planspecial/updateExecuting
 */
export function complete(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/complete',
    data: obj
  });
}



/**
 * 、化妆品专项计划管理接口 -  启动
 * /comsmetic/planspecial/start
 */
export function startPlan(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/start',
    data: obj
  });
}

/**
 * 、化妆品专项计划管理接口 - 专项计划详情
 * /comsmetic/planspecial/detail/:id
 */
export function getInfo(planId) {
  return http({
    method: 'get',
    url: '/comsmetic/planspecial/detail/' + planId
  });
}

/**
 * 、化妆品专项计划管理接口 - 列表删除
 * /comsmetic/planspecial/remove/:id
 */
export function deletePlan(planId) {
  return http({
    method: 'get',
    url: '/comsmetic/planspecial/remove/' + planId
  });
}

/**
 * 、化妆品专项计划管理接口 - 编辑
 * /comsmetic/planspecial/remove/:id
 */
export function planspecial_update(obj) {
  return http({
    method: 'post',
    url: '/comsmetic/planspecial/update',
    data: obj
  });
}
// ----------------------------------------------------------化妆品监管巡查统计概况---------------------------------------------------------

/**
 * 、巡查统计概况 - 专项巡查概况
 * /cosmetic/statistics/special/comPlan
 */
export function getStatPlanStateSpecial() {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/special/comPlan',
  });
}

/**
 * 、巡查统计概况- 日常综合数据
 * /cosmetic/statistics/daily/comPlan
 */
export function getDaily(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/daily/comPlan',
    data:obj
  });
}
/**
 * 、巡查统计概况-  巡查结果分布
 * /cosmetic/statistics/getResult
 */
export function getResult(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/getResult',
    data:obj
  });
}
/**
 * 、巡查统计概况- 处理方式
 * /cosmetic/statistics/getTreat
 */
export function getTreat(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/getTreat',
    data:obj
  });
}

/**
 * 、巡查统计概况-  巡查动态
 * /cosmetic/statistics/dynamicsRecord/:pageNum/:pageSize
 */
export function dynamicsRecord(size,num) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/dynamicsRecord/'+num+'/'+size,
  });
}
/**
 * 、巡查统计概况-  统计报表
 * /cosmetic/statistics/findStatisticalData
 */
export function getReportFormsDaily(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/findStatisticalData',
    data:obj
  });
}

/**
 * 、巡查统计概况-  累计巡查
 * /cosmetic/statistics/patrolTotal
 */
export function getPatrolTotal(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/patrolTotal',
    params:obj
  });
}

/**
 * 、巡查统计概况-  主体覆盖率
 * /cosmetic/statistics/coverage
 */
export function getCoverage(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/coverage',
    data:obj
  });
}

/**
 * 、巡查统计概况-  逾期未巡查数
 * /cosmetic/statistics/overdues
 */
export function getoverdues(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/overdues',
    data:obj
  });
}
/**
 * 、巡查统计概况-  报表导出
 * /cosmetic/statistics/excelStatisticalData
 */
export function excelStatisticalData(obj) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/excelStatisticalData',
    data:obj
  });
}

// ----------------------------------------------------------化妆品专项计划统计分析---------------------------------------------------------

/**
 * 、专项计划统计分析-  根据专项计划ID获取累计巡查次数和状态
 * /cosmetic/statistics/overdues
 */
export function getSpecialData(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/specialRecordCount/'+id,
  });
}

/**
 * 、专项计划统计分析-  巡查动态
 * /cosmetic/statistics/dynamicsRecord/:specialId
 */
export function getDynamic(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/dynamicsRecord/'+id,
  });
}

/**
 * 、专项计划统计分析-  处理结果
 * /cosmetic/statistics/getResult/:specialId
 */
export function getPatrolResult(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/getResult/'+id,
  });
}
/**
 * 、专项计划统计分析-  处理方式
 * /cosmetic/statistics/getResult/:specialId
 */
export function getProcessingType(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/getTreat/'+id,
  });
}
/**
 * 、专项计划统计分析-  处理方式
 * /cosmetic/statistics/patrolTotal/:specialId
 */
export function getTotalPatrol(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/patrolTotal/'+id,
  });
}
/**
 * 、专项计划统计分析-  报表导出
 * /cosmetic/statistics/excelStatisticalDataBySpecialId/:specialId
 */
export function exportExcel(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/excelStatisticalDataBySpecialId/'+id,
  });
}

/**
 * 、专项计划统计分析-  报表
 * /cosmetic/statistics/excelStatisticalDataBySpecialId/:specialId
 */
export function getReportSpecial(id) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/findStatisticalData/'+id,
  });
}
