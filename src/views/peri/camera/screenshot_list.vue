<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>截图列表</span>
    </div>
    <div class="ipt-btn-box">
      <el-input placeholder="主体名称" class="w250 seekIpt " v-model="condition.search"
                @keyup.enter.native="tabSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="tabSearch"></i>
      </el-input>

      <enum-select class="selectHeight w150" v-model="condition.sort" placeholder="排序方式" @change="tabSearch"
                   enum="com.ybveg.govx.enums.SortEnum"></enum-select>

      <select-area-grid class="selectHeight w200" placeholder="选择辖区" @change="deptChange"></select-area-grid>

      <enum-select v-model="condition.entityType" class="w250" :multiple ='true' :collapseTags ='true' placeholder="主体类型"
                   @change="tabSearch" enum="com.ybveg.govx.enums.EntityEnum">
      </enum-select>
      <el-select v-model="condition.imgdescription" placeholder="问题描述" class="ml20 w250" collapse-tags multiple
                 @change="tabSearch">
        <el-option v-for="item in DictProblemItem" :key="item.id" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
    </div>
    <div class="ipt-btn-box">
      <div class="clear_a">
        <el-date-picker @change="tabSearch" value-format="yyyy-MM-dd" type="date"
                        v-model="condition.beginDate"
                        placeholder="起始时间" :picker-options="beforeDate"></el-date-picker>
        <div style="line-height:34px;text-align:center;width:30px;">至</div>
        <el-date-picker @change="tabSearch" value-format="yyyy-MM-dd" v-model="condition.endDate"
                        class="selectHeight" style="margin-left:0 !important;"
                        type="date" placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
      </div>
    </div>
    <ul class="ulbox clear_a">
      <li v-for="item in tableData" :key="item.no" class="maR20">
        <div class="imgbox" @click="goDetail(item);" style="cursor: pointer">
          <div style="width:100%;position:relative;">
            <img :src="pathFile+item.fileId+'?x-oss-process=image/resize,h_200'" style="width:100%;height:200px;"/>
            <div class="shade">
              <p>{{item.entityName}}</p>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <el-tooltip class="item" effect="dark" :content="item.picName" placement="bottom-start">
          <h2 class="textell">问题描述:{{item.picName}}</h2>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="item.shotTime" placement="bottom-start">
          <p>截图时间:{{item.shotTime}}</p>
        </el-tooltip>
      </li>
    </ul>
    <div class="pagination-box">
      <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                     :current-page="page.pageNum"
                     :page-sizes="[10, 20, 40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>

    </div>
    <yb-popup :isShow="pop.isShow" :title="pop.title" @close="choseMenuPop" width="940">
      <div slot="body">
        <div style="margin:20px;" class="clear_a">
          <div class="leftImg" @click="showImg=!showImg" :class="{'bigImg':showImg}">
            <img :src="pathFile+pop.url">
          </div>
          <ul class="rightText">
            <li>主体名称：{{pop.entityName}}</li>
            <li>直播点位：{{pop.cameraName}}</li>
            <li>截图时间：{{pop.shotTime}}</li>
            <li>问题描述：{{pop.picName}}</li>
            <li>联系方式：{{pop.mobile}}</li>
            <li>实际地址：{{pop.realityAddr}}</li>
            <li style="max-height: 150px;overflow-y: auto;">截图备注：{{pop.remark}}</li>
          </ul>
        </div>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button type="default" @click="confirmDown(pop.url,pop.entityName,pop.shotTime);" v-if="pop.url">下载
        </el-button>
        <el-button type="default" @click="choseMenuPop();">关闭</el-button>
      </div>
    </yb-popup>
  </div>
</template>

<script>
  import {findPage, listDictUserItemByCodeAll} from "api/peri/screenshot.js";
  import {downloadFile} from "api/common";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import YbPopup from 'components/ybpopup/YbPopup.vue';
  import EnumSelect from 'components/common/EnumSelect.vue';

  export default {
    async mounted() {
      listDictUserItemByCodeAll("SPD").then((r) => {
        this.DictProblemItem = r.data;
      });
      this.tabSearch();
    },
    computed:{
      pathFile(val){
        return this.$store.getters.filePath
      }
    },
    methods: {
      goDetail(item) {
        this.pop.isShow = true;
        this.pop.url = item.fileId;
        this.pop.cameraName = item.cameraName;
        this.pop.entityName = item.entityName;
        this.pop.shotTime = item.shotTime;
        this.pop.mobile = item.mobile;
        this.pop.remark = item.remark;
        this.pop.realityAddr = item.realityAddr;
        this.pop.picName = item.picName;
      },
      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      async searchPage() {
        this.loading = true;
        let params = this.condition;
        var formData = {
          params: params,
          num: this.page.pageNum,
          size: this.page.pageSize,
        };
        findPage(formData).then((result) => {
          this.loading = false;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.page.total = result.data.total;
          this.tableData = result.data.list;
        });

      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      tabSearch() {
        this.page.pageNum = 1;
        this.searchPage();
      },
      //关闭弹窗
      choseMenuPop() {
        this.pop.isShow = false;
        this.showImg = false;
      },
      confirmDown(fileId, entityName, time) {
        downloadFile(fileId, entityName + time);
      }
    },
    components: {SelectAreaGrid, YbPopup, EnumSelect},
    data() {
      return {
        showImg: false,
        value: '',
        tableData: [],
        DictProblemItem: [],
        page: {
          pageSize: 20,
          pageNum: 1,
          total: 0
        },
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.condition.beginDate);
            if (this.condition.beginDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.condition.endDate);
            if (this.condition.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
        condition: {
          //网格
          dept: "",
          search: "",
          sort: "DESC",
          imgdescription: [],
          beginDate: "",
          endDate: "",
          entityType: []
        },
        //弹窗
        pop: {
          isShow: false,
          title: "图片详情",
          url: "",
          entityName: "",
          shotTime: "",
          mobile: "",
          cameraName: "",
          remark: "",
          realityAddr: "",
          picName: ""
        },
        loading: false,
      }
    }
  }
</script>

<style scoped lang='scss'>
  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .ulbox li {
    width: calc((100% - 80px) / 5);
    margin-top: 20px;
    height: 265px;
  }

  .ulbox li img {
    width: 100%;
  }

  .ulbox li:nth-child(5n + 0) {
    margin-right: 0;
  }

  .ulbox li h2 {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #393939;
    margin-top: 5px;
  }

  .ulbox li p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #a2aab6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .ulbox li .imgbox {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }

  .ulbox li .imgbox .line {
    position: absolute;
    background: #000;
    bottom: 0;
    left: 0;
    height: 35px;
    width: 100%;
  }

  .shade {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 6px;
    border-radius: 8px;
    right: 0;
    background: rgba(9, 9, 9, 0);
    transition: all 0.5s;
    opacity: 0;
  }

  .imgbox:hover .shade {
    background: rgba(9, 9, 9, 0.35);
    opacity: 1;
  }

  .imgbox .shade p {
    color: #fff;
    position: absolute;
    bottom: 0px;
    left: 15px;
    z-index: 999;
  }

  .imgbox .shade img {
    width: 44px;
    height: 44px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -22px;
  }

  .el-pagination .el-pagination__sizes {
    display: none;
  }

  .leftImg {
    width: 640px;
    margin-right: 20px;
    height: 360px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .bigImg {
    img {
      transform: scale(1.5);
      position: relative;
      top: 100px;
      left: 130px;
    }
  }

  .rightText {
    width: 240px;
    li {
      line-height: 30px;
    }
    color: #A2AAB6;
  }
</style>
