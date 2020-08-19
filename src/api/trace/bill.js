import http from "utils/httpyb";

/**
 *  学校自动补全
 */
export function buyerAuto(params) {
  return http({
    method: 'post',
    url: '/govapi/detec/buyerAuto',
    data: params
  });
}
/**
 *  品类
 */
export function pdtType() {
  return http({
    method: 'post',
    url: '/govapi/bill/pdttype',
  });
}

/**
 *  获取各类型账单
 */
export function postMain(params) {
  return http({
    method: 'post',
    url: 'govapi/bill/all',
    data: params
  });
}

/**
 *  获取学校分页
 */
export function postPage(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/schoolpage',
    data: d
  });
}

/**
 *  某个采购商账单数据
 */
export function postDetail(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/echart',
    data: d
  });
}

/**
 *  订单明细分页数据
 */
export function odpage(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/odpage',
    data: d
  });
}


/**
 *  订单明细分页数据
 */
export function money(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/money',
    data: d
  });
}


/**
 *  订单明细二级数据
 */
export function billOdpage(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/oddpage',
    data: d
  });
}


/**
 *  各类型消费前十数据
 */
export function pdtlist(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/pdtlist',
    data: d
  });
}

/**
 *  订单明细折线图数据
 */
export function line(d) {
  return http({
    method: 'post',
    url: 'govapi/bill/linechart',
    data: d
  });
}

/**
 *  交易明细
 */
export function tradeDetailList(params) {
    return http({
        method: 'get',
        url: '/govapi/saasdetec/buy/detail/list',
        params
    });
}

/**
 *  交易明细导出
 */
export function tradeDetailExport(params) {
    return http({
        method: 'get',
        url: '/govapi/saasdetec/buy/detail/export',
        params
    });
}