<template>
  <header class="app-header">
    <div class="app-logo " @click="SpecialTreatment" v-if="headOnly">
      <el-tooltip class="item" effect="dark"
                  :content="$store.getters.user.simpleName?$store.getters.user.simpleName:$store.getters.simpleName"
                  placement="bottom-start">
        <div class="textell" style="width:100%;">
        {{$store.getters.user.simpleName?$store.getters.user.simpleName:$store.getters.simpleName}}
        </div>
      </el-tooltip>
    </div>
    <div class="app-logo" @click="SpecialTreatment" v-else>
      农产品溯源监管平台
    </div> 
    <ul class="header-nav" v-if="$store.getters.loginID=='15283528653'">
      <li v-for="item in menus" :key="item.id" @click="change(item)" v-if="headOnly && item.name != '校餐监管'">
        <span :class="item.id == headerMenuId ? 'pitch':''">{{ item.name }}</span>
      </li>
    </ul>
    <ul class="header-nav" v-else>
      <li v-for="item in menus" :key="item.id" @click="change(item)" v-if="headOnly || item.name == '溯源监管'">
        <span :class="item.id == headerMenuId ? 'pitch':''">{{ item.name }}</span>
      </li>
    </ul>
    
    <div class="app-info" style="justify-content:flex-end;">
      <!-- <div class="app-inform" title="敬请期待">
        <i class="icon iconfont icon-remind"></i>
        <span>5</span>
      </div> -->
      <div class="personal-center">
        <!--<el-menu theme="dark" class="el-menu-demo" mode="horizontal">-->
        <!--<el-submenu index="2" :popper-append-to-body='false'>-->
        <!--<template slot="title">-->
        <!--<span class="ox" :title="user.realName">{{ user.realName }}</span>-->
        <!--</template>-->
        <!--<el-menu-item index="2-1">个人中心</el-menu-item>-->
        <!--<el-menu-item index="2-2" @click="toChangePassword">修改密码</el-menu-item>-->
        <!--&lt;!&ndash; 没有区分食品和药品暂时屏蔽 &ndash;&gt;-->
        <!--&lt;!&ndash; <el-menu-item v-auth="'food.biz.rb|func.add,food.biz.pb|func.add,food.biz.cb|func.add,food.biz.cfda|func.add'" index="2-3" @click="goMyWork">我的工单</el-menu-item> &ndash;&gt;-->
        <!--<el-menu-item index="2-4" @click="logout">退出</el-menu-item>-->
        <!--</el-submenu>-->
        <!--</el-menu>-->

        <el-dropdown class="el-menu-demo hoverStatus operate">
          <span class="ox" :title="user.realName">{{ user.realName }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="pullDown">个人中心</el-dropdown-item>
            <span @click="toChangePassword">
            <el-dropdown-item class="pullDown">修改密码</el-dropdown-item>
            </span>
            <!-- 没有区分食品和药品暂时屏蔽 -->
            <!--<span v-auth="'food.biz.rb|func.add,food.biz.pb|func.add,food.biz.cb|func.add,food.biz.cfda|func.add'"-->
            <!--@click="goMyWork">-->
            <!--<el-dropdown-item class="pullDown">我的工单</el-dropdown-item>-->
            <!--</span>-->
            <span @click="logout">
            <el-dropdown-item class="pullDown">退出</el-dropdown-item>
            </span>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script>
  import bus from 'utils/eventBus';
  import * as base from "api/login";
  import * as storage from "utils/sessionStorage";

  function findRouterPath(menus) {
    for (let i = 0, len = menus.length; i < len; i++) {
      if (menus[i].route) {
        return menus[i].route;
      }else{
        if(menus[i].children.length>0){
          return findRouterPath(menus[i].children)
        }
      }
    }
    if (menus[0].children) {
      return findRouterPath(menus[0].children);
    }
  }

  function findHightPath(menuPath, routerPath) {
    console.log(menuPath, routerPath)
    const curpath = routerPath.split('/');
    let max = 0, curP = '';
    for (let p in menuPath) {
      const ps = p.split('/');
      const len = ps.length > curpath.length ? ps.length : curpath.length;
      let curMax = 0;
      for (let i = 1; i < len; i++) {
        if (ps[i] === curpath[i] && i > curMax) {
          curMax = i;
        } else {
          break;
        }
      }
      if (curMax > max) {
        curP = p;
        max = curMax;
      }
    }
    return curP;
  }

  export default {
    name: 'header-page',
    data() {
      return {
        headerMenuId: 0,
        hasChange: false,
        headOnly: false
      }
    },
    mounted() {
      this.initHeader();
      if (this.$store.getters.user.realName != '顺点-曹建') {
        this.headOnly = true;
      } else {
        document.title = '农产品溯源监管平台'
      }
    },
    methods: {
      SpecialTreatment() {//判断是否特别处理不允许点击
        this.menus.length = 0;
         if (this.$store.getters.user.userType != "ADMIN" && this.$store.getters.user.areaCode.slice(0,6) == "510109"&&window.location.host=='smart-sccdgx.ybveg.com') {
           this.$router.push({name:'gaoxinHome'});
           return;
         }
        if (this.$store.state.common.user.deptType == 'JYJ' || this.$store.getters.user.realName == '顺点-曹建') {
          return;
        } 
        
        this.$router.push({name:'index.welcome'});
      },
      logout() {
        this.$store.dispatch("logout");
      },
      goMyWork() {
        this.$router.push({name: "mywork"});
      },
      setHeaderId(id) {
        if (id != this.headerMenuId) {
          this.headerMenuId = id;
          this.$store.commit("SET_HEADER_MENU_ID", id);
          for (let i = 0, len = this.menus.length; i < len; i++) {
            const value = this.menus[i];
            if (value.id == id) {
              this.$store.commit("SET_SIDEMENUS", value.children);
              break;
            }
          }
        }
      },
      initHeader() {
        // console.log(this.$route.path);
        if (this.$route.name === "index.welcome") {
          this.setHeaderId(0);
          this.$store.commit("SET_SIDEMENUS", []);
        } else {
          const curPath = findHightPath(this.paths, this.$route.path);
          this.setHeaderId(this.paths[curPath]);
          this.$store.commit("SET_SIDEBAR_PATH", curPath);
        }
      },
      change(item) {
        //点击头部导航切换样式
        this.hasChange = true;
        if (this.headerMenuId != item.id) {
          this.setHeaderId(item.id);
          let path = '';
          if (item.route) {
            // 如果有路由地址 跳转路由
            path = item.route;
          } else {  // 如果没有路由则找到第一个可以跳转路由
            path = findRouterPath(item.children);
          }
          if (path) {
            const curPath = findHightPath(this.paths, path);
            if (!item.children.length) {
              this.$router.push(path);
            } else if (item.children[0].children && item.children[0].children.length > 0) {
              this.$router.push({path: path, query: {pathName: item.children[0].children[0].name}});
            } else {
              this.$router.push({path: path, query: {pathName: item.children[0].name}});
            }
            this.$store.commit("SET_SIDEBAR_PATH", path);
          }
        }
      },
      toChangePassword() {
        this.$router.push({
          name: "sys.password",
          query: {
            type: "update",
            step: 1
          }
        });
      }
    },
    watch: {
      'menus'() {
        this.initHeader();
      },
      '$route.path'() {
        if (!this.hasChange) {
          this.initHeader();
        } else {
          this.hasChange = false;
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
      menus() {
        return this.$store.getters.menus
      },
      paths() {
        return this.$store.getters.paths
      },
    },
  };
</script>
<style scope lang="scss">
  .app-info .personal-center .el-submenu__title {
    padding: 0 10px;
  }

  .el-menu li.el-submenu {
    float: none;
  }
</style>
<style scoped lang="sass">
  .app-header {
    z-index: 2;
    background-color: #394145;
    color: #fff;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
  }

  .app-header .app-logo {
    min-width: 14.5%;
    max-width: 18.5%;
    text-align: center;
    cursor: pointer;
  }

  .app-header .header-nav {
    display: flex;
    width: 72%;
  }

  .app-header .header-nav li {
    width: 120px;
    text-align: center;
  }

  .header-nav li span {
    cursor: pointer;
    display: block;
    color: #fff;
    box-sizing: border-box;
    height: 100%;
  }

  .header-nav li span:hover {
    text-decoration: none;
    background: #2A3034;
  }

  .app-info {
    width: 15.4%;
    display: flex;
  }

  .app-inform {
    border-left: 1px solid #232c30;
    border-right: 1px solid #232c30;
    min-width: 29%;
    text-align: center;
    position: relative;
  }

  .app-inform i {
    color: #cfd6d9;
    font-size: 22px;
  }

  .app-inform span {
    display: inline-block;
    width: 14.5px;
    height: 14.5px;
    background: #fa503b;
    font-size: 12px;
    color: #fff;
    text-align: center;
    line-height: 15px;
    transform: scale(0.8333);
    position: absolute;
    top: 8px;
    left: 50%;
    border-radius: 7px;
  }

  .personal-center {
    padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    width: 160px;
    text-align: center;
  }

  .personal-center i {
    font-size: 20px;
  }

  .pitch {
    /* @include head_active; */
    background: #2A3034;
    border-bottom: 3px solid #15BAF3;
    color:#fff;
  }

  .ox {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    width: 70%;
    color: #909399;
  }

  .operate {
    width: 140px !important;
  }

  .pullDown {
    width: 100px;
    color: #909399;
    text-align: center;
  }

  .pullDown:hover {
    background-color: #ccc;
    color: #303133;
  }

  .pullDown:hover .hoverStatus {
    cursor: pointer;
    background-color: #2A3034;
    border-bottom: 3px solid #15BAF3;
  }

  .hoverStatus:hover {
    cursor: pointer;
    background-color: #2A3034;
    border-bottom: 3px solid #15BAF3;
  }

</style>
