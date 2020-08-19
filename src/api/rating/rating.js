import http from "utils/http";

/**
 *  获取所属区域列表
 * @param params
 */
export function listArea() {
  return http({
    method: 'get',
    url: 'rating/area'
  });
}

/**
 *  等级评定列表
 * @param params
 */
export function listRatingPage(params) {
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'rating/list',
    contentType:"application/json",
    data: params
  });
}

/**
 *  更新等级评定
 * @param params
 */
export function updateAssessRecord(assessRecord) {
  return http({
    method: 'put',
    url: 'rating',
    data: assessRecord
  });
}

/**
 *  获取量化等级评定记录列表
 * @param params
 */
export function listQuantifyLevelAssessRecord(ratingDto) {
  return http({
    method: 'post',
    url: 'rating/assessRecord/quantifyLevel',
    data: ratingDto
  });
}

  /**
   *  获取风险等级评定记录列表
   * @param params
   */
  export function listRiskLevelAssessRecord(ratingDto) {
    return http({
      method: 'post',
      url: 'rating/assessRecord/riskLevel',
      data: ratingDto
    });
}

export function getEntityAssessTime(entityId) {
  return http({
    method: 'get',
    url: 'rating/time/' + entityId
  });
}
