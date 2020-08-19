import http from "utils/httpyb";
/**
 *  纳入情况
 */
export function dlr_city(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/into',
      params: d
    });
  }
  /**
 *  使用情况
 */
export function dlr_use(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/use',
      params: d
    });
  }
  /**
 *  纳入情况
 */
export function historyUse(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/historyUse',
      params: d
    });
  }
    /**
 *  实时溯源
 */
export function newdata(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/realTime',
      params: d
    });
  }
  /*
  *
  *检测情况与风险品种
  */ 
 export function risk(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/risk',
      params: d
    });
  }
    /*
  *
  *检测数据图表
  */ 
 export function check(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/check',
      params: d
    });
  }
      /*
  *
  *实时检测动态
  */ 
 export function realTimeCheck(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/realTimeCheck',
      params: d
    });
  }
  /**
   * 街道办查询配送商溯源
   * * 
   * */
  export function dlrrate(d){
    return http({
      method: 'post',
      url: '/govapi/trace/street/dlrrate',
      params: d
    });
  }
    /**
   * 街道办查询历史
   * * 
   * */
  export function streethis(d){
    return http({
      method: 'post',
      url: '/govapi/trace/street/streethis',
      params: d
    });
  }
 /**
   * 街道排名
   * * 
   * */
  export function streetRank(d){
    return http({
      method: 'post',
      url: '/govapi/trace/street/streetr',
      params: d
    });
  }
   /**
   * 使用率排名-qu
   * * 
   * */
  export function rankNumber(d){
    return http({
      method: 'post',
      url: '/govapi/trace/city/ranking',
      params: d
    });
  }
     /**
   * 使用率排名-jiedao
   * * 
   * */
  export function rankNumberStreet(d){
    return http({
      method: 'post',
      url: '/govapi/trace/street/streetrlist',
      params: d
    });
  }
  
       /**
   * 使用率排名-jiedao
   * * 
   * */
  export function streetdlrcount(d){
    return http({
      method: 'post',
      url: '/govapi/trace/street/streetdlrcount',
      params: d
    });
  }