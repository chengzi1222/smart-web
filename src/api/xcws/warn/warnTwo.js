import http from "utils/http";
import http2 from "utils/httpSchoolTrace";
//预警列表

export function getWarningList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/paging',
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

//预警列表-统计

export function getStatistics(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/count',
        params: params
    });
}
//预警列表详情-汇总信息

export function getEwSummary(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewList/ewSummary',
        params: params
    });
}
//后厨预警详情列表
  
export function getEwChefList(params) {
    return http({
        method: 'GET',
        url: '/ewcenter/ewChef/paging',
        params: params
    });
}
//许可证预警详情列表
  
export function getEwLicenceList(params) {
    return http({
        method: 'POST',
        url: '/ewcenter/licence/paging',
        data: params
    });
}

//健康证预警详情列表
  
export function getEwHealthList(params) {
    return http({
        method: 'POST',
        url: '/ewcenter/ewHealth/healthDetails',
        data: params
    });
}

//校餐监管预警统计，风险类型分布
  
export function getRiskTypeDtr() {
    return http({
        method: 'get',
        url: '/ewcenter/bigScreen/riskTypeDtr',
    });
}

//主体考核排名分页
  
export function getEwEntityRanking(params) {
    return http({
        method: 'get',
        url: '/ewcenter/ewEntityRanking/paging',
        params: params
    });
}

//主体考核排名导出
export function getEwEntityRankingExport(params) {
    return http({
        method: 'get',
        url: '/ewcenter/ewEntityRanking/export',
        params: params
    });
}
//食安指数考核详情
export function getEntityExamineInfo(params) {
    return http({
        method: 'get',
        url: '/ewcenter/ewEntityRanking/entityExamineInfo',
        params: params
    });
}
//主体食安指数预警详情
export function getEntityEwDetail(params) {
    return http({
        method: 'get',
        url: '/ewcenter/ewEntityRanking/entityEwDetail',
        params: params
    });
}

//辖区排名
export function getAreaAssess(params) {
    return http({
        method: 'POST',
        url: '/ewArea/rank/list',
        params: params
    });
}
//辖区排名导出
export function getAreaAssessExport(params) {
    return http({
        method: 'POST',
        url: '/ewArea/rank/export',
        params: params
    });
}
//高风险主体数量趋势
export function getHighRiskNum() {
    return http({
        method: 'get',
        url: '/ewcenter/bigScreen/highRiskNum',
    });
}
//风险总数趋势
export function getRiskTotalNum() {
    return http({
        method: 'get',
        url: '/ewcenter/bigScreen/riskTotalNum',
    });
}
