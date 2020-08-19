<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info" style="top: 40px">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info" style="margin-left: 220px; margin-bottom: 50px;">
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="三小名称:">
                <span>{{cfda.entityName}}</span>
              </el-form-item>
              <el-form-item label="备案号:" v-if="cfda.entityType != 'VENDORS'">
                <span>{{cfda.backupNo}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="三小备案日期:">
                <span>{{cfda.recordBegin}}</span>
              </el-form-item>
              <el-form-item label="三小备案有效期:" v-if="cfda.entityType != 'VENDORS'">
                <span>{{cfda.recordEnd}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="统一社会信用代码:" v-if="cfda.entityType != 'VENDORS'">
                <span>{{cfda.creditCode}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="许可证状态(主体状态):">
                <span>{{cfda.licState}}</span>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 经营者信息 -->
        <toggle-form title="经营者信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营者姓名:">
                <span>{{cfda.corpName}}</span>
              </el-form-item>
              <el-form-item label="手机号:">
                <span>{{cfda.mobile}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="身份证号:">
                <span>{{cfda.idNo}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="户籍地址:">
                <span>{{cfda.censusReg}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="通讯地址:">
                <span>{{cfda.address}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营形态:" prop="">
                <span>{{cfda.mngType}}</span>
              </el-form-item>
              <el-form-item label="从业人数:" prop="">
                <span>{{cfda.empNumber}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="风险等级:">
                <span>{{cfda.riskRank}}</span>
              </el-form-item>
              <el-form-item label="量化等级:">
                <span>{{cfda.quanLevel}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经营状态:">
                <span>{{cfda.manageState}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="cfda.entityType == 'CFDARESTAURANT' || cfda.entityType == 'SALE'">
              <el-form-item label="主营项目:">
                {{cfda.projectMain}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.entityType == 'CFDARESTAURANT' || cfda.entityType == 'SALE'">
              <el-form-item label="兼营项目:">
                {{cfda.projectSid}}
              </el-form-item>
            </div>

            <div class="row" v-if="cfda.entityType == 'WORKSHOP'">
              <el-form-item label="生产形式:">
                {{cfda.prodForm}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.entityType == 'WORKSHOP'">
              <el-form-item label="生产类别:">
                {{cfda.prodType}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.entityType == 'WORKSHOP'">
              <el-form-item label="品种明细:">
                {{cfda.prodVariety}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.entityType == 'VENDORS'">
              <el-form-item label="食品销售:">
                {{cfda.foodSales}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.entityType == 'VENDORS'">
              <el-form-item label="食品制售:">
                {{cfda.foodProd}}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="详细经营信息:">
                {{cfda.detailedEngage}}
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 场地信息 -->
        <toggle-form title="场地信息" v-if="cfda.entityType != 'VENDORS'">
          <div class="content">
            <div class="row">
              <el-form-item label="场地信息:">
                <span>{{cfda.spaceNature}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.spaceNature == '租赁'">
              <el-form-item label="房东名字:">
                <span>{{cfda.landlordName}}</span>
              </el-form-item>
              <el-form-item label="手机号:">
                <span>{{cfda.landlordPhone}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="场所分布:">
                <span>{{cfda.spaceDst}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="经营场所面积:">
                <span>{{cfda.spaceArea}} m²</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="场所地址:">
                <span>{{cfda.spaceAddr}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="实际经营地址:">
                <span>{{cfda.realityAddr}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>


        <toggle-form title="场地信息" v-if="cfda.entityType == 'VENDORS'">
          <div class="content">
            <div class="row">
              <el-form-item label="摊贩类型:">
                <span>{{cfda.pedlarTypeStr}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="场所分布:" v-if="cfda.pedlarType != 'FLOW'">
                <span>{{cfda.spaceDst}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.pedlarType == 'FLOW'">
              <el-form-item label="经营区域:">
                <span>{{cfda.placeBiz}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.pedlarType == 'FIXE'">
              <el-form-item label="加工地址:">
                <span>{{cfda.placeWork}}</span>
              </el-form-item>
              <el-form-item label="经营区域:">
                <span>{{cfda.placeBiz}}</span>
              </el-form-item>
              <el-form-item label="经营时间:">
                <span>{{cfda.placeTimeBegin}}</span> 到 <span>{{cfda.placeTimeEnd}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实">
          <div class="content mb60">
            <div class="row">
              <el-form-item label="所属食药所:">
                <span>{{cfda.syjDeptName}}</span>
              </el-form-item>
              <el-form-item label="所在网格:">
                <span>{{cfda.gridDeptName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管人员:">
                <span>{{cfda.soRealName}}</span>
              </el-form-item>
              <span style="margin-left:49px;color:#48576a;">监管人员联系方式:</span>
              <span>{{cfda.soPhoneNumber}}</span>
            </div>
            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{cfda.infoAssiRealName}}</span>
                <span style="margin-left:132px;color:#48576a;">网格信息员联系方式:</span>
                <span>{{cfda.infoAssiPhoneNumber}}</span>
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
  import { review, del } from 'api/cfda/import'

  export default {
    components: {
      ToggleForm,
    },
    props: {
      cfda: Object
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
          ids.push(this.cfda.id)
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
          ids.push(this.cfda.id)
          review(ids).then(r => {
            if (r.status) {
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
      margin-top: 66px;
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
  .mb60{
    margin-bottom: 60px;
  }
</style>