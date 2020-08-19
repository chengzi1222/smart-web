import http from 'utils/http';
/**
 * 查询创建圆的显示点
 * @param {Number} codeLevel 区域级别
 * @param {String} datacode 数据编码可以没有
 */
export function mapCircle(codeLevel,taskId , datacode, searchMap) {
  return http({
    method: 'post',
    url: 'medi/entity/map/circle',
    data: searchMap,
    params: {
      taskId: taskId,
      codeLevel: codeLevel,
      datacode: datacode
    },
  })
};

/**
 * 查询部门集合
 * @param areaCode 数据编码
 */
export function getByAreaCode(areaCode) {
  return http({
    method: 'get',
    url: 'medi/entity/map/getByAreaCode/'+ areaCode
  });
}

/**
 * 获取当前登录用户中心点
 */
export function mapCenter() {
  return http({
    method: 'get',
    url: 'medi/entity/map/center',
    // data: qs.stringify(params),
    // params
  })
}

/**
 * 获取所有主体的坐标
 * @param {String} datacode 区域编码
 * @param {{}} data
 */
export function mapPoint(datacode,taskId, searchMap) {
  return http({
    method: 'post',
    url: 'medi/entity/map/point',
    data: searchMap,
    params: {
      taskId: taskId,
      datacode: datacode
    },
  })
}

export function findEntity(taskId, id) {
  return http({
    method: 'get',
    url: 'medi/entity/map/show',
    params: { id, taskId },
  });
}

export function findDept() {
  return http({
    method: 'get',
    url: 'medi/entity/map/dept',
  });
}

export function pageSearch(searchMap, pageNum, pageSize,taskId) {
  return http({
    method: 'post',
    url: `medi/entity/map/page/${taskId}/${pageNum}/${pageSize}`,
    data: searchMap,
  });
}

