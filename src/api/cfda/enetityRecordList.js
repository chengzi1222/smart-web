import http from 'utils/http';

/**
 *  获取三小档案列表
 * @param prams
 */
export function getBizEntityRecordPage(prams) {
  return http({
    method: 'post',
    url: 'cfda/entity/record/page',
    data: prams
  });
}

/**
 *  导出三小档案列表
 * @param prams
 */
export function cfdaExport(prams) {
  return http({
    method: 'post',
    url: 'cfda/entity/record/export',
    data: prams
  });
}

/**
 *  获取三小状态
 */
export function getSxStatus() {
  return http({
    method: 'post',
    url: 'cfda/entity/getStatus'
  });
}

/**
 *  获取三小类型
 */
export function getCfdaType() {
  return http({
    method: 'post',
    url: 'cfda/getCfdaType'
  });
}

/**
 *  获取三小状态
 */
export function getdeptGrid() {
  return http({
    method: 'post',
    url: 'cfda/entity/grid/getByDept'
  });
}

/**
 *  获取业务状态
 */
export function getBusStatus() {
  return http({
    method: 'post',
    url: 'cfda/work/entity/getBusStatus'
  });
}



