import axios from "axios";
import {Loading, Message} from "element-ui";
import {getCookie} from "./sessionStorage";

// 根据环境修改baseURL
let env='prod'
const href=window.location.href;
const hrefArr=['http://localhost','http://0.0.0.0','https://tog-test.ybveg.com','http://tog-test.ybveg.com','https://tog-demo.ybveg.com','http://tog-demo.ybveg.com','https://smart-demo.ybveg.com','http://smart-demo.ybveg.com','https://tog-chengdu.ybveg.com','http://tog-chengdu.ybveg.com']
for(let i in hrefArr){
  if(href.indexOf(hrefArr[i]) != -1){
    env='test';
    break;
  }
}
// 全局表单提交方式
// 创建axios实例
const service = axios.create({
  baseURL: "https://guard-"+env+".ybveg.com", // api的base_url=>guard-prod.ybveg.com/api/guard
  withCredentials: true,
  // timeout: 5000 // 请求超时时间
  // paramsSerializer: function (params) {
  //   return qs.stringify(params, { arrayFormat: 'brackets' })
  // },
  // transformRequest: [function (data) {  //  参数转换
  //   return qs.stringify(data);
  // }]
});

let loadingInstance;
let isLoading = false;
let isMessage = true;
const defaultLoading = { fullscreen: true };

service.interceptors.request.use((config) => {
  if(!getCookie('XCWSOpenSecret')){
    Message({
      type: "error",
      message: '没有获取到权限密钥，不允许访问'
    })
  }
  if(config.hasOwnProperty('message')){
    isMessage = config.message;
  }
  // openLoading(config)
  // store.dispatch('setLoading',true)
  return config;
}, error => {
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(response => {
    // closeLoading();
    // store.dispatch('setLoading',false)
    let data = response.data;
    if (data.code==200) {

    } else {
      if (data.msg && isMessage) {
        Message({
          type: "warning",
          message: data.msg
        })
      }
    }
    return data;
  }, error => {
    // closeLoading()
    // store.dispatch('setLoading',false)
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      const response = error.response;
      const data = response.data;
      if (data && data.msg) {
        Message({
          type:"warning",
          message: data.msg
        })
      }
      return Promise.reject(response);
    } else {
      console.log('Error', error.msg);
    }
    console.log(error.config);
  });

function openLoading(config) {  // 打开loading
  if (!isLoading) {
    isLoading = true;
    if (config.loading === true) {
      loadingInstance = Loading.service(config.loadOption || defaultLoading);
    }
  }
}

function closeLoading() { // 关闭 loading
  if (isLoading) {
    isLoading = false;
    if (loadingInstance) {
      loadingInstance.close();
    }
  }
}

export default service;
