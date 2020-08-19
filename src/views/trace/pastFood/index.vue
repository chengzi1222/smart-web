<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>过期预警</span>
    </div>
    <div class="selBox">
      <el-input placeholder="采购单位名称" class="w260 seekIpt mr10" v-model="transferData.buyerName" @keyup.enter.native="selChange">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="selChange"></i>
      </el-input>
      <el-select class="w130 mr10" @change="selChange" v-model="transferData.areaId" placeholder="所属区域" v-if="$route.query.source == '4k' || $store.state.common.user.areaCode.length < 6">
        <el-option v-for="item in areaIdLis" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select class="w130 mr10" v-model="transferData.scType" @change="selChange" placeholder="办学类型">
        <el-option v-for="item in patternLis" :key="item.value" class="w140" :label="item.type" :value="item.key"></el-option>
      </el-select>
      <el-select class="w130 mr10" v-model="transferData.schoolType" placeholder="学校类型" @change="selChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="num" v-if="this.rourtParams">
      <h2 class="titName">预警数量： <span style="color: #FA503B;">{{tatol ?tatol :0 }}</span></h2>
    </div>
    <div>
      <el-table :data="dataPage" class="table-div r30 allDown movePoin" v-loading="lodings" @sort-change="hChange" @row-click="goInfo">
        <el-table-column show-overflow-tooltip min-width="20" label="序号">
          <template slot-scope="scope">
            {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="left" prop="buyerName" label="采购单位" min-width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="person" label="责任人" min-width="40"></el-table-column>
        <el-table-column show-overflow-tooltip prop="tel" label="联系方式" min-width="40"></el-table-column>
        <el-table-column show-overflow-tooltip prop="scType" label="办学类型" min-width="30"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" label="所属区域" min-width="40"></el-table-column>
        <el-table-column show-overflow-tooltip label="预警商品" align="left" prop="pdts" min-width="80">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="预警数" min-width="50" sortable='custom'>
          <template slot-scope="scope">
            <span class="color2">{{scope.row.waring}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="waringDate" label="最新预警日期" min-width="80" sortable='custom'></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.totalRecords" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as plan from "api/trace/pastFood"
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  import config from "utils/config";
  import { getArea } from "api/trace/analyzeInfoYb"
  export default {
    methods: {
      //转换参数类型，请求检测批次分页
      gettransferData() {
        this.lodings = true;
        let form = new FormData();
        form.append('buyerName', this.transferData.buyerName);
        form.append('areaId', this.transferData.areaId);
        form.append('scType', this.transferData.scType);
        form.append('schoolType', this.transferData.schoolType);
        form.append('status', this.transferData.status);
        form.append('pageSize', this.transferData.pageSize);
        form.append('pageNumber', this.transferData.pageNumber);
        form.append('sortCol', this.transferData.sortCol);
        form.append('sortWay', this.transferData.sortWay);
        plan.postList(form).then(d => {
          this.dataPage = d.data;
          this.pageObj = d.pageObj;
          this.lodings = false;
          this.down();
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.transferData.pageNumber = num;
        this.gettransferData();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.transferData.pageSize = size;
        this.gettransferData();
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
      postTotal() {
        let params = new FormData();
        params.append('status', 'WARING');
        params.append('areaId', this.transferData.areaId);
        params.append('scType', this.transferData.scType);
        params.append('schoolType', this.transferData.schoolType);
        plan.postTotal(params).then(r => {
          this.tatol = r.data;
        })
      },
      hChange(column, prop, order){
        if (column.column.label == "预警数") {
          this.transferData.sortCol = 'waring';
        } else if(column.column.label == "最新预警日期"){
          this.transferData.sortCol = 'waringDate';
        }
        
        if (column.column.order == "descending") {
          this.transferData.sortWay = 'DESC';
        } else if (column.column.order == "ascending") {
          this.transferData.sortWay = 'ASC';
        }
        this.gettransferData();
      },
      goInfo(row){
        this.$router.push({
          name: 'yb.pastList',
          query: row          
        })
      },
      selChange(){
        this.gettransferData();
        this.postTotal()
      }
    },
    mounted() {
      if (this.$route.query.source == '4k') {
        this.transferData.areaId = '5101';
        this.$store.dispatch('getMenus', 'FOOD');
        if (this.$route.query.buyerName) {
          this.transferData.buyerName = this.$route.query.buyerName
        }
      }else {
        this.transferData.areaId = this.$store.state.common.user.areaCode
      }
      let form = new FormData();
      form.append('areaId', this.transferData.areaId);
      getArea(form).then(d => {
        this.areaIdLis = d.data;
      })
      this.postTotal()
      this.gettransferData();
      // this.down();
    },
    data() {
      return {
        rourtParams: {},
        transferData: {
          buyerName: '',
          areaId: '',
          scType: '',
          schoolType: '',
          status: 'WARING',
          pageSize: 10,
          pageNumber: 1,
          sortCol: '',
          sortWay:''
        },
        dataPage: null,
        detailsdata: {},
        pageObj: {
          pageNumber: 1,
          pageSize: 10,
          totalRecords: 0,
          totalPages: 0,
        },
        detaildata: {},
        derive: '',
        lodings: true,
        patternLis: [{
          type: '全部办学类型',
          key: ''
        }, {
          type: '公立',
          key: 'PUBLIC'
        }, {
          type: '私立',
          key: 'PRIVATE'
        }],
        options: [{
          value: '',
          label: '全部学校类型'
        }, {
          value: 'KINDSC',
          label: '幼儿园'
        }, {
          value: 'PRISC',
          label: '小学'
        }, {
          value: 'MIDSC',
          label: '初中'
        }, {
          value: 'HIGSC',
          label: '高中'
        }, {
          value: 'UNVSC',
          label: '大学'
        }, {
          value: 'other',
          label: '其他学校'
        }],
        areaIdLis: [],
        tatol:0
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
  }
  .titName {
    font-size: 18px;
    color: #393939;
    line-height: 34px;
    font-weight: 100;
    float: left;
  }
  .num {
    font-size: 18px;
    color: #A2AAB6;
    margin: 20px 0;
    overflow: hidden;
  }
  .num p {
    float: left;
  }
  .color2 {
    color: #FA503B;
  }
</style>