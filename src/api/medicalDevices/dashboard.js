import http from "utils/http";

/*** 待办事项 **/
export function getBacklog() {
  return http({
    method: 'get',
    url: '/maai/home/statistics/backlog'
  })
}

/*** 预警区 **/
export function getWarningArea() {
  return http({
    method: 'get',
    url: '/maai/home/statistics/warningArea'
  })
}

/*** 主体类型分组统计 **/
export function getEntityAll() {
  return http({
    method: 'get',
    url: '/maai/home/statistics/entityAll'
  })
}

/*** 主体业态分组统计 **/
export function getEntityType(entityType) {
  return http({
    method: 'get',
    url: '/maai/home/statistics/entity/'+entityType
  })
}

/*** 主体类型分组统计 **/
export function postPatrolPlan(params) {
  return http({
    method: 'post',
    url: '/maai/home/statistics/patrolPlan',
    data:params
  })
}

/*** 巡查率覆盖排名 **/
export function postPatrolCover(params) {
  return http({
    method: 'post',
    url: '/maai/home/statistics/patrolCover',
    data: params
  })
}

/*** 巡查动态 **/
export function getPatrolState() {
  return http({
    method: 'get',
    url: '/maai/home/statistics/patrolState'
  })
}