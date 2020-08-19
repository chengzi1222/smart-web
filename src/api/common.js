// 文件说明
// 公共请求common.js
import http from "../utils/http";
import httpSchoolTrace from "../utils/httpSchoolTrace";
import qs from "qs";

export function getByAreaCode(areaCode) {
  return http({
    method: 'post',
    url: '/env/area',
    data: qs.stringify({ "areaCode": areaCode })
  })
}

/**
 *  获取用户字典项列表
 * @param params
 */
export function listDictUserItemByDictCode(dictCode) {
  return http({
    method: 'post',
    url: 'env/userDict/listDictItemByDictCode',
    data: qs.stringify({ "dictCode": dictCode })
  });
}

/**
 * 获取网格
 * @deprecated
 */
export function getdeptGrid() {
  return http({
    method: 'post',
    url: 'env/grid/getByDept'
  });
}

/**
 *  获取摄像头类型
 * @deprecated
 */
export function listCaremaType() {
  return http({
    method: 'post',
    url: 'env/peri/listCaremaType'
  });
}

/**
 *  获取启禁用状态
 * @deprecated
 */
export function listEnable() {
  return http({
    method: 'post',
    url: 'env/listEnable'
  });
}

/**
 *  获取用户字典项列表(所有字段)
 * @deprecated
 */
export function listDictUserItemByCodeAll(dictCode) {
  return http({
    method: 'post',
    url: 'env/dict/listDictUserItemByCodeAll',
    data: qs.stringify({ "dictUserCode": dictCode })
  });
}

/**
 * 获取枚举
 * @param {Array} classes class name 全限定名
 * @param {Boolean} isGroup 是否分组
 */
export function getEnums(classes, isGroup) {
  return http({
    method: 'post',
    params: {
      isGroup
    },
    url: 'common/enums',
    data: classes
  });
}


/**
 * 获取用户字典
 * @param {Array} codes codes 字典数组
 */
export function getDicts(codes) {
  return http({
    method: 'post',
    url: 'common/dicts',
    data: codes
  });
}


/**
 *
 * @param {File} file 文件
 * @param {{type:文件分类,field:虚拟字段,name:文件名称}} options 文件分类
 * @param {Function} callback 回调函数
 */
export function uploadFile(file, options, callback) {
  return http({
    method: "post",
    loadOption: {
      text: "上传中..."
    },
    url: "/upload",
    data: file,
    headers: { 'Content-Type': 'multipart/form-data' },
    params: options,
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

/**
 * 下载文件
 * @param {String} fileid fastdfs id
 * @param {String} filename 文件名称
 */
export function downloadFile(fileid, filename) {
  if (filename) {
    var code = encodeURI(filename);
    location.href = `/api/download?fileid=${fileid}&filename=${code}`;
  } else {
    location.href = `/api/download?fileid=${fileid}`;
  }
}

/**
 * 下载oss
 * @param {String} fileid fastdfs id
 * @param {String} filename 文件名称
 */
export function downloadFileOss(fileid, filename) {
  if (filename) {
    var code = encodeURI(filename);
    location.href = `/api/shanghai/download?fileid=${fileid}&filename=${code}`;
  } else {
    location.href = `/api/shanghai/download?fileid=${fileid}`;
  }
}

/**
 * 下载文件--大华AI截图下载
 * @param {String} fileid fastdfs id
 * @param {String} filename 文件名称
 */
export function downloadFileDH(fileid, filename) {
  if (filename) {
    var code = encodeURI(filename);
    location.href = `/api/dh/download?fileid=${fileid}&filename=${code}`;
  } else {
    location.href = `/api/dh/download?fileid=${fileid}`;
  }
}

/**
 * 查询 分管网格/所属区域
 */
export function findDeptGrid() {
  return http({
    type: 'get',
    url: 'common/dept/grid'
  })
}
/**
 * 查询 分管网格/所属区域 tob
 */
export function getAreaTree() {
  return http({
    type: 'get',
    url: '/ewcenter/ewArea/getAreaTree'
  })
}
/**
 * 查询 分管网格/所属区域 (没有网格，只到街道)
 */
export function findDeptGridNotStreet() {
  return http({
    type: 'get',
    url: 'common/dept/gridNotStreet'
  })
}

/**
 * 查询 分管网格/所属区域 (没有网格，只到街道,不根据账号只显示下级，所有全部显示)
 */
export function findDeptGridNotStreetAll() {
  return http({
    method: "post",
    url: '/cosmetic/record/dept/grid'
  })
}

/**
 * 查询 分管网格 下级区域
 */
export function findDeptChild() {
  return http({
    type: 'get',
    url: 'common/dept/children'
  })
}
/**
 * 查询 分管网格/所属区域
 */
export function listFile(issueId) {
  return http({
    type: 'get',
    url: `common/listFile?issueId=${issueId}`
  })
}

/**
 * 获取oss签名策略
 */
// {IMAGE: 10485760, ANNEX: 10485760,VIDEO: 1073741824}
export function policy(type) {
  return http({
    method: 'GET',
    url: '/policy',
    params: { fileType: type }
  })
}

/**
 * 上传文件到oss
 */
export function uploadOss(url, data) {
  http({
    url: url,
    method: 'POST',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
/**
 * 上传图片到oss
 */
export function getPostPolicy() {
  return http({
    method: 'get',
    url: '/xcws/file/getPostPolicy',
    params: { uploadFileType: "FILE" }
  })
}