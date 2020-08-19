import http from "utils/http";
import qs from "qs";

/**
 *  获取字典分类列表
 * @param params
 */
export function pageManage(params) {
  return http({
    method: 'post',
    url: 'carema/manage/page',
    data: params
  });
}

/**
 *  获取字典分类列表
 * @param params
 */
export function pageShow(params) {
  return http({
    method: 'post',
    url: 'carema/show/page',
    data: params
  });
}

export function countManage() {
  return http({
    method: 'post',
    url: 'carema/manage/count'
  });
}

export function getEntity(entityId) {
  return http({
    method: 'post',
    url: 'carema/getEntity',
    data: qs.stringify({"entityId": entityId})
  });
}

export function updateCamera(camera) {
  return http({
    method: 'post',
    url: 'carema/update',
    data: camera
  });
}

export function updateCameraEntity(cameraEntity) {
  return http({
    method: 'post',
    url: 'carema/entity/update',
    data: cameraEntity
  });
}

export function getCameraListByEntityId(entityId, type) {
  return http({
    method: 'post',
    url: 'carema/listByEntityIdWeb',
    data: qs.stringify({"entityId": entityId, "type": type})
  });
}

export function getListCamerasByEntityId(entityId, type) {
  return http({
    method: 'post',
    url: 'carema/listCamerasByEntityId',
    data: qs.stringify({"entityId": entityId, "type": type})
  });
}

export function delCamera(camera) {
  return http({
    method: 'post',
    url: 'carema/delete',
    data: camera
  });
}

export function getListBack(params) {
  return http({
    method: 'post',
    url: 'camera/review/queryCloudRecords',
    data: params
  });
}

export function initToken() {
  return http({
    method: 'post',
    url: 'camera/review/initToken',
  });
}

/**
 *
 * @param {{base64:base64字符串,type:文件分类,field:虚拟字段,name:文件名称}} options 文件分类
 * @param {Function} callback 回调函数
 */
export function uploadBase64(params, callback) {
  return http({
    method: "post",
    loadOption: {
      text: "上传中..."
    },
    url: "camera/shot/uploadBase64",
    data: params,
    onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
      if (progressEvent.lengthComputable) {
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        if (progressEvent.total > 0) {
          progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
        }
        if (callback instanceof Function) {
          callback(progressEvent)
        }
      }
    },
  })
}
//短信告警
export function postEwSMSConfigUpdate(data) {
  return http({
    method: 'post',
    url: '/ewcenter/ewSMSConfig/update',
    data: data
  });
}
//短信告警获取配置
export function getEwSMSConfigFind(id) {
  return http({
    method: 'get',
    url: '/ewcenter/ewSMSConfig/find?togEntityId='+id
  });
}

//人脸库
//配置的主体获取
export function getEntityGet() {
  return http({
    method: 'get',
    url: '/ali/face/entity/get'
  });
}
//查询人脸库
export function getFaceList(params) {
  return http({
    method: 'get',
    url: '/ali/face/list',
    params
  });
}
//删除人脸库
export function getFaceDelete(params) {
  return http({
    method: 'get',
    url: '/ali/face/delete',
    params
  });
}
//添加人脸库
export function postFaceAdd(params) {
  return http({
    method: 'post',
    url: '/ali/face/add',
    data: params
  });
}

//获取主体全部Ai摄像头
export function getListEntityAICamera(params) {
  return http({
    method: 'get',
    url: '/ai/carema/listEntityAICamera',
    params
  });
}
//获取模型类型
export function getModel() {
  return http({
    method: 'get',
    url: '/ai/carema/getModel',
  });
}
//添加AI摄像头
export function postAddAICamera(params) {
  return http({
    method: 'post',
    url: '/ai/carema/addAICamera',
    data: params
  });
}
//编辑AI摄像头
export function postEditAICamera(params) {
  return http({
    method: 'post',
    url: '/ai/carema/editAICamera',
    data: params
  });
}
//删除摄像头
export function getDelAICamera(params) {
  return http({
    method: 'get',
    url: '/ai/carema/delAICamera',
    params
  });
}
//开启关闭
export function getSwitchAICamera(params) {
  return http({
    method: 'get',
    url: '/ai/carema/switchAICamera',
    params
  });
}
//普通摄像头封面上传
export function postCoverAdd(params) {
  return http({
    method: 'post',
    url: '/carema/cover/add',
    data: params
  });
}
//能不能添加ai摄像头
export function getCheckCamera(id) {
  return http({
    method: 'get',
    url: '/ai/carema/checkCamera?entityId='+id
  });
}

/*
  平台类型枚举
 */
export function getEnumTypes(params) {
  return http({
    method: 'post',
    url: '/common/enums',
    data: params
  })
}

/**
 * 添加海康AI摄像头/硬件分析平台
*/
export function postAddHKAICamera(params) {
  return http({
    method: 'post',
    url: '/ai/carema/hk/add',
    data: params
  });
}
/**
 * 编辑海康AI摄像头
*/
export function postEditHKAICamera(params) {
  return http({
    method: 'post',
    url: '/ai/carema/hk/edit',
    data: params
  });
}
/**
 * 删除海康AI摄像头
*/
export function getDelHKAICamera(params) {
  return http({
    method: 'get',
    url: '/ai/carema/hk/delete',
    params
  });
}

// 开启关闭硬件AI分析,0-关闭，1-开启
export function updateCaremaStatus(params) {
  return http({
    method: 'POST',
    url: '/ai/carema/ai/status/update',
    data: params
  });
}

// 大华获取设备信息
export function getDHDevice(params) {
  return http({
    method: 'GET',
    url: '/ai/carema/dh/device/list',
    params
  });
}

// 添加大华AI摄像头/大邑分析平台
export function addDHAICamera(params) {
  return http({
    method: 'POST',
    url: '/ai/carema/dh/add',
    data: params
  });
}

// 编辑大华AI摄像头
export function editDHAICamera(params) {
  return http({
    method: 'POST',
    url: '/ai/carema/dh/edit',
    data: params
  });
}

// 获取大华定制视频回放
export function getDHCamera(params) {
  return http({
    method: 'POST',
    url: '/carema/dh/record/get',
    data: params
  });
}



