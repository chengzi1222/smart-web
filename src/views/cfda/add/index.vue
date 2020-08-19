<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>三小录入</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in lists" @click="liClick" :data-index='index' :class="index == defaultIndex? 'li-bott':''" :key="item.num">
        <span @click="liClick" :data-index='index'>{{item.tabName}}</span>
        <span v-if="item.num" style="margin-left:20px;">{{item.num}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="main-body no-star">
      <div class="form-item">今日已提交三小备案数:
        <span style="margin-left:10px;">{{count}}</span>
      </div>
      <div class="form-item">主体类型:
        <router-link to="/cfda/add/restaurant" class="router-btn" active-class="active">
          <el-button>小经营店（餐饮）</el-button>
        </router-link>
        <router-link to="/cfda/add/sale" class="router-btn" active-class="active">
          <el-button>小经营店（销售）</el-button>
        </router-link>
        <router-link to="/cfda/add/workshop" class="router-btn" active-class="active">
          <el-button>小作坊</el-button>
        </router-link>
        <router-link to="/cfda/add/vendors" class="router-btn" active-class="active">
          <el-button>小摊贩</el-button>
        </router-link>
      </div>
      <router-view></router-view>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn"></div>
  </div>
</template>

<script>
import { getTodayCount, getBackupCount } from "api/cfda/add.js";
export default {
  mounted() {
    getTodayCount().then((r) => {
      this.count = r.data;
    });
    getBackupCount().then((r) => {

      this.lists[1].num = r.data;
    });
  },
  methods: {
    liClick(e) {   //点击导航切换样式
      var me = this;
      if (me.defaultIndex != e.target.dataset.index) {
        this.$router.push({ name: "cfda.add.draft" })
      }
    },
  },
  data() {

    return {
      count: 0,
      lists: [
        { tabName: '信息录入' },
        { tabName: '草稿箱', num: 0 },
      ],
      defaultIndex: 0,		//控制tab导航样式
    }
  }
}
</script>


<style scoped lang="scss">
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

/* 切换页面下面的内容 */

.main-body {
  margin-top: 20px;
  margin-bottom: 430px;
  padding-left: 230px;
  position: relative;
  .router-btn {
    margin: 0 5px;
  }
}

.active {
  .el-button {
    background: #0db5ef;
    color: #fff;
  }
}
</style>
