import http from 'utils/http';

// 楼盘信息 - 主体档案分页
export function getBuildingPaging(params) {
  return http({
    method: 'get',
    url: '/tzsb/building/paging',
    params: params
  })
}

// 楼盘信息 - 主体更新
export function postBuildingUpdate(id, params) {
  return http({
    method: 'post',
    url: '/tzsb/building/' + id + '/update',
    data: params
  })
}

// 楼盘信息 - 主体添加
export function postBuildingAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/building/add',
    data: params
  })
}

// 楼盘信息 - 主体详情
export function getBuildingFind(params) {
  return http({
    method: 'get',
    url: '/tzsb/building/find',
    params: params
  })
}

// 楼盘信息 - 主体导出
export function getBuildingExport(params) {
  return http({
    method: 'get',
    url: '/tzsb/building/export',
    params: params
  })
}

// 楼盘信息 - 主体导入
export function getBuildingImport(params) {
  return http({
    method: 'get',
    url: '/tzsb/building/import',
    params
  })
}


// 使用主体列表
export function postEntityPaging(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/entity/paging',
    data: params
  })
}

// 使用主体启用禁用
export function getEntityStatusUpdate(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/status/update',
    data: params
  })
}

// 使用主体导出
export function postEntityExport(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/entity/export',
    data: params
  })
}

// 使用主体重置密码
export function postEmployPasswordUpdate(id) {
  return http({
    method: 'post',
    url: '/tzsb/employ/password/' + id + '/update'
  })
}

// 使用主体添加
export function postEmployEntityAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/entity/add',
    data: params
  })
}

// 使用主体编辑
export function postEmployEntityUpdate(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/entity/update',
    data: params
  })
}

// 使用主体根据街道获取网格
export function postEmployGridList(params) {
  return http({
    method: 'get',
    url: '/tzsb/employ/grid/list',
    params: params
  })
}

// 使用主体详情
export function postEmployFind(id) {
  return http({
    method: 'get',
    url: '/tzsb/employ/' + id + '/find',
  })
}

// 使用主体导入
export function getEmployEntityImport(params) {
  return http({
    method: 'post',
    url: '/tzsb/employ/entity/import',
    data: params
  })
}


// 维保单位分页列表
export function postMaintainEntityPaging(params) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/entity/paging',
    data: params
  })
}

// 维保单位重置密码
export function getMaintainPasswordUpdate(id) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/password/' + id + '/update'
  })
}

// 维保单位修改
export function getMaintainEntityEdit(params) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/entity/edit',
    data: params
  })
}

// 维保单位添加
export function getMaintainEntityAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/entity/add',
    data: params
  })
}

// 维保单位详情
export function postMaintainEntityFind(id) {
  return http({
    method: 'get',
    url: '/tzsb/maintain/entity/' + id + '/find',
  })
}

// 维保单位启用禁用
export function postMaintainStatusUpdate(params) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/status/update',
    data: params
  })
}

// 维保单位主体导出
export function postMaintainEntityExport(params) {
  return http({
    method: 'post',
    url: '/tzsb/maintain/entity/export',
    data: params
  })
}

// 维保单位主体导入
export function getMaintainEntityImport(params) {
  return http({
    method: 'get',
    url: '/tzsb/maintain/entity/import',
    params
  })
}


// 检验单位分页列表
export function getInspectPaging(params) {
  return http({
    method: 'get',
    url: '/tzsb/inspect/paging',
    params
  })
}

// 检验单位重置密码
export function getInspectPasswordUpdate(id) {
  return http({
    method: 'post',
    url: '/tzsb/inspect/password/' + id + '/update',
  })
}

// 检验单位更新
export function postInspectUpdate(id, params) {
  return http({
    method: 'post',
    url: '/tzsb/inspect/' + id + '/update',
    data: params
  })
}

// 检验单位导出
export function getInspectExport(params) {
  return http({
    method: 'get',
    url: '/tzsb/inspect/export',
    params: params
  })
}

// 检验单位导出所有
export function getInspectAllExport(params) {
  return http({
    method: 'get',
    url: '/tzsb/inspect/all/export',
    params: params
  })
}

// 检验单位导入
export function getInspectImport(params) {
  return http({
    method: 'get',
    url: '/tzsb/inspect/import',
    params
  })
}
// 检验单位添加
export function postInspectAdd(params) {
  return http({
    method: 'post',
    url: '/tzsb/inspect/add',
    data: params
  })
}

// 特种设备三种单位自动生成账号
export function autoAccount(params) {
  return http({
    method: 'get',
    url: '/tzsb/employ/autoAccount',
    params
  })
}
