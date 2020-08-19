import http from 'utils/http';

export function getPage(params) {
  return http({
    method: 'post',
    url: 'admin/dept/page',
    data: params
  });
}

/**
 * 获取部门类型
 * @return 部门类型list
 */
export function getDeptType() {
  return http({
    method: 'get',
    url: 'admin/dept/get/type'
  });
}

/**
 * 添加区域
 * @param deptData 需要添加的部门数据
 */
export function addDept(deptData) {

  return http({
    method: 'post',
    url: 'admin/dept/add',
    data: deptData
  })
}

export function updateDept(deptData) {
  return http({
    method: 'post',
    url: 'admin/dept/update',
    data: deptData
  });
}

export function addDeptModuleFunc(params) {
  let data = params;
  return http({
    method: 'post',
    url: 'admin/dept/addDeptModuleFunc',
    data
  });
}
