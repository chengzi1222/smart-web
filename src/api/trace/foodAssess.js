import http from "utils/http";

/**
 * AI区使用情况
*/
export function getAIAreaUsage(params) {
  return http({
    method: 'GET',
    url: '/check/ai/area/list',
    params
  });
}

/**
 * AI各街道使用情况
*/
export function getAIStreetUsage(params) {
  return http({
    method: 'POST',
    url: '/check/ai/street/list',
    data: params
  });
}

/**
 * AI主体使用情况
*/
export function getAIEntityUsage(params) {
  return http({
    method: 'POST',
    url: '/check/ai/entity/list',
    data: params
  });
}

/**
 * 校餐卫士区使用情况
*/
export function getXcwsAreaUsage(params) {
  return http({
    method: 'GET',
    url: '/check/area/list',
    params
  });
}

/**
 * 校餐卫士各街道使用情况
*/
export function getXcwsStreetUsage(params) {
  return http({
    method: 'POST',
    url: '/check/street/list',
    data: params
  });
}

/**
 * 校餐卫士主体使用情况
*/
export function getXcwsEntityUsage(params) {
  return http({
    method: 'POST',
    url: '/check/entity/list',
    data: params
  });
}

/**
 * 配置主体的列表
*/
export function getConfigList(params) {
  return http({
    method: 'POST',
    url: '/check/entity/page/list',
    data: params
  });
}

/**
 * 配置主体-纳入考核
*/
export function saveInclude(params) {
  return http({
    method: 'POST',
    url: '/check/entity/include',
    data: params
  });
}

/**
 * 配置主体-取消纳入考核
*/
export function saveExclude(params) {
  return http({
    method: 'POST',
    url: '/check/entity/include/not',
    data: params
  });
}

/**
 * 校餐卫士使用率标准值配置列表
*/
export function getStandardConfig(params) {
  return http({
    method: 'GET',
    url: '/check/standard/list',
    params
  });
}

/**
 * 校餐卫士使用率标准值配置保存修改
*/
export function updateStandardConfig(params) {
  return http({
    method: 'POST',
    url: '/check/standard/update',
    data: params
  });
}