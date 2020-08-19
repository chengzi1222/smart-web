<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>重大活动保障检查记录
        <span class='name'>-{{$route.query.taskName}}</span>
      </span>
      <Back :assignURL='"activity.taskList"'></Back>
    </div>
    <div class="main-body no-star">
      <div class="form-item">
        <router-link :to="{name: 'record.boxLunch', query:{ 'taskId': $route.query.taskId,'taskName':$route.query.taskName}}" class="router-btn"
          active-class="active">
          <el-button>盒饭保障检查</el-button>
        </router-link>
        <router-link :to="{name: 'record.everyday', query:{ 'taskId': $route.query.taskId ,'taskName':$route.query.taskName}}" class="router-btn"
          active-class="active">
          <el-button>每日现场检查</el-button>
        </router-link>
        <router-link :to="{name: 'record.risk', query:{ 'taskId': $route.query.taskId,'taskName':$route.query.taskName }}" class="router-btn"
          active-class="active">
          <el-button>风险评估检查</el-button>
        </router-link>
      </div>
    </div>
    <router-view style="height: calc(100% - 60px)"></router-view>
  </div>
</template>

<script>  
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  export default {
    methods: {

    },
    async mounted() {
    },
    data() {
      return {

      }
    },
    components: {
      Back
    }
  }
</script>

<style scoped lang='scss'>
  .name {
    color: rgb(162, 170, 182);
    font-size: 14px;
    font-weight: 500;
  }

  .main-body {
    height: 34px;
    margin-top: 20px;
    /*margin-bottom: 430px;*/
    position: relative;
    .router-btn {
      margin: 0 5px;
    }
  }

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

    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
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

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
    width: 100%;
    text-align: center;
  }

  .operate-a {
    color: #1787ad;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .active {
    .el-button {
      background: #0db5ef;
      color: #fff;
    }
  }
</style>