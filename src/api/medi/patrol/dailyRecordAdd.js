import http from "utils/http";
import qs from "qs";

//获取主体类型下拉列表
export function getSubTypeList(data) {
  return http({
    method: "post",
    url: "patrol/special/getSubTypeList",
    data: data
  })
}

//获取日常巡查项
export function getDailyContext(data) {
  return http({
    method: "post",
    url: "medi/patrol/getDailyContext",
    params: data
  })
}

//获取专项巡查项
export function getSpecialContext(data) {
  return http({
    method: "post",
    url: "medi/patrol/getSpecialContext",
    params: data
  })
}

//增加巡查时查询基础信息
export function getBasicInfo(data) {
  return http({
    method: "get",
    url: "medi/patrol/record/basicInfo",
    params: {
      entityId: data.entityId,
      type: data.type
    }
  })
}

//日常巡查记录添加
export function dailyRecordAdd(data) {
  return http({
    method: "post",
    url: "medi/patrol/record/add",
    data: data
  })
}

/**
 * 日常巡查计划关联的主体分页查寻
 * @param pageSize 每页显示条数
 * @param pageNum 当前页
 * @returns {*}
 */
export function mediDailyEntityPage(pageSize, pageNum, params) {
  return http({
    method: 'post',
    url: '/medi/patrol/record/dailyEntityPage/' + pageSize + '/' + pageNum,
    data: params
  });
}

/**
 * 药品专项巡查计划关联的主体分页查寻
 * @param pageSize 每页显示条数
 * @param pageNum 当前页
 * @returns {*}
 */
export function specialEntityPage(pageSize, pageNum, params) {
  return http({
    method: 'post',
    url: '/medi/patrol/record/specialEntityPage/' + pageSize + '/' + pageNum,
    data: params
  });
}

/**
 * 药品专项巡查计划
 * @param pageSize
 * @param pageNum
 * @param data
 * @param search
 */
export function getSpecialPlan(pageSize, pageNum, data, search) {
  return http({
    method: "post",
    url: "/medi/special/executPage/" + pageSize + '/' + pageNum,
    data: data,
    params: {search}
  })
}

/**
 * 主体列表
 * @param params
 */
export function postEntityPage(params){
  return http({
    method: 'post',
    url: 'medi/patrol/record/entityPage',
    data: params
  });
}

/**
 * 巡查要点表列表
 * @param params
 */
export function getFindTable(params){
  return http({
    method: 'get',
    url: 'medi/patrol/record/findTable',
    params: params
  });
}

/**
 * 获取巡查项
 * @param params
 */
export function getContext(params){
  return http({
    method: 'get',
    url: 'medi/patrol/record/getContext',
    params: params
  });
}
