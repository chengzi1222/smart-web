import http from 'utils/http';
import qs from 'qs';

export function getUserType() {
  return http({
    method: 'get',
    url: 'admin/user/get/type'
  });
}
export function getPage(params) {
  return http({
    method: 'post',
    url: 'admin/user/page',
    data: params
  })
}



export function addUser(userData) {
  return http({
    method: 'post',
    url: 'admin/user/add',
    data: userData
  });
}

export function getUserByDept(dept) {
  let data = qs.stringify({
    id: dept.id
  });
  return http({
    method: 'post',
    url: 'admin/user/get/dept/user',
    data: data
  })
}

export function updateUser(userData) {
  return http({
    method: 'post',
    url: 'admin/user/update',
    data: userData
  });
}

export function resetPassword(userId) {
  return http({
    method: 'post',
    url: 'admin/user/reset/password',
    data: qs.stringify({
      id: userId
    })
  })
}

export function deleteUser(userId) {
  return http({
    method: 'post',
    url: 'admin/user/delete/byUserId',
    data: qs.stringify({
      id: userId
    })
  })
}
