<template>
  <div class="box">
    <h3>应急追溯</h3>
    <div class="closeBox">
      <div style="position: relative;z-index: 2;" class="closedBox">
        <el-date-picker class="ml40 w300" style="font-size: 20px" v-model="obj.date" type="date" @change="selectDate" :clearable="true"
          placeholder="选择日期" :picker-options="pickerOptions">
        </el-date-picker>
        <el-autocomplete class="ml40 w300" value-key='name' v-model="pdt" :fetch-suggestions="querySearch_pdt"
          placeholder="请输入商品名字选择商品" :trigger-on-focus="false" @select="handleSelect_pdt"></el-autocomplete>
        <el-button type="primary" class="w160 ml40" @click="loadEchart">追溯</el-button>
      </div>
      <div id='closeEchartsBox' style="position: relative;z-index: 1;" :style="{marginTop: ecType=='dlr'?'-40px':'40px'}" v-loading="loading" element-loading-text="数据正在努力合成中">
        <span v-html="text" class="textC_" style="width:100%"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { closedLoopEcharts } from "./e.js";
  import { closedLoopEchartsD } from "./eD.js";
  import * as api from "api/trace/closedLoop.js";
  export default {
    props: {
      schoolCode: {
        default: function () {
          return ''
        }
      },
      schoolValue: {
        default: function () {
          return ''
        }
      }
    },
    watch: {
      schoolCode:function(){
        this.postdlrli();
      }
    },
    methods: {
      postdlrli(){
        this.ecType = 'dlr';
        var from = new FormData();
        from.append('guid', this.schoolCode)
        api.postdlrli(from).then(r => {
          this.suyAllData = r.data;
          this.suyAllData.supLi = [];
          closedLoopEchartsD(this);
        })
      },
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
        return dates.getFullYear() + "-" + mon + "-" + day;
      },
      selectDate() {
        this.selectDate_ = true;
      },
      handleSelect_pdt(item) {
        this.obj.pdt = item.value;
      },
      async querySearch_pdt(queryString, cb) {
        this.obj.pdt = "";
        if (this.schoolValue == '' || this.obj.date == '') {
          this.$message({
            message: '请先选择正确的主体和日期才可以选择商品！',
            type: 'warning'
          });
          cb([]);
          return false;
        };
        var restaurants;
        let form = new FormData();
        form.append('code', this.schoolValue);
        form.append('name', queryString);
        form.append('date', this.selectDate_ ? this.getdate(this.obj.date) : this.obj.date);
        api.pdtAuto(form).then((d) => {
          if (d.state) {
            restaurants = d.data;
            if (restaurants.length == 0) {
              this.$message({
                message: '未匹配出商品，请重新输入选择！',
                type: 'warning'
              })
              cb([]);
            } else {
              cb(restaurants);
            }
          } else {
            this.$message({
              message: '请求失败',
              type: 'warning'
            })
            cb([]);
          }
        });
      },
      loadEchart() {
        if (this.schoolValue == "" || this.obj.pdt == "" || this.obj.date == "" || this.obj.date == null) {
          this.$message({
            message: '请正确选择所有的选项！（选择主体与商品后才能去合成）',
            type: 'warning'
          });
          return this.isClick = true;
        }
        if (!this.isClick) { return; this.isClick = true; }
        this.isClick = false;
        this.loading = true;
        let form = new FormData();
        form.append('subCode', this.schoolValue);
        form.append('pdtCode', this.obj.pdt);
        form.append('date', this.selectDate_ ? this.getdate(this.obj.date) : this.obj.date);
        this.$nextTick(() => {
          this.suyAllData = [];
          api.suyAllSchoolData(form).then((d) => {
            this.ecType = 'school';
            if (d.state) {
              this.suyAllData = d.data;
              if (d.data.supLi.length == 0 && d.data.buyerLi.length == 0 && d.data.sellerLi.length == 0) {
                this.text = "暂无数据合成!!!";
                this.loading = false;
                this.isClick = true;
                closedLoopEcharts(this);
                return;
              } else {
                this.text = "";
              }
              closedLoopEcharts(this);
              this.loading = false;
              this.isClick = true;
            } else {
              this.loading = false;
              this.isClick = true;
              this.$message({
                message: '请求失败',
                type: 'warning'
              })
            }
          })
        })
      },
    },
    mounted() {
      setTimeout(() => {
        this.postdlrli();
      }, 0);
    },
    data() {
      return {
        text: '',
        loading: false,
        isClick: true,//避免重复点击
        selectDate_: false,//首次时间不需要处理格式
        yblogo: require('assets/img/yblogo.png'),
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        entity: "",
        pdt: "",
        obj: {
          entity: "",
          pdt: "",
          date: ''
        },
        suyAllData: {},
        ecType: ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .box {
    background: url('~assets/img/subjectData/4kTrace/allLiB.png');
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100%;

    h3 {
      font-weight: normal;
      color: #eee;
      font-size: 40px;
      padding-top: 20px;
      margin-left: calc(17%);
    }

    .closeBox {
      margin-top: 60px;
    }

    button {
      height: 60px !important;
      background: url('~assets/img/subjectData/4kTrace/btnB.png') !important;
      background-size: 100% 100% !important;
      font-size: 27px;
      color: #74FAFD;
    }
  }
  #closeEchartsBox {
    width: 100%;
    height: 700px;
    margin-top: 40px;
  }
  .ml30 {
    margin-left: 30px;
  }
  .ml40 {
    margin-left: 40px;
  }
  .w160 {
    width: 160px;
  }
</style>
<style lang="sass">
  .closeBox input {
    background: rgba(0, 0, 0, 0);
    border: 1px solid #74FAFD;
    font-size: 24px;
    height: 60px !important;
    line-height: 60px !important;
    color: #eee;
  }
  .textC_{
    color: #fff;
    text-align: center;
    line-height: 200px;
    display: inline-block;
  }
  .closedBox .el-input__prefix{
    top: 4px;
    left: 10px;
  }
  .closedBox .el-input--prefix .el-input__inner{
    padding-left: 40px;
  }
</style>