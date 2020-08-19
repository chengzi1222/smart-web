<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>巡查要点表</span>
    </div>

    <div class="ipt-btn-box" style="justify-content:flex-end">

      <div class="floatR">
        <el-button class="selectHeight" v-auth="'food.patrol.point|func.config'" type="primary" @click="showAdd">添加巡查要点表
        </el-button>
      </div>

      <!--添加弹窗-->
      <transition name="dialog-fade">
        <popupBody class="popup-body" v-if="isShow">
          <!-- 功能模块添加到这一区域 -->
          <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShow = false; isAdd = false; isEdit = false;"></i>

          <el-form :model="patrolTable" :rules="rules" ref="patrolTable" label-width="100px" class="demo-ruleForm">

            <el-form-item label="名称:" prop="name">
              <el-input placeholder="请输入巡查要点表名称" maxlength="50" v-model="patrolTable.name" class="w200"></el-input>
            </el-form-item>

            <el-form-item v-if="isAdd" label="主体类型:" prop="entityType">
              <el-select v-model="patrolTable.entityType" placeholder="请选择主体类型" class="w200">
                <el-option v-for="item in entityTypeList" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <div class="form-btn">
            <el-button @click="cancel();">取消</el-button>
            <el-button type="primary" @click="addPatrolTable();">确定</el-button>
          </div>
        </popupBody>
      </transition>
    </div>
    <div class="tabOffTop120">

      <el-table :data="tableData" class="table-div" v-loading="loading">
        <el-table-column type="index" label="序号"  min-width="50" ></el-table-column>
        <el-table-column prop="name" label="名称"  min-width="120" ></el-table-column>
        <el-table-column prop="entityTypeStr" label="主体类型"  min-width="100" ></el-table-column>
        <el-table-column prop="projectNumber" label="巡查项目个数"  min-width="80"  ></el-table-column>
        <el-table-column prop="contentNumber" label="巡查内容个数"  min-width="80" ></el-table-column>
        <el-table-column prop="minImportant" label="最少重点内容"  min-width="120" ></el-table-column>
        <el-table-column prop="typeStr" label="类型"  min-width="120" ></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"  min-width="120" ></el-table-column>
        <el-table-column prop="enableStr" label="状态"  min-width="80" ></el-table-column>

        <el-table-column label="操作" v-if="canOperate()"  min-width="150" >
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row);" class="operate-a">查看</a>
            <a href="javascript:;" @click="goContext(scope.row);" class="operate-a">配置</a>
            <template v-if="scope.row.type === 'CFG'">
              <a href="javascript:;" @click="showEdit(scope.row);" class="operate-a">编辑</a>
              <a v-if="scope.row.enable === 'YES'" href="javascript:;" @click="ifEnable(scope.row, 'NO', '禁用');" class="operate-a">禁用</a>
              <a v-if="scope.row.enable === 'NO'" href="javascript:;" @click="ifEnable(scope.row, 'YES', '启用');" class="operate-a">启用</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :page-sizes="[5,8,10,15,20,25,30]" :page-size="pagination.pageSize" :current-page="pagination.pageNum"
          :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @current-change="pageCurrentChange" @size-change="pageSizeChange"></el-pagination>
      </div>
    </div>
  </div>
</template>


<script>

  import popupBody from 'components/popup/popupdata';
  import { getPatrolKeyPointPage } from "api/patrol/project";
  import { listEntity, submitPatrolTable } from "api/patrol/project";
  import hasAuth from 'utils/checkAuth';

  export default {
    async mounted() {
      this.loading = true;
      this.page.pageNum = 1;
      getPatrolKeyPointPage(this.page).then((result) => {
        this.loading = false;
        this.tableData = result.data.list;
        this.pagination.total = result.data.total;
      });
    },
    methods: {
      canOperate() {
        return hasAuth('food.patrol.point|func.config');
      },
      /* 添加弹出 */
      showAdd() {
        listEntity().then((results) => {
          this.entityTypeList = results.data;
        })

        this.isShow = true;
        this.isAdd = true;
        this.isEdit = false;
        this.patrolTable = {
          name: "",
          entityType: "",
        }

      },
      /* 编辑弹窗 */
      showEdit(tableData) {
        this.isShow = true;
        this.isEdit = true;
        this.isAdd = false;
        this.patrolTable = Object.assign({}, tableData);
      },

      cancel() {
        this.isShow = false;
        this.isAdd = false;
        this.isEdit = false;
        this.patrolTable = {
          name: "",
          entityType: "",
        }
      },

      /* 添加提交 */
      addPatrolTable() {
        this.$refs.patrolTable.validate(function (data) {
          if (data) {
            submitPatrolTable(this.patrolTable).then(result => {
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
                  getPatrolKeyPointPage(this.page).then((result) => {
                    this.tableData = result.data.list;
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
        this.$confirm('是否确认' + enableStr + '该巡查项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let { id, name, type, entityType, minImportant } = tableData;
          this.patrolTable = { id, name, type, entityType, minImportant };
          this.patrolTable.no = tableData.no + "";
          this.patrolTable.enable = enable;

          submitPatrolTable(this.patrolTable).then(result => {
            if (result && result.status) {
              this.$message({
                message: enableStr + '成功',
                type: 'success'
              })

              getPatrolKeyPointPage(this.page).then((result) => {
                this.tableData = result.data.list;
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
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },
      selectType() {
        this.page.keywords.type = this.dictType;
        pageDict(this.page).then((result) => {
          this.tableData = result.data.list;
          this.pagination.total = result.data.total;
        });
      },

      pageCurrentChange(num) {
        this.page.pageNum = num;
        getPatrolKeyPointPage(this.page).then((result) => {
          this.tableData = result.data.list;
        });
      },
      pageSizeChange(num) {
        this.page.pageSize = num;
        getPatrolKeyPointPage(this.page).then((result) => {
          this.tableData =
            result.data.list;
          this.pagination.pageSize = num;
        });
      },

      /* link 方法 */
      goContext(table) {
        this.$router.push({ name: 'patrolContextList', query: { patrolTableId: table.id } });
      },

      goDetail(table) {
        this.$router.push({ name: 'patrolDetail', query: { patrolTableId: table.id } });
      },

    }
    ,
    components: {
      popupBody
    }
    ,
    data() {
      return {
        //添加 编辑弹窗
        isShow: false,
        isAdd: false,
        isEdit: false,

        patrolTable: {
          name: "",
          entityType: "",
        },
        entityTypeList: [],

        //校验
        rules: {
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          entityType: [{ required: true, message: '请选择', trigger: 'blur' }],
        },

        a: false,
        tableData: [],
        pagination: {
          pageNum: 1,
          pageSize: 10
        },          //前端分页
        page: {
          pageNum: 1,
          pageSize: 10,
          keywords: {}
        },              //后端分页
        loading: false,
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

  /*popup start*/

  .popup-hide {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .dialog-fade-enter-active {
    animation: dialog-fade-in 0.3s;
  }

  .dialog-fade-leave-active {
    animation: dialog-fade-out 0.3s;
  }

  @keyframes dialog-fade-in {
    0% {
      transform: translate3d(0, -20px, 0);
      opacity: 0;
    }
    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes dialog-fade-out {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, -20px, 0);
      opacity: 0;
    }
  }

  /*popup end*/
</style>