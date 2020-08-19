import http from "utils/http";
import qs from "qs";

/**
 * 医疗器械工单 - 工单列表
 */
export function postWorkPage(pageNum, pageSize, params) {
  return http({
    method: 'post',
    url: '/maai/workflow/page/' + pageNum + '/' + pageSize,
    data: params
  });
}

/**
 * 医疗器械工单 - 统计待审核/已归档/已驳回
 */
export function getTotal(params) {
  return http({
    method: 'post',
    url: '/maai/workflow/getTotal',
    data: qs.stringify(params)
  });
}


/**
 * 备案编辑记录
 */
export function postRecordPage(formData) {
  return http({
    method: 'post',
    url: 'maai/workflow/recordPage/'+formData.params.entityId+'/'+formData.pageNum+'/'+formData.pageSize,
    data:formData.params
  });
}
