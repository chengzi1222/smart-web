import http from 'utils/http'

/**
 * 每日统计
 */
export function getTodayData(Id, params) {
  return http({
    method: 'post',
    url: '/active/statistical/getTodayData/' + Id,
    params
  })
}


/**
 * 累计统计
 */
export function getAllData(Id) {
  return http({
    method: 'post',
    url: '/active/statistical/getAllData/' + Id
  })
}

/**
 * 累计数据(盒饭检查情况,每日现场检查情况,整改情况)
 */
export function getPie(Id) {
  return http({
    method: 'post',
    url: '/active/statistical/getStatistics/' + Id
  })
}

/**
 * 供应商今日盒饭配送情况
 */
export function getBar(Id, params) {
  return http({
    method: 'post',
    url: '/active/statistical/getBoxpatrol/' + Id,
    data: params
  })
}

/**
 * 实时盒饭检查动态
 */
export function getTabData(Id, num, size) {
  return http({
    method: 'post',
    url: '/active/statistical/getboxcheckList/' + Id + '/' + num + '/' + size
  })
}

/**
 * 每日现场检查动态
 */
export function getDaycheckList(Id, num, size) {
  return http({
    method: 'post',
    url: '/active/statistical/getDaycheckList/' + Id + '/' + num + '/' + size
  })
}


/*
  配送状态
 */
export function getStatus(params) {
  return http({
    method: 'post',
    url: '/common/enums',
    data: params
  })
}

/*
  记录时间列表
 */
export function getListDate(id) {
  return http({
    method: 'post',
    url: '/active/boxreport/listDate/' + id
  })
}

/*
  配送商列表
 */
export function getListEntityByType(id) {
  return http({
    method: 'post',
    url: '/active/boxreport/listEntityByType/' + id
  })
}

/**
 * 盒饭检查记录
 */
export function getBoxreportList(id, num, size, params) {
  return http({
    method: 'post',
    url: '/active/boxreport/findBoxReportPage/' + id + '/' + num + '/' + size,
    data: params
  })
}

/*
  盒饭出厂记录导出
 */
export function getFindBoxReportPageExcel(id, params) {
  return http({
    method: 'post',
    url: '/active/boxreport/findBoxReportPageExcel/' + id,
    data: params
  })
}

/*
  盒饭出厂记录详情
 */
export function getFindDetailById(id) {
  return http({
    method: 'post',
    url: 'active/boxreport/findDetailById/' + id
  })
}

/**
 * 修改
 */
export function update(params) {
  return http({
    method: 'post',
    url: '/active/boxreport/update',
    data: params
  })
}
