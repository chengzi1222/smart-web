import http from 'utils/http';

// 电梯管理详情 - 检验记录
export function getReportPaging(id,params) {
  return http({
    method: 'get',
    url: '/tzsb/report/' + id +'/paging',
    params: params
  })
}
// 特种设备主体列表
export function getEntityPaging(params) {
  return http({
    method: 'get',
    url: '/tzsb/entity/paging',
    params: params
  })
}
// 设备档案批量修改
export function postEntityBatchUpdate(params) {
  return http({
    method: 'post',
    url: '/tzsb/entity/batch/update',
    data: params
  })
}
// 修改是否涉密
export function postEntitySecretUpdate(params) {
  return http({
    method: 'post',
    url: '/tzsb/entity/secret/update',
    data: params
  })
}
// 使用单位分词搜索
export function getEmployKeywordList(params) {
  return http({
    method: 'get',
    url: '/tzsb/employ/keyword/list',
    params: params
  })
}
// 维保单位分词搜索
export function getMaintainEntityKeywordPaging(params) {
  return http({
    method: 'get',
    url: '/tzsb/maintain/entity/keyword/paging',
    params: params
  })
}
// 楼盘信息关键字检索
export function getBuildingList(params) {
  return http({
    method: 'get',
    url: '/tzsb/building/list',
    params: params
  })
}
// 特种设种类获取
export function getEntityVarietiesList(params) {
  return http({
    method: 'get',
    url: '/tzsb/entity/varieties/list',
    params: params
  })
}
// 特种设备主体导入
export function getEntityImport(params) {
  return http({
    method: 'post',
    url: '/tzsb/entity/import',
    data: params
  })
}
// 特种设备主体档案导出
export function getEntityExport(params) {
  return http({
    method: 'get',
    url: '/tzsb/entity/export',
    params: params
  })
}
// 特种设备主体添加
export function postEntityAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/entity/add',
    data: params
  })
}
// 特种设备主体修改
export function postEntityEdit(params) {
  return http({
    method: 'post',
    url: '/tzsb/entity/edit',
    data: params
  })
}
// 特种设备主体详情
export function getEntityFind(params) {
  return http({
    method: 'get',
    url: '/tzsb/entity/find',
    params: params
  })
}

// 特种设备主体详情  --  特种设备工单分页列表
export function getWorkflowPaging(params) {
  return http({
    method: 'get',
    url: '/tzsb/workflow/paging',
    params: params
  })
}
// 特种设备主体详情  --  特种设备工单详情
export function getWorkflowFindInfo(params) {
  return http({
    method: 'get',
    url: '/tzsb/workflow/findInfo',
    params: params
  })
}


// 检验报告列表
export function getReportPagingList(params) {
  return http({
    method: 'get',
    url: '/tzsb/report/paging',
    params: params
  })
}
// 检验报告详情
export function getReportFind(params) {
  return http({
    method: 'get',
    url: '/tzsb/report/find',
    params: params
  })
}
// 检验报告修改
export function postReportEdit(params) {
  return http({
    method: 'post',
    url: '/tzsb/report/edit',
    data: params
  })
}
// 检验报告添加
export function postReportAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/report/add',
    data: params
  })
}
// 检验报告导出
export function getReportExport(params) {
  return http({
    method: 'get',
    url: '/tzsb/report/export',
    params: params
  })
}
// 检验报告导入
export function getReportImport(params) {
  return http({
    method: 'get',
    url: '/tzsb/report/import',
    params: params
  })
}