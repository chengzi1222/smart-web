import http from "utils/http";
import qs from 'qs';

export function getPage(param) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: "patrol/special/page",
    data: param
  })
}

export function getSubTypeList() {
  return http({
    method: "post",
    url: "medi/patrol/record/getSubTypeList",
    data: {}
  })
}

export function getAgencies() {
  return http({
    method: "post",
    url: "patrol/special/getAgencies"
  })
}

export function getAreaLevel() {
  return http({
    method: "post",
    url: "patrol/special/areaLevel"
  })
}

export function getPlanState() {
  return http({
    method: "post",
    url: "patrol/special/getPlanState",
    data: {}
  })
}

export function getInfo(id) {
  return http({
    method: "get",
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    url: "patrol/special/getInfo?id=" + id,
  })
}

/*export function deleteFile(id){
  return http({
    method:"get",
    loadOption:{
      text:"加载中..."
    },
    url:"patrol/special/deleteFile?id=" + id,
  })
}*/

export function update(params) {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: "post",
    url: "patrol/special/update",
    data: params
  })
}

export function getAddData() {
  return http({
    method: "get",
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    url: "patrol/special/getAddData",
  })
}

export function addSpceial(params) {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: "post",
    url: "patrol/special/add",
    data: params
  })
}

export function deletePlan(id) {
  return http({
    method: "delete",
    url: "patrol/special/" + id,
  })
}

export function complete(params) {
  return http({
    method: "post",
    url: "patrol/special/complete",
    params
  })
}

export function getChilds(parentId) {
  return http({
    method: "get",
    url: "patrol/special/getChilds?parentId=" + parentId,
  })
}

export function startPlan(id) {
  return http({
    method: "post",
    url: "patrol/special/start",
    data: qs.stringify({"id": id})
  })
}

export function updateEndDateById(params) {
  return http({
    method: "post",
    url: "patrol/special/endDate",
    data: qs.stringify(params)
  })
}

export function getPatrolChartById(patrolPlanId) {
  return http({
    method: "get",
    url: "patrol/statistics/special/" + patrolPlanId
  })
}

