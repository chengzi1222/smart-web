import http from 'utils/http';

//添加要点表基础信息
export function addInfo(data) {
    return http({
      method: 'post',
      url: '/xchc/table/update',
      data:data
    })
}

//获取配置核查项目列表(分页)
export function getSettingList(data) {
  return http({
    method: 'post',
    url: '/xchc/project/page/list',
    data:data
  })
}


//导入
export function uploadFile(data) {
  return http({
    method: 'post',
    url: '/xchc/import',
    data:data
  })
}

//添加核查项目
export function addProject(data) {
  return http({
    method: 'post',
    url: '/xchc/project/update',
    data:data
  })
}

//修改核查项目的启用状态
export function postStatus(data){
  return http({
    method: 'post',
    url: '/xchc/project/status',
    data:data
  })
}

//删除核查项目
export function delProject(data){
  return http({
    method: 'get',
    url: '/xchc/project/delete',
    params:data
  })
}

//获取核查项目列表(不分页)
export function settingList(data){
  return http({
    method: 'post',
    url: '/xchc/project/list',
    data:data
  })
}

//添加核查内容
export function addContent(data){
  return http({
    method: 'post',
    url: '/xchc/content/update',
    data:data
  })
}

//获取要点表信息列表
export function getContentList(data){
  return http({
    method: 'post',
    url: '/xchc/table/detail/page/child',
    data:data
  })
}

//添加要点表判定标准
export function saveLeast(data){
  return http({
    method: 'post',
    url: '/xchc/table/least-not-accord',
    data:data
  })
}

//获取核查要点管理列表
export function manageList(data){
  return http({
    method: 'post',
    url: '/xchc/table/list',
    data:data
  })
}


//核查要点管理表状态更改
export function tableStatus(data){
  return http({
    method: 'post',
    url: '/xchc/table/status',
    data:data
  })
}

//删除核查要点表
export function delTable(data){
  return http({
    method: 'get',
    url: '/xchc/table/delete',
    params:data
  })
}

//获取要点表基础信息
export function getBaseData(data){
  return http({
    method: 'get',
    url: '/xchc/table/detail/base',
    params:data
  })
}

//获取要点表信息列表
export function getTableList(data){
  return http({
    method: 'post',
    url: '/xchc/table/detail/page/child',
    data:data
  })
}

//检查内容禁用启用
export function contentStatus(data){
  return http({
    method: 'post',
    url: '/xchc/content/status',
    data:data
  })
}

//检查内容删除
export function contentDel(data){
  return http({
    method: 'get',
    url: '/xchc/content/delete',
    params:data
  })
}

//核查主体管理列表
export function getSubList(data){
  return http({
    method: 'get',
    url: '/xchc/entity/list',
    params:data
  })
}

//重置密码
export function resetPw(data){
  return http({
    method: 'post',
    url: '/xchc/entity/reset',
    params:data
  })
}

//核查主体信息
export function getSubBaseData(data){
  return http({
    method: 'get',
    url: '/xchc/entity/entityInfo',
    params:data
  })
}

//核查记录概要列表
export function getSubRecord(data){
  return http({
    method: 'get',
    url: '/xchc/entity/summary/list',
    params:data
  })
}

//核查任务列表
export function getTaskList(data){
  return http({
    method: 'get',
    url: '/xchc/task/list',
    params:data
  })
}

//核查任务导入

export function uploadTaskFile(data) {
  return http({
    method: 'post',
    url: '/xchc/task/import',
    data:data
  })
}

//删除任务
export function delTask(id) {
  return http({
    method: 'post',
    url: '/xchc/task/delete',
    params:{
      taskId:id
    }
  })
}

//核查基本信息
export function checkBaseInfo(data) {
  return http({
    method: 'get',
    url: '/xchc/patrol/baseInfo',
    params:data
  })
}

//检查人列表
export function inspectorList(inspectorName) {
  return http({
      method: 'get',
      url: `/xchc/patrol/inspectorList`,
      params: {
          inspectorName:inspectorName,
          pageNum:1,
          pageSize:10
      }
  })
}

//要点表信息不分页
export function projectInfo(id) {
  return http({
      method: 'post',
      url: '/xchc/table/detail/child',
      data:{
        tableId:id
      }
  })
}

export function AddInspectRecord(data) {
  return http({
      method: 'post',
      url: '/xchc/patrol/add',
      data:data
  })
}




