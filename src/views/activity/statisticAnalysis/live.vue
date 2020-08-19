<template>
  <div>
    <div class="clear_a">
      <el-input placeholder="请输入主体名称" class="w200 seekIpt" v-model="iptValue" @keyup.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click=""></i>
      </el-input>
      <enum-select v-model="params.entityType" placeholder="主体类型" @change="handleIconClick" enum="com.ybveg.govx.enums.active.ActiveEntityTypeEnum"></enum-select>
      <el-button @click="addEntity" class="w100 floatR" type="primary" icon="el-icon-plus">添加</el-button>
    </div>
    <div class="mt20" style="position: relative;">
      <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
        <span style="position: absolute;top: 50%;margin-top: -30px;">
          <i class="icon el-icon-loading" style="font-size: 40px;"></i>
        </span>
      </div>
      <el-table :data="dataPage" class="table-div">
        <el-table-column show-overflow-tooltip prop="entityName" min-width="80" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityTypeStr" min-width="80" label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="cameraTotal" min-width="80" label="摄像头数量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="licence" min-width="80" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="100" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realityAddr" min-width="100" label="地址"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="150" label="操作">
          <template slot-scope="scope">
            <span v-if="true" @click="deleteByKey(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 选择主体弹窗 -->
    <yb-popup width="770" :isShow='isEntityTableShow' @close="hideEntityTable()" :title="'选择主体'" id="popup">
      <div slot="body">
        <div style="width:680px;margin:20px auto 0;">
          <el-form :model="params" ref="entityData" label-width="100px" class="demo-ruleForm">
            <div class="mt20 clear_a" style="margin-bottom: 20px;">
              <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt" style="margin-right: 10px" v-model="entityParams.search" @keyup.enter.native="handleEntityIconClick">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleEntityIconClick"></i>
              </el-input>
              <enum-select v-model="entityParams.entityType" placeholder="主体类型" @change="handleEntityIconClick" enum="com.ybveg.govx.enums.active.ActiveEntityTypeEnum"></enum-select>
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
              <el-pagination background @size-change="pageSizeEntityChange" @current-change="pageCurrentEntityChange" :current-page="entityParams.pageNum"
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

  //  import popupBody from 'components/popup/popupdata';
  import { findCameraEntitys, findCameraEntityList, deleteCameraConfig, addCameraConfig } from "api/activity/camera";
  import YbPopup from 'components/ybpopup/YbPopup';
  import EnumSelect from 'components/common/EnumSelect';

  export default {
    methods: {
      //页数改变
      pageCurrentChange(num) {
        this.params.pageNum = num;
      },
      //每页数量改变
      pageSizeChange(size) {
        this.params.pageSize = size;
      },
      handleIconClick() {
        this.findPage();
      },
      findPage() {
        findCameraEntitys(this.params).then(result => {
          this.dataPage = result.data.list;
          this.params.total = result.data.total;
        })
      },
      //删除配置
      deleteByKey(row) {
        this.$confirm('确定删除该直播配置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteCameraConfig(row.configId).then(result => {
            if (result.status) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.entityids[row.id] = null;
              this.findPage();
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          })
        })
      },
      //添加主体
      addEntity() {
        this.isEntityTableShow = true;
        this.findEntityList();
      },
      //取消
      hideEntityTable() {
        this.isEntityTableShow = false;
        this.entityParams.search = '';
        this.entityParams.entityType = '';
      },
      handleEntityIconClick() {
        this.findEntityList();
      },
      findEntityList() {
        findCameraEntityList(this.entityParams).then(result => {
          this.entityPage = result.data.list;
          this.entityParams.total = result.data.total;
        })
      },
      //页数改变
      pageCurrentEntityChange(num) {
        this.entityParams.pageNum = num;
        this.findEntityList();
      },
      //每页数量改变
      pageSizeEntityChange(size) {
        this.entityParams.pageSize = size;
        this.findEntityList();
      },
      rowClick(row, event, column) {
        if (!this.entityids[row.id]) {
          this.entityids[row.id] = row.id;
          addCameraConfig(this.id, row.id).then(result => {
            if (result.status) {
              this.isEntityTableShow = false;
              this.entityParams.search = '';
              this.findPage();
              this.findEntityList();
            }
          })
        }
      }
    },
    mounted() {
      this.findPage();
    },
    data() {
      return {
        iptValue: '',
        subType: '',
        subTypeLis: [],
        lodings: false,
        dataPage: [],
        entityids: {},
        params: {
          taskId: this.id,
          pageSize: 10,
          pageNum: 1,
          total: 0,
          entityType: '',
          search: ''
        },
        isEntityTableShow: false,
        entityPage: [],
        entityParams: {
          search: '',
          entityType: '',
          pageSize: 10,
          pageNum: 1,
          total: 0,
          taskId: this.id,
        },
        entityPage: []
      };
    },
    components: {
      YbPopup,
      EnumSelect
    },
    props: {
      id: {
        type: String
      },
    },
  }
</script>

<style scoped lang="sass">
  .mt35 {
    margin-top: 35px;
  }

  .popTit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: rgba(242, 245, 248, 1);
  }

  .popTit span:first-child {
    margin-left: 20px;
    font-size: 14px;
    color: rgba(57, 57, 57, 1);
  }

  .popTit span:last-child {
    float: right;
    margin-right: 10px;
    color: rgba(154, 154, 154, 1);
  }

  .botBox {
    text-align: right;
    margin-top: 30px;
  }

  .botBox button:first-child {
    background: rgba(246, 247, 248, 1);
    border: 1px solid #C2CAD2;
    color: #393939;
  }
</style>