<template>
  <div class="user-box" style="height: auto;margin-bottom:120px;">
    <div class="page-tilt">
      <b></b>
      <span v-if="addOrEdit == 'EDIT'">重大活动保障任务编辑</span>
      <span v-else>重大活动保障任务添加</span>
      <back></back>
    </div>

    <div class="right-info">
      <el-form :model="taskData" :rules="rules2" ref="taskData" label-width="110px">
        <!-- 任务内容 -->
        <toggle-form title="任务内容">
          <div class="content">
            <div class="row">
              <el-form-item label="任务名称:" prop="taskName">
                <el-input v-model="taskData.taskName" :maxlength="100" class="w250" placeholder="请输入任务名称"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="活动起止日期:" required>
              <el-col :span="7">
                <el-form-item prop="startDate">
                  <el-date-picker v-model="taskData.startDate" class="w200" format="yyyy-MM-dd" type="date" :editable="false" placeholder="开始日期"
                    :picker-options="pickerOptions0">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">
                <div style="text-align:left">至</div>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="endDate">
                  <el-date-picker v-model="taskData.endDate" class="w200" format="yyyy-MM-dd" type="date" placeholder="截止日期" :editable="false"
                    :picker-options="pickerOptions0">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>

            <div class="row relative">
              <el-form-item label="任务描述:">
                <el-input v-model="taskData.desz" :maxlength="5000" type="textarea" :rows="4" class="w250" placeholder="请输入任务描述，5000字以内">
                </el-input>
                <span style="white-space:nowrap;position:absolute;left:263px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">(选填)</span>
              </el-form-item>
            </div>

            <span class="row">
              <el-form-item label="相关文件:" required>
                <el-upload class="avatar-uploader" action="" :http-request="uploadImg" :show-file-list="false" :on-error="fileUploadError"
                  :before-upload="beforeAvatarUpload">
                  <el-button type="default" style="background:#F6F7F8;margin-right:20px;">点击上传</el-button>
                </el-upload>
                <span style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">最多上传5个文件，文件格式：jpg，jpeg，png，doc，pdf，文件大小不能超过10M
                  (选填)</span>
                <div class="show-success-file">
                  <div class="file-item" v-for="(item,index) in uploadArr" :key="index">
                    <span class="file-name not-pic" @click.stop="downloadFile(index,item)" v-if="['png','jpg','jpeg'].indexOf(item.type)==-1">{{item.fileName}}</span>
                    <span class="file-name" @click.stop="showBigPic=index" v-if="~['png','jpg','jpeg'].indexOf(item.type)">{{item.fileName}}</span>
                    <el-progress :percentage="percentage" v-if="(index==(uploadArr.length-1)) && (percentage < 100)"></el-progress>
                    <span class="delete-btn" @click="removeFile(index,item)">删除</span>
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
        <el-button class="w100 mt20" type="primary" icon="el-icon" @click="showAddPop('reception')">添加</el-button>
        <p class="bt-info" v-if="addOrEdit == 'EDIT'">提示：在编辑页面，点击禁用，要在确认并保存整个编辑页面之后才会生效！</p>
        <el-table :key="Math.random()" :border="true" :resizable="true" :data="receptionData" class="table-div">
          <el-table-column show-overflow-tooltip type="index" min-width='60' label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entity_name" min-width='150' label="接待单位名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="licence" min-width='100' label="许可备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="corp_name" min-width='80' label="负责人"></el-table-column>
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
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="showMenuPop(scope.row,$event,'reception')">菜单管理</a>
              <a href="javascript:;" class="operate-a" v-if="!scope.row.entityId" @click="addOperation(scope.row,'del','RECEPTION')">删除</a>
              <a href="javascript:;" class="operate-a" v-if="addOrEdit == 'EDIT'  && scope.row.state == 'YES' && scope.row.entityId" @click="state(scope.row,'NO')">禁用</a>
              <a href="javascript:;" class="operate-a" v-if="addOrEdit == 'EDIT' && scope.row.state == 'NO'  && scope.row.entityId" @click="state(scope.row,'YES')">启用</a>
            </template>
          </el-table-column>
        </el-table>
      </toggle-form>

      <!-- 供应商 -->
      <toggle-form title="供应商" required>
        <el-button class="w100 mt20" type="primary" icon="el-icon" @click="showAddPop('supplier')">添加</el-button>
        <p class="bt-info" v-if="addOrEdit == 'EDIT'">提示：在编辑页面，点击禁用或进行菜单管理，要在确定并保存整个编辑页面之后才会生效！</p>
        <el-table :key="Math.random()" :border="true" :resizable="true" :data="supplierData" class="table-div">
          <el-table-column show-overflow-tooltip type="index" min-width='60' label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="entity_name" min-width='150' label="供应商"></el-table-column>
          <el-table-column show-overflow-tooltip prop="licence" min-width='100' label="许可备案号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="corp_name" min-width='80' label="负责人"></el-table-column>
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
          <el-table-column label="操作" min-width="160">
            <template slot-scope="scope">
              <a href="javascript:;" class="operate-a" @click="showMenuPop(scope.row,$event,'supplier')">菜单管理</a>
              <a href="javascript:;" class="operate-a" v-if="!scope.row.entityId" @click="addOperation(scope.row,'del','SUPPLIER')">删除</a>
              <a href="javascript:;" class="operate-a" v-if="addOrEdit == 'EDIT'  && scope.row.state == 'YES' && scope.row.entityId" @click="state(scope.row,'NO')">禁用</a>
              <a href="javascript:;" class="operate-a" v-if="addOrEdit == 'EDIT' && scope.row.state == 'NO'  && scope.row.entityId" @click="state(scope.row,'YES')">启用</a>
            </template>
          </el-table-column>
        </el-table>
      </toggle-form>
    </div>
    <!-- 底部浮动按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button type="default" @click="backBtn">取消并返回</el-button>
        <el-button type="primary" @click="addSubmit" :disabled="btnISd">确定并保存</el-button>
      </div>
    </div>

    <!-- add弹窗 -->
    <yb-popup @close="isShowAdd = false;" :isShow="isShowAdd" :title="addPopData.title" width="800">
      <div slot="body">
        <div style="width:750px;margin:0 auto;">
          <el-input placeholder="主体名称、许可备案号" class="w250 mr20 seekIpt" v-model="addPopData.keyword" @keyup.enter.native="addPopSearch">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="addPopSearch"></i>
          </el-input>
          <el-select v-model="addPopData.selValue" placeholder="状态" @change='addPopSearch'>
            <el-option v-for="item in addPopData.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-table height="373" :border="true" :resizable="true" :data="addPopData.tableData" class="table-div">
            <el-table-column type="index" min-width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="entity_name" min-width="100" label="名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="licence" min-width="100" label="许可备案号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="corp_name" min-width="100" label="负责人"></el-table-column>
            <el-table-column show-overflow-tooltip prop="mobile" min-width="120" label="联系方式"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" label="状态">
              <template slot-scope="scope">
                {{ scope.row.isAdd == '未添加' ? '未添加' : '已添加' }}
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" v-if="scope.row.isAdd != '未添加' && !scope.row.edit" @click="addOperation(scope.row,'del',addPopStatus)">删除</a>
                <a href="javascript:;" class="operate-a" v-if="scope.row.isAdd == '未添加'" @click="addOperation(scope.row,'add',addPopStatus)">添加</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </yb-popup>
    <!-- 菜单管理 -->
    <yb-popup :ischoose='false' :isShow="isShowMenu" :title="menuPopData.title" width="800">
      <div slot="body">
        <div style="width:750px;margin:0 auto;">
          <div style="height:36px;width:100%;" class="clear_a">
            <el-input placeholder="菜单名称" class="w250  seekIpt " v-model="menuPopData.keyword" @keyup.enter.native="menuPopSearch">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="menuPopSearch"></i>
            </el-input>
            <el-button class="w100  fr" type="primary" icon="el-icon" @click="menuPopAdd(menuPopData.tableData)">添加</el-button>
            <el-upload style="float: right" action="/api/upload" :show-file-list="false" :data="{type: 'ACTIVE'}" :on-error="fileUploadError"
              :on-success="handleXmlSuccess" :before-upload="beforeXmlUpload">
              <el-button type="default" class="fr" style="background:#F6F7F8;margin-right:20px;">批量导入</el-button>
            </el-upload>

            <el-button type="default" class="fr" style="background:#F6F7F8;margin-right:20px;" @click="getExcel(menuPopData.id)">模板下载</el-button>
          </div>
          <el-table :key="Math.random()" height="373" :data="menuPopData.tableData" class="table-div">
            <el-table-column type="index" min-width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" min-width="200" label="名称">
              <template slot-scope="scope">
                <el-input size="small" :maxlength="20" v-if="scope.row.isEdit || scope.row.isCreate" placeholder="请输入名称，20字以内，必填" v-model="scope.row.name"></el-input>
                <span v-else>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="remarks" min-width="200" label="备注">
              <template slot-scope="scope">
                <el-input size="small" :maxlength="100" v-if="scope.row.isEdit || scope.row.isCreate" placeholder="请输入备注，100字以内，选填" v-model="scope.row.remarks"></el-input>
                <span v-else>{{scope.row.remarks}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" v-if="!scope.row.isEdit && !scope.row.isCreate" @click="scope.row.isEdit = true;scope.row.bjname=scope.row.name;scope.row.bjremarks=scope.row.remarks">编辑</a>
                <a href="javascript:;" class="operate-a" v-if="scope.row.isEdit" @click="addMenu(scope,'edit')">保存</a>
                <a href="javascript:;" class="operate-a" v-if="!scope.row.isEdit && !scope.row.isCreate" @click="delMenu(scope.row,scope)">删除</a>
                <a href="javascript:;" class="operate-a" v-if="scope.row.isCreate" @click="addMenu(scope,'add')">确认</a>
                <a href="javascript:;" class="operate-a" v-if="scope.row.isEdit || scope.row.isCreate" @click="cancelMenu(scope)">取消</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="foot" style="height:32px;">
        <el-button style="float:right;" type="primary" @click="choseMenuPop">暂存并关闭</el-button>
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
    mounted() {
      this.pathFile = this.$store.getters.filePath;
      let opt = this.$route.query.type;
      if (opt == 'ADD') {
        this.addOrEdit = "ADD";
      } else if (opt == 'EDIT') {
        this.editInit();//编辑初始化
        this.addOrEdit = "EDIT";
      } else {
        this.addOrEdit = "ADD";
      }
    },
    data() {
      return {
        limit: 5, //限制文件上传的个数
        showBigPic: -1,//是否展示大图
        uploadArr: [],//上传成功的图片数组
        percentage: 0,//需要关联的进度条
        pickerOptions0: {
          disabledDate: (time) => {
            try {
              return time.getTime() < Date.now() - 8.64e7;
            } catch (err) {
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            try {
              let beginDateVal = this.taskData.startDate;
              if (beginDateVal) {
                return time.getTime() <= beginDateVal || time.getTime() < Date.now() - 8.64e7;
              }
              return time.getTime() < Date.now() - 8.64e7;
            } catch (err) {

            }

          }
        },
        isUploadImag: false,
        isUploadFile: false,
        pathFile: '',
        imageUrl: '',
        addOrEdit: '',
        taskData: {
          id: null,
          taskName: '',//名称
          startDate: null,//开始日期
          endDate: null,//结束日期
          file: [],//文件,
          desz: '',//描述
        },
        btnISd: false,
        btnISd2: false,
        tempData: {
          bizTypeIndex: null,
          projectIndex: null,
        },
        rules2: {
          taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
          startDate: [
            { type: 'date', required: true, message: '请选择任务开始日期', trigger: 'change' },
          ],
          endDate: [
            { type: 'date', required: true, message: '请选择任务结束日期', trigger: 'change' },
          ],
        },
        //弹框
        isShowAdd: false,
        isShowMenu: false,
        page: {
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
        menuPage: {
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
        addPopData: {//添加表单的数据盒子
          tableData: [],
          keyword: "",
          title: "",//添加弹框标题,
          options: [{
            value: '已添加',
            label: '已添加'
          }, {
            value: '未添加',
            label: '未添加'
          }],
          selValue: ''
        },
        supplierData: [],//供应商数据
        receptionData: [],//接待商数据
        addPopStatus: '',//add弹框主体类别
        menuPopStatus: '',//菜单弹框主体类别
        menu: true,//菜单搜索时的状态
        menuPopData: {
          tableData: [],
          keyword: "",
          title: '',
          id: ''
        },
        falgData: {
          id: '',
          data: []
        },
        clientY: 0//弹框点击的获取他的偏移量
      }
    },
    methods: {
      backBtn() {
        if (this.addOrEdit == "ADD") {
          if (this.taskData != null) {
            this.$confirm('一旦取消，则本次添加的所有内容都不会生效，是否确认取消', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.$router.push({ name: 'activity.taskList', query: { index: this.$route.query.index } });
            });
          }
        } else if (this.addOrEdit == "EDIT") {
          this.$confirm('一旦取消，则本次编辑的菜单、启用、禁用等操作都不会生效，是否确认取消', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.$router.push({ name: 'activity.taskList', query: { index: this.$route.query.index } });
          });
        }
      },
      async editInit() {//编辑初始化

        this.taskData.id = this.$route.query.id;
        if (!this.taskData.id) return;
        let { data } = await api.getInfo(this.taskData.id);
        console.log(data)
        if (!data.activeTask.startTime || !data.activeTask.endTime) {
          data.activeTask.startTime = null;
          data.activeTask.endTime = null;
        } else {
          data.activeTask.startTime = new Date(data.activeTask.startTime);
          data.activeTask.endTime = new Date(data.activeTask.endTime);
        }
        this.taskData.taskName = data.activeTask.taskName;
        this.taskData.startDate = data.activeTask.startTime;
        this.taskData.endDate = data.activeTask.endTime;
        this.taskData.desz = data.activeTask.info;

        // //处理图片
        if (data.fileList && data.fileList.length > 0) {
          this.percentage = 100;
          this.uploadArr = data.fileList;
          this.uploadArr.forEach((i, v) => {
            this.$set(i, 'path', i.fileId);
            i.type = i.fileId.substring(i.fileId.indexOf(".") + 1, i.fileId.length).toLowerCase();
          });
        };
        //处理receptionData，supplierData字段
        this.receptionData = JSON.parse(JSON.stringify(data.receptionEntityList).replace(/entityName/g, "entity_name"));
        this.receptionData = JSON.parse(JSON.stringify(this.receptionData).replace(/corpName/g, "corp_name"));
        this.supplierData = JSON.parse(JSON.stringify(data.supplyEntityList).replace(/entityName/g, "entity_name"));
        this.supplierData = JSON.parse(JSON.stringify(this.supplierData).replace(/corpName/g, "corp_name"));
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
      state(row, type) {//启用和禁用的状态
        let str = type == 'YES' ? '点击启用，要在确定并保存整个编辑页面之后才会生效！' : '点击禁用，要在确定并保存整个编辑页面之后才会生效！';
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.state = type;
        }).catch(_ => { return; });
      },
      addSubmit() {//保存
        if (this.addOrEdit == 'EDIT') {
          this.editSubmit()
        } else {
          this.submit();
        }
      },
      editSubmit() {
        this.btnISd = true;
        if (this.isUploadImag) {
          this.$message({
            message: '您所提交的信息正在上传中，请稍后再提交',
            type: 'warning'
          });
          this.btnISd = false;
          return false;
        }
        this.handleData();

        this.$refs["taskData"].validate(valid => {
          if (valid) {
            this.$confirm('是否确认修改该任务?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //整理提交的数据
              let receptionEntityList = (() => {
                let data = [];
                this.receptionData.forEach((i, v) => {
                  let d = {};
                  if (!i.entityId) {
                    d.id = null;
                    d.entityId = i.id;
                  } else {
                    d.id = i.id;
                    d.entityId = i.entityId;
                  }
                  d.subActiveMenuDtoList = i.subActiveMenuDtoList;
                  d.state = i.state;
                  data.push(d);
                });
                return data;
              })();
              let supplyEntityList = (() => {
                let data = [];
                this.supplierData.forEach((i, v) => {
                  let d = {};
                  if (!i.entityId) {
                    d.id = null;
                    d.entityId = i.id;
                  } else {
                    d.id = i.id;
                    d.entityId = i.entityId;
                  }
                  d.subActiveMenuDtoList = i.subActiveMenuDtoList;
                  d.state = i.state;
                  data.push(d);
                });
                return data;
              })();
              let params = {
                activeTask: {
                  id: this.taskData.id,
                  taskName: this.taskData.taskName,
                  info: this.taskData.desz,
                  startTime: this.taskData.startDate,
                  endTime: this.taskData.endDate
                },
                fileList: this.uploadArr,
                receptionEntityList: receptionEntityList,
                supplyEntityList: supplyEntityList
              }
              api.activityUpdate(params).then((result) => {
                if (!result.status) {
                  this.$message({
                    message: result.message,
                    type: result.level
                  });
                  this.btnISd = false;
                  return;
                }
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.btnISd = false;
                setTimeout(() => {
                  this.$router.push({ name: "activity.taskList", query: { index: this.$route.query.index } });
                }, 2000);
              });
            }).catch(_ => {
              this.btnISd = false;
            });;
          } else {
            this.btnISd = false;
          }
        })
      },
      submit() {
        this.btnISd = true;
        if (this.isUploadImag) {
          this.$message({
            message: '您所提交的信息正在上传中，请稍后再提交',
            type: 'warning'
          });
          this.btnISd = false;
          return false;
        }
        this.handleData();

        this.$refs["taskData"].validate(valid => {
          if (valid) {
            this.$confirm('是否确认保存该任务?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //整理提交的数据
              let receptionEntityList = (() => {
                let data = [];
                this.receptionData.forEach((i, v) => {
                  let d = {};
                  d.entityId = i.id;
                  d.subActiveMenuDtoList = i.subActiveMenuDtoList;
                  d.state = i.state;
                  data.push(d);
                });
                return data;
              })();
              let supplyEntityList = (() => {
                let data = [];
                this.supplierData.forEach((i, v) => {
                  let d = {};
                  d.entityId = i.id;
                  d.subActiveMenuDtoList = i.subActiveMenuDtoList;
                  d.state = i.state;
                  data.push(d);
                });
                return data;
              })();
              let params = {
                activeTask: {
                  id: null,
                  taskName: this.taskData.taskName,
                  info: this.taskData.desz,
                  startTime: this.taskData.startDate,
                  endTime: this.taskData.endDate
                },
                fileList: this.uploadArr,
                receptionEntityList: receptionEntityList,
                supplyEntityList: supplyEntityList
              }
              api.activityAdd(params).then((result) => {
                if (!result.status) {
                  this.$message({
                    message: result.message,
                    type: result.level
                  });
                  this.btnISd = false;
                  return;
                }
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.btnISd = false;
                setTimeout(() => {
                  this.$router.push({ name: "activity.taskList", query: { index: this.$route.query.index } });
                }, 2000);
              });
            }).catch(_ => {
              this.btnISd = false;
            });;
          } else {
            this.btnISd = false;
          }
        })
      },
      handleData() {
        this.taskData.file = [];
        if (this.uploadArr && this.uploadArr.length > 0) {//处理图片数据
          this.uploadArr.forEach((f) => {
            this.taskData.file.push(f.id);
          });
        }
      },
      async uploadImg(file, callback) {
        // 上传数量限制
        if (this.uploadArr.length >= this.limit) {
          this.$message({
            message: '最多上传' + this.limit + '个文件!',
            type: 'warning'
          });
          return
        }
        this.isUploadImag = true
        var formdata = new FormData();
        let fileName = file.file.name;
        let fileType = file.file.type.split("/")[1];
        formdata.append('file', file.file);

        this.uploadArr.push(Object.assign({}, {
          fileName: fileName, type: fileType, id: '', fileId: '', path: ''
        })
        );
        let _this = this;
        // 更新进度条
        function callback(e) {
          _this.percentage = Math.floor(e.percent);
        }

        await uploadFile(formdata, { type: 'ACTIVE' }, callback).then((result) => {
          let data = result.data;
          this.uploadArr[this.uploadArr.length - 1].path = data.fileId;
          this.uploadArr[this.uploadArr.length - 1].id = data.id;
          this.uploadArr[this.uploadArr.length - 1].fileId = data.fileId;
          this.taskData.file = result.data;
          this.imageUrl = result.data;
          this.isUploadImag = false
        });
      },
      // 删除上传的文件
      async removeFile(index, file) {
        this.$confirm('是否确认删除该文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if (this.$route.query.opt == 'edit') {
            removeFile(file.id).then(res => {
              this.$message.success('文件删除成功！');
            })
          }
          this.uploadArr.arrayRemove(index);
        })
      },
      fileUploadError(err, file) {
        if (this.uploadArr && this.uploadArr.length > 0) {
          let ua = this.uploadArr[this.uploadArr.length - 1];
          if (!ua.url) {
            this.uploadArr.arrayRemove(this.uploadArr.length - 1);
          }
        }
        this.$message.warning("该文件上传失败！");
        this.isUploadImag = false;//上传失败就为fasle
      },
      async downloadFile(index, file) {
        let fileName = file.fileName;
        if (fileName) {
          fileName = fileName.substr(0, fileName.lastIndexOf('.'));
        }
        downloadFile(file.fileId, fileName);
      },
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
        let isJPG =
          type === '.png' || type === '.jpeg' ||
          type === '.jpg' || type === '.doc' || type === '.pdf';

        if (!isJPG) {
          this.$message.warning('上传文件格式错误!');
        }
        return isJPG;
      },
      //添加供应商和接待商弹框
      showAddPop(type) {
        this.isShowAdd = true;
        this.pageNum = 1;
        this.addPopData.keyword = '';
        this.addPopData.selValue = '';
        this.addPopData.tableData = [];
        if (type == "reception") {
          this.addPopStatus = 'RECEPTION';
          this.addPopFunction('RECEPTION')
        } else {
          this.addPopStatus = 'SUPPLIER';
          this.addPopFunction('SUPPLIER')
        };
      },
      addPopFunction(type) {
        let data;
        this.addPopData.title = type == 'RECEPTION' ? '添加接待单位' : '添加供应商';
        data = {
          search: '',
          entityType: type,
          pageSize: 999999,
          pageNum: 1
        };
        api.entity(data).then((r) => {
          if (r.status) {
            this.addPopData.tableData = r.data.list;
            this.page.total = r.data.total;
            this.addPopData.tableData.forEach((i, v) => {
              this.$set(i, 'isAdd', '未添加');
              this.$set(i, 'edit', false);//编辑状态不可删除的字段标识
              let d;
              d = type == 'RECEPTION' ? this.receptionData : this.supplierData
              d.forEach((a, e) => {
                //  console.log(a.entityId,i.id)
                if (a.id == i.id || a.entityId == i.id) {
                  this.$set(i, 'isAdd', '已添加');
                  this.$set(i, 'edit', false);
                  if (a.entityId == i.id) {
                    i.edit = true;
                  }
                };

              });
            });

            if (this.addPopData.keyword.trim() != '') {
              let keywordData = [];
              this.addPopData.tableData.forEach((i, v) => {
                if (i.entity_name.indexOf(this.addPopData.keyword.trim()) != '-1' || i.licence.indexOf(this.addPopData.keyword.trim()) != '-1') {
                  keywordData.push(i);
                };
              });
              this.addPopData.tableData = keywordData;
            };
            if (this.addPopData.selValue.trim() != '') {//搜索的时候再处理一下拉框的状态
              let data = [];
              this.addPopData.tableData.forEach((a, e) => {
                console.log(a.isAdd, this.addPopData.selValue)
                if (a.isAdd == this.addPopData.selValue) {
                  data.push(a);
                }
              });
              this.addPopData.tableData = data;
            };
            //最后整理分类
            let yitianjia = [];
            let weitianjia = [];
            this.addPopData.tableData.forEach((s, d) => {
              if (s.isAdd == '已添加') {
                yitianjia.push(s)
              }
              if (s.isAdd == '未添加') {
                weitianjia.push(s)
              }
            });
            weitianjia = weitianjia.concat(yitianjia);
            this.addPopData.tableData = weitianjia;

          };
        });
      },
      addPopSearch() {
        this.page.pageNum = 1;
        this.addPopFunction(this.addPopStatus);
      },
      addOperation(row, type, entityType) {//添加弹框的操作按钮
        if (type == 'add' && entityType) {//弹框table添加操作
          row.isAdd = '已添加';
          if (entityType == 'SUPPLIER') {
            this.$set(row, 'menuNum', '');
            this.$set(row, 'menuInfo', '');
            if (!row.state) {
              this.$set(row, 'state', 'YES');
              this.$set(row, "subActiveMenuDtoList", []);
            }
            this.supplierData.push(row);
          } else if (entityType == 'RECEPTION') {
            this.$set(row, 'menuNum', '');
            this.$set(row, 'menuInfo', '');
            if (!row.state) {
              this.$set(row, 'state', 'YES');
              this.$set(row, "subActiveMenuDtoList", []);
            }
            this.receptionData.push(row);
          }
        } else if (type == 'del' && entityType) {//弹框table删除操作 && 展示table删除操作
          row.isAdd = '未添加';
          if (entityType == 'SUPPLIER') {
            let index;
            this.supplierData.forEach((d, f) => {
              if (row.id == d.id) {
                index = f;
              };
            });
            this.supplierData.splice(index, 1);
          } else if (entityType == 'RECEPTION') {
            let index;
            this.receptionData.forEach((d, f) => {
              if (row.id == d.id) {
                index = f;
              };
            });
            this.receptionData.splice(index, 1);
          }
        };
        this.addPopFunction(this.addPopStatus);
      },
      //菜单管理弹框
      showMenuPop(row, e, entityType) {
        this.clientY = document.querySelector(".app-container").scrollTop;
        this.menuPopData.id = row.id;
        this.menuPopData.title = '菜单管理（' + row.entity_name + '）';
        this.menuPopData.keyword = '';
        this.isShowMenu = true;
        this.menuPopStatus = entityType;
        let data = this.menuPopStatus == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类别打卡菜单管理
        data.forEach((i, v) => {
          if (i.id == row.id) {
            this.menuPopData.tableData = i.subActiveMenuDtoList;
          };
        });
        if (this.menuPopData.tableData != []) {
          this.menuPopData.tableData.forEach((i, v) => {
            this.$set(i, 'isCreate', false);//是否创建状态
            this.$set(i, 'isEdit', false);//是否编辑状态
          });
          this.falgData.id = this.menuPopData.id;
          this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
        };

      },
      cancelMenu(scope) {
        if (scope.row.isCreate == true) {
          console.log(scope)
          this.menuPopData.tableData.splice(scope.$index, 1);
          if (this.menu) {
            this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
          } else {
            this.falgData.data.splice(this.falgData.data.indexOf(this.menuPopData.tableData[scope.$index]), 1);
          }
        } else if (scope.row.isEdit == true) {
          this.menuPopData.tableData[scope.$index].remarks = scope.row.bjremarks;
          this.menuPopData.tableData[scope.$index].name = scope.row.bjname;
          this.menuPopData.tableData[scope.$index].isEdit = false;
          if (this.menu) {
            this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
          }
        }
      },
      choseMenuPop() {
        let fun = () => {
          this.isShowMenu = false;
          let data = this.menuPopStatus == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类
          data.forEach((i, v) => {
            if (i.id == this.menuPopData.id) {
              i.subActiveMenuDtoList = this.falgData.data;
            };
          });
          this.$nextTick(() => {
            document.querySelector(".app-container").scrollTop = this.clientY;
          })
        };
        if (this.falgData.data.length <= 0) {
          fun();
          return false;
        }
        for (let i = 0; i < this.falgData.data.length; i++) {
          if (this.falgData.data[i].name == '' || this.falgData.data[i].isCreate || this.falgData.data[i].isEdit) {
            this.$message({
              message: '你的操作尚未保存，不可关闭!',
              type: 'warning'
            });
            return false;
          }
        }
        fun();
      },
      menuPopAdd(list) {//菜单管理添加一行
        if (this.falgData.data.length >= 1000) {
          this.$message({
            message: '仅可添加1000条菜品，请删除后再添加！',
            type: 'warning'
          });
          return;
        }
        list.unshift({
          isCreate: true,
          isEdit: false,
          name: '',
          remarks: '',
        });
        if (this.menu) {
          this.falgData.id = this.menuPopData.id;
          this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
        } else {
          this.falgData.data.push(this.menuPopData.tableData[0]);
        }
      },
      menuPopSearch() {
        let str = this.menuPopData.keyword.trim();
        if (str == '') {
          this.menu = true;
          this.menuPopData.tableData = this.falgData.data;
          return;
        }
        this.menu = false;
        let keywordData = [];
        this.falgData.data.forEach((i, v) => {
          if (i.name.indexOf(str) != '-1') {
            keywordData.push(i);
          }
        })
        this.menuPopData.tableData = keywordData;
      },
      delMenu(row, scope) {
        if (this.menu) {
          this.falgData.id = this.menuPopData.id;
          this.menuPopData.tableData.splice(this.menuPopData.tableData.indexOf(row), 1);
          this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
        } else {
          this.falgData.data.splice(this.falgData.data.indexOf(this.menuPopData.tableData[scope.$index]), 1);
          this.menuPopData.tableData.splice(this.menuPopData.tableData.indexOf(row), 1);
        }
        // this.menuPopData.tableData.splice(this.menuPopData.tableData.indexOf(row),1);
        let str = '';
        this.falgData.data.forEach((i, v) => {
          if (i.name != undefined) {
            str = str + i.name + ';'
          }
        });
        let data = this.menuPopStatus == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类
        data.forEach((i, v) => {
          if (i.id == this.falgData.id) {
            i.menuNum = this.falgData.data.length;
            i.menuInfo = str;
          }
        });


      },
      addMenu(scope, t) {//添加菜单
        let valid = scope.row.name;
        if (!valid || valid.trim() == "" || valid.trim().length > 20) {
          this.$message({
            message: '请输入名称，20字以内，必填!',
            type: 'warning'
          });
          return;
        };
        if (scope.row.remarks != '') {
          valid = scope.row.remarks;
          if (valid.trim().length > 100) {
            this.$message({
              message: '请输入备注，100字以内，选填',
              type: 'warning'
            });
            return;
          };
        }
        for (let i = 0; i < this.menuPopData.tableData.length; i++) {
          if (this.menuPopData.tableData[i].name.trim() == valid.trim() && i != scope.$index) {
            console.log(this.menuPopData.tableData[i].name.trim(), valid.trim())
            this.$message({
              message: '菜单名称已存在!',
              type: 'warning'
            });
            return;
          };
        };
        if (t == 'edit') {
          scope.row.isEdit = false;
          this.$message({
            message: '编辑成功!',
            type: 'success'
          });
        } else {
          scope.row.isCreate = false;
          this.$message({
            message: '添加成功!',
            type: 'success'
          });
        };
        if (this.menu) {
          this.falgData.id = this.menuPopData.id;
          this.falgData.data = this.menuPopData.tableData;//使用搜索框时，用来缓存菜单管理
        } else {
          if (t == 'edit') {
            // this.falgData.data.push(this.menuPopData.tableData[scope.$index]);
            // if(scope.row.name!=scope.row.bjname && scope.row.remarks != scope.row.bjremarks){
            this.falgData.data.push(this.menuPopData.tableData[scope.$index]);
            // }
            this.falgData.data.splice(this.falgData.data.indexOf(this.menuPopData.tableData[scope.$index]), 1);
          }
          if (t == 'add') {
            this.falgData.data.splice(this.falgData.data.indexOf(this.menuPopData.tableData[scope.$index]), 1);
            this.falgData.data.push(this.menuPopData.tableData[scope.$index]);
          }
        };
        let str = '';
        this.falgData.data.forEach((i, v) => {
          if (i.name != undefined) {
            str = str + i.name + ';'
          }
        });
        let data = this.menuPopStatus == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类
        data.forEach((i, v) => {
          if (i.id == this.falgData.id) {
            i.menuNum = this.falgData.data.length;
            i.menuInfo = str;
          }
        });
      },
      getExcel() {
        api.getExcel().then((result) => {
          console.log(result)
          // window.open(downloadFile(result.data.fileId, result.data.fileName))
          downloadFile(result.data.fileId, result.data.fileName)
        });
      },

      // 模版文件上传成功后钩子
      handleXmlSuccess(response) {
        if (response.status) {
          let nameList = []
          if (this.menuPopData.tableData.length >= 1000) {
            this.$message({
              message: '仅可导入1000条菜品，请删除后再导入！',
              type: 'warning'
            });
            return;
          }
          this.menuPopData.tableData.forEach(s => {
            nameList.push(s.name)
          })

          let params = {
            fileId: response.data.id,
            nameList: nameList
          }
          console.log(params)
          api.import_menu(params).then((result) => {
            //业务处理
            if (result.status) {
              result.data.forEach((i, v) => {
                this.$set(i, 'isCreate', false);
                this.$set(i, 'isEdit', false);
              });
              // console.log(result.data)
              if (this.deleteEle(result.data)) {
                this.$message({
                  message: '请查看导入中是否有相同菜名，所以导入失败！',
                  type: 'warning'
                });
                return;
              }
              for (let a = 0; a < result.data.length; a++) {
                for (let i = 0; i < this.menuPopData.tableData.length; i++) {
                  if (this.menuPopData.tableData[i].name.trim() == result.data[a].name.trim()) {
                    this.$message({
                      message: '请查看已添加和你的导入中是否有相同菜名，所以导入失败！',
                      type: 'warning'
                    });
                    return;
                  };
                };
              }
              this.falgData.data = this.falgData.data.concat(result.data);
              this.menuPopData.tableData = this.falgData.data;
              let str = '';
              this.menuPopData.tableData.forEach((i, v) => {
                if (i.name != undefined) {
                  str = str + i.name + ';'
                }
              });
              let data = this.menuPopStatus == 'supplier' ? this.supplierData : this.receptionData;//判断是那种主体类
              data.forEach((i, v) => {
                if (i.id == this.menuPopData.id) {
                  i.menuNum = this.menuPopData.tableData.length;
                  i.menuInfo = str;
                }
              });
              this.$message({
                message: "导入成功",
                type: 'success'
              });
              this.isUploadFile = false

            } else {
              this.$message({
                message: result.message,
                type: 'warning'
              });
            };
          });
        }
      },
      // 导入前
      beforeXmlUpload(file) {
        if (this.isUploadFile) {
          return;
        }
        this.isUploadFile = true

        let type = file.name.substr(file.name.lastIndexOf('.'));
        let isFile =
          type === '.xls';
        const isLt2M = file.size / 1024 / 1024 < 5;

        if (!isFile) {
          this.$message.error('上传文件格式只能是 xls 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 5MB!');
        }
        return isFile && isLt2M;
      },
      deleteEle(newArr) {
        /*判断是否有重复的元素，返回布尔值*/
        for (var i = newArr.length - 1; i >= 0; i--) {
          var targetNode = newArr[i];
          for (var j = 0; j < i; j++) {
            if (targetNode.name.trim() == newArr[j].name.trim()) {
              return true;
            }
          }
        }
        return false;
      }
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

      }
      .file-name:hover {
        color: #1FABDC;
      }
      .not-pic {
        // color: #6d7787;
      }
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

  .bt-info {
    line-height: 15px;
    font-size: 12px;
    margin-left: 10px;
    margin-top: 20px;
    color: #6D7787;
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