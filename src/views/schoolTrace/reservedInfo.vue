<template>
  <div class="rightBox" v-loading="loading" element-loading-text="拼命加载中">
    <ul class="top clear_a">
      <li class="back_" @click="back"></li>
      <li class="name">食品留样详情</li>
      <li class="time">{{time}}</li>
    </ul>
    <div class="infoBox clear_a">
      <div class="base baseStyle ">
        <p class="innerBoxTitie"><span class="line"></span>基本信息</p>
        <div class="baseInfo">
          <p><span class="col66">留样时间：</span>{{pageData.remainDate}} {{pageData.remainTime}}</p>
          <p><span class="col66">餐次：</span>{{meal[pageData.meal_rd]}}</p>
          <p><span class="col66">留样人：</span>{{pageData.remainPerson}}</p>
          <div class="clear_a" style="margin-bottom: 14px">
            <div style="width:48px;" class="col66">备注：</div>
            <div style="width:calc(100% - 48px);">{{pageData.remark !== ' '?pageData.remark:'暂无备注'}}</div>
          </div>
          <div>
            <p><span class="col66">处理图片：</span></p>
            <div class="images" v-for="item in pageData.fileDTOList" :key="item.fileId">
              <img :src="schoolTraceBaseUrl + item.fileUrl" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="base baseStyle ml20">
        <p class="innerBoxTitie"><span class="line"></span>留样食品</p>
        <div class="baseInfo">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="foodName" label="食品名称" min-width="180">
            </el-table-column>
            <el-table-column prop="foodCnt" label="留样数量(g)" min-width="180">
            </el-table-column>
          </el-table>
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
        pageData: [],
        tableData: [],
        id: '',
        schoolTraceBaseUrl: '',
        loading: false,
        entityId: '',
        meal: getMapping().meal,
        dictTree: [],
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
      async getPageData() {
        this.loading = true;
        let result = await api.getReservedDetail({
          id: this.id,
          entityId: this.entityId
        })
        this.pageData = result.data
        this.tableData = result.data.fsItemList
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
      if (this.$route.query.id && this.$route.query.entityId) {
        this.id = this.$route.query.id
        this.entityId = this.$route.query.entityId
      }
      this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
      this.setInterval_time();
      this.getPageData();
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
        width: 47%;
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
