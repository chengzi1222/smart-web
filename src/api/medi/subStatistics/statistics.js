import http from "utils/http";

/**
 * 专项巡查概况计划数量
 */
export function getStatPlanStateSpecial(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statPlanStateSpecial',
    data: params
  });
}
/**
 * 专项巡查概况巡查累计次数
 */
export function getStatPatrolCntSpecial(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statPatrolCntSpecial',
    data: params
  });
}
/**
 * 日常巡查概况综合数据+巡查结果分布
 */
export function getStatPatrolResult(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statPatrolResult',
    data: params
  });
}
/**
 * 统计报表
 */
export function getReportFormsDaily(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/reportFormsDaily',
    data: params
  });
}
/**
 * 巡查动态
 */
export function getDailyList(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/daily/list',
    data: params
  });
}
/**
 * 累计巡查次数
 */
export function getStatResultOfChild() {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statResultOfChild'
  });
}
/**
 * 主体覆盖率
 */
export function getStatCoverOfChild(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statCoverOfChild',
    data: params
  });
}
/**
 * 巡查处理方式分布
 */
export function getStatPatrolTreat(params) {
  return http({
    method: 'post',
    url: '/medi/stat/patrol/statPatrolTreat',
    data: params
  });
}

  /**
   * 巡查处理方式分布
   */
  export function statDayliExpired() {
    return http({
      method: 'get',
      url: '/medi/stat/patrol/statDayliExpired'
    });
  }

