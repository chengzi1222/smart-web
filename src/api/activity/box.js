import http from 'utils/http'

/**
 * 盒饭检查详情
 * @param {string} examineId 
 */
export function info(examineId) {
  return http({
    method: 'get',
    url: '/active/box/info/' + examineId
  })
}

/**
 * 盒饭检查记录分页
 * @param {object} page 
 * @param {object} searchMap 
 */
export function page(page, searchMap) {
  return http({
    method: 'post',
    url: 'active/box/page/' + page.pageNum + '/' + page.pageSize,
    data: searchMap
  })
}

/**
 * 日期赛选框
 * @param {string} taskId 
 */
export function dateSelect(taskId) {
  return http({
    method: 'get',
    url: 'active/date/select/' + taskId
  })
}