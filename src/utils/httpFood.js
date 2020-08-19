import axios from "axios";
import {Loading,Message} from "element-ui";

// 全局表单提交方式
// 创建axios实例
const serviceTwo = axios.create({
  baseURL: "https://sy.ybveg.com/", // api的base_url
  // baseURL: "http://172.16.1.180:8085", // api的base_url
  // timeout: 10000 // 请求超时时间
  // paramsSerializer: function (params) {
  //   return qs.stringify(params, { arrayFormat: 'brackets' })
  // },
  // transformRequest: [function (data) {  //  参数转换
  //   return qs.stringify(data);
  // }]
});

let loadingInstance;
const defaultLoading = { fullscreen: true };

// request拦截器
let doRefresh = false;
serviceTwo.interceptors.request.use((config) => {
  // openLoading(config)
  return config;
}, error => {
  doRefresh = false;
  console.log('error',error); // for debug
  Promise.reject(error);
})

// respone拦截器
serviceTwo.interceptors.response.use(
  response => {
    doRefresh = false;
    // closeLoading()
    let data = response.data;
    return data;
  }, error => {
    doRefresh = false;
    Message.error('服务请求超时')
    // closeLoading()
  });

// function openLoading(config) {  // 打开loading
//   if (config.loading !== false) {
//     loadingInstance = Loading.service(config.loadOption || defaultLoading);
//   }
// }

// function closeLoading() { // 关闭 loading
//   if (loadingInstance) {
//     loadingInstance.close();
//   }
// }

export default serviceTwo;
