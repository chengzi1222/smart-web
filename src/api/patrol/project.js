import http from "utils/http";
import qs from "qs";

/**
 *  获取巡查要点表列表
 * @param params
 */
export function getPatrolKeyPointPage(params) {
  return http({
    method: 'post',
    url: 'patrol/table',
    data: params
  });
}

/**
 *  获取巡查项目表
 * @param params
 */
export function getPatrolProjectPage(params) {
  return http({
    method: 'post',
    url: 'patrol/project',
    data: params
  });
}

/**
 *  获取主体类型列表
 * @param params
 */
export function listEntity() {
  return http({
    method: 'post',
    url: 'env/patrol/listEntity'
  });
}

/**
 *  类型查询巡查表列表
 * @param params
 */
export function listTableByType(entityType) {
  return http({
    method: 'post',
    url: 'patrol/table/list',
    data: qs.stringify({"entityType": entityType})
  });
}

/**
 *  类型查询巡查表列表
 * @param params
 */
export function getPatrolTable(patrolTableId) {
  return http({
    method: 'post',
    url: 'patrol/table/get',
    data: qs.stringify({"patrolTableId": patrolTableId})
  });
}

/**
 *  巡查项目列表
 * @param params
 */
export function listproject(patrolTableId) {
  return http({
    method: 'post',
    url: 'patrol/project/list',
    data: qs.stringify({"patrolTableId": patrolTableId})
  });
}

export function submitPatrolTable(patrolTable) {
  return http({
    method: 'post',
    url: 'patrol/table/update',
    data: patrolTable
  });
}

export function submitPatrolProject(patrolProject) {
  return http({
    method: 'post',
    url: 'patrol/project/update',
    data: patrolProject
  });
}

/**
 *  删除巡查项目
 * @param params
 */
export function deletePatrolProject(patrolProject) {
  return http({
    method: 'post',
    url: 'patrol/project/delete',
    data: patrolProject
  });
}

export function listContext(patrolTableId) {
    return http({
    method: 'post',
    url: 'patrol/context/list',
    data: qs.stringify({"patrolTableId": patrolTableId})
  });
}

export function submitPatrolContext(patrolContext, patrolProject) {
  return http({
    method: 'post',
    url: 'patrol/context/update',
    data: {"patrolContext": patrolContext, "patrolProject":patrolProject}
  });
}


/**
 *  删除巡查内容
 * @param params
 */
export function deletePatrolContext(patrolContext) {
  return http({
    method: 'post',
    url: 'patrol/context/delete',
    data: patrolContext
  });
}


export function listScore() {
    return http({
    method: 'post',
    url: 'patrol/listScore'
  });
}


/**
 *  巡查记录详情（基础信息）
 */
export function getBasicInfo(recordId,patrolType) {
  return http({
    method: 'get',
    url: '/patrol/record/details/basicInfo?recordId='+recordId+'&patrolType='+patrolType
  });
}

/**
 *  巡查记录详情（巡查项）
 */
export function getPatrolItems(recordId,patrolType) {
  return http({
    method: 'get',
    url: '/patrol/record/details/patrolItems?recordId='+recordId+'&patrolType='+patrolType
  });
}

/**
 *  巡查记录详情（巡查结果）
 */
export function getPatrolResult(datas) {
  return http({
    method: 'get',
    url: '/patrol/record/details/patrolResult?' + datas
  });
}

/**
 *  最大巡查项编号
 */
export function getMaxNoProject(patrolTableId) {
  return http({
    method: 'get',
    url: '/patrol/getMaxNoProject?patrolTableId='+patrolTableId
  });
}

/**
 *  最大巡查内容编号
 */
export function getMaxNoContext(patrolProjectId) {
  return http({
    method: 'get',
    url: '/patrol/getMaxNoContext?patrolProjectId='+patrolProjectId
  });
}
