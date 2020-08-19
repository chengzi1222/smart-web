import http from "utils/http";

/**
 * 药品主体添加
 * @param {*} entity
 */
export function addEntity(entity) {
  return http({
    method: 'post',
    url: 'medi/subject/add',
    data: entity
  });
}

/**
 * 药品主体分页
 * @param {*} page
 * @param {*} searchMap
 */
export function page(page, searchMap) {
  return http({
    method: 'post',
    url: '/medi/subject/page/' + page.pageNum + '/' + page.pageSize,
    data: searchMap
  })
}

export function getInfo(entityId) {
  return http({
    method: 'get',
    url: '/medi/subject/info/' + entityId
  })
}

export function toDaySubmitEntityCount(entityType, entityTypeExt) {
  return http({
    method: 'post',
    url: '/medi/subject/toDaySubmitEntityCount/' + entityType + '/' + entityTypeExt
  })
}

export function addBackup(entity) {
  return http({
    method: 'post',
    url: '/medi/subject/addBackup',
    data: entity
  })
}

export function getBackups(page, entityType, entityTypeExt) {
  return http({
    method: 'post',
    url: '/medi/subject/getBackups/' + page.pageNum + '/' + page.pageSize,
    params: {
      entityType: entityType,
      entityTypeExt: entityTypeExt
    }
  })
}

export function getBackup(backupId) {
  return http({
    method: 'post',
    url: '/medi/subject/getBackup/' + backupId
  })
}

export function removeBack(backupId) {
  return http({
    method: 'post',
    url: '/medi/subject/removeBack/' + backupId
  })
}

export function getTotalCount(entityType, entityTypeExt) {
  return http({
    method: 'get',
    url: '/medi/subject/getTotalCount',
    params: {
      entityType: entityType,
      entityTypeExt: entityTypeExt
    }
  })
}

export function submitChange(entity) {
  return http({
    method: 'post',
    url: '/medi/subject/edit',
    data: entity
  })
}
