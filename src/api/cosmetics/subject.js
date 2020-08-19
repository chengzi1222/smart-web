import http from "utils/http";
import qs from "qs";
// ----------------------------------------------------------档案---------------------------------------------------------
/**
 * 、档案分页
 * /cosmetic/entity/page/:pageNum/:pageSize
 */
export function page(page, obj) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/page/' + page.pageNum + '/' + page.pageSize,
    data: obj
  });
}
// ------------------------------------------------------------录入---------------------------------------------------------------------

/**
 * 今日草稿箱主体提交数量
 * /cosmetic/entity/getTotalCount
 */
export function getTotalCount(entityType) {
  let obj = {
    "entityType": entityType
  }
  return http({
    method: 'get',
    url: '/cosmetic/entity/getTotalCount',
    params: obj
  });
}
/**
 * 今日主体提交数量
 * /cosmetic/entity/getTotalCount
 */
export function toDaySubmitEntityCount(entityType) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/toDaySubmitEntityCount/' + entityType,
  });
}


/**
 * 录入提交
 * /cosmetic/entity/add
 */
export function addEntity(d) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/add',
    data: d
  });
}


/**
 * 编辑录入提交
 * /cosmetic/entity/add
 */
export function submitChange(d) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/edit',
    data: d
  });
}
/**
 * 录入草稿箱
 * 
 * /cosmetic/entity/addBackup'
 */
export function addBackup(d) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/addBackup',
    data: d
  });
}


/**
 * 草稿箱分页
 * /cosmetic/entity/getBackups/'+page.pageNum+'/'+page.pageSize,
 */
export function getBackups(d, page) {
  d = qs.stringify(d);
  return http({
    method: 'post',
    url: '/cosmetic/entity/getBackups/' + page.pageNum + '/' + page.pageSize,
    data: d,
  });
}

/**
 * 草稿箱详情
 * /cosmetic/entity/add
 */
export function getBackup(d) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/getBackup/' + d,
  });
}
/**
 * 草稿箱删除
 * '/cosmetic/entity/removeBack/'+id,
 */
export function removeBack(id) {
  return http({
    method: 'post',
    url: '/cosmetic/entity/removeBack/' + id,
  });
}


/**
 * 档案详情
 * '/cosmetic/entity/info/'+d,
 */
export function getInfo(d) {
  return http({
    method: 'get',
    url: '/cosmetic/entity/info/' + d,
  });
}
// ------------------------------------------------------------工单部分---------------------------------------------------------------------

/**
 * 化妆品工单 - 备案编辑记录
 * '/cosmetic/workflow/recordPage/:entityId/:pageNum/:pageSize
 */
export function recordPage(params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/recordPage/' + params.params.entityId + '/' + params.pageNum + '/' + params.pageSize,
    data: params.params
  });
}
/**
 * 工单重新申请-》详情
 * '/cosmetic/workflow/getReInfo',
 */
export function getReInfo(params) {
  return http({
    method: 'post',
    url: '/cosmetic/workflow/getReInfo',
    data: qs.stringify(params)
  });
}

/**
 * 工单重新申请-》提交
 * 'cosmetic/workflow/rework'
 */
export function rework(entity) {
  return http({
    method: 'post',
    url: 'cosmetic/workflow/rework',
    data: entity
  });
}