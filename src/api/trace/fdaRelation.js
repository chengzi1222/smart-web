import http from "utils/http";
import httpyb from "utils/httpyb";
import qs from "qs";
// ----------------------------------------------------------学校监管---------------------------------------------------------
/**
 * 、学校监管分页
 */
// export function listBuyerFdaPage(params) {
//   return http({
//     method: 'post',
//     url: '/food/yuanben/schfda/buyerFdaList',
//     data: params
//   });
// }

/**
 * 、学校监管分页
 */
export function listBuyerFdaPage(d) {
  return httpyb({
    method: 'post',
    url: '/govapi/newschfda/schoolList',
    params: d
  });
}
/**
 * 、学校类型列表
 */
export function schoolTypeList() {
  return httpyb({
    method: 'get',
    url: '/govapi/newschfda/schoolTypeList'
  });
}

/**
 * 、学校办学性质列表
 */
export function scTypeList() {
  return httpyb({
    method: 'get',
    url: '/govapi/newschfda/scTypeList'
  });
}
/**
 * 、部门树
 */
export function deptree(deptId) {
  return http({
    method: 'get',
    url: '/food/yuanben/schfda/deptree?deptId=' + deptId
  });
}
/**
 * 学校与食药所建立关联
 */
export function addRelation(params) {
  return http({
    method: 'post',
    url: '/food/yuanben/schfda/add',
    params: params
  });
}
/**
 * 学校与食药所建立关联
 */
// export function addRelation(params) {
//   return httpyb({
//     method: 'post',
//     url: '/govapi/newschfda/save',
//       params: params
//   });
// }
/**
 * 学校与食药所删除关联
 */
 export function deleteRelation(buyerGuid) {
   return http({
     method: 'get',
     url: '/food/yuanben/schfda/delete?buyerGuid=' + buyerGuid
   });
 }

// /**
//  * 学校与食药所删除关联
//  */
// export function deleteRelation(buyerGuid) {
//   return httpyb({
//     method: 'get',
//     url: '/govapi/newschfda/delete?buyerGuid=' + buyerGuid
//   });
// }
