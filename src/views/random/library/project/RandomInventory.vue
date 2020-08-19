<template>
    <div>
      <div>
          <el-input placeholder="请输入名称" class="w200 seekIpt" v-model="page.keywords.name">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
          </el-input>
          <el-select clearable class="w150" style="margin-left: 20px;" v-model="entityType" @change="selectType();" placeholder="主体类型">
              <el-option
                v-for="item in entityTypeList"
                :key="item.key"
                :label="item.name"
                :value="item.key">
              </el-option>
          </el-select>
          <el-button @click="showAdd" class="w76 dc" icon="el-icon-plus" type="primary">添加</el-button>
      </div>
        <el-table :data="dataPage"  :border="true" :resizable="true"  class="table-div" v-loading="loading">
            <el-table-column show-overflow-tooltip :width="60" type="index" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="entityTypeLabel" label="主体类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="item" label="抽查事项"></el-table-column>
            <el-table-column show-overflow-tooltip prop="basis" label="抽查依据"></el-table-column>
            <el-table-column show-overflow-tooltip :width="60" prop="projectNum" label="抽查项目"></el-table-column>
            <el-table-column show-overflow-tooltip :width="60" prop="contextNum" label="抽查内容"></el-table-column>
            <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="enableLabel" label="状态"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" min-width="190">
               <template slot-scope="scope">
                <a href="javascript:;" v-auth="'food.library.point|func.config'" @click="goContext(scope.row.id)" class="operate-a">配置</a>
                <a href="javascript:;" v-auth="'food.library.point|func.config'" @click="showEdit(scope.row.id)" class="operate-a">编辑</a>
                <a href="javascript:;"  v-auth="'food.library.point|func.view'" @click="goDetail(scope.row.id)" class="operate-a">查看</a>
                <a href="javascript:;" v-auth="'food.library.point|func.config'" v-if="scope.row.enable === 'YES'" @click="ifEnable(scope.row, 'NO', '禁用');"
                      class="operate-a">禁用</a>
                <a href="javascript:;" v-auth="'food.library.point|func.config'" v-if="scope.row.enable === 'NO'" @click="ifEnable(scope.row, 'YES', '启用');"
                      class="operate-a">启用</a>
              </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :current-page="pagination.pageNum"
                          :page-sizes="[10, 20, 30, 40,50]"
                          :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                          :total="pagination.total"
                          @size-change="pageSizeChange"
                          @current-change="pagecCurrentChange">
          </el-pagination>
        </div>
        <popupBody v-if="isShow" class="mT-50">
          <p class="popTit">
            <span v-if="isAdd">添加</span>
            <span v-if="isEdit">编辑</span>
            <span @click="cancel" class="movePoin"><i class="el-icon-close"></i></span>
          </p>
          <div class="contBox">
            <el-form :model="randomTable" :rules="rules" ref="randomTable" label-width="100px" class="demo-ruleForm">
              <el-form-item label="名字:" prop="name">
                <el-input placeholder="请输入名称" v-model="randomTable.name" class="w200" ></el-input>
              </el-form-item>

              <el-form-item label="主体类型:" prop="entityType">
                <el-select class="w350" v-model="randomTable.entityType" placeholder="请选择主体类型">
                  <el-option
                    v-for="item in entityTypeList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="抽检事项:" prop="item">
                <el-input class="w350" type="textarea" placeholder="请输入抽检事项，100字内" maxlength="100" :rows="4" v-model="randomTable.item"></el-input>
              </el-form-item>

              <el-form-item label="抽检依据:" prop="basis">
                <el-input class="w350" type="textarea" placeholder="请输入抽检依据，500字内" maxlength="500" :rows="6" v-model="randomTable.basis"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="botBox">
            <el-button @click="cancel" class="w65" type="primary">取消</el-button>
            <el-button @click="addRandomTable" :disabled="disabled" class="w65" type="primary">保存</el-button>
          </div>
        </popupBody>

  </div>
</template>

<script>

import popupBody from 'components/popup/popupdata';
import { getRandomKeyPointPage, listEntity, submitRandomTable, getRandomTable } from "api/random/project";
import { getEnums } from 'api/common.js'

export default {
  methods: {

    /* 添加弹出 */
    showAdd() {
      this.disabled = false;
      this.isShow = true;
      this.isAdd = true;
      this.isEdit = false;
      this.randomTable = {
        name: "",
        entityType: "",
        item: "",
        basis: "",
      }

    },
    /* 编辑弹窗 */
    showEdit(id) {
      this.disabled = false;
      this.isShow = true;
      this.isEdit = true;
      this.isAdd = false;
      getRandomTable(id).then((result) => {
        if(result && result.status) {
          this.randomTable = result.data;
        }
      })
    },

    cancel() {
      this.isShow = false;
      this.isAdd = false;
      this.isEdit = false;
      this.randomTable = {
        name: "",
        entityType: "",
        item: "",
        basis: "",
      }
    },

    /* 添加提交 */
    addRandomTable() {
      if(this.randomTable.name.trim()=="") {
        this.$message({
                message: "名字不能为空",
                type: 'error'
        });
        return
        };
      this.$refs.randomTable.validate(function (data) {
        if (data) {
          this.disabled = true;
          submitRandomTable(this.randomTable).then(result => {
            if (result && result.status) {
              let hanlde = '添加';
              if (this.isEdit) {
                hanlde = '编辑';
              }
              this.$message({
                message: hanlde + '成功',
                type: 'success'
              })

              setTimeout(() => {
                this.loading=true;
                getRandomKeyPointPage(this.page).then((result) => {
                  this.loading=false;
                  this.dataPage = result.data.list;
                  this.pagination.total = result.data.total;
                });
                this.isShow = false;
                this.isAdd = false;
              }, 2000);

            } else {
              this.$message({
                message: result.message,
                type: 'error'
              });
            }
          })
        } else {
          this.$message({
            message: "请按提示输入完整信息.",
            type: 'error'
          });
        }
      }.bind(this))
    },

    ifEnable(tableData, enable, enableStr) {
      this.$confirm('是否确认' + enableStr + '该抽查项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let { id, name, type, entityType, minImportant, item, basis } = tableData;
        this.randomTable = { id, name, type, entityType, minImportant, item, basis };
        this.randomTable.no = tableData.no + "";
        this.randomTable.enable = enable;

        submitRandomTable(this.randomTable).then(result => {
          if (result && result.status) {
            this.$message({
              message: enableStr + '成功',
              type: 'success'
            })

            this.loading=true;
            getRandomKeyPointPage(this.page).then((result) => {
              this.loading=false;
              this.dataPage = result.data.list;
              this.pagination.total = result.data.total;
            });
          } else {
            this.$message({
              message: result.message,
              type: 'error'
            });
          }
        })
      });
    },

    handleIconClick() {	//搜索框按钮点击搜索
      this.loading=true;
      getRandomKeyPointPage(this.page).then((result) => {
        this.loading=false;
        this.dataPage = result.data.list;
        this.pagination.total = result.data.total;
      });
    },
    selectType() {
      this.loading=true;
      this.page.keywords.entityType = this.entityType;
      getRandomKeyPointPage(this.page).then((result) => {
        this.loading=false;
        this.dataPage = result.data.list;
        this.pagination.total = result.data.total;
      });
    },

    //页数改变
    pagecCurrentChange(num) {
      this.loading=true;
      this.page.pageNum = num;
      getRandomKeyPointPage(this.page).then((result) => {
        this.loading=false;
        this.dataPage = result.data.list;
      });
    },
    //每页数量改变
    pageSizeChange(size) {
      this.loading=true;
      this.page.pageSize = size;
      getRandomKeyPointPage(this.page).then((result) => {
        this.loading=false;
        this.dataPage = result.data.list;
        this.pagination.pageSize = size;
      });
    },

    /* link 方法 */
    goContext(rowTableId) {
      this.$router.push({ name: 'random.library.context', query: { randomTableId: rowTableId } });
    },

    /* link 方法 */
    goDetail(rowTableId) {
      this.$router.push({ name: 'random.library.detail', query: { randomTableId: rowTableId } });
    },
  },
  mounted() {
    this.loading=true;
    this.page.pageNum = 1;
    getRandomKeyPointPage(this.page).then((result) => {
      this.loading=false;
      this.dataPage = result.data.list;
      this.pagination.total = result.data.total;
    });

    getEnums(['com.ybveg.govx.enums.SubTypeEnum'], false).then((results) => {
      this.entityTypeList = results.data || [];
    })
  },
  computed:{
  },
  data() {
      return {
        isShow: false,
        isAdd: false,
        isEdit: false,

        disabled: false,

        page: {
          pageSize: 10,
          pageNum: 1,
          keywords: {}
        },

        pagination: {
          pageSize: 10,
          pageNum: 1,
        },

        transferData:{
            pattern:''
        },
        dataPage:null,
        randomTable: {
          name: "",
          entityType: "",
          item: "",
          basis: ""
        },
        subName:'',
        addIf:false,
        entityTypeList: [],
        entityType: "",

        //校验
        rules: {
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          entityType: [{ required: true, message: '请选择', trigger: 'blur' }],
          item: [{ required: true, message: '请输入', trigger: 'blur' }],
          basis: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        loading: false,
      };
  },
  watch:{
    randomTable(val){
      this.disabled = false;
    }
  },
  components: {
    popupBody
  }
}
</script>

<style scoped lang="sass">
  .dc{
      float: right;
  }
  .table-div{
      margin: 20px 0;
      text-align: center;
  }
  .pagination-box {
      text-align: right;
      margin-top: 20px;
  }
  .popTit{
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height:40px;
    line-height: 40px;
    background:rgba(242,245,248,1);
  }
  .popTit span:first-child{
    margin-left: 20px;
    font-size:14px;
    color:rgba(57,57,57,1);
  }
  .popTit span:last-child{
    float: right;
    margin-right: 10px;
    color:rgba(154,154,154,1);
  }
  .label{
    display: inline-block;
    line-height:34px;
    width: 60px;
    text-align:right;
    margin-right:10px;
  }
  .contBox{
    width: 500px;
    margin-top: 20px;
  }
  .contBox .row{
    margin-top: 20px;
  }
  .botBox{
    text-align:right;
    margin-top: 30px;
  }
  .botBox button:first-child{
    background:rgba(246,247,248,1);
    border: 1px solid #C2CAD2;
    color: #393939;
  }
  .w350{
    width: 350px;
  }
</style>
