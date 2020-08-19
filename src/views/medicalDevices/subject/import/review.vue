<template>
  <div class="user-box">
    <div class="ipt-btn-box clear_a">
      <el-input :placeholder="searchMap.entityType=='MAAI_PRODUCT'?'许可证编号、主体名称、社会信用代码':'主体名称、社会信用代码'"
                class="w250 seekIpt" v-model="searchMap.keysWork" @keyup.enter.native="">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="pageSearch"></i>
      </el-input>
      <enum-select class="selectHeight" v-if="searchMap.entityType=='COSMETIC_PRODUCT'" multiple
                   v-model="searchMap.licState" placeholder="许可证状态" enum="com.ybveg.govx.enums.LicenceStateEnum"
                   @change="pageSearch"></enum-select>
      <enum-select class="selectHeight" multiple v-model="searchMap.instruRank" v-if="searchMap.entityType=='MAAI_PRODUCT'"
                   placeholder="生产类别" enum="com.ybveg.govx.enums.maai.MaaiInstruRankEnum"
                   @change="pageSearch"></enum-select>
      <enum-select class="selectHeight" multiple v-model="searchMap.instruRank" v-if="searchMap.entityType=='MAAI_EMPLOY'"
                   placeholder="使用类别" enum="com.ybveg.govx.enums.maai.MaaiInstruRankEnum"
                   @change="pageSearch"></enum-select>
      <enum-select class="selectHeight" multiple v-model="searchMap.instruRank" v-if="searchMap.entityType=='MAAI_MANAGER'"
                   placeholder="经营类别" enum="com.ybveg.govx.enums.maai.MaaiInstruRankEnum"
                   @change="pageSearch"></enum-select>
      <select-area-grid class="selectHeight" placeholder="所属区域" @change="areaCodeChange"></select-area-grid>
      <div class="selBox">
        <el-button class="selectHeight" type="primary" @click="reviews">批量审核</el-button>
        <el-button class="selectHeight" type="primary" @click="dels">批量删除</el-button>
      </div>
    </div>
    <div class="tabOffTop120">
      <el-table @sort-change="sortChange" :border="true" :resizable="true" :data="tableData"
                @selection-change="selectChange" class="table-div">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="160" label="*主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="multNo" min-width="120"
                         v-if="searchMap.entityType=='MAAI_MANAGER'" label="多证合一编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="category" min-width="120"
                         v-if="searchMap.entityType=='MAAI_PRODUCT'" label="生产类别"></el-table-column>
        <el-table-column show-overflow-tooltip prop="category" min-width="120"
                         v-if="searchMap.entityType=='MAAI_EMPLOY'" label="使用类别"></el-table-column>
        <el-table-column show-overflow-tooltip prop="category" min-width="120"
                         v-if="searchMap.entityType=='MAAI_MANAGER'" label="经营类别"></el-table-column>
        <el-table-column show-overflow-tooltip prop="productLic" min-width="120"
                         v-if="searchMap.entityType=='MAAI_PRODUCT'" label="生产许可编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="oneLic" min-width="120" v-if="searchMap.entityType=='MAAI_PRODUCT'"
                         label="Ⅰ类生产备案编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="threeLic" min-width="120"
                         v-if="searchMap.entityType=='MAAI_MANAGER'" label="Ⅲ类备案编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="twoLic" min-width="120" v-if="searchMap.entityType=='MAAI_MANAGER'"
                         label="Ⅱ类备案编号"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="oneLic" min-width="120" v-if="searchMap.entityType=='MAAI_MANAGER'"
                         label="Ⅰ类备案编号"></el-table-column> -->
        <el-table-column show-overflow-tooltip prop="creditCode" min-width="100" label="社会统一信用代码"></el-table-column>
        <el-table-column show-overflow-tooltip prop="registerAddr" min-width="100" label="*经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="countyName" min-width="140" label="*所属区"></el-table-column>
        <el-table-column show-overflow-tooltip prop="syjName" min-width="140" label="*所属街道"></el-table-column>
        <el-table-column show-overflow-tooltip prop="gridName" min-width="140" label="*所属网格社区"></el-table-column>
        <el-table-column show-overflow-tooltip prop="manageStateStr" min-width="100" label="营业状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="100" sortable='custom'
                         label="创建时间"></el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" @click="review(scope.row.id)" class="operate-a">审核</a>
            <!-- <a href="javascript:;" @click="edit(scope.row.id)" class="operate-a">编辑</a> -->
            <a href="javascript:;" @click="info(scope.row)" class="operate-a">查看</a>
            <a href="javascript:;" @click="del(scope.row.id)" class="operate-a">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="page.pageNum"
                       :page-sizes="[10, 50, 100, 300, 500]"
                       :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="page.total"
                       @size-change="pageSizeChange"
                       @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';
  import YuanbenPage from 'components/common/YuanbenPage'
  import {getEnums} from 'api/common'
  import {del, page, review} from 'api/medicalDevices/importentity'

  export default {

    mounted() {
      if (!this.entityType) {
        return
      }
      this.searchMap.entityType = this.entityType.toUpperCase()
      this.pageSearch()
    },
    props: {
      entityType: {
        type: String
      }
    },
    methods: {
      pagecCurrentChange(num) {
        if (num !== this.page.pageNum) {
          this.page.pageNum = num;
          this.pageSearch()
        }
      },
      pageSizeChange(size) {
        if (size !== this.page.pageSize) {
          this.page.pageSize = size;
          this.pageSearch()
        }
      },
      pageSearch() {
        page(this.page, this.searchMap).then(r => {
          this.tableData = r.data.list
          this.page.total = r.data.total
        })
      },
      areaCodeChange(value) {
        if (value[value.length - 1]) {
          this.searchMap.areaCode = value[value.length - 1]
        } else {
          this.searchMap.areaCode = ''
        }
        this.pageSearch()
      },
      sortChange() {
        // descending下降 ascending上升
        this.searchMap.sort = arguments[0].order
        this.pageSearch()
      },
      review(id) {
        this.$confirm('是否确认审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(id)
          review(ids).then(r => {
            if (r.data.error === 0) {
              this.$message.success("审核成功")
              this.pageSearch()
            } else {
              this.$message.warning("审核失败，原因：" + r.data.message)
            }
          })
        })
      },
      reviews() {
        this.$confirm('是否确认审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if (this.selectRow.length === 0) {
            this.$message.warning("未选中主体")
            return
          }
          let ids = new Array()
          for (var i = 0; i < this.selectRow.length; i++) {
            ids.push(this.selectRow[i].id)
          }
          review(ids).then(r => {
            this.$message.success("批量审核主体总数：" + r.data.total + ",审核成功数：" + r.data.success + ",审核失败数：" + r.data.error)
            this.pageSearch()
          })
        })
      },
      info(row) {
        this.$emit('changeTab', 'info', row.id)
      },
      edit(id) {

      },
      del(id) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let ids = new Array()
          ids.push(id)
          del(ids).then(r => {
            this.$message.success("删除成功")
            this.pageSearch()
          })
        })
      },
      dels() {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if (this.selectRow.length === 0) {
            this.$message.warning("未选中主体")
            return
          }
          let ids = new Array()
          for (var i = 0; i < this.selectRow.length; i++) {
            ids.push(this.selectRow[i].id)
          }
          del(ids).then(r => {
            this.$message.success("删除成功")
            this.pageSearch()
          })
        })
      },
      selectChange(selection) {
        this.selectRow = selection
      }
    },
    components: {SelectAreaGrid, EnumSelect, YuanbenPage},
    computed: {},
    data() {
      return {
        searchMap: {
          keysWork: '',
          areaCode: '',
          sort: '',
          entityType: '',
          licState: [],
          instruRank: [],
        },
        tableData: [],
        selectRow: [],
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  .ipt-btn-box {
    margin: 20px 0;
    overflow: hidden;
  }

  .selBox {
    text-align: right;
    width: 220PX;
    float: right;
  }

  .selBox button {
    float: right;
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
