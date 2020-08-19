<template>
  <div v-bar="{
          preventParentScroll: true,
          scrollThrottle: 30}" class="broadside-box" ref="bar" :key="key">
    <transition name="toggle">
      <div class="app-nav">
        <div class="nav-shrink">
          <i class="icon iconfont icon-fewer movePoin" @click="collapse()"></i>
        </div>
        <el-menu :default-active="path" class="app-nav-width over" theme="dark" :collapse="isCollapse" background-color="#4c5460" text-color="#bfcbd9" active-text-color="#20a0ff">
          <template v-for="item in menus">
            <el-submenu :index="item.path" v-if="item.children.length > 0" :key="item.id">
              <template slot="title">
                <i class="icon iconfont" :class="item.icon" v-show="item.icon"></i>
                <span slot="title">{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <el-menu-item v-if="subItem.route" :index="subItem.route" :key="subItem.id" @click="change(subItem.route,subItem.name)">
                  <i class="icon iconfont icon-system" :class="subItem.icon" v-show="subItem.icon"></i>
                  {{ subItem.name }}
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else-if="item.route" :index="item.route" :key="item.id" @click="change(item.route,item.name)">
              <i class="icon iconfont" :class="item.icon" v-show="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </transition>
  </div>

</template>

<script>

export default {
  mounted() {
  },
  methods: {
    collapse() {
      this.$store.dispatch("collapse");
      this.shows = !this.shows;
      if (this.shows) {
        this.$vuebar.initScrollbar(this.$refs.bar, true);
        this.$refs.bar.classList.remove('shows');
      } else {
        this.$vuebar.destroyScrollbar(this.$refs.bar);
        this.$refs.bar.classList.add('shows');
      }
    },
    change(path,name) {
      this.$router.push({ path: path,query:{pathName:name}})
    }
  },
  data() {
    return {
      shows: true,
      sidebar: ''
    }
  },
  computed: {
    menus() {
      return this.$store.getters.sideMenus
    },
    key() {
      return 'SideBarMenu-' + this.$store.getters.headerMenuId;
    },
    path() {
      return this.$store.getters.sidebar;
    },
    // path() {
    //   const menuPath = this.$store.getters.menuPath;
    //   const curpath = this.$route.path.split('/');
    //   let max = 0;
    //   let curP = '';
    //   for (let p in menuPath) {
    //     const ps = p.split('/');
    //     const len = ps.length > curpath.length ? ps.length : curpath.length;
    //     let curMax = 0;
    //     for (let i = 1; i < len; i++) {
    //       if (ps[i] === curpath[i] && i > curMax) {
    //         curMax = i;
    //       } else {
    //         break;
    //       }
    //     }
    //     if (curMax > max) {
    //       curP = p;
    //       max = curMax;
    //     }
    //   }
    //   return curP;
    // },
    isCollapse() { return this.$store.getters.isCollapse },
  },
}

</script>

<style lang="scss">
.broadside-box {
  background: #4C5460;
  position: relative;
  min-width: 64px;
  max-width: 170px;
  // overflow-y:auto;
}

.app-nav-width:not(.el-menu--collapse) {
  width: 180px;
}

.app-nav {
  height: 100%;
}

/* .app-nav .nav-active {
  @include side_active;
} */

.over li {
  min-width: 10px;
}
.over div {
  padding: 0;
}

.nav-shrink {
  box-sizing: border-box;
  width: 100%;
  padding-left: 4px;
  text-align: center;
  background: #606979;
  white-space: nowrap;
  overflow: hidden;
  line-height: 34px;
  color: #b6c1ca;
  font-size: 16px;
}

.el-menu--dark,
.el-menu--dark .el-submenu .el-menu {
  background-color: #4C5460;
}

.el-menu--dark .el-submenu .el-menu .el-menu-item:hover {
  background-color: #48576a;
}

// .el-menu--dark .el-menu-item, .el-menu--dark .el-submenu__title{
// color: $side_color;
// }

/* .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
  .el-menu-item.is-active {
    background-color: #15BAF3;
    color: #bfcbd9;
  } */

.app-nav [class*="icon-"] {
  margin-right: 13px;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
// .shows {
  // overflow: initial !important;
// }
.el-menu {
  border-right: solid 1px transparent;
}
.shows .app-nav {
  overflow: initial !important;
  width: 100% !important;
}
/*.shows .vb-dragger{
    display: none !important;
    opacity: 0;
  }*/
 
</style>
