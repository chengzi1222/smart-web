<template>
  <div class="search-box search-box1" :class="{ 'isStatistics': isStatistics }">
    <div class="head">
      <div class="input-box">
        <el-input placeholder="请输入主体名称" v-model="value.search" @keyup.enter.native="cha">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="cha"></i>
        </el-input>
      </div>

      <div class="select-box ">
        <el-select popper-class="select-option" v-model="value.area" v-if="area.length" clearable placeholder="请选择辖区">
          <el-option v-for="item in area" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
          </el-option>
        </el-select>
        <el-select popper-class="select-option" v-model="value.type" placeholder="请选择主体类型" clearable>
          <el-option v-for="item in types" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="body">
      <p class="result">筛选结果共{{ page.total }}家备案主体</p>
      <div class="scroll" v-bar>
        <div>
          <div class="item" v-for="(item,index) in page.list" :key="item.index">
            <p class="title" v-on:click="show(item)">{{ item.entityName }}</p>
            <p>{{ item.address }}</p>
          </div>
          <div>
            <p v-on:click="wheel" style="text-align: center;color: #a2aab6;" class="movePoin" v-if="!datasLength && !loading">更多</p>
            <p style="text-align: center;color: #a2aab6;" v-if="loading"><i class="icon el-icon-loading"></i></p>
            <p style="text-align: center;color: #a2aab6;" v-if="datasLength && !loading">没有更多</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as mapApi from "api/sub/map";
import { getEnums } from 'api/common';

export default {
  props:{
     styleTop: {
      type: String,
      default: ''
    },
  },
  name: 'search-box',
  data() {
    return {
      isStatistics:false,
      area: [],
      types: [],
      value: {
        area: "",
        type: "",
        search: "",
      },
      page: {
        total: 0,
        list:[]
      },
      pageNumber:0,
      datasLength:false,
      loading:true
    }
  },
  mounted() {
    if(this.styleTop && this.styleTop!=''){
      this.isStatistics=true;
    }
    mapApi.findDept().then((data) => {
      this.area = data.data || [];
    });
    getEnums(['com.ybveg.govx.enums.cfda.CfdaTypeEnum', 'com.ybveg.govx.enums.SubTypeEnum']).then((data) => {
      this.types = data.data || [];
    });
    this.search();
  },
  methods: {
    search() {
      mapApi.pageSearch(this.value, this.pageNumber, 10).then((data) => {
        this.page.list = [];
        this.loading = false;
        if(data.data.list.length < 10){
          this.datasLength = true;
        } else{
          this.datasLength = false;
        }
        this.page.list = this.page.list.concat(data.data.list)
        this.page.total = data.data.total;
      })
    },
    wheel(){
      this.loading = true;
      if (this.page.list.length+1 <= this.page.total) {
        this.datasLength = false;
        this.pageNumber++;
        this.search();
      } else{
        this.loading = false;
        this.datasLength = true;
      }
    },
    cha(){
      this.pageNumber=0;
      this.search();
    },
    show(item) {
      console.log(item)
      if (item.lat && item.lng && item.precise=="1") {
        this.$emit('show', {
          id: item.id,
          lat: item.lat,
          lng: item.lng,
        }, true);
      } else {
        this.$message({ type: 'warning', message: `${item.entityName},无法在地图上显示,此主体地理位置信息不全!` });
      }
    },
  },
  watch: {
    'value.area': function () {
      this.cha()
    },
    'value.type': function () {
      this.cha()
    }
  }
}
</script>


<style lang="scss" scoped>
.search-box {
  position: absolute;
  left: 20*2px;
  top: calc(40% + 40*2px);
  width: 30%;
  min-width: 340*2px;
  background:rgba(65,69,76,.85);
  // opacity:0.85;
  z-index: 3;
  box-sizing: border-box;
  padding: 10*2px;
  display: flex;
  flex-direction: column;
  .head {
    .el-input__inner {
      background:#192127;
      border-color: transparent;
    }
    .select-box {
      margin-top: 10*2px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      >div{
        width: 48%;
      }
    }
  }
  .body {
    flex: 1;
    padding-left: 10*2px;
    color: #a2aab6;
    font-size: 12*2px;
    .result {
      padding: 10*2px;
    }
    .scroll {
      height: 180*2px;
      .item {
        padding: 5*2px;
        font-size: 14*2px;
        .title {
          cursor: pointer;
          color: #fff;
          font-size: 16*2px;
        }
      }
    }
  }
}

.foot {
  text-align: center;
  color: #fff;
  background: #6d6f73;
}
.isStatistics{
  top: calc(57% + 60*2px) !important;
  height: 35%;
  .body{
       height: calc(100% - 78*2px - 10*2px) !important;
      .scroll{
        height: calc(100% - 38*2px) !important;
      }
  }
  
}
</style>
<style lang="sass">
.search-box .input-box .el-input__icon {
  background: #0db5ef;
  color: #ffffff;
}
.search-box1 .input-box .el-input__icon{
  padding: 0 10*2px;
}
.search-box .el-input__inner {
  background-color: #3d3e44;
  border-color: transparent;
  color: #a2aab6;
}
.select-option /deep/ .el-select-dropdown__item {
  font-size: 24px !important;
  line-height: 24px !important;
}
</style>
<style scoped lang="scss">
  .head::v-deep .el-input__inner {
    font-size: 28px !important;
    height: 64px !important;
  }
  .head::v-deep .el-input__suffix {
    font-size: 24px !important;
  }
</style>
