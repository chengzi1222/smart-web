<template>
  <div>
    <ToggleForm title="培训人员管理">
      <div class="mt30">
        <div class="mb20">
          <el-button class="w140" type="primary" @click="addPop">
            <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>批量添加人员
          </el-button>
          <el-button class="w100" @click='del(delList)' v-if="status!='1'">批量删除</el-button>
          <el-button class="w120 mr20" type="primary" @click="downTableTemplet">下载导入模板</el-button>
          <el-upload action=""  style="display: inline-block;margin-left: 10px;"  :show-file-list="false"
            :http-request="uploadConfig" :on-error="fileUploadError" :before-upload="beforeAvatarUploadImport">
            <el-button class="w100" type="primary">导入</el-button>
          </el-upload>
          <el-select class="w200 ml20" v-model="queryLimit.isSignUp" @change="changeSearch" :clearable="true"
            placeholder="是否报名人员">
            <el-option v-for="(item,key)  in isApplyPeople" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
        </div>
        <el-table v-loading="loading" @selection-change="handleSelectionChange" element-loading-text="数据正在努力加载中"
          :border="true" :resizable="true" :data="tableData" class="table-div">
          <el-table-column type="selection" width="55" fixed="left">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" min-width="120" label="姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="account" min-width="120" label="账号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="idCard" min-width="120" label="身份证号">
            <template slot-scope="scope">
              {{scope.row.idCard?scope.row.idCard:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="entityName" min-width="150" label="单位名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="licence" min-width="130" label="单位许可备案号">
            <template slot-scope="scope">
              {{scope.row.licence?scope.row.licence:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区域">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="post" min-width="100" label="岗位职务">
            <template slot-scope="scope">
              {{scope.row.post?scope.row.post:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型">
            <template slot-scope="scope">
              {{scope.row.entityTypeStr?scope.row.entityTypeStr:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="personCategory" min-width="100" label="人员类型">
            <template slot-scope="scope">
              {{scope.row.personCategory?scope.row.personCategory:'-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="培训状态" v-if='type=="edit"'>
            <template slot-scope="scope">
              {{studyStatus[scope.row.studyStatus]}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="是否报名人员">
            <template slot-scope="scope">
              {{isApplyPeople[scope.row.isSignUp]}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right" v-if="status!='1'">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click='del([scope.row.id])'>删除</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="queryLimit.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="queryLimit.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </ToggleForm>
    <!-- 弹窗 -->
    <yb-popup @close="close" :isShow="isShow" title="添加培训人员" width="1030">
      <div slot="body">
        <div style="margin:0 20px 20px">
          <el-input placeholder="姓名、单位、单位备案号、账号" class="w300 mr20 seekIpt" v-model="queryLimitPop.keyword"
            @keyup.enter.native="changeSearchPop">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="changeSearchPop"></i>
          </el-input>
          <select-area-grid v-if="isShow" class="mr20 w150" placeholder="所属辖区" @change="selectAreaGrid">
          </select-area-grid>
          <el-select class="mr20 w150" v-model="personCategory" @change="changeSearchPop" :clearable="true" multiple
            collapse-tags placeholder="人员类型">
            <el-option v-for="(item,key) in peopleType" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
          <el-select class="mr20 w150" v-model="entityType" @change="changeSearchPop" :clearable="true" multiple
            collapse-tags placeholder="行业类型">
            <el-option v-for="item in entityType_" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-table v-loading="loadingPop" height="550" @selection-change="handleSelectionChangePop"
            element-loading-text="数据正在努力加载中" :border="true" :resizable="true" :data="tableDataPop"
            class="table-div mt20">
            <el-table-column type="selection" width="55" fixed="left">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="name" min-width="120" label="姓名">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="account" min-width="120" label="账号">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="idCard" min-width="120" label="身份证号">
              <template slot-scope="scope">
                {{scope.row.idCard?scope.row.idCard:'-'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="entityName" min-width="150" label="单位名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="licence" min-width="130" label="单位许可备案号">
              <template slot-scope="scope">
                {{scope.row.licence?scope.row.licence:'-'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区域">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="post" min-width="100" label="岗位职务">
              <template slot-scope="scope">
                {{scope.row.post?scope.row.post:'-'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="120" label="行业类型">
              <template slot-scope="scope">
                {{scope.row.entityTypeStr?scope.row.entityTypeStr:'-'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="personCategory" min-width="100" label="人员类型">
              <template slot-scope="scope">
                {{scope.row.personCategory?scope.row.personCategory:'-'}}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination background @size-change="pageSizeChangePop" @current-change="pagecCurrentChangePop"
              :current-page="queryLimitPop.pageNum" :page-sizes="[10, 20, 30, 40,50]"
              :page-size="queryLimitPop.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPop">
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="foot" style="padding-bottom:20px;">
        <el-button class="w80" type="default" @click="close">取消</el-button>
        <el-button class="w80" type="primary" @click="submit">保存</el-button>
      </div>
    </yb-popup>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import YbPopup from "components/ybpopup/YbPopup.vue";
  import SelectAreaGrid from 'components/common/SelectAreaGridTob'
  import * as api from "api/assess/index";
  import {
    getPublic,
    getEntityType,
    getYear
  } from "../../com.js";
     import {
        downloadFile
    } from "api/common";
  export default {
    components: {
      ToggleForm,
      YbPopup,
      SelectAreaGrid
    },
    props: {
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        studyStatus: getPublic().studyStatus,
        peopleType: getPublic().peopleType,
        isApplyPeople: getPublic().isApplyPeople,
        entityType_: [],
        total: 0,
        queryLimit: {
          pageNum: 1,
          pageSize: 10,
          isSignUp: '',
          trainPlanId: ''
        },
        loading: false,
        delList: [],
        tableData: [],
        totalPop: 0,
        queryLimitPop: {
          pageNum: 1,
          pageSize: 10,
          trainPlanId: '',
          personCategory: '',
          entityType: '',
          areaCode: '',
          keyword: ''
        },
        personCategory: [],
        entityType: [],
        loadingPop: false,
        selList: [],
        tableDataPop: [],
        isShow: false,
        type: 'add',
        status: '3',
        importLoad: false
      };
    },
    async mounted() {
      if (this.$route.query.type) {
        this.type = this.$route.query.type;
      }
      if (this.$route.query.status) {
        this.status = this.$route.query.status;
      }
      this.entityType_ = await getEntityType()
      this.searchPage()
    },
    methods: {
      //下载要点表导入模板
      downTableTemplet() {
        location.href = `/api/pxkh/assess/plan/person/template`;
      },
      beforeAvatarUploadImport(file) {
        return new Promise(async (resolve, reject) => {
          let type = file.name.substr(file.name.lastIndexOf('.'))
          if (type !== '.xlsx' && type !== '.xls') {
            this.$message.warning('上传格式错误')
            return reject(false);
          }
          return resolve(true)
        });
      },
      fileUploadError(err, file) {
        this.$message.warning("文件上传失败！");
      },
      uploadConfig(file, callback) {
        this.importLoad = true;
        var formdata = new FormData()
        formdata.append('file', file.file);
        formdata.append('trainPlanId', this.id);
        api.uploadFile(formdata,2).then((r) => {
          this.importLoad = false;
          if (r.status&&!r.data) {
            this.$message.success('导入成功!');
          }else if (r.status&&r.data) {
           this.$message.error('导入失败!正在下载失败人员名单');
           downloadFile(r.data, '导入失败人员名单');
          } else {
            this.$message.error('导入失败!');
          }
          this.searchPage();
        })
      },
      selectAreaGrid(val) {
        if (!val || val.length == 0) {
          this.queryLimitPop.areaCode = "";
        } else {
          this.queryLimitPop.areaCode = val[val.length - 1];
        }
        this.changeSearchPop();
      },
      handleSelectionChange(val) {
        this.delList = val.map(obj => obj.id)
      },
      handleSelectionChangePop(val) {
        this.selList = val.map(obj => obj.id)
      },
      pagecCurrentChange(num) {
        this.queryLimit.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size;
        this.changeSearch();
      },
      changeSearch() {
        this.queryLimit.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChangePop(num) {
        this.queryLimitPop.pageNum = num;
        this.searchPagePop();
      },
      pageSizeChangePop(size) {
        this.queryLimitPop.pageSize = size;
        this.changeSearchPop();
      },
      changeSearchPop() {
        this.queryLimitPop.pageNum = 1;
        this.searchPagePop();
      },
      searchPagePop() {
        this.loadingPop = true;
        this.queryLimitPop.entityType = this.entityType.toString()
        this.queryLimitPop.personCategory = this.personCategory.toString()
        api.trainPlanPersonListForAdd(this.queryLimitPop).then(result => {
          if (result.status) {
            this.tableDataPop = result.data.list;
            this.totalPop = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loadingPop = false;
        });
      },
      searchPage() {
        this.loading = true;
        this.queryLimit.trainPlanId = this.id
        api.trainPlanPersonList(this.queryLimit).then(result => {
          if (result.status) {
            this.tableData = result.data.list;
            this.total = result.data.total;
          } else {
            this.$message.warning("列表数据获取失败！请稍候重试");
          }
          this.loading = false;
        });
      },
      del(list) {
        if (list.length <= 0) {
          this.$message.error('请至少选择一个')
          return
        }
        this.$confirm("是否确定删除选中的人员？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.trainPlanPersonDel({
            id: this.id,
            arr: list
          }).then(r => {
            if (r.status) {
              this.$message.success("删除成功")
              this.changeSearch()
            }
          })
        })
      },
      addPop() {
        this.isShow = true
        this.entityType = []
        this.personCategory = []
        this.queryLimitPop = {
          pageNum: 1,
          pageSize: 10,
          trainPlanId: this.id,
          personCategory: '',
          entityType: '',
          areaCode: '',
          keyword: ''
        }
        this.searchPagePop();
      },
      submit() {
        if (this.selList.length <= 0) {
          this.$message.error('请至少选择一个')
          return
        }
        api.trainPlanPersonAdd({
          id: this.id,
          arr: this.selList
        }).then(r => {
          if (r.status) {
            this.$message.success("添加成功")
            this.changeSearch()
          } else {
            this.$message({
              message: r.message,
              type: 'error'
            });
          }
        })
        this.close()
      },
      close() {
        this.isShow = false;
        this.changeSearch()
      },
    }
  };
</script>
<style scoped lang="scss">
  .mt30 {
    margin-top: 30px;
  }

  p.text {
    font-size: 12px;
    color: rgba(59, 59, 59, 1);
    line-height: 16px;
    text-align: left;
    margin: 0 10px;
    white-space: pre-wrap;
  }

  .w80 {
    width: 80px !important;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }
</style>