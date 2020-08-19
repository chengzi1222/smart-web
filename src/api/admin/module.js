import http from "utils/http";
import qs from "qs";

/**
 * 扫描模块
 */
export function scan() {
  return http({
    method: 'post',
    url: 'admin/module/scan'
  })
}

export function page(pageData) {
  let data = pageData;
  return http({
    method: 'post',
    url: 'admin/module/page',
    data
  });
}

export function listModuleByMenuId(params) {
  let data = qs.stringify(params);
  return http({
    method: 'post',
    url: 'admin/module/listModuleByMenuId',
    data
  });
}

export function listFunc(moduleCode) {
  let data = qs.stringify({ "moduleCode": moduleCode });
  return http({
    method: 'post',
    url: 'admin/module/function',
    data
  });
}

export function listModuleFuncAll(params) {
  let data = qs.stringify(params);
  return http({
    method: 'post',
    url: 'admin/module/listModuleFuncAll',
    data
  });
}

export function listFuncByDeptId(params) {
  let data = qs.stringify(params);
  return http({
    method: 'post',
    url: 'admin/module/listFuncByDeptId',
    data
  });
}

export function listFuncByRoleId(params) {
  let data = qs.stringify(params);
  return http({
    method: 'post',
    url: 'admin/module/listFuncByRoleId',
    data
  });
}

export function editModule(module) {
  let data = module;
  return http({
    method: 'post',
    url: 'admin/module/function/edit',
    data
  });
}

export function listFuncByRoleIdGroup(roleId = "", deptId = "") {
  let data = qs.stringify({ "roleId": roleId, "deptId": deptId });
  return http({
    method: 'post',
    url: 'admin/module/listFuncByRoleIdGroup',
    data
  });
}

