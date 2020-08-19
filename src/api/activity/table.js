import http from 'utils/http'
import qs from 'qs';

/**
 * 检查要点表配置列表
 */
export function getTable() {
    return http({
        method: 'get',
        url: '/active/table'
    })
}

/**
 * 检查要点表分页
 * @param {Object} page 
 * @param {Object} searchMap 
 */
export function page(page, searchMap) {
    return http({
        method: 'post',
        url: '/active/table/page/' + page.pageNum + '/' + page.pageSize,
        data: searchMap
    })
}

/**
 * 更新业务检查要点表
 * @param {String} type 
 * @param {String} tableId 
 */
export function update(type, tableId) {
    let data = qs.stringify({ 'patrolTableId': tableId })
    return http({
        method: 'post',
        url: '/active/table/update/' + type,
        data: data
    })
}