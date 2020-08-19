<template>
  <div>
    <div class="user-box" v-if="$route.name != 'medicalDevices_fileAudit.info'">
      <div class="page-tilt">
        <b></b>
        <span>我的工单</span>
      </div>
      <div class="main-body no-star">
        <div class="form-item">主体类型:
          <router-link :to="{name: 'medicalDevices_fileAudit.production', params: {entityType: 'product'}}" class="router-btn"
            active-class="active">
            <el-button>生产主体</el-button>
          </router-link>
          <router-link :to="{name: 'medicalDevices_fileAudit.manage', params: {entityType: 'circulation'}}" class="router-btn"
            active-class="active">
            <el-button>经营主体</el-button>
          </router-link>
          <router-link :to="{name: 'medicalDevices_fileAudit.use', params: {entityType: 'restaurant'}}" class="router-btn"
            active-class="active">
            <el-button>使用主体</el-button>
          </router-link>
        </div>
        <router-view style="height: calc(100% - 60px)"></router-view>
      </div>
    </div>
    <div class="user-box" v-if="$route.name == 'medicalDevices_fileAudit.info'">
      <router-view style="height: calc(100% - 60px)"></router-view>
    </div>
  </div>
</template>

<script type="module">
import YuanbenPage from 'components/common/YuanbenPage'
import { getEnums } from 'api/common'
export default {
    mounted() {
    },
    methods: {

    },
    components: {},
    data() {
      return {

      };
    }
};
</script>


<style scoped lang="scss">
  .main-body {
    height: calc(100% - 60px);
    margin-top: 20px;
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