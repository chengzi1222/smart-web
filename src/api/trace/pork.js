import http from "utils/httpyb";

/**
 *  市猪肉综合价格
 */
export function compPriceList(params) {
    return http({
        method: 'get',
        url: '/govapi/pdtPrice/loadPdtPriceInfo',
        params
    });
}

/**
 *  各辖区猪肉价格
 */
export function areaPriceList(params) {
    return http({
        method: 'get',
        url: '/govapi/pdtPrice/loadAreaPdtPriceInfo',
        params
    });
}

/**
 *  导出
 */
export function priceExport(params) {
    return http({
        method: 'get',
        url: '/govapi/pdtPrice/priceInfo/export',
        params
    });
}