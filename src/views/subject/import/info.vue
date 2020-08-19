<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
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
              <el-form-item label="统一社会信用代码:">
                <span>{{data.creditCode ? data.creditCode : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经营者姓名:">
                <span>{{data.legalPerson ? data.legalPerson : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="主体工商状态:">
                <span>{{data.creditTypeStr ? data.creditTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可备案号:">
                <span>{{data.licence ? data.licence : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="有效期:">
                <span>{{data.licBegin}} - {{data.licEnd}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可证状态(主体状态):">
                <span>{{data.licStateStr ? data.licStateStr : '暂无'}}</span>
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
              <el-form-item label="负责人联系电话:">
                <span>{{data.mobile ? data.mobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="负责人身份证:">
                <span>{{data.idNo ? data.idNo : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="负责人住所:">
                <span>{{data.address ? data.address : '暂无'}}</span>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="风险等级:">
                <span>{{data.riskRankStr ? data.riskRankStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="量化等级:">
                <span>{{data.quanLevelStr ? data.quanLevelStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经营面积:">
                <span>{{data.spaceArea ? data.spaceArea : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="场所分布:">
                <span>{{data.spaceDstStr ? data.spaceDstStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经营场所:">
                <span>{{data.spaceAddr ? data.spaceAddr : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{data.realityAddr ? data.realityAddr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="从业人数:">
                <span>{{data.empNumber ? data.empNumber : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="主体业态:">
                <span>{{data.subTypeStr ? data.subTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="data.entityType === 'RESTAURANT'">
              <el-form-item label="监管类型:">
                <span>{{data.superviseTypeStr ? data.superviseTypeStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="网络经营:">
                <span>{{data.networkOperationStr ? data.networkOperationStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经济性质:">
                <span>{{data.econTypeStr ? data.econTypeStr : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="营业状态:">
                <span>{{data.manageStateStr ? data.manageStateStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="data.entityType == 'PRODUCT'">
              <el-form-item label="经营类别:">
                <span style="max-width:380px;">{{data.operTypeStr ? data.operTypeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="data.entityType == 'PRODUCT'">
              <el-form-item label="经营明细:">
                <span style="max-width:380px;">{{data.operDetailStr ? data.operDetailStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="data.entityType == 'CIRCULATION' || data.entityType == 'RESTAURANT'">
              <el-form-item label="经营项目:">
                <span style="max-width:380px;">{{data.operProStr ? data.operProStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="详细经营信息:">
                <span style="max-width:380px;">{{data.detailedEngageStr ? data.detailedEngageStr : '暂无'}}</span>
              </el-form-item>
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

            <div class="row">
              <el-form-item label="第一责任人:">
                <span>{{data.firstPl ? data.firstPl : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="第一责任人联系方式:">
                <span>{{data.firstPlTel ? data.firstPlTel : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="管理人员:">
                <span>{{data.manager ? data.manager : '暂无'}}</span>
              </el-form-item>

              <el-form-item label="管理人员联系方式:">
                <span>{{data.managerTel ? data.managerTel : '暂无'}}</span>
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
  import { review, del } from 'api/sub/import'

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
        slideIndex: -1,
        licenceno: {},
        // 左边悬浮栏的数据
        progress: [
          { title: '基础信息', },
          { title: '负责人信息', },
          { title: '经营信息', },
          { title: '责任落实', },
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
      >li {
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