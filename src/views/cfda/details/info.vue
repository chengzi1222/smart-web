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
    <div class="right-info">
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="三小名称:">
                <span>{{cfda.entityName}}</span>
              </el-form-item>
              <el-form-item label="备案号:" v-if="cfda.type != 'VENDORS'">
                <span>{{cfda.backupNo}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="三小备案日期:">
                <span>{{cfda.recordBeginStr}}</span>
              </el-form-item>
              <el-form-item label="三小备案有效期:" v-if="cfda.type != 'VENDORS'">
                <span>{{cfda.recordEndStr}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="cfda.type != 'VENDORS'">
              <el-form-item label="统一社会信用代码:" v-if="cfda.type != 'VENDORS'">
                <span>{{cfda.creditCode}}</span>
              </el-form-item>
            </div>


            <div class="row">
              <el-form-item label="许可证状态(主体状态):">
                <span>{{cfda.licStateLabel}}</span>
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 经营者信息 -->
        <toggle-form title="经营者信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营者:">
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
                <span>{{cfda.mngTypeStr}}</span>
              </el-form-item>
              <el-form-item label="从业人数:" prop="">
                <span>{{cfda.empNumber}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="风险等级:">
                <span>{{cfda.riskRankStr}}</span>
              </el-form-item>
              <el-form-item label="量化等级:">
                <span>{{cfda.quanLevelStr}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="经营状态:">
                <span>{{cfda.manageStateLabel}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="cfda.type == 'CFDARESTAURANT' || cfda.type == 'SALE'">
              <el-form-item label="主营项目:">
                <span style="max-width:380px;">{{cfda.projectMainStr}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.type == 'CFDARESTAURANT' || cfda.type == 'SALE'">
              <el-form-item label="兼营项目:">
                {{cfda.projectSidStr}}
              </el-form-item>
            </div>

            <div class="row" v-if="cfda.type == 'WORKSHOP'">
              <el-form-item label="生产形式:">
                {{cfda.prodFormStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.type == 'WORKSHOP'">
              <el-form-item label="生产类别:">
                {{cfda.prodTypeStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.type == 'WORKSHOP'">
              <el-form-item label="品种明细:">
                {{cfda.prodVarietyStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.type == 'VENDORS'">
              <el-form-item label="食品销售:">
                {{cfda.foodSalesStr}}
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.type == 'VENDORS'">
              <el-form-item label="食品制售:">
                {{cfda.foodProdStr}}
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="详细经营信息:">
                {{cfda.detailedEngageStr}}
              </el-form-item>
            </div>

          </div>
        </toggle-form>

        <!-- 场地信息 -->
        <toggle-form title="场地信息" v-if="cfda.type != 'VENDORS'">
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
              <el-form-item label="场所分布:" v-if="cfda.pedlarType != 'FLOW'">
                <span>{{cfda.spaceDstStr}}</span>
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
              <el-form-item label="实际经营地址:" >
                <span>{{cfda.realityAddr}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="场地信息" v-if="cfda.type == 'VENDORS'">
          <div class="content">
            <div class="row">
              <el-form-item label="摊贩类型:">
                <span>{{cfda.pedlarTypeStr}}</span>
              </el-form-item>
            </div>
            <div class="row" v-if="cfda.pedlarType != 'FLOW'">
              <el-form-item label="场所分布:">
                <span>{{cfda.spaceDstStr}}</span>
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
                {{cfda.placeTimeBegin}} 到 {{cfda.placeTimeEnd}}
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实">
          <div class="content">
            <div class="row">
              <el-form-item label="所属食药所:">
                <span>{{cfda.syjStr}}</span>
              </el-form-item>
              <el-form-item label="所在网格:">
                <span>{{cfda.gridName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="监管人员:">
                <span>{{cfda.soName}}</span>
              </el-form-item>
              <el-form-item label="监管人员联系方式:">
                <span>{{cfda.soPhoneNumber}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{cfda.infoAssiName}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:">
                <span>{{cfda.infoAssiPhoneNumber}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 人员信息 -->
        <toggle-form title="人员信息">
          <el-table :data="cfda.emps" style="width: 100%;margin-top:20px;">
            <el-table-column type="index" label="序号" width="120"></el-table-column>
            <el-table-column prop="empName" label="姓名" width="150">
            </el-table-column>
            <el-table-column prop="empIdNo" label="身份证号">
            </el-table-column>
            <el-table-column prop="hasHealthyCardStr" label="有无健康证明">
            </el-table-column>
            <el-table-column prop="healthyCardNo" label="健康证号">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" label="备注">
            </el-table-column>
          </el-table>
        </toggle-form>

        <!-- 附件上传 -->
         <toggle-form title="附件上传 ">
           <attachment-upload-detail style="margin-top: 20px;" :options="options" v-model="cfda.fileList"></attachment-upload-detail>
            </toggle-form>
      </el-form>
    </div>

  </div>
</template>

<script>

import ToggleForm from "components/ToggleForm.vue";
import scroll from "utils/scroll";
import AttachmentUploadDetail from 'components/AttachmentUploadDetail/index';

export default {
  mounted() {
    //滚动效果
    scroll.call(this, 'slideIndex');
  },
  components: {
    ToggleForm,
    AttachmentUploadDetail
  },
  props:{
    cfda:{
      type:Object,
    },
  },
  data() {
    return {
      slideIndex: -1,
//      cfda: {},
      // 左边悬浮栏的数据
      progress: [
        { title: '基础信息', },
        { title: '经营者信息', },
        { title: '经营信息', },
        { title: '场地信息', },
        { title: '责任落实', },
        { title: '人员信息', },
        { title: '附件上传', },
      ],

      options:[
        {
          label:"备案申请书",
          field:"FILING_APPLICATION"
        },
        {
          label:"营业执照副本",
          field:"BUSINESS_LICENSE_COPY"
        },
        {
          label:"场地证明",
          field:"PLACE_PROOF"
        },
        {
          label:"健康证",
          field:"HEALTH_CARD"
        },
        {
          label:"身份证",
          field:"IDENTITY_CARD"
        },
      ],
     /* filePath: "",
      fileList: [],
      imgData:[]*/
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
  margin-top: -20px;
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
// 左边悬浮信息栏的样式 end

.right-info {
  width: 100%;
}

// .content {
//   padding-left: 25%;
//   margin-top: 20px;
// }
</style>
