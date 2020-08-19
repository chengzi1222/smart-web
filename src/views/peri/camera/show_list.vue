<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>阳光厨房</span>
    </div>
    <div class="ipt-btn-box">
      <el-input placeholder="请输入主体名称" class="w250 seekIpt" v-model="condition.search"
                @keyup.enter.native="tabSearch">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="tabSearch"></i>
      </el-input>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>
      <enum-select class="selectHeight" v-model="condition.entityType" multiple collapse-tags placeholder="主体类型"
                   @change="tabSearch" enum="com.ybveg.govx.enums.EntityEnum">
      </enum-select>
      <el-select class="selectHeight" v-model="condition.hasAI" clearable placeholder="是否包含AI摄像头" @change="tabSearch">
        <el-option v-for="item in isAi" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
    </div>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, 0.8)"
         class="user-box">
      <ul class="ulbox clear_a" v-if="tableData.length>0">
        <li v-for="(item,index) in tableData" :key="item.no" class="maR20">
          <div class="imgbox" @click="goDetail(item);" style="cursor: pointer">
            <div style="width:100%;position:relative;">
              <div class="tag absolute" v-if="item.cameraType=='AI'">AI</div>
              <img :src="item.imgAddr" style="width:100%;height:200px;" @error="notFindImg(index)"/>
              <div class="shade">
                <p>{{item.deptName}}</p>
                <img :src="require('assets/img/play_icon.png')" class="movePoin">
              </div>
              <div class="line"></div>
            </div>
          </div>
          <el-tooltip class="item" effect="dark" :content="item.entityName" placement="bottom-start">
            <h2 class="textell">{{item.entityName}}</h2>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="item.realityAddr" placement="bottom-start">
            <p>{{item.realityAddr}}</p>
          </el-tooltip>
        </li>
      </ul>
      <p v-else style="font-size: 18px;text-align: center;line-height: 40px;color: #9a9494;">暂无数据</p>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                       :current-page="page.pageNum"
                       :page-sizes="[10, 20, 30]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {pageShow} from "api/peri/camera";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';

  export default {
    async mounted() {
      this.tabSearch();
    },
    methods: {
      notFindImg(i) {
        this.tableData[i].imgAddr = require('assets/img/noFindImg.png');
      },
      goDetail(row) {
        this.$router.push({name: 'camera.detail', query: {id: row.entityId,cameraType:row.cameraType,tobId:row.tob_id}});
      },
      deptChange(deptId) {
        this.condition.dept = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      async searchPage() {
        this.loading = true;
        this.condition.hasAI=this.condition.hasAI==""?'0':this.condition.hasAI;
        let params = this.condition;
        var formData = {
          params: params,
          num: this.page.pageNum,
          size: this.page.pageSize,
        };
        pageShow(formData).then((result) => {
          if(!result.status){
            this.$message.error(result.message)
            return
          }
          this.loading = false
          // result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.page.total = result.data.total;
          let tableData = result.data.list;
          // 设置返回图片的高度, 缩减大小
          if(tableData.length>0) {
            tableData.forEach(item => {
              item.imgAddr += '?x-oss-process=image/resize,h_200'
            });
          }
          this.tableData = tableData;
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
    },
    components: {SelectAreaGrid, EnumSelect},
    data() {
      return {
        isAi:[{
          name:'全部摄像头',
          key:'0'
        },{
          name:'AI摄像头',
          key:1
        },{
          name:'普通摄像头',
          key:2
        },],
        value: '',
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        condition: {
          //网格
          dept: "",
          search: "",
          sort: "DESC",
          entityType: [],
          hasAI:"0"
        },
        loading: false,
      }
    }
  }
</script>

<style scoped lang="scss">
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
    width: 18.8%;
    margin-top: 20px;
    height: 265px;
    margin-right: 1.5%;
  }

  .ulbox li:nth-child(5n+5) {
    margin-right: 0px;
  }

  .ulbox li img {
    width: 100%;
  }

  /* .ulbox li:nth-child(5n + 0) {
    margin-right: 0;
  } */

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
    z-index: 988;
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
  .tag{
    width: 40px;
    height: 24px;
    font-size:14px;
    line-height: 24px;
    text-align: center;
    right: 15px;
    top: 15px;
    z-index: 999;
    background: #0DB5EF;
    color: #fff;
    border-radius: 5px;
  }
</style>
