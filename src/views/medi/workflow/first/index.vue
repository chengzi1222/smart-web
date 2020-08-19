<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>工单详情-{{ type }}</span>
    </div>
    <div style="margin-top:20px;">
      <span style="font-size:20px;margin-right:20px;">主体名称：{{ entityName }}</span>
    </div>
    <transition name="dialog-fade">
      <popup-body class="popup-body" v-if="rejectIsShow">
        <p style="font-size: 18px;">驳回理由</p>
        <i @click="rejectIsShow = false" class="popup-hide movePoin el-dialog__close el-icon el-icon-close" style="position: absolute;top: 10px;right: 15px;"></i>

        <textarea v-model="remark" @change="checkLen" @keyup="checkLen" placeholder="请输入驳回理由" style="width: 100%;min-height: 100px;">
        </textarea>
        <div style="color: rgb(162, 170, 182);">您还可以输入
          <span>{{curr}}</span> 个文字</div>

        <button type="button" @click='reviewFirst("ALREADY_REJECT")' class="w100 el-button el-button--primary" style="float: right;margin-left: 20px;">
          <span type="primary">确定</span>
        </button>

        <button type="button" @click="rejectIsShow = false" class="w100 el-button el-button--default" style="float: right;">
          <span>取消</span>
        </button>
      </popup-body>
    </transition>
    <yuanben-tab :tabs="tabs" label="name" value="tab" :tab="tab" @tab-change="choose"></yuanben-tab>
    <div class="main-body">
      <!--首次工单详情-->
      <work-info v-if="tab === 'info'" :infoData="data" :typeExt="type_ext"></work-info>
    </div>
    <!-- 底部按钮-->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="default" @click='backBtn'>返回</el-button>
        <el-button type="default" @click='isShowRej' v-if="isShow">驳回</el-button>
        <el-button type="primary" @click='reviewFirst("ALREADY_FILE")' style="width:120px;" v-if="isShow">审核通过</el-button>
      </div>
    </div>
  </div>
</template>



<script>
  import YuanbenTab from 'components/common/YuanbenTab'
  import workInfo from './workInfo';
  import * as api from "api/medi/workflow/workflow.js";
  import PopupBody from 'components/popup/popupdata';

  export default {
    components: {
      workInfo,
      YuanbenTab,
      PopupBody
    },
    mounted() {
      this.getFirstInfo(this.workId);
    },
    methods: {
      backBtn() {
        this.$router.go(-1)
      },
      reviewFirst(state) {
        let mess = "";
        let returnMess = "";
        if (state == "ALREADY_FILE") {
          mess = "是否确认审核通过?";
          returnMess = "审核通过成功,即将返回上一页";
          this.$confirm(mess, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.reviewFirsts(state, returnMess);
          })
        } else {
          returnMess = "审核驳回成功,即将返回上一页";
          this.reviewFirsts(state, returnMess);
        }

      },
      reviewFirsts(state, returnMess) {
        api.reviewFirst({ "workId": this.workId, "state": state, "remark": this.remark }).then(d => {
          if (!d.status) {
            this.$message({
              message: result.message,
              type: result.level
            });
            return;
          }
          this.$message({
            message: returnMess,
            type: 'success'
          });
          setTimeout(() => {
            this.backTo();
          }, 2000);
        });
      },
      backTo() {
        this.$router.go(-1);
      },
      choose(tab) {
        if (this.tab !== tab) {
          this.tab = tab
        }
      },
      //弹出驳回框
      isShowRej() {
        this.rejectIsShow = true
      },
      //驳回描述字数限制
      checkLen() {
        const maxChars = 100;//最多字符数
        if (this.remark.length > maxChars) this.remark = this.remark.substring(0, maxChars);
        this.curr = maxChars - this.remark.length;
      },
      async getFirstInfo(id) {
        await api.getFirstInfo({ "workId": id }).then(d => {
          if (d.type != "FIRST") {
            this.show = false;
          };
          this.data = d.data;
          this.type = this.data.typeStr;
          this.entityName = this.data.mapInfo.entityName;
        });
      },

    },
    data() {
      return {
        workId: this.$route.query.id,
        isShow: this.$route.query.review,
        type_ext: this.$route.query.type_ext,
        tabs: [{
          name: '主体信息', tab: 'info',
        }],
        tab: 'info',
        data: null,
        entityName: "",
        type: "",
        rejectIsShow: false,
        curr: 100,
        remark: '',
      };
    },

  };
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