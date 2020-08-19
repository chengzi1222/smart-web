import http from "utils/http";
import qs from "qs";

/**
 *  截图
 * @param params
 */
export function screenShot_(params) {
  return http({
    method: 'post',
    url: 'camera/shot/screenShot',
    data: params
  });
}

/**
 *  截图列表
 * @param params
 */
export function findPage(formData) {
  return http({
    method: 'post',
    url: 'camera/shot/findPage/'+formData.num+"/"+formData.size,
    data: formData.params
  });
}

/**
 *  保存截图
 * @param params
 */
export function addscreenShot(params) {
  return http({
    method: 'post',
    url: 'camera/shot/addscreenShot',
    data: params
  });
}

/**
 *  获取用户字典项列表(所有字段)
 * @deprecated
 */
export function listDictUserItemByCodeAll(dictCode) {
  return http({
    method: 'post',
    url: 'env/dict/listDictUserItemByCodeAll',
    data: qs.stringify({ "dictUserCode": dictCode })
  });
}
