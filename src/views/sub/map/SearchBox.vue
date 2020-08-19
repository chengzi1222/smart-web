<template>
  <div class="search-box">
    <div class="head">
      <div class="input-box">
        <el-input placeholder="请输入主体名称" v-model="value.search" @keyup.enter.native="cha">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="cha"></i>
        </el-input>
      </div>

      <div class="select-box">
        <el-select v-model="value.area" v-if="area.length" clearable placeholder="请选择辖区">
          <el-option v-for="item in area" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
          </el-option>
        </el-select>
        <el-select v-model="value.type" placeholder="请选择主体类型" clearable>
          <el-option v-for="item in types" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </div> 
    </div>
    <!-- <div class="foot">
      <i class="el-icon-arrow-up"></i>
    </div> -->
    <div class="body">
      <p class="result">筛选结果共{{ page.total }}家备案主体</p>
      <div class="scroll" v-bar>
        <div>
          <div class="item" v-for="(item,index) in page.list" :key="item.id">
            <el-tooltip class="item" effect="dark" :content="item.entityName" placement="top-start">
                <p class="textell title" @click.prevent="show(item)">{{ item.entityName }}</p>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="item.address" placement="top-start">
                <p class="textell">{{ item.address }}</p>
            </el-tooltip>
          </div>
          <div>
            <p v-on:click="wheel" style="text-align: center;color: #a2aab6;" class="movePoin" v-if="!datasLength && !loading">更多</p>
            <p style="text-align: center;color: #a2aab6;" v-if="loading"><i class="icon el-icon-loading"></i></p>
            <p style="text-align: center;color: #a2aab6;" v-if="datasLength && !loading">没有更多</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="foot">
      <i class="el-icon-arrow-up" />
    </div> -->
  </div>
</template>

<script>
import * as mapApi from "api/sub/map";
import { getEnums } from 'api/common';
import { Message } from 'element-ui';

export default {
  name: 'search-box',
  data() {
    return {
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
    mapApi.findDept().then((data) => {
      this.area = data.data || [];
      // this.area[3].areaCode="8888";
    });
    getEnums(['com.ybveg.govx.enums.cfda.CfdaTypeEnum', 'com.ybveg.govx.enums.SubTypeEnum']).then((data) => {
      this.types = data.data || [];
    });
    this.search();
  },
  methods: {
    search() {
      mapApi.pageSearch(this.value, this.pageNumber, 10).then((data) => {
        this.page.list=[];
        this.loading = false;
        if(data.data.list.length < 10){
          this.datasLength = true;
        } else{
          this.datasLength = false;
        }
        this.page.list = data.data.list;
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
      if (item.lat && item.lng && item.precise=="1") {
        this.$emit('show', item, true);
      } else {
        Message({ type: 'warning', message: `${item.entityName},无法在地图上显示,此主体地理位置信息不全!` });
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
  left: 20px;
  top: calc(40% + 40px);
  width: 30%;
  min-width: 340px;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3;
  display: flex;
  flex-direction: column;
  .head {
    .el-input__inner {
      background-color: #3d3e44;
      border-color: transparent;
    }
    .select-box {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
    }
  }
  .body {
    flex: 1;
    padding-left: 10px;
    color: #a2aab6;
    font-size: 12px;
    .result {
      padding: 10px;
    }
    .scroll {
      height: 180px;
      .item {
        padding: 5px;
        font-size: 14px;
        .title {
          cursor: pointer;
          color: #fff;
          font-size: 16px;
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
</style>
<style lang="sass">
.search-box .input-box .el-input__icon {
  background: #0db5ef;
  color: #ffffff;
}
.search-box .el-input__inner {
  background-color: #3d3e44;
  border-color: transparent;
  color: #a2aab6;
}
</style>
