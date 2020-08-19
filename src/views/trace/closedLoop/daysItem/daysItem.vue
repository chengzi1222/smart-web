<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>每天单品溯源</span>
      <span style="margin-left: 0px">{{totalNum}}</span>
    </div>
    <div class="mt20">
      <el-autocomplete v-model="buyerName" :fetch-suggestions="querySearchAsync" clearable placeholder="请输入选择采购商名称"
        @select="handleSelect" value-key='name'></el-autocomplete>
      <el-autocomplete v-model="sellerName" class="ml20" :fetch-suggestions="querySearchAsyncSeller" clearable
        placeholder="请输入选择供应商名称" @select="handleSelectSeller" value-key='name'></el-autocomplete>
      <el-input placeholder="请输入商品名称" class="w150 ml20" v-model="pdtName"></el-input>
      <el-date-picker v-model="date" type="date" class="w140 ml20" @change="singleDate" placeholder="选择日期"></el-date-picker>
      <el-button type="primary" class="w100 ml20" @click="search" :loading="loading">搜索</el-button>
    </div>
    <div class="daysBox" v-loading="loading">
      <div class="daysDiv mt20" v-for="(item,index) in datas" :key="index" :class="(index+1)%4 == 0 ? 'daysRight' : ''"
        @click="BoxShow(item)">
        <div class="img" :id="'qrcode' + index" v-if="!loading"></div>
        <p class="mt30">
          <span>商品名称：</span>
          {{item.pdtName}}
        </p>
        <p>
          <span>采购商：</span>
          {{item.buyer}}
        </p>
        <p>
          <span>供应商：</span>
          {{item.seller}}
        </p>
        <p>
          <span>采购时间：</span>
          {{item.buyTime}}
        </p>
      </div>
    </div>
    <div class="pagination-box mb20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[12, 24, 36, 48,60]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div> 

    <div class="popupBox" v-if="popupBoxShow">
      <div class="popupDiv">
        <h3>
          <i class=" iconfont movePoin" ></i>
          <span>产品溯源</span>
          <i class="icon-exit iconfont movePoin" @click="popupBoxShow = false"></i>
        </h3>
        <iframe v-if="src" :src="src" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
  import { daySuyNum, daySuyPage, buyerAuto, dlrAuto } from 'api/trace/daysItem'
  import QRCode from 'qrcodejs2';
  export default {
    data() {
      return {
        loading: false,
        popupBoxShow: false,
        date: "",
        pdtName: '',
        page: {
          pageSize: 12,
          pageNum: 1,
          total: 10
        },
        src: '',
        buyerCode: '',
        buyerName: '',
        sellerName: '',
        sellerCode: '',
        totalNum: 0,
        datas: [],
        options: [],
        restaurants: []
      }
    },
    mounted() {
      if (this.$route.query.buyerCode) {
        this.buyerCode = this.$route.query.buyerCode;
        this.buyerName = this.$route.query.name;
      }
      if(this.$route.query.source == '4k'){
        this.$store.dispatch('getMenus', 'FOOD');
      }
      this.getdate();
      this.daySuyNum();
      this.daySuyPage();
    },
    computed: {
      regionCode() {
        if (this.$route.query.source == '4k') {
          return '5101'
        } else if (this.$store.state.common.user.areaCode.length == 4) {
          return this.$store.state.common.user.areaCode
        } else {
          return this.$store.state.common.user.regionCode
        }
      }
    },
    methods: {
      getdate(date) {
        let dates = date || new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        this.date = dates.getFullYear() + "-" + mon + "-" + day;
      },
      goIndex() {
        let _src = this.src;
        this.src = ''
        setTimeout(() => {
          this.src = _src
        }, 30);
      },
      BoxShow(item) {
        this.src = 'http://sy.ybveg.com/sy/wx/dddjsy2/' + item.orderCode + '/' + item.pdtCode
        this.popupBoxShow = true;
      },
      daySuyNum() {
        this.totalNum = 0;
        let params = new FormData();
        params.append('areaId', this.regionCode);
        params.append('date', this.date);
        daySuyNum(params).then(r => {
          if (!r.data) {
            return
          }
          this.totalNum = r.data
        })
      },
      daySuyPage() {
        this.loading = true;
        let form = new FormData();
        form.append('buyerCode', this.buyerCode != '' ? this.buyerCode : this.buyerName);
        form.append('sellerCode', this.sellerCode != '' ? this.sellerCode : this.sellerName);
        form.append('areaId', this.regionCode);
        form.append('pdtName', this.pdtName);
        form.append('date', this.date);
        form.append('pageSize', this.page.pageSize);
        form.append('pageNumber', this.page.pageNum);
        daySuyPage(form).then(r => {
          if (!r.data) {
            return
          }
          if (r.data.length == 0) {
            this.$message('暂无数据')
          }
          this.datas = r.data;
          setTimeout(() => {
            for (let i = 0; i < r.data.length; i++) {
              let _id = 'qrcode' + i;
              let qrcode = new QRCode(_id, {
                text: 'http://sy.ybveg.com/sy/wx/dddjsy2/' + r.data[i].orderCode + '/' + r.data[i].pdtCode,
                width: 160,
                height: 160,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
              });
            }
          }, 100);
          this.loading = false;
          this.page.total = 0;
          this.page.total = r.pageObj.totalRecords;
        })
      },
      search() {
        if (!this.date) {
          this.$message('请选择日期');
          return
        }
        this.daySuyNum();
        this.daySuyPage();
      },
      querySearchAsync(queryString, cb) {
        let restaurants;
        this.buyerCode = '';
        let form = new FormData();
        form.append('name', queryString);
        form.append('areaId', this.regionCode);
        buyerAuto(form).then(r => {
          restaurants = r.data;
          cb(restaurants);
        })
      },
      handleSelect(item) {
        this.buyerCode = item.value;
      },
      querySearchAsyncSeller(queryString, cb) {
        let restaurants;
        this.sellerCode = '';
        let form = new FormData();
        form.append('name', queryString);
        form.append('areaId', this.regionCode);
        dlrAuto(form).then(r => {
          restaurants = r.data;
          cb(restaurants);
        })
      },
      handleSelectSeller(item) {
        this.sellerCode = item.value;
      },
      singleDate() {
        this.getdate(this.date);
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.daySuyPage();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.daySuyPage();
      }
    }
  }
</script>

<style scoped lang="scss">
  .daysBox {
    overflow: hidden;
  }

  .daysDiv {
    float: left;
    padding: 30px;
    background: #F2F5F8;
    width: 23.5%;
    margin-right: 2%;
    box-sizing: border-box;
    border: 1px solid rgba(13, 181, 239, 0);
  }

  .daysRight {
    margin-right: 0;
  }

  .daysDiv:hover {
    border: 1px solid rgba(13, 181, 239, 1);
    background: rgba(255, 255, 255, 1);
  }

  .daysDiv .img {
    width: 160px;
    height: 160px;
    margin: 0 auto;
  }

  .daysDiv p {
    font-size: 14px;
    color: #393939;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 12px;
  }

  .daysDiv .mt30 {
    margin-top: 30px;
  }

  .daysDiv p span {
    color: #6D7787;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .popupBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5)
  }

  .popupDiv {
    position: absolute;
    height: 600px;
    width: 373px;
    top: 50%;
    margin-top: -280px;
    left: 50%;
    margin-left: -186px;
    background: #fff;
  }

  .popupDiv h3 {
    height: 40px;
    line-height: 40px;
    background: #F2F5F8;
    font-weight: 100;
    display: flex;
    justify-content: space-between;
  }

  .popupDiv h3 span {
    color: #393939;
    font-size: 14px;
  }

  .popupDiv h3 i {
    color: #9A9A9A;
    font-size: 16px;
    margin: 0 12px;
  }

  iframe {
    width: 373px;
    height: 560px;
  }
</style>
