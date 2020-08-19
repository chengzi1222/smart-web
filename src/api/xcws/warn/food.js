import http from "utils/http";
import http2 from "utils/httpSchoolTrace";
//过期预警主体列表

export function getWarningList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/inventoryWarning/entity/paging',
        params: params
    });
}
//预警列表导出
export function getWarningListExport(params) {
    return http({
        method: 'get',
        url: '/ewcenter/ewList/export',
        params: params
    });
}

//过期预警商品详情

export function getWarningDetail(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/inventoryWarning/entity/find',
        params: params
    });
}

//预警商品列表
export function getWarningFoodList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/inventoryWarning/warnGoods/paging',
        params: params
    });
}

//导出预警列表
export function exportWarningList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/inventoryWarning/entity/export',
        params: params
    });
}

export function getAreaTree(parentId) {
    return http({
      method: 'GET',
      url: '/food/guard/areaTree/find?parentId=' + parentId,
    });
  }

//预警列表
export function getWarnList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/paging',
        params: params
    });
}
// 预警统计
export function getWarnCount(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/count',
        params: params
    });
}

// 预警汇总信息
export function getEwSummary(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/ewSummary',
        params: params
    });
}


//各类详情处理
export function handleDetail(params,url) {
    return http({
        method: 'POST',
        url: url,
        data: params
    });
}

//食品预警详情
export function getEwFoodExpired(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewFoodExpired/paging',
        params: params
    });
}

//投诉建议预警详情
export function getEwComplain(params) {
    return http({
        method: 'POST',
        url: '/ewcenter/ewComplain/paging',
        data: params
    });
}

// 溯源预警详情
export function getEwOrigin(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewOrigin/paging',
        params: params
    });
}

//监管预警详情
export function getSupervise(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewPatrol/paging',
        params: params
    });
}

//检测预警详情
export function getCheck(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewDetect/paging',
        params: params
    });
}

//AI预警详情
export function getAIDetail(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewAiCamera/paging',
        params: params
    });
}



//AI预警小类型汇总
export function getSmallTypeList(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/ewAiCamera/small/type/paging',
      params: params
  });
}

//后厨管理预警配置-列表
export function getEwChefConfigList(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/ewChef/config/list',
      params
  });
}

//后厨管理预警配置-添加
export function addEwChefConfig(params) {
  return http({
      method: 'POST',
      url: '/ewcenter/ewChef/config/add',
      data: params
  });
}

//后厨管理预警配置-更新
export function updateEwChefConfig(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/ewChef/config/update',
      params
  });
}