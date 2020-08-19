<template>
  <div>
    <div>
      <el-input placeholder="请输入姓名" class="w200 selectHeight seekIpt" v-model="search" @keyup.enter.native="searchChange">
        <i slot="suffix" @click="searchChange" class="el-input__icon el-icon-search"></i>
      </el-input>

      <area-select class="selectHeight w250" v-model="searchParams.deptCodes" placeholder="所属部门"> </area-select>

      <enum-select class="selectHeight" multiple v-model="searchParams.biz" placeholder="分管业务" enum="com.ybveg.govx.enums.SubTypeEnum"></enum-select>

      <enum-select class="selectHeight w140" v-model="searchParams.leader" placeholder="是否组长" enum="com.ybveg.govx.enums.YesNoEnum"></enum-select>

      <el-button class="selectHeight fr" v-auth="'food.library.person|func.add'" @click="batchRemove(selectData)" icon="el-icon-delete" type="primary">
        批量移除
      </el-button>

      <el-button class="selectHeight fr" v-auth="'food.library.person|func.add'" @click="showAdd = true" icon="el-icon-plus" type="primary">
        添加执法人员
      </el-button>
    </div>
    <el-table :data="data" ref="table"  :border="true" :resizable="true"  highlight-current-row class="table-div" @selection-change="handleSelectionChange" @row-click="toggleSelected" v-loading="loading">
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="leaderLabel" label="是否组长"></el-table-column>
      <el-table-column show-overflow-tooltip prop="bizLabel" label="分管业务"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userDeptName" label="所属部门"></el-table-column>
      <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
      <template v-if="hasAuth('food.library.person|func.add')">
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <a href="javascript:" class="operate-a" @click.stop="edit(scope.row)">编辑</a>
            <a href="javascript:" class="operate-a" @click.stop="batchRemove([scope.row])">移除</a>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <yuanben-page :page="page" @size-change="pageSizeChange" @current-change="pageCurrentChange"></yuanben-page>

    <person-add :visible.sync="showAdd" @reload="pageSearch"></person-add>
    <add-from :modal="true" :data="editData" :visible.sync="showEdit" @submit="submitEdit"></add-from>
  </div>
</template>

<script>

import AddFrom from './AddFrom'
import AreaSelect from 'components/common/AreaSelect'
import YuanbenPage from 'components/common/YuanbenPage'
import PersonAdd from './PersonAdd'
import EnumSelect from 'components/common/EnumSelect'
import hasAuth from 'utils/checkAuth';
import * as api from 'api/random/person'

export default {
  components: {
    AreaSelect, EnumSelect, YuanbenPage, PersonAdd, AddFrom
  },
  mounted() {
    this.pageSearch();
  },
  methods: {
    hasAuth,
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
      this.loading=true;
      api.page(this.searchParams, this.page.pageSize, this.page.pageNum).then(results => {
        this.loading=false;
        if (results.status) {
          this.selectData = [];
          const { list, pageSize, pageNum, total } = results.data;
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
    edit(row) {
      const { id, userDeptName, userName, leader, biz, remark } = row;
      this.editData = {
        id,
        userDeptName,
        userName,
        leader: leader === 'YES',
        biz: biz.split(","),
        remark
      };
      this.showEdit = true
    },
    submitEdit(model) {
      api.update(model).then(result => {
        if (result.status) {
          this.$message({ message: '编辑成功!', type: 'success' });
          this.showEdit = false;
          this.data.forEach(item => {
            if (item.id === model.id) {
              Object.assign(item, model);
              return;
            }
          })
        } else {
          this.$message({ message: result.message, type: result.level })
        }
      });
    },
    batchRemove(datas) {
      let sum = datas.length;
      if (datas && sum > 0) {
        const userNames = [];
        const ids = [];
        datas.forEach(item => {
          userNames.push(item.userName)
          ids.push(item.id)
        })
        this.$confirm(`确认移除以下人员:<br />${userNames.join(",")}`, {
          dangerouslyUseHTMLString: true,
          callback: (action) => {
            if (action === 'confirm') {
              api.batchRemove(ids).then(result => {
                if (result.status) {
                  let deleteSum = result.data.deleteSum;
                  if(sum == 1){
                    if(deleteSum == 1){
                      this.$message({ message: '该人员已经移除成功!', type: 'success' });
                    }else{
                      this.$message({ message: '该人员已被双随机检查任务占用，无法移除!', type: 'warning' });
                    }
                  }else{
                    let fail = sum - deleteSum;
                    if(fail == 0){
                      this.$message({ message: '该人员已经移除成功!', type: 'success' });
                    }else{
                      this.$confirm('已成功移除'+ deleteSum +'人，移除失败'+ fail +'人，失败原因：部分人员仍被双随机任务占用', '提示', {confirmButtonText: '确定',type: 'warning'}).
                      then(() => {}).catch(()=>{});
                    }
                  }
                  this.pageSearch();
                } else {
                  this.$message({ message: result.message, type: result.level })
                }
              });
            }
          }
        })
      } else {
        this.$message("请先选择要移除的人员!");
      }
    },
  },
  watch: {
    searchParams: {
      handler: function () {
        this.pageSearch();
      },
      deep: true
    }
  },
  data() {
    return {
      data: [],
      selectData: [],
      editData: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      showEdit: false,
      showAdd: false,
      search: "",
      selectDepts: [],
      searchParams: {
        search: "", // 用户名
        leader: "",    // 是否组长
        biz: "",       // 分管业务
        deptCodes: []      // 所在部门
      },
      loading: false,
    }
  },
}
</script>

<style scoped lang="sass">
.table-div {
  margin: 20px 0;
  text-align: center;
}
</style>
