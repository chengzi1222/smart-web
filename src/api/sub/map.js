import http from 'utils/http';
/**
 * 查询创建圆的显示点
 * @param {Number} codeLevel 区域级别
 * @param {String} datacode 数据编码可以没有
 */
export function mapCircle(codeLevel, datacode) {
  let params = {
    codeLevel, datacode
  }
  return http({
    method: 'get',
    url: 'entity/map/circle',
    // data: qs.stringify(params),
    params
  })
};

/**
 * 获取当前登录用户中心点
 */
export function mapCenter() {
  return http({
    method: 'get',
    url: 'entity/map/center',
    // data: qs.stringify(params),
    // params
  })
}

/**
 * 获取所有主体的坐标
 * @param {String} datacode 区域编码
 * @param {{}} data
 */
export function mapPoint(datacode, data) {
  return http({
    method: 'post',
    url: 'entity/map/point',
    params: { datacode },
    data,
    // data: qs.stringify(params),
    // params
  })
}

export function findEntity(id, type) {
  return http({
    method: 'get',
    url: 'entity/map/show',
    params: { id, type },
  });
}

export function findDept() {
  return http({
    method: 'get',
    url: 'entity/map/dept',
  });
}

export function pageSearch(params, pageNum, pageSize) {
  return http({
    method: 'post',
    url: `entity/map/page/${pageNum}/${pageSize}`,
    data: params,
  });
}

export function chartPie(type) {
  return http({
    method: 'get',
    url: 'entity/map/chart',
    params: {
      type,
    }
  });
}
// 食品地图增加限期整改地图

export function getRepatrolMapEntity() {
  return http({
    method: 'get',
    url: 'entity/map/repatrol/point',
  });
}
export function getRepatrolMapCircle(L,C) {
  return http({
    method: 'get',
    url:'entity/map/repatrol/circle?codeLevel='+L,
  });
}