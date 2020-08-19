import http from "utils/http";

/***********短信预警模块配置**************/

/**
 * 添加配置
*/
export function addModule(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/module/add',
      data
  });
}

/**
 * 更新配置
*/
export function updateModule(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/module/update',
      data
  });
}

/**
 * 查询
*/
export function getModuleList(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/note/module/list',
      params
  });
}

/***********预警短信手机号码管理**************/

/**
 * 添加预警短信手机号码
*/
export function addPhone(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/phone/add',
      data
  });
}

/**
 * 更新预警短信手机号码
*/
export function updatePhone(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/phone/update',
      data
  });
}

/**
 * 删除预警短信手机号码
*/
export function delPhone(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/note/phone/delete',
      params
  });
}

/**
 * 查询食品主体预警短信手机号码
*/
export function getEntityPhoneList(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/phone/entity/page',
      data
  });
}

/**
 * 查询监管部门预警短信手机号码
*/
export function getSupervisionPhoneList(data) {
  return http({
      method: 'POST',
      url: '/ewcenter/note/phone/supervision/page',
      data
  });
}

/**
 * 获取该区域下对应主体
*/
export function getAreaSubList(params) {
  return http({
      method: 'GET',
      url: '/ewcenter/note/phone/name/find',
      params
  });
}