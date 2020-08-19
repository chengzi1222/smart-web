
import store from "../store";

export default async function hasAuth(right) {
  if(store.getters.auths.length<=0){
    return false
  }else{
    const auths = store.getters.auths;
    let flag = false;
    if (auths) {
      const _modules = right.split(",")
      for (let i = 0, len = _modules.length; i < len; i++) {
        const _modulesCode = _modules[i];
        for (let j = 0, lenj = auths.length; j < lenj; j++) {
          if (auths[j] === _modulesCode) {  // 有权限
            flag = true;
            break;
          }
        }
      }
    }
    return flag;
  }
  
}
