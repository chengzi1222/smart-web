<template>

  <div>
    <!-- 过滤配置 -->
    <div class="page-tilt">
      <b></b>
      <span>部门管理</span>
    </div>
    <div>

      <div>
        <div class="ipt-btn-box">
          <div></div>
          <div>
            <el-upload v-auth="'organize.dept|func.import'" style="margin-right:5px; float:left;" action="/api/upload" :data="{type: 'IMPORT'}" :show-file-list="false" :on-error="uploadError" :before-upload="beforeUpload" :on-success="uploadSuccess" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
              <el-button>批量导入</el-button>
            </el-upload>
            <span v-auth="'organize.dept|func.import'">
              <el-button @click="getStecilFileByDeptId">下载模板</el-button>
            </span>
            <span v-auth="'organize.dept|func.export'" >
              <el-button @click="getDeptExcelFileAboutDeptInfo">批量导出</el-button>
            </span>

            <router-link v-auth="'organize.dept|func.add'" :to="{name: 'support.depts.add' ,query:{id:deptId}}">
              <el-button type="primary" icon="plus">
                添加部门
              </el-button>
            </router-link>
          </div>
        </div>
        <el-table :data="deptTableData" class="table-div">
          <el-table-column type="index" :width="60" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="deptName" label="部门名称"></el-table-column>
          <el-table-column prop="areaName" label="所属辖区"></el-table-column>
          <el-table-column prop="adminName" label="管理员账户"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enable == 'YES'">
                启用
              </span>
              <span v-else>
                禁用
              </span>
            </template>

          </el-table-column>
          <el-table-column label="操作" :width="200">
            <template slot-scope="scope">
              <router-link v-auth="'organize.dept|func.edit'"  :to="{name:'support.depts.edit',query:{parentDeptId:deptId,deptId:scope.row.id}}">
                <a href="javascript:;" class="operate-a">编辑</a>
              </router-link>

              <a href="javascript:;" v-auth="'organize.dept|func.delete'"  class="operate-a" @click="deptEnable(scope.row.id,'DELETE')">删除</a>
              <!-- 启用禁用隐藏判断 -->
              <span v-auth="'organize.dept|func.edit'" >
                <a href="javascript:;" v-if="scope.row.enable == 'YES'" @click="deptEnable(scope.row.id,'NO')" class="operate-a">
                  禁用
                </a>
                <a href="javascript:;" v-else @click="deptEnable(scope.row.id,'YES')" class="operate-a">
                  启用
                </a>
              </span>

              <a href="javascript:;" v-auth="'organize.dept|func.edit'"  class="operate-a" @click="resetPwd(scope.row.adminId)">重置密码</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :page-sizes="[8,10,20,30,50]" :page-size="deptPage.pageSize" :total="deptPage.total" @size-change="deptPageSizeChange" @current-change="deptPageCurrentChange" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <div class="progress-box" v-if="isShowProgress">
          <el-progress type="circle" :percentage="percentage" :status="percentageType"></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as organizeApi from 'api/support/organize';
import { downloadFile } from 'api/common';
export default {
  mounted() {
    this.deptTableSearch();
  },
  methods: {
    deptPageSizeChange(size) {
      this.deptPage.pageSize = size;
      this.deptTableSearch();
    },
    deptPageCurrentChange(num) {
      this.deptTableSearch(num);
    },
    deptTableSearch(num = 1) {
      organizeApi.getDeptTable({}, {
        pageNum: num,
        pageSize: this.deptPage.pageSize
      }).then((results) => {
        this.deptPage.total = results.data.total;
        this.deptTableData = results.data.list;
      });
    },
    deptEnable(id, value) {
      let msg = '';
      if (value == 'YES') {
        msg = '启用';
      } else if (value == 'NO') {
        msg = '禁用';
      } else if (value == 'DELETE') {
        msg = '删除';
      }
      this.$confirm('是否要' + msg + '该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizeApi.updateDept({ id: id, enable: value }).then((result) => {
          if(result.status) {
            this.$message({
              message: "部门" + msg + "成功!",
              type: 'success'
            });
          }
          this.deptTableSearch();
        });
      });
    },

    beforeUpload(file) {
      this.$message({ message: '数据上传中,请稍后!', type: 'info' });
    },
    uploadSuccess(response, file, fileList) {
      this.$message({ message: '数据导入中,请勿关闭此页面', type: 'info' });
      if (response.status) {
        const data = response.data;
        this.uploadExcelFile(data.id)
      } else {
        this.$message({ message: response.message, type: response.level });
      }
    },
    uploadError(err, file, fileList) {  // 此方法应该没有用 因为后台返回的都是200

    },
    uploadExcelFile(id) {
      this.percentage = 0;
      this.percentageType = "";
      const $this = this;
      const hunder = setInterval(() => {
        organizeApi.getStecilPorcess(id).then((result) => {
          if (result.status && result.data) {
            $this.percentage = parseFloat(result.data);
          }
        })
      }, 1000);
      this.isShowProgress = true;
      const params = {
        importType: 'DEPT',
        id: id
      }
      organizeApi.uploadExcelFile(params).then((result) => {
        this.percentage = 0;
        this.isShowProgress = false;
        this.deptTableSearch();
        clearInterval(hunder);
        if (result.status) {
          this.percentageType = "success"
          this.percentage = 100;
          this.$message({
            message: '共导入' + result.data.total + '条, 导入成功' + (result.data.total
              - result.data.failure) + '条, 导入失败' + result.data.failure + '条',
            type: 'success'
          });
        } else {
          if (result.data) {
            this.percentageType = "exception";
            this.$alert('共导入' + result.data.total + '条, 导入成功' + (result.data.total
              - result.data.failure)
              + '条, 导入失败' + result.data.failure + '条, 即将下载出错数据!', '导入数据完毕', {
                confirmButtonText: '确定',
                callback: () => {
                  downloadFile(result.data.file, '导入失败数据');
                }
              });
          } else if (result.message) {
            this.$message({ message: result.message, type: result.level });
          }
        }
      })
    },
    getStecilFileByDeptId() {
      organizeApi.getStecilFileByDeptId({ deptId: this.deptId }).then((result) => {
        downloadFile(result.data, '部门导入模版');
      });
    },
    getDeptExcelFileAboutDeptInfo() {
      organizeApi.getExcelFileAboutDeptInfo({ deptId: this.deptId, type: 'DEPT' }).then((result) => {
        downloadFile(result.data, '部门导出');
      })
    },
    resetPwd(id) {
      this.$confirm('是否要重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizeApi.restPwd(id).then((result) => {
          this.$message({
            message: "重置密码成功!",
            type: 'success'
          });
        });
      });
    }
  },
  computed: {
    deptId() {
      return this.$store.getters.user.deptId;
    },
  },
  data() {
    return {
      isShowProgress: false,
      percentage: 0,
      percentageType: "",
      //组织结构的树

      searchValue: "",
      deptSearchData: [],
      //分页数据
      deptPage: {
        pageSize: 8,
        total: 0,
        num: 1
      },
      //列表数据
      deptTableData: [],
    }
  }
}
</script>


<style scoped lang="sass">
.progress-box {
  position: fixed;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.progress-box > div {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
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
</style>
