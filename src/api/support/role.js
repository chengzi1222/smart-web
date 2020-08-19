import http from 'utils/http';
import qs from 'qs';

export function page(pageData) {
  let data = pageData;
  return http({
    method: 'post',
    url: 'support/role/page',
    data
  });
}


export function updateEnable(id, enable) {
  let data = { "id": id, "enable": enable };
  return http({
    method: 'post',
    url: 'support/role/enable',
    data
  });
}

export function delRole(roleId) {
  let data = qs.stringify({ "roleId": roleId });
  return http({
    method: 'post',
    url: 'support/role/del',
    data
  });
}

export function getRoleById(roleId) {
  let data = qs.stringify({ "roleId": roleId });
  return http({
    method: 'post',
    url: 'support/role/getRoleById',
    data
  });
}

export function updateRole(params) {
  let data = params;
  return http({
    loading: true,
    method: 'post',
    url: 'support/role/update',
    data
  });
}

export function listFuncByRoleIdGroup(roleId = "", deptId = "") {
  let data = qs.stringify({"roleId": roleId, "deptId": deptId});
  return http({
    method: 'post',
    url: 'support/role/listFuncByRoleIdGroup',
    data
  });
}
