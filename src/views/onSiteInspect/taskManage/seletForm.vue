<template>
  <el-dialog
    title="选择要点表"
    :visible.sync="showTip"
    width="40%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="content clear_a"  v-loading="loading">
      <div>
        <el-input
          placeholder="搜索"
          class="w250 seekIpt"
          v-model="queryLimit.name"
          maxlength="30"
          @keyup.enter.native="searchTab"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTab"></i>
        </el-input>
      </div>
      <ul class="clear_a" > 
        <li  v-for="(item,index) in tableData" :class="{'active':selectIndex == index}"  :key="index" @click="select(index,item)">
          <p class="title mb10">{{item.name}}</p>
          <div class="row">
            <div class="box clear_a">
              <div class="text_title">核查项目个数:</div>
              <div class="text_hidden">{{item.projectNum}}</div>
            </div>
            <div class="box clear_a"> 
              <div class="text_title">核查内容个数:</div>
              <div class="text_hidden">{{item.contentNum}}</div>
            </div>
          </div>
          <div class="box clear_a">
            <div class="text_title">更新日期:</div>
            <div class="text_hidden">{{item.updateTime}}</div>
          </div>
          <div class="box clear_a">
            <div class="text_title">适用类型:</div>
            <div class="text_title longText">{{item.businessType}}</div>
          </div>
        </li>
      </ul>
      <div class="pagination-box mt20 fr">
        <el-pagination
          background
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="queryLimit.pageNum"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="queryLimit.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="addConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from '../../../api/xchc/index';
export default {
  props: {
    showTip: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      queryLimit: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status:'YES'
      },
      selectIndex:null,
      total: 0,
      tableData: [],
      id:'',
      name:'',
      loading:false
    }
  },
  methods: {
    handleClose() {
      this.$emit("cancel")
    },
    addConfirm(){
      this.$emit("addConfirm",this.id,this.name) 
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
      this.queryLimit.pageNum =1 
      this.getPageList()
    },
    async getPageList() { 
        this.loading = true
        let result = await api.manageList(this.queryLimit)
        this.tableData = result.data.list
        this.total = result.data.total
        this.loading = false
    },
    select(index,item){
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
  >ul{
    width: 100%;
  }
  > ul > li {
    width: calc(calc(100% - 20px) / 2); 
    height: 178px;
    margin: 20px 20px 0 0;
    border: 1px solid rgba(194, 202, 210, 1);
    padding: 20px;
    box-sizing: border-box;
  }
  > ul > li:nth-child(2n) {
    margin-right: 0;
  }
  .box {
    margin-bottom: 10px;
    .text_title {
      font-size: 12px;
      color: #797f85; 
      font-weight: 400;
      line-height: 18px;
      float: left;
      margin-right: 5px;
    } 
    .text_hidden {
      @extend .text_title;
      display: inline-block; 
      border:1px solid white;
      margin-top: 1px;
    }
    .longText {
      float: left; 
      width: 70%;
      overflow: hidden; 
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-left: 22rpx;
    }
  }
  .active{
    background:rgba(247,253,255,1);
    border:1px solid rgba(13,181,239,1);    
  }
}
</style>
