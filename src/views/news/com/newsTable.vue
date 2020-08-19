<template>
  <div class="user-box">
    <div class="ipt-btn-box" style="justify-content: start;">
      <el-input placeholder="标题" class="w250 seekIpt" v-model="search" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <el-select class="selectHeight" v-model="type.key" placeholder="类型" @change="changeViewType(type.key)">
        <el-option v-for="item in type.array" :key="item.key" :label="item.value" :value="item.key">
        </el-option>
      </el-select>
      <el-select class="selectHeight" v-model="typeFlag.id" placeholder="资讯标签" @change="changeNewsType(typeFlag.id)">
        <el-option v-for="item in typeFlag.array" :key="item.id" :label="item.type_name" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="selectHeight" v-model="releaseType" placeholder="发布端类型" @change="changeNewsType()">
        <el-option v-for="item in releaseTypeEnumList" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="selectHeight" style="position: absolute;right: 38px;" type="primary" @click="add">
        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加
      </el-button>
    </div>
    <div class="tabOffTop50">
      <el-table :data="tableData" @sort-change="sortChange" class="table-div">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="title" min-width="250" label="标题"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pub_dept_name" min-width="90" label="发布部门"></el-table-column>
        <el-table-column show-overflow-tooltip prop="view_type_name" min-width="120" label="类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="type_name" min-width="100" label="资讯标签"></el-table-column>
        <el-table-column show-overflow-tooltip prop="release_type_str" min-width="100" label="发布端类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="local_url" min-width="100" label="本地链接"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pub_yes_name" min-width="140" label="发布状态"></el-table-column>
        <el-table-column show-overflow-tooltip prop="pub_time" min-width="140" label="发布时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="update_time" min-width="140" label="更新时间"></el-table-column>
        <el-table-column label="操作" min-width="250">
          <template slot-scope="scope">
            <button class="clipbtn operate-a" style="cursor:pointer;font-siz: 12px;" @click="copyUrl()" :data-clipboard-text="scope.row.local_url">
              复制链接
            </button>
            <a href="javascript:" @click="detail(scope.row)" class="operate-a">详情</a>
            <a href="javascript:" @click="edit(scope.row)" v-if="scope.row.edit_yes" class="operate-a">编辑</a>
            <a href="javascript:" @click="del(scope.row)" v-if="scope.row.edit_yes" class="operate-a">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum"
          :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import * as newsApi from 'api/news/news';
  import Clipboard from 'clipboard';
  import { getEnums } from 'api/common.js';

  export default {
    props: ["newsTypeList", "viewTypeList"],
    created() {
      /*保证其他子组件切换过来时有值*/
      this.type.array = this.viewTypeList;
      this.typeFlag.array = this.newsTypeList;
    },
    watch: {
      /*保证父组件数据更新时有值*/
      viewTypeList(val) {
        this.type.array = val;
      },
      newsTypeList(val) {
        this.typeFlag.array = val;
      }
    },
    mounted() {
      getEnums(['com.ybveg.govx.enums.newscenter.NewsReleaseType'], false).then(r => {
        if (r.status) {
          this.releaseTypeEnumList = r.data
          this.releaseTypeEnumList.unshift({"name": "全部发布端类型", "key": ""})
        } else {
          this.$message.warning(r.message)
        }
      })
      this.listNewsSearch();
    },
    methods: {
      listNewsSearch(num = 1) {
        let search = {
          newsTypeIds: [this.typeFlag.id],
          viewTypes: [this.type.key],
          title: this.search,
          releaseType: this.releaseType,
          pageNum: this.page.pageNum || 1,
          pageSize: this.page.pageSize || 10
        };
        newsApi.listNews(search).then((results) => {
          console.log(results.data);
          this.page.total = results.data.total;
          this.tableData = results.data.list;
        });
      },
      add() {
        this.$router.push({ name: "news.add" });
      },
      copyUrl() {

        var clipboard = new Clipboard('.clipbtn');

        /* console.log("查看复制对象：")
         console.log(clipboard)*/
        clipboard.on('success', e => {
          this.$message.success('资讯链接复制成功！');
          // 释放内存
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          this.$message.error('该浏览器不支持自动复制，资讯链接复制失败！');
          // 释放内存
          clipboard.destroy()
        })

      },
      detail(d) {
        this.$router.push({ name: "news.newsDetail", query: { id: d.id } });
      },
      edit(d) {
        this.$router.push({ name: "news.edit", query: { id: d.id, view_type: d.view_type } });
      },
      // 软删除资讯
      del(d) {
        this.$confirm('是否确认删除该资讯?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(d.id);
          newsApi.del({ ids: ids.toString() }).then((r) => {
            if (r.status) {
              this.$message.success("资讯删除成功！");
            } else {
              this.$message.error("资讯删除失败！");
            }
            this.listNewsSearch(this.page.pageNum);
          });
        });
      },
      sortChange(column) {
        //根据组件里面的返回的字段设置排序，更新表格
        if (column.order == 'ascending') {
          this.dateSort = 'ASC';
        }
        if (column.order == 'descending') {
          this.dateSort = 'DESC'
        }
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.listNewsSearch();
      },
      pageCurrentChange(num) {//改变页数
        this.page.pageNum = num;
        this.listNewsSearch();
      },
      pageSizeChange(size) {//改变每一页显示的条数
        this.page.pageSize = size;
        this.listNewsSearch();
      },
      changeViewType(key) {
        this.listNewsSearch();
      },
      changeNewsType(key) {
        this.listNewsSearch();
      }
    },
    components: {

    },
    data() {
      return {
        releaseTypeEnumList: [],
        releaseType: "",
        search: "",
        type: {
          array: [],
          key: ''
        },
        typeFlag: {
          array: [],
          id: ''
        },
        tableData: [],
        dateSort: "DESC",
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
      }
    }
  }
</script>


<style scoped lang="sass">
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