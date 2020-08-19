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
          <el-option v-for="item in area" :key="item.areaCode" :label="item.areaName" :value="item.areaCode">
          </el-option>
        </el-select>
        <el-select v-model="value.type" placeholder="请选择企业形态" clearable>
          <el-option v-for="item in types" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="body">
      <p class="result">筛选结果共{{ page.total }}家备案主体</p>
      <div class="scroll" v-bar>
        <div>
          <div class="item relative" v-for="(item,index) in page.list" :key="item.id">
            <el-tooltip class="item" effect="dark" :content="item.entityName" placement="top-start">
                <p class="textell title" v-on:click="show(item)">{{ item.entityName }}</p>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="item.address" placement="top-start">
                <p class="textell">{{ item.address }}</p>
            </el-tooltip>
            <span class="absolute typeIcon">{{ item.type}}</span>
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
  import * as api from 'api/cosmetics/subMap';
  import { getEnums } from 'api/common';

  export default {
    name: 'search-box',
    data() {
      return {
        typeIcon: {
          CES_BAB: "理发店",
          CES_BS: "美容院",
          CES_CSH: "整容医院",
          CES_NS: "美甲店",
          CMS_SPM: "商场",
          CMS_DS: "药店",
          CMS_SM: "超市",
          OTHER_MANAGER: '其他经营主体',
          OTHER_EMPLOY: '其他使用主体',
          CPS_PE: '生产企业',
        },
        area: [],
        types: [],
        value: {
          area: "",
          type: "",
          search: "",
        },
        page: {
          total: 0,
          list: []
        },
        pageNumber: 0,
        datasLength: false,
        loading: true
      }
    },
    mounted() {
      api.getChilarea(this.calcLevel(this.zoomComputed)).then((data) => {
        this.area = data.data.location || [];
      });
      api.busclass().then((data) => {
        this.types = data.data || [];
      });
      this.search();
    },
    computed: {
      zoomComputed() {
        return this.$store.getters.mapCenter.zoom;
      }
    },
    methods: {
      goLocation() {
        for (let i in this.area) {
          if (this.area[i].areaCode == this.value.area) {
            let obj = {
              lat: this.area[i].lat,
              lng: this.area[i].lng
            };
            this.$emit('goLocation_', obj);
            return;
          }
        }

      },
      calcLevel(zoom) {//根据传进来的缩放倍数来确定当前什么级别，然后return出去
        let codeLevel = 0;
        if (zoom > 14) {
          codeLevel = 5;
        } else if (zoom > 11 && zoom <= 14) {
          codeLevel = 4;
        } else if (zoom <= 11) {
          //11 只显示区
          codeLevel = 3;
        }
        return codeLevel;
      },
      search() {
        let obj = {
          entityName: this.value.search,
          areaCode: this.value.area,
          classType: this.value.type
        }
        api.pageSearch(obj, this.pageNumber, 10).then((data) => {
          this.page.list = [];
          this.loading = false;
          if (data.data.list.length < 10) {
            this.datasLength = true;
          } else {
            this.datasLength = false;
          }
          this.page.list = this.page.list.concat(data.data.list)
          this.page.total = data.data.total;
        })
      },
      wheel() {
        this.loading = true;
        if (this.page.list.length + 1 <= this.page.total) {
          this.datasLength = false;
          this.pageNumber++;
          this.search();
        } else {
          this.loading = false;
          this.datasLength = true;
        }
      },
      cha() {
        this.pageNumber = 0;
        this.search();
      },
      show(item) {
        console.log(item)
        if (item.lat && item.lng && item.precise == "1") {
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
        this.goLocation()
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
            width: 80%;
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

  .typeIcon {
    right: 20px;
    top: 10px;
    display: inline-block;
    max-width: 120px;
    min-width: 40px;
    padding: 0 3px;
    text-align: center;
    height: 20px;
    border-radius: 4px;
    border: 1px solid rgba(13, 181, 239, 1);
    font-size: 12px;
    color: rgba(13, 181, 239, 1);
    line-height: 20px;
  }
</style>