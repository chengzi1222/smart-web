<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>索票索证</span>
    </div>
    <div class="selBox">
        <el-input placeholder="主体名称" class="w260 seekIpt mr10" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <el-select v-model="subTypeSel" clearable placeholder="主体类型" @change="subTypeChange" class="w130">
            <el-option v-for="item in options" :key="item.listKey" :label="item.listValue" :value="item.listKey">
            </el-option>
        </el-select>
    </div>
    <div>
      <el-table :data="dataPage" class="table-div r30 allDown movePoin" v-loading="lodings">
        <el-table-column show-overflow-tooltip width="60" align="left" label="序号">
          <template slot-scope="scope">
            {{(pageObj.pageSize * (pageObj.pageNum - 1) + scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="buyerName" label="主体名称" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.buyerName?scope.row.buyerName:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="buyerTypeString" label="类型" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.buyerTypeString?scope.row.buyerTypeString:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" label="责任人" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.legalPerson?scope.row.legalPerson:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="tel" label="手机号" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.tel?scope.row.tel:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="100">
            <template slot-scope="scope">
                <span>{{scope.row.address?scope.row.address:'-'}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="" label="操作" min-width="100">
            <template slot-scope="scope">
                <router-link :to="{name: 'yb.ticket.detail',query: {buyerCode: scope.row.buyerCode, buyerName: scope.row.buyerName}}" type="primary">索票索证</router-link>
            </template>
        </el-table-column>
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
  import * as ticket from "api/trace/ticket"
  import Back from 'utils/back.vue'       //返回上一个页面按钮
  import { getArea } from "api/trace/analyzeInfoYb"
  export default {
        data() {
            return {
                keyWord: '',
                lodings: false,
                subTypeSel: '',
                options: [],
                dataPage: [],
                pageObj: {
                    pageNum: 1,
                    pageSize: 10,
                    totalRecords: 0,
                    totalPages: 0,
                }
            }
        },
        computed: {
            queryParams: function() {
                return {
                    buyerType: this.subTypeSel,
                    buyerName: this.keyWord,
                    areaId: this.$store.state.common.user.areaCode, 
                    pageNumber: this.pageObj.pageNum, 
                    pageSize: this.pageObj.pageSize 
                }
            }
        },
    methods: {
        // 搜索
        search() {
            this.pageObj.pageNum = 1;
            this.refreshTable();
        },
        subTypeChange(val) {
            this.pageObj.pageNum = 1;
            this.refreshTable();
        },
        // 获取主体类型
        getSubType() {
            ticket.getSubType().then(r => {
                if(r.code === 200) {
                    this.options = r.data;
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        },
        // 请求列表数据
        refreshTable() {
            this.lodings = true;
            ticket.getTicket(this.queryParams).then(r => {
                if(r.code === 200) {
                    this.dataPage = r.data;
                    this.pageObj.totalRecords = r.pageObj.totalRecords;
                    this.lodings = false;
                } else {
                    this.$message.error(r.msg);
                }
            }).catch(e => {})
        },
         //页数改变
        pagecCurrentChange(num) {
            this.pageObj.pageNum = num;
            this.refreshTable();
        },
        //每页数量改变
        pageSizeChange(size) {
            this.pageObj.pageNum = 1;
            this.pageObj.pageSize = size;
            this.refreshTable();
        }
    },
    mounted() {
        this.getSubType();
        this.refreshTable();
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
  .table-div {
    margin: 20px 0;
    text-align: center;
  }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

</style>