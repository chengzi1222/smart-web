import http from 'utils/http';

export function repatrolList(data) {
    let d=JSON.parse(JSON.stringify(data));
    d.startDate ? d.startDate=d.startDate : delete d.startDate
    d.endDate ? d.endDate=d.endDate : delete d.endDate
    d.applyTypes=d.applyTypes.toString()
    d.treat=d.treat.toString()
    d.treats = d.treat
    return http({
        method: 'get',
        url: `/xchc/repatrol/paging/${d.pageNum}/${d.pageSize}`,
        params: d
    })
}
export function repatrolWaitDetail(id) {
    return http({
        method: 'get',
        url: `/xchc/repatrol/waitDetail?id=${id}`,
    })
}
export function inspectorList(inspectorName) {
    return http({
        method: 'get',
        url: `/xchc/patrol/inspectorList`,
        params: {
            inspectorName:inspectorName,
            pageNum:1,
            pageSize:10
        }
    })
}
export function repatrol(d) {
    return http({
        method: 'post',
        url: `/xchc/repatrol/repatrol`,
        data:d
    })
}
export function repatrolReviewDetail(id) {
    return http({
        method: 'get',
        url: `/xchc/repatrol/reviewDetail?id=${id}`,
    })
}
export function review(d) {
    return http({
        method: 'post',
        url: `/xchc/repatrol/review`,
        data:d
    })
}
export function recordList(id,type) {
    return http({
        method: 'get',
        url: `/xchc/repatrol/recordList`,
        params: {
            recordId:id,
            type:type,
        }
    })
}
export function alreadyDetail(id) {
    return http({
        method: 'get',
        url: `/xchc/repatrol/alreadyDetail`,
        params: {
            id:id,
        }
    })
}
export function onSiteRecordList(data) {
    let d=JSON.parse(JSON.stringify(data));
    d.startDate ? d.startDate: delete d.startDate
    d.endDate ? d.endDate : delete d.endDate
    d.applyType=d.applyType.toString()
    return http({
        method: 'get',
        url: `/xchc/patrol/recordList`,
        params: d
    })
}
export function hcRecordDetail(id) {
    return http({
        method: 'get',
        url: `/xchc/patrol/record/detail`,
        params:{
            'recordId':id
        }
    })
}