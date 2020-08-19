import http from "utils/http";
import qs from "qs";

/**
 *  得到接待商和监管人的位置
 */
export function getLocation(d) {
  let dd = qs.stringify(d)
  return http({
    method: 'post',
    url: '/active/screen/location',
    data: dd
  });
}

/**
*  得到接待商的详情
*/
export function getReceptionInfo(d) {
  let dd = qs.stringify(d)
  return http({
    method: 'post',
    url: '/active/screen/reception',
    data: dd
  });
}

/**
*  得到监管人员的详情
*/
export function getSupervisor(d) {
  let dd = qs.stringify(d)
  return http({
    method: 'post',
    url: '/active/screen/manainfo',
    data: dd
  });
}


/**
* 最新的盒饭检查
*/
export function getNewBoxRecord(d) {
  let dd = qs.stringify(d)
  return http({
    method: 'post',
    url: '/active/screen/newboxrecord',
    data: dd
  });
}
/**
* 最新的现场检查
*/
export function getNewSceneRecode(d) {
  let dd = qs.stringify(d)
  return http({
    method: 'post',
    url: '/active/screen/newscenerecode',
    data: dd
  });
}