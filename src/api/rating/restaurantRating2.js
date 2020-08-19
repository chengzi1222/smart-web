import http from "utils/http";

//日常检查策略详情
export function getFoodDjpdDetail() {
    return http({
      method: 'get',
      url: '/food/djpd/detail',
    });
  }

//日常检查策略更新
export function getFoodDjpdUpdate(data) {
    return http({
      method: 'post',
      url: '/food/djpd/update/type',
      data:data
    });
  }

  //风险查询列表
  export function getTableList(params) {
    return http({
      method: 'get',
      url: '/food/djpd/table/list',
      params
    });
  }

  //风险表基本信息
  export function getBaseInfo(params) {
    return http({
      method: 'get',
      url: '/food/djpd/table/baseInfo',
      params
    });
  }

  //风险表检查内容列表
  export function getContentList(params) {
    return http({
      method: 'get',
      url: '/food/djpd/table/content/list',
      params
    });
  }

  //删除风险表
  export function delTable(tableId) {
    return http({
      method: 'post',
      url: `/food/djpd/table/delete/${tableId}`,
    });
  }

  //启用禁用风险表
  export function tableStatus(params) {
    return http({
      method: 'post',
      url: '/food/djpd/table/status',
      params
    });
  }

  //主体列表
  export function getSubList(params) {
    return http({
      method: 'get',
      url: '/food/djpd/entity/list',
      params
    });
  }

  //获取调整原因
  export function getReason(params) {
    return http({
      method: 'get',
      url: '/food/djpd/entity/adjustReason',
      params
    });
  }

  //获取审核人列表
  export function inspectorList() {
    return http({
        method: 'get',
        url: `/xchc/patrol/inspectorList`,
        params: {
            inspectorName:'',
            pageNum:1,
            pageSize:10
        }
    })
  }

  //调整风险等级
  export function addjustLevel(data) {
    return http({
      method: 'post',
      url: '/food/djpd/entity/adjustLevel',
      data:data
    });
  }