 <template>
  <div class="bigbox">
    <div class="page-tilt"> 
      <b></b><span>{{$route.query.pathName}}</span>
    </div>
      <div class="sizer">
        <div>
          <el-input placeholder="参数类型名称" class="w260 seekIpt" v-model="keyWord" @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
          <el-button class="ml20 fr" @click="add" :loading="btnLoading" icon="el-icon-plus" type="primary">添加</el-button>
          <el-button class="fr" @click="batchDel" :loading="btnLoading">批量删除</el-button>
        </div>
      </div>
      <div class="dataBox">
        <el-table :data="tableData" class="table-div allDown" v-loading="tableLoading" @selection-change="selectionChange">
          <el-table-column show-overflow-tooltip width="60" type="selection" label="序号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="厂商编码" min-width="150">
            <template slot-scope="scope">
              <span>{{(pageObj.pageSize * (pageObj.pageNum - 1) + scope.$index + 1)}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="label" label="厂商名称" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.label?scope.row.label:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" fixed="right" label="操作" min-width="180">
            <template slot-scope="scope">
              <a href="javascript:;" @click="operate(scope, 'edit')" class="operate">编辑</a>
              <a href="javascript:;" @click="operate(scope, 'del')" class="operate">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fr mt20">
        <el-pagination background :current-page="pageObj.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="pageObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>

      <div v-if="isDialogShow">
        <el-dialog :title="title" :visible.sync="isDialogShow" :append-to-body="true" width="470px">
          <el-form class="mt30" :model="dialogForm" ref="dialogForm" label-width="100px">
            <el-form-item label="厂商编码">
              <span style="width: 170px">{{dialogForm.index}}</span>
            </el-form-item>
            <el-form-item label="厂商名称">
              <el-input v-model="dialogForm.label" style="width: 170px" maxlength="20" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="submit">保 存</el-button>
          </span>
        </el-dialog>
      </div>
  </div>
</template>

<script>
import * as sensorApi from "api/peri/sensor";
export default {
  data() {
    return {
        keyWord: '',
        tableLoading: false,
        tableData: [],
        btnLoading: false,
        pageObj: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        selection: [],
        title: '添加厂商',
        dialogForm: {},
        isDialogShow: false
    }
  },
  computed: {
      
  },
  methods: {
    search() {
      this.pageObj.pageNum = 1;
      this.tableRefresh();
    },
    // 添加
    add() {
      this.isDialogShow = true;
      this.title = '添加厂商';
      this.dialogForm.index = this.pageObj.total + 1;
    },
    // 批量更新
    batchDel(row, type) {
      if(this.selection.length == 0) {
        this.$message.warning('请选中行后再进行批量操作');
        return;
      }
      
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    operate(scope, order) {
      if(order === 'edit') {
        this.isDialogShow = true;
        this.dialogForm.index = (this.pageObj.pageSize * (this.pageObj.pageNum - 1) + scope.$index + 1);
        this.dialogForm.label = scope.row.label;
        this.title = '编辑厂商';
        return;
      }
      if(order === 'del') {
        this.$confirm("是否确认删除该参数！", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
        })
        return;
      }
    },
    submit() {
      if(!this.dialogForm.label) {
        this.$message.warning('请输入参数名称');
        return;
      }
      // 提交
    },
    tableRefresh() {
      
    },
    //页数改变
    pagecCurrentChange(num) {
      this.pageObj.pageNum = num;
      this.tableRefresh();
    },
    //每页数量改变
    pageSizeChange(size) {
      this.pageObj.pageNum = 1;
      this.pageObj.pageSize = size;
      this.tableRefresh();
    }
  },
  mounted() {
    this.tableRefresh();
  }
}
</script>

<style scoped lang="scss">
.bigbox {
  position: relative;
  .sizer {
    margin-top: 20px;
  }
}
.dataBox {
  margin-top: 20px;
  .operate {
    color: #1787AD;
  }
}
.tips {
  padding: 0 20px;
  height: 36px;
  background-color: #FFF3E9;
  border: 1px solid #FFD6B6;
  color: #F1822A;
  font-size: 14px;
  line-height: 40px;
  .close {
    float: right;
    line-height: 40px;
  }
}
.mt30 {
  margin-top: 30px;
}
</style>
