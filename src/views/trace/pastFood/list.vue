<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>预警商品列表</span><Back v-show="$route.query.source != '4k'"></Back>
    </div>
    <div class="dataBox">
      <div class="collect">
        <h3 style="font-size: 28px;">{{$route.query.waring ? $route.query.waring : '暂无' }}</h3>
        <p>预警数量</p>
      </div>
      <div class="dining">
        <div>
          <h3 class="spaceNowrap" style="width: 100%;">{{$route.query.buyerName ? $route.query.buyerName : '暂无' }}</h3>
          <p>采购单位</p>
        </div>
        <div>
          <h3>{{$route.query.person ? $route.query.person : '暂无' }}</h3>
          <p>责任人</p>
        </div>
        <div>
          <h3>{{$route.query.tel ? $route.query.tel : '暂无' }}</h3>
          <p>联系方式</p>
        </div>
        <div>
          <h3>{{$route.query.scType ? $route.query.scType : '暂无' }}</h3>
          <p>办学类型</p>
        </div>
        <div>
          <h3>{{$route.query.areaName ? $route.query.areaName : '暂无' }}</h3>
          <p>所属区域</p>
        </div>
      </div>
    </div>
    <div class="selBox">
      <el-input placeholder="预警商品名称" class="w200 seekIpt mr10" v-model="transferData.pdtName" @keyup.enter.native="details">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="details"></i>
      </el-input>
    </div>
    <div>
      <el-table :data="dataPage" class="table-div r30 allDown" v-loading="lodings">
        <el-table-column type="selection" min-width="20"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="20" label="序号">
          <template slot-scope="scope">
            {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="pdtName" label="预警商品" min-width="50" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="buyDate" label="采购日期" min-width="40"></el-table-column>
        <el-table-column show-overflow-tooltip prop="supplierName" label="供货商" min-width="40" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dlrName" label="配送商" min-width="30" align="left"></el-table-column>
        <el-table-column show-overflow-tooltip label="告警类型" min-width="50">
          <template slot-scope="scope">
            <span class="color2">{{scope.row.waringType}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="过期日期" min-width="50">
          <template slot-scope="scope">
            <span class="color2">{{scope.row.expireDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="50" label="操作">
          <template slot-scope="scope">
            <span style="color: #1787AD;" @click="remo(scope.row.orderGuid)">订单详情</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.totalRecords" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1" v-show="$route.query.source != '4k'">
      <div>
        <el-button style="width:100px;" @click="back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as plan from "api/trace/pastFood"
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  import config from "utils/config";
  export default {
    methods: {
      //页数改变
      pagecCurrentChange(num) {
        this.transferData.pageNumber = num;
        this.details();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.transferData.pageSize = size;
        this.details();
      },
      //转换参数类型，请求检测详情数据
      details(row) {
        this.lodings = true
        let form = new FormData(); 
        form.append('deptCode', this.$route.query.deptCode);
        form.append('pdtName', this.transferData.pdtName);
        form.append('pageSize', this.transferData.pageSize);
        form.append('pageNumber', this.transferData.pageNumber);
        plan.postDetail(form).then(d => {
          this.lodings = false
          this.dataPage = d.data;
          this.pageObj = d.pageObj;
        })
        // this.down();
      },
      elseDown() {
        this.$message({
          message: '暂无数据可导出',
          type: 'warning'
        });
      },
      down() {
        this.derive = encodeURI(config.Derive + 'govapi/detec/exportDetail?isSeller=' + this.transferData.pattern + '&type=' + this.rourtParams.type + '&sellerCode=' + this.rourtParams.sellerCode + '&date=' + this.rourtParams.date);
      },
      back() {
        this.$router.go(-1);
      },
      remo(orderGuid){
        this.$router.push({
          name: 'yb.detaillis',
          query:{
            Orderguid: orderGuid
          }
        })
      }
    },
    mounted() {
      this.details();
      if (this.$route.query.source == '4k') {
        this.$store.dispatch('getMenus', 'FOOD');
      }
    },
    data() {
      return {
        rourtParams: {},
        dataPage: null,
        pageObj: {
          pageNumber: 1,
          pageSize: 10,
          totalRecords: 0,
          totalPages: 0,
        },
        derive: '',
        lodings: true,
        transferData: {
          pdtName:'',
          pageSize: 10,
          pageNumber: 1
        },
      };
    },
    components: {
      Back
    }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    position: relative;
  }
  .selBox {
    margin: 20px 0;
  }
  .dc {
    float: right;
  }
  .table-div {
    margin: 20px 0;
    text-align: center;
  }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 70px;
  }
  .color2 {
    color: #FA503B;
  }
  .dataBox{
      display: flex;
      margin: 20px 0;
      justify-content: space-between;
  }
  .dataBox div{
      height: 90px;
      text-align: center;
      border: 1px solid #C2CAD2;
  }
  .dataBox h3{
      font-size: 14px;
      color: #3B3B3B;
      margin-top: 14px;
      line-height: 35px;
  }
  .dataBox p{
      font-size: 14px;
      color: #A2AAB6;
  }
  .collect{
      width: 20%;
  }
  .dining{
      width: 75%;
      display: flex;
      justify-content: space-between;
  }
  .dining div{
      border: none;
      width: 33.33%;
  }
</style>