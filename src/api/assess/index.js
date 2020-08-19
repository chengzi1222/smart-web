import http from "utils/http";
import qs from "qs";

// 课程-视频库
export function courseUpdate(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/course/update',
    data: data
  });
}


export function courseList(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/course/list',
    data: data
  });
}

export function courseDel(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/course/del?courseId='+data
  });
}
export function courseDetail(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/course/detail?courseId='+data
  });
}

export function videoUpdate(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/video/update',
    data: data
  });
}
export function videolist(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/video/list',
    data: data
  });
}
export function videoDel(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/video/del?videoId='+data
  });
}
// 题库
export function questionDepotCount(id) {
  const data = new FormData()
  data.append('questionDepotId', id)
  return http({
    method: 'post',
    url: '/pxkh/question/depotCount',
    data:data
  });
}
export function questionDepotList(data) {
  return http({
    method: 'get',
    url: '/pxkh/question/depot/paging',
    params:data,
  });
}
export function depotDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/question/depot/del',
    data:data
  });
}
export function questionDepotAddOrUpdate(data,type) {
  return http({
    method: 'post',
    url: '/pxkh/question/depot/'+type,
    data:data,
  });
}

export function questionChoiceAddOrUpdate(data,type) {
  return http({
    method: 'post',
    url: '/pxkh/question/choice/'+type,
    data:data,
  });
}
export function questionChoiceList(data) {
  return http({
    method: 'get',
    url: '/pxkh/question/choice/paging',
    params:data,
  });
}
export function questionJudgeAddOrUpdate(data,type) {
  return http({
    method: 'post',
    url: '/pxkh/question/judge/'+type,
    data:data,
  });
}
export function questionJudgeList(data) {
  return http({
    method: 'get',
    url: '/pxkh/question/judge/paging',
    params:data,
  });
}
export function questionDepotInfo(data) {
  return http({
    method: 'get',
    url: '/pxkh/question/depot/find',
    params:data,
  });
}
export function questionChoiceDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/question/choice/del',
    data:data,
  });
}
export function questionJudgeDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/question/judge/del',
    data:data,
  });
}
export function questionDepotOpt(data) {
  return http({
    method: 'post',
    url: '/pxkh/question/depot/opt/'+data.available,
    data:data.idList,
  });
}
// 培训计划
export function trainPlanBaseList(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/base/paging',
    params:data,
  });
}
export function finishTrainPlan(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/base/finishTrainPlan',
    data:data,
  });
}
export function trainPlanBaseAddOrUpdate(data,type) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/base/'+type,
    data:data,
  });
}
export function trainPlanBaseInfo(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/base/find?id='+data
  });
}
export function trainPlanCourseList(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/course/paging',
    params:data,
  });
}
export function trainPlanCourseListForAdd(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/course/pagingForAdd',
    params:data,
  });
}

export function trainPlanCourseAdd(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/course/add/'+data.id,
    data:data.arr,
  });
}
export function trainPlanCourseDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/course/delete',
    data:data,
  });
}
export function trainPlanPersonList(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/person/paging',
    params:data,
  });
}
export function trainPlanPersonListForAdd(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/person/pagingForAdd',
    params:data,
  });
}
export function trainPlanPersonDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/person/delete/'+data.id,
    data:data.arr,
  });
}
export function trainPlanPersonAdd(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/person/add/'+data.id,
    data:data.arr,
  });
}
export function trainPlanStartTrainPlan(data) {
  return http({
    method: 'post',
    url: '/pxkh/trainPlan/manager/base/startTrainPlan',
    data:data,
  });
}
export function trainPlanRecordInfo(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/record/info',
    params:data,
  });
}
export function trainPlanRecordDetail(data) {
  return http({
    method: 'get',
    url: '/pxkh/trainPlan/manager/record/detail',
    params:data,
  });
}
// 考核
export function assessPlanList(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/list',
    data:data,
  });
}
export function assessPlanFinish(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/finish',
    data:data,
  });
}
export function assessPlanBasicUpdate(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/basic/update',
    data:data,
  });
}
export function assessPlanBasicDetail(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/plan/basic/detail?id='+data,
  });
}
export function assessPlanQuestionList(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/question/list',
    data:data
  });
}
export function assessPlanQuestionAddOrEdit(data,type) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/question/'+type,
    data:data
  });
}
export function assessPlanQuestionDetail(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/plan/question/detail?planId='+data,
  });
}
export function assessPlanPersonOutList(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/person/out/list',
    data:data,
  });
}

export function assessPlanPersonInnerList(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/person/inner/list',
    data:data,
  });
}
export function assessPlanPersonUpdate(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/person/update',
    data:data,
  });
}
export function assessPlanPersonDel(data) {
  return http({
    method: 'post',
    url: '/pxkh/assess/plan/person/del',
    data:data,
  });
}
export function assessPlanRecord(data) {
  return http({
    method: 'POST',
    url: '/pxkh/assess/plan/record',
    data:data,
  });
}
export function assessPlanExamDetail(data) {
  return http({
    method: 'get',
    url: '/pxkh/assess/exam/detail',
    params:data,
  });
}
export function uploadFile(params,type) {
  let url=type==1?'/pxkh/assess/plan/person/import':'/pxkh/trainPlan/manager/person/import'
  return http({
    method: 'POST',
    url: url,
    data:params
  });
}
export function uploadFileQuestion(params) {
  return http({
    method: 'POST',
    url: '/pxkh/question/choice/import',
    data:params
  });
}
export function uploadFileQuestion2(params) {
  return http({
    method: 'POST',
    url: '/pxkh/question/judge/import',
    data:params
  });
}
export function assessExport(data) {
  return http({
    method: 'POST',
    url: '/pxkh/assess/plan/export',
    data:data
  });
}
