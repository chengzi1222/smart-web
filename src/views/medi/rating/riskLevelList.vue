<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>{{$route.query.pathName}}</span>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt" v-model="search.keysWord" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select clearable class="selectHeight w250" v-model="search.thisYearLevel" placeholder="风险等级（本年）" @change="opSearch">
        <el-option v-for="item in riskLevelList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight w250" v-model="search.nextYearLevel" placeholder="风险等级（明年）" @change="opSearch">
        <el-option v-for="item in riskLevelList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>

      <select-area-grid class="selectHeight w250" placeholder="主体所属区域" @change="deptChange"></select-area-grid>

      <enum-select v-model="search.entityType" placeholder="主体类型" @change="opSearch" enum="com.ybveg.govx.enums.medi.MediEntityTypeEnum"></enum-select>
    </div>

    <div class="tabOffTop170">
      <el-table :data="tableData" class="table-div" @sort-change="handleSortChange" v-loading="loading">
        <el-table-column type="index" min-width="50" label="序号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" min-width="120" prop="entityName" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="120" label="许可备案号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="realityAddr" min-width="150" label="实际经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="150" label="所属区域"></el-table-column>
        <el-table-column show-overflow-tooltip prop="riskRank" min-width="120" label="风险等级（本年）"></el-table-column>
        <el-table-column show-overflow-tooltip prop="nextAssessLevel" min-width="120" label="风险等级（明年）"></el-table-column>
        <el-table-column @cell-mouse-enter="handleRegulationRecord" min-width="120" label="监管记录">
          <template slot-scope="scope">
            <span @mouseenter="takeMove(scope.row)" @mouseleave="takeLeve" style="overflow: hidden;white-space: nowrap;width: 109px;text-overflow: ellipsis;">
              当前量化等级：{{scope.row.quantifyLevelThis}}；当前风险等级：{{scope.row.riskLevelThis}}； 动态评级：
              <span v-if="scope.row.dynamicRatingNumber && scope.row.dynamicRatingNumber.length > 0">
                <span v-for="(item,index) in scope.row.dynamicRatingNumber" :key="index">{{item.level}}：{{item.number}} </span>
              </span>
              <span v-else>暂无</span>
              巡查：共0次<span v-for="(item,index) in scope.row.patrolResult" :key="index">
                ，{{item.resultStr}}：{{item.number}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="assessTime" min-width="120" sortable="custom" label="最新评定时间"></el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="firstAssess(scope.row)" class="operate-a">评定</a>
            <a href="javascript:;" @click="ifType(scope.row)" class="operate-a">主体档案</a>
            <a href="javascript:;" @click="assess(scope.row)" class="operate-a">评定记录</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum"
          :page-sizes="[5,8,10,15,20,25,30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
    <Title :dataLis="dataLis" v-show="moveShow"></Title>
    <popupBody v-if="evaluate" :rules="rules">
      <h2 class="rankH">风险等级评定</h2>
      <span>评定年度：</span>
      <el-select class="w150" style="margin-right: 10px;" v-model="year" placeholder="请选择评定年度">
          <el-option 
            v-for="item in yearList"
            :key="item.key"
            :label="item.value"
            :value="item.key" :disabled="item.id === 'NOASSESS'">
          </el-option>
      </el-select><br/>
      <span>风险等级：</span>
      <el-select class="w130" style="margin-right: 10px;" v-model="grade" placeholder="请选择">
        <el-option v-for="item in riskLevelList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.id === 'NOASSESS'">
        </el-option>
      </el-select>
      <div style="margin-top: 80px;text-align: right;">
        <el-button class="w100 no" type="primary" @click="noClick">取消</el-button>
        <el-button class="w100" type="primary" @click="yesClick" :disabled="disabled_c">确定</el-button>
      </div>
    </popupBody>
    <popupBody v-if="record" class="mT-50">
      <h2 class="rankH">风险等级评定记录</h2>
      <el-select clearable class="w150" style="margin-right: 10px;" v-model="recordGrade" @change="assess()" placeholder="请选择评定等级">
        <el-option v-for="item in riskLevelList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.id === 'NOASSESS'">
        </el-option>
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
        <el-table :data="tableDataRecord" class="table-div">
          <el-table-column show-overflow-tooltip prop="assessLevel" label="评定等级"></el-table-column>
          <el-table-column show-overflow-tooltip prop="assessLevelType" label="评定类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="realName" label="评定人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="assessTime" label="评定时间"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="recordpageSizeChange" @current-change="recordpageCurrentChange" :current-page="recordPage.pageNum"
            :page-sizes="[5,8,10,15,20,25,30]" :page-size="recordPage.pageSize" layout="total, sizes, prev, pager, next, jumper"
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
  import { listDict } from "api/enforce/punish";
  // import Title from 'components/MouseTitle';
  import Title from 'views/cosmetics/rating/MouseTitle';
  import popupBody from 'components/popup/popupdata';
  import EnumSelect from 'components/common/EnumSelect.vue';
  import SelectAreaGrid from 'components/common/SelectAreaGrid';


  export default {
    async mounted() {
      this.loading = true;
      var riskLevelDictCode = "MEDI_RISK";
      var _index = sessionStorage.getItem('defaultIndex');
      sessionStorage.setItem('defaultIndex', 0);
      this.defaultIndex = _index || 0;
      // 风险等级下拉列表
      listDict(riskLevelDictCode).then(result => {
        this.riskLevelList = result.data;
      }),
      this.listRiskLevel();
    },
    methods: {
      deptChange(deptId) {
        this.search.areaCode = !deptId ? "" : deptId[deptId.length - 1]
        this.listRiskLevel()
      },
      firstAssess(row, type) {
        this.entityId = row.id;
        this.evaluate = true;
        this.year = new Date().getFullYear()
        rating.getEntityAssessTime(row.id).then(r => {
          this.yearList = r.data
        })
      },
      yesClick() {
        this.disabled_c = true;
        if (this.grade != "") {
          let obj = {
            'assessLevelType': "RISK_LEVEL",
            'entityId': this.entityId,
            'assessType': this.states,
            'assessLevel': this.grade,
            'year': this.year
          }
          rating.updateAssessRecord(obj).then((d) => {
            if (d.status) {
              this.$message({
                message: '评定成功',
                type: 'success'
              });
              this.noClick();
              this.listRiskLevel();
            } else {
              this.$message.error(r.message);
              // this.disabled_c = false;
            }
          })
        } else {
          this.$message({
            message: '请选择要评定的风险等级！',
            type: 'warning'
          });
          this.disabled_c = false;
        }
      },
      noClick() {
        this.evaluate = false;
        this.record = false;
        this.entityId = "";
        this.recordGrade = "";
        this.grade = "";
        this.disabled_c = false;
        this.tableDataRecord = []
        this.yearList = []
        this.year = ''
      },
      assess(row) {
        this.record = true;
        if (row != undefined) {
          this.entityId = row.id;
        }
        let obj = {
          'ratingType': "RISK_LEVEL",
          'entityId': this.entityId,
          'pageNum': this.recordPage.pageNum,
          'pageSize': this.recordPage.pageSize,
          'yearLevel': this.recordGrade,
          'year': this.year
        }
        if (this.yearList.length == 0) {
          rating.getEntityAssessTime(this.entityId).then(r => {
            this.yearList = r.data
          })
        }
        rating.recordPage(obj).then((d) => {
          this.tableDataRecord = d.data.list;
          this.recordPage.total = d.data.total;
        })
      },
      handleRegulationRecord() { },
      //下拉查询
      opSearch() {
        this.listRiskLevel();
      },
      //页面查询
      async listRiskLevel() {
        this.search.pageNum = this.page.pageNum;
        this.search.pageSize = this.page.pageSize;
        let params = this.search;
        this.loading = true;
        rating.entityPage(params).then(r => {
          this.loading = false;
          if (r.status) {
            this.page.pageNum == 0 ? 1 : r.data.pageNum;
            this.page.pagesize = r.data.pagesize;
            this.page.total = r.data.total
            this.tableData = r.data.list;
          } else {
            this.$message.warning(r.message)
          }
        }).error(() => {
          this.loading = false
        })
      },
      handleIconClick() {
        this.listRiskLevel();
      },
      //分页条
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.listRiskLevel();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.listRiskLevel();
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
      handleSortChange({ order }) {
        this.search.sort = order 
        this.listRiskLevel();
      },
      // 监管记录enter
      takeMove(row) {
        this.moveShow = true;
        this.dataLis = {
          'quantificat': row.quanLevel,
          'risk': row.riskRank,
          'grade': row.dynaAssess,
          'result': row.patrolRecord
        }
      },
      // 监管记录leave
      takeLeve() {
        this.moveShow = false;
      },
      ifType(row) {
        let entityId = row.id;
        this.$router.push({
          path: '/medi/subject/' + row.entityTypeExt.toLowerCase() + '/detail',
          query: {
            entityType: row.entityType,
            entityTypeExt: row.entityTypeExt,
            ext: 'INFO',
            entityId: entityId
          }
        })
      }
    },
    components: {
      Title,
      popupBody,
      EnumSelect,
      SelectAreaGrid
    },
    data() {
      return {
        yearList: [],
        year: '',
        disabled_c: false,
        defaultIndex: 0,
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
          ratingType: "RISK_LEVEL",
          keysWord: "",
          entityType: "",
          areaCode: "",
          thisYearLevel: "",
          nextYearLevel: "",
          sort: "",
          pageNum: "",
          pageSize: ""
        },
        // 监管记录
        regulationRecord: [],
        riskLevelList: [],
        entityTypeList: [],
        noEvaluate: "未评估",
        licenseStatusList: [],
        licenseTypeList: [],
        //列表数据
        tableData: [],
        isAssess: false,
        riskLevelThis: "",
        dataLis: {}, //监管记录Hove数据
        moveShow: false,
        evaluate: false,
        peisong: [],
        grade: '',
        entityId: '',
        states: '',
        record: false,
        recordGrade: '',
        tableDataRecord: [],
        loading: false,
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

  .entity-tap {
    margin: 0 15px;
  }

  .smSpan {
    display: inline-block;
    width: 100%;
  }

  .no {
    background-color: #fff;
    color: #000;
    border-color: #ccc;
  }

  .rankH {
    font-size: 18px;
    margin-left: -10px;
  }

  .close {
    margin-top: 20px;
    float: right;
  }
</style>