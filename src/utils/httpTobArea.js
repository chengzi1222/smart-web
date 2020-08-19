import axios from "axios";
import {Message} from "element-ui";

// 全局表单提交方式
// 创建axios实例
const serviceTwo = axios.create({
  baseURL: "https://open.ybveg.com/", // api的base_url
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
});

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

export default serviceTwo;
