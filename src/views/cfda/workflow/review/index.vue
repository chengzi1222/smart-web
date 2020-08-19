<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>审核-{{workData.cfdaTypeStr}}</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:20px;">{{workData.cfdaName}}</span>
      <span style="color:#A2AAB6">主体类型：{{workData.cfdaTypeStr}}</span>
    </div>
    <div>
      <transition name="dialog-fade">
        <popupBody class="popup-body" v-if="rejectIsShow">
          <p style="font-size: 18px;">驳回理由</p>
          <i @click="rejectIsShow = false" class="popup-hide movePoin el-dialog__close el-icon el-icon-close" style="position: absolute;top: 10px;right: 15px;"></i>

          <textarea v-model="remark" @change="checkLen" @keyup="checkLen" placeholder="请输入驳回理由" style="width: 100%;min-height: 100px;">
          </textarea>
          <div style="color: rgb(162, 170, 182);">您还可以输入
            <span>{{curr}}</span> 个文字</div>

          <button type="button" @click="reject" class="w100 el-button el-button--primary" style="float: right;margin-left: 20px;">
            <span type="primary">确定</span>
          </button>

          <button type="button" @click="rejectIsShow = false" class="w100 el-button el-button--default" style="float: right;">
            <span>取消</span>
          </button>
        </popupBody>
      </transition>
    </div>

    <ul class="tab-box">
      <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span :data-index='index'>{{item.tabName}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <div class="main-body">
      <!--首次工单详情-->
      <work-info v-if="currentInfo == infoType.first" :cfdaWorkType="workData.cfdaWorkTypeStr" :workId="workData.workInfo.id" :cfdaId="workData.entityId"></work-info>
      <change-info v-if="currentInfo == infoType.change" :cfdaAfter="workData.after" :cfdaBefore="workData.before" :workId="workData.workInfo.id" :cfdaWorkType="workData.cfdaWorkTypeStr" :cfdaType="workData.cfdaType"></change-info>
      <delay-info v-if="currentInfo == infoType.delay" :cfdaAfter="workData.after" :cfdaBefore="workData.before" :workId="workData.workInfo.id" :cfdaWorkType="workData.cfdaWorkTypeStr"></delay-info>
      <entity v-if="currentInfo == infoType.entity" :cfda="cfdaInfo"></entity>
      <record-list v-if="currentInfo == infoType.record" :currentEntityMenu="currentEntityMenu.work" :entityId="workData.entityId"></record-list>
      <entity-patrol-record-list v-if="currentInfo == infoType.entityPatrolRecord" :entityId="workData.entityId"></entity-patrol-record-list>
      <entity-punish-record-list v-if="currentInfo == infoType.entityPunishRecord" :entityId="workData.entityId"></entity-punish-record-list>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn" style="z-index:1">

      <div>
        <el-button @click="backBtn">返回</el-button>
        <span>
          <el-button :disabled="isReview" v-auth="'food.biz.cfda|func.review'" @click="rejectIsShow = true">驳回</el-button>
          <el-button type="primary" v-auth="'food.biz.cfda|func.review'" :disabled="isReview" @click="review">审核通过</el-button>
        </span>
      </div>
    </div>
  </div>
</template>



<script>
import { reviewAdopt, reviewReject } from "api/cfda/bizWorkflow";
import popupBody from 'components/popup/popupdata';
import { INFO_TYPE, InfoTab, CURRENT_ENTITY_MENU } from "views/cfda/workflow/workUtil.js";
import { getWorkFlowInfo } from "api/cfda/bizWorkflow";
import { getCfda } from "api/cfda/details.js";
import workInfo from 'views/cfda/workflow/info/workInfo';
import changeInfo from 'views/cfda/workflow/info/changeInfo';
import delayInfo from 'views/cfda/workflow/info/delayInfo';
import recordList from 'views/cfda/details/workflow_record';
import entity from 'views/cfda/details/info';
import entityPatrolRecordList from 'views/patrol/record/entityPatrolRecord';
import entityPunishRecordList from 'views/enforce/entityPunishRecord';

export default {
  components: {
    popupBody,
    workInfo,
    changeInfo,
    delayInfo,
    recordList,
    entity,
    entityPatrolRecordList,
    entityPunishRecordList
  },
  mounted() {
    this.init(this.$route.query.id)
  },
  methods: {
    init(id) {
      getWorkFlowInfo({ workId: id }).then((r) => {
        this.workData = r.data;
        this.lists = InfoTab(this.workData.workInfo.type);
        this.infoType = INFO_TYPE;
        this.currentEntityMenu = CURRENT_ENTITY_MENU;
        this.currentInfo = this.lists && this.lists.length > 0 ? this.lists[0].key : 'NONE';
        this.defaultIndex = 0;
      });
    },
    backBtn() {
      this.$router.push({ name: this.$route.query.back });
    },
    checkLen() {
      var maxChars = 100;//最多字符数
      if (this.remark.length > maxChars) this.remark = this.remark.substring(0, maxChars);
      this.curr = maxChars - this.remark.length;
    },
    liClick(index) {
      //点击导航切换样式
      var me = this;
      me.defaultIndex = index;
      this.currentInfo = this.lists[me.defaultIndex].key;
      if (this.currentInfo == this.infoType.entity) {
        getCfda(this.workData.entityId).then((r) => {
          this.cfdaInfo = r.data;
        });
      }
    },
    reject() {
      let param = {
        workId: this.$route.query.id,
        remark: this.remark
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
          message: '驳回成功',
          type: 'success'
        });
        this.rejectIsShow = false;
        this.isReview = true;
        this.backBtn();
      });
    },
    review() {
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
          $this.$message({
            message: '审核通过成功',
            type: 'success'
          });
          $this.isReview = true;
          this.backBtn();
        });
      }).catch(_ => { });
    },

  },
  data() {
    return {
      rejectIsShow: false,
      isReview: false,
      remark: "",
      curr: 100,
      lists: [],
      defaultIndex: 0,		//控制tab导航样式
      cfdaInfo: {},
      workData: {},
      infoType: {},
      currentEntityMenu: {},
      currentInfo: '',
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
