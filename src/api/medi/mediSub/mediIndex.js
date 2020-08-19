import http from "utils/http";
import qs from "qs";
// ----------------------------------------------------------药品首页---------------------------------------------------------
/**
 * 代办事项
 * /medi/home/statistics/backlog
 */
export function getHomeEntityStat() {
  return http({
    method: 'get',
    url: '/medi/home/statistics/backlog',
  });
}

/**
 * 预警区
 * /medi/home/statistics/warningArea
 */
export function getWarningArea() {
  return http({
    method: 'get',
    url: '/medi/home/statistics/warningArea',
  });
}


/**
 * 药品预警
 * /medi/home/statistics/mediWarning
 */
export function getMediWarning(d) {
  if(d.startDate==''){
    delete d.startDate
  }
  if(d.endDate==''){
    delete d.endDate
  }
  return http({
    method: 'get',
    url: '/medi/home/statistics/mediWarning',
    params: d
  });
}

/**
 * 日常专项巡查
 * /medi/home/statistics/patrolPlan
 */
export function getPatrolPlan(params) {
  if(params.startDate==''){
    delete params.startDate
  }
  if(params.endDate==''){
    delete params.endDate
  }
  let data=qs.stringify(params)
  return http({
    method: 'post',
    url: '/medi/home/statistics/patrolPlan',
    data: data
  });
}
/**
 * 巡查动态
 * /medi/home/statistics/patrolState
 */
export function getEynamic() {
  return http({
    method: 'get',
    url: '/medi/home/statistics/patrolState',
  });
}

/**
 * 覆盖率排行
 * /medi/home/statistics/patrolCover
 */
export function getTotalPatrol(params) {
  return http({
    method: 'post',
    url: '/medi/home/statistics/patrolCover',
    data: params
  });
}
/**
 * 药品首页统计分析 - 主体类型1
 * /medi/home/statistics/entityAll
 */
export function getEntityAll(params) {
  let data=qs.stringify(params)
  return http({
    method: 'get',
    url: '/medi/home/statistics/entityAll',
    data: data
  });
}
/**
 * 药品首页统计分析 - 主体类型2
 * /medi/home/statistics/entity/:entityType
 */
export function getEntityType(entityType) {
  return http({
    method: 'get',
    url: '/medi/home/statistics/entity/'+entityType,
  });
}


// ------------------------------------------------------------药品主体概况--》地图---------------------------------------------------------------------

/**
 * 饼图
 * /medi/home/statistics/entity/:entityType
 */
export function chartPie(entityType) {
  return http({
    method: 'get',
    url: '/medi/map/pie?entityType='+entityType,
  });
}


/**
 * 企业形态
 * /medi/home/statistics/entity/:entityType
 */
export function busclass() {
  return http({
    method: 'get',
    url: '/medi/map/busclass',
  });
}

/**
 * 药品主体地图 - 获取当前登陆账户的下级区域
 * /medi/map/chilarea
 */
export function getChilarea(j) {
  return http({
    method: 'get',
    url: '/medi/map/chilarea?codeLevel='+j,
  });
}


/**
 * 药品主体地图 - 搜索框分页查询列表
 * /medi/map/page/
 */
export function pageSearch(d, pageNum, pageSize) {
  return http({
    method: 'get',
    url:`/medi/map/page/${pageNum}/${pageSize}`,
    params: d,
  });
}



/**主体详情
 * /medi/map/show
 */
export function findEntity(id) {
  return http({
    method: 'get',
    url:'/medi/map/show',
    params: { entityId:id },
  });
}







// ------------------------------------------------------------药品专项巡查统计分析---------------------------------------------------------------------


/**累计总数和图表
 * /medi/stat/patrol/statPatrolCntSpecial
 */
export function getSpecialData(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'post',
    url:'/medi/stat/patrol/statPatrolCntSpecialById',
    data:j
  });
}
/**巡查动态
 * /medi/stat/patrol/daily/list
 */
export function getDynamic(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'post',
    url:'/medi/stat/patrol/special/list',
    data:j
  });
}

/**巡查结果分布
 * /medi/stat/patrol/statPatrolResultSpecial
 */
export function getPatrolResult(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'post',
    url:'/medi/stat/patrol/statPatrolResultSpecial',
    data:j
  });
}


/**处理方式分布
 * /medi/stat/patrol/statPatrolTreatSpecial
 */
export function getProcessingType(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'post',
    url:'/medi/stat/patrol/statPatrolTreatSpecial',
    data:j
  });
}

/**专项页面-加载专项计划详情(专项名，部门名，计划完成度)
 * /medi/stat/patrol/loadPlan
 */
export function getLoadPlan(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'get',
    url:'/medi/stat/patrol/loadPlan',
    params:j
  });
}
/**统计报表
 * /medi/stat/patrol/reportFormsSpecial
 */
export function getReportSpecial(j) {
  // let d=qs.stringify(data);
  return http({
    method: 'post',
    url:'/medi/stat/patrol/reportFormsSpecial',
    data:j
  });
}
/**
 * 专项巡查统计Excel导出
 */
// export function exportSpecialExcel(id,deptName, planName) {
//   if(id){
//   //   location.href = `/api/patrol/statistics/getSpecialExcel/${patrolPlanId}?sortColumn=${sortColumn}`;
//   // let dept=encodeURI(deptName);
//   // let plan=encodeURI(planName)
//   window.open()
//   }else{
//     this.$message.error('计划id没有找到！');
//   }
// }