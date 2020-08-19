import http from "utils/http";
/**
 * 、化妆品限期整改 - 复查和已复查列表
 * /cosmetic/repatrol/page/{pageNum}/{pageSize}
 */
export function page(page) {
  return http({
    method: 'post',
    url: '/maai/repatrol/page/' + page.pageNum + '/' + page.pageSize,
    data: page
  });
}

/**
 * 、化妆品限期整改 - 根据区域获取整改复查记录数量
 * /cosmetic/repatrol/count
 */
export function countByStateAndAreaCode() {
  return http({
    method: 'post',
    url: '/maai/repatrol/count',
  });
}


/**
 * 、化妆品限期整改 - 复查基础信息
 *'/cosmetic/repatrol/detail/bascInfo'
 */
export function getBascInfo(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/bascInfo',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 详情巡查项
 *'/cosmetic/repatrol/detail/patrolContext'
 */
export function listRepatrolRecordContext(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/patrolContext',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 详情巡查项
 *'/cosmetic/repatrol/detail/result'
 */
export function getResultInfo(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/detail/result',
    data: obj
  });
}


/**
 * 、化妆品限期整改 - 监管人员/陪同人员（信息员）
 *'/cosmetic/repatrol/supPerson
 */
export function get_soList_or_infoList(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/supPerson',
  });
}

/**
 * 、化妆品限期整改 - 添加复查记录

 *'/cosmetic/repatrol/update
 */
export function update(obj) {
  return http({
    method: 'post',
    url: '/maai/repatrol/update',
    data: obj
  });
}
