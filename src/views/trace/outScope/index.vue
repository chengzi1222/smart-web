<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>超范围经营预警</span>
    </div>
    <div class="selBox mt20">
      <el-input placeholder="配送商名称" class="w260 seekIpt mr10" v-model="dlrName" @keyup.enter.native="pageObj.pageNumber=1;getWarnPage()">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="pageObj.pageNumber=1;getWarnPage()"></i>
      </el-input>
      <el-select class="w150 ml20" v-model="dealStatus" clearable placeholder="处理状态" @change="pageObj.pageNumber=1;getWarnPage()">
					<el-option label="已处理" value="YES"></el-option>
					<el-option label="未处理" value="NO"></el-option>
				</el-select>
    </div>
    <div class="mt20">
      <el-table :data="dataPage" class="table-div r30 allDown movePoin" v-loading="lodings">
        <el-table-column show-overflow-tooltip min-width="20" label="序号" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dlrName" label="配送商名称" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="legalPerson" label="责任人" min-width="40"></el-table-column>
        <el-table-column show-overflow-tooltip prop="tel" label="手机号" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="hasPdt" label="上架预包装食品" min-width="50">
          <template slot-scope="scope">
            {{scope.row.hasPdt=='YES'?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="营业执照" min-width="50">
          <template slot-scope="scope">
            <span class="movePoin" style="color: #0db5ef;" v-if="scope.row.hasBs == 'YES'" @click="lookImg(scope.row.ossBsLicimg)">有</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="许可证" min-width="50">
          <template slot-scope="scope">
            <span class="movePoin" style="color: #0db5ef;" v-if="scope.row.hasFo == 'YES'" @click="lookImg(scope.row.ossFoodLicense)">有</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="处理状态" min-width="80">
          <template slot-scope="scope">
            {{scope.row.dealStatus=='YES'?'已处理':'未处理'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" @click="getWarnDeal(scope.row.id)" v-if="scope.row.dealStatus=='NO'">处理</a>
            <span v-else>-</span>
            <!-- <a href="javascript:;" @click="goInfo(scope.row)">详情</a> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="pageObj.pageNumber" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.totalRecords" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div class="popupDiv" v-if="popupShow">
      <div class="popupBox">
        <h3>详情<i class="el-icon-close floatR movePoin" style="margin-top: 7px;" @click="popupShow=false"></i></h3>
        <div class="row">
          <span>配送商名称：</span>{{rowInfo.dlrName}}
        </div>
        <div class="row">
          <span>类型：</span>{{rowInfo.type}}
        </div>
        <div class="row">
          <span>负责人：</span>{{rowInfo.legalPerson}}
        </div>
        <div class="row">
          <span>手机号：</span>{{rowInfo.tel}}
        </div>
        <div class="row">
          <span>地址：</span>{{rowInfo.address}}
        </div>
        <div class="row">
          <span>是否上架预包装食品：</span>{{rowInfo.hasPdt}}
        </div>
        <div class="row">
          <span>营业执照：</span>
          <img :src="rowInfo.oss_bsLicimg" width="100" height="80" alt="">
        </div>
        <div class="row">
          <span>许可证：</span>
          <img :src="rowInfo.oss_foodLicense" width="100" height="80" alt="">
        </div>
      </div>
    </div>
    <div class="popupDiv" v-if="imgPopup">
      <div class="popupBox" style="text-align: center;">
        <p style="height: 30px;"><i class="el-icon-close floatR movePoin" style="margin-top: 7px;" @click="imgPopup=false"></i></p>
        <img :src="imgSrc" width="600" height="400" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { getWarnPage, getWarnDeal } from 'api/trace/supervise'
  export default {
    methods: {
      getWarnDeal(id){
        this.$confirm('是否确认已整改？', '处理', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.lodings = true;
          getWarnDeal({ id: id}).then(r=>{
            this.lodings = false;
            if (r.status) {
              this.pageObj.pageNumber = 1;
              this.getWarnPage();
              this.$message.success('处理成功');
            }
          })
        })
      },
      goInfo(row){
        this.popupShow = true;
        this.rowInfo = row;
      },
      lookImg(src){
        this.imgSrc = src;
        this.imgPopup = true;
      },
      //页数改变
      pagecCurrentChange(num) {
        this.pageObj.pageNumber = num;
        this.getWarnPage();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.pageObj.pageSize = size;
        this.getWarnPage();
      },
      getWarnPage(){
        let params = {
          queryName: this.dlrName,
          pageSize: this.pageObj.pageSize,
          pageNum: this.pageObj.pageNumber,
          dealStatus: this.dealStatus
        }
        getWarnPage(params).then(r=>{
          if (r.status) {
            this.dataPage = r.data.list;
            this.pageObj.totalRecords = r.data.total;
          }
        })
      }
    },
    mounted() {
      this.getWarnPage();
    },
    data() {
      return {
        popupShow: false,
        imgPopup: false,
        rowInfo: {},
        imgSrc: '',
        dlrName: '',
        lodings: false,
        dataPage: [],
        pageObj: {
          pageNumber: 1,
          pageSize: 10,
          totalRecords: 0,
          totalPages: 0,
        },
        dealStatus: ''
      };
    },
    components: {
    }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    position: relative;
  }
  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }
  .popupDiv{
    background: rgba(0,0,0,.8);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    z-index: 99;
    .popupBox{
      width: 800px;
      margin: 100px auto;
      padding: 10px;
      background: #fff;
      h3{
        font-weight: 500;
        margin: 0 10px;
        line-height: 35px;
        font-size: 18px;
        border-bottom: 1px solid #ccc;
      }
      .row{
        display: inline-block;
        width: calc(49% - 30px);
        margin-top: 20px;
        margin-left: 30px;
        line-height: 25px;
        vertical-align: top;
        span{
          display: inline-block;
          width: 140px;
          text-align: right;
          vertical-align: top;
        }
      }
    }
  }
</style>