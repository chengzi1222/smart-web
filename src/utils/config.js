// 根据环境修改baseURL
let env='prod-'
let env2='prod'
const href=window.location.href;
const hrefArr=['http://localhost','http://0.0.0.0','https://tog-test.ybveg.com','http://tog-test.ybveg.com','https://tog-demo.ybveg.com','http://tog-demo.ybveg.com','https://smart-demo.ybveg.com','http://smart-demo.ybveg.com','https://tog-chengdu.ybveg.com','http://tog-chengdu.ybveg.com']
for(let i in hrefArr){
  if(href.indexOf(hrefArr[i]) != -1){
    env='test-';
    env2='test';
    break;
  }
}

const config = {
  getServerTime: 150000, // 获取服务器时间间隔
  baiduMapAk: 'KCOlSG4BQFMYid7Zxe5G0OzOsAsCezoi',
  QR:"http://fstip.ybveg.com/web/toWeb/",	//二维码
  Derive:'https://saasapp.ybveg.com/',	//源本导出
  // Derive:'http://localhost:8181/',	//源本导出
  export:'http://fstip.ybveg.com/'	,	//批发和农贸导出
  newExport:'http://roucaix-test.ybveg.com/api/',		//新批发和新农贸导出
  newQR: 'http://bady-demo.ybveg.com/', //新批发和新农贸二维码
  getBasicUrl:"https://guard-"+env2+".ybveg.com",
  schoolTraceBaseUrl:`https://stg-${env==`prod-`?``:env}bucket.oss-cn-hangzhou.aliyuncs.com/`//校餐卫士学校端h5基础路径
};

export default config;
