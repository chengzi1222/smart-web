import http from "utils/http";

/**
 * 获取主体列表
 */
export function entityPageApi(paramObj) {
  return http({
    method: 'GET',
    url: 'maai/assess/entity/page',
    params: paramObj
  })
}

/**
 * 添加评定记录时回显数据
 */
export function latestOfYearAssessRecordListApi(paramObj) {
  return http({
    method: 'GET',
    url: 'maai/assess/latestOfYearAssessRecord/list',
    params: paramObj
  })
}

/**
 * 添加评定记录
 */
export function addApi(paramObj) {
  return http({
    method: 'POST',
    url: 'maai/assess/add',
    data: paramObj
  })
}

/**
 * 评定记录列表
 */
export function assessRecordPageApi(paramObj) {
  return http({
    method: 'GET',
    url: 'maai/assess/page',
    params: paramObj
  })
}



