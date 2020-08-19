<template>
  <div class="rightBox relative">
    <div class="titie clear_a">
      <div class="titie_left">食材溯源</div>
      <div class="titie_right">
        <span class="mr20">{{weekday}}</span>
        <el-date-picker
          class="w200 fr"
          align="right"
          :clearable="false"
          @change="timeChange"
          v-model="time"
          type="date"
          value-format="yyyy-MM-dd"
          :picker-options="option"
        ></el-date-picker>
      </div>
    </div>
    <div class="innerBox" v-loading="loading" element-loading-text="数据正在努力加载中">
      <el-scrollbar v-if="pdtList.length>0" class="scrollbar">
        <el-row>
          <el-col :span="6" v-for="(item,i) in pdtList" :key="i">
            <div class="grid-content bg-purple item" @click="traceBoxShow(item)">
              <img v-if="item.pdtImg==''" :src="traceNull" />
              <img v-else :src="item.pdtImg" />
              <p class="textell">名称：{{item.pdtName}}</p>
              <p class="textell">来源：{{item.source}}</p>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
      <div class="scrollbar relative textC" v-if="pdtList.length<=0">
        <img
          style="width: 976px;height: 672px;margin-top:53px;"
          src="../../assets/img/schoolTrace/imgNull.png"
        />
        <p class="absolute col999 textC" style="font-size:18px;bottom:27%;width:100%;">暂无溯源数据</p>
      </div>
    </div>
    <div class="popupBox absolute" v-if="popupBoxShow">
      <div class="popupDiv">
        <h3>
          <i
            style="transform: rotate(180deg);"
            class="icon-arrows iconfont movePoin"
            @click="goIndex"
          ></i>
          <span>溯源信息详情</span>
          <i class="icon-exit iconfont movePoin" @click="popupBoxShow = false"></i>
        </h3>
        <iframe v-if="src" :src="src" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as api from "../../api/schoolTrace/index";
export default {
  name: "trace",
  methods: {
    timeChange() {
      if(this.deptCode === ''){
        this.pdtList = [];
        return 
      }
      this.loading = true;
      let obj = { 
        mobile: this.deptCode,
        flag: 0,
        receiveDate: this.time
      };
      api.getTrace(obj).then(r => {
        if (r.data !== null && r.code == 200) {
          let receiveDate = new Date(r.data.dlTime);
          let searchDate = new Date(this.time);
          if (receiveDate.getTime() !== searchDate.getTime()) {
            this.$confirm(
              "所选日期无溯源数据, 是否选择显示最近日期的数据?",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.pdtList = r.data.stockList;
                this.pdtList.map(item => {
                  if (item.pdtImg == "https://yuanben-res.ybveg.com/") {
                    item.pdtImg = "";
                  }
                });
                this.time = r.data.dlTime;
              })
              .catch(() => {
                this.pdtList = [];
              }); 
          } else { 
            this.pdtList = r.data.stockList;
            this.pdtList.map(item => {
              if (item.pdtImg == "https://yuanben-res.ybveg.com/") {
                item.pdtImg = "";
              }
            });
            this.time = r.data.dlTime;
          }
          this.getNowTime(new Date(this.time));
        }
        this.loading = false;
      });
    },
    traceBoxShow(item) {
      this.src = "http://sy.ybveg.com/sy/wx/dddjsy/" + item.pdtDetailId;
      this.popupBoxShow = true;
    },
    goIndex() {
      let _src = this.src;
      this.src = "";
      setTimeout(() => {
        this.src = _src;
      }, 30);
    },
    getNowTime(date) {
      //  获取时间，默认为当前时间
      let dates = date || new Date();
      let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {
        //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day = dates.getDate(); //getdate()返回的是1-31，则不需要加1
      if (day <= 9) {
        //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      let myddy = dates.getDay(); //获取存储当前日期
      let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

      this.weekday = weekday[myddy];
      this.time = dates.getFullYear() + "-" + mon + "-" + day;
    },
    getImg() {
      this.loading = true;
      let obj = {
        mobile: this.deptCode,
        flag: 0,
        receiveDate: this.time
      };
      api.getTrace(obj).then(r => {
        if (r.data !== null && r.code == 200) {
          this.pdtList = r.data.stockList;
          this.pdtList.map(item => {
            if (item.pdtImg == "https://yuanben-res.ybveg.com/") {
              item.pdtImg = "";
            }
          });
          this.time = r.data.dlTime;
          this.getNowTime(new Date(this.time));
        } else {
          this.pdtList = [];
        }
        this.loading = false;
      });
    }
  },
  mounted() {
    if (this.$route.query.entityId) {
      this.entityId = this.$route.query.entityId;
    }
    if (this.$route.query.deptCode) {
      this.deptCode = this.$route.query.deptCode;
    }
    this.getNowTime(false);
    if (this.deptCode === "") {
      this.pdtList = [];
    } else {
      this.getImg();
    }
  },
  data() {
    return {
      loading: true,
      deptCode: "",
      pdtList: [],
      entityId: "",
      src: "",
      popupBoxShow: false,
      traceNull: require("assets/img/schoolTrace/traceNull.png"),
      time: "",
      weekday: "",
      option: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  }
};
</script>

<style scoped lang='scss'>
.rightBox {
  width: calc(100% - 60px);
  padding: 0 30px;
  height: 100%;
  .titie {
    height: 80px;
    line-height: 80px;
    .titie_left {
      font-size: 20px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      width: 50%;
      height: 100%;
    }
    .titie_right {
      width: 50%;
      height: 100%;
      text-align: right;
    }
  }
  .innerBox {
    width: calc(100% - 40px);
    padding: 30px 20px;
    height: calc(888px - 100px);
    background: #fff;
    border-radius: 10px;
    .scrollbar {
      height: 100%;
      width: 100%;
      .item {
        height: 330px;
        text-align: center;
        img {
          height: 230px;
          width: 230px;
        }
        p {
          line-height: 30px;
          font-size: 20px;
          width: 100%;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
.popupBox {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
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
  background: #f2f5f8;
  font-weight: 100;
  display: flex;
  justify-content: space-between;
}

.popupDiv h3 span {
  color: #393939;
  font-size: 14px;
}

.popupDiv h3 i {
  color: #9a9a9a;
  font-size: 16px;
  margin: 0 12px;
}

iframe {
  width: 373px;
  height: 560px;
}
</style>
<style lang="scss">
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>

