import http from "utils/http";

/**
 * 记录详情
 * @param recordId 记录Id

 */
export function getDetails(recordId) {
  return http({
    method: 'get',
    url: 'random/record/getDetails/'+recordId
  });
}
