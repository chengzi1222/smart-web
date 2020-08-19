import http from "utils/http";
import httpSchoolTrace from "utils/httpSchoolTrace";
import qs from "qs";

// 校餐卫士

export function getDictListByType(params) {
  return http({
    method: 'GET',
    url: '/food/guard/dict/list',
    params: params
  });
}

export function entityPage(pageNum, pageSize, params) {
  return http({
    method: 'GET',
    url: '/food/guard/entity/' + pageNum + '/' + pageSize + '/paging',
    params: params
  });
}

export function getAreaTree(parentId) {
  return http({
    method: 'GET',
    url: '/food/guard/areaTree/find?parentId=' + parentId,
  });
}

// 证照管理

export function licensePage(pageNum, pageSize, params) {
  return http({
    method: 'GET',
    url: '/food/guard/license/' + pageNum + '/' + pageSize + '/paging',
    params: params
  });
}

export function getLicense(entityId) {
  return http({
    method: 'GET',
    url: '/food/guard/license/get?entityId=' + entityId
  });
}

export function licenseExport(pageNum, pageSize, params) {
  return http({
    method: 'GET',
    url: '/food/guard/license/' + pageNum + '/' + pageSize + '/export',
    params: params
  });
}
// 投述反馈列表
export function complaintPage(pageNum, pageSize, params) {
  return http({
    method: 'GET',
    url: '/food/guard/complaint/' + pageNum + '/' + pageSize + '/paging',
    params: params
  });
}

// 投述反馈详情
export function complaintInfo(id) {
  return http({
    method: 'GET',
    url: '/food/guard/complaint/' + id + '/find'
  });
}

// 投述反馈反馈
export function feedbackUpdate(data) {
  return http({
    method: 'POST',
    url: '/food/guard/complaint/feedback/update',
    data: data
  });
}

// 投述反馈 关闭,恢复
export function closeOpen(id, type, closeCause) {
  return http({
    method: 'GET',
    url: '/food/guard/complaint/closeOpen?id=' + id + '&type=' + type + '&closeCause=' + closeCause
  });
}

//等级评定
export function assessQualityLevel(params) {
  return http({
    method: 'POST',
    url: '/food/guard/assessQualityLevel',
    params: params
  });
}
//h5大屏-获取访问密匙
export function getSecretKey() {
  return http({
    method: 'GET',
    url: '/hfive/getSecretKey',
  });
}

export function xcwsEntityQrcode(data) {
  return httpSchoolTrace({
      url: '/api/guard/system/xcwsEntityQrcode/find',
      method: 'GET',
      params:data
  })
}