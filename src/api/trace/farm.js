import http from "utils/httpMarket";

/**
 *  市级区县溯源纳入情况
 */
export function total(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/total?areaId='+params.areaId
  });
}
/**
 *  溯源纳入情况图表
 */
export function areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/total/areas?areaId='+params.areaId
  });
}
/**
 * 平台使用率
 */
export function use(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/use?areaId='+params.areaId+'&date='+params.date
  });
}

/**
 * 平台使用区域划分
 */
export function useareas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/use/areas?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 历史使用情况
 */
export function history(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/use/history?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 实时数据
 */
export function newdata(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/newdata?areaId='+params.areaId
  });
}
/**
 * 纳入总数+区
 */
export function dc(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc?areaId='+params.areaId
  });
}
/**
 * 纳入图表+区
 */
export function dc_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/areas?areaId='+params.areaId
  });
}
/**
 * 低溯源预警top5+区
 */
export function dc_rate_low(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rate/low?areaId='+params.areaId
  });
}
/**
 * 平台使用率+区
 */
export function dc_rate(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rate?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 平台使用图表区域划分+区
 */
export function dc_rate_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rate/areas?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 历史使用情况+区
 */
export function dc_his(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/history?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 纳入总数+街
 */
export function ts(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts?areaId='+params.areaId
  });
}
/**
 * 纳入图表+街
 */
export function ts_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/areas?areaId='+params.areaId
  });
}
/**
 * 低溯源预警top5+街
 */
export function ts_rate_low(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/rate/low?areaId='+params.areaId
  });
}
/**
 * 平台使用率+街
 */
export function ts_rate(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/rate?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 平台使用图表区域划分+街
 */
export function ts_rate_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/rate/areas?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 历史使用情况+街
 */
export function ts_his(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/history?areaId='+params.areaId+'&date='+params.date
  });
}

/**
 * 纳入总数+市场
 */
export function marketNumber(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/market?nodeId='+params.nodeId+'&nodeName='+params.nodeName
  });
}
/**
 * 预警+市场
 */
export function market_low(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/market/low?nodeId='+params.nodeId+'&nodeName='+params.nodeName
  });
}
/**
 * 平台使用率+市场
 */
export function market_rate(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/market/rate?nodeId='+params.nodeId+'&nodeName='+params.nodeName+'&date='+params.date
  });
}
/**
 * 平台使用图表区域划分+市场
 */
export function market_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/market/areas?nodeId='+params.nodeId+'&nodeName='+params.nodeName+'&date='+params.date
  });
}
/**
 * 历史使用情况+市场
 */
export function market_his(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/market/history?nodeId='+params.nodeId+'&nodeName='+params.nodeName+'&date='+params.date
  });
}
/**
 * 区县排名
 */
export function rankNum(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rank?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 区县排名列表
 */
export function rankList(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rank/areas?areaId='+params.areaId+'&date='+params.date
  });
}


/**
 * 市区检测实时数据
 */
export function det_newdata(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/newdata?areaId='+params.areaId
  });
}

/**
 * 市区检测风险品种
 */
export function det_risk(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/risk?areaId='+params.areaId+'&date='+params.date
  });
}

/**
 * 市区检测情况
 */
export function det(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det?areaId='+params.areaId+'&date='+params.date
  });
}


/**
 * 市区检测数据
 */
export function det_areas(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/areas?areaId='+params.areaId+'&date='+params.date
  });
}



/**
 * 经营者总数
 */
export function total_biz(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/total/biz?areaId='+params.areaId
  });
}

/**
 * 街道市场总数
 */
export function ts_market(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/ts/market?areaId='+params.areaId
  });
}


/**
 * 街道排名列表
 */
export function street_rank_list(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/dc/rank/street?areaId='+params.areaId+'&date='+params.date
  });
}


/**
 * 街道排名名次
 */
export function street_rank_num(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/rank/street?areaId='+params.areaId+'&date='+params.date
  });
}




/**
 * 检测实时数据(qu)
 */
export function det_newdata_qu(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/county/newdata?areaId='+params.areaId
  });
}
/**
 *检测风险品种(qu)
 */
export function det_risk_qu(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/risk/county?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 检测情况（qu）
 */
export function det_areas_qu(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/countys?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 检测饼图（qu）
 */
export function det_qu(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/county?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 实时溯源数据（qu）
 */
export function newdata_qu(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/area/newdata?areaId='+params.areaId
  });
}

/**
 * 检测实时数据(jie)
 */
export function det_newdata_jie(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/street/newdata?areaId='+params.areaId
  });
}
/**
 *检测风险品种(jie)
 */
export function det_risk_jie(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/risk/street?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 检测情况(jie)
 */
export function det_areas_jie(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/streets?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 检测饼图(jie)
 */
export function det_jie(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/det/street?areaId='+params.areaId+'&date='+params.date
  });
}
/**
 * 实时溯源数据(jie)
 */
export function newdata_jie(params) {
  return http({
    method: 'get',
    url: '/fstip/v1/stat/retailer/street/newdata?areaId='+params.areaId
  });
}