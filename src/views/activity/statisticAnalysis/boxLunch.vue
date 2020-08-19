<template>
  <div>
    <el-input placeholder="编号、车牌号、押送人" class="w200 seekIpt" v-model="iptValue" @keyup.native="getPage">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="getPage"></i>
    </el-input>
    <el-select class="w150 ml20" v-model="deliveryState" @change="getPage" placeholder="配送状态" clearable>
      <el-option v-for="item in deliveryLis" :key="item.key" :label="item.name" :value="item.key"></el-option>
    </el-select>
    <el-select class="w150 ml20" v-model="supplier" @change="getPage" placeholder="供应商" clearable>
      <el-option v-for="item in supplierLis" :key="item.entityId" :label="item.entityName" :value="item.entityId"></el-option>
    </el-select>
    <el-select class="w150 ml20" v-model="deliveryDate" @change="getPage" placeholder="配送时间" clearable>
      <el-option v-for="item in deliveryDateLis" :key="item.reportedDate" :label="item.reportedDate" :value="item.reportedDate"></el-option>
    </el-select>
    <el-button @click="getFindBoxReportPageExcel" class="w100 floatR" type="primary">导出</el-button>
    <div class="mt20" style="position: relative;">
      <el-table :data="dataPage" class="table-div" border @sort-change="getPaixu">
        <el-table-column show-overflow-tooltip min-width="50" label="序号" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip prop="no" min-width="80" label="编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="80" label="供应商"></el-table-column>
        <el-table-column show-overflow-tooltip prop="carNo" min-width="80" label="车牌号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" min-width="80" label="押送人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="boxQuantity" min-width="100" label="盒饭数量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reportedMenu" min-width="100" label="菜品种类"></el-table-column>
        <el-table-column show-overflow-tooltip prop="reportedDate" min-width="120" label="填报日期"></el-table-column>
        <el-table-column show-overflow-tooltip prop="departTime" min-width="120" label="出发时间" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip prop="examineTime" min-width="120" label="检查时间" sortable="custom"></el-table-column>
        <el-table-column show-overflow-tooltip prop="stateStr" min-width="80" label="配送状态"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="150" label="操作">
          <template slot-scope="scope">
            <span @click="info(scope.row)">详情</span>
            <span @click="showChange(scope.row)">修正</span>
            <span v-if="scope.row.recordTotal > 0" @click="toInfo(scope.row.examineId)">检查记录</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box mt20" style="text-align: right">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>

    <!-- 弹框start -->
    <yb-popup @close="popShow = false;" :isShow="popShow" title="配送详情" width="780">
      <div slot="body">
        <el-form label-width="120px" class="demo-ruleForm">
          <div class="content">
            <div class="row">
              <el-form-item label="编号:">
                <span>{{infoData.NO}}</span>
              </el-form-item>
              <el-form-item label="供应商:">
                <span>{{infoData.entityName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="车牌号:">
                <span>{{infoData.carNo}}</span>
              </el-form-item>
              <el-form-item label="押送员:">
                <span>{{infoData.userName}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="押送员身份证:">
                <span>{{infoData.userNo}}</span>
              </el-form-item>
              <el-form-item label="填报日期:">
                <span>{{infoData.reportedDate}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="加工时间:">
                <span>{{infoData.processTime}}</span>
              </el-form-item>
              <el-form-item label="出发时间:">
                <span>{{infoData.departTime}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="送达时间:">
                <span>{{infoData.arriveTime}}</span>
              </el-form-item>
              <el-form-item label="检查时间:">
                <span>{{infoData.examineTime}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="盒饭数量:">
                <span>{{infoData.boxQuantity}}</span>
              </el-form-item>
              <el-form-item label="状态:">
                <span>{{infoData.stateStr}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="配送菜品:" class="wAll">
                <span class="oS">{{infoData.reportedMenu}}</span>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button @click="popShow=false">取消</el-button>
      </div>
    </yb-popup>
    <!--弹框 end -->

    <!-- 弹框start -->
    <yb-popup @close="popShow_num = false;" :isShow="popShow_num" title="配送详情" width="780">
      <div slot="body">
        <el-form label-width="120px" class="demo-ruleForm">
          <div class="content">
            <div class="row">
              <el-form-item label="盒饭数量:">
                <el-input class="w200 seekIpt" v-model="updateRow.boxQuantity" @keyup.native="onlyNum" @change="onlyNum"></el-input>
                <span v-if="error" style="color: red; font-size: 12px;">请输入正整数</span>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button @click="changeBoxQuantity">确定</el-button>
        <el-button @click="popShow_num=false">取消</el-button>
      </div>
    </yb-popup>
  </div>
</template>

<script>
  import YbPopup from 'components/ybpopup/YbPopup';
  import * as plan from 'api/activity/anaylze'
  import { downloadFile } from 'api/common';

  export default {
    props: {
      id: {
        type: String
      }
    },
    methods: {
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getPage();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPage();
      },
      getStatus() {
        plan.getStatus(['com.ybveg.govx.enums.active.ActiveBoxReportedStateEnum']).then(r => {
          this.deliveryLis = r.data
        })
      },
      getFindBoxReportPageExcel() {
        let params = {
          search: this.iptValue,
          state: this.deliveryState,
          entityId: this.supplier,
          reportedDate: this.deliveryDate
        }
        plan.getFindBoxReportPageExcel(this.id, params).then(r => {
          downloadFile(r.data, '盒饭出厂记录');
        });
      },
      getListDate() {
        plan.getListDate(this.id).then(r => {
          this.deliveryDateLis = r.data
        })
      },
      getListEntityByType() {
        plan.getListEntityByType(this.id).then(r => {
          this.supplierLis = r.data
        })
      },
      getPaixu() {
        if (arguments[0].prop == 'departTime') {
          if (arguments[0].order == "descending") {
            this.departTimeSort = 'DESC'
          } else if (arguments[0].order == "ascending") {
            this.departTimeSort = 'ASC'
          }
        } else if (arguments[0].prop == 'examineTime') {
          if (arguments[0].order == "descending") {
            this.departTimeSort = 'DESC'
          } else if (arguments[0].order == "ascending") {
            this.departTimeSort = 'ASC'
          }
        }
        this.getPage()
      },
      getPage() {
        this.lodings = true;
        let params = {
          search: this.iptValue,
          state: this.deliveryState,
          entityId: this.supplier,
          reportedDate: this.deliveryDate,
          departTimeSort: this.departTimeSort,
          examineTimeSort: this.examineTimeSort
        }
        plan.getBoxreportList(this.id, this.page.pageNum, this.page.pageSize, params).then(r => {
          this.dataPage = r.data.list;
          this.page.total = r.data.total;
          this.lodings = false;
        })
      },
      info(row) {
        plan.getFindDetailById(row.id).then(r => {
          if (r.status) {
            this.popShow = true;
            this.infoData = r.data;
          }
        })
      },
      toInfo(examineId) {
        this.$router.push({ name: 'boxLunch.info', query: { 'examineId': examineId } })
      },
      onlyNum() {
        debugger
        this.updateRow.boxQuantity = this.updateRow.boxQuantity.replace(/\D+/g, '');
      },
      //修正显示弹框
      showChange(row) {
        this.popShow_num = true;
        this.updateRow.id = row.id;
        this.updateRow.boxQuantity = row.boxQuantity;
        this.updateRow.examineId = row.examineId;
      },
      //修正
      changeBoxQuantity() {
        let params = this.updateRow;
        plan.update(params).then(r => {
          if (r.status) {
            this.popShow_num = false;
            this.$message.success('修正成功!');
            this.getPage();
          }
        })
      }
    },
    mounted() {
      this.getStatus();
      this.getListDate();
      this.getListEntityByType();
      this.getPage()
    },
    data() {
      return {
        iptValue: '',
        deliveryState: '',
        supplier: '',
        deliveryDate: '',
        deliveryLis: [],
        supplierLis: [],
        deliveryDateLis: [],
        lodings: true,
        dataPage: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        popShow: false,
        infoData: {},
        examineTimeSort: '',
        departTimeSort: '',
        popShow_num: false,
        updateRow: {
          id: "",
          boxQuantity: "",
          examineId: "",
        }
      };
    },
    components: {
      YbPopup
    }
  }
</script>

<style scoped lang="sass">
  .oS {
    display: inline-block;
    max-height: 160px;
    overflow: auto;
  }
</style>