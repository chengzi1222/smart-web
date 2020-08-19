import http from "utils/http";

/**
 *  刑事案件列表
 * @param params
 */
export function listCriminalCasePage(params) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: 'enforce/criminalCase/list',
    contentType: "application/json",
    data: params
  });
}

/**
 *  添加刑事案件
 */
export function addCriminalCase(criminalCaseDto) {
  return http({
    method: 'post',
    url: 'enforce/criminalCase',
    data: criminalCaseDto
  });
}

/**
 *  获取刑事案件详情
 */
export function getCriminalCaseById(id) {
  return http({
    method: 'get',
    url: 'enforce/criminalCase/' + id
  });
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
