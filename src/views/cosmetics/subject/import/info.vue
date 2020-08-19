<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress"
            :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info" style="margin-left:220px;">
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:">
                <span>{{data.entityName ? data.entityName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="社会统一信用代码:">
                <span>{{data.creditCode ? data.creditCode : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="法人姓名:">
                <span>{{data.legalPerson ? data.legalPerson : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:">
                <span>{{data.backupNo ? data.backupNo : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="许可证状态(主体状态):">
                <span>{{data.backupState ? data.backupState : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期:">
                <span>{{data.recordBegin ? data.recordBegin : '暂无'}}</span>
                -
                <span>{{data.recordEnd ? data.recordEnd : '暂无'}}</span>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 负责人信息 -->
        <toggle-form title="负责人信息">
          <div class="content">
            <div class="row">
              <el-form-item label="负责人:">
                <span>{{data.corpName ? data.corpName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="手机号:">
                <span>{{data.corpMobile ? data.corpMobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="身份证号:">
                <span>{{data.idNo ? data.idNo : '暂无'}}</span>
              </el-form-item>
              <el-form-item  label="质量负责人:">
                <span>{{data.qualityPerson ? data.qualityPerson : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="风险等级:">
                <span>{{data.riskRank ? data.riskRank : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="量化等级:">
                <span>{{data.quanLevel ? data.quanLevel : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="注册经营地址:">
                <span>{{data.registerAddr ? data.registerAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{data.realityAddr ? data.realityAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div v-if="data.entityType === 'MEDICINE_MANAGER'" class="row">
              <el-form-item label="机构类型:">
                <span>{{data.organizationType ? data.organizationType : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="经营方式:">
                <span>{{data.manageWay ? data.manageWay : '暂无'}}</span>
              </el-form-item>
            </div>

            <div v-if="data.entityType === 'MEDICINE_MANAGER'" class="row">
              <el-form-item label="药品企业类型:">
                <span>{{data.enterpriseType ? data.enterpriseType : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="连锁类型:">
                <span>{{data.chainType ? data.chainType : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="营业状态:">
                <span>{{data.manageState ? data.manageState : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="企业形态:">
                <span>{{data.enterpriseForm ? data.enterpriseForm : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <div class="row">
                <el-form-item :label="text1">
                  <span>{{data.manageRange ? data.manageRange : '暂无'}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item :label="text2">
                  <span>{{data.manageType ? data.manageType : '暂无'}}</span>
                </el-form-item>
              </div>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实" class="mb90">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:">
                <span>{{data.syjName ? data.syjName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="所在网格:">
                <span>{{data.gridName ? data.gridName : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="监管人员:">
                <span>{{data.soName ? data.soName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="监管人员联系方式:">
                <span>{{data.soPhone ? data.soPhone : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{data.infoAssiName ? data.infoAssiName : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="信息员联系方式:">
                <span>{{data.infoAssiPhone ? data.infoAssiPhone : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
    </div>
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button type="primary" style="width:120px;" @click="del">删除</el-button>
        <el-button type="primary" @click="review">提交审核</el-button>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import {review, del} from 'api/cosmetics/importentity'

  export default {
    components: {
      ToggleForm,
    },
    props: {
      data: Object
    },
    mounted() {
      scroll.call(this, 'slideIndex');
    },
    watch: {
      'data.entityType'(val){
        this.data.entityType=val;
        if (this.data.entityType === 'COSMETIC_PRODUCT') {
          this.text1 = '生产范围：'
          this.text2 = '详细生产信息：'
        }
      }
    },
    methods: {
      goBack() {
        this.$emit('back')
      },
      del() {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(this.data.id)
          del(ids).then(r => {
            this.$message.success("删除成功")
            this.$emit('back')
          })
        })
      },
      review() {
        this.$confirm('是否确认审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(this.data.id)
          review(ids).then(r => {
            if (r.data.error === 0) {
              this.$message.success("审核成功")
            } else {
              this.$message.warning("审核失败，原因：" + r.data.message)
            }
            this.$emit('back')
          })
        })
      }
    },
    data() {
      return {
        text1: '经营范围：',
        text2: '详细经营信息：',
        slideIndex: -1,
        licenceno: {},
        // 左边悬浮栏的数据
        progress: [
          {title: '基础信息',},
          {title: '负责人信息',},
          {title: '经营信息',},
          {title: '责任落实',},
        ],
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 左边悬浮信息栏的样式 start
  $c: #0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: 100px;
    // z-index: 2;

    .head-block {
      background: #f2f5f8;
      height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      margin-top: 20px;
      // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      > li {
        border-right: 2px solid #ebf1f5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #f2f5f8;
        }
        .right {
          color: #a2aab6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c;
        }
      }
    }
  }

  .right-info {
    width: 100%;
  }

  .right-info .nav .el-button {
    border: 0px;
  }
</style>
