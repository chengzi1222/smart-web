import http from "utils/httpyb";

/**
 *  主体类型
 */
export function getSubType() {
    return http({
        method: 'get',
        url: '/govapi/buyer/type/list'
    });
}

/**
 *  索票索证列表
 */
export function getTicket(params) {
    return http({
        method: 'get',
        url: '/govapi/buyer/list',
        params
    });
}

/**
 *  索票索证二级列表
 */
export function getTicketList(params) {
    return http({
        method: 'get',
        url: '/govapi/saasdetec/card/list',
        params
    });
}

/**
 *  索票索证二级列表导出
 */
export function exportData(params) {
    return http({
        method: 'get',
        url: '/govapi/saasdetec/card/export',
        params
    });
}