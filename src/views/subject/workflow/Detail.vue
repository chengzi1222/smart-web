<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{ (isReview == true ? '审核-': '工单详情-') + typeName}}</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:20px;">{{this.workInfo.entityName}}</span>
      <span v-if="entryType === 'entity'" style="color:#A2AAB6">证照类型：{{this.workInfo.natureTypeStr}}</span>
    </div>
    <transition name="dialog-fade">
      <popup-body class="popup-body" v-if="rejectIsShow">
        <p style="font-size: 18px;">驳回理由</p>
        <i @click="rejectIsShow = false" class="popup-hide movePoin el-dialog__close el-icon el-icon-close" style="position: absolute;top: 10px;right: 15px;"></i>

        <textarea v-model="remark" @change="checkLen" @keyup="checkLen" placeholder="请输入驳回理由" style="width: 100%;min-height: 100px;">
        </textarea>
        <div style="color: rgb(162, 170, 182);">您还可以输入
          <span>{{curr}}</span> 个文字</div>

        <button type="button" v-if="type === 'CHANGE' || type === 'FIRST'" @click="reject" class="w100 el-button el-button--primary" style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>
        <button type="button" v-if="type === 'EDIT'" @click="rejectEdit" class="w100 el-button el-button--primary" style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>

        <button type="button" @click="rejectIsShow = false" class="w100 el-button el-button--default" style="float: right;">
          <span>取消</span>
        </button>
      </popup-body>
    </transition>
    <ul class="tab-box">
      <li v-for="item in tabs" :key="item.tabName" @click="tabChange(item.tab)" :class="tab === item.tab ? 'li-bott':''">
        <span>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="main-body">
      <change-detail :entryType="entryType" :work-id="workId" :work-type="typeName" v-if="tab === 'info' && type === 'CHANGE'"></change-detail>
      <change-detail :entryType="entryType" :work-id="workId" :work-type="typeName" v-if="tab === 'info' && type === 'EDIT'"></change-detail>
      <detail-component :data="workInfo" :work-id="workId" v-else-if="tab === 'detail'"></detail-component>
      <workflow-record :entity-id="entityId" :entity-type="$route.params.type" from="workflow" v-else-if="tab==='workflow'"></workflow-record>
      <patrol-record :entity-id="entityId" v-else-if="tab === 'patrol'"></patrol-record>
      <punish-record :entity-id="entityId" v-else-if="tab === 'punish'"></punish-record>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn" style="z-index:1">

      <div>
        <el-button @click="backTo">返回</el-button>
        <span v-auth="'food.biz.pb|func.review,food.biz.cb|func.review,food.biz.rb|func.review,food.biz.cfda|func.review'" v-if="isReview">
          <el-button @click="rejectIsShow = true">驳回</el-button>
          <el-button v-if="type === 'CHANGE' || type === 'FIRST'" type="primary" @click="review">审核通过</el-button>
          <el-button v-if="type === 'EDIT'" type="primary" @click="reviewCfda">审核通过</el-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import PopupBody from 'components/popup/popupdata';
import ChangeDetail from './ChangeDetail';
import DetailComponent from '../common/DetailComponent';
import WorkflowRecord from 'views/subject/common/WorkflowRecord';
import PatrolRecord from 'views/patrol/record/entityPatrolRecord';
import PunishRecord from 'views/enforce/entityPunishRecord';
import { reviewPass, reviewReject } from "api/sub/work";
import { reviewAdopt, reviewReject as cfdaReject } from "api/cfda/bizWorkflow";
import * as sub from "api/sub/sub";



export default {
  components: {
    PopupBody, WorkflowRecord,
    ChangeDetail, DetailComponent, PunishRecord, PatrolRecord
  },
  created() {
    this.workId = this.$route.query.id;
    this.type = this.$route.query.type;
    this.entryType = this.$route.query.entryType;
    this.entityName = this.$route.query.entityName;
    this.isReview = this.$route.query.review == true;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if(this.entryType === 'entity' || !this.entryType) {
        if (this.$route.query.type === "FIRST") {
          this.typeName = '首次';
          this.tab = 'detail';
          this.tabs = [
            { tabName: '主体信息', tab: 'detail' },
            { tabName: '巡查记录', tab: 'patrol' },
            { tabName: '处罚记录', tab: 'punish' },
          ]
        } else {
          this.tab = 'info';
          this.typeName = '编辑';
          this.tabs = [
            { tabName: '编辑详情', tab: 'info' },
            { tabName: '主体信息', tab: 'detail' },
            { tabName: '备案编辑记录', tab: 'workflow' },
            { tabName: '巡查记录', tab: 'patrol' },
            { tabName: '处罚记录', tab: 'punish' },
          ]
        }
        sub.getWorkSubInfo(this.workId).then((results) => {
          this.entityId = results.data.entityId;
          results.data.workTypeLabel = this.typeName;
          this.workInfo = results.data;
        });
      } else if(this.entryType === 'cfda') {
        if (this.type === "EDIT") {
          this.typeName = '编辑';
          this.tab = 'info';
          this.tabs = [
            { tabName: '编辑详情', tab: 'info' },
          ]
          this.workInfo.entityName = this.entityName;
        }
      }
    },
    backTo() {
      this.$router.go(-1);
    },
    tabChange(tab) {   //点击导航切换样式
      this.tab = tab;
    },
    checkLen() {
      const maxChars = 100;//最多字符数
      if (this.remark.length > maxChars) this.remark = this.remark.substring(0, maxChars);
      this.curr = maxChars - this.remark.length;
    },
    reject() {
      const param = {
        workId: this.workId,
        remark: this.remark,
      };
      reviewReject(param).then((result) => {
        if (!result.status) {
          this.$message({
            message: result.message,
            type: result.level
          });
          return;
        }
        this.$message({
          message: '驳回成功,即将返回上一页',
          type: 'success'
        });
        this.rejectIsShow = false;

        setTimeout(() => {
          this.backTo();
        }, 2000);

      });
    },
    rejectEdit(){
      const param = {
        workId: this.workId,
        remark: this.remark,
      };
      cfdaReject(param).then((result) => {
        if (!result.status) {
          this.$message({
            message: result.message,
            type: result.level
          });
          return;
        }
        this.$message({
          message: '驳回成功,即将返回上一页',
          type: 'success'
        });
        this.rejectIsShow = false;

        setTimeout(() => {
          this.backTo();
        }, 2000);

      });
    },
    review() {
      const $this = this;
      this.$confirm('是否确认审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reviewPass(this.workId).then((result) => {
          if (!result.status) {
            this.$message({
              message: result.message,
              type: result.level
            });
            return;
          }
          this.$message({
            message: '审核通过成功,即将返回上一页',
            type: 'success'
          });
          setTimeout(() => {
            this.backTo();
          }, 2000);
        });
      }).catch(_ => { });
    },

    reviewCfda() {
      const $this = this;
      this.$confirm('是否确认审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          workId: $this.$route.query.id
        };
        reviewAdopt(param).then((result) => {
          if (!result.status) {
            this.$message({
              message: result.message,
              type: result.level
            });
            return;
          }
          this.$message({
            message: '审核通过成功,即将返回上一页',
            type: 'success'
          });
          setTimeout(() => {
            this.backTo();
          }, 2000);
        });
      }).catch(_ => { });
    },

  },
  data() {
    return {
      tab: 'detail',
      tabs: [],
      typeName: "",
      type: "",
      isReview: false,
      curr: 100,
      entityId: '',
      workId: '',
      workInfo: {},
      rejectIsShow: false,
      remark: '',
    }
  },
  watch: {
    '$route.query.id'() {
      this.workId = this.$route.query.id
      this.init();
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
