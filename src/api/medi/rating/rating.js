import http from "utils/http";

/**
 *  等级评定列表
 * @param params
 */
export function entityPage(params) {
  return http({
    method:"post",
    url: 'medi/rating/entity/' + params.pageNum + '/' + params.pageSize,
    data: params
  });
}

/**
 *  更新等级评定
 * @param params
 */
export function updateAssessRecord(assessRecord) {
  return http({
    method: 'post',
    url: 'medi/rating/assess/level',
    data: assessRecord
  });
}

/**
 *  获取量化等级评定记录列表
 * @param params
 */
export function recordPage(ratingDto) {
  return http({
    method: 'post',
    url: 'medi/rating/record/' + ratingDto.pageNum + '/' + ratingDto.pageSize,
    data: ratingDto
  });
}

export function getEntityAssessTime(entityId) {
  return http({
    method: 'get',
    url: 'medi/rating/time/' + entityId
  });
}
