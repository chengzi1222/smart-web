import http from "utils/http";
import qs from "qs";

/**
 * 条件分页
 * @param {*} searchMap
 * @param {*} pageSize
 * @param {*} pageNum
 */
export function page(searchMap, pageSize, pageNum) {
  return http({
    method: 'post',
    url: 'random/task/page/' + pageSize + "/" + pageNum,
    data: searchMap
  });
}

/**
 * 获取tab选项卡
 */
export function getRandomTaskStates() {
  return http({
    method: 'get',
    url: 'random/task/getRandomTaskStates'
  });
}

/**
 * 双随机主体列表
 * @param {Object} params
 */
export function findEntityList(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url:'entity/random/findPage',
    data:params
  })
}

/**
 * 双随机主体列表
 * @param {Object} params
 */
export function listTaskArea(){
  return http({
    method: 'get',
    url: 'random/task/area'
  });
}


export function getInfo(randomTaskId){
  return http({
    loading: true,
    method:"get",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url:'random/task/info?randomTaskId=' + randomTaskId
  })
}

export function getRandomTaskById(randomTaskId){
  return http({
    method: 'get',
    url: 'random/task/' + randomTaskId
  });
}

/**
 * 双随机数添加
 * @param {*} param
 */
export function addTask(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: params,
    url:'random/task/add'
  })
}
/**
 * 双随机修改
 * @param {*} param
 */
export function updateTask(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: params,
    url:'random/task/update'
  })
}

/**
 * 双随机随机
 * @param {*} params
 */
export function randomTask(params){
  return http({
    message: false,
    loading: false,
    loadOption:{
      text:"加载中...",
    },
    method:"post",
    data: params,
    url:'random/task/reset/group'
  })
}

/**
 * 双随重新机随机主体
 */
export function randomEntity(params){
  return http({
    loading: true,
    loadOption:{
      text:"加载中...",
    },
    method:"post",
    data: params,
    url:'random/task/reset/entity'
  })
}

/**
 * 双随重新机随机人员
 * @param {部门ID} deptId
 * @param {每组人数} eachGroups
 */
export function randomUser(deptId, eachGroups, entityType){
  return http({
    loading: true,
    loadOption:{
      text:"加载中...",
    },
    method:"post",
    data: qs.stringify({deptId: deptId,
       eachGroups: eachGroups,
      entitys: entityType}),
    url:'random/task/reset/user'
  })
}
/**
 *
 * @param {计划结束时间} endDate
 */
export function updateEndDate(endDate, taskId){
  return http({
    method:"post",
    data: qs.stringify({"newEndDate": endDate, "randomTaskId": taskId}),
    url:'random/task/updateEndDate'
  })
}

export function randomTaskEntityPage(searchMap, pageNum, pageSize, randomTaskId, randomTaskGroupId){
  return http({
    method:"POST",
    data: searchMap,
    params: {
      randomTaskId: randomTaskId,
      randomTaskGroupId: randomTaskGroupId
    },
    url:'random/task/entityPage/' + pageNum + '/' + pageSize
  })
}
/**
 * 双随机巡查记录
 * @param {Object} params
 */
export function findRandomRecordPage(params){
  return http({
    loading: true,
    method:"post",
    loadOption:{
      text:"加载中..."
    },
    url:'random/record/findRandomRecordPage',
    data:params
  })
}
/**
 * 双随机任务区域
 * @param {Object} params
 */
export function findTaskAreaList(areaCode){
  return http({
    loading: true,
    method:"get",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url:'random/record/area/' + areaCode,
  })
}

export function listUser(randomTaskGroupId){
  return http({
    method:"GET",
    params: {
      randomTaskGroupId: randomTaskGroupId
    },
    url:'random/task/listUser'
  })
}

/**
 * 上级双随机列表
 * @param {每页条数} pageSize 
 * @param {当前页} pageNum 
 * @param {搜索条件} searchData 
 */
export function executantDeptRandomPage(pageSize, pageNum, searchData){
  return http({
    method:"GET",
    params: searchData,
    url:'random/task/dept/page/' + pageSize + '/' + pageNum
  })
}

/**
 * 上级双随机列表统计
 */
export function executantDeptRandomCount(){
  return http({
    method:"GET",
    url:'random/task/dept/count'
  })
}

/**
 * 双随机随机主体管理
 */
export function randomEntityList(params,pageSize,pageNum){
  return http({
    method:"post",
    data: params,
    url:'random/task/randomEntityList/' + pageSize + '/' + pageNum
  })
}

/**
 * 双随机随机人员管理
 */
export function randomUserList(params,pageSize,pageNum){
  return http({
    method:"post",
    data: params,
    url:'random/task/randomUserList/' + pageSize + '/' + pageNum
  })
}

