import http from 'utils/http'

/**
 * 摄像头主体列表(带摄像头列表)
 *
 */
export function findCameraEntity(params) {
  return http({
    method: 'post',
    url: '/active/camera/findCameraEntity',
    data: params
  })
}

/**
 * 摄像头主体列表(带摄像头列表)
 *
 */
export function addCameraEntity(entityId) {
  return http({
    method: 'post',
    url: '/active/camera/addCameraEntity/' + entityId,
  })
}

/**
 * 修改摄像头
 *
 */
export function updateCamera(params) {
  return http({
    method: 'post',
    url: '/active/camera/updateCamera',
    data: params
  })
}

/**
 * 删除摄像头
 *
 */
export function deleteCamera(id) {
  return http({
    method: 'post',
    url: '/active/camera/deleteCamera/' + id,
  })
}

/**
 * 直播配置列表
 * @param id
 */
export function findCameraEntitys(params) {
  return http({
    method: 'post',
    url: '/active/camera/findCameraEntitys/' + params.taskId + '/' + params.pageNum + '/' + params.pageSize,
    data: params
  })
}

/**
 * 直播配置主体列表
 * @param id
 */
export function findCameraEntityList(params) {
  return http({
    method: 'post',
    url: '/active/camera/findCameraEntityList/' + params.taskId + '/' + params.pageNum + '/' + params.pageSize,
    data: params
  })
}

/**
 * 删除直播配置主体
 * @param id
 */
export function deleteCameraConfig(id) {
  return http({
    method: 'post',
    url: '/active/camera/deleteCameraConfig/' + id,
  })
}

/**
 * 添加直播配置主体
 * @param id
 */
export function addCameraConfig(taskId, cameraEntityId) {
  return http({
    method: 'post',
    url: '/active/camera/addCameraConfig/' + taskId + '/' + cameraEntityId,
  })
}

/**
 * 摄像头展示主体列表(带摄像头列表)
 * @param taskId
 */
export function showCameraEntity(taskId) {
  return http({
    method: 'post',
    url: '/active/camera/showCameraEntity/' + taskId,
  })
}

/**
 * 查询主体列表
 * @param params
 */
export function entityList(params) {
  return http({
    method: 'post',
    url: '/active/camera/entityList/' + params.pageNum + '/' + params.pageSize,
    data: params
  })
}

export function deleteCameraEntity(entityId) {
  return http({
    method: 'post',
    url: '/active/camera/deleteCameraEntity/' + entityId
  })
}


