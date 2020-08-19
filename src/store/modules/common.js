import * as base from "api/login";
import * as storage from 'utils/sessionStorage';
import router from "router";
import {
  setLogin
} from '../../router';
import JYJmenus from 'utils/jyjmenus';
import {
  getHome
} from "api/login";

const common = {
  state: {
    name: '源本智慧食安云平台', // 全程
    simpleName: '源本智慧食安云平台', // 简称
    user: {}, // 用户信息
    auths: [], // 用户权限
    menus: [],
    system: storage.getCookie('system'),
    sidebar: '',
    paths: {},
    sideMenus: [], // 侧边菜单
    headerMenuId: 0, // 头部导航菜单ID
    isCollapse: false,
    mapCenter: {}, // 地图中心\
    h5Title: '', //h5校餐卫士大屏
    filePath: '',
    base:{},
    loginBackground: '', //登录背景
    welcomeBackground: '', //九宫格背景
    mapZoom: 15, //地图缩放等级
    oss: { // oss
      accessKeyId: '',
      accessKeySecret: '',
      endPoint: '',
      bucket: '',
      showEndPoint: '',
      filePrefix: '' // 文件存储前缀
    },
    loginID:'',//登录账号
  },
  mutations: {
    SET_AUTHS: (state, auths) => {
      const str = JSON.stringify(auths)
      state.auths = JSON.parse(str)
    },
    SET_USER: (state, user) => state.user = user,
    SET_MENUS: (state, {
      menus,
      paths,
      system,
      is
    }) => {
      
      state.menus = menus || [];
      state.paths = paths || {};
      state.system = system || '';
      if (!system) {
        state.menus = [];
      }
      if (is) {
        state.menus = menus;
      }
    },
    SET_SIDEBAR_PATH: (state, path) => state.sidebar = path,
    SET_MAP_CENTER: (state, mapCenter) => state.mapCenter = mapCenter,
    SET_SIDEMENUS: (state, sideMenus) => state.sideMenus = sideMenus,
    SET_HEADER_MENU_ID: (state, headerMenuId) => state.headerMenuId = headerMenuId,
    SET_COLLAPSE: (state) => state.isCollapse = !state.isCollapse,
    SET_FILEPATH: (state, path) => state.filePath = path,
    SET_CLIENT_HEIGHT: (state, height) => state.clientHeight = height,
    SET_NAME: (state, name) => state.name = name,
    SET_SIMPLE_NAME: (state, simpleName) => state.simpleName = simpleName,
    SET_LOGINBACKGROUND: (state, img) => state.loginBackground = img,
    SET_WELCOMEBACKGROUND: (state, img) => state.welcomeBackground = img,
    SET_OSS: (state, oss) => state.oss = oss,
    SET_H5TITLE: (state, h5Title) => state.h5Title = h5Title,
    SET_LOGINID: (state, loginID) => state.loginID = loginID,
    SET_BASE: (state, base) => state.base = base,
  },
  actions: {
    /**
     * 得到home
     */
    getHome_: ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        getHome().then(r => {
          if (r.status) {
            if (r.data.fullName && r.data.simpleName) {
              commit("SET_NAME", r.data.fullName);
              commit("SET_SIMPLE_NAME", r.data.simpleName);
            }
            document.title =  r.data.simpleName? r.data.simpleName:'源本智慧食安'
            storage.setCookie('loginBackground', r.data.loginPic?r.data.loginPic:"");
            storage.setCookie('welcomeBackground', r.data.homePic?r.data.homePic:"");
            commit("SET_LOGINBACKGROUND", r.data.loginPic?r.data.loginPic:"");
            commit("SET_WELCOMEBACKGROUND", r.data.homePic?r.data.homePic:"");
            resolve(r);
          } else {
            reject(r);
          }
        })
      });
    },
    /**
     * 用户登录 ,登录成功 返回数据令牌 和 刷新令牌
     */
    login: ({
      commit,dispatch
    }, loginDto) => {
      return new Promise((resolve, reject) => {
        base.login(loginDto).then(results => {
          if (results.status) {
            commit('SET_LOGINID', loginDto.login);
            dispatch('getInfo', '', 'index.welcome')
            setLogin(true);
            // 设置数据令牌到Cookie
            const data = results.data;
            resolve(results);
          } else {
            commit('SET_LOGINID','');
            reject(results);
          }
        })
      });
    },
    /**
     * 前端登出
     */
    logout: ({
      commit
    }, params) => {
      storage.removeCookie('system');
      commit('SET_USER', {});
      commit('SET_MENUS', {})
      commit('SET_MAP_CENTER', {})
      base.logout().then((data) => {
        // commit('SET_NAME', '源本智慧食安云平台')
        setLogin(false);
        if (storage.getData('isKashiLogin') === "true") {
          router.push({
            name: 'kashiLogin',
            params
          })
        } else {
          router.push({
            name: 'login',
            params
          })
        }

      })
    },
    getUser: ({
      commit
    }, label, name) => {
      console.log("-getUserIng-")
      return new Promise(async (resolve, reject) => {
        await base.getInfo().then(user => {
          if (user.status) {
            //加载用户信息
            console.log("-getUserIng-")
            commit('SET_USER', user.data)
          }
        })
      })
    },
    /**
     * 拉取当前登录用户信息,含有 用户基本信息, 菜单
     */
    getInfo: ({
      commit,state
    }, label, name) => {
      console.log("运行info")
      return new Promise(async (resolve, reject) => {
       
          await base.getInfo().then(user => {
            if (user.status) {
              let system = label;
              //加载用户信息
              document.title = user.data.simpleName?user.data.simpleName:state.simpleName
              commit('SET_USER', user.data)
              resolve(user)
              // console.log(user.data.userType,user.data.areaCode,user.data.userType != "ADMIN" && user.data.areaCode == "510109",'dddddddddd')
              if (user.data.userType != "ADMIN" && user.data.areaCode.slice(0,6) == "510109") {
                system = 'FOOD'
                storage.setCookie("system", 'FOOD');
              }
              if (user.data.deptType == 'JYJ') {
                //加载用户权限
                let JYJauths = ['food.peri.yuanben']
                commit('SET_AUTHS', JYJauths);
                //加载目录信息
                let menus;
                menus = JYJmenus;
                let i = 0,
                  len = menus.length;
                const menuPath = {}
                while (i < len) {
                  const menu = menus[i];
                  if (menu.route) {
                    const root = menu.path.split('.')[0]
                    menuPath[menu.route] = root
                  } else if (menu.children) {
                    menus = menus.concat(menu.children);
                    len = menus.length;
                  }
                  i++;
                }
                commit('SET_MENUS', {
                  menus: JYJmenus,
                  paths: menuPath,
                  system: label,
                  is: true
                });
              } else if (system === 'INDEX') {
                return
              } else { //判断是否教育局，不是就请求菜单
               
                //请求菜单
                if (name !== 'index.welcome' && system) {

                  base.getMenus(system).then(results => {
                    console.log(results.data)
                    if (results.status) { // 判断这几类，删除掉首页
                      if (label === 'NEWS' || label === 'BIG_DATA' || label === 'SPECIAL_EQUIPMENT') {
                        for (let i = 0; i < results.data.length; i++) {
                          if (results.data[i].id == '1107') { // 首页
                            results.data.splice(i, 1)
                            break
                          }
                        }
                      }
                      let menus = [].concat(results.data);
                      console.log('------------------------------')
                      console.log(menus)
                      let i = 0,
                        len = menus.length;
                      const menuPath = {}
                      while (i < len) {
                        const menu = menus[i];
                        if (menu.route) {
                          const root = menu.path.split('.')[0]
                          menuPath[menu.route] = root
                        } else if (menu.children) {
                          menus = menus.concat(menu.children);
                          len = menus.length;
                        }
                        i++;
                      }
                      commit('SET_MENUS', {
                        menus: results.data,
                        paths: menuPath,
                        system: label,
                        is: true
                      });
                    }

                  });
                  base.getAuths().then(auths => {
                    commit('SET_AUTHS', auths.data);
                  });
                  if (user.data.userType != "ADMIN" && user.data.areaCode.slice(0,6) == "510109"&&window.location.host=='smart-sccdgx.ybveg.com') {
                    router.replace({name:'gaoxinHome'});
                  }
                }
              }
            } else {
              reject(user);
            }
         
        });
        const baseInfo = await base.getBase();
        commit('SET_MAP_CENTER', baseInfo.data.mapCenter)
        commit('SET_FILEPATH', baseInfo.data.filePath)
        commit('SET_H5TITLE', baseInfo.data.h5Title)
        commit('SET_BASE', baseInfo.data)
      })
    },
    getMenus: ({
      commit,
      state
    }, label) => {
      console.log("运行menus")
      base.getInfo().then(results => {
        if (results.status) {
          commit('SET_USER', results.data); //判断是否教育局，重新挂载user
          if (results.data.deptType == 'JYJ') { //判断是否教育局
            let menus;
            menus = JYJmenus;
            let i = 0,
              len = menus.length;
            const menuPath = {}
            while (i < len) {
              const menu = menus[i];
              if (menu.route) {
                const root = menu.path.split('.')[0]
                menuPath[menu.route] = root
              } else if (menu.children) {
                menus = menus.concat(menu.children);
                len = menus.length;
              }
              i++;
            }
            commit('SET_MENUS', {
              menus: JYJmenus,
              paths: menuPath,
              system: label,
              is: true
            });
          } else if (label === 'INDEX') {
            return
          } else { //判断是否教育局，不是就请求菜单
            const system = label;
            base.getMenus(system).then(results => {
              console.log(results.data)
              if (results.status) { // 判断这几类，删除掉首页
                if (label === 'NEWS' || label === 'BIG_DATA' || label === 'SPECIAL_EQUIPMENT') {
                  for (let i = 0; i < results.data.length; i++) {
                    if (results.data[i].id == '1107') { // 首页
                      results.data.splice(i, 1)
                      break
                    }
                  }
                }
                let menus = [].concat(results.data);
                let i = 0,
                  len = menus.length;
                const menuPath = {}
                while (i < len) {
                  const menu = menus[i];
                  if (menu.route) {
                    const root = menu.path.split('.')[0]
                    menuPath[menu.route] = root
                  } else if (menu.children) {
                    menus = menus.concat(menu.children);
                    len = menus.length;
                  }
                  i++;
                }
                commit('SET_MENUS', {
                  menus: results.data,
                  paths: menuPath,
                  system: label,
                  is: false
                });
              }

            });
          }
        }
      });
    }
  },
  collapse: ({
    commit
  }) => {
    commit("SET_COLLAPSE");
  },
}
// }

export default common;