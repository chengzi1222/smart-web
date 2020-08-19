export function phoneValid(rule, value, callback) {

  if (value != '' && !(/^1[345789]\d{9}$/.test(value))) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
  }
}

export function userNameValid(rule, value, callback) {
  console.log(value);
  if (!(/^[a-zA-Z][a-zA-Z0-9]{5,18}$/.test(value))) {
    callback(new Error('只能以字母开头,长度为6-18位'));
  } else {
    callback();
  }
}
//自定义(字数)
export function userNameValid_user_defined(rule, value, callback) {
  if (!(rule.test(value))) {
    callback(new Error('只能以字母开头,长度为6-18位'));
  } else {
    callback();
  }
}

export function floatValid(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  if (!(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value))) {
    callback(new Error('请输入数值'));
  } else {
    callback();
  }
}
export function IdNo(rule, value, callback) {
    let reg = /^[0-9a-zA-Z]+$/
    if(!reg.test(value) && value != '' ){
      callback(new Error('你输入的字符不是数字或者字母'));
    }else{
      callback();
    }
    // if (typeof value !== 'string') {
    //   callback(new Error('非法字符串'));
    // }else{
    //   callback();
    // }
    
}

//验证是否字符串
export function idNoValid(rule, value, callback) {
  /*if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)){
    callback(new Error('请输入正确的身份证号'));
  }else{
    callback();
  }*/

  if (typeof value !== 'string') {
    callback(new Error('非法字符串'));
    return;
  }
  // let city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
  // let birthday = value.substr(6, 4) + '/' + Number(value.substr(10, 2)) + '/' + Number(value.substr(12, 2));
  // let birthDayRexp = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig;
  // if(!birthDayRexp.test(birthday)){
  //   callback(new Error('非法出生日期'));
  //   return;
  // }
  // let d = new Date(birthday);
  // let newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
  // let currentTime = new Date().getTime();
  // let time = d.getTime();
  // let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  // let sum = 0, i, residue;

  // if(!/^\d{17}(\d|x)$/i.test(value)) {
  //   callback(new Error('非法身份证'));
  //   return;
  // }
  // if(city[value.substr(0,2)] === undefined) {
  //   callback(new Error('非法地区'));
  //   return;
  // }
  // if(time >= currentTime || birthday !== newBirthday){
  //   callback(new Error('非法出生日期'));
  //   return;
  // }
  // for(i=0; i<17; i++) {
  //   sum += value.substr(i, 1) * arrInt[i];
  // }
  // residue = arrCh[sum % 11];
  // if (residue !== value.substr(17, 1)) {
  //   callback(new Error('非法身份证'));
  //   return;
  // }
  callback();
}
//数字验证
export function intValid(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  if (/^[0-9]+$/.test(value)) {
    callback();
  } else {
    callback(new Error('请输入数字'));
  }
}

export function floatValidNotRequired(rule, value, callback) {
  if (value === '') {
    callback();
  } else {
    if (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/).test(value)) {
      callback(new Error('请输入正确的金额值'));
    } else {
      callback();
    }
  }
}

/**
 * 统一社会信用编码
 * @param rule
 * @param value
 * @param callback
 * @constructor
 */
export function checkSocialCreditCode(rule, value, callback) {
  callback();
  /*if(value === ''){

  }*/
  // let patrn = /^[0-9A-Z]+$/;
  // //18位校验及大写校验
  // if ((value.length != 18) || (patrn.test(value) == false)){
  //   callback(new Error('不是有效的统一社会信用编码'));
  // } else {
  //   let Ancode;//统一社会信用代码的每一个值
  //   let Ancodevalue;//统一社会信用代码每一个值的权重
  //   let total = 0;
  //   let weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
  //   let str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  //   //不用I、O、S、V、Z
  //   for (let i = 0; i < value.length - 1; i++)
  //   {
  //     Ancode = value.substring(i, i + 1);
  //     Ancodevalue = str.indexOf(Ancode);
  //     total = total + Ancodevalue * weightedfactors[i];
  //     //权重与加权因子相乘之和
  //   }
  //   let logiccheckcode = 31 - total % 31;
  //   if (logiccheckcode == 31)
  //   {
  //     logiccheckcode = 0;
  //   }
  //   let Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
  //   let Array_Str = Str.split(',');
  // logiccheckcode = Array_Str[logiccheckcode];

  // let checkcode = value.substring(17, 18);
  // if (logiccheckcode != checkcode){
  // callback(new Error('不是有效的统一社会信用编码'));
  // }else{
  // callback();
  // }
  // }
}
//验证（只允许汉字、英文字母、数字、下划线）
export function checkText(rule, value, callback) {
  if (value == '') {
    callback();
  }
  if (!(/^[\u4E00-\u9FA5a-zA-Z0-9_]{0,}$/.test(value))) {
    callback(new Error('只允许汉字、英文字母、数字、下划线！'));
  } else {
    callback();
  }
}

//url验证
export function checkUrl(rule, value, callback) {
  if (value == '') {
    callback();
  }
  var regular = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/i
  if (!regular.test(value)) {
    callback(new Error('请输入正确的链接'));
  }else {
    callback();
  }
}
//邮箱验证
export function checkEmail(rule, value, callback) {
  if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value))) {
    callback(new Error('请输入正确的邮箱地址'));
  }else{
    callback();
  }
}

