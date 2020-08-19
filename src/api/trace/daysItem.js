import http from "utils/httpyb";
/**
 *  单日溯源数
 */
export function daySuyNum(d) {
  return http({
    method: 'post',
    url: '/govapi/detec/daySuyNum',
    data: d
  });
}

/**
 *  溯源分页
 */
export function daySuyPage(params) {
  return http({
    method: 'post',
    url: '/govapi/detec/daySuyPage',
    data: params
  });
}

/**
 *  采购商自动补全
 */
export function buyerAuto(params) {
  return http({
    method: 'post',
    url: '/govapi/detec/buyerAuto',
    data: params
  });
}

/**
 *  配送商自动补全
 */
export function dlrAuto(params) {
  return http({
    method: 'post',
    url: '/govapi/detec/dlrAuto',
    data: params
  });
}