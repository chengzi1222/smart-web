import http from "utils/http";


/**
 * 化妆品日常巡查策略详情
 */
export function getInfo(page) {
  return http({
    method: 'get',
    url: '/cosmetic/daily/info'
  });
}
/**
 * 化妆品日常巡查策略编辑
 */
export function postEdit(page) {
  return http({
    method: 'post',
    url: '/cosmetic/daily/edit',
    data: page
  });
}