<template>
  <el-dialog title="选择要点表" :visible.sync="showTip" width="780px" :modal-append-to-body="false"
    :close-on-click-modal="false" :before-close="handleClose">
    <div class="content clear_a" v-loading="loading">
      <div>
        <el-input placeholder="搜索" class="w250 seekIpt" v-model="queryLimit.name" maxlength="30"
          @keyup.enter.native="searchTab">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
        </el-input>
      </div>
      <ul class="clear_a">
        <li v-for="(item,index) in tableData" :class="{'active':selectIndex == index}" :key="index"
          @click="select(index,item)">
          <p class="title mb10">{{item.name}}</p>
          <el-row class='box'>
            <el-col :span="12">
              <div>检查项目个数：{{item.projectNum}}</div>
            </el-col>
            <el-col :span="12">
              <div>检查内容个数：{{item.contentNum}}</div>
            </el-col>
          </el-row>
          <el-row class='box'>
            <el-col :span="24">
              <div>更新日期：{{item.createTime}}</div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div class="pagination-box mt20 fr">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange"
          :current-page="queryLimit.pageNum" :page-sizes="[6, 12, 18, 24,30]" :page-size="queryLimit.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import * as api from "api/rating/restaurantRating";
  export default {
    props: {
      showTip: {
        type: Boolean,
        default: true
      },
      businessType: {
        type: String,
        default: 'CFDARESTAURANT'
      },
    },
    data() {
      return {
        queryLimit: {
          pageNum: 1,
          pageSize: 6,
          name: '',
          status: 'ENABLE',
          type:'DYNAMIC',
          businessType:''
        },
        selectIndex: null,
        total: 0,
        tableData: [],
        id: '',
        name: '',
        loading: false
      }
    },
    methods: {
      handleClose() {
        this.$emit("cancel")
      },
      addConfirm() {
        this.$emit("addConfirm", this.id, this.name)
      },
      pageSizeChange(size) {
        this.queryLimit.pageSize = size
        this.getPageList()
      },
      pageCurrentChange(num) {
        this.queryLimit.pageNum = num
        this.getPageList()
      },
      searchTab() {
        this.queryLimit.pageNum = 1
        this.getPageList()
      },
      async getPageList() {
        this.loading = true
        this.queryLimit.businessType=this.businessType;
        let result = await api.manageList(this.queryLimit)
        this.tableData = result.data.list
        this.total = result.data.total
        this.loading = false
      },
      select(index, item) {
        this.selectIndex = index
        this.id = item.id
        this.name = item.name
      }
    },
    mounted() {
      this.getPageList()
    }
  }
</script>
<style lang="scss" scoped>
  .content {
    >ul {
      width: 100%;
    }

    >ul>li {
      width: calc(calc(100% - 20px) / 2);
      height: 110px;
      margin: 20px 20px 0 0;
      border: 1px solid rgba(194, 202, 210, 1);
      padding: 20px 10px 20px 20px;
      box-sizing: border-box;
    }

    >ul>li:nth-child(2n) {
      margin-right: 0;
    }

    .box {
      margin-bottom: 10px;
      font-size: 12px;
      color: #797f85;
      font-weight: 400;
      line-height: 18px;
    }

    .active {
      background: rgba(247, 253, 255, 1);
      border: 1px solid rgba(13, 181, 239, 1);
    }
  }
</style>