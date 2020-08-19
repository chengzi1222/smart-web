import http from "utils/http";

/**
 *  获取添加人员列表
 * @param {Object} data 搜索查询
 * @param {Number} pageSize 分页大小
 * @param {Number} pageNum 第几页
 */
export function pageOfadd(data, pageSize, pageNum) {
  return http({
    method: 'post',
    url: `random/user/page/add/${pageSize}/${pageNum}`,
    data
  });
}

/**
 *  分页查询
 * @param {Object} data 搜索查询
 * @param {Number} pageSize 分页大小
 * @param {Number} pageNum 第几页
 */
export function page(data, pageSize, pageNum) {
  return http({
    method: 'post',
    url: `random/user/page/${pageSize}/${pageNum}`,
    data
  });
}


/**
 *  获取巡查要点表列表
 * @param {Object} data
 */
export function add(data) {
  return http({
    loading: true,
    method: 'post',
    url: `random/user/batch/save`,
    data
  });
}


/**
 *  更新数据
 * @param {Object} data
 */
export function update(data) {
  return http({
    method: 'post',
    loading: true,
    url: `random/user/update`,
    data
  });
}

/**
 *  更新数据
 * @param {Array} data
 */
export function batchRemove(data) {
  return http({
    method: 'post',
    loading: true,
    url: `random/user/batch/remove`,
    data
  });
}



