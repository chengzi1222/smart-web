import http from "utils/http";

/**
 *  行政处罚列表
 * @param params
 */
export function listPunishPage(params) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: 'enforce/punish/list',
    contentType: "application/json",
    data: params
  });
}

/**
 *  获取主体类型列表
 * @param params
 */
export function listEntityType() {
  return http({
    method: 'post',
    url: 'env/patrol/listEntity'
  });
}

/**
 *  获取辖区机构 & 执法机构
 */
export function listDept() {
  return http({
    method: 'get',
    url: 'enforce/punish/dept'
  });
}

/**
 *  获取线索来源 & 处罚方式
 */
export function listDict(dictCode) {
  return http({
    method: 'get',
    url: 'enforce/punish/dict?dictCode=' + dictCode
  });
}

/**
 *  获取执法人员列表
 */
export function listPunishPerson() {
  return http({
    method: 'get',
    url: 'enforce/punish/punishPerson'
  });
}

/**
 *  添加行政处罚
 */
export function addPunish(punishDto) {
  return http({
    method: 'post',
    url: 'enforce/punish',
    data: punishDto
  });
}

/**
 *  获取行政处罚详情
 */
export function getPunishById(id) {
  return http({
    method: 'get',
    url: 'enforce/punish/' + id
  });
}

/**
 *  获取图片服务器地址
 */
export function getBase() {
  return http({
    method: 'get',
    url: '/env/base'
  })
}

/**
 * 主体处罚记录分页
 */
export function entityPunishRecordPage(searchMap, page) {
  return http({
    method: 'post',
    url: '/enforce/punish/entityPage/' + page.pageNum + '/' + page.pageSize,
    data: searchMap
  })
}
