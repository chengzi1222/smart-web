import http from "utils/http";
import qs from "qs";

/**
 *  校餐卫士
 */
  // 校长陪餐 胡振东
export function getAIAccompany(d) {
  return http({
    method: 'get',
    url: '/ai/carema/vipRecords',
  });
}

/**
 *  校餐卫士
 */
  // 校长陪餐v2  胡振东
  export function getAIAccompanyV2(id,createTime) {
    let url=null;
    if(createTime===null||createTime==""){
      url='/ai/carema/vip/list?cameraId='+id
    }else{
      url='/ai/carema/vip/list?cameraId='+id+'&warningTime='+createTime
    }
    return http({
      method: 'get',
      url: url,
    });
  }
  // 后厨老章
export function getAIAccompany2(params) {
    return http({
      method: 'get',
      url: '/ali/carema/getMixMessagesByMns',
      // params:params
    });
  }
  

  // 王桃旁边这个
  export function getAIAccompany3(params) {
    return http({
      method: 'get',
      url: '/ali/carema/getMixMessagesByMnsRtmp',
      // params:params
    });
  }
  

    // 胡振东 海康 后厨
    export function getAiCaremaAddr(id) {
      return http({
        method: 'get',
        url: '/ai/carema/entity/list/?entityId='+id,
      });
    }
    
    // 胡振东 海康 后厨 截图列表
    export function getAiCaremaScreenshot(id,aiPlatform,createTime) {
      let url=null;
      if(createTime===null||createTime==""){
        url='/ai/carema/person/newest/list?cameraId='+id+'&aiPlatform='+aiPlatform
      }else{
        url='/ai/carema/person/newest/list?cameraId='+id+'&aiPlatform='+aiPlatform+'&warningTime='+createTime
      }
      return http({
        method: 'get',
        url: url,
      });
    }

// ai视频截图 筛选框，摄像头点位
    export function channelNameList(id) {
      return http({
        method: 'get',
        url: '/ai/carema/channelName/list?entityId='+id,
      });
    }
    
  // ai视频截图
  export function getAIscreenshot(data) {
    return http({
      method: 'POST',
      url: '/ai/carema/screenshot/page',
      data:data
    });
  }