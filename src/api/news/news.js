import http from "utils/http";
import qs from "qs";


/********************************************************
 **************        资讯         ***************
 ********************************************************/
/**
 *  获取资讯添加,列表，编辑页面所需初始化数据
 * @param params
 */
export function webInit() {
  return http({
    method: 'get',
    url: 'news/init'
  });
}
/**
 *  添加资讯
 * @param params
 */
export function add(params) {
  return http({
    method: 'post',
    url: 'news/add',
    data: qs.stringify(params)
  });
}
/**
 *  添加资讯
 * @param params
 */
export function edit(params) {
  return http({
    method: 'post',
    url: 'news/update',
    data: qs.stringify(params)
  });
}

/**
 *  资讯详情
 * @param params
 */
export function detail(params) {
  return http({
    method: 'get',
    url: 'news/detail',
    params: params
  });
}

/**
 *  资讯软删除
 * @param params
 */
export function del(params) {
  return http({
    method: 'post',
    url: 'news/del',
    params: params
  });
}
/**
 * 获取资讯分页列表
 * @param areaCode
 */
export function listNews(search) {
  return http({
    method: 'post',
    url: 'news/list',
    data: qs.stringify({paramsJson: JSON.stringify(search)})
  })
}

/********************************************************
 **************        资讯轮播图         ***************
 ********************************************************/
/**
 * 获取资讯轮播图分页列表
 * @param areaCode
 */
export function listNewsPic(search) {
  return http({
    method: 'post',
    url: 'newspic/list',
    data: qs.stringify({paramsJson: JSON.stringify(search)})
  })
}
/**
 *  添加资讯轮播图
 * @param params
 */
export function addPic(params) {
  return http({
    method: 'post',
    url: 'newspic/add',
    data: qs.stringify({newsPicJson: params})
  });
}

/**
 *  资讯轮播图详情
 * @param params
 */
export function  detailPic(params) {
  return http({
    method: 'get',
    url: 'newspic/detail',
    params: params
  });
}

/**
 *  编辑资讯轮播图
 * @param params
 */
export function editPic(params) {
  return http({
    method: 'post',
    url: 'newspic/update',
    data: qs.stringify({newsPicJson: params})
  });
}

/**
 *  编辑资讯轮播图
 * @param params
 */
export function deleteFile(params) {
  return http({
    method: 'post',
    url: 'newsUpload/del',
    data: qs.stringify(params)
  });
}

/**
 *  轮播图软删除
 * @param params
 */
export function delPic(params) {
  return http({
    method: 'post',
    url: 'newspic/del',
    params: params
  });
}

export function  copyToClipboard(txt) {
  let oInput = document.createElement('input');
  oInput.value = txt;
  alert(oInput.value);
  oInput.style.display='none';
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("copy", false, null); // 执行浏览器复制命令
}
export function copyToClipbord2(txt, e) {
  console.log("查看事件");
  console.log(e);
  var clipboardData = window.clipboardData; //for IE
  if (!clipboardData) { // for chrome
    clipboardData = e.originalEvent.clipboardData;
  }
  //e.clipboardData.getData('text');//可以获取用户选中复制的数据
  clipboardData.setData('Text', txt);
  alert(e.clipboardData.getData('Text'));
  //可以获取用户选中复制的数据
  return false;//否则设不生效

}
