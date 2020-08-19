import http from "utils/http";
import qs from "qs";

/**
 * 获取配置文件
 *
 */
export function getConfigFile(areaCode, entityType) {
  return http({
    method: 'get',
    url: 'maai/sub/import/config/' + entityType + '/' + areaCode
  });
}

/**
 * 获取下属部门
 */
export function getSubordinate(areaCode, entityType) {
  return http({
    method: 'get',
    url: 'maai/sub/import/subordinate/' + entityType + '/' + areaCode
  });
}

/**
 * 详情接口
 */
export function getInfo(entityId) {
  return http({
    method: 'get',
    url: 'maai/sub/import/info/' + entityId
  });
}

/**
 * 导入
 */
export function add(importInformaion) {
    return http({
      method: 'post',
      url: 'maai/sub/import',
      data: importInformaion
    });
  }
  
  /**
   * 审核分页
   */
  export function page(page, searchMap) {
    return http({
      method: 'post',
      url: 'maai/sub/import/page/' + page.pageNum + '/' + page.pageSize,
      data: searchMap
    });
  }
  
  /**
   * 批量审核
   */
  export function review(ids) {
    return http({
      method: 'post',
      url: 'maai/sub/import/review',
      data: ids
    });
  }

 /**relation
  * 删除
  */
 export function del(ids) {
    return http({
      method: 'post',
      url: 'maai/sub/import/del',
      data: ids
    });
  }


/**
 * 关联文件
 */
export function relation(fileId, entityType) {
  return http({
    method: 'get',
    url: 'maai/sub/import/relation/' + entityType + '/' + fileId
  });
}

export function getDept(areaCode) {
  return http({
    method: 'get',
    url: 'sub/import/getDept/' + areaCode
  });
}

/**
 * 删除文件
 * @param id
 */
export function removeFile(id){
  return http({
    loading: false,
    method: 'DELETE',
    url: 'file/' + id
  });
}

