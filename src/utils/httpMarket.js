import axios from "axios";
import {Message} from "element-ui";

// 全局表单提交方式
// 创建axios实例
const serviceTwo = axios.create({
//   baseURL: "http://saasapp.ybveg.com/", // api的base_url
  //baseURL: "http://192.168.1.181:8081", // api的base_url
  // timeout: 5000 // 请求超时时间
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
let _message = true
// respone拦截器
serviceTwo.interceptors.response.use(
  response => {
    doRefresh = false;
    // closeLoading()
    let data = response.data;
    if (!response.data.status && _message) {
      _message = false;
      Message.error(response.data.message)
      setTimeout(() => {
        _message = true;
      }, 1000);
    }
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
