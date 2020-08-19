<template>
  <div class="wrap" v-loading="loading" element-loading-text="拼命加载中">
    <div class="title clear_a">
      <div class="title_left">每日菜谱</div>
      <div class="title_right fr">
        <span class="mr20">{{weekday}}</span>
        <el-date-picker
          class="w200 fr"
          @change="dateChange"
          v-model="time"
          type="date"
          :clearable="false"
          align="right"
          value-format="yyyy-MM-dd"
        >
          <!--:picker-options="option">-->
        </el-date-picker>
      </div>
      <div class="title_right fr" v-if="sub">
        <el-select v-model="subEntityId" @change="getPageData">
          <el-option v-for="item in subData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>

    <div class="content">
      <el-scrollbar style="height: 100%">
        <div class="imgBox">
          <p class="innerBoxTitie">
            <span class="line"></span>早餐
          </p>
          <div class="image" v-if="pageData.breakfast !== null">
            <div class="singleImg" v-for="(item, index) in pageData.breakfast" :key="index">
              <img :src="schoolTraceBaseUrl + item.fileUrl" v-if="item.fileUrl !== null" />
              <img src="../../assets/img/schoolTrace/imgNull.png" alt v-else />
              <p class="itemp textell">{{food[item.type]}} : {{item.name}}</p>
              <p class="itemp col66">用料 : {{item.foodMaterials!=""?item.foodMaterials:'暂无'}}</p>
            </div>
          </div>
          <div class="image" v-else>
            <img src="../../assets/img/schoolTrace/imgNull.png" />
            <p class="tip_info">当天暂时没有记录</p>
          </div>
        </div>
        <div class="imgBox">
          <p class="innerBoxTitie">
            <span class="line"></span>午餐
          </p>
          <div class="image" v-if="pageData.lunch !== null">
            <div class="singleImg" v-for="(item, index) in pageData.lunch" :key="index">
              <img :src="schoolTraceBaseUrl + item.fileUrl" v-if="item.fileUrl !== null" />
              <img src="../../assets/img/schoolTrace/imgNull.png" alt v-else />
              <p class="itemp textell">{{food[item.type]}} : {{item.name}}</p>
              <p class="itemp col66">用料 : {{item.foodMaterials!=""?item.foodMaterials:'暂无'}}</p>
            </div>
          </div>
          <div class="image" v-else>
            <img src="../../assets/img/schoolTrace/imgNull.png" />
            <p class="tip_info">当天暂时没有记录</p>
          </div>
        </div>
        <div class="imgBox">
          <p class="innerBoxTitie">
            <span class="line"></span>晚餐
          </p>
          <div class="image" v-if="pageData.dinner !== null">
            <div class="singleImg" v-for="(item, index) in pageData.dinner" :key="index">
              <img :src="schoolTraceBaseUrl + item.fileUrl" v-if="item.fileUrl !== null" />
              <img src="../../assets/img/schoolTrace/imgNull.png" alt v-else />
              <p class="itemp textell">{{food[item.type]}} : {{item.name}}</p>
              <p class="itemp col66">用料 : {{item.foodMaterials!=""?item.foodMaterials:'暂无'}}</p>
            </div>
          </div>
          <div class="image" v-else>
            <img src="../../assets/img/schoolTrace/imgNull.png" />
            <p class="tip_info">当天暂时没有记录</p>
          </div>
        </div>
      </el-scrollbar> 
    </div>
  </div>
</template>

<script>
import * as api from "../../api/schoolTrace/home";
import config from "../../utils/config"
import { getMapping } from "./mapping";

export default {
  data() {
    return {
      pageData: {},
      time: '',
      weekday: '',
      entityId: '',
      schoolTraceBaseUrl: '',
      loading: false,
      food: getMapping().food,
      subEntityId: '',
      subData: [],
      sub: false
    }
  },
  methods: {
    getNowTime(date) {
      //  获取时间，默认为当前时间
      let dates = new Date(date) || new Date();
      let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {                                     //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
      if (day <= 9) {                                     //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      let myddy = dates.getDay();//获取存储当前日期
      let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

      this.weekday = weekday[myddy];
      this.time = dates.getFullYear() + "-" + mon + "-" + day;

    },
    async  dateChange() {
      this.loading = true;
      let result = await api.getMenu({
        entityId: this.entityId,
        date: this.time,
        subEntityId: this.subEntityId
      })
      if (result.code == 200) {
            this.loading = false;
        if (result.data.data.breakfast  === null && result.data.data.lunch === null && result.data.data.dinner === null) {
          this.$confirm(
            "所选日期无菜谱, 是否选择显示最近日期的数据?", 
            "提示",
            { 
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(async () => {
                 let menuData = await api.getMenu({
                entityId: this.entityId,
                date: '',
                subEntityId: this.subEntityId
                })
                this.pageData = menuData.data.data
                this.getNowTime(menuData.data.date)
            })
            .catch(() => {
                this.pageData = result.data.data
                this.getNowTime(result.data.date)
            });
        } else{
          this.pageData = result.data.data
          this.getNowTime(result.data.date)
        }
      }
    },
    async getPageData() {
      this.loading = true;
      let result = await api.getMenu({
        entityId: this.entityId,
        date: this.time,
        subEntityId: this.subEntityId
      })
      if (result.code == 200) {
        this.pageData = result.data.data
        this.getNowTime(result.data.date)
        this.loading = false;
        this.subEntityId = result.data.subEntityId
      }
    },
    async getSubSatatus() {
      let result = await api.getSubList({
        entityId: this.entityId
      })
      let menuSwitch = await api.getSwitch({
        entityId:this.entityId
      })
      if (result.data.length > 1 && menuSwitch.data.DAILY_RECIPE === 1) {
        this.sub = true
        this.subData = result.data;
      } else {
        this.sub = false
      }
    }
  },
  async mounted() {
    if (this.$route.query.entityId) {
      this.entityId = this.$route.query.entityId
    }
    this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
    await this.getSubSatatus();
    this.getPageData()
  }
}
</script>

<style lang="scss" scoped>
.el-scrollbar_wrap {
  overflow-x: hidden;
}

.wrap {
  height: 100%;
  width: 100%;
  .title {
    height: 80px;
    line-height: 80px;
    padding: 20px;
    box-sizing: border-box;
    .title_left {
      font-size: 20px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      width: 50%;
      height: 100%;
    }
    .title_right {
      width: 25%;
      height: 100%;
      text-align: right;
    }
  }
  .content {
    width: calc(100% - 40px);
    height: 830px;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    .imgBox {
      p.innerBoxTitie {
        font-size: 16px;
        color: #333;
        margin-bottom: 30px;
        span.line {
          height: 18px;
          width: 4px;
          display: inline-block;
          background: #34c5d7;
          margin-right: 10px;
          position: relative;
          top: 2px;
        }
      }
      .tag {
        width: 4px;
        height: 16px;
        display: inline-block;
      }
      .image {
        /*display: -webkit-box;*/
        /*overflow-x: scroll;*/
        /*-webkit-overflow-scrolling: touch;*/
        position: relative;
        margin: 15px 0;
        .singleImg {
          display: inline-block;
          .itemp {
            width: 250px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .col66 {
            color: #666;
          }
        }
        img {
          width: 250px;
          height: 156px;
          margin-right: 10px;
        }
        span {
          font-size: 16px;
          color: #333333;
          font-weight: 400;
          margin: 10px 0 10px 5px;
        }
        .tip_info {
          font-size: 14px;
          color: #999999;
          position: absolute;
          top: 106px;
          left: 65px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
