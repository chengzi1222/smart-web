import http from "utils/http";
import qs from "qs";

/**
 *  添加
 */
export function save(params) {
  return http({
    method: 'post',
    url: 'admin/home/save',
    data: params
  });
}

/**
 *  编辑
 */
export function edit(params) {
    return http({
      method: 'post',
      url: 'admin/home/edit',
      data: params
    });
}

/**
 *  详情
 */
export function detail(params) {
    return http({
      method: 'get',
      url: 'admin/home/detail',
      params: params
    });
}

/**
 *  分页
 */
export function paging(params) {
    return http({
      method: 'get',
      url: 'admin/home/paging/' + params.pageNum + '/' + params.pageSize
    });
}

/**
 *  删除
 */
export function del(params) {
    return http({
      method: 'get',
      url: 'admin/home/delete',
      params: params
    });
}