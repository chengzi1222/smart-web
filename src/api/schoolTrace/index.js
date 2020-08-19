import http from "utils/httpSchoolTrace";
import http2 from "utils/httpFood";
import {getCookie} from "../../utils/sessionStorage";

// 培训列表
export function getTraining(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/eat/paging',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 培训详情
export function getTrainingInfo(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/eat/detail',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}
// 基础路径
export function getbaseUrl() {
    return http({
        method: 'get',
        url: '/api/guard/common/file/baseUrl/find',
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}
// 字典树
export function getDictTree() {
    return http({
        method: 'get',
        url: '/api/guard/common/dict/tree',
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 垃圾列表
export function getTrash(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/kw/paging',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 垃圾详情
export function getTrashInfo(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/kw/detail',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}
// 清洗消毒列表
export function getClean(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/cad/paging',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 清洗消毒详情
export function getCleanInfo(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/cad/find',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 晨检
export function getInspected(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/mi/find',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}
// 晨检不合格详情
export function getProblemItemInfo(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/mi/problemItemInfo/find',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}
// 溯源
export function getTrace(params) {
    return http2({
        method: 'get',
        url: '/sy/crossIndex',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 规章制度
export function getRegulation(params) {
    return http({
        method: 'get',
        url: '/api/guard/customer/bigScreen/regulation/paging',
        params: params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}

// 楼盘信息 - 主体更新
//   export function postBuildingUpdate(id, params) {
//     return http({
//       method: 'post',
//       url: '/tzsb/building/' + id + '/update',
//       data: params,
    // headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
//     })
//   }


