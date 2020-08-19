<style scoped lang="sass">
  .el-table thead th {
    background: #fff;
  }
</style>
<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b>
      <span>直播摄像头管理</span>
    </div>
    <div class="mt20 clear_a">
      <el-input placeholder="请输入主体名称" class="w200 seekIpt" v-model="params.search" @keyup.native="handleClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleClick"></i>
      </el-input>
      <enum-select v-model="params.entityType" placeholder="主体类型" @change="handleClick" enum="com.ybveg.govx.enums.active.ActiveEntityTypeEnum"></enum-select>

      <el-button @click="showEntityTable" class="w110 floatR" type="primary">添加主体</el-button>
    </div>
    <div v-if="pageData.length==0" class="no-data">暂无数据</div>
    <div class="aloneDiv mt20" v-for="rs in pageData">
      <h3>
        <span class="subName">{{rs.entityName}}</span>
        <span class="subType ml10">{{rs.entityTypeStr}}</span>
        <i class="el-icon-close floatR close movePoin" @click="deleteEntity(rs)"></i>
        <el-button @click="" class="w110 floatR" type="primary" @click="addCamera(rs.cameraList,rs)">添加摄像头</el-button>
      </h3>
      <el-table :data="rs.cameraList" class="table-div mt20 camera-div" :header-cell-style="{'background':'#fff'}" :header-row-style="{'border-bottom':'1px solid #ccc'}">
        <el-table-column show-overflow-tooltip min-width="50" label="序号" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" min-width="120" label="直播点位名称">
          <template slot-scope="scope">
            <div style="position: relative;padding: 10px 0 20px;">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.name"></el-input>
              <div style="position: absolute;bottom: 0;">
                <el-tooltip v-if="nameIsNull" class="item" effect="dark" :content="scope.row.nameIsNull" placement="top-end">
                  <div style="color: #ff4949;width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.nameIsNull}}</div>
                </el-tooltip>
              </div>
              <span v-if="!(scope.row.isEdit)">{{scope.row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="no" min-width="120" label="摄像头编号">
          <template slot-scope="scope">
            <div style="position: relative;padding: 10px 0 20px;">
              <el-input size="small" style="width: 120px" v-if="scope.row.isCreate" v-model="scope.row.no" type="text" @keyup.native="proving(scope.row)"></el-input>
              <div style="position: absolute;bottom: 0;">
                <span style="color: #ff4949" v-if="noIsNull">{{scope.row.noIsNull}}</span>
              </div>
              <span v-if="!(scope.row.isCreate)">{{scope.row.no}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="type" min-width="120" label="摄像头类型">
          <template slot-scope="scope">
            <enum-select v-if="scope.row.isEdit" v-model="scope.row.type" enum="com.ybveg.govx.enums.CameraTypeEnum" :multiple="false"
              :clearable="false" placeholder="请选择类型">
            </enum-select>
            <span v-else>{{scope.row.typeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="playerAddr" min-width="120" label="直播地址">
          <template slot-scope="scope">
            <div style="position: relative;padding: 10px 0 20px;">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.playerAddr"></el-input>
              <div style="position: absolute;bottom: 0;">
                <span style="color: #ff4949" v-if="playerAddrIsNull">{{scope.row.playerAddrIsNull}}</span>
                <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.playerAddr" placement="top-end">
                  <div style="width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.playerAddr}}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="imgAddr" min-width="100" label="视频截图地址">
          <template slot-scope="scope">
            <div style="position: relative;padding: 10px 0 20px;">
              <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.imgAddr"></el-input>
              <span style="color: #ff4949" v-if="imgAddrIsNull">{{scope.row.imgAddrIsNull}}</span>
              <div style="position: absolute;bottom: 0;">
                <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.imgAddr" placement="top-end">
                  <div style="width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.imgAddr}}</div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="enable" min-width="80" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.enableStr}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip min-width="150" label="操作">
          <template slot-scope="scope">
            <a v-if="!scope.row.isEdit" href="javascript:" @click="showEditCamera(rs.cameraList, scope.row)" class="operate-a">编辑</a>

            <a v-if="!scope.row.isEdit" href="javascript:" @click="delCamera(scope.row)" class="operate-a">删除</a>

            <a v-if="!scope.row.isEdit && scope.row.enable == 'YES'" href="javascript:" @click="enableCamera('NO', scope.row)" class="operate-a">禁用</a>

            <a v-if="!scope.row.isEdit && scope.row.enable == 'NO'" href="javascript:" @click="enableCamera('YES', scope.row)" class="operate-a">启用</a>

            <a v-if="scope.row.isEdit" href="javascript:" @click="cancel(rs.cameraList, scope.row);" class="operate-a">取消</a>

            <a v-if="scope.row.isEdit" href="javascript:" @click="sumbitCamera(scope.row)" class="operate-a">保存</a>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!-- 选择主体弹窗 -->
    <yb-popup width="770" :isShow='isEntityTableShow' @close="hideEntityTable()" :title="'选择主体'" id="popup">
      <div slot="body">
        <div style="width:680px;margin:20px auto 0;">
          <el-form :model="entityParams" ref="entityData" label-width="100px" class="demo-ruleForm">
            <div style="margin-bottom: 20px;" class="clear_a">
              <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt" style="margin-right: 10px" v-model="entityParams.search" @keyup.enter.native="handleIconClick">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
              </el-input>
              <enum-select v-model="entityParams.entityType" placeholder="主体类型" @change="handleIconClick" enum="com.ybveg.govx.enums.active.ActiveEntityTypeEnum"></enum-select>
            </div>

            <el-table style="height:373px;overflow-y:auto;" :data="entityPage" class="table-div" fit highlight-current-row @row-click="rowClick">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="entityName" label="主体名称"></el-table-column>
              <el-table-column show-overflow-tooltip prop="entityTypeStr" label="主体类型"></el-table-column>
              <el-table-column show-overflow-tooltip label="许可备案号">
                <template slot-scope="scope">
                  <span>{{scope.row.licence?scope.row.licence:"暂无"}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="经营地址/场所地址">
                <template slot-scope="scope">
                  <span>{{scope.row.realityAddr?scope.row.realityAddr:"暂无"}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-box">
              <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="entityParams.pageNum"
                :page-sizes="[5,8,10,15,20,25,30]" :page-size="entityParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="entityParams.total">
              </el-pagination>
            </div>
            <br/>
            <div style="text-align:right">
              <el-form-item>
                <el-button type="default" @click="hideEntityTable();">取消</el-button>
              </el-form-item>
            </div>

          </el-form>
        </div>
      </div>

    </yb-popup>
  </div>


</template>

<script>

  import { findCameraEntity, updateCamera, addCameraEntity, entityList, deleteCameraEntity, deleteCamera } from "api/activity/camera";
  import YbPopup from 'components/ybpopup/YbPopup';
  import EnumSelect from 'components/common/EnumSelect';

  export default {
    methods: {
      //摄像头主体数据列表
      findList() {
        findCameraEntity(this.params).then(result => {
          this.pageData = result.data;
        })
      },
      //摄像头主体数据列表
      findEntityList() {
        entityList(this.entityParams).then(result => {
          this.entityPage = result.data.list;
          this.entityParams.total = result.data.total;
        })
      },
      //显示主体弹窗
      showEntityTable() {
        this.isEntityTableShow = true;
        this.findEntityList();
      },
      //条件查询
      handleClick() {
        this.findList();
      },
      //删除主体
      deleteEntity(row) {
        this.$confirm("是否确认删除该主体，删除主体后所有摄像头配置都会清空！", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCameraEntity(row.id).then(result => {
            if (result.status) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.entityids[row.entityId] = null;
              this.findList();
            } else {
              this.$message({
                message: result.message,
                type: result.level
              });
            }
          })
        })
      },
      handleIconClick() {
        this.findEntityList();
      },
      //分页条
      pageCurrentChange(num) {
        this.entityParams.pageNum = num;
        this.findEntityList();
      },
      pageSizeChange(size) {
        this.entityParams.pageSize = size;
        this.findEntityList();
      },
      hideEntityTable() {
        this.isEntityTableShow = false;
        this.entityParams.entityType = '';
        this.entityParams.search = '';
      },
      //添加摄像头
      addCamera(cameraList, rs) {
        let stopCount = 0;
        cameraList.forEach(data => {
          if (data.isEdit || data.isCreate) {
            stopCount++;
          }
        });
        if (stopCount > 0) {
          this.$message({
            message: '请完成之前的保存.',
            type: 'error'
          });
          return false;
        }
        cameraList.unshift({
          isEdit: true,
          isCreate: true,
          enable: 'YES',
          cameraEntityId: rs.id
        });
      },
      check(row) {
        if (!row.name) {
          this.nameIsNull = true;
          row.nameIsNull = '请输入名称';
          return false;
        } else {
          if (row.name.length > 20) {
            this.nameIsNull = true;
            row.nameIsNull = '直播名称不能超过20个字';
            return false;
          }
        }
        this.nameIsNull = false;
        if (!row.no) {
          this.noIsNull = true;
          row.noIsNull = '请输入编号';
          return false;
        } else {
          if (row.no > 1000) {
            this.noIsNull = true;
            row.noIsNull = '编号范围1-1000';
            return false;
          }
        }
        this.noIsNull = false;
        if (!row.playerAddr) {
          this.playerAddrIsNull = true;
          row.playerAddrIsNull = '请输入直播地址';
          return false;
        } else {
          if (row.name.length > 500) {
            this.nameIsNull = true;
            row.nameIsNull = '直播地址不能超过500个字';
            return false;
          }
        }
        if (row.playerAddr.match("[\u4e00-\u9fa5]")) {
          this.playerAddrIsNull = true;
          row.playerAddrIsNull = '请输入正确直播地址';
          return false;
        }
        this.playerAddrIsNull = false;
        if (!row.type) {
          this.typeIsNull = true;
          row.playerAddrIsNull = '请选择摄像头类型';
          return false;
        }
        this.typeIsNull = false;
        if (!row.imgAddr) {
          this.imgAddrIsNull = true;
          row.imgAddrIsNull = '请输入图片地址';
          return false;
        } else {
          if (row.name.length > 500) {
            this.nameIsNull = true;
            row.nameIsNull = '图片地址不能超过500个字';
            return false;
          }
        }
        if (row.imgAddr.match("[\u4e00-\u9fa5]")) {
          this.imgAddrIsNull = true;
          row.imgAddrIsNull = '请输入正确图片地址';
          return false;
        }
        return true;
      },

      //修改摄像头
      sumbitCamera(row) {
        let r = this.check(row);
        if (!r) {
          return false;
        }
        updateCamera(row).then((result) => {
          if (result.status) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            row.isEdit = false;
            row.isCreate = false;
            this.findList();
          }
        });
      },
      //取消编辑
      cancel(cameraList, row) {
        if (row.isEdit && row.isCreate) {
          cameraList.shift();
          row.isEdit = false;
          row.isCreate = false;
        } else {
          row.isEdit = false;
        }
      },
      //编辑摄像头
      showEditCamera(cameraList, row) {
        let stopCount = 0;
        cameraList.forEach(data => {
          if (data.isEdit || data.isCreate) {
            stopCount++;
          }
        });
        if (stopCount > 0) {
          this.$message({
            message: '请完成之前的操作.',
            type: 'error'
          });
          return false;
        }
        this.$set(row, "isEdit", true);
      },
      //删除摄像头
      delCamera(row) {
        this.$confirm("是否确认删除该摄像头！", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCamera(row.id).then((result) => {
            if (result.status) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.findList();
            }
          });
        })
      },
      //选择主体
      rowClick(row, event, column) {
        if (!this.entityids[row.id]) {
          this.entityids[row.id] = row.id;
          addCameraEntity(row.id).then(result => {
            if (result.status) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.hideEntityTable();
              this.findList();
              this.findEntityList
            }
          })
        }
      },
      enableCamera(enable, row) {
        let mess = "";
        row["enable"] = enable;
        if (enable == "NO") {
          mess = "禁用成功";
        } else {
          mess = "启动成功";
        }
        updateCamera(row).then((result) => {
          if (result.status) {
            this.$message({
              message: mess,
              type: 'success'
            });
            row.isEdit = false;
            row.isCreate = false;
            this.findList();
          }
        });
      },
      //验证，只能输入正整数
      proving(row) {
        row.no = row.no.replace(/[^\.\d]/g, '').replace('.', '').replace('-', '');
        //        row.no = row.no.replace('.','').replace('-','');
      }
    },
    mounted() {
      this.findList();
    },
    data() {
      return {
        iptValue: '',
        subType: '',
        subTypeLis: [],
        pageData: null,  //主体数据列表
        dataPage: [],  //摄像头列表
        entityPage: [],  //主体分页列表
        isEntityTableShow: false,  //主体列表弹窗
        entityids: {},
        isDone: null,
        entityParams: {
          pageSize: 10,
          pageNum: 1,
          entityType: '',
          search: '',
          total: 0
        },
        params: {
          entityType: '',
          search: ''
        },
        camera: {
          name: '',
          no: '',
          type: '',
          playerAddr: '',
          imgAddr: '',
          enable: ''
        },
        nameIsNull: false,
        noIsNull: false,
        playerAddrIsNull: false,
        imgAddrIsNull: false,
        typeIsNull: false,
      };
    },
    components: {
      YbPopup,
      EnumSelect
    }
  }
</script>
<style scoped lang="sass">
  .aloneDiv {
    padding: 20px;
    background: rgba(242, 245, 248, 1);
    border: 1px solid rgba(194, 202, 210, 1);
  }

  .aloneDiv h3 {
    font-weight: 100;
  }

  .subName {
    font-size: 16px;
    color: #393939;
  }

  .subType {
    background: rgba(241, 249, 251, 1);
    border-radius: 4px;
    border: 1px solid rgba(13, 181, 239, 1);
    width: 68px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    text-align: center;
    font-size: 13px;
    color: #0DB5EF;
  }

  .close {
    color: #A2AAB6;
    font-size: 20px;
    font-weight: 600;
    margin-left: 40px;
  }

  .table-div {
    border: 1px solid rgba(194, 202, 210, 1) !important;
  }

  .no-data {
    text-align: center;
    line-height: 120px;
    font-size: 16px;
  }
</style>