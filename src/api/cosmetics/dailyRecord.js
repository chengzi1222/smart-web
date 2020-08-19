import http from "utils/http";


/**
 * 巡查记录分页
 */
export function postRecordPage(params, pageNum, pageSize) {
  return http({
    method: 'post',
    url: '/cosmetic/record/recordPage/' + pageNum + '/' + pageSize,
    data: params
  });
}
/**
 * 获取记录详情
 */
export function getPatrolRecord(id) {
  return http({
    method: 'post',
    url: '/cosmetic/record/getPatrolRecord/' + id
  });
}
/**
 * 获取记录获取巡查项信息
 */
export function getPatrolContext(id,params) {
  return http({
    method: 'post',
    url: '/cosmetic/record/getPatrolContext/' + id,
    data: params
  });
}
/**
 * 巡查主体分页
 */
export function postFindEntityList(pageSize, pageNum, params) {
  return http({
    method: 'post',
    url: '/cosmetic/record/findEntityList/' + pageNum + '/' + pageSize,
    data: params
  });
}
/**
 * 巡查计划列表
 */
export function postFindSpecialPlanList(pageSize, pageNum, select, search) {
  return http({
    method: 'post',
    url: '/cosmetic/record/findSpecialPlanList/' + pageNum + '/' + pageSize,
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
    url: '/cosmetic/record/supPerson'
  });
}

/**
 * 获取巡查项
 */
export function getContext(params) {
  return http({
    method: 'post',
    url: '/cosmetic/record/getContext',
    data: params
  });
}

/**
 * 获取专项计划列表
 */
export function getFindSpecialPlanList() {
  return http({
    method: 'post',
    url: '/cosmetic/record/findSpecialPlanList'
  });
}

/**
 * 添加巡查记录
 */
export function postAddPatrolRecord(params) {
  return http({
    method: 'post',
    url: '/cosmetic/record/addPatrolRecord',
    data: params
  });
}