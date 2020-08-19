import http from "utils/http";
import qs from "qs";

/**
 * 医疗器械工单 - 获取首次审核工单信息
 */
export function getFirstInfo(workId) {
  return http({
    method: 'post',
    url: '/maai/workflow/getFirstInfo/' + workId,
  });
}

/**
 * 医疗器械工单 - 首次审核
 */
export function postReviewFirst(params) {
  return http({
    method: 'post',
    url: '/maai/workflow/reviewFirst',
    data:params
  });
}

/**
 * 医疗器械工单 - 编辑审核
 */
export function postReviewEdit(params) {
  return http({
    method: 'post',
    url: '/maai/workflow/reviewEdit',
    data:params
  });
}

/**
 * 医疗器械工单 - 获取编辑审核工单信息
 */
export function getEditInfo(workId) {
  return http({
    method: 'post',
    url: '/maai/workflow/getEditInfo/' + workId,
  });
}

/**
 * 医疗器械工单 - 重新审核工单
 */
export function postRework(workId,params) {
  return http({
    method: 'post',
    url: '/maai/workflow/rework/' + workId,
    data:params
  });
}

/**
 * 医疗器械工单 - 审核删除工单
 */
export function postReviewDelete(workId,params) {
  return http({
    method: 'post',
    url: '/maai/workflow/reviewDelete/' + workId,
    data:params
  });
}


