/**
 * Created by KLJ on 2017/8/17.
 */
import http from 'utils/http'
import http2 from 'utils/httpTobArea'
import qs from 'qs';

/**
 *
 * @param params
 * @param size
 * @param num
 */
export function list(params, size, num) {
  let data = {
    params: params,
    size: size,
    num: num
  }
  return http({
    method: 'get',
    url: 'admin/area/list',
    data
  })
}

export function addArea(dto) {
  let data = dto;
  return http({
    method: 'post',
    url: 'admin/area/add',
    data
  })
}

export function update(dto) {
  let data = qs.stringify(dto);
  return http({
    method: 'post',
    url: 'admin/area/update',
    data
  })
}

export function getTobArea(dto) {
  let data = qs.stringify(dto);
  return http2({
    method: 'post',
    url: '/area/getArea',
    data
  })
}



export function getAreaChildren(pid) {
  let data = qs.stringify({
    parentCode: pid
  });
  return http({
    method: 'post',
    url: 'admin/area/get/children',
    data
  })

}
/**
 * 查询部门集合
 * @param params.areaCode 数据编码
 * @param params.deptType 部门类型
 */
export function getDeptPage(params) {
  return http({
    method: 'post',
    url: 'admin/area/get/dept/page',
    data: params
  })
}

/**
 * 查询部门集合
 * @param areaCode 数据编码
 */
export function getByAreaCode() {
  return http({
    method: 'post',
    url: 'admin/area/getAreaCode'
  });
}

/**
 * 查询部门集合
 * @param areaCode 数据编码
 */
export function listExistsDept() {
  return http({
    method: 'post',
    url: 'admin/area/listExistsDept'
  });
}
