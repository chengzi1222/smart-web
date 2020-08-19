import http from "utils/httpFood";

/**
 *  预警总数
 */
export function postTotal(params) {
  return http({
    method: 'post',
    url: 'sourceFill/tog/warn/total',
    data: params
  });
}
/**
 *  预警列表
 */
export function postList(params) {
  return http({
    method: 'post',
    url: 'sourceFill/tog/warn/list',
    data: params
  });
}
/**
 *  预警详情
 */
export function postDetail(params) {
  return http({
    method: 'post',
    url: 'sourceFill/tog/warn/detail',
    data: params
  });
}