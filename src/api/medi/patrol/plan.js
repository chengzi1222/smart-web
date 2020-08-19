import http from "utils/http";
import qs from "qs";

/**
 *  获取日常巡查计划
 */
export function findPlanDaily() {
  return http({
    method: 'GET',
    url: 'medi/daily/plan'
  })
}

/**
 * 编辑日常计划
 */
export function editPlanDaily(planDaily) {
  return http({
      method: 'POST',
      data: planDaily,
      url: 'medi/daily/edit'
  })
}

/**
 * 编辑日常计划策略
 */
export function editPlanDailyConfig(planDailyConfig) {
  return http({
      method: 'POST',
      data: planDailyConfig,
      url: 'medi/daily/edit/config'
  })
}

//专项巡查接口

export function getPage(param){
  return http({
    loading: true,
    method:"post",
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url:"medi/special/page",
    data: param
  })
}

//制定机构下拉表
export function getAgencies(){
  return http({
    method:"post",
    url:"medi/special/getAgencies"
  })
}

// 当前用户所在部门等级
export function getAreaLevel(){
  return http({
    method:"post",
    url:"medi/special/areaLevel"
  })
}

export function getPlanState(){
  return http({
    method:"post",
    url:"medi/special/getPlanState",
    data: {}
  })
}

export function startPlan(id){
  return http({
    method:"post",
    url:"medi/special/start",
    data:qs.stringify({"id": id})
  })
}

/**
 * 、医疗器械专项计划管理接口 -  完成
 * /maai/planspecial/complete/:id
 */
export function complete(planId) {
  let params = {
    id : planId
  };
  return http({
    method: 'post',
    url: '/medi/special/complete',
    data: qs.stringify(params)
  });
}

export function deletePlan(id){
  return http({
    method:"delete",
    url:"medi/special/" + id,
  })
}

export function updateEndDateById(params){
  return http({
    method:"post",
    url:"medi/special/endDate",
    data:qs.stringify(params)
  })
}

export function getAddData(){
  return http({
    method:"get",
    loading:true,
    loadOption:{
      text:"加载中..."
    },
    url:"medi/special/getAddData",
  })
}

export function addSpceial(params){
  return http({
    loading:true,
    loadOption:{
      text:"加载中..."
    },
    method:"post",
    url:"medi/special/add",
    data:params
  })
}

export function getInfo(id){
  return http({
    method:"get",
    loading:true,
    loadOption:{
      text:"加载中..."
    },
    url:"medi/special/getInfo?id=" + id,
  })
}

export function update(params){
  return http({
    loading:true,
    loadOption:{
      text:"加载中..."
    },
    method:"post",
    url:"medi/special/update",
    data:params
  })
}

export function getChilds(parentId){
  return http({
    method:"get",
    url:"medi/special/getChilds?parentId=" + parentId,
  })
}
