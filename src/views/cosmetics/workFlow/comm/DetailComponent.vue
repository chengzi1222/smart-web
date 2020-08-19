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
      <!-- <div class="no-star">
        <div class="form-item">
          <ul class="clearfix nav">
            <li v-for="item in licenceno" :key="item.bizId" class="floatL" style="margin-right:10px;" @click="licenceToDetail(item)">
              <el-button>{{item.licenceTypeStr}}</el-button>
            </li>
          </ul>

        </div>
      </div> -->
      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="主体名称:">
                <span>{{data.entityName ? data.entityName : '暂无'}}</span>
              </el-form-item>
              <span>
                <el-form-item label="统一社会信用代码:">
                  <span>{{data.creditCode ? data.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            
            <div class="row">
              <el-form-item label="法人姓名:">
                <span>{{data.legalPerson ? data.legalPerson : '暂无'}}</span>
              </el-form-item>
            </div>

            <span v-if="entryType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <div class="row">
                <el-form-item label="许可备案号:">
                  <span>{{data.backupNo ? data.backupNo : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="许可证状态(主体状态):">
                  <span>{{data.backupStateStr ? data.backupStateStr : '暂无'}}</span>
                </el-form-item>
              </div>
            </span>

            <span v-if="entryType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <div class="row">
                <el-form-item label="有效期:">
                  <span>{{data.recordBegin ? data.recordBegin : '暂无'}} - {{data.recordEnd ? data.recordEnd : '暂无'}}</span>
                </el-form-item>
              </div>
            </span>
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
                <span>{{data.corpMobile ? data.corpMobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="负责人身份证:">
                <span>{{data.idNo ? data.idNo : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="质量负责人:">
                <span>{{data.qualityPerson ? data.qualityPerson : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">
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

            <div class="row">
              <el-form-item label="营业状态:">
                <span>{{data.manageStateStr ? data.manageStateStr : '暂无'}}</span>
              </el-form-item>
              <span v-if="entryType != 'production' && entryType != 'COSMETIC_PRODUCT'">
                <el-form-item label="企业形态:">
                  <span>{{data.enterpriseFormStr ? data.enterpriseFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entryType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <el-form-item label="生产范围:">
                <span>{{data.manageScopeStr ? data.manageScopeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="entryType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <el-form-item label="经营范围:">
                <span>{{data.manageScopeStr ? data.manageScopeStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="entryType == 'production' || entryType == 'COSMETIC_PRODUCT'">
              <el-form-item label="详细生产信息:">
                <span>{{data.detailedEngageStr ? data.detailedEngageStr : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row" v-if="entryType != 'production' && entryType != 'COSMETIC_PRODUCT'">
              <el-form-item label="详细经营信息:">
                <span>{{data.detailedEngageStr ? data.detailedEngageStr : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form title="责任落实">
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
                <span>{{data.soMobile ? data.soMobile : '暂无'}}</span>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="网格信息员:">
                <span>{{data.infoAssiName ? data.infoAssiName : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="网格信息员联系方式:">
                <span>{{data.infoAssiMobile ? data.infoAssiMobile : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <toggle-form title="工单操作记录" v-if="isWorkFlow">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <span>工单类型 : {{first == 'FIRST'? '首次':'编辑'}}</span>
          </div>
          <el-table :data="workInfoTable" style="margin-top:20px" class="table-div">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optTypeStr" min-width="100" label="操作类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="stateStr" min-width="100" label="操作结果"></el-table-column>
            <el-table-column show-overflow-tooltip prop="remark" min-width="120" label="操作备注"></el-table-column>
            <el-table-column show-overflow-tooltip prop="realName" min-width="100" label="操作员"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optTime" min-width="100" label="操作日期"></el-table-column>
          </el-table>
        </toggle-form>
      </el-form>
    </div>
  </div>
</template>

<script>

import ToggleForm from "components/ToggleForm.vue";
import scroll from "utils/scroll";
import { getLicenceno } from "api/sub/add";

export default {
  components: {
    ToggleForm,
  },
  props: {
    data: Object,
    workId: String,
    workInfoTable: Array
  },
  mounted() {
    this.entryType = this.$route.query.entityType;
    this.first =  this.$route.query.type;
    if (this.workId) {
      this.isWorkFlow = true;
      this.progress.push({ title: '工单操作记录', });
    }
    scroll.call(this, 'slideIndex');
  },
  watch: {
    data() {
      if (this.data.creditCode && this.data.natureType == 'YZYZ') {
        getLicenceno(this.data.creditCode, '', this.data.natureType).then((results) => {
          this.licenceno = results.data;
          //滚动效果
          // scroll.call(this, 'slideIndex');
        });
      }else{
        this.licenceno = [{licenceTypeStr:this.data.licenceTypeStr, natureType:'',entityType: this.data.entityType,bizId:this.data.id}];
      }
    },
  },
  methods: {
    licenceToDetail(lecence) {
      const id = lecence.bizId;
      if ( id !== this.$route.query.id) {
        this.$router.push({
          name: "subject.archives.detail",
          params: {
            type: lecence.entityType
          },
          query: {
            id
          }
        });
      }
    },
  },
  data() {
    return {
      slideIndex: -1,
      licenceno: {},
      workTableData: [],
      isWorkFlow: false,
      // 左边悬浮栏的数据
      progress: [
        { title: '基础信息', },
        { title: '负责人信息', },
        { title: '经营信息', },
        { title: '责任落实', },
      ],
      entryType:'',
      first:''
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

.right-info {
  width: 100%;
}
.right-info .nav .el-button {
  border: 0px;
}
</style>
