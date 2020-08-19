import http from 'utils/http'

/**
 * 上传数据列表
 *
 */
export function reportDataList(taskId, params) {
  return http({
    method: 'post',
    url: '/active/statistical/reportDataList/' + taskId,
    data: params
  })
}
/**
 * 数据修正
 *
 */
export function update(taskId, entityId, params) {
  return http({
    method: 'post',
    url: '/active/statistical/updateDataByType/' + taskId + '/' + entityId,
    data: params
  })
}
/**
 * 监管人员配置
 *
 */
export function updateBoxPerson(taskId, params) {
  return http({
    method: 'post',
    url: '/active/statistical/updateBoxPerson/' + taskId,
    data: params
  })
}

/**
 * 日期赛选框
 * @param {string} taskId
 */
export function dateSelect(taskId) {
  return http({
    method: 'post',
    url: 'active/statistical/reportDateList/' + taskId
  })
}
