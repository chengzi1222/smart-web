import http from "utils/http";

/**  页面初始化选择器列表 */
export function getStaticsInit(entityType) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/init?entityType=' + entityType
  })
}

/**  存活主体总数统计 */
export function getCountEntity(entityType) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/entity?entityType=' + entityType
  })
}

/**  待审核工单统计 */
export function getCountWork(entityType) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/work?entityType=' + entityType
  })
}

/**  企业形态统计 */
export function getCountEnterpriseForm(entityType, quantifyLevel, enterpriseForm, selectAreaCode) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/enterpriseForm?entityType='+entityType+'&quantifyLevel='+quantifyLevel+'&enterpriseForm='+enterpriseForm+'&selectAreaCode='+selectAreaCode
  })
}

/**  量化等级统计 */
export function getCountQuantifyLevel(entityType, quantifyLevel, enterpriseForm, selectAreaCode) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/quantifyLevel?entityType=' + entityType + '&quantifyLevel=' + quantifyLevel + '&enterpriseForm=' + enterpriseForm + '&selectAreaCode=' + selectAreaCode
  })
}

/**  辖区分布统计 */
export function getCountAreaEntity(entityType, quantifyLevel, enterpriseForm, selectAreaCode) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/areaEntity?entityType=' + entityType + '&quantifyLevel=' + quantifyLevel + '&enterpriseForm=' + enterpriseForm + '&selectAreaCode=' + selectAreaCode
  })
}

/**  总体总量趋势统计 */
export function getCountTotality(entityType, startYear, endYear, timeUnit, totalOrNew, selectAreaCode) {
  return http({
    method: 'get',
    url: '/maai/entity/statics/count/totality?entityType=' + entityType + '&startYear=' + startYear + '&endYear=' + endYear + '&timeUnit=' + timeUnit + '&totalOrNew=' + totalOrNew + '&selectAreaCode=' + selectAreaCode
  })
}