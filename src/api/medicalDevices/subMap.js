import http from "utils/http";

/** 主体地地图饼图 **/
export function getMapPeiList(entityType) {
  return http({
    method: 'get',
    url: '/maai/entity/map/pie/list?entityType=' + entityType
  });
}

/** 获取下级部门 **/
export function getDeptAndCountList() {
  return http({
    method: 'get',
    url: '/maai/entity/map/deptAndCount/list'
  });
}

/** 获取企业形态 **/
export function getBusClassList(type) {
  return http({
    method: 'get',
    url: '/maai/entity/map/busClass/list?busType='+type
  });
}

/** 分页数据 **/
export function getPaging(num, size, search, type, entityType, areaCode) {
  return http({
    method: 'get',
    url: '/maai/entity/map/paging?pageNum=' + num + '&pageSize=' + size + '&searchStr=' + search + '&entityType=' + entityType + '&classType=' + type + '&areaCode=' + areaCode
  });
}

/** 获取区域定位及主体个数 **/
export function getChilareaList(codeLevel) {
  return http({
    method: 'get',
    url: '/maai/entity/map/chilarea/list?codeLevel=' + codeLevel
  });
}

/** 获取主体详细信息 **/
export function getShowFind(entityId) {
  return http({
    method: 'get',
    url: '/maai/entity/map/show/find?entityId=' + entityId
  });
}