import http from "utils/http";
import qs from "qs";

export function page(pageData) {
  let data = pageData;
  return http({
    method: 'post',
    url: 'admin/role/page',
    data
  });
}

export function pageCustom(pageData) {
  let data = pageData;
  return http({
    method: 'post',
    url: 'admin/role/custom/page',
    data
  });
}
export function listRoleCustomByDeptId(params) {
  let data = qs.stringify(params);
  return http({
    method: 'post',
    url: 'admin/role/custom/listRoleCustomByDeptId',
    data
  });
}

export function addRole(role) {
  let data = role;
  return http({
    method: 'post',
    url: 'admin/role/add',
    data
  });
}

export function editRole(role) {
  let data = role;
  return http({
    method: 'post',
    url: 'admin/role/edit',
    data
  });
}

export function addRoleCustom(roleCustom) {
  let data = roleCustom;
  return http({
    method: 'post',
    url: 'admin/role/custom/add',
    data
  });
}

export function editRoleCustom(roleCustom) {
  let data = roleCustom;
  return http({
    method: 'post',
    url: 'admin/role/custom/edit',
    data
  });
}

export function addRoleModuleFunc(params) {
  let data = params;
  return http({
    method: 'post',
    url: 'admin/role/addRoleModuleFunc',
    data
  });
}

export function addDeptRoleCustom(params) {
  let data = params;
  return http({
    method: 'post',
    url: 'admin/role/addDeptRoleCustom',
    data
  });
}

export function updateEnable(id, enable) {
  let data = { "id": id, "enable": enable };
  return http({
    method: 'post',
    url: 'admin/role/enable',
    data
  });
}

export function delRole(roleId) {
  let data = qs.stringify({ "roleId": roleId });
  return http({
    method: 'post',
    url: 'admin/role/del',
    data
  });
}

export function getRoleById(roleId) {
  let data = qs.stringify({ "roleId": roleId });
  return http({
    method: 'post',
    url: 'admin/role/getRoleById',
    data
  });
}

export function getRoleType() {
  return http({
    method: 'get',
    url: 'admin/role/getRoleType'
  });
}

export function getBelong() {
  return http({
    method: 'get',
    url: 'admin/role/getBelong'
  });
}
