/**
 * Created by KLJ on 2017年9月6日 10:08:10
 */
import http from "utils/http";
import qs from "qs";

/**
 *
 * @param params
 * @param size
 * @param num
 */
export function list(params, size, num) {
  let data = {
    params: params,
    size: size,
    num: num
  }
  return http({
    method: 'get',
    url: 'admin/area/list',
    data
  })
}

export function addArea(dto) {
  let data = dto;
  return http({
    method: 'post',
    url: 'admin/area/add',
    data
  })
}

export function update(dto) {
  let data = dto;
  return http({
    method: 'post',
    url: 'admin/area/update',
    data
  })
}

export function getAreaChildren(pid) {
  let data = qs.stringify({
    parentCode: pid
  });
  return http({
    method: 'post',
    url: 'admin/area/get/children',
    data
  })

}

export function getDeptSddByDeptId(deptId) {
  let data = qs.stringify({
    deptId: deptId
  });
  return http({
    method: 'post',
    url: 'support/orgainze/dept/getDeptSddByDeptId',
    data
  })

}

/**
 * 查询部门集合
 * @param params.areaCode 数据编码
 * @param params.deptType 部门类型
 */
export function getDeptPage(data, page) {
  return http({
    method: 'post',
    url: 'support/organize/depts',
    data: data,
    params: page
  })
}

/**
 * 获取部门树
 * @param areaCode
 */
export function getDeptTree(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/get/dept/tree',
    data: qs.stringify(params)
  })
}

/**
 * 获取部门树
 * @param areaCode
 */
export function getDeptTable(params, page) {
  return http({
    method: 'post',
    url: 'support/orgainze/depts',
    params: page,
    data: params
  })
}

export function getUserTable(params, page) {
  return http({
    method: 'post',
    url: 'support/orgainze/users',
    params: page,
    data: params
  })
}

export function updateUser(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/user/update',
    data: params
  })
}

export function updateDept(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/update',
    data: params
  })
}

export function restPwd(id) {
  return http({
    method: 'post',
    url: 'support/orgainze/user/reset/password',
    data: qs.stringify({
      id: id
    })
  })
}

export function addUser(userData) {
  return http({
    method: 'post',
    url: 'support/orgainze/user/add',
    data: userData
  })
}

export function addUserValid(phoneNum) {
  return http({
    method: 'get',
    url: 'support/orgainze/user/add/valid',
    params: {'phoneNum': phoneNum}
  })
}

/**
 * 查询部门和部门的角色信息
 * @author klj
 * @param did
 */
export function getDeptAndRoles(did) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/get',
    data: qs.stringify({
      did: did
    })
  })
}

export function getUserInfo(uid) {
  return http({
    method: 'post',
    url: 'support/orgainze/user/get',
    data: qs.stringify({
      uid: uid
    })
  })
}

export function getSubPartsPage(params) {
  return http({
    method: 'post',
    url: 'support/user/page/allSubPartsUser',
    data: params
  });
}

export function deleteUserById(params) {
  return http({
    method: 'post',
    url: 'support/user/delete/byUserId',
    data: qs.stringify(params)
  });
}

export function getDeptSubAreaInfoWithNotExitsDeptForThatArea(did2) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/getDeptSubAreaInfoWithNotExitsDeptForThatArea',
    data: {
      uid: did2
    }
  })
}

export function getDdptNameByAreaAndParentDept(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/getDdptNameByAreaAndParentDept',
    data: params
  })
}

export function getCustomDdptNameByAreaAndParentDept(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/getCustomDdptNameByAreaAndParentDept',
    params: params
  })
}

export function getUserByDeptId(deptId2) {
  const data = qs.stringify({
    deptId: deptId2
  })
  return http({
    method: 'post',
    url: 'support/orgainze/user/getUserByDept',
    data
  })
}

export function getStecilFileByDeptId(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/getStecilFileByDeptId',
    data: qs.stringify(params),
  });
}

export function uploadExcelFile(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/import',
    params,
  });
}

export function getUserStecilFileByDeptId(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/getUserStecilFileByDeptId',
    data: qs.stringify(params),
  })
}

export function getStecilPorcess(id) {
  return http({
    method: 'get',
    url: 'support/orgainze/import/progerss',
    params: {id: id},
  })
}

export function getExcelFileAboutDeptInfo(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/getExcelFileAboutDeptInfo',
    data: qs.stringify(params),
  })
}

export function addDeptAndDeptAdmin(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/addDeptAndDeptAdmin',
    data: params
  })
}

export function editDeptAndDeptAdmin(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/editDeptAndDeptAdmin',
    data: params
  })
}

export function getDeptAllSubArea(params) {
  return http({
    method: 'post',
    url: 'support/orgainze/dept/getDeptAllSubArea',
    data: params
  })
}

/**
 * 获取直属部门列表
 */

export function getSubDeptList() {
  return http({
    method:'get',
    url:'admin/subDept/list',
  })
}

/**
 * 获取职务列表
 */

export function getPostList() {
  return http({
    method:'get',
    url:'admin/post/list',
  })
}
