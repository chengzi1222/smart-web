import http from "utils/http";

export function getEntityBaseInfo(entityId) {
  return http({
    method: 'get',
    url: '/food/djpd/entity/baseInfo?id=' + entityId
  });
}

export function uploadFile(params) {
  return http({
    method: 'POST',
    url: '/food/djpd/record/import',
    data:params
  });
}
export function exportList(params) {
  return http({
    method: 'POST',
    url: '/food/djpd/record/export',
    data:params
  });
}
export function list(params) {
  return http({
    method: 'POST',
    url: '/food/djpd/record/score/list',
    data:params
  });
}
export function recordInfo(data) {
  return http({
    method: 'GET',
    url: '/food/djpd/record/info',
    params:data
  });
}
export function commit(params) {
  return http({
    method: 'POST',
    url: '/food/djpd/record/commit',
    data:params
  });
}
export function inspectorList(inspectorName) {
  return http({
      method: 'get',
      url: `/xchc/patrol/inspectorList`,
      params: {
          inspectorName:inspectorName,
          pageNum:1,
          pageSize:10
      }
  })
}
export function staticDetail(id) {
  return http({
      method: 'get',
      url: `/food/djpd/record/static/detail?entityId=${id}`,
  })
}
export function manageList(data) {
  return http({
      method: 'get',
      url: `/food/djpd/table/list`,
      params:data
  })
}
export function projectInfo(id) {
  return http({
      method: 'get',
      url: `/food/djpd/table/content/list?tableId=${id}&contentStatus=ENABLE`,
  })
}
export function projectBaseData(id) {
  return http({
      method: 'get',
      url: `/food/djpd/table/baseInfo?tableId=${id}`,
  })
}
export function recordDynamic(data) {
  return http({
      method: 'get',
      url: `/food/djpd/record/dynamic/list`,
      params:data
  })
}
export function dynamicDetail(id) {
  return http({
      method: 'get',
      url: `/food/djpd/record/dynamic/detail?recordId=${id}`,
  })
}