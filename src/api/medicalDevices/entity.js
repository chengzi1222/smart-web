import http from "utils/http";
import qs from "qs";

/**
 * 添加主体
 *
 */
export function add(entity) {
  return http({
    method: 'POST',
    url: 'maai/entity/add',
    data: entity
  })
}

/**
 * 主体详情
 *
 */
export function get(entityId) {
  return http({
    method: 'GET',
    url: 'maai/entity/info/' + entityId
  })
} 

/**
 * 主体档案分页
 *
 */
export function page(page, param) {
  return http({
    method: 'POST',
    url: 'maai/entity/page/' + page.pageNum + '/' + page.pageSize,
    data: param
  })
}

/**
 * 编辑主体
 *
 */
export function edit(entity) {
  return http({
    method: 'POST',
    url: 'maai/entity/edit',
    data: entity
  })
}

/**
 * 今日主体提交数量
 *
 */
export function getToDaySubmitEntityCount(entityType) {
  return http({
    method: 'GET',
    url: 'maai/entity/toDaySubmitEntityCount/' + entityType
  })
}

/**
 * 今日主体提交数量
 *
 */
export function del(entityId, delRemark) {
  return http({
    method: 'DELETE',
    url: 'maai/entity/delete/' + entityId + '?delRemark=' + delRemark
  })
}

/**
 * 校验社会信用代码
 *
 */
export function checkCreditCode(entityType, creditCode) {
  return http({
    method: 'GET',
    url: 'maai/entity/creditCode/check' + '?creditCode=' + creditCode + '&entityType=' + entityType
  })
}