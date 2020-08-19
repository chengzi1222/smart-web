import http from "utils/httpMarket";

//市区街道-王桃
/* 节点和经营者总数 */
export function getNodeBussCount(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/nodeBussCount',
    params
  });
}
/* 各个区域下的节点个数统计 */
export function getAreaSNode(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/areaSNode',
    params
  });
}
/* 区域溯源率 */
export function getAreaSTraceVo(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/area/trace',
    params
  });
}
/* 区域历史12个月溯源率 */
export function getAreaSTraceVoHistory(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/area/trace/history',
    params
  });
}
/* 实时溯源数据 */
export function getRealTimeTrace(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/realTime/trace',
    params
  });
}
/* 风险品种 */
export function getRiskVariety(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/risk/variety',
    params
  });
}
/* 某个月的检测数据 */
export function getMonthDetec(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/month/detec',
    params
  });
}
/* 实时检测数据 */
export function getRealDetec(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/realDetec',
    params
  });
}
/* 低溯源率TOP5 */
export function getAreaTraceTop(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/area/trace/top',
    params
  });
}
/* 区域溯源率排名 */
export function getAreaTraceRank(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/area/trace/rank',
    params
  });
}
/* 当前区域自己所在排名 */
export function getAreaOwnRank(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/trace/supervise/area/own/rank',
    params
  });
}

//街道以下--吉良
/* 低溯源预警Top5&溯源纳入情况 */
export function getTraceWarning(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/warning/get',
    params
  });
}
/* 月度溯源使用情况 */
export function getTraceUse(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/use/get',
    params
  });
}
/* 市场历史溯源平台使用情况趋势 */
export function getTraceTrend(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/trend',
    params
  });
}
/* 商户基本信息 */
export function getMarketInfo(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/info/get',
    params
  });
}
/* 商户历史溯源平台使用情况趋势 */
export function getMonthTrend(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/month/trend/get',
    params
  });
}
/* 溯源检测情况 */
export function getCheckGet(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/check/get',
    params
  });
}
/* 溯源详情列表 */
export function getTraceDetailPaging(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/detail/paging',
    params
  });
}
/* 低溯源率区域 */
export function getTraceLowAreaPaging(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/lowArea/paging',
    params
  });
}
/* 低溯源率市场 */
export function getTraceLowMarketPaging(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/lowMarket/paging',
    params
  });
}
/* 低溯源率主体 */
export function getTraceLowBussPaging(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/trace/lowBuss/paging',
    params
  });
}
/* 获取子区域 */
export function getChildrenAreaFind(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/childrenArea/find',
    params
  });
}
/* 根据区域获取市场 */
export function getNodeList(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/node/list',
    params
  });
}

/* 市场品种数量 */
export function getVariety(params) {
  return http({
    method: 'get',
    url: '/newFstip/api/regulate/market/variety',
    params
  });
}