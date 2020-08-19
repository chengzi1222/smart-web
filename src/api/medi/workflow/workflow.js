import http from "utils/http";
import qs from "qs";

/**
 *  获取工单列表
 * @param params
 */
export function findPage(params) {
  // debugger
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/page/'+params.pageNum+'/'+params.pageSize,
    data: params
  });
}

/**
 *  获取我的工单列表
 * @param params
 */
export function mywork(params) {
  // debugger
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/mywork/'+params.pageNum+'/'+params.pageSize,
    data: params
  });
}

/**
 *  统计待审核/已归档/已驳回
 * @param params
 */
export function getTotal(params) {
  // debugger
  return http({
    loading: true,
    method: 'post',
    url: 'medi/workflow/getTotal',
    data: qs.stringify(params)
  });
}

/**
 *  获取首次工单的信息
 *
 */
export function getFirstInfo(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/getFirstInfo',
    data: qs.stringify(params)
  });
}

/**
 *  首次审核通过
 *
 */
export function reviewFirst(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/reviewFirst',
    data: params
  });
}

/**
 *  获取编辑工单的信息
 *
 */
export function getEditInfo(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/getEditInfo',
    data: qs.stringify(params)
  });
}

/**
 *  编辑审核通过
 *
 */
export function reviewEdit(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/reviewEdit',
    data: params
  });
}

/**
 *  删除工单
 *
 */
export function deleteWorkFlow(workId) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/delete/'+workId,
    data: {}
  });
}

/**
 *  撤销工单
 *
 */
export function revoke(workId) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/revoke/'+workId,
    data: {}
  });
}

/**
 *  重新申请工单
 *
 */
export function rework(entity) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/rework',
    data: entity
  });
}

/**
 *  重新申请工单 - 主体信息查询
 *
 */
export function getReInfo(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/getReInfo',
    data: qs.stringify(params)
  });
}

/**
 *  工单操作记录
 *
 */
export function workRecordPage(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/workRecordPage/'+params.pageNum+'/'+params.pageSize,
    data: params
  });
}

/**
 *  备案编辑记录
 *
 */
export function recordPage(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/workflow/recordPage/'+params.pageNum+'/'+params.pageSize,
    data: params
  });
}
