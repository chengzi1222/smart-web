<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="user-box">
      <div class="page-tilt">
        <b></b><span>主体考核情况</span>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <select-area-grid v-model="areaCodes" class="w150" style="margin-right: 20px;" placeholder="辖区机构(全部)" @change="selectAreaGrid"></select-area-grid>
      <el-select class="selectHeight" v-model="searchMap.entityTypes" multiple collapse-tags clearable placeholder="主体类型" @change="entityTypeChange">
        <el-option v-for="item in entityTypeSelect" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="selectHeight" v-model="searchMap.natureTypes" multiple collapse-tags clearable placeholder="证照类型" @change="natureTypeChange">
        <el-option v-for="item in natureTypeSelect" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>

      <div class="floatR" style="width:53%;">
        <el-button class="selectHeight floatR" type="primary" @click="exportCurrent">导出当前页</el-button>
        <el-button class="selectHeight floatR" type="primary" @click="exportAll">导出所有</el-button>
      </div>
    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData"  :border="true" :resizable="true"  @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="90" label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="90" label="许可证编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="80" label="社会信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="countyDeptName" min-width="80" label="所属区县"></el-table-column>
        <el-table-column show-overflow-tooltip prop="syjDeptName" min-width="80" label="所属街道"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gridDeptName" min-width="60" label="所属网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="totalPatrol" min-width="60" label="应巡查" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="endPatrol" min-width="60" label="已巡查" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="waitPatrol" min-width="80" label="待巡查"  sortable='custom'></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="toEntityInfo(scope.row)" class="operate-a">查看主体</a>
            <a href="javascript:;" @click="toEntityEdit(scope.row)" class="operate-a">编辑主体</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { exportAll, page, exportCurrent } from 'api/patrol/PatrolPerformanceAppraisal'
import SelectAreaGrid from "components/common/SelectAreaGrid"
import { getEnums, downloadFile } from 'api/common'
import { INFO_TYPE } from "views/cfda/workflow/workUtil"
export default {
  mounted() {
    this.searchMap.taskId = this.$route.query.taskId
    getEnums(['com.ybveg.govx.enums.cfda.CfdaTypeEnum', 'com.ybveg.govx.enums.SubTypeEnum'],false).then((r) => {
      this.entityTypeSelect = r.data
    });
    getEnums(['com.ybveg.govx.enums.sub.NatureTypeEnum'],false).then((r) => {
      this.natureTypeSelect = r.data
    });
    this.searchPage()
  },
  methods: {
    async searchPage() {
      this.loading = true;
      page(this.page, this.searchMap).then(r => {
        this.loading = false;
        this.tableData = r.data.list
        this.page.total = r.data.total
      })
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
    selectAreaGrid (value) {
      if (value[value.length - 1]) {
        this.searchMap.areaCode = value[value.length - 1]
      } else {
        this.searchMap.areaCode = ''
      }
      this.searchMap.sort = ''
      this.searchMap.sortType = ''
      this.searchPage()
    },
    entityTypeChange () {
      this.searchMap.sort = ''
      this.searchMap.sortType = ''
      this.searchPage()
    },
    natureTypeChange () {
      this.searchMap.sort = ''
      this.searchMap.sortType = ''
      this.searchPage()
    },
    sortChange () {
      let order = arguments[0].order
      let prop = arguments[0].prop
      if (prop == 'totalPatrol') {
        prop = 'TOTAL_PATROL'
      } else if (prop == 'endPatrol') {
        prop = 'END_PATROL'
      } else if (prop == 'waitPatrol') {
        prop = 'WAIT_PATROL'
      } else {
        order = ''
        prop = ''
      }
      this.searchMap.sort = prop
      this.searchMap.sortType = order
      this.searchPage()
    },
    exportAll () {
      this.loading = true
      exportAll(this.searchMap).then(r => {
        this.loading = false
        if (r.status) {
          downloadFile(r.data.fileId, '主体考核情况表')
        } else {
          if (r.message) {
            this.$message.warning(r.message);
          } else {
            this.$message.warning("文件导出失败");
          }
        }
      })
    },
    exportCurrent () {
      this.loading = true
      exportCurrent(JSON.stringify(this.tableData)).then(r => {
        this.loading = false
        if (r.status) {
          downloadFile(r.data.fileId, '主体考核情况表')
        } else {
          if (r.message) {
            this.$message.warning(r.message);
          } else {
            this.$message.warning("文件导出失败");
          }
        }
      })
    },
    toEntityInfo (entity) {
      const type = entity.type
      const entityType = entity.entityType
      const entityId = entity.id
      if (type === 'CFDA') {
        this.$router.push({
          name: 'cfda.archives.detail',
          query: {
            id: entityId,
            // back: 'subject.map'
          }
        });
      } else if (type === 'ENTITY') {
        this.$router.push({
          name: "subject.archives.detail",
          params: {
            type: entityType,
          },
          query: {
            id: entityId,
          }
        })
      }
    },
    toEntityEdit (entity) {
      const type = entity.type
      const entityType = entity.entityType
      const entityId = entity.id
      if (type === 'CFDA') {
        this.$router.push({
          name: 'cfda.archives.change',
          query: {
            cfdaId: entityId,
            type: INFO_TYPE.edit,
            back: 'cfda.archives'
          }
        })
      } else if (type === 'ENTITY') {
        this.$router.push({
          name: "subject." + entityType.toLowerCase() + ".change", 
          query: {
            entityId: entityId
          }
        })
      }
    }
  },
  components: {
    SelectAreaGrid
  },
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      areaCodes: [],
      searchMap: {
        areaCode: '',
        entityTypes: [],
        natureTypes: [],
        sort: '',
        sortType: ''
      },
      entityTypeSelect:[],
      natureTypeSelect:[],
      loading : false
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
