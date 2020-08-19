<template>
  <div>
    <el-input placeholder="名称，编码，账号，社会信用代码" class="w260 seekIpt" v-model="subName" @keyup.native="seekEnter">
      <i slot="suffix" class="el-input__icon el-icon-search" @click="seekEnter"></i>
    </el-input>
    <el-select class="w150 ml20" v-model="subName" placeholder="设备状态">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-table class="mt20 table-div" :data="tableData">
      <el-table-column show-overflow-tooltip prop="date" label="序号" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="二维码编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="注册代码" min-width="130"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="使用登记证号" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="设备状态" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="使用地址" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="楼盘名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="所属区县" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="所属街道" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="使用场所" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="单位内部编号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="检验单位" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="检验时间" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="检验结论" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="下次检验日期" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="维保单位" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="最近维保日期" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="电梯名称" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="设备类别" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="设备品种" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="制造单位" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="date" label="安装单位" min-width="80"></el-table-column>
      <el-table-column min-width="250" label="操作" fixed="right">
        <template slot-scope="scope">
          <a style="color: #1787AD;cursor:pointer" @click="">编辑</a>
          <a style="color: #1787AD;cursor:pointer" @click="">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box mt20">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="pageSizeChange"
        @current-change="pagecCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        subName: '',        
        options: [
          {
            value: '选项1',
            label: '启用'
          }, {
            value: '选项2',
            label: '禁用'
          }
        ],
        tableData: [{
          date: '1'
        }],
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 50
        },
      }
    },
    mounted() {
    },
    methods: {
      seekEnter() {

      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
      },
    },
    components: {
    }
  }
</script>

<style scoped lang="sass">
  .pagination-box{
    text-align: right;
  }
</style>