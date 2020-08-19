import http from 'utils/http';

/**
 * 获取配置文件
 */
export function getConfigFile(areaCode, entityType) {
  return http({
    method: 'get',
    url: 'sub/import/config/' + entityType + '/' + areaCode
  });
}

/**
 * 获取下属部门
 */
export function getSubordinate(areaCode, entityType) {
  return http({
    method: 'get',
    url: 'sub/import/subordinate/' + entityType + '/' + areaCode
  });
}

/**
 * 导入
 */
export function add(importInformaion) {
  return http({
    method: 'post',
    url: 'sub/import',
    data: importInformaion
  });
}

/**
 * 审核分页
 */
export function page(page, searchMap) {
  return http({
    method: 'post',
    url: 'sub/import/page/' + page.pageNum + '/' + page.pageSize,
    data: searchMap
  });
}

/**
 * 批量审核
 */
export function review(ids) {
  return http({
    method: 'post',
    url: 'sub/import/review',
    data: ids
  });
}

/**
 * 详情
 */
export function getInfo(entityId) {
  return http({
    method: 'get',
    url: 'sub/import/' + entityId
  });
}

/**
 * 关联文件
 */
export function relation(fileId, entityType) {
  return http({
    method: 'get',
    url: 'sub/import/relation/' + entityType + '/' + fileId
  });
}

/**
 * 关联文件
 */
export function getDept(areaCode) {
  return http({
    method: 'get',
    url: 'sub/import/getDept/' + areaCode
  });
}

/**
 * 删除
 */
export function del(ids) {
  return http({
    method: 'post',
    url: 'sub/import/del',
    data: ids
  });
}
