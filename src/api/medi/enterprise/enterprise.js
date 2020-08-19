import http from "utils/http";
import qs from "qs";

/**
 *  获取列表
 * @param params
 */
export function findPage(params) {

  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/enterprise/page/'+params.pageNum+'/'+params.pageSize,
    data: params.params
  });
}

/**
 * 获取tab选项卡
 */
export function getBindingNum(entityType) {
  return http({
    method: 'get',
    url: 'medi/enterprise/getBindingNum/'+entityType
  });
}

/**
 * 获取在线用户数量
 */
export function getOnLineNum() {
  return http({
    method: 'get',
    url: 'medi/enterprise/getOnLineNum'
  });
}


/**
 * 根据手机获取企业用户
 */
export function getEUserByPhone(phone) {
  return http({
    method: 'get',
    url: 'medi/enterprise/getEUserByPhone/'+phone
  });
}

/**
 * 绑定企业用户
 */
export function binding(params) {
  return http({
    loading: true,
    loadOption:{
      text:"绑定中..."
    },
    method: 'post',
    url: 'medi/enterprise/binding',
    data: params
  });
}

/**
 * 重新绑定企业用户
 */
export function rebinding(params) {
  return http({
    loading: true,
    loadOption:{
      text:"绑定中..."
    },
    method: 'post',
    url: 'medi/enterprise/rebinding',
    data: params
  });
}

/**
 * 重新绑定企业用户
 */
export function relieveBin(enterpriseUserId,seuId) {
  return http({
    loading: true,
    loadOption:{
      text:"解除绑定中..."
    },
    method: 'post',
    url: 'medi/enterprise/relieveBin',
    data:qs.stringify({entityId:enterpriseUserId,seuId:seuId})
  });
}

/**
 * 重置密码
 */
export function relievePsw(enterpriseUserId) {
  return http({
    loading: true,
    loadOption:{
      text:"重置密码中..."
    },
    method: 'post',
    url: 'medi/enterprise/relievePsw/'+enterpriseUserId,
  });
}

/**
 *  获取列表
 * @param params
 */
export function findUserPage(params) {

  return http({
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'medi/enterprise/pageUser/'+params.pageNum+'/'+params.pageSize,
    data: params.params
  });
}
