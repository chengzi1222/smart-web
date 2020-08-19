import http from "utils/http";
import qs from "qs";

/**
 *  获取字典分类列表
 * @param params
 */
export function pageSub(params) {
  return http({
    method: 'post',
    url: 'sub/page',
    data: params
  });
}

/**
 *  导出主体档案列表
 * @param prams
 */
export function moreExport(prams) {
  debugger
  return http({
    method: 'post',
    url: 'sub/export',
    data: prams
  });
}

/**
 *  获取字典分类列表
 * @param params
 */
export function listNatureType() {
  return http({
    method: 'post',
    url: 'env/sub/listNatureType'
  });
}

/**
 *  获取字典分类列表
 * @param params
 */
export function listStateType() {
  return http({
    method: 'post',
    url: 'env/sub/listStateType'
  });
}

/**
 * 根据主体ID获取详情
 * @param entityId
 */
export function getSubInfo(entityId) {
  return http({
    loading:true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'sub/common/getSubInfo',
    data: qs.stringify({entityId:entityId})
  });
}

/**
 * 根据ID获取工单详情
 * @param workId
 */
export function getWorkSubInfo(workId) {
  return http({
    method: 'post',
    url: 'sub/common/getSubWorkInfo',
    data: qs.stringify({workId:workId})
  });
}
