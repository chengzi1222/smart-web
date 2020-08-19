<!-- 编辑页面 -->
<template>
  <div>
    <!-- 主要内容  -->
    <div>
      <!-- 左边信息悬浮栏 start-->
      <div class="left-info">
        <div class="head-block">
          <ul class="main-block">
            <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
              <p class="floatL left">{{item.title}}</p>
            </li>
          </ul>
        </div>

      </div>
      <!-- 左边信息悬浮栏 end-->

      <!-- 右边表单部分 start-->
      <div class="right-info">

        <!-- 基础信息 -->
        <base-component @getData="getData" :entityType="form.entityType" :handleState="handleState" :initData="form" :natureType="form.natureType"
          ref="prodcut" @validated="validated"></base-component>

        <!-- 负责人信息 -->
        <corp-component @getData="getData" :handleState="handleState" :initData="form" ref="corp" @validated="validated"></corp-component>

        <!--经营信息-->
        <div>
          <!-- 流通 -->
          <circulation-manage-component v-if="form.entityType==='CIRCULATION'" @getData="getData" :handleState="handleState" :initData="form"
            ref="manage" @validated="validated"></circulation-manage-component>
          <!-- 生产 -->
          <product-manage-component v-if="form.entityType==='PRODUCT'" @getData="getData" :handleState="handleState" :initData="form"
            ref="manage" @validated="validated"></product-manage-component>
          <!-- 餐饮  -->
          <restaurant-manage-component v-if="form.entityType==='RESTAURANT'" @getData="getData" :handleState="handleState" :initData="form"
            ref="manage" @validated="validated"></restaurant-manage-component>
        </div>

        <!-- 责任落实 -->
        <duty-component @getData="getData" :handleState="handleState" :initData="form" ref="duty" @validated="validated"></duty-component>

      </div>
      <!-- 右边表单部分 end-->
    </div>
    <!-- 主要内容 end -->
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button type="primary" :disabled="disabledSubmit" @click="submitSub" v-if="chengeType === 'change'">提交审核
        </el-button>
        <el-button type="primary" :disabled="disabledSubmit" @click="reapplySubmitSub" v-if="chengeType === 'reapply'">提交审核
        </el-button>
        <el-button style="width:120px;" @click="backBtn">返回</el-button>
      </div>
    </div>
    <!-- 底部按钮 end-->

    <!-- 信息录入 end -->
  </div>
</template>

<script>
  import scroll from "utils/scroll";
  import CorpComponent from 'views/subject/common/CorpComponent';
  import DutyComponent from 'views/subject/common/DutyComponent';
  import BaseComponent from 'views/subject/common/BaseComponent';
  import CirculationManageComponent from 'views/subject/circulation/common/ManageComponent';
  import ProductManageComponent from 'views/subject/product/common/ManageComponent';
  import RestaurantManageComponent from 'views/subject/restaurant/common/ManageComponent';
  import { getSubInfo } from 'api/sub/sub';
  import { changeInfo, subChange, submitReapply } from 'api/sub/work.js';

  export default {
    props: ["entityId", "workId"],
    components: {
      CorpComponent,
      DutyComponent,
      BaseComponent,
      CirculationManageComponent,
      ProductManageComponent,
      RestaurantManageComponent
    },
    async beforeMount() {
      let workId = this.$route.query.workId;
      let workType;
      if (workId) {
        workType = this.$route.query.workType;
        if (workType.toUpperCase() != 'FIRST') {
          await changeInfo(workId).then((r) => {
            let dataInfo = r.data.afterSubInfo;
            dataInfo.operType = dataInfo.operType ? dataInfo.operType.split(",") : [];
            dataInfo.operDetail = dataInfo.operDetail ? dataInfo.operDetail.split(",") : [];
            dataInfo.operPro = dataInfo.operPro ? dataInfo.operPro.split(",") : [];
            dataInfo.spaceDst = dataInfo.spaceDst ? dataInfo.spaceDst.split(",") : [];
            dataInfo.detailedEngage = dataInfo.detailedEngage ? dataInfo.detailedEngage.split(",") : [];
            dataInfo.natureType = dataInfo.natureType.toUpperCase();
            dataInfo.entityType = dataInfo.entityType.toUpperCase();
            dataInfo.legalPerson = r.data.beforeSubInfo.legalPerson;
            this.form = dataInfo;

            this.disabledSubmit = false;
          });
        }
        this.chengeType = 'reapply';
      } else {
        this.chengeType = 'change';
      }

      if (!workId || (workType && workType.toUpperCase() == 'FIRST')) {
        await getSubInfo(this.entityId).then(res => {
          let dataInfo = res.data;
          dataInfo.operPro = dataInfo.operPro ? dataInfo.operPro.split(",") : [];
          dataInfo.detailedEngage = dataInfo.detailedEngage ? dataInfo.detailedEngage.split(",") : [];
          dataInfo.spaceDst = dataInfo.spaceDst ? dataInfo.spaceDst.split(",") : [];
          dataInfo.operDetail = dataInfo.operDetail ? dataInfo.operDetail.split(",") : [];
          dataInfo.operType = dataInfo.operType ? dataInfo.operType.split(",") : [];
          this.form = dataInfo;

          this.disabledSubmit = false;
        });
      }


    },
    mounted() {
      //滚动效果
      scroll.call(this, 'slideIndex');
    },
    data() {
      return {
        handleState: 'change',//当前操作状态
        entityName: "流通",
        slideIndex: -1,
        chengeType: 'change',//变更类型 {变更/重新申请}

        disabledSubmit: true,

        // 左边悬浮栏的数据
        progress: [
          {
            title: '基础信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '负责人信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '经营信息',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '责任落实',
            successNum: 0,
            totalNum: 0
          },
        ],
        percentage: 0,

        // 表单数据
        form: {
          entityType: '',
          natureType: 'YZYZ',//默认是有证有照
          percentageNumber: 0
        },
      }
    },
    methods: {
      //验证计算
      validated(obj) {
        this.leftCount(obj);
      },
      //获得组件里的数据
      getData(componentData) {
        this.form = Object.assign(this.form, componentData);
        if (this.form.operPro) {
          this.form.operPro = [...new Set(this.form.operPro.concat(this.form.operProMore))];
        }
        if (this.form.operType) {
          this.form.operType = [...new Set(this.form.operType.concat(this.form.operTypeMoreCode))];
        }
      },
      //左边侧边栏计算
      leftCount({ totalNum, successNum, title }) {
        // 更新侧边栏
        for (let i = 0; i < this.progress.length; i++) {
          const objItem = this.progress[i];
          if (objItem.title === title) {
            objItem.totalNum = totalNum;
            objItem.successNum = successNum;
            break;
          }
        }
        let total = 0, success = 0;

        for (let i = 0; i < this.progress.length; i++) {
          let objItem = this.progress[i];
          total += objItem.totalNum;
          success += objItem.successNum;
        }
        this.percentage = ~~(success / total * 100)
      },
      reapplySubmitSub() {
        Promise.all(['prodcut', 'corp', 'manage', 'duty'].map(item => (
          this.$refs[item].submitSub()
        )))
          .then(() => {
            //全部验证通过
            this.form.workId = this.$route.query.workId;
            submitReapply(this.form).then((r) => {
              if (r.status) {
                this.$message({
                  message: '主体重新申请提交成功!',
                  type: 'success'
                });
                this.$router.push({ name: 'mywork.sub', params: { entityType: this.form.entityType.toLowerCase() } });
                return;
              }

              this.$message({
                message: r.message,
                type: 'warning'
              });

            });
          })
          .catch((err) => {
            //至少有一项没有通过
            console.log(err)
            this.$message({
              message: '请输入必填字段!',
              type: 'warning'
            });
          })
      },
      // 提交审核
      submitSub() {
        Promise.all(['prodcut', 'corp', 'manage', 'duty'].map(item => (
          this.$refs[item].submitSub()
        )))
          .then(() => {
            //全部验证通过
            subChange(this.form).then((r) => {
              if (r.status) {
                this.$message({
                  message: '提交审核成功!',
                  type: 'success'
                });
                this.$router.push({ name: 'subject.archives', params: { type: this.form.entityType.toLowerCase() } });
                return;
              }

              this.$message({
                message: r.message,
                type: 'warning'
              });

            });
          })
          .catch((err) => {
            //至少有一项没有通过
            console.log(err)
            this.$message({
              message: '请输入必填字段!',
              type: 'warning'
            });
          })
      },
      backBtn() {
        this.$router.go(-1);
      }
    },
    watch: {
      percentage(val) {
        this.form.percentageNumber = val;
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
    background: #0db5ef;
    color: #fff;
  }

  // 左边悬浮信息栏的样式 start
  $c:#0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: -100px;
    z-index: 2;

    .head-block {
      // background: #F2F5F8;
      // height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      margin-top: 20px; // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      >li {
        border-right: 2px solid #EBF1F5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #F2F5F8;
        }
        .right {
          color: #A2AAB6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c
        }
      }
    }
  }
</style>