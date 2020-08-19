import http from "utils/http";

/**
 * 双随机任务主体列表
 * @param {Object} params
 */
export function pageRandomTaskEntity(taskGroupId, pageSize, pageNum, params){
  return http({
    method:"post",
    url:'random/record/pageRandomTaskEntity/' + taskGroupId + '/' + pageSize + '/' + pageNum,
    data: params
  })
}

//日常巡查记录添加
export function updateRecord(data){
  return http({
    method:"post",
    url:"random/record/update",
    data: data
  })
}

/**
 * 分页查寻双随机计划记录
 * @param {*} pageSize 
 * @param {*} pageNum 
 * @param {*} searchData 
 */
export function taskRecords(pageSize, pageNum, searchData){
  return http({
    method:"GET",
    url:"random/record/taskRecordsPage/" + pageSize + '/' + pageNum,
    params: searchData
  })
}

/**
 * 双随机计划记录统计
 */
export function taskRecordCount(taskId){
  return http({
    method:"GET",
    url:"random/record/taskRecords/count",
    params: {taskId: taskId}
  })
}
/**
 * 是否有权限添加双随机计划记录
 */
export function isAdd(groupId){
  return http({
    method:"GET",
    url:"random/record/taskRecords/isAdd",
    params: {groupId: groupId}
  })
}


