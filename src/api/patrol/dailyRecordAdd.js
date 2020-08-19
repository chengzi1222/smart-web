import http from "utils/http";

//获取主体类型下拉列表
export function getSubTypeList(data){
    return http({
      method:"post",
      url:"patrol/special/getSubTypeList",
      data:data
    })
}

//获取日常巡查项
export function getDailyContext(data){
  return http({
    method:"post",
    url:"patrol/getDailyContext",
    params:data
  })
}

//获取专项巡查项
export function getSpecialContext(data){
  return http({
    method:"post",
    url:"patrol/getSpecialContext",
    params:data
  })
}



//增加巡查时查询基础信息
export function getBasicInfo(data){
  return http({
    method:"get",
    url:"patrol/record/basicInfo",
    params: {
      entityId:data.entityId,
      type:data.type
    }
  })
}

//日常巡查记录添加
export function dailyRecordAdd(data){
  return http({
    method:"post",
    url:"patrol/record/add",
    data:data
  })
}


/**
 * 日常巡查计划关联的主体分页查寻
 * @param pageSize 每页显示条数
 * @param pageNum 当前页
 * @returns {*}
 */
export function dailyEntityPage(params, pageSize, pageNum) {
  return http({
    method: 'post',
    url: 'patrol/record/dailyEntityPage/' + (pageSize ? pageSize : params.pageSize)  + '/' + (pageNum ? pageNum : params.pageNum),
    data: params
  });
}

/**
 * 专项巡查计划关联的主体分页查寻
 * @param pageSize 每页显示条数
 * @param pageNum 当前页
 * @returns {*}
 */
export function specialEntityPage(params, pageSize, pageNum) {
  return http({
    method: 'post',
    url: 'patrol/record/specialEntityPage/' + (pageSize ? pageSize : params.pageSize)  + '/' + (pageNum ? pageNum : params.pageNum),
    data: params
  });
}

//获得专项巡查计划选项
export function getSpecialPlan(pageSize, pageNum, data, search){
  return http({
    method:"post",
    url:"patrol/special/executPage/" + pageSize + '/' + pageNum ,
    data:data,
    params:{search}
  })
}
