<template>
  <div class="user-box" style="height: auto;margin-bottom:120px;">
    <div class="page-tilt">
      <b></b>
      <span>重大活动保障任务详情</span>
      <back></back>
    </div>

    <div class="right-info">
      <el-form label-width="130px" class="demo-ruleForm">
        <toggle-form title="任务内容">
          <div class="content">

            <div class="row">
              <el-form-item label="任务名称:">
                <span>{{ activeTask.taskName }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="活动起止日期：:">
                <span>{{ activeTask.startTime.substring(0,10) }}</span>&nbsp; 至 &nbsp;<span>{{ activeTask.endTime.substring(0,10)
                  }}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="任务描述:">
                <span class="over-y">{{ activeTask.info}}</span>
              </el-form-item>
            </div>
            <span class="row">
              <el-form-item label="相关文件:" required>
                <div class="show-success-file">
                  <div class="file-item" v-for="(item,index) in uploadArr" :key="index">
                    <span class="file-name not-pic" @click.stop="downloadFile(index,item)" v-if="['png','jpg','jpeg'].indexOf(item.type)==-1">{{item.fileName}}</span>
                    <span class="file-name" @click.stop="showBigPic=index" v-if="~['png','jpg','jpeg'].indexOf(item.type)">{{item.fileName}}</span>
                    <div class='big-img' v-show="showBigPic==index" @click.stop="showBigPic = -1" v-if="~['png','jpg','jpeg'].indexOf(item.type)">
                      <img :src="pathFile + item.path" alt="">
                    </div>
                  </div>
                </div>
              </el-form-item>
            </span>
          </div>
        </toggle-form>
      </el-form>
      <!-- 接待单位 -->
      <toggle-form title="接待单位" required>
        <el-table :key="Math.random()" :border="true" :resizable="true" :data="receptionData" class="table-div">
          <el-table-column show-overflow-tooltip type="index" min-width='60' label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityName" min-width='80' label="接待单位名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="licence" min-width='100' label="许可备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="corpName" min-width='100' label="负责人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="mobile" min-width='100' label="联系方式"></el-table-column>
          <el-table-column show-overflow-tooltip prop="menuNum" min-width='50' label="菜品数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width='180' label="菜单">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.menuInfo" placement="top">
                <div class="show-overflow-tooltip">
                  {{ scope.row.menuInfo }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column min-width='80' label="状态">
            <template slot-scope="scope">
              {{ scope.row.state == 'YES' ? '启用' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="showMenuPop(scope.row,$event,'reception')">菜单查看</a>
            </template>
          </el-table-column>
        </el-table>
      </toggle-form>
      <!-- 供应商 -->
      <toggle-form title="供应商" required>
        <el-table :key="Math.random()" :border="true" :resizable="true" :data="supplierData" class="table-div">
          <el-table-column show-overflow-tooltip type="index" min-width='60' label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entityName" min-width='150' label="供应商"></el-table-column>
          <el-table-column show-overflow-tooltip prop="corpName" min-width='80' label="负责人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="licence" min-width='100' label="许可备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="mobile" min-width='100' label="联系方式"></el-table-column>
          <el-table-column show-overflow-tooltip prop="menuNum" min-width='50' label="菜品数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width='180' label="菜单">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.menuInfo" placement="top">
                <div class="show-overflow-tooltip">
                  {{ scope.row.menuInfo }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column min-width='80' label="状态">
            <template slot-scope="scope">
              {{ scope.row.state == 'YES' ? '启用' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="showMenuPop(scope.row,$event,'supplier')">菜单查看</a>
            </template>
          </el-table-column>
        </el-table>
      </toggle-form>
    </div>
    <!-- 底部浮动按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="primary" @click="$router.push({name: 'activity.taskAdd',query: {'id': id,'type':'EDIT',index:$route.query.index}});">编辑</el-button>
        <el-button type="default" @click="backBtn">返回</el-button>
      </div>
    </div>

    <!-- 菜单管理 -->
    <yb-popup @close="choseMenuPop" :isShow="isShowMenu" :title="menuPopData.title" width="800">
      <div slot="body">
        <div style="width:750px;margin:0 auto;">
          <div style="height:36px;width:100%;" class="clear_a">
            <el-input placeholder="菜单名称" class="w250 seekIpt " v-model="menuPopData.keyword" @keyup.enter.native="menuPopSearch">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="menuPopSearch"></i>
            </el-input>
          </div>
          <el-table :key="Math.random()" height="373" :data="menuPopData.tableData" class="table-div">
            <el-table-column type="index" min-width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" min-width="200" label="名称">
              <template slot-scope="scope">
                <el-input size="small" ref="input" v-if="scope.row.isEdit || scope.row.isCreate" placeholder="请输入名称，20字以内，必填" v-model="scope.row.name"></el-input>
                <span v-else>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remarks" min-width="200" label="备注">
              <template slot-scope="scope">
                <el-input size="small" ref="input" v-if="scope.row.isEdit || scope.row.isCreate" placeholder="请输入备注，100字以内，选填" v-model="scope.row.remarks"></el-input>
                <span v-else>{{scope.row.remarks}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </yb-popup>
  </div>
</template>



<script>
  import Back from 'utils/back.vue'		//返回上一个页面按钮
  import ToggleForm from 'components/ToggleForm'
  import YbPopup from 'components/ybpopup/YbPopup';
  import * as api from "api/activity/task";
  import { uploadFile, downloadFile } from 'api/common';
  import { removeFile } from 'api/cfda/add'

  /*
  * 方法:Array.arrayRemove(dx)
  * 功能:删除数组元素.
  * 参数:dx删除元素的下标.
  * 返回:在原数组上修改数组.
  */
  Array.prototype.arrayRemove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    this.splice(dx, 1);
  }

  export default {
    components: {
      Back,
      ToggleForm,
      YbPopup,
    },
    async mounted() {
      this.pathFile = this.$store.getters.filePath;
      this.id = this.$route.query.id;
      await this.init(this.id);
      if (this.$route.query.flag) {
        this.isCheckInfo = true;
      }
    },
    data() {
      return {
        isCheckInfo: false,
        id: '',
        activeTask: {
          startTime: '',
          endTime: ''
        },
        limit: 5, //限制文件上传的个数
        showBigPic: -1,//是否展示大图
        uploadArr: [],//上传成功的图片数组
        percentage: 0,//需要关联的进度条
        pathFile: '',
        supplierData: [],//供应商数据
        receptionData: [],//接待商数据
        //弹框
        isShowMenu: false,
        menuPopData: {
          tableData: [],
          keyword: "",
          title: "",//添加弹框标题
          id: '',
        },
        falgData: {
          id: '',
          data: []
        },
        clientY: 0//弹框点击的获取他的偏移量
      }
    },
    methods: {
      async init(id) {
        let { data } = await api.getInfo(id);
        this.activeTask = data.activeTask;
        this.uploadArr = data.fileList;
        this.uploadArr.forEach((i, v) => {
          this.$set(i, 'path', i.fileId);
          i.type = i.fileId.substring(i.fileId.indexOf(".") + 1, i.fileId.length);
        });
        this.receptionData = data.receptionEntityList;
        this.supplierData = data.supplyEntityList;
        this.supplierData.forEach((i, v) => {
          this.$set(i, 'menuNum', i.subActiveMenuDtoList.length);
          this.$set(i, 'menuInfo', (() => {
            let info = '';
            i.subActiveMenuDtoList.forEach((a, e) => {
              info = info + a.name + ';';
            });
            return info;
          })());
        });
        this.receptionData.forEach((i, v) => {
          this.$set(i, 'menuNum', i.subActiveMenuDtoList.length);
          this.$set(i, 'menuInfo', (() => {
            let info = '';
            i.subActiveMenuDtoList.forEach((a, e) => {
              info = info + a.name + ';';
            });
            return info;
          })());
        });
      },
      backBtn() {
        if (this.isCheckInfo) {
          history.back();
        } else {
          this.$router.push({ name: 'activity.taskList', query: { index: this.$route.query.index } });
        }
      },
      handleData() {
        this.taskData.file = [];
        if (this.uploadArr && this.uploadArr.length > 0) {//处理图片数据
          this.uploadArr.forEach((f) => {
            this.taskData.file.push(f.id);
          });
        }
      },
      async downloadFile(index, file) {
        let fileName = file.fileName;
        if (fileName) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }
        downloadFile(file.fileId, fileName);
      },
      //菜单管理弹框
      showMenuPop(row, e, entityType) {
        this.clientY = document.querySelector(".app-container").scrollTop;
        this.menuPopData.id = row.id;
        this.menuPopData.title = '菜单管理（' + row.entityName + '）';
        this.menuPopData.keyword = '';
        this.isShowMenu = true;
        let data = entityType == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类别
        data.forEach((i, v) => {
          if (i.id == row.id) {
            this.menuPopData.tableData = i.subActiveMenuDtoList;
          };
        });
        if (this.menuPopData.tableData != []) {
          this.menuPopData.tableData.forEach((i, v) => {
            this.$set(i, 'isCreate', false);
            this.$set(i, 'isEdit', false);
          });
          this.falgData.id = this.menuPopData.id;
          this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
        };

      },
      choseMenuPop() {
        this.isShowMenu = false;
        this.$nextTick(() => {
          document.querySelector(".app-container").scrollTop = this.clientY;
        })
      },
      menuPopSearch() {
        let str = this.menuPopData.keyword.trim();
        if (str == '') {
          this.menuPopData.tableData = this.falgData.data;
          return;
        }
        let keywordData = [];
        this.falgData.data.forEach((i, v) => {
          if (i.name.indexOf(str) != '-1') {
            keywordData.push(i);
          }
        })
        this.menuPopData.tableData = keywordData;

      },
    },
    computed: {
      filePath() {
        return this.$store.getters.filePath
      },
    }
  }
</script>


<style scoped lang="scss">
  .pagination-box {
    text-align: right;
  }

  .right-info {
    width: 100%;
  }

  .valid {
    color: #ff0000;
  }

  .tag {
    border-radius: 0;
    background: #eff7f9;
    border: 1px solid #c2eaf8;
    padding: 8px 10px;
    line-height: 0px;
    line-height: 16px;
    margin: 5px 0;
    color: #33b2df;
    font-size: 14px;
    display: block !important;
  }

  .content {
    padding-left: 25%;
    margin-top: 20px;
  }

  .add {
    background: #f6f7f8;
    border: 1px solid #c2cad2;
    height: 34px;
    line-height: 34px;
    width: 34px;
    text-align: center;
    cursor: pointer;
  }

  .show-success-file {
    .file-item {
      .el-progress {
        display: inline-block;
        width: 130px;
      }
      .file-name {
        cursor: pointer;
        margin-right: 20px;
        color: #1FABDC;
      }
      // .not-pic {
      //   color: #6d7787;
      // }
      .delete-btn {
        color: #1787ad;
        cursor: pointer;
      }
    }
    .big-img {
      height: 100%;
      width: 100%;
      position: fixed;
      left: 0px;
      top: 0px;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      >img {
        display: block;
        max-height: 700px;
      }
    }
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .show-overflow-tooltip {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    max-height: 85px;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
</style>