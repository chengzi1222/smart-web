<template>
  <div class="search-box">
    <div class="head">
      <div class="select-box iconBG">
        <div class="inputBox">
            <el-input placeholder="请输入主体名称" v-model="searchMap.keysWord" @keyup.enter.native="cha">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="cha"></i>
            </el-input>
        </div>
        <el-select v-model="searchMap.areaCode" placeholder="请选择辖区" @change="cha" clearable>
          <el-option v-for="item in area" :key="item.areaCode" :label="item.deptName" :value="item.areaCode">
          </el-option>
        </el-select>
      </div>
      <div class="select-box">
        <enum-select style="margin-left: 0" @change="cha" v-model="searchMap.state" enum="com.ybveg.govx.enums.medi.WarningTaskRecordSEnum" placeholder="处理状态(全部)"></enum-select>
        <enum-select style="margin-left: 0" @change="cha" v-model="searchMap.enterpriseForm" enum="com.ybveg.govx.enums.medi.EnterpriseFormEnum" placeholder="企业形态(全部)"></enum-select>
      </div>
    </div>
    <div class="body">
      <p class="result">筛选结果共{{ page.total }}家主体</p>
      <div class="scroll" v-bar>
        <div>
          <div class="item clear_a" v-for="(item,index) in page.list" :key="item.index">
            <div class="text ">
                  <p class="title textell" v-on:click="show(item)">{{ item.entity_name }}</p>
                  <p class="textell">{{ item.reality_addr }}</p>
            </div>
            <div class="fr pt20">
              <el-tag v-if="item.state == '未读'" size="mini" type="danger">未读</el-tag>
              <el-tag v-if="item.state == '已处理'" size="mini" >已处理</el-tag>
              <el-tag v-if="item.state == '待处理'" size="mini" type="warning">待处理</el-tag>
            </div>
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
import * as mapApi from "api/warning/map";
import EnumSelect from 'components/common/EnumSelect'

export default {
  props: {
    taskId: String
  },
  name: 'search-box',
  data() {
    return {
      area: [],
      types: [],
      searchMap: {
        keysWord: '',
        state: '',
        areaCode: '',
        enterpriseForm:''
      },
      page: {
        total: 0,
        list:[]
      },
      pageNumber:1,
      datasLength:false,
      loading:true
    }
  },
  mounted() {
    mapApi.findDept().then((data) => {
      this.area = data.data || [];
    });
    this.search();
  },
  methods: {
    search() {//分页来查询的
      mapApi.pageSearch(this.searchMap, this.pageNumber, 10,this.taskId).then((data) => {
        console.log(data);
        this.loading = false;
        this.page.list = [];
        if(data.data.list.length < 10){
          this.datasLength = true;
        } else{
          this.datasLength = false;
        }
        this.page.list = this.page.list.concat(data.data.list)//每次请求然后合并
        this.page.total = data.data.total;
        this.$emit('reloadmap', {
          searchMap: this.searchMap,
        }, true);
      })
    },
    wheel(){//点击更多再次调用方法
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
      this.pageNumber=1;
      this.search();
    },
    show(item) {//点击主体的时候想外传递id和经纬度
      if (item.lat && item.lng) {
        this.$emit('show', {
          id: item.entity_id,
          lat: item.lat,
          lng: item.lng,
        }, true);
      } else {
        this.$message({ type: 'warning', message: `无法在地图上显示,此主体地理位置信息不全!` });
      }
    },
  },
  components: {
    EnumSelect
  }
}
</script>


<style lang="scss" scoped>
.search-box {
  position: absolute;
  left: 20px;
  top: calc(40% + 30px);
  width: 25%;
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
      justify-content: space-around;
      flex-wrap: nowrap;
      >div{
        width: 47% !important;
      }
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
        >.text{
          width: calc(100% - 50px);
          >p{
            width: 100%;
          }
        }
        .pt20{
          padding-top: 18px;
        }
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
.iconBG .inputBox  .el-input__icon {
  background: #0db5ef;
  color: #ffffff;
}
.search-box .el-input__inner {
  background-color: #3d3e44;
  border-color: transparent;
  color: #a2aab6;
}
</style>
