// import http from "utils/httpSchoolTrace";
import http from "utils/http";

/**
 * 预警中心-主体概况-主体类型分布
 */
export function getSubjectDtr() {
    return http({
      method: 'get',
      url: '/ewcenter/bigScreen/entityDistribution',
    })
}

/**
 * 预警中心-主体概况-风险等级分布
 */
export function getRiskLevelDtr() {
  return http({
    method: 'get',
    url: '/ewcenter/bigScreen/riskLevelDtr',
  })
}

//辖区排名
export function getAreaAssess(params) {
    return http({
        method: 'POST',
        url: '/ewArea/rank/list',
        params: params
    });
}

/**
 * 预警中心-主体风险排名
 */
export function getSubRisk(params) {
    return http({
      method: 'get',
      url: '/ewcenter/ewEntityRanking/paging',
      params
    })
  }
  /**
 * 预警中心-主体总数
 */
export function riskTreatment(params) {
  return http({
    method: 'post',
    url: '/ewcenter/bigScreen/riskTreatment',
    params:{
      areaId:'',
      areaName:'',
      month:'2020-06'
    }
  })
}
/**
 * 预警中心-主体概况-主体类型分布
 */
export function entityDistributionDemo() {
  return http({
    method: 'get',
    url: '/ewcenter/bigScreen/entityDistributionDemo',
  })
}

/**
 * 预警中心-主体概况-风险等级分布
 */
export function riskLevelDtrDemo() {
  return http({
    method: 'get',
    url: '/ewcenter/bigScreen/riskLevelDtrDemo',
  })
}
//辖区排名
export function listDemo() {
  return http({
      method: 'POST',
      url: '/ewArea/rank/listDemo',
      params:{
        areaId:'',
        areaName:'',
        month:'2020-06'
      }
  });
}