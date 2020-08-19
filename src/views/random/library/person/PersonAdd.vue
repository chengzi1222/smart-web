<template>
  <el-dialog title="批量添加人员" custom-class="stg-dialog" top="8vh" :close-on-click-modal="false" :modal-append-to-body="false" width="65%" :visible="visible" style="padding: 10px;" @close="close" @open="open">
    <div>
      <el-input placeholder="请输入姓名或者手机号" class="w260 seekIpt" v-model="search" @keyup.enter.native="searchChange">
        <i slot="suffix" @click="searchChange" class="el-input__icon el-icon-search"></i>
      </el-input>
      <area-select style="margin-left:20px;" v-model="searchParams.deptCodes" placeholder="所属部门"> </area-select>

    </div>
    <el-table :data="data" class="table-div" ref="table" size="mini" max-height="340" @selection-change="handleSelectionChange" @row-click="toggleSelected">
      <el-table-column show-overflow-tooltip type="selection" label=""></el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="手机号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userDeptName" label="所属部门"></el-table-column>
    </el-table>
    <yuanben-page :page="page" @size-change="pageSizeChange" @current-change="pageCurrentChange" style="margin-top:10px;"></yuanben-page>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :disabled="showFrom" @click="confrim">确 定</el-button>
    </div>
    <add-from :visible.sync="showFrom" @submit="submit"></add-from>
  </el-dialog>
</template>

<script>

import AreaSelect from 'components/common/AreaSelect'
import YuanbenPage from 'components/common/YuanbenPage'
import * as api from 'api/random/person'
import AddFrom from './AddFrom'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    YuanbenPage, AddFrom, AreaSelect
  },
  methods: {
    searchChange() {
      if (this.search !== this.searchParams.search) {
        this.searchParams.search = this.search
      }
    },
    handleSelectionChange(seleced) { this.selectData = seleced },
    toggleSelected(row, event, column) {
      let isSelected = false;
      this.selectData.forEach(v => {
        if (v.id == row.id) {
          isSelected = true;
          return;
        }
      })
      this.$refs.table.toggleRowSelection(row, !isSelected)
    },
    pageSearch() {
      api.pageOfadd(this.searchParams, this.page.pageSize, this.page.pageNum).then(results => {
        if (results.status) {
          const { list, pageSize, pageNum, total } = results.data
          this.data = list;
          this.page = {
            pageSize, pageNum: pageNum || 1, total,
          }
        }
      })
    },
    pageCurrentChange(num) {
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
    fromClose() {
      this.showFrom = false;
    },
    close() {
      if (this.addSuccess) {  // 如果添加成功过 关闭窗口需要刷新父页面数据
        this.$emit('reload');
        this.addSuccess = false;
      }
      this.$emit('update:visible', false);   // 双向绑定
      this.searchParams = { search: "", deptCodes: [] };
      this.search = "";
      this.addSuccess = false;
    },
    open() {
      this.page = {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      }
      this.pageSearch() // watch 内触发了
    },
    confrim() {
      if (this.selectData && this.selectData.length > 0) {
        this.showFrom = true;
      } else {
        this.$message("请选择添加人员!");
      }
    },
    submit(model) {

      const data = [];
      this.selectData.forEach(item => {
        const obj = Object.assign({}, model, {
          userId: item.id,
          areaCode: item.areaCode
        });
        data.push(obj);
      })
      api.add(data).then(result => {
        if (result.status) {
          this.showFrom = false;
          this.addSuccess = true;
          this.selectData = []
          this.pageSearch();
          this.$message({ message: '添加成功!', type: 'success' })
        } else {
          this.$message({ message: result.message || '添加失败!', type: result.level })
        }
      })

    }
  },
  watch: {
    searchParams: {
      handler: function () {
        if (this.visible) {
          this.pageSearch();
        }
      },
      deep: true
    },
  },
  data() {
    return {
      addSuccess: false,  // 是否添加成功过
      showFrom: false,
      data: [],
      selectData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      search: "",
      searchParams: { search: "", deptCodes: [] },
    }
  },
}
</script>

<style scoped lang="sass">
.table-div {
  margin-top: 5px;
  text-align: center;
}
</style>
