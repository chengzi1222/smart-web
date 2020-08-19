import http from "utils/http";
import qs from "qs";

// 设备分页
export function getDeviceList(data) {
  let params = {
    keysWord: data.keysWord,
    sort: data.sort
  }
  return http({
    method: 'GET',
    url: `/sensor/device/paging/${data.pageNum}/${data.pageSize}`,
    params
  });
}

// 设备参数记录分页
export function getDeviceRecordList(data) {
  let params = {
    keysWord: data.keysWord,
    label: data.label,
    startDate: data.startDate,
    endDate: data.endDate,
    state: data.state
  }
  return http({
    method: 'GET',
    url: `/sensor/device/monitor/record/paging/${data.pageNum}/${data.pageSize}`,
    params
  });
}

// 设备详情
export function getDeviceDetail(params) {
  return http({
    method: 'GET',
    url: '/sensor/device/detail',
    params
  });
}

// 设备批量禁用，启用
export function deviceEnable(params) {
  return http({
    method: 'GET',
    url: `/sensor/device/enable?ids=${params.ids}&state=${params.state}`,
    // data
  });
}

// 设备添加
export function deviceAdd(data) {
  return http({
    method: 'POST',
    url: '/sensor/device/save',
    data
  });
}

// 设备更新
export function deviceUpdate(data) {
  return http({
    method: 'POST',
    url: '/sensor/device/update',
    data
  });
}

// 更新设备参数标签
export function deviceLabelUpdate(data) {
  return http({
    method: 'POST',
    url: '/sensor/device/update/label/list',
    data
  });
}