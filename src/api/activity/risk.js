import http from "utils/http";
import qs from "qs";


/********************************************************
 **************        风险评估检查列表         ***************
 ********************************************************/
/**
 *  获取资讯风险评估列表，编辑页面所需初始化数据
 * @param params
 */
export function webInit() {
  return http({
    method: 'get',
    url: 'active/patrol/init'
  });
}

/**
 *  风险评估详情
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
 * 获取风险评估分页列表
 * @param areaCode
 */
export function list(search) {
  return http({
    method: 'post',
    url: 'active/patrol/risk/list',
    data: search
  })
}

/**
 * 风险评估整改通过
 * @param areaCode
 */
export function rectify(params) {
  return http({
    method: 'post',
    url: 'active/patrol/rectify',
    data: qs.stringify(params)
  })
}
