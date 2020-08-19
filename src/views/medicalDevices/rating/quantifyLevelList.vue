<template>
  <div class="user-box">

    <!-- 标题 -->
    <el-row>
      <div class="page-tilt">
        <b></b><span class="title">{{$route.query.pathName}}</span>
      </div>
    </el-row>


    <!-- 主体类型 -->
    <el-row class="blank-space">
      <span>主体类型：</span>
      <el-button v-for="(item,index) in entityTypeButtonArr" :key="index"
                 class="entity-type-button"
                 :class="{entity_type_button_active:item.entityType==searchForm.entityType}"
                 @click="handleEntityTypeChange(item.entityType)">
        {{item.title}}
      </el-button>
    </el-row>


    <!-- 查询表单 -->
    <el-form class="blank-space" :model="searchForm">
      <el-row>
        <el-col :span="5">
          <el-input :placeholder="searchFormPlaceholder.keyword" v-model="searchForm.keyword"
                    maxlength="30" clearable @change="handleChange">
            <el-button slot="append" icon="el-icon-search" @click="handleChange"
                       style="background-color: #0DB5EF;color: white">
            </el-button>
          </el-input>
        </el-col>

        <el-col :span="4" :offset="1">
          <el-cascader placeholder="所属辖区" v-model="entityAreaCodeList" style="width: 100%"
                       :show-all-levels="false" :change-on-select="true" clearable
                       :options="areaList.options" :props="areaList.props"
                       @change="handleAreaChange">
          </el-cascader>
        </el-col>

        <el-col :span="3" :offset="1">
          <el-select :placeholder="searchFormPlaceholder.category" v-model="searchForm.category"
                     clearable @change="handleChange">
            <el-option v-for="item in productCategoryList" :key="item.code"
                       :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="3" :offset="1">
          <el-select placeholder="风险分级" v-model="searchForm.quantifyLevel"
                     clearable @change="handleChange">
            <el-option v-for="item in quantifyLevelList" :key="item.code"
                       :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form>


    <!-- 主体列表-->
    <el-table :data="entityListData" border class="table-div blank-space"
              v-loading="entityListLoading" @sort-change="handleSortChange">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="主体名称" prop="entityName"></el-table-column>
      <el-table-column label="社会信用代码" prop="creditCode"></el-table-column>

      <!--生产主体特有字段-->
      <el-table-column label="生产类别" prop="category" v-if="searchForm.entityType=='MAAI_PRODUCT'"></el-table-column>
      <el-table-column label="生产许可编号" prop="productNo" v-if="searchForm.entityType=='MAAI_PRODUCT'"></el-table-column>
      <el-table-column label="Ⅰ类生产备案编号" prop="oneNo" v-if="searchForm.entityType=='MAAI_PRODUCT'"></el-table-column>

      <!--经营主体特有字段-->
      <el-table-column label="多证合一编号" prop="multNo" v-if="searchForm.entityType=='MAAI_MANAGER'"></el-table-column>
      <el-table-column label="经营类别" prop="category" v-if="searchForm.entityType=='MAAI_MANAGER'"></el-table-column>
      <el-table-column label="Ⅲ类许可编号" prop="threeNo" v-if="searchForm.entityType=='MAAI_MANAGER'"></el-table-column>
      <el-table-column label="Ⅱ类备案编号" prop="twoNo" v-if="searchForm.entityType=='MAAI_MANAGER'"></el-table-column>
      <!-- <el-table-column label="Ⅰ类备案编号" prop="oneNo" v-if="searchForm.entityType=='MAAI_MANAGER'"></el-table-column> -->

      <!-- 使用主体特有字段 -->
      <el-table-column label="使用类别" prop="category" v-if="searchForm.entityType=='MAAI_EMPLOY'"></el-table-column>
      <el-table-column label="医疗机构许可证" prop="employNo" v-if="searchForm.entityType=='MAAI_EMPLOY'"></el-table-column>

      <el-table-column label="所属辖区" prop="deptName"></el-table-column>
      <el-table-column label="监管记录">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p>当前风险分级：{{scope.row.quantifyLevel}}</p>
            <p>动态评级：
              <span v-for="(item,index) in scope.row.countDynamicRating" :key="index">
                {{index}}：{{item}}；
              </span>
            </p>
            <p>巡查：
              <span v-for="(item,index) in scope.row.countPatrolResult" :key="index">
                {{index}}：{{item}}；
              </span>
            </p>
            <div slot="reference" class="name-wrapper hidden-overflow">
              当前风险分级：{{ scope.row.quantifyLevel }}
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="风险分级（本年）" prop="quantifyLevel"></el-table-column>
      <el-table-column label="评定时间" prop="assessTime" sortable="custom"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <a href="javascript:;" @click="handleAssess(scope.row)" class="operate-a">评定</a>
          <a href="javascript:;" @click="handleAssessRecord(scope.row)" class="operate-a">评定记录</a>
          <a href="javascript:;" @click="handleEntityInfo(scope.row)" class="operate-a">主体档案</a>
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页框 -->
    <div class="pagination-box" v-if="entityListTotalNum>0">
      <el-pagination background @size-change="handleSizeChange" @current-change="getEntityList"
                     :current-page.sync="searchForm.pageNum" :page-size="searchForm.pageSize"
                     :total="entityListTotalNum" :page-sizes="[5,8,10,15,20,25,30]"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>


    <!-- 等级评定弹窗-->
    <el-dialog :title="assessDialog.title" :visible.sync="assessDialog.show"
               :append-to-body="true" :top="assessDialog.top" width="25%">
      <el-form :model="assessDialogForm" ref="assessDialogForm"
               label-width="80px" style="width: 100%">
        <el-form-item label="评定年份">
          <el-select v-model="assessDialogForm.year" placeholder="评定年份"
                     @change="handleAssessYearChange" style="width: 80%">
            <el-option v-for="(value, key, index) in assessDialogYearList" :key="index"
                       :label="key" :value="key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="风险分级">
          <el-select v-model="assessDialogForm.quantifyLevel"
                     placeholder="请选择风险分级" style="width: 80%">
            <el-option v-for="item in quantifyLevelList" :key="item.code"
                       :label="item.name" :value="item.code" :disabled="item.code=='NOASSESS'">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assessDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submitAssess"
                   :disabled="assessDialogSubmitButtonDisabled">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 评定记录 -->
    <el-dialog :title="assessRecordListDialog.title" :append-to-body="true"
               :visible.sync="assessRecordListDialog.show"
               :top="assessRecordListDialog.top" width="50%">
      <AssessRecordList :entityId="assessRecordListDialog.entityId"
                        :quantifyLevelList="quantifyLevelList"
                        v-if="assessRecordListDialog.show">
      </AssessRecordList>
    </el-dialog>

  </div>
</template>

<script type="module">
  import {getDicts, getEnums, findDeptGrid} from "api/common";
  import * as ratingApi from "api/medicalDevices/rating";
  import AssessRecordList from './components/AssessRecordList';

  // 默认查询参数
  const defaultSearchForm = {
    pageNum: 1,
    pageSize: 5,
    entityType: 'MAAI_PRODUCT',
    keyword: '',
    areaCode: '',  //所属辖区
    category: '',  //类别
    quantifyLevel: '',  //风险分级
    assessTimeSortType: '' //评定时间排序方式
  };

  export default {
    components: {
      AssessRecordList
    },
    data() {
      return {
        // 查询表单数据
        searchForm: {
          pageNum: 1,
          pageSize: 5,
          entityType: 'MAAI_PRODUCT',
          keyword: '',
          areaCode: '',   //所属辖区
          category: '',  //类别
          quantifyLevel: '',  //风险分级
          assessTimeSortType: '' //评定时间排序方式
        },
        searchFormPlaceholder: {
          keyword: "主体名、社会信用代码、许可备案号",
          category: "生产类别",
        },
        // 主体类型枚举
        entityTypeButtonArr: [
          {title: "生产主体", entityType: "MAAI_PRODUCT"},
          {title: "经营主体", entityType: "MAAI_MANAGER"},
          {title: "使用主体", entityType: "MAAI_EMPLOY"},
        ],

        // 所属辖区model
        entityAreaCodeList: [],

        // 所属辖区级联选择器配置
        areaList: {
          options: [],  // 所属辖区数据源
          props: {
            label: 'deptName',
            value: 'areaCode',
            children: 'children',
          }
        },
        // 生产类别枚举
        productCategoryList: [
          {name: 'Ⅰ类', code: 'ONE_CATEGORY'},
          {name: 'Ⅱ类', code: 'TWO_CATEGORY'},
          {name: 'Ⅲ类', code: 'THREE_CATEGORY'},
        ],
        // 质量等级字典
        quantifyLevelList: [],
        // 主体列表数据
        entityListData: [],
        entityListLoading: false,
        entityListTotalNum: 0,
        // 监管记录悬浮框数据
        patrolRecordData: {},
        patrolRecordShow: false,
        // 等级评定弹窗
        assessDialog: {
          title: "风险分级评定",
          top: "20vh",
          show: false
        },
        assessDialogForm: {
          entityId: '',
          quantifyLevel: '',
          year: ''
        },
        assessDialogYearList: {},  //历年评定数据
        assessDialogSubmitButtonDisabled: false,
        // 评定记录列表弹窗
        assessRecordListDialog: {
          entityId: '',
          title: "风险分级评定记录",
          top: "10vh",
          show: false
        },
      }
    },

    methods: {

      // 获取主体列表
      getEntityList(isLoading = true) {
        // console.log(JSON.stringify(this.searchForm));
        if (isLoading) {
          this.entityListLoading = true;
        }

        ratingApi.entityPageApi(this.searchForm).then(result => {
          this.entityListLoading = false;
          if (result.status) {
            let data = result.data;
            this.entityListData = data.list;
            this.entityListTotalNum = data.total;
          } else {
            console.log("获取主体列表获取失败");
            console.log(result.message);
          }
        })
      },

      // 处理change事件
      handleChange() {
        this.getEntityList();
      },

      // 主体类型按钮切换
      handleEntityTypeChange(entityType) {
        switch (entityType) {
          case "MAAI_PRODUCT":
            this.searchFormPlaceholder.keyword = "主体名、社会信用代码、许可备案号";
            this.searchFormPlaceholder.category = "生产类别";
            break;
          case "MAAI_MANAGER":
            this.searchFormPlaceholder.keyword = "主体名、社会信用代码、许可备案号";
            this.searchFormPlaceholder.category = "经营类别";
            break;
          case "MAAI_EMPLOY":
            this.searchFormPlaceholder.keyword = "主体名、社会信用代码、许可证号";
            this.searchFormPlaceholder.category = "使用类别";
            break;
        }
        this.clearSearchParam(entityType);
      },

      // 清空查询条件
      clearSearchParam(entityType) {
        let tempForm = Object.assign({}, defaultSearchForm);
        tempForm.entityType = entityType;
        // 初始化参数
        this.searchForm = tempForm;
        this.entityAreaCodeList = [];
        this.getEntityList();
      },

      // 所属辖区选择
      handleAreaChange() {
        this.searchForm.areaCode = this.entityAreaCodeList[this.entityAreaCodeList.length - 1];
        this.getEntityList();
      },

      // 排序方式
      handleSortChange(obj) {
        this.searchForm.assessTimeSortType = "";  //恢复排序方式
        if (obj.prop == 'assessTime') {
          this.searchForm.assessTimeSortType = obj.order == 'descending' ? 'DESC' : 'ASC';
        }
        this.getEntityList();
      },

      // 添加评定记录时回显数据
      getLatestOfYearAssessRecordList() {
        let paramsObj = {
          entityId: this.assessDialogForm.entityId
        };
        ratingApi.latestOfYearAssessRecordListApi(paramsObj).then(result => {
          if (result.status) {
            this.assessDialogYearList = result.data;
            // 回显今年的评定记录
            let nowYear = new Date().getFullYear().toString();
            this.assessDialogForm.year = nowYear;
            this.assessDialogForm.quantifyLevel = result.data[nowYear] == 'NOASSESS' ? '' : result.data[nowYear];
          } else {
            console.log("获取历年评定记录失败");
            console.log(result.message);
          }
        });
      },

      // 评定按钮
      handleAssess(row) {
        this.assessDialog.show = true;
        this.assessDialogForm.entityId = row.id;
        this.getLatestOfYearAssessRecordList();
      },

      // 评定年份切换
      handleAssessYearChange(year) {
        this.assessDialogForm.quantifyLevel = this.assessDialogYearList[year] == 'NOASSESS' ? '' : this.assessDialogYearList[year];
      },

      // 提交评定
      submitAssess() {
        // console.log(JSON.stringify(this.assessDialogForm));
        if (this.assessDialogForm.quantifyLevel == 'NOASSESS' || this.assessDialogForm.quantifyLevel == '') {
          this.$message({
            message: '请选择评定等级',
            type: 'warning'
          });
          return;
        }

        this.assessDialogSubmitButtonDisabled = true;  // 避免重复提交
        ratingApi.addApi(this.assessDialogForm).then(res => {
          this.assessDialogSubmitButtonDisabled = false;
          if (res.status) {
            this.$message({
              message: '评定成功',
              type: 'success'
            });
            this.assessDialog.show = false;
            this.getEntityList(false);
          } else {
            this.$message.error('评定失败');
            console.log(res.message);
          }
        });
      },

      // 评定记录
      handleAssessRecord(row) {
        this.assessRecordListDialog.entityId = row.id;
        this.assessRecordListDialog.show = true;
      },

      // 初始化数据字典
      initDictData() {
        getDicts(['MAAI_QUANTIFY']).then(result => {
          if (result.status) {
            result.data.forEach(v => {
              switch (v.dictCode) {
                case "MAAI_QUANTIFY":
                  this.quantifyLevelList = v.list;
                  break;
              }
            })
          } else {
            console.log("数据字典加载错误");
            console.log(result.message);
          }
        });
      },

      // 所属辖区
      initDeptGrid() {
        findDeptGrid().then((result) => {
          if (result.status) {
            this.areaList.options = result.data || [];
          } else {
            console.log("所属辖区数据加载错误");
            console.log(result.message);
          }
        })
      },

      // 分页
      handleSizeChange(size) {
        this.searchForm.pageSize = size;
        this.getEntityList();
      },

      // 主体档案
      handleEntityInfo(row) {
        const entityId = row.id;
        let entityType = this.searchForm.entityType,
          routerName = "medicalDevices_sub." + entityType.substring(entityType.indexOf("_") + 1).toLowerCase() + ".detail";
        this.$router.push({
          name: routerName,
          query: {entityType: entityType, ext: 'INFO', entityId: entityId}
        });
      }
    },


    mounted() {
      this.initDictData();
      this.initDeptGrid();
      this.getEntityList();
    }
  }
</script>

<style scoped lang="sass">
  .entity-type-button {
    margin: 0 15px;
  }

  .entity_type_button_active {
    background: #0db5ef;
    color: #fff;
  }

  .blank-space {
    margin-top: 20px;
  }

  .hidden-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .pagination-box {
    margin-top: 20px;
    text-align: right;
  }

  .operate-a {
    color: #1787ad;
  }
</style>

