import http from "utils/httpyb";
import httpTog from "utils/http";

/**
 *  获取各类型主体数据
 */
export function postMain(params) {
  return http({
    method: 'post',
    url: 'govapi/sub/subnum',
    data: params
  });
}

/**
 *  获取主体数据分页
 */
export function postPage(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/subpage',
    data: d
  });
}


/**
 *  获取订单汇总
 */
export function postOrder(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/order',
    data: d
  });
}


/**
 *  获取订单汇总
 */
export function postRelationpage(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/relationpage',
    data: d
  });
}


/**
 *  获取订单分页数据
 */
export function postOrderPage(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/opage',
    data: d
  });
}


/**
 *  获取订单分页数据
 */
export function postOdpagePage(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/odpage',
    data: d
  });
}


/**
 *  获取溯源商品列表数据
 */
export function postOdlist(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/odlist',
    data: d
  });
}

/**
 *  获取溯源商品列表数据
 */
export function postSuy(d) {
  return http({
    method: 'post',
    url: 'govapi/sub/suy',
    data: d
  });
}





/**
 *  获取检测汇总批次数据
 */
export function postSum(d) {
  return http({
    method: 'post',
    url: 'govapi/detec/sum',
    data: d
  });
}

/**
 *  获取检测汇总批次分页数据
 */
export function postDspage(d) {
  return http({
    method: 'post',
    url: 'govapi/detec/dspage',
    data: d
  });
}

/**
 *  获取配送商检测批次分页数据
 */
export function postDetpage(d) {
  return http({
    method: 'post',
    url: 'govapi/detec/detpage',
    data: d
  });
}

/**
 *  获取配送商检测详情
 */
export function postDetail(d) {
  return http({
    method: 'post',
    url: 'govapi/detec/detdetail',
    data: d
  });
}



/**
 *  获取价格预警列表
 */
export function postBuyerpage(d) {
  return http({
    method: 'post',
    url: 'govapi/price/buyerpage',
    data: d
  });
}

/**
 *  获取价格预警异常总数
 */
export function postPdts(d) {
  return http({
    method: 'post',
    url: 'govapi/price/pdts',
    data: d
  });
}

/**
 *  获取预警详情
 */
export function postPdtpage(d) {
  return http({
    method: 'post',
    url: 'govapi/price/pdtpage',
    data: d
  });
}

/**
 *  获取预警详情echart
 */
export function postEchart(d) {
  return http({
    method: 'post',
    url: 'govapi/price/echart',
    data: d
  });
}



/**
 *  获取考核分析使用情况
 */
export function postRate(d) {
  return http({
    method: 'post',
    url: 'govapi/assess/rate',
    data: d
  });
}

/**
 *  获取考核分析学校数据
 */
export function postAssPage(d) {
  return http({
    method: 'post',
    url: 'govapi/assess/page',
    // data: d
    params: d
  });
}

/**
 *  获取考核分析echarts
 */
export function postCompare(d) {
  return http({
    method: 'post',
    url: 'govapi/assess/compare',
    data: d
  });
}


/**
 *  获取排名
 */
export function postRank(d) {
  return http({
    method: 'post',
    url: 'govapi/assess/rank',
    data: d
  });
}


/**
 *  获取排名
 */
export function postTrend() {
  return http({
    method: 'get',
    url: 'govapi/tfdetec/trend'
  });
}


/**
 *  4k大屏阳光厨房
 */
export function getSchoolDetail(guid) {
  return http({
    method: 'get',
    url: 'govapi/school/guard/schoolDetail',
    params: guid
  });
}


/**
 *  4k大屏搜索学校
 */
export function postSubAutoSchool(guid) {
  return http({
    method: 'post',
    url: 'govapi/detec/subAutoSchool',
    data: guid
  });
}
/**
 *  4k大屏地图线
 */
export function getLine(guid) {
  return http({
    method: 'get',
    url: 'govapi/traceDetail/line',
    params: guid
  });
}
/**
 *  4k大屏地图线
 */
export function getLineBuyer(guid) {
  return http({
    method: 'get',
    url: 'govapi/traceDetail/line/buyer',
    params: guid
  });
}
/**
 *  4k大屏今日溯源数据
 */
export function getUnquaPdt(params) {
  return http({
    method: 'get',
    url: 'govapi/tfdetec/unqua/pdt',
    params: params
  });
}
/**
 *  4k大屏学校概况
 */
export function getSchoolInfo(guid) {
  return http({
    method: 'get',
    url: 'govapi/school/guard/schoolInfo?guid='+guid
  });
}

/**
 * 根据逗号隔开的学校guid查询关联的食药所列表
 */
export function findTownFda(params) {
  return httpTog({
    method: 'post',
    url: 'food/yuanben/schfda/findTownFda',
    data: params
  });
}

/*** 轨迹图 */
export function routeOrdergps(params) {
  return http({
    method: 'post',
    url: 'govapi/route/ordergps',
    data: params
  });
}


// 超范围经营预警接口
//列表
export function getWarnPage(params) {
  return httpTog({
    method: 'GET',
    url: '/over/rang/warn/page',
    params
  });
}
//处理
export function getWarnDeal(params) {
  return httpTog({
    method: 'GET',
    url: '/over/rang/warn/deal',
    params
  });
}