<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{$route.query.pathName}}</span>
    </div>

    <div class="main-body no-star">
      <div class="form-item">主体类型:

          <el-button class="entity-tap" v-for="(item,index) in btns" :key="index" @click="handleBtn(item.entityParentType,index)"
                     :class="{active:item.entityParentType==$route.query.entityParentType}">{{item.title}}</el-button>

      </div>
      <router-view style="height: calc(100% - 60px)"></router-view>
    </div>

    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt"
                v-model="search.entityName" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select clearable class="selectHeight w250" v-model="search.quantifyLevelThis" placeholder="量化等级（本年）"
                 @change="opSearch">
        <el-option v-for="item in quantifyLevelList" :key="item.id" :label="item.nameOQ" :value="item.id">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight w250" v-model="search.quantifyLevelNext" placeholder="量化等级（明年）"
                 @change="opSearch">
        <el-option v-for="item in quantifyLevelList" :key="item.id" :label="item.nameOQ" :value="item.id">
        </el-option>
      </el-select>

      <el-cascader class="selectHeight w250" :clearable="true" v-model="entityAreaCodeList"
                   placeholder="主体所属区域" :change-on-select="true"
                   :options="areaList.options" :props="areaList.props"
                   :show-all-levels="false" @change="handleAreaChange">
      </el-cascader>

      <el-select clearable class="selectHeight w250" v-model="search.entityType" placeholder="主体类型"
                 v-if="entityParentType == 'CFDA'" @change="opSearch">
        <el-option v-for="item in entityTypeList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight w250" v-model="search.licenseStatus" placeholder="证照状态（全部）"
                 v-if="entityParentType != 'CFDA'" @change="opSearch">
        <el-option v-for="item in licenseStatusList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

    </div>
    <div class="ipt-btn-box" style="justify-content: end;">

      <el-select style="margin-left:0px;" clearable class="selectHeight w250" v-model="search.licenseType" placeholder="许可证类型"
                 v-if="entityParentType == 'PRODUCT'" @change="opSearch">
        <el-option v-for="item in licenseTypeList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
    </div>
    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div"  @sort-change="handleSortChange" v-loading="loading">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="entityName"
                         label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licenseNumber"
                         label="许可备案号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="realityAddr"
                         label="实际经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName"
                         label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="quantifyLevelThis"
                         label="量化等级（本年）"></el-table-column>
        <el-table-column show-overflow-tooltip prop="quantifyLevelNext"
                         label="量化等级（明年）"></el-table-column>
        <el-table-column @cell-mouse-enter="handleRegulationRecord" label="监管记录">
          <template slot-scope="scope" >
            <span @mouseenter="takeMove(scope.row)" @mouseleave="takeLeve" style="overflow: hidden;white-space: nowrap;width: 109px;text-overflow: ellipsis;">
              当前量化等级：{{scope.row.quantifyLevelThis}}；当前风险等级：{{scope.row.riskLevelThis}}；
              行政处罚：{{scope.row.punishNumber}}；刑事案件：{{scope.row.criminalCaseNumber}}；
              动态评级：
                <span v-if="scope.row.dynamicRatingNumber && scope.row.dynamicRatingNumber.length > 0">
                  <span v-for="(item,index) in scope.row.dynamicRatingNumber" :key="index">{{item.level}}：{{item.number}} </span>
                </span>
                <span v-else>暂无</span>
              巡查：共0次<span v-for="(item,index) in scope.row.patrolResult" :key="index">
                ，{{item.resultStr}}：{{item.number}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="quanAssessTime" sortable="custom"
                         label="最新评定时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <a href="javascript:;"
               @click="firstAssess(scope.row,'ANNUAL')" class="operate-a">评定</a>
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
      <h2 class="rankH">量化等级评定</h2>
      <span>评定年度：</span>
      <el-select class="w150" style="margin-right: 10px;" v-model="year" placeholder="请选择评定年度">
          <el-option 
            v-for="item in yearList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
            >
          </el-option>
      </el-select><br/>
      <span>量化等级：</span>
      <el-select class="w130" style="margin-right: 10px;" v-model="grade" placeholder="请选择">
          <el-option
            v-for="item in quantifyLevelList"
            :key="item.id"
            :label="item.nameOQ"
            :value="item.id" 
            :disabled="item.id === 'NOASSESS'">
          </el-option>
      </el-select>
      <div style="margin-top: 80px;text-align: right;">
        <el-button class="w100 no" type="primary" @click="noClick" >取消</el-button>
        <el-button class="w100" type="primary" @click="yesClick" :disabled="disabled_c">确定</el-button>
      </div>
    </popupBody>
    <popupBody v-if="record" class="mT-50">
      <h2 class="rankH">量化等级评定记录</h2>
      <el-select class="w150" style="margin-right: 10px;" v-model="recordGrade" @change="assess()" placeholder="请选择评定等级">
          <el-option
            v-for="item in quantifyLevelList"
            :key="item.id"
            :label="item.nameOQ"
            :value="item.id">
          </el-option>
      </el-select>
      <div style="width: 700px;">
        <el-table :data="tableDataRecord" class="table-div">
          <el-table-column show-overflow-tooltip prop="assessLevel" label="评定等级"></el-table-column>
          <el-table-column show-overflow-tooltip prop="assessType" label="评定类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="评定人"></el-table-column>
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
  import * as rating from "api/rating/rating";
  import { listDict,listDept,listEntityType } from "api/enforce/punish";
  import { getEnums } from "api/common";
  import YbPopup from 'components/ybpopup/YbPopup';
  import Title from 'components/MouseTitle';
  import popupBody from 'components/popup/popupdata';


  export default {
    async mounted() {

      var quantifyLevelDictCode = "OTHER_QUANTIFY";
      var licenseStatusEnum = "com.ybveg.govx.enums.sub.NatureTypeEnum";
      var licenseTypeEnum = "com.ybveg.govx.enums.ProduceLicenceTypeEnum";

      var _index = sessionStorage.getItem('defaultIndex');
      sessionStorage.setItem('defaultIndex', 0);
      this.defaultIndex = _index || 0;
      
      this.loading = true;
      if (this.$route.query.entityParentType) {
        this.entityParentType = this.$route.query.entityParentType;
        this.search.entityParentType = this.$route.query.entityParentType;
      }
      if (this.$route.query.quantifyLevelThis) {
        this.search.quantifyLevelThis = this.$route.query.quantifyLevelThis;
      }
      // 量化等级下拉列表
      listDict(quantifyLevelDictCode).then(result => {
        this.quantifyLevelList = result.data;
      }),

        // 主体类型下拉列表
        listEntityType().then(result => {
          this.entityTypeList = result.data.splice(0,4);
          console.log(this.entityTypeList)
        }),

        // 证照状态下拉列表
        getEnums([licenseStatusEnum],false).then(result => {
          this.licenseStatusList = result.data;
        }),

        // 许可证类型下拉列表
        getEnums([licenseTypeEnum],false).then(result => {
          this.licenseTypeList = result.data;
        }),

        // 所属区域下拉列表
        rating.listArea().then(result => {
          this.areaList.options = result.data;
        }),


        this.listQuantifyLevel();
    },
    methods: {
      handleAreaChange(){
        this.search.entityAreaCode = this.entityAreaCodeList[this.entityAreaCodeList.length-1]
        this.listQuantifyLevel();
      },
      handleBtn(entityParentType,index){
        this.$router.push({
          query:{
            entityParentType: entityParentType,
            pathName: '综合评定'
          }
        })
        this.entityParentType = entityParentType;
        this.defaultIndex = index;
        this.search.entityParentType = entityParentType;
        this.listQuantifyLevel();
      },
      firstAssess(row,type){
        this.entityId = row.entityId;
        this.evaluate = true;
        this.states = type;
        this.year = new Date().getFullYear()
        rating.getEntityAssessTime(this.entityId).then(r => {
          this.yearList = r.data
        })
      },
      yesClick(){
        this.disabled_c=true;
        if(this.grade != ""){
          let obj = {
            'assessLevelType':"QUANTIFY_LEVEL",
            'entityParentType':this.search.entityParentType,
            'entityId':this.entityId,
            'assessLevel':this.grade,
            'year': this.year
          }
          rating.updateAssessRecord(obj).then((d)=>{
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
          this.$message({
            message: '请选择要评定的量化等级！',
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
        this.tableDataRecord = []
      },
      assess(row){
        this.record = true;
        if(row != undefined){
          this.entityId = row.entityId;
        }
        let obj = {
          'assessLevelType':"QUANTIFY_LEVEL",
          'entityId':this.entityId,
          'pageNum':this.recordPage.pageNum,
          'pageSize':this.recordPage.pageSize,
          'assessLevel':this.recordGrade,
        }
        rating.listQuantifyLevelAssessRecord(obj).then((d) => {
          console.log(d.data.list)
          this.tableDataRecord = d.data.list;
          this.recordPage.total = d.data.total;
        })
      },
      handleRegulationRecord(){},
      //下拉查询
      opSearch() {
        this.listQuantifyLevel();
      },
      //页面查询
      async listQuantifyLevel() {
        this.search.pageNum = this.page.pageNum;
        this.search.pageSize = this.page.pageSize;
        let params = this.search;
        this.loading=true;
        rating.listRatingPage(params).then(r => {
          this.loading=false;
          var month = new Date().getMonth() + 1;
          this.tableData = r.data.list;
          this.page.total = r.data.total;
          if (month==12){
            this.isAssess = true
          } else {
            this.isAssess = false
          }
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
        this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
        this.listQuantifyLevel();
      },
      // 监管记录enter
      takeMove(row){
        this.moveShow = true;
        this.dataLis = {
          'quantificat':row.quantifyLevelThis,
          'risk':row.riskLevelThis,
          'administrative':row.punishNumber,
          'criminal':row.criminalCaseNumber,
          'grade':row.dynamicRatingNumber,
          'result':row.patrolResult
        }
      },
      // 监管记录leave
      takeLeve(){
        this.moveShow = false;
      },
      ifType(row) {
        let entityId = row.entityId;
        sessionStorage.setItem('defaultIndex', this.defaultIndex);
        if (this.entityParentType === 'CFDA') {
          this.$router.push({
            name: 'cfda.archives.detail',
            query: {
              id: entityId,
              back: 'otherRating.quantifyLevel'
            }
          });
        } else {
          this.$router.push({
            name: "subject.archives.detail",
            params: {
              type: this.entityParentType.toLocaleLowerCase(),
            },
            query: {
              id: entityId,
              back: 'otherRating.quantifyLevel'
            }
          })
        }
      }
    },
    components: {
      YbPopup,
      Title,
      popupBody
    },
    data() {
      return {
        loading:false,
        disabled_c:false,
        defaultIndex:0,
        entityParentType: 'CFDA',
        entityAreaCodeList: [],
        btns:[
          {title:"三小",entityParentType:"CFDA"},
          {title:"生产主体",entityParentType:"PRODUCT"},
          {title:"流通主体",entityParentType:"CIRCULATION"},
          {title:"餐饮主体",entityParentType:"RESTAURANT"},
        ],
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
          assessLevelType: "QUANTIFY_LEVEL",
          entityName: "",
          entityParentType: "CFDA",
          entityType: "",
          entityAreaCode: "",
          quantifyLevelThis: "",
          quantifyLevelNext: "",
          licenseStatus: "",
          licenseType: "",
          sortType: "",
          sortColumnName: "assess_time",
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
        entityTypeList: [],
        noEvaluate:"未评估",
        licenseStatusList: [],
        licenseTypeList: [],
        //列表数据
        tableData: [],
        isAssess: false,
        quantifyLevelThis: "",
        dataLis:{}, //监管记录Hove数据
        moveShow:false,
        evaluate:false,
        peisong:[],
        grade:'',
        year: '',
        yearList: [],
        entityId:'',
        states:'',
        record:false,
        recordGrade:'',
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

