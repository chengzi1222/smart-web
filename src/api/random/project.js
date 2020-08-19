import http from "utils/http";
import qs from "qs";

/**
 *  获取巡查要点表列表
 * @param params
 */
export function getRandomKeyPointPage(params) {
  return http({
    method: 'post',
    url: 'random/table/page',
    data: params
  });
}

/**
 *  获取巡查项目表
 * @param params
 */
export function getRandomProjectPage(params) {
  return http({
    method: 'post',
    url: 'random/project',
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
    url: 'env/random/listEntity'
  });
}

/**
 *  类型查询巡查表列表
 * @param params
 */
export function listTableByType(entityType) {
  return http({
    method: 'post',
    url: 'random/table/list',
    data: qs.stringify({"entityType": entityType})
  });
}

/**
 *  类型查询巡查表列表
 * @param params
 */
export function getRandomTable(randomTableId) {
  return http({
    method: 'post',
    url: 'random/table/get',
    data: qs.stringify({"randomTableId": randomTableId})
  });
}

/**
 *  巡查项目列表
 * @param params
 */
export function listproject(randomTableId) {
  return http({
    method: 'post',
    url: 'random/project/list',
    data: qs.stringify({"randomTableId": randomTableId})
  });
}

export function submitRandomTable(randomTable) {
  return http({
    method: 'post',
    url: 'random/table/update',
    data: randomTable
  });
}

export function submitRandomProject(randomProject) {
  return http({
    method: 'post',
    url: 'random/project/update',
    data: randomProject
  });
}

/**
 *  删除巡查项目
 * @param params
 */
export function deleteRandomProject(randomProject) {
  return http({
    method: 'post',
    url: 'random/project/delete',
    data: randomProject
  });
}

export function listContext(randomTableId) {
    return http({
    method: 'post',
    url: 'random/context/list',
    data: qs.stringify({"randomTableId": randomTableId})
  });
}

export function submitRandomContext(randomContext, randomProject) {
  return http({
    method: 'post',
    url: 'random/context/update',
    data: {"randomContext": randomContext, "randomProject":randomProject}
  });
}


/**
 *  删除巡查内容
 * @param params
 */
export function deleteRandomContext(randomContext) {
  return http({
    method: 'post',
    url: 'random/context/delete',
    data: randomContext
  });
}


export function listScore() {
    return http({
    method: 'post',
    url: 'random/listScore'
  });
}


/**
 *  巡查记录详情（基础信息）
 */
export function getBasicInfo(recordId,randomType) {
  return http({
    method: 'get',
    url: '/random/record/details/basicInfo?recordId='+recordId+'&randomType='+randomType
  });
}

/**
 *  巡查记录详情（巡查项）
 */
export function getRandomItems(recordId,randomType) {
  return http({
    method: 'get',
    url: '/random/record/details/randomItems?recordId='+recordId+'&randomType='+randomType
  });
}

/**
 *  巡查记录详情（巡查结果）
 */
export function getRandomResult(recordId,randomType) {
  return http({
    method: 'get',
    url: '/random/record/details/randomResult?recordId='+recordId+'&randomType='+randomType
  });
}

/**
 *  最大巡查项编号
 */
export function getMaxNoProject(randomTableId) {
  return http({
    method: 'get',
    url: '/random/getMaxNoProject?randomTableId='+randomTableId
  });
}

/**
 *  最大巡查内容编号
 */
export function getMaxNoContext(randomProjectId) {
  return http({
    method: 'get',
    url: '/random/getMaxNoContext?randomProjectId='+randomProjectId
  });
}

/**
 * 双随机抽查项
 * @param {Object} params
 */
export function getRandomContext(entityType, taskId){
  return http({
    method:"get",
    url:'random/getRandomContext?entityType=' + entityType + "&taskId=" + taskId
  })
}
