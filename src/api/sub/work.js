import http from "utils/http";
import qs from "qs";

/**
 *  获取工单列表
 * @param params
 */
export function pageWork(params) {
  return http({
    method: 'post',
    url: 'sub/work/page',
    data: params
  });
}

/**
 *  获取我的工单列表
 * @param params
 */
export function pageMywork(params) {
  return http({
    loading: true,
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    method: 'post',
    url: 'mywork/page',
    data: params
  });
}

export function countWork(entityType) {
  return http({
    method: 'post',
    url: 'sub/work/countWork',
    data: qs.stringify({"entityType": entityType})
  });
}

export function listWorkState() {
  return http({
    method: 'post',
    url: 'env/work/listWorkState'
  });
}

export function listWorkType() {
  return http({
    method: 'post',
    url: 'env/work/listWorkType'
  });
}

/**
 * 根据工单ID查询工单操作记录
 * @param workId
 */
export function getRecordByWorkId(workId){
  return http({
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'sub/common/getRecordByWorkId',
    data: qs.stringify({workId:workId})
  });
}

/**
 * 工单审核通过
 * @param workId
 */
export function reviewPass(workId){
  return http({
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'sub/work/reviewPass',
    data: qs.stringify({workId: workId})
  });
}

/**
 * 工单审核驳回
 * @param params
 */
export function reviewReject(params){
  return http({
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'sub/work/reviewReject',
    data: qs.stringify(params)
  });
}

/**
 * 工单撤销申请
 * @param workId
 */
export function revoke(workId){
  return http({
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'mywork/revoke',
    data: qs.stringify({workId:workId})
  });
}

/**
 * 变更
 * @param params
 */
export function change(params){
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
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'sub/work/change',
    data: params
  });
}

/**
 * 重新申请
 * @param params
 */
export function reapply(params){
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
    method: 'post',
    url: 'mywork/reapply',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    data: params
  });
}

/**
 * 根据工单ID查询变更详情
 * @param workId
 */
export function changeInfo(workId){
  return http({
    method: 'post',
    url: 'sub/common/changeInfo',
    data: qs.stringify({workId:workId})
  });
}

/**
 * 根据工单ID删除工单
 * @param workId
 */
export function del(workId){
  return http({
    method: 'post',
    loadOption:{    // 具体设置参考 上面传送门
      text:"加载中..."
    },
    url: 'mywork/del',
    data: qs.stringify({workId:workId})
  });
}

/**
 *  备案变动记录列表
 */
export function getPageByBizEntity(prams) {
  return http({
    method: 'post',
    url: 'sub/common/getPageByBizEntity',
    data: prams
  });
}


//一般主体整改
/**
 * 变更
 * @param params
 */
export function subChange(params){
  return http({
    method: 'post',
    loadOption: true,
    loadOption:{    
      text:"加载中..."
    },
    url: 'sub/work/submitChange',
    data: params
  });
}

/**
 * 重新申请
 * @param params
 */
export function submitReapply(params){
  return http({
    method: 'post',
    url: 'sub/work/submitReapply',
    loadOption: true,
    loadOption:{    
      text:"加载中..."
    },
    data: params
  });
}


