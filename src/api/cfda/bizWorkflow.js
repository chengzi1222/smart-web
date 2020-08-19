import http from "utils/http";
import qs from "qs";
/**
 *  获取工单状态
 */
export function getWorkStatus() {
  return http({
    method: 'post',
    url: 'cfda/work/getWorkStatus'
  });
}

/**
 *  工单列表
 */
export function getPage(params) {
  return http({
    method: 'post',
    url: 'cfda/work/page/' + params.num + '/' + params.size,
    data: params.params
  });
}

/**
 *  我的工单列表
 */
export function pageByUser(params) {
  return http({
    method: 'post',
    url: 'cfda/work/pageByUser/' + params.num + '/' + params.size,
    data: params.params
  });
}
/**
 *  评审通过
 */
export function reviewAdopt(prams) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/reviewAdopt',
    data: prams
  });
}
/**
 *  评审驳回
 */
export function reviewReject(prams) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/reviewReject',
    data: prams
  });
}

/**
 *  主体注销
 */
export function bizCancel(prams) {
  return http({
    method: 'post',
    url: 'cfda/work/bizCancel',
    data: prams
  });
}

/**
 *  我的工单撤销
 */
export function revoke(workId) {
  const data = qs.stringify({
    workId: workId
  })
  return http({
    method: 'post',
    url: 'cfda/work/revoke',
    data
  });
}

/**
 *  我的工单删除
 */
export function del(workId) {
  const data = qs.stringify({
    workId: workId
  })
  return http({
    method: 'post',
    url: 'cfda/work/del',
    data
  });
}

/**
 *  延续提交评审
 */
export function bizContinue(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/bizContinue',
    data: qs.stringify(params)
  });
}

/**
 *  变更提交评审
 */
export function bizChange(params) {
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/bizChange',
    data: params
  });
}


/**
 *  变更提交评审
 */
export function bizEdit(params) {
  let detailedEngage = params.detailedEngage;
  if (detailedEngage){
    for(let i=0; i<detailedEngage.length; i++){
      if (detailedEngage[i]){
        detailedEngage[i].parent = null;
      }
    }
    params.detailedEngage = detailedEngage;
  }
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/bizEdit',
    data: params
  });
}


/**
 *  备案变动记录列表
 */
export function getPageByBizEntity(prams) {
  return http({
    method: 'post',
    url: 'cfda/work/getPageByBizEntity',
    data: prams
  });
}

/**
 *  备案变动记录详情
 */
export function getWorkFlowInfo(prams) {
  return http({
    method: 'post',
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    url: 'cfda/work/getWorkFlowInfo',
    data: prams
  });
}

/**
 *  备案变动操作记录
 */
export function getRecordByWorkId(prams) {
  return http({
    method: 'post',
    url: 'cfda/work/getRecordByWorkId',
    data: prams
  });
}


/*export function getReviewInfo(cid) {
  return http({
    method: 'post',
    loadOption:{
      text:"加载中..."
    },
    url: 'cfda/work/getreviewinfo',
    data: qs.stringify({cid:cid})
  });
}*/

export function updateReviewInfo(params) {
  let detailedEngage = params.detailedEngage;
  if (detailedEngage){
    for(let i=0; i<detailedEngage.length; i++){
      if (detailedEngage[i]){
        detailedEngage[i].parent = null;
      }
    }
    params.detailedEngage = detailedEngage;
  }
  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'cfda/work/updateCfda',
    data: params
  });
}

export function countWork() {
  return http({
    method: 'post',
    url: 'cfda/work/countWork'
  });
}

export function getWorkState() {
  return http({
    method: 'post',
    url: 'cfda/work/getWorkState'
  });
}

export function exporFile(params){
  return http({
    method:'post',
    url:'cfda/work/exporFile',
    data:params
  })
}
