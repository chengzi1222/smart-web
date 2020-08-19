import http from "utils/http";
import qs from "qs";

/**
 * 获取配置文件
 *
 */
export function findPlanDaily() {
  return http({
    method: 'GET',
    url: 'maai/daily/info'
  })
}

/**
 * 编辑日常计划
 */
export function editPlanDaily(planDaily) {
  return http({
      method: 'POST',
      data: planDaily,
      url: 'maai/daily/edit'
  })
}

/**
 * 编辑日常计划策略
 */
export function editPlanDailyConfig(planDailyConfig) {
  return http({
      method: 'POST',
      data: planDailyConfig,
      url: 'maai/daily/edit/config'
  })
}