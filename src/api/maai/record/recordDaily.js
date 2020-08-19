import http from "utils/http";
import qs from "qs";

// 医疗器械工单

/**
 * 巡查记录分页
 */
export function postRecordPage(pageNum, pageSize, params) {
  return http({
    method: 'post',
    url: '/maai/record/recordPage/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 获取记录详情
 */
export function getPatrolRecord(id) {
  return http({
    method: 'post',
    url: '/maai/record/getPatrolRecord/' + id
  });
}
/**
 * 获取记录获取巡查项信息
 */
export function getPatrolContext(id,params) {
  return http({
    method: 'post',
    url: '/maai/record/getPatrolContext/' + id,
    data: params
  });
}

/**
 * 巡查主体分页
 */
export function postFindEntityList(pageSize, pageNum, params) {
  return http({
    method: 'post',
    url: '/maai/record/entityPage/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 巡查计划列表
 */
export function postFindSpecialPlanList(pageSize, pageNum, select, search) {
  return http({
    method: 'post',
    url: '/maai/record/findSpecialPlanList/' + pageNum + '/' + pageSize,
    data: {
      entityTypes: select,
      search: search
    }
  });
}

/**
 * 巡查主体分页
 */
export function postSupPerson() {
  return http({
    method: 'post',
    url: '/maai/record/supPerson'
  });
}

/**
 * 巡查主体分页
 */
export function postFindTable(params) {
  return http({
    method: 'post',
    url: '/maai/record/findTable',
    data:params
  });
}

/**
 * 获取巡查项
 */
export function getContext(tableId) {
  return http({
    method: 'post',
    url: '/maai/record/getContext/'+tableId
  });
}

/**
 * 添加巡查记录
 */
export function postAddPatrolRecord(params) {
  return http({
    method: 'post',
    url: '/maai/record/addPatrolRecord',
    data: params
  });
}

/**
 * 添加巡查记录
 */
export function postDept(params) {
  return http({
    method: 'post',
    url: '/maai/record/dept/grid',
    data:qs.stringify(params)
  });
}
