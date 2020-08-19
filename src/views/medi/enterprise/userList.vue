<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>企业帐号汇总</span>
    </div>
    <div class="count-box clear_a">
      <div class="count-box-item">
        <div><span class="manger">{{ count.MEDICINE_MANAGER }}</span></div>
        <p>经营主体</p>
      </div>
      <div class="count-box-item">
        <div><span class="employ">{{ count.MEDICINE_EMPLOY }}</span></div>
        <p>使用主体</p>
      </div>
      <div class="count-box-item">
        <div><span class="onLine">{{ count.onLineNum }}</span></div>
        <p>在线</p>
      </div>
      <div class="count-box-item">
        <div><span class="offLine">{{ count.offLineNum }}</span></div>
        <p>离线</p>
      </div>
    </div>
    <div class="clear_a pieBox mb20">
      <div id="pieLfet"></div>
      <div id="pieRight"></div>
    </div>
    <div class="ipt-btn-box" style="justify-content: flex-start;">
      <el-input placeholder="主体名称、许可证号、姓名、手机号" class="w350 seekIpt" v-model="searchMap.keysWord"
                @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>
      <enum-select class="selectHeight" v-model="searchMap.onlineStatus" placeholder="状态"
                   enum="com.ybveg.govx.enums.medi.EnterpriseUserStateEnum" @change="tabSearch"></enum-select>
      <enum-select style="width: 150px" v-model="searchMap.enterpriseForm" @change="tabSearch" enum="com.ybveg.govx.enums.medi.EnterpriseFormEnum" placeholder="企业形态(全部)"></enum-select>
    </div>
    <div class="tabOffTop50">
      <el-table  :border="true" :resizable="true"  :data="tableData" @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="enterpriseForm" min-width="100" label="企业形态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realName" min-width="50" label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" min-width="80" label="手机号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="100" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realityAddr" min-width="110" label="经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="grid" min-width="100" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="update_time" min-width="110" label="更新时间"
                         sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="onlineStatus" min-width="70" label="状态"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <a href="javascript:;" @click="$router.push({path: '/medi/subject/' + scope.row.entityTypeExt.toLowerCase() + '/detail', query: {entityType: scope.row.entityType, entityTypeExt: scope.row.entityTypeExt, ext: 'INFO', entityId: scope.row.id}})" class="operate-a">主体档案</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
                       :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as enterprise from "api/medi/enterprise/enterprise";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';
  import * as echarts from "./echarts";

  export default {
    async mounted() {
      this.tabSearch()
      this.getOnLineNum()
    },
    methods: {
      sortChange(column) {
        if (column.order == 'ascending') {
          this.searchMap.sort = 'ascending';
        }
        if (column.order == 'descending') {
          this.searchMap.sort = 'descending'
        }
        this.tabSearch();
      },
      deptChange(deptId) {
        this.searchMap.areaCode = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.tabSearch();
      },
      searchPage() {
        const params = this.searchMap;
        const formData = {
          params: params,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        };
        enterprise.findUserPage(formData).then((result) => {
          if (result) {
            result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
            this.page.total = result.data.total;
            this.tableData = result.data.list;
          }
        });
      },
      getOnLineNum() {
        enterprise.getOnLineNum().then((result) => {
          if (result) {
//            this.count = result.data;
            Object.assign(this.count, result.data)
            this.chartInit()
          }
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
      chartInit(){
        this.initChartData();
        echarts.pie(this.pie1,"1","pieLfet"," ");
        echarts.pie(this.pie2,"0","pieRight"," ");
      },
      initChartData(){
        this.pie1.seriesData = []
        this.pie2.seriesData = []
        this.pie1.seriesData.push({name:"药店",value:this.count.ENTITY !== 0 ? this.count.ENTITY : 0})
        this.pie1.seriesData.push({name:"批发企业",value:this.count.WHOLESALE !== 0 ? this.count.WHOLESALE : 0})
        this.pie1.seriesData.push({name:"其他经营主体",value:this.count.OTHER_MANAGER !== 0 ? this.count.OTHER_MANAGER : 0})
        this.pie2.seriesData.push({name:"医院",value:this.count.HOSPITAL !== 0 ? this.count.HOSPITAL : 0})
        this.pie2.seriesData.push({name:"社区卫生站",value:this.count.HEALTHSTATION !== 0 ? this.count.HEALTHSTATION : 0})
        this.pie2.seriesData.push({name:"诊所",value:this.count.CLINIC !== 0 ? this.count.CLINIC : 0})
        this.pie2.seriesData.push({name:"其他使用主体",value:this.count.OTHER_EMPLOY !== 0 ? this.count.OTHER_EMPLOY : 0})
      }
    },
    components: { SelectAreaGrid, EnumSelect },
    data() {
      return {
        tableData: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        pie1:{
          legendData:["药店","批发企业","其他经营主体"],
          seriesData:[
            {name:"药店",value:0},
            {name:"批发企业",value:0},
            {name:"其他经营主体",value:0}
          ]
        },
        pie2:{
          legendData:["医院","社区卫生站","诊所","其他使用主体"],
          seriesData:[
            {name:"医院",value:0},
            {name:"社区卫生站",value:0},
            {name:"诊所",value:0},
            {name:"其他使用主体",value:0},
          ]
        },
        count: {
          MEDICINE_MANAGER:0,
          MEDICINE_EMPLOY:0,
          ENTITY:0,
          WHOLESALE:0,
          HOSPITAL:0,
          HEALTHSTATION:0,
          CLINIC:0,
          OTHER_MANAGER:0,
          OTHER_EMPLOY:0,
          onLineNum: 0,
          offLineNum:0,
        },
        searchMap: {
          areaCode: "", //网格
          keysWord: "",   //搜索
          sort: "descending",
          onlineStatus: "",
          enterpriseForm: ""
        },
      }
    }
  }
</script>

<style lang="scss" scoped>


  .li-bott span {
    color: #393939;
  }


  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box a {
    color: #9a9a9a;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .table-div {
    width: 100%;
    text-align: center;
  }

  .operate-a {
    color: #1787ad;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .count-box{
    margin-top: 15px;
    height: 90px;
    width: 100%;
    text-align: center;
    border: 1px solid #C2CAD2;
  }
  .count-box .count-box-item{
    height: 90px;
    width: 25%;
  }
  .count-box .count-box-item div{
    margin-top: 15px;
    color: #3B3B3B;
    font-size: 28px;
    position: relative;
  }

  .count-box .count-box-item:nth-child(2) div:after{
    content: "";
    display: inline-block;
    width: 1px;
    height: 60px;
    position: absolute;
    border-left: 1px solid #C2CAD2;
    right: 1px;
  }
  .count-box .count-box-item p{
    color: #A2AAB6;
    font-size: 14px;
  }
  .count-box .count-box-item div span:before{
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #32C25E;
    position: relative;
    right: 8px;
    bottom: 5px;
  }
  .count-box .count-box-item div span.employ:before,.count-box .count-box-item div span.manger:before{
    display: none;
  }
  .count-box .count-box-item div span.offLine:before{
    background-color: #B6C1CA;
  }
  .pieBox{
    height: 250px;
    width: 100%;
    margin-top:20px;
  #pieLfet,#pieRight{
    padding: 15px;
    width: calc((100% - 20px) / 2 - 32px);
    height: calc(100% - 30px);
    background: #fff !important;
    border:1px solid #C2CAD2;
  }
  #pieLfet{
    margin-right: 20px;
  }
  }
</style>
