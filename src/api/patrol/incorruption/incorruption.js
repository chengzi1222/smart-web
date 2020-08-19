import http from "utils/http";

/**
 * 廉洁自律反馈列表
 */
export function getIncorruptionList(data){
  return http({
    method:"POST",
    url:'/patrol/record/feed/list',
    data
  })
}

/**
 * 廉洁自律反馈详情
 */
export function getIncorruptionDetail(data){
  return http({
    method:"POST",
    url:'/patrol/record/feed/detail',
    data
  })
}

/**
 * 廉洁自律反馈批量导出
 */
export function bacthExport(data){
  return http({
    method:"POST",
    url:'/patrol/record/feed/export',
    data
  })
}
