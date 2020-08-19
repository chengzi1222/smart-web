import http from "utils/http";
import qs from "qs";

/**
 * 医疗器械工单 - 我的工单
 */
export function postMywork(pageNum, pageSize, params) {
  return http({
    method: 'post',
    url: '/maai/workflow/mywork/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 医疗器械工单 - 撤销工单
 */
export function postRevoke(workId) {
  return http({
    method: 'post',
    url: '/maai/workflow/revoke/' + workId
  });
}

/**
 * 医疗器械工单 - 删除工单
 */
export function postDelete(workId) {
  return http({
    method: 'post',
    url: '/maai/workflow/delete/' + workId
  });
}



