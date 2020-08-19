<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{ (isReview == true ? '审核-': '工单详情-') + typeName}}</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:20px;">{{this.workInfo.entityName}}</span>
      <!--<span style="color:#A2AAB6">证照类型：{{this.workInfo.natureTypeStr}}</span>-->
    </div>
    <transition name="dialog-fade">
      <popup-body class="popup-body" v-if="rejectIsShow">
        <p style="font-size: 18px;">驳回理由</p>
        <i @click="rejectIsShow = false" class="popup-hide movePoin el-dialog__close el-icon el-icon-close" style="position: absolute;top: 10px;right: 15px;"></i>
        <textarea v-model="remark" @change="checkLen" @keyup="checkLen" placeholder="请输入驳回理由" style="width: 100%;min-height: 100px;">
        </textarea>
        <div style="color: rgb(162, 170, 182);">您还可以输入
          <span>{{curr}}</span> 个文字</div>
        <button type="button" v-if="type === 'FIRST'" @click="reject" class="w100 el-button el-button--primary" style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>
        <button type="button" v-if="type === 'CHANGE'" @click="rejectEdit" class="w100 el-button el-button--primary"
          style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>
        <button type="button" v-if="type === 'DELETE'" @click="reviewDelete(false)" class="w100 el-button el-button--primary"
                style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>
        <button type="button" @click="rejectIsShow = false" class="w100 el-button el-button--default" style="float: right;">
          <span>取消</span>
        </button>
      </popup-body>
    </transition>
    <div class="main-body">
      <change-detail :entityType="entityType" :work-id="workId" :work-type="typeName" v-if="type === 'CHANGE'"></change-detail>
      <detail-component :workInfoTable='workInfoTable' :data="workInfo" :work-id="workId" v-if="type === 'FIRST' || type === 'DELETE'"></detail-component>
      <backup-edit-record @tabChange="tabChange" :entityId="entityId" v-if="tab == 'workflow'"></backup-edit-record>
      <patrol-record :entity-id="entityId" v-else-if="tab === 'patrol'"></patrol-record>
      <punish-record :entity-id="entityId" v-else-if="tab === 'punish'"></punish-record>
    </div>
    <!-- 底部按钮背景 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="backTo">返回</el-button>
        <span v-if="isReview">
          <el-button @click="rejectIsShow = true">驳回</el-button>
          <el-button v-if="type == 'FIRST'" type="primary" @click="review">审核通过</el-button>
          <el-button v-if="type == 'CHANGE'" type="primary" @click="reviewCfda">审核通过</el-button>
          <el-button v-if="type == 'DELETE'" type="primary" @click="reviewDelete(true)">审核通过</el-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script type="module">

  import PopupBody from 'components/popup/popupdata';
  import BackupEditRecord from 'views/cosmetics/subject/add/backupEditRecord';
  import PatrolRecord from 'views/patrol/record/entityPatrolRecord';
  import PunishRecord from 'views/enforce/entityPunishRecord';
  import DetailComponent from './comm/DetailComponent';
  import ChangeDetail from './comm/ChangeDetail';
  import * as plan from 'api/maai/workflow/workedit';

  export default {
    components: {
      PopupBody
      ,BackupEditRecord
      ,PunishRecord
      ,PatrolRecord
      ,DetailComponent
      ,ChangeDetail
    },
    created() {
      this.workId = this.$route.query.id;
      this.type = this.$route.query.type;
      this.entityType = this.$route.query.entityType;
      this.entityName = this.$route.query.entityName;
      this.isReview = this.$route.query.review == true || this.$route.query.review.length == 4;
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        if (this.$route.query.type === "FIRST" || this.$route.query.type === "DELETE") {
          this.tab = 'detail';
          if(this.$route.query.type === "FIRST"){
            this.typeName = '首次';
          }
          if(this.$route.query.type === "DELETE"){
            this.typeName = '删除';
          }
          this.tabs = [
            { tabName: '主体信息', tab: 'detail' },
            // { tabName: '巡查记录', tab: 'patrol' },
            // { tabName: '处罚记录', tab: 'punish' },
          ]
          plan.getFirstInfo(this.workId).then((results) => {
            this.workInfo = results.data.mapInfo;
            this.workInfoTable = results.data.recordList;
          });
        } else {
          this.tab = 'info';
          this.typeName = '编辑';
          this.tabs = [
            { tabName: '编辑详情', tab: 'info' },
            { tabName: '主体信息', tab: 'detail' },
            { tabName: '备案编辑记录', tab: 'workflow' },
            // { tabName: '巡查记录', tab: 'patrol' },
            // { tabName: '处罚记录', tab: 'punish' },
          ]
          plan.getEditInfo(this.workId).then(results => {
            this.entityId = results.data.entityId;
          });
        }
      },
      backTo() {
        this.$router.go(-1);
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
          state: 'ALREADY_REJECT'
        };
        plan.postReviewFirst(param).then((result) => {
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
      rejectEdit() {
        const param = {
          workId: this.workId,
          remark: this.remark,
          state: 'ALREADY_REJECT'
        };
        plan.postReviewFirst(param).then((result) => {
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
          plan.postReviewFirst({ workId: this.workId, state: 'ALREADY_FILE' }).then((result) => {
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
      reviewDelete(type){
        let params={
          "entityId":this.workInfo.id,
          "state":type?'ALREADY_FILE':'ALREADY_REJECT',
          "remark":this.remark
        }
        plan.postReviewDelete(this.workId,params).then(r=>{
          if(r.status){
            this.$message({
              message: (type?'审核通过成功,即将返回上一页':'审核驳回成功,即将返回上一页'),
              type: 'success'
            });
            setTimeout(() => {
              this.backTo();
            }, 2000);
          }
        })
      },
      reviewCfda() {
        const $this = this;
        this.$confirm('是否确认审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          plan.postReviewEdit({ workId: this.workId, state: 'ALREADY_FILE' }).then((result) => {
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
        workInfoTable: [],
        rejectIsShow: false,
        remark: '',
        entityType: ''
      }
    },
    watch: {
      '$route.query.id'() {
        this.workId = this.$route.query.id;
        this.init();
      }
    }
  }
</script>


<style scoped lang="scss">
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
</style>
