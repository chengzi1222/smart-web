import http from "utils/http";

/**
 *   大数据-食品主体属性分布
 */
export function getSubjectDistribution(params) {
  return http({
    method: 'get',
    url: '/bigdataview/food/subjectDistribution',
    params
  });
}
/**
 *   大数据-食品主体增长趋势
 */
export function getSubjectGrowthTrend() {
  return http({
    method: 'get',
    url: '/bigdataview/food/subjectGrowthTrend'
  });
}
/**
 *   大数据-摄像头主体覆盖率与摄像头数量
 */
export function getReportCameraData(params) {
  return http({
    method: 'post',
    url: '/bigdataview/food/reportCameraData',
    params
  });
}
/**
 *   大数据-摄像头点位信息与视频流地址
 */
export function getReportAllCameraAddr(params) {
  return http({
    method: 'post',
    url: '/bigdataview/food/reportAllCameraAddr',
    params
  });
}
/**
 *   大数据-食品下级辖区主体分布
 */
export function getSubOrdinateEntityDistribution(params) {
  return http({
    method: 'get',
    url: '/bigdataview/food/subOrdinateEntityDistribution',
    params
  });
}

/**
 *   大数据-食品下级辖区主体分布
 */
export function getCircle(params) {
  return http({
    method: 'get',
    url: '/bigdataview/food/map/circle',
    params
  });
}

/**
 *   大数据-食品下级辖区主体分布
 */
export function getPoint(params) {
  return http({
    method: 'get',
    url: '/bigdataview/food/map/point',
    params
  });
}
