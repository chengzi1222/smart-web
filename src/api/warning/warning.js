import http from "utils/http";

/**
 * 条件分页
 * @param {*} searchMap
 * @param {*} pageSize
 * @param {*} pageNum
 */
export function warningTaskPpage(searchMap, pageSize, pageNum) {
  return http({
    method: 'post',
    url: 'medi/warning/page/' + pageSize + "/" + pageNum,
    data: searchMap
  });
}

/**
 * 预警任务添加
 * @param {*} param
 */
export function addWarningTask(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: params,
    url:'/medi/warning/add'
  })
}

/**
 * 预警任务详情
 * @param warningTaskId
 */
export function getWarningTaskById(warningTaskId){
  return http({
    method: 'get',
    url: 'medi/warning/info/' + warningTaskId
  });
}

/**
 * 获取tab选项卡
 */
export function getWarningTaskStates() {
  return http({
    method: 'get',
    url: 'medi/warning/getWarningTaskStates'
  });
}

/**
 * 获取tab选项卡
 */
export function getEntityCount() {
  return http({
    method: 'get',
    url: 'medi/warning/entityCount'
  });
}

/**
 * 获取任务执行数量
 */
export function recordCount(taskId) {
  return http({
    method: 'get',
    url: 'medi/warning/recordCount/'+ taskId
  });
}

/**
 * 获取任务执行数量
 */
export function taskRecordInfo(taskId) {
  return http({
    method: 'get',
    url: 'medi/warning/taskRecordInfo/'+ taskId
  });
}

/**
 * 完成预警任务
 */
export function complete(taskId) {
  return http({
    method: 'post',
    url: 'medi/warning/complete/'+ taskId
  });
}

/**
 * 任务执行情况条件分页
 * @param {*} taskId
 * @param {*} searchMap
 * @param {*} pageSize
 * @param {*} pageNum
 */
export function warningPageSituation(taskId,searchMap, pageSize, pageNum) {
  return http({
    method: 'post',
    url: 'medi/warning/pageSituation/' + taskId + "/" + pageSize + "/" + pageNum,
    data: searchMap
  });
}

/**
 * 预警任务记录添加
 * @param {*} param
 */
export function addRecord(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: params,
    url:'/medi/warning/addRecord'
  })
}


/**
 * 预警任务记录添加
 * @param {*} param
 */
export function getRecord(recodId){
  return http({
    method:"get",
    url:'/medi/warning/taskRecord/'+recodId
  })
}

/**
 * 统计Excel导出
 */
export function exportExcel(ids,taskId) {
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: ids,
    url:'/medi/warning/getDailyExcel/'+taskId
  })
}

/**
 * 获取任务执行数量
 */
export function getEchartData(taskId) {
  return http({
    method: 'get',
    url: 'medi/warning/getEchartData/'+ taskId
  });
}

/**
 * 获取短信信息
 */
export function smsAll(taskId) {
  return http({
    method: 'get',
    url: 'medi/warning/getWarningTask',
    params: { taskId },
  });
}

/**
 * 获取短信信息
 */
export function smsSend(params) {
  return http({
    method: 'post',
    url: 'medi/warning/smsWarning',
    data: params,
  });
}

/**
 * 获取任务执行数量
 */
export function getLastData(taskId) {
  return http({
    method: 'get',
    url: 'medi/warning/getLastData/'+ taskId
  });
}
