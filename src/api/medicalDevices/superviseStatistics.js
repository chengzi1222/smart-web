import http from "utils/http";

// -------------------------------医疗器械巡查概况-------------------------------------------------------------------
/**
 * 、专项
 * /maai/statistics/special/record/find'
 */
  export function getStatPlanStateSpecial() {
    return http({
      method: 'get',
      url: '/maai/statistics/special/record/find'
    });
  }

  /**
 * 、日常综合
 * /maai/statistics/daily/record/find'
 */
export function getDaily(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/daily/record/find?startDate='+obj.startDate+'&endDate='+obj.endDate+'&entityType='+obj.entityType+'&quantify='+obj.quantify,
    });
  }
    /**
 * 巡查结果分布
 * /maai/statistics/record/result/find'
 */
export function getResult(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/record/result/find?startDate='+obj.startDate+'&endDate='+obj.endDate+'&entityType='+obj.entityType+'&quantify='+obj.quantify,
    });
  }
    /**
 * 处理方式分布
 * /maai/statistics/record/treat/find
 */
export function getTreat(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/record/treat/find?startDate='+obj.startDate+'&endDate='+obj.endDate+'&entityType='+obj.entityType+'&quantify='+obj.quantify,
    });
  }
      /**
 *巡查动态
 * /maai/statistics/record/page
 */
export function dynamicsRecord(size,num) {
    return http({
      method: 'get',
      url: '/maai/statistics/record/page?pageNum='+num+'&pageSize='+size,
    });
  }
      /**
 * 年度累计
 * /maai/statistics/record/total/find
 */
export function getPatrolTotal(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/record/total/find?entityType='+obj.entityType,
    });
  }

/**
 * 统计报表
 * /maai/statistics/data/find
 */
export function getReportFormsDaily(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/data/find?startDate='+obj.startDate+'&endDate='+obj.endDate+'&entityType='+obj.entityType+'&sortType='+obj.sortType,
    });
  }
/**
 * 统计报表导出
 * /maai/statistics/excel/data
 */
export function excelStatisticalData(obj) {
    return http({
      method: 'get',
      url: '/maai/statistics/excel/data?startDate='+obj.startDate+'&endDate='+obj.endDate+'&entityType='+obj.entityType+'&sortType='+obj.sortType,
    });
  }

  /**
 * 主体覆盖率
 * /maai/statistics/entity/coverage/list
 */
export function getCoverage(obj) {
  return http({
    method: 'get',
    url: '/maai/statistics/entity/coverage/list?quantify='+obj.quantify+'&entityType='+obj.entityType
  });
}

  /**
 * 逾期相关。
 * /maai/statistics/entity/coverage/list
 */
export function getoverdues(obj) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/overdues/list?entityType='+obj.entityType,
  });
}


// -------------------------------医疗器械专项计划管理统计分析-------------------------------------------------------------------
/**
 * 累计巡查次数
 * /maai/statistics/record/total/find/:specialId'
 */
export function getSpecialData(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/total/find/'+id
  });
}


/**
 * 累计巡查图表
 * /maai/statistics/record/total/list/:specialId'
 */
export function getTotalPatrol(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/total/list/'+id
  });
}


/**
 * 巡查动态
 * /maai/statistics/record/list/'
 */
export function getDynamic(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/list/'+id
  });
}



/**
 * 巡查结果
 * /maai/statistics/record/result/find/'
 */
export function getPatrolResult(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/result/find/'+id
  });
}


/**
 * 处理方式
 * /maai/statistics/record/treat/find/'
 */
export function getProcessingType(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/record/treat/find/'+id
  });
}


/**
 * 报表
 */
export function getReportSpecial(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/data/list/'+id
  });
}


/**
 * 报表导出
 */
export function exportExcel(id) {
  return http({
    method: 'get',
    url: '/maai/statistics/excel/data/'+id
  });
}
// -------------------------------统计报表-------------------------------------------------------------------
/**
 * 主体概况统计报表
 */
export function getAlllist(quanlLevel) {
  return http({
    method: 'get',
    url: '/maai/statics/form/getAllForm/list?quanlLevel='+quanlLevel
  });
}
/**
 * 主体概况统计报表导出
 */
export function export_all(quanlLevel) {
  return http({
    method: 'get',
    url: '/maai/statics/form/allForm/download?quanlLevel='+quanlLevel
  });
}
/**
 * 三个主体统计报表
 */
export function getAlllist_entityType(type,quanlLevel) {
  return http({
    method: 'get',
    url: '/maai/statics/form/getOwnFrom/list?entityType='+type+'&quanlLevel='+quanlLevel
  });
}
/**
 * 三个主体统计报表导出
 */
export function export_all_entityType(type,quanlLevel) {
  return http({
    method: 'get',
    url: '/maai/statics/form/ownForm/download?entityType='+type+'&quanlLevel='+quanlLevel
  });
}
