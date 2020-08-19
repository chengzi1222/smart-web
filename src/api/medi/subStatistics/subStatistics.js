import http from "utils/http";

/**
 * 使用主体统计列表
 */
export function getEmploylist(params) {
  return http({
    method: 'post',
    url: '/medi/statisticsform/employlist',
    data: params
  });
}

/**
 * 经营主体统计列表
 */
export function getManagerList(params) {
  return http({
    method: 'post',
    url: '/medi/statisticsform/managerlist',
    data: params
  });
}

/**
 * 所有主体统计列表
 */
export function getAlllist(params) {
  return http({
    method: 'post',
    url: '/medi/statisticsform/alllist',
    data: params
  });
}

/**
 * 主体待办事项
 */
export function getBasic(entityType) {
  return http({
    method: 'get',
    url: '/medi/statistics/basic/' + entityType
  });
}

/**
 * 主体待办事项
 */
export function getEnums(params) {
  return http({
    method: 'post',
    url: '/common/enums',
    data: params
  });
}

/**
 * 所属辖区
 */
export function getGrid() {
  return http({
    method: 'get',
    url: '/common/dept/grid'
  });
}

/**
 * 分布统计图
 */
export function getParticular(entityType, params) {
  return http({
    method: 'post',
    url: '/medi/statistics/particular/' + entityType,
    data: params
  });
}

/**
 * 总体总量趋势图
 */
export function getTotalTrend(entityType, params) {
  return http({
    method: 'post',
    url: '/medi/statistics/totalTrend/' + entityType,
    data: params
  });
}
