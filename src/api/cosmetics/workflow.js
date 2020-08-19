import http from "utils/http";
import qs from "qs";

/**
 * 化妆品工单 - 我的工单
 */
export function postMywork(pageNum, pageSize, params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/mywork/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 化妆品工单 - 撤销工单
 */
export function postRevoke(workId) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/revoke/' + workId
  });
}

/**
 * 化妆品工单 - 删除工单
 */
export function postDelete(workId) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/delete/' + workId
  });
}









//编辑审核


/**
 * 化妆品工单 - 工单列表
 */
export function postWorkPage(pageNum, pageSize, params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/page/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 化妆品工单 - 统计-待审核/已归档/已驳回
 */
export function getTotal(params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/getTotal',
    data: qs.stringify(params)
  });
}

/**
 * 化妆品工单 - 获取首次工单信息
 */
export function getFirstInfo(workId) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/getFirstInfo/' + workId
  });
}

/**
 * 化妆品工单 - 首次工单审核
 */
export function postReviewFirst(params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/reviewFirst',
    data: params
  });
}

/**
 * 化妆品工单 - 编辑审核
 */
export function postReviewEdit(params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/reviewEdit',
    data: params
  });
}

/**
 * 化妆品工单 - 获取编辑工单信息
 */
export function getEditInfo(workId) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/getEditInfo/' + workId
  });
}