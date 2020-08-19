import http from "utils/http";

/**
 *  重大活动任务分页
 *
 */
export function taskPage(params, size, num) {
  return http({
    method: "post",
    url: "active/page/" + size + "/" + num,
    data: params
  })
}
/**
 *  重大活动任务分页
 */
export function getTaskStates(parentId) {
  return http({
    method: "get",
    url: "active/getTaskStates",
  })
}

/**
 *  重大活动任务完成
 */
export function complete(params) {
  return http({
    method: "post",
    url: "active/complete/" + params,
  })
}
/**
 *  重大活动任务再启动
 */
export function enable(params) {
  return http({
    method: "post",
    url: "active/enable/" + params,
  })
}
/**
*  主体类型查询
*/
export function entity(params) {
  return http({
    method: "post",
    url: "active/entity/list/",
    params
  })
}
/**
 *  任务添加
 *
 */
export function activityAdd(params) {
  return http({
    method: "post",
    url: "active/add",
    data: params
  })
}
/**
 *  任务修改
 *
 */
export function activityUpdate(params) {
  return http({
    method: "post",
    url: "active/update",
    data: params
  })
}
/**
 *  菜单下载模板
 *
 */
export function getExcel() {
  return http({
    method: "get",
    url: "/active/getExcel"
  })
}

/**
 *  导入
 *
 */
export function import_menu(params) {
  return http({
    method: "post",
    url: "/active/menu",
    data: params
  })
}

/**
 *  任务详情
 *
 */
export function getInfo(params) {
  return http({
    method: "get",
    url: "active/detail/" + params,
  })
}
