import http from 'utils/http'

// 查询列表
export function entityList(params) {
  return http({
    method: 'post',
    url: '/active/entity/list',
    data: params
  })
}

// 生成名称
export function entityName(params) {
  return http({
    method: 'post',
    url: '/active/entity/create/username',
    data: params
  })
}

//添加
export function entityAdd(params) {
  return http({
    method: 'post',
    url: '/active/entity/add',
    data: params
  })
}

//详情
export function entitInfo(params) {
  return http({
    method: 'get',
    url: '/active/entity/detail/' + params,
  })
}

//编辑
export function entitUpdate(params) {
  return http({
    method: 'post',
    url: '/active/entity/update',
    data: params
  })
}

//重置密码
export function entitResetPwd(params) {
  return http({
    method: 'post',
    url: '/active/entity/reset/pwd',
    params
  })
}
