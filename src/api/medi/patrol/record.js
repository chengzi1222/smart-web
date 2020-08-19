import http from "utils/http";
import qs from 'qs';

/**
 * 日常巡查记录
 * @param {Object} params
 */
export function findDailyPage(params) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: '/medi/patrol/record/findDailyPage',
    data: params
  })
}

/**
 * 专项巡查记录
 * @param {Object} params
 */
export function findSpecialPage(params) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: 'medi/patrol/record/findSpecialPage',
    data: params
  })
}

/**
 * 专项巡查记录
 * @param string params
 */
export function findListByAreaCode(areaCode) {
  return http({
    loading: true,
    method: "post",
    loadOption: {    // 具体设置参考 上面传送门
      text: "加载中..."
    },
    url: 'medi/patrol/record/findListByAreaCode',
    data: qs.stringify({"areaCode": areaCode})
  })
}

/**
 * 日期格式化
 * @param date
 * @param fmt
 * @returns {*}
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1,
        (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
};

/**
 * 主体巡查记录分页
 */
export function entityPatrolRecordPage(searchMap, page) {
  return http({
    method: 'post',
    url: '/medi/patrol/record/entity/' + page.pageNum + '/' + page.pageSize,
    data: searchMap
  })
}
