import http from "utils/http";

// 专项巡查概况：
export function getSpecialData(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/special',
    data: params
  });
}

// 日常巡查概况：
export function getDailyData(pararms) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/daily',
    data: pararms
  });
}

// 巡查结果分布：
export function getPatrolResult(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/patrolResult',
    data: params
  });
}

// 处理方式分布：
export function getProcessingType(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/processingType',
    data: params
  });
}

// 累计巡查：
export function getTotalPatrol(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/totalPatrol',
    data: params
  });
}

// 主体覆盖率：
export function getEntityCoverageChart(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/entityCoverage',
    data: params
  });
}

// 逾期未巡查：
export function getOverdueNotPatrolChart(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/overdueNotPatrol',
    data: params
  });
}

// 即将逾期：
export function getToBeOverdueChart(params) {
  return http({
    method: 'post',
    url: 'patrol/statistics/chart/toBeOverdue',
    data: params
  });
}

// 巡查动态：
export function getDynamic(data) {
	let _url = "patrol/statistics/dynamic"
	if(data){
		_url = 'patrol/statistics/dynamic' + data
	}
  return http({
    method: 'get',
    url: _url
  });
}

// 专项巡查统计数据
export function getSpecial(id) {
  return http({
    method: 'get',
    url: 'patrol/statistics/chart/special/'+id
  });
}

// 日常统计报表
export function getReportDaily(startDate,endDate,sortColumn) {
	let obj = {
		'startDate':startDate,
		'endDate':endDate,
		'sortColumn':sortColumn
	}
  return http({
    method: 'post',
    url: 'patrol/statistics/report/daily',
    data:obj
  });
}

// 专项统计报表
export function getReportSpecial(id,startDate,endDate,sortColumn) {
	let obj = {
		'patrolPlanId':id,
		'startDate':startDate,
		'endDate':endDate,
		'sortColumn':sortColumn
	}
  return http({
    method: 'post',
    url: 'patrol/statistics/report/special',
    data:obj
  });
}
/**
 * 专项巡查统计Excel导出
 */
export function exportSpecialExcel(patrolPlanId, sortColumn) {
  if (!sortColumn) {
    sortColumn = ''
  }
  if (patrolPlanId) {
    location.href = `/api/patrol/statistics/getSpecialExcel/${patrolPlanId}?sortColumn=${sortColumn}`;
  }
}
/**
 * 日常巡查统计Excel导出
 */
export function exportDailyExcel(startDate,endDate,sortColumn) {
  if(!startDate) {
    startDate = ''
  }
  if(!endDate) {
    endDate = ''
  }
  if(!sortColumn) {
    sortColumn = ''
  }
  location.href = `/api/patrol/statistics/getDailyExcel?startDate=${startDate}&&endDate=${endDate}&&sortColumn=${sortColumn}`;
}
