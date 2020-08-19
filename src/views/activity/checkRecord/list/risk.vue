<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <div class="user-box">
      <div class="ipt-btn-box" style="justify-content: end;">
        <el-input placeholder="接待单位名称、记录编号" class="w250 seekIpt" v-model="search" @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>
        <el-select class="selectHeight" v-model="sel.result" clearable placeholder="检查结果" @change="searchTab">
          <el-option v-for="item in sel.resultList" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-select class="selectHeight" v-model="sel.treat" clearable placeholder="处理方式" @change="searchTab">
          <el-option v-for="item in sel.treatList" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-select class="selectHeight" v-model="sel.rectifyState" clearable placeholder="整改情况" @change="searchTab">
          <el-option v-for="item in sel.rectifyStateList" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="tabOffTop50">
        <el-table :data="tableData" :border="true" :resizable="true" @sort-change="sortChange" class="table-div">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entity_name" min-width="100" label="主体名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="patrol_no" min-width="90" label="检查记录编号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="so_users_str" min-width="80" label="监督人员"></el-table-column>
          <el-table-column show-overflow-tooltip prop="result_name" min-width="60" label="检查结果"></el-table-column>
          <el-table-column show-overflow-tooltip prop="treat_name" min-width="60" label="处理方式"></el-table-column>
          <el-table-column show-overflow-tooltip prop="rectify_state_name" min-width="60" label="整改情况"></el-table-column>
          <el-table-column show-overflow-tooltip prop="rectify_remark" min-width="90" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip prop="patrol_time" min-width="80" label="检查时间" sortable='custom'></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <a href="javascript:" @click="detail(scope.row)" class="operate-a">详情</a>
              <a href="javascript:" class="operate-a" @click="printRecord(scope.row.id, true)">打印预览</a>
              <a href="javascript:" class="operate-a" @click="printRecord(scope.row.id, false)">打印</a>
              <a href="javascript:" class="operate-a" v-if="scope.row.rectify_state == 'TODO'" @click="openRectify(scope.row)">整改</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum"
            :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
      <!-- 弹框 -->
      <yb-popup @close="cancelRectify()" :isShow="popShow" title="整改" width="370">
        <div slot="body">
          <el-form label-width="110px" :model="dto" ref="ruleForm">
            <div class="row">
              <el-form-item label="整改备注" prop="">
                <el-input type="textarea" :rows="5" :maxlength="200" placeholder="请输入整改备注,选填" v-model="dto.rectifyRemark">
                </el-input>
                <el-input type="hidden" v-model="dto.id">

                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="foot" style="height:32px;">
          <el-button @click="cancelRectify()">取消</el-button>
          <el-button type="primary" @click="chose">整改通过</el-button>
        </div>
      </yb-popup>
    </div>

    <!-- 打印组件 -->
    <tablePrint ref="tablePrint" :resultData="infoData" :patrolType="'重大活动保障每日检查'"></tablePrint>
  </div>
</template>

<script>

  import * as risk from 'api/activity/risk';
  import YbPopup from 'components/ybpopup/YbPopup';
  import tablePrint from '../detail/riskTablePrint.vue'
  import { doPrintRecord } from 'utils/print/doPrint.js'


  export default {
    mounted() {
      risk.webInit().then(r => {
        this.sel.resultList = r.data.patrolResultList;
        this.sel.treatList = r.data.patrolTreatList;
        this.sel.rectifyStateList = r.data.rectifyStateList;
        this.searchPage();
      });
    },
    methods: {
      /* 打印 */
      async printInitData(id) {
        this.qrcodeId = id
        await risk.detail({ id: id }).then(r => {
          this.infoData = r.data
          let quanLevel = "";
          if (this.infoData.patrolDetail.quan_level) {
            quanLevel = this.infoData.patrolDetail.quan_level;
          } else {
            quanLevel = this.infoData.taskEntity.quan_level;
          }
          this.infoData.quanLevel = quanLevel;
          console.log(this.infoData)

        })
      },

      async printRecord(id, isPreview) {
        this.loading = true
        await this.printInitData(id)
        setTimeout(() => {
          doPrintRecord(isPreview)
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }, 2000)
      },

      sortChange(column) {
        if (column.order == 'ascending') {
          this.sort = 'ASC';
        }
        if (column.order == 'descending') {
          this.sort = 'DESC'
        }
        this.searchTab();
      },
      // 打开整改弹出框
      openRectify(dt) {
        this.popShow = true;
        this.dto.id = dt.id;
        this.dto.rectifyRemark = dt.rectify_remark;
      },
      //关闭整改弹出框
      cancelRectify() {
        this.popShow = false;
        this.dto.id = '';
        this.dto.rectifyRemark = '';
      },
      //提交整改
      chose() {
        // const paramsData = new FormData();
        // paramsData.append('dto', this.dto);
        // 整改通过，修改检查记录中整改状态
        let formData = {
          dtoJson: JSON.stringify(this.dto)
        };
        risk.rectify(formData).then(r => {
          if (r.status) {
            this.$message.success("操作成功！");
            this.popShow = false;
            this.pagecCurrentChange(this.page.pageNum);
          } else {
            this.popShow = true;
            this.$message.error("操作失败！");
          }
        });
      },

      handleIconClick() { //搜索框按钮点击搜索
        this.searchTab();
      },
      async searchPage() {
        this.loading = true;
        const params = new FormData();
        params.append('pageSize', this.page.pageSize);
        params.append('pageNum', this.page.pageNum);
        params.append('taskId', this.taskId);
        //  params.append('taskId', 'f72b96ce8e3e43d38d91aaf3b75cdcb9');
        // params.append('taskId', 'f72b96ce8e3e43d38d91aaf3b75cdcb9');
        params.append('search', this.search);
        params.append('result', this.sel.result);
        params.append('treat', this.sel.treat);
        params.append('rectifyState', this.sel.rectifyState);
        risk.list(params).then(r => {
          this.loading = false;
          this.tableData = r.data.list;
          this.page.total = r.data.total;
        })
      },
      searchTab() {
        this.page.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      // 查看详情
      detail(d) {
        this.$router.push({ name: "record.riskDetail", query: { id: d.id } });
      }
    },
    components: {
      YbPopup,
      tablePrint
    },
    data() {
      return {
        loading: false,
        infoData: {},
        taskId: this.$route.query.taskId,
        dto: {
          id: '',
          rectifyRemark: ''
        },
        search: '',
        sort: 'DESC',
        tableData: [],
        popShow: false,
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        sel: {
          result: '',
          treat: '',
          rectifyState: '',
          patrolDate: '',
          resultList: [],
          treatList: [],
          rectifyStateList: [],
          patrolDateList: []
        },
      }
    }
  }
</script>


<style scoped lang="sass">
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
</style>