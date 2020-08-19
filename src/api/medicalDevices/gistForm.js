import http from "utils/http";


/**
 * 巡查要点表列表
 */
export function postTable(page) {
  return http({
    method: 'post',
    url: '/maai/point/table/' + page.pageNum + '/' + page.pageSize
  });
}

/**
 * 巡查要点表的添加和编辑
 */
export function postUpdate(params) {
  return http({
    method: 'post',
    url: '/maai/point/table/update',
    data: params
  });
}

/**
 * 获取主体类型
 */
export function postEntitytype() {
  return http({
    method: 'post',
    url: '/maai/point/entitytype'
  });
}

/**
 * 获取器械等级
 */
export function postInstrurank() {
  return http({
    method: 'post',
    url: '/maai/point/instrurank'
  });
}

/**
 * 自定义表的启用和禁用
 */
export function postIsenable(params) {
  return http({
    method: 'post',
    url: '/maai/point/table/isenable',
    data: params
  });
}

/**
 * 要点表详情-基本信息
 */
export function postGet(params) {
  return http({
    method: 'post',
    url: '/maai/point/table/get',
    data: params
  });
}

/**
 * 要点表详情-抽检信息
 */
export function postList(params) {
  return http({
    method: 'post',
    url: '/maai/point/table/list',
    data: params
  });
}

/**
 * 添加巡查内容-选择巡查项目
 */
export function postProjectGet(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/get',
    data: params
  });
}
/**
 * 编辑最少巡查项
 */
export function postMinimport(params) {
  return http({
    method: 'post',
    url: '/maai/point/table/minimport',
    data: params
  });
}

/**
 * 巡查内容添加
 */
export function postContextAdd(params) {
  return http({
    method: 'post',
    url: '/maai/point/context/add',
    data: params
  });
}
/**
 * 巡查内容编辑
 */
export function postContextUpdate(params) {
  return http({
    method: 'post',
    url: '/maai/point/context/update',
    data: params
  });
}
/**
 * 巡查内容禁用启用
 */
export function postContextIsenable(params) {
  return http({
    method: 'post',
    url: '/maai/point/context/isenable',
    data: params
  });
}
/**
 * 巡查内容禁用
 */
export function postContextIseffective(params) {
  return http({
    method: 'post',
    url: '/maai/point/context/iseffective',
    data: params
  });
}
/**
 * 编辑项目
 */
export function postProjectUpdate(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/update',
    data: params
  });
}
/**
 * 添加项目
 */
export function postProjectAdd(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/add',
    data: params
  });
}
/**
 * 巡查项目的删除
 */
export function postProjectIseffective(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/iseffective',
    data: params
  });
}
/**
 * 巡查项目的启用和禁用
 */
export function postProjectIsenable(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/isenable',
    data: params
  });
}
/**
 * 获取最大巡查项编号
 */
export function postProjectGetMaxNoProject(params) {
  return http({
    method: 'post',
    url: '/maai/point/project/getMaxNoProject',
    data: params
  });
}

/**
 * 添加巡查内容-获取最大巡查项编号
 */
export function postGetMaxNoContext(params) {
  return http({
    method: 'post',
    url: '/maai/point/context/getMaxNoContext',
    data: params
  });
}

/**
 * 导入要点表
 */
export function importTable(params) {
  return http({
    method: 'post',
    url: '/maai/point/import',
    data: params
  });
}

