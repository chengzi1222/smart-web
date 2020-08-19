//首页api

import http from "../utils/http";
import httpyb from "../utils/httpyb";
import qs from "qs";

/**
 * 日常巡查
 */
export function getDaily(startTime,endTime) {
    return http({
      method: 'post',
      url: '/patrol/statistics/chart/daily',
      data:{
        startDate:startTime,
        endDate:endTime
      }
    })
}

// 巡查结果分布
export function getPatrolResult(startDate,endDate) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/patrolResult',
    data:{
      startDate:startDate,
      endDate:endDate
    }
  });
}


//排行
export function getTotalPatrol(startDate=null,endDate=null,quanLevel=null,riskLevel=null) {
  // let url = 'patrol/statistics/chart/totalPatrol';

  // if(startDate){
  //   url = 'patrol/statistics/chart/totalPatrol?startDate=' + startDate
  // }
  // if(endDate){
  //   url = 'patrol/statistics/chart/totalPatrol?endDate=' + endDate
  // }

  // if(startDate && endDate){
  //   'patrol/statistics/chart/totalPatrol?startDate=' + startDate + '&endDate=' + endDate
  // }
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/entityCoverage',
    data:{
      startDate,
      endDate,
      quanLevel,
      riskLevel
    }
  });
}

/**
 * 专项巡查巡查
 */
export function getSpecial(startTime=null,endTime=null) {
    return http({
      method: 'post',
      url: '/patrol/statistics/chart/special',
      data:{
        startDate:startTime,
        endDate:endTime
      }
    })
}

/**
 * 巡查动态
 */
export function getEynamic() {
    return http({
      method: 'get',
      url: '/patrol/statistics/dynamic'
    })
}

/**
 * 主体相关统计
 */
export function getHomeEntityStat() {
    return http({
      method: 'get',
      url: '/statistics/homeEntityStat'
    })
}

/**
 * 巡查相关统计
 */
export function getPatrolPlanRecord() {
    return http({
      method: 'get',
      url: '/patrol/statistics/patrolPlanRecord'
    })
}

/**
 * 阳光统计
 */
export function getStatsCamera() {
    return http({
      method: 'get',
      url: '/carema/statsCamera'
    })
}

/**
 * 主体数量统计
 */
export function getStatsEntity(type) {
    return http({
      method: 'get',
      url: `/entity/map/chart?type=${type}`
    })
}

/**
 * 首页检测动态
 */
export function getStatsDynamic(areaId) {
    return httpyb({
      method: 'post',
      url: `/govapi/detec/dynamic`,
      data: qs.stringify({"areaId": areaId})
    })
}

/**
 * 首页检测数据
 */
export function getStatsSuySta(areaId) {
    return httpyb({
      method: 'post',
      url: `govapi/detec/suySta`,
      data: qs.stringify({"areaId": areaId})
    })
}

