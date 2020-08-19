import http from "utils/http";
import qs from "qs";

/**
 *  获取字典分类列表
 * @param params
 */
export function getDictTypePage(params) {
  return http({
    method: 'post',
    url: 'admin/dict/type/page',
    data: params
  });
}

/**
 *  获取字典分类列表
 * @param params
 */
export function listDictType() {
  return http({
    method: 'post',
    url: 'admin/dict/type/list',
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function editDictType(dictTypeDto) {
  return http({
    method: 'post',
    url: 'admin/dict/type/update',
    data: qs.stringify(dictTypeDto)
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function pageDict(params) {
  return http({
    method: 'post',
    url: 'admin/dict/page',
    data: params
  });
}

/**
 *  获取字典列表
 * @param params
 */
export function listDict() {
  return http({
    method: 'post',
    url: 'admin/dict/list',
  });
}

/**
 *  获取字典-分类列表
 * @param params
 */
export function listDictGroupType(areaCode) {
  return http({
    method: 'post',
    url: 'admin/dict/listGroupType',
    data: qs.stringify({ "areaCode": areaCode })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function pageDictUser(params) {
  return http({
    method: 'post',
    url: 'admin/dict/user/page',
    data: params
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function getDictById(dictId) {
  return http({
    method: 'post',
    url: 'admin/dict/getDictById',
    data: qs.stringify({ "dictId": dictId })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function getDictUserById(dictId) {
  return http({
    method: 'post',
    url: 'admin/dict/user/getDictById',
    data: qs.stringify({ "dictId": dictId })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function listDictItemById(dictId) {
  return http({
    method: 'post',
    url: 'admin/dict/listDictItemById',
    data: qs.stringify({ "dictId": dictId })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function listDictUserItemByDictId(dictId) {
  return http({
    method: 'post',
    url: 'admin/dict/user/listDictItemById',
    data: qs.stringify({ "dictId": dictId })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function listDictItemByDictCode(dictCode) {
  return http({
    method: 'post',
    url: 'admin/dict/listDictItemByDictCode',
    data: qs.stringify({ "dictCode": dictCode })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function listDictUserItemByDictCode(dictCode) {
  return http({
    loading: false,
    method: 'post',
    url: 'admin/dict/user/listDictItemByDictCode',
    data: qs.stringify({ "dictCode": dictCode })
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function updateDict(dict) {
  return http({
    method: 'post',
    url: 'admin/dict/update',
    data: dict
  });
}

/**
 *  修改字典分类
 * @param params
 */
export function updateDictUser(dictUser) {
  return http({
    method: 'post',
    url: 'admin/dict/user/update',
    data: dictUser
  });
}
