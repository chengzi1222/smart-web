<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{$route.query.pathName}}</span>
    </div>
    <div class="main-body no-star">
      <div class="form-item">主体类型:

          <el-button class="entity-tap" v-for="(item,index) in entityTypeList" :key="index" @click="handleBtn(item.code,index)"
                     :class="{active:index==defaultIndex}">{{item.name}}</el-button>

      </div>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input :placeholder="placeholder" class="w250 seekIpt" v-model="search.keysWord" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select clearable class="selectHeight w250" v-model="search.thisYearLevel" placeholder="量化等级（本年）" @change="opSearch">
        <el-option v-for="item in quantifyLevelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        <el-option :label="noEvaluate" :value="noEvaluate"></el-option>
      </el-select>
      <el-select clearable class="selectHeight w250" v-model="search.nextYearLevel" placeholder="量化等级（明年）" @change="opSearch">
        <el-option v-for="item in quantifyLevelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        <el-option :label="noEvaluate" :value="noEvaluate"></el-option>
      </el-select>
      <el-cascader class="selectHeight w250" :clearable="true" v-model="entityAreaCodeList"
                   placeholder="主体所属区域" :change-on-select="true"
                   :options="areaList.options" :props="areaList.props"
                   :show-all-levels="false" @change="handleAreaChange">
      </el-cascader>
      <!-- <el-select  class="selectHeight w250" v-model="search.entityType" placeholder="主体类型" @change="opSearch">
        <el-option v-for="item in entityTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select> -->
    </div>
    <div class="tabOffTop170">
      <el-table  :border="true" :resizable="true"  v-loading="loading" element-loading-text="数据正在努力加载中"  :data="tableData" class="table-div"  @sort-change="handleSortChange">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" min-width="120" prop="entityName" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" v-if="search.entityType=='COSMETIC_PRODUCT'" label="许可备案号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="realityAddr" min-width="120" label="实际经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="120" label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="thisQuanLevel" min-width="120" label="量化等级（本年）"></el-table-column>
        <el-table-column show-overflow-tooltip prop="nextAssessLevel" min-width="120" label="量化等级（明年）"></el-table-column>
        <el-table-column @cell-mouse-enter="handleRegulationRecord" min-width="120" label="监管记录">
          <template slot-scope="scope" >
            <span @mouseenter="takeMove(scope.row)" @mouseleave="takeLeve" style="overflow: hidden;white-space: nowrap;width: 109px;text-overflow: ellipsis;">
              当前量化等级：{{scope.row.thisQuanLevel}}；当前风险等级：{{scope.row.thisRiskRank}}；
              动态评级：
                <span v-if="scope.row.dynaAssess && scope.row.dynaAssess.length > 0">
                  <span v-for="(item,index) in scope.row.dynaAssess" :key="item.key">{{item.name}}：{{item.count}} </span>
                </span>
                <span v-else>暂无</span>
              巡查：共0次<span v-for="(item,index) in scope.row.patrolRecord" :key="item.key">
                ，{{item.name}}：{{item.count}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="assessTime" min-width="120" sortable="custom" label="最新评定时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <a href="javascript:;"  @click="firstAssess(scope.row)" class="operate-a">评定</a>
            <!-- v-if="scope.row.thisQuanLevel == '未评估'" ,'FIRST'<a href="javascript:;" v-if="isAssess && scope.row.thisQuanLevel != '未评估'"
               @click="firstAssess(scope.row,'ANNUAL')" class="operate-a">评定</a> -->
            <a href="javascript:;" v-auth="'food.biz.cb,food.biz.pb,food.biz.rb,food.biz.cfda'"
               @click="ifType(scope.row)" class="operate-a">主体档案</a>
            <a href="javascript:;"
               @click="assess(scope.row)" class="operate-a">评定记录</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange"
                       @current-change="pageCurrentChange"
                       :current-page="page.pageNum"
                       :page-sizes="[5,8,10,15,20,25,30]"
                       :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="page.total">
        </el-pagination>
      </div>
    </div>
    <Title :dataLis="dataLis" v-show="moveShow"></Title>
    <popupBody v-if="evaluate">
      <!-- <h2 class="rankH" v-if="this.states == 'FIRST'">首次评定</h2> v-if="this.states == 'ANNUAL'"-->
      <h2 class="rankH" >量化等级评定</h2>
      <span>评定年度：</span>
      <el-select class="w150" style="margin-right: 10px;" v-model="year" placeholder="请选择评定年度">
          <el-option
            v-for="item in yearList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
      </el-select><br>
      <span>量化等级：</span>
      <el-select class="w130" style="margin-right: 10px;" v-model="grade" placeholder="请选择量化等级">
          <el-option
            v-for="item in quantifyLevelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      <div style="margin-top: 80px;text-align: right;">
        <el-button class="w100 no" type="primary" @click="noClick" >取消</el-button>
        <el-button class="w100" type="primary" @click="yesClick" :disabled="disabled_c">确定</el-button>
      </div>
    </popupBody>
    <popupBody v-if="record" class="mT-50">
      <h2 class="rankH">量化等级评定记录</h2>
      <el-select clearable class="w150" style="margin-right: 10px;" v-model="recordGrade" @change="assess()" placeholder="请选择评定等级">
          <el-option 
            v-for="item in quantifyLevelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
           <!-- <el-option :label="noEvaluate" :value="noEvaluate"></el-option> -->
      </el-select>
      <el-select clearable class="w150" style="margin-right: 10px;" v-model="year" @change="assess()" placeholder="请选择评定年度">
          <el-option 
            v-for="item in yearList"
            :key="item.key"
            :label="item.value"
            :value="item.key">
          </el-option>
      </el-select>
      <div style="width: 700px;">
        <el-table  v-loading="loading1" element-loading-text="数据正在努力加载中" :data="tableDataRecord" class="table-div">
          <el-table-column show-overflow-tooltip prop="assessLevel" label="评定等级"></el-table-column>
          <el-table-column show-overflow-tooltip prop="year" label="年度"></el-table-column>
          <el-table-column show-overflow-tooltip prop="realName" label="评定人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="assessTime" label="评定时间"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="recordpageSizeChange"
                         @current-change="recordpageCurrentChange"
                         :current-page="recordPage.pageNum"
                         :page-sizes="[5,8,10,15,20,25,30]"
                         :page-size="recordPage.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="recordPage.total">
          </el-pagination>
        </div>
        <el-button class="w100 no close" type="primary" @click="noClick">关闭</el-button>
      </div>
    </popupBody>
  </div>
</template>

<script>
  import * as rating from "api/medi/rating/rating";
  import { listArea } from 'api/rating/rating';
  import * as api from "api/cosmetics/patrolPlan";
  import { listDict} from "api/enforce/punish";
  import Title from './MouseTitle';
  import popupBody from 'components/popup/popupdata';


  export default {
    async mounted() {
      var quantifyLevelDictCode = "COSM_QUANTIFY";
      if(this.$route.query.index){
        this.handleBtn(this.entityTypeList[this.$route.query.index].code,this.$route.query.index)
      }else{
        this.search.entityType='COSMETIC_PRODUCT';
      }
      


      // 量化等级下拉列表
      listDict(quantifyLevelDictCode).then(result => {
        this.quantifyLevelList = result.data;
      }),
      // 所属区域下拉列表
      listArea().then(result => {
        this.areaList.options = result.data;
      }),
      this.listQuantifyLevel();
    },
    methods: {
      handleBtn(entityParentType,index){
        this.search.entityType=entityParentType;
        this.defaultIndex = index;
        this.listQuantifyLevel();
      },
      handleAreaChange(){
        this.search.areaCode = this.entityAreaCodeList[this.entityAreaCodeList.length-1]
        this.listQuantifyLevel();
      },
      firstAssess(row,type){
        this.year=new Date().getFullYear();
        this.yearList=[];
        api.getTime(row.id).then(result => {
          this.yearList = result.data;
        })
        this.entityId = row.id;
        this.evaluate = true;
        // this.states = type;
      },
      yesClick(){
        this.disabled_c=true;
        if(this.grade != ""){
          let obj = {
            'assessLevelType':"QUANTIFY_LEVEL",
            'entityType':this.search.entityType,
            'entityId':this.entityId,
            'year':this.year,
            'assessLevel':this.grade,
          }
          api.updateAssessRecord(obj).then((d)=>{
            if(d.status){
              this.$message({
                message: '评定成功',
                type: 'success'
              });
              this.noClick();
              this.listQuantifyLevel();
            } else {
              this.$message.error('评定失败');
              this.disabled_c=false;
            }
          })
        } else{
          let text=''
          if(this.grade == ""){
            text='请选择要评定的量化等级！';
          }else{
            text='请选择要评定的年份！';
          }
          this.$message({
            message: text,
            type: 'warning'
          });
          this.disabled_c=false;
        }
      },
      noClick(){
        this.evaluate = false;
        this.record = false;
        this.entityId = "";
        this.recordGrade = "";
        this.grade = "";
        this.disabled_c=false;
      },
      assess(row){
        this.loading1=true;
        if(row != undefined){
          this.entityId = row.id;
          this.year='';
          this.yearList=[];
          this.record = true;
          // 时间年份等级下拉列表
          api.getTime(row.id).then(result => {
            this.yearList = result.data;
          })
        }
        let obj = {
          'ratingType':"QUANTIFY_LEVEL",
          'entityId':this.entityId,
          'pageNum':this.recordPage.pageNum,
          'pageSize':this.recordPage.pageSize,
          'yearLevel':this.recordGrade,
          'year':this.year,
        }
        api.listLevelAssessRecord(obj).then((d) => {
          this.loading1=false;
          this.tableDataRecord = d.data.list;
          this.recordPage.total = d.data.total;
        })
      },
      handleRegulationRecord(){},
      //下拉查询
      opSearch() {
        if(this.search.entityType!='COSMETIC_PRODUCT'){
          this.placeholder='主体名称'
        }else{
          this.placeholder='主体名称、许可备案号'
        }
        this.listQuantifyLevel();
      },
      //页面查询
      async listQuantifyLevel() {
        this.loading=true;
        this.search.pageNum = this.page.pageNum;
        this.search.pageSize = this.page.pageSize;
        let params = this.search;
        api.listRatingPage(params).then(r => {
          this.loading=false;
          var month = new Date().getMonth() + 1;
          // this.page.pageNum == 0 ? 1 : r.data.pageNum;
          // this.page.pagesize = r.data.pagesize;
          this.page.total = r.data.total;
          this.tableData = r.data.list;
          // if (month==12){
          //   this.isAssess = true
          // } else {
          //   this.isAssess = false
          // }
        })
      },
      handleIconClick() {
        this.listQuantifyLevel();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.listQuantifyLevel();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.listQuantifyLevel();
      },
      //分页条
      recordpageCurrentChange(num) {
        this.recordPage.pageNum = num;
        this.assess();
      },
      recordpageSizeChange(size) {
        this.recordPage.pageSize = size;
        this.assess();
      },
      // 排序
      handleSortChange({order}) {
        this.search.sort = order == 'descending' ? 'DESC' : 'ASC';
        this.listQuantifyLevel();
      },
      // 监管记录enter
      takeMove(row){
        this.moveShow = true;
        this.dataLis = {
          'quantificat':row.thisQuanLevel,
          'risk':row.thisRiskRank,
//          'administrative':row.punishNumber,
//          'criminal':row.criminalCaseNumber,
          'grade':row.dynaAssess,
          'result':row.patrolRecord
        }
      },
      // 监管记录leave
      takeLeve(){
        this.moveShow = false;
      },
      ifType(row) {
        // /cosmetics/manager/detail?entityType=COSMETIC_MANAGER&ext=INFO&entityId=2c3320dbd68711e896a7000c296fc49a
        let entityId = row.id;
        let strType= row.entityType.substring( row.entityType.indexOf("_")+1)
        this.$router.push({path: '/cosmetics/' + strType.toLowerCase() + '/archives/detail',
          query: {
            entityType: row.entityType,
            ext: 'INFO',
            entityId: entityId,
            ratingIndexQuantity:this.defaultIndex
        }})
      }
    },
    components: {
      Title,
      popupBody,
    },
    data() {
      return {
        defaultIndex:0,
        disabled_c:false,
        placeholder:'主体名称、许可备案号',
        loading:false,
        loading1:false,
        entityTypeList:[
          {code:'COSMETIC_PRODUCT',
          name:'生产主体',},{
          code:'COSMETIC_MANAGER',
          name:'经营主体',},
          {code:'COSMETIC_EMPLOY',
          name:'使用主体',}
        ],
        entityAreaCodeList: [],
        page: {
          pageSize: 8,
          pageNum: 1,
          total: 0
        },
        recordPage: {
          pageSize: 5,
          pageNum: 1,
          total: 0
        },
        search: {
          ratingType: "QUANTIFY_LEVEL",
          keysWord: "",
          entityType: "",
          areaCode: "",
          thisYearLevel: "",
          nextYearLevel: "",
          // licenseStatus: "",
          // licenseType: "",
          sort: "",
          // sortColumnName: "assess_time",
          pageNum: "",
          pageSize: ""
        },
        //所属区域下拉列表
        areaList: {
          options: [],
          props: {
            label: 'areaName',
            value: 'areaCode',
            children: "children"
          }
        },
        // 监管记录
        regulationRecord: [],
        quantifyLevelList: [],
        yearList:[],
        noEvaluate:"未评估",
        // licenseStatusList: [],
        // licenseTypeList: [],
        //列表数据
        tableData: [],
        // isAssess: false,
        // quantifyLevelThis: "",
        dataLis:{}, //监管记录Hove数据
        moveShow:false,
        evaluate:false,
        peisong:[],
        grade:'',
        entityId:'',
        // states:'',
        record:false,
        recordGrade:'',
        year:'',
        tableDataRecord:[],
      }
    }
  }
</script>

<style scoped lang="sass">

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
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
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box a {
    color: #9A9A9A;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;

    font-size: 15px;
    color: #9A9A9A;
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
    background: #EBF1F5;
  }

  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
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
    color: #1787AD;
  }

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }
  .active {
    background: #0db5ef;
    color: #fff;
  }
  .entity-tap{
    margin: 0 15px;
  }
  .smSpan{
    display: inline-block;
    width: 100%;
  }
  .no{
    background-color: #fff;
    color: #000;
    border-color: #ccc;
  }
  .rankH{
    font-size: 18px;
    margin-left: -10px;
  }
  .close{
    margin-top: 20px;
    float: right;
  }
</style>

