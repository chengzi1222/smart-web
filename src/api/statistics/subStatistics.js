import http from 'utils/http';


export function subNumberTotal(entityType) {
  return http({
    method: 'get',
    url: 'statistics/sub/subNumberTotal',
    params: {
      entityType: entityType
    }
  });
}

export function subByType(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByType',
    data:params
  });
}

export function subByRisk(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByRisk',
    data:params
  });
}

export function subByQuantify(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByQuantify',
    data:params
  });
}

export function subByNatureType(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByNatureType',
    data:params
  });
}

export function subByArea(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByArea',
    data:params
  });
}

export function subByTrend(params) {
  return http({
    method: 'post',
    url: 'statistics/sub/subByTrend',
    data:params
  });
}


