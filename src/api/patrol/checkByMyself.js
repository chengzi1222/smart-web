import http from "utils/http";

//计划分页
export function getPlanPaging(pageNum,pageSize,params) {
  return http({
    method: 'get',
    url: `/zjzc/plan/${pageNum}/${pageSize}/paging`,
    params
  });
}
//计划禁用启用
export function getPlanEnable(params) {
  return http({
    method: 'get',
    url: `/zjzc/plan/enable`,
    params
  });
}
//计划详情
export function getPlanDDetails(params) {
  return http({
    method: 'get',
    url: `/zjzc/plan/details`,
    params
  });
}
//下发策略获取
export function getPlanModeGet(params) {
  return http({
    method: 'get',
    url: `/zjzc/plan/mode/get`,
    params
  });
}
//下发策略编辑
export function postPlanModeEdit(params) {
  return http({
    method: 'post',
    url: `/zjzc/plan/mode/edit`,
    data: params
  });
}
//计划添加
export function postPlanSave(params) {
  return http({
    method: 'post',
    url: `/zjzc/plan/save`,
    data: params
  });
}
//计划编辑
export function postPlanEdit(params) {
  return http({
    method: 'post',
    url: `/zjzc/plan/edit`,
    data: params
  });
}
//自检自查巡查要点表详情
export function getPlanTableDetails(id) {
  return http({
    method: 'get',
    url: `/zjzc/plan/table/details?tableId=${id}`
  });
}
//巡查记录分页列表
export function getRecordPaging(pageNum,pageSize,params) {
  return http({
    method: 'get',
    url: `/zjzc/record/${pageNum}/${pageSize}/paging`,
    params
  });
}
//巡查记录详情
export function getRecordDetails(params) {
  return http({
    method: 'get',
    url: `/zjzc/record/details`,
    params
  });
}
//整改记录详情
export function getRecordRepatrolDetails(params) {
  return http({
    method: 'get',
    url: `/zjzc/record/repatrol/details`,
    params
  });
}