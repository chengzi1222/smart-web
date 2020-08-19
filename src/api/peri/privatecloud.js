import http from "utils/http";
import qs from "qs";

/**
 *  获取字典分类列表
 * @param params
 */
export function findPage(params,pageNum,pageSize) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/findPage/'+pageNum+"/"+pageSize,
    data: params
  });
}

/**
 *  添加
 * @param params
 */
export function add(params) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/add',
    data: params
  });
}

/**
 *  修改
 * @param params
 */
export function edit(params) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/edit',
    data: params
  });
}

/**
 * 详情
 * @param params
 */
export function detail(cloudId) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/detail/'+cloudId,
    data: {}
  });
}

export function updateCamera(camera) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/updatePrivateCamera',
    data: camera
  });
}

/**
 *  获取摄像头列表
 * @param params
 */
export function findCameraList(entityId,cloudId) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/findCameraList',
    data: qs.stringify({"entityId": entityId, "cloudId": cloudId})
  });
}

/**
 *  删除设备
 * @param params
 */
export function delCamera(cloudId,entityId,cameraId) {
  return http({
    method: 'post',
    url: 'camera/privatecloud/delCamera/'+cloudId+'/'+entityId+'/'+cameraId,
    data: {}
  });
}
