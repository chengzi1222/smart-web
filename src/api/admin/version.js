import http from 'utils/http';

/**
 * 列表
 * @param params
 */
export function findPage(params) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: 'admin/version/findPage',
    data: params
  })
}

/**
 * 添加
 * @param params
 */
export function addVersion(params) {
  return http({
    method: "post",
    url: 'admin/version/addVersion',
    data: params
  })
}

/**
 * 根据Id查询
 * @param params
 */
export function getVersion(versionId) {
  return http({
    method: "post",
    url: 'admin/version/getVersion/' + versionId,
    data: {}
  })
}

/**
 * 编辑
 * @param params
 */
export function editVersion(params) {
  return http({
    method: "post",
    url: 'admin/version/editVersion',
    data: params
  })
}
