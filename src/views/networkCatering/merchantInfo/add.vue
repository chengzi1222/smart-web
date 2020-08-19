<template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{title}}商户</span>
      <Back></Back>
    </div>
    <div class="dataBox">
      <toggle-form v-if="$route.query.type === 'isAdd'" title="商户链接">
        <div class="childBox">
          <div class="item-box">
            <span class="item-label">商户链接: </span>
            <el-input v-model="merchantUrl" class="w300"></el-input>
            <el-button class="ml20" type="primary">抓取信息</el-button>
            <el-button class="ml20">打开链接</el-button>
          </div>
        </div>
      </toggle-form>
      <toggle-form title="商户信息">
        <div class="childBox">
          <div class="item-box">
            <div class="item">
              <span class="item-label label-text">商户名称:</span>
              <span>{{'肯德基'}}</span>
            </div>
            <div class="item">
              <span class="item-label label-text">商户头像:</span>
              <el-image src="" fit="cover"></el-image>
            </div>
          </div>
          <div class="item-box">
            <div class="item">
              <span class="item-label label-text">商户ID:</span>
              <span>{{1234567}}</span>
            </div>
            <div class="item">
              <span class="item-label label-text">所属平台:</span>
              <span>{{'美团'}}</span>
            </div>
          </div>
          <div class="item-box">
            <div class="item">
              <span class="item-label">商户评分:</span>
              <el-input v-model="score" class="w120"></el-input>
              <span class="tips">(选填)</span>
            </div>
            <div class="item">
              <span class="item-label">月销量:</span>
              <el-input v-model="monthSales" class="w120"></el-input>
              <span class="tips">(选填)</span>
            </div>
          </div>
          <div class="item-box">
            <div class="item">
              <span class="item-label label-text">经营项:</span>
              <span>{{'美食'}}</span>
            </div>
            <div class="item">
              <span class="item-label label-text">经营品类:</span>
              <span>{{'快餐便当'}}</span>
            </div>
          </div>
          <div class="item-box">
            <div>
              <span class="item-label">经营地址:</span>
              <el-input v-model="address" class="w300"></el-input>
              <a href="javascript:;" @click="local" class="operate">获取辖区定位</a>
            </div>
          </div>
          <div class="item-box">
            <div>
              <span class="item-label">所属辖区:</span>
              <el-input v-model="area" class="w300"></el-input>
            </div>
          </div>
          <div class="item-box">
            <div class="item">
              <span class="item-label">联系方式:</span>
              <el-input v-model="tel" class="w120"></el-input>
              <span class="tips">(选填)</span>
            </div>
            <div class="item">
              <span class="item-label label-text">状态:</span>
              <span>{{'正常'}}</span>
            </div>
          </div>
        </div>
      </toggle-form>
      <toggle-form title="资质证照">
        <div class="childBox">
          <div class="item-box">
            <span class="item-label">统一社会信用代码:</span><el-input v-model="creditCode" class="w160 w150"></el-input><span class="tips">(选填)</span>
            <span class="item-label">许可证号:</span><el-input v-model="licenseKey" class="w160 w150"></el-input><span class="tips">(选填)</span>
          </div>
          <div class="item-box">
            <span class="item-label">资质信息:</span><el-image class="w130" src="" fit="cover"></el-image>
          </div>
          <div class="item-box">
            <span class="item-label">经营信息:</span><el-image class="w130" src="" fit="cover"></el-image>
          </div>
        </div>
      </toggle-form>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn">
      <div v-if="$route.query.type === 'isAdd'" class="fr">
        <el-button @click="cancal()">取消并返回</el-button>
        <el-button @click="submit()" type="primary">提交审核</el-button>
      </div>
      <div v-if="$route.query.type === 'isEdit'" class="fr">
        <el-button @click="cancal()">取消</el-button>
        <el-button @click="submit()" type="primary">确认并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import * as merchantInfoApi from "api/networkCatering/merchantInfo"
import Back from 'utils/back.vue' // 返回上一页按钮
import ToggleForm from "components/ToggleForm"; //列表块
export default {
  components: {
    Back,
    ToggleForm
  },
  data() {
    return {
      title: '添加',
      merchantUrl: '',
      score: '',
      monthSales: '',
      address: '',
      area: '',
      tel: '',
      creditCode: '',
      licenseKey: ''
    }
  },
  computed: {
      
  },
  methods: {
    local() {

    },
    cancle() {
      
    },
    submit() {

    }
  },
  mounted() {
    console.log(this.$route.query)
    if(this.$route.query.type === 'isEdit') {
      this.title = '编辑'
    }
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    this.searchDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .dataBox {
    margin-top: 20px;
    .childBox {
      margin: 34px auto;
      .item-box {
        position: relative;
        width: 100%;
        height: 34px;
        margin-top: 20px;
        margin-left: calc((100% - 600px) / 2);
        .item {
          display: inline-block;
          width: 300px;
        }
        .item-label {
          margin-right: 6px;
          margin-left: 44px;
          color: #393939;
        }
        .label-text {
          color: #6D7787;
        }
        .tips {
          font-size: 12px;
          margin-left: 6px;
          color: #A2AAB6;
        }
      }
      .operate {
        margin-left: 6px;
        color: #1787AD;
      }
    }
  }
}

</style>
