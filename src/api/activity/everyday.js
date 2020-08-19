import http from "utils/http";
import qs from "qs";


/********************************************************
 **************        每日现场检查列表         ***************
 ********************************************************/
/**
 *  获取资讯每日检查列表，编辑页面所需初始化数据
 * @param params
 */
export function webInit() {
  return http({
    method: 'get',
    url: 'active/patrol/init'
  });
}

/**
 *  每日检查详情
 * @param params
 */
export function detail(params) {
  return http({
    method: 'get',
    url: 'active/patrol/detail',
    params: params
  });
}

/**
 * 获取每日检查分页列表
 * @param areaCode
 */
export function list(search) {
  return http({
    method: 'post',
    url: 'active/patrol/daily/list',
    data: search
  })
}

/**
 * 获取每日检查整改通过
 * @param areaCode
 */
export function rectify(params) {
  return http({
    method: 'post',
    url: 'active/patrol/rectify',
    data: qs.stringify(params)
  })
}

/**
 * 日期赛选框
 * @param {string} taskId
 */
export function dateSelect(taskId) {
  return http({
    method: 'get',
    url: 'active/date/select/' + taskId
  })
}
