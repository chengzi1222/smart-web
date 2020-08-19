import http from "utils/http";
import qs from "qs";

// ------------------------------------------------------------化妆品主体概况--》地图---------------------------------------------------------------------

/**
 * 饼图
 * /cosmetic/home/statistics/entity/:entityType
 */
export function chartPie(entityType) {
  return http({
    method: 'get',
    url: '/cosmetic/map/pie?entityType='+entityType,
  });
}


/**
 * 企业形态
 * '/cosmetic/map/busclass'
 */
export function busclass() {
  return http({
    method: 'get',
    url: '/cosmetic/map/busclass',
  });
}

/**
 * 药品主体地图 - 获取当前登陆账户的下级区域
 * /medi/map/chilarea
 */
export function getChilarea(j) {
  return http({
    method: 'get',
    url: '/cosmetic/map/chilarea?codeLevel='+j,
  });
}


/**
 * 药品主体地图 - 搜索框分页查询列表
 * /cosmetic/map/page/
 */
export function pageSearch(d, pageNum, pageSize) {
  return http({
    method: 'get',
    url:`/cosmetic/map/page/${pageNum}/${pageSize}`,
    params: d,
  });
}



/**主体详情
 * /cosmetic/map/show
 */
export function findEntity(id) {
  return http({
    method: 'get',
    url:'/cosmetic/map/show',
    params: { entityId:id },
  });
}





// ------------------------------------------------------------化妆品首页统计---------------------------------------------------------------------

/**
 * 代办事项
 * /medi/home/statistics/backlog
 */
export function getHomeEntityStat() {
  return http({
    method: 'get',
    url: '/cosmetic/home/statistics/backlog',
  });
}

/**
 * 预警区
 * /medi/home/statistics/warningArea
 */
export function getWarningArea() {
  return http({
    method: 'get',
    url: '/cosmetic/home/statistics/warningArea',
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
  return http({
    method: 'post',
    url: '/cosmetic/home/statistics/patrolPlan',
    data: params
  });
}
/**
 * 巡查动态
 * /medi/home/statistics/patrolState
 */
export function getEynamic() {
  return http({
    method: 'get',
    url: '/cosmetic/home/statistics/patrolState',
  });
}

/**
 * 覆盖率排行
 * /medi/home/statistics/patrolCover
 */
export function getTotalPatrol(params) {
  return http({
    method: 'post',
    url: '/cosmetic/home/statistics/patrolCover',
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
    url: '/cosmetic/home/statistics/entityAll',
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
    url: '/cosmetic/home/statistics/entity/'+entityType,
  });
}
// ------------------------------------------------------------化妆品主体报表和所有主体报表---------------------------------------------------------------------

/**
 * 所有主体统计列表
 */
export function getAlllist(params) {
  return http({
    method: 'post',
    url: '/cosmetic/form/all',
    data: params
  });
}

/**
 * 所有主体统计列表导出
 */
export function export_all(params) {
  return http({
    method: 'post',
    url: '/cosmetic/form/export/all',
    data: params
  });
}
/**
 * 主体统计列表
 */
export function getSubList(params,type) {
  return http({
    method: 'post',
    url: '/cosmetic/form/'+type,
    data: params
  });
}

/**
 * 主体统计列表导出
 */
export function export_sub(params,type) {
  return http({
    method: 'post',
    url: '/cosmetic/form/export/'+type,
    data: params
  });
}

/**
 * 主体统计分析-》分布统计图
 * /cosmetic/statistics/particular/:entityType
 */
export function getParticular(params,type) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/particular/'+type,
    data: params
  });
}
/**
 * 主体统计分析-》待办事项

 * /cosmetic/statistics/basic/:entityType
 */
export function getBasic(type) {
  return http({
    method: 'get',
    url: '/cosmetic/statistics/basic/'+type,
  });
}
/**
 * 主体统计分析-》总体总量趋势图
 * /cosmetic/statistics/totalTrend/:entityType
 */
export function getTotalTrend(params,type) {
  return http({
    method: 'post',
    url: '/cosmetic/statistics/totalTrend/'+type,
    data: params
  });
}
/**
 *  获取用户字典项列表(所有字段)
 * @deprecated
 */
export function listDictUserItemByCodeAll(dictCode) {
  return http({
    method: 'post',
    url: 'env/dict/listDictUserItemByCodeAll',
    data: qs.stringify({ "dictUserCode": dictCode })
  });
}
/**
 * 所属辖区
 */
export function getGrid() {
  return http({
    method: 'get',
    url: '/common/dept/grid'
  });
}