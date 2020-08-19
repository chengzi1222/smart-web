import http from "utils/http";

/**
 *  获取主体管理的列表
 */
export function getSubList(params) {
  return http({
    method: 'get',
    url: '/food/djpd/entity/manage/list',
    params
  });
}

/**
 *  主体批量启用/禁用
 */
export function batchUpdateStatus(params) {
  return http({
    method: 'post',
    url: '/food/djpd/entity/manage/batchSet?ids='+params.ids+'&status='+params.status,
  });
}

/**
 *  主体启用/禁用
 */
export function updateStatus(params) {
  return http({
    method: 'post',
    url: '/food/djpd/entity/manage/setStatus',
    params: params
  });
}

/**
 *  添加主体时拉取的列表
 */
export function getSysEntityList(params) {
  return http({
    method: 'get',
    url: '/food/djpd/entity/manage/sysEntity/list',
    params
  });
}

/**
 *  添加主体至等级评定模块
 */
export function addSubFromSysEntity(params) {
  return http({
    method: 'post',
    url: '/food/djpd/entity/manage/sysEntity/add',
    data: params
  });
}
