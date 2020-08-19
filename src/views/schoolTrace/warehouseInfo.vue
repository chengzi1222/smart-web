<template>
  <div class="rightBox" v-loading="loading" element-loading-text="拼命加载中">
    <ul class="top clear_a">
      <li class="back_" @click="back"></li>
      <li class="name">进货查验详情</li>
      <li class="time">{{time}}</li>
    </ul>
    <div class="infoBox clear_a">
      <div class="img baseStyle mr20">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in pageData.checkImg" :key="item" v-if="pageData.checkImg !== ''">
            <img :src="item">
          </el-carousel-item>
          <el-carousel-item class="relative" v-if="pageData.checkImg == ''">
            <img src="../../assets/img/schoolTrace/imgNull.png">
            <p class="absolute col999 textC" style="font-size:18px;bottom:20%;width:100%;">暂无现场图片</p>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="base baseStyle">
        <p class="innerBoxTitie"><span class="line"></span>进货查验记录</p>
        <div class="baseInfo">
          <p><span class="col66">食品全称：</span>{{pageData.pdtName}}</p>
          <p><span class="col66">入库时间：</span>{{stockInTime}}</p>
          <p><span class="col66">入库数量：</span>{{pageData.weight}}{{pageData.unit}}</p>
          <p><span class="col66">入库单价：</span>{{pageData.price}}</p>
          <p><span
              class="col66">生产日期：</span>{{pageData.madeDate === null || pageData.madeDate == ''? '暂无':pageData.madeDate}}
          </p>
          <p><span
              class="col66">生产批次：</span>{{pageData.productNo === null || pageData.productNo == ''? '暂无':pageData.productNo}}
          </p>
          <p><span
              class="col66">保质期至：</span>{{pageData.expiryDate === null || pageData.expiryDate == ''? '暂无':pageData.expiryDate}}
          </p>
          <p><span class="col66">供货商：</span>{{dlrName}}</p>
          <p><span class="col66">查验人：</span>{{checkPerson}}</p>
          <div class="clear_a">
            <div style="width:48px;" class="col66">备注：</div>
            <div style="width:calc(100% - 48px);">
              {{pageData.remark === null ||pageData.remark === ''? '暂无':pageData.remark}}</div>
          </div>
          <div v-if="pageData.certImg !== '' ">
            <p><span class="col66">合格证明：</span></p>
            <div v-if="pageData.certImg !== '' " class="images" v-for="item in pageData.certImg" :key="item">
              <img :src="item" alt="">
            </div>
          </div>
          <p style="margin-top: 14px" v-if="pageData.certImg == ''"><span class="col66">合格证明：</span>暂无</p>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import * as api from "../../api/schoolTrace/home";
  import config from "../../utils/config"
  import {
    getMapping
  } from "./mapping";

  export default {
    data() {
      return {
        willDestroy: false,
        timer: [],
        time: "",
        pageData: {},
        id: '',
        schoolTraceBaseUrl: '',
        loading: false,
        entityId: '',
        typeMapping: getMapping(),
        dictTree: [],
        dlrName: '',
        stockInTime: '',
        checkPerson: ''
      };
    },
    methods: {
      back() {
        history.back()
      },
      timeShow() {
        let mydate = new Date();
        let str = "" + mydate.getFullYear() + "年";
        let M = mydate.getMonth() + 1;
        if (M < 10) {
          M = "0" + M;
        };
        str += M + "月";
        let D = mydate.getDate();
        if (D < 10) {
          D = "0" + D;
        };
        str += D + "日";
        let h = mydate.getHours();
        if (h < 10) {
          h = "0" + h;
        };
        str += " " + h + " : ";
        let s = mydate.getMinutes();
        if (s < 10) {
          s = "0" + s;
        };
        str += s;
        this.time = str;
      },
      setInterval_time() {
        this.$nextTick(() => {
          if (this.willDestroy) return;
          var t = setInterval(() => {
            this.timeShow();
          }, 1000);
          this.timer.push(t);
        });
      },
      async getDictTree() {
        let result = await api.getDictTree()
        if (result.code == 200) {
          this.dictTree = result.data;
        }
      },
      getUnit(num) {
        let result;
        for (let i in this.dictTree) {
          if (this.dictTree[i].dictType === num) {
            result = this.dictTree[i].dictItem
          }
        }
        return result
      },
      async getPageData() {
        this.loading = true;
        let result = await api.getWareHouseDetail({
          guid: this.id,
        })
        this.pageData = result.data
        if (this.pageData.certImg !== '') {
          this.pageData.certImg = this.pageData.certImg.split(",")
        }
        if (this.pageData.checkImg !== '') {
          this.pageData.checkImg = this.pageData.checkImg.split(",")
        }
        this.loading = false;
      },
    },
    beforeDestroy() {
      this.willDestroy = true;
      this.timer.forEach(item => {
        clearInterval(item);
        item = null;
      });
    },
    async mounted() {
      await this.getDictTree();
      if (this.$route.query.id) {
        this.id = this.$route.query.id
      }
      this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
      this.setInterval_time();
      await this.getPageData();
      this.dlrName = this.$route.query.dlrName
      this.stockInTime = this.$route.query.time
      this.checkPerson = this.$route.query.checkPerson
    }
  }
</script>

<style scoped lang='scss'>
  .rightBox {
    width: 1792px;
    height: 1008px;
    position: relative;
    left: 64px;
    top: 36px;
    color: #333;
    background-color: #f5f5f5;

    .col66 {
      color: #666;
    }

    .top {
      height: 60px;
      line-height: 60px;
      background: #fff;

      .back_ {
        cursor: pointer;
        width: 50px;
        height: 100%;
        background: url("~@/assets/img/schoolTrace/back.png") no-repeat center right;
        background-size: 22px 22px;
      }

      .name {
        width: calc(100% - 230px);
        text-align: center;
        font-size: 20px;
      }

      .time {
        width: 180px;
        text-align: left;
        color: #999;
        font-size: 14px;
      }
    }

    .infoBox {
      height: calc(100% - 60px);
      padding: 20px;
      box-sizing: border-box;

      .baseStyle {
        background: rgba(255, 255, 255, 1);
        border-radius: 10px;
      }

      .img {
        width: 1320px;
        height: calc(100% - 40px);
        padding: 20px;

        .el-carousel {
          height: 100%;

        }

        .el-carousel__item img {
          border: 1px solid #f5f5f5e1;
          max-width: 100%;
          max-height: 100%;
          margin: 0 auto;
          display: block;
        }
      }

      .base {
        width: calc(100% - 1420px);
        height: calc(100% - 40px);
        overflow: scroll;
        padding: 20px;

        p.innerBoxTitie {
          font-size: 16px;
          color: #333;
          margin-bottom: 30px;

          span.line {
            height: 18px;
            width: 4px;
            display: inline-block;
            background: #34C5D7;
            margin-right: 10px;
            position: relative;
            top: 2px;
          }
        }

        .baseInfo {
          font-size: 14px;

          p,
          .mb14 {
            margin-bottom: 14px;
          }

          .images {
            width: 140px;
            height: 140px;
            margin-right: 20px;
            display: inline-block;

            img {
              width: 140px;
              height: 140px;
            }
          }

        }

      }
    }
  }
</style>
<style lang='scss'>
  .infoBox .img .el-carousel__container {
    height: 93% !important;
  }
</style>
