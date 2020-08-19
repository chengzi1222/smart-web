import http from "utils/http";

/**
 * 详情接口
 */
export function getInfo(entityId) {
  return http({
    method: 'get',
    url: 'medi/import/info/' + entityId
  });
}

/**
 * 导入
 */
export function add(importInformaion) {
    return http({
      method: 'post',
      url: 'medi/import',
      data: importInformaion
    });
  }
  
  /**
   * 审核分页
   */
  export function page(page, searchMap) {
    return http({
      method: 'post',
      url: 'medi/import/page/' + page.pageNum + '/' + page.pageSize,
      data: searchMap
    });
  }
  
  /**
   * 批量审核
   */
  export function review(ids) {
    return http({
      method: 'post',
      url: 'medi/import/review',
      data: ids
    });
  }

 /**
  * 删除
  */
 export function del(ids) {
    return http({
      method: 'post',
      url: 'medi/import/del',
      data: ids
    });
  }