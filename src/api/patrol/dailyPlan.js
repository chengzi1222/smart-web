import http from "utils/http";

/**
 *  获取日常巡查计划
 */
export function findPlanDaily() {
  return http({
    method: 'GET',
    url: 'patrol/daily/getInfo'
  })
}

/**
 * 编辑日常计划
 */
export function editPlanDaily(planDaily) {
  return http({
      method: 'POST',
      data: planDaily,
      url: 'patrol/daily/edit'
  })
}

/**
 * 编辑日常计划策略
 */
export function editPlanDailyConfig(planDailyConfig) {
  return http({
      method: 'POST',
      data: planDailyConfig,
      url: 'patrol/daily/edit/config'
  })
}