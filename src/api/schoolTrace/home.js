import http2 from "utils/httpSchoolTrace";
import {getCookie} from "../../utils/sessionStorage";


// 获取简单主体信息
export function getInfo(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/entitySimpleInfo/find',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取功能集
export function getSettingModule(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/collection/find',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取详情(资质证照+视频)
export function getDetail(params) {
  return http2({
    method: 'get',
    url: '/api/guard/school/guard/schoolDetail',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//每日菜谱列表
export function getMenu(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/dr/list',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//校长陪餐列表

export function getAccompany(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/pam/find/daysList',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}
// 食品留样列表
export function getReserved(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/fs/bigScreenList/v2',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

// 获取食品留样详情
export function getReservedDetail(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/fs/find/v2',
    params: params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

// 获取字典树
export function getDictTree() {
  return http2({
    method: 'get',
    url: '/api/guard/common/dict/tree',
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取摄像头列表
export function getVideoList(params) {
    return http2({
        method: 'get',
        url: '/api/guard/system/xcwsEntity/camera/list',
        params:params,
        headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
    })
}


//获取摄像头地址
export function getUrl(params) {
  return http2({
    method: 'get',
    url: '/api/guard/system/xcwsEntity/camera/url',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取进货查验列表
export function getWareHouse(params) {
  return http2({
    method: 'post',
    url: '/api/guard/customer/bigScreen/stockinsy/list',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取进货查验详情
export function getWareHouseDetail(params) {
  return http2({
    method: 'post',
    url: '/api/guard/customer/bigScreen/stockinsy/detail',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取出库列表
export function getDelivery(params) {
  return http2({
    method: 'post',
    url: '/api/guard/customer/bigScreen/stockoutsy/list',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取出库详情

export function getDeliveryDtail(params) {
  return http2({
    method: 'post',
    url: '/api/guard/customer/bigScreen/stockoutsy/detail',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取添加剂列表
export function getAdditive(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/additive/paging',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//获取添加剂详情
export function getAdditiveDetail(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/additive/find',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

// 获取子食堂下拉列表
export function getSubList(params) {
  return http2({
    method: 'get',
    url: '/api/guard/customer/bigScreen/subEntityConf/available/list',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}

//查询子食堂开启的功能模块
export function getSwitch(params) {
  return http2({
    method: 'post',
    url: '/api/guard/customer/bigScreen/subEntity/find',
    params:params,
    headers: {'XCWSOpenSecret': getCookie('XCWSOpenSecret')}
  })
}