import http from "utils/httpyb";

//合成
export function suyAllData(d){
    return http({
      method: 'post',
      url: 'govapi/detec/suyAllData',
      data: d
    });
  }

//合成4k
export function suyAllSchoolData(d) {
  return http({
    method: 'post',
    url: 'govapi/detec/suyAllSchoolData',
    data: d
  });
}

/**
 *  4k大屏应急追溯关联配送商
 */
export function postdlrli(data) {
  return http({
    method: 'post',
    url: 'govapi/sub/dlrli',
    data: data
  });
}

//商品
export function pdtAuto(d){
    return http({
      method: 'post',
      url: 'govapi/detec/pdtAuto',
      data: d
    });
  }

  //主体
export function subAuto(d){
    return http({
      method: 'post',
      url: 'govapi/detec/subAuto',
      data: d
    });
  }
