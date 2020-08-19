import http from "utils/http";
import qs from 'qs';

//巡查绩效分析分页
export function page(page, param){
    return http({
      method:"post",
      url:"patrol/performance/page/" + page.pageNum + '/' + page.pageSize,
      data:param
    })
}

// 导出所有
export function exportAll(param){
    return http({
      method:"post",
      url:"patrol/performance/export/all",
      data:param
    })
}

// 导出当前页
export function exportCurrent(json){
    return http({
      method:"post",
      url:"patrol/performance/export/current",
      data: qs.stringify({'json': json})
    })
}

