<style lang="sass">
.target {
  padding-left: 110px;
}
.target span {
  display: block !important;
  margin: 10px 0;
  height: auto;
  padding: 5px;
}
</style>
<template>
  <div class="user-box" style="height: auto;margin-bottom:120px;">
    <div class="page-tilt">
      <b></b>
      <span v-if="this.addOrEdit == 'ADD'">添加计划</span>
      <span v-else>编辑计划</span>
      <!-- <back></back> -->
    </div>

    <div class="right-info">
      <!--<el-form :model="cfda"  ref="cfda" label-width="110px" class="demo-ruleForm">-->
      <el-form :model="planData" :rules="rules2" ref="planData" label-width="110px">
        <!-- 计划内容 -->
        <toggle-form title="计划内容">
          <div class="content">
            <div class="row">
              <el-form-item  label="计划名称:" prop="planName">
                <el-input v-model="planData.planName" :maxlength="50" class="w250" placeholder="请输入计划名称"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="计划时间:" required v-if="initData.isCounty">
              <el-col :span="7">
                <el-form-item prop="startDate">
                  <el-date-picker v-model="planData.startDate"
                                  class="w200"
                                  format="yyyy-MM-dd"
                                  type="date"
                                  :editable="false"
                                  placeholder="选择日期"
                                  :picker-options="pickerOptions0">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">
                <div style="text-align:center">至</div>
              </el-col>
              <el-col :span="7">
                <el-form-item prop="endDate">
                  <el-date-picker v-model="planData.endDate"
                                  class="w200"
                                  format="yyyy-MM-dd"
                                  type="date"
                                  placeholder="选择日期"
                                  :editable="false"
                                  :picker-options="pickerOptions1">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>

            <div class="row" v-if="initData.isCounty">
              <el-form-item label="主体类型:" required>
                <div class="el-icon-plus add" @click="showBizAndProject"></div>
                <span v-if="valid.bizType" style="width:85px" class="el-form-item__error">请选择主体类型</span>
              </el-form-item>
           </div>

           <div class="row particularly" v-if="initData.isCounty">
              <el-form-item class="target" v-if="bizTypeAndProject.length != 0" required>
                <el-tag type="primary" v-for="(item,index) in bizTypeAndProject" :key="index" :closable="true" @close="removeTag(index)">
                  {{item.type}}({{item.project}})
                </el-tag>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="计划描述:"  >
                <el-input v-model="planData.desz" :maxlength="5000"  type="textarea" :rows="4" class="w250" placeholder="请填写计划描述">
                </el-input>
              </el-form-item>
              <span class="w250 tip">
                  (选填)
                </span>
            </div>

            <span class="row">
              <el-form-item label="相关文件:" required>
                <el-upload class="avatar-uploader" action="" :http-request="uploadImg" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
                  <el-button type="default" style="background:#F6F7F8;margin-right:20px;">点击上传</el-button>
                </el-upload>
                <span style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">最多上传5个文件，文件格式：jpg，png，doc，pdf (选填)</span>
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

        <!-- 任务分配 -->
        <span class="valid" v-if="valid.executiveAgency">请选择执行机构</span>
        <toggle-form title="任务分配" required>

          <el-table :data="initData.executesArray" ref="multipleTable" @selection-change="selectRow" style="width: 100%;margin:30px 0 160px;">
            <el-table-column align="center" width="50" label="序号">
              <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column align="center" prop="dept_name" label="下级部门"></el-table-column>
            <el-table-column align="center" type="selection"></el-table-column>
          </el-table>
        </toggle-form>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1" v-if="addOrEdit == 'ADD'">
      <div>
        <el-button type="default" @click="backBtn">取消</el-button>
        <el-button type="primary" @click="add">保存</el-button>
        <el-button type="primary" v-if="initData.isCounty == false" style="width:120px;" @click="addStart">保存并启动</el-button>
      </div>
    </div>
    <div class="foot-btn" style="z-index:1" v-if="addOrEdit == 'EDIT'">
      <div>
        <el-button type="default" @click="backBtn">取消</el-button>
        <el-button type="primary" @click="edit">保存</el-button>
        <el-button type="primary" v-if="initData.isCounty == false" style="width:120px;" @click="editStart">保存并启动</el-button>
      </div>
    </div>

    <!-- 弹窗 -->
    <yb-popup @close="close" :isShow="isShow" title="添加主体类型" width="470">
      <div slot="body">
        <el-form :model="tempData" :rules="rules" ref="tempData" label-width="120px">
          <div style="width:400px;margin:20px auto">
            <div class="row">
              <el-form-item label="主体类型:" prop="bizTypeIndex">
                <el-select v-model="tempData.bizTypeIndex" placeholder="请选择" @change="bizTypeChange($event)">
                  <el-option v-for="(item,index) in initData.bizTypes" :key="item.key" :label="item.name" :disabled=item.disabled :value="index">
                  </el-option>
                </el-select>

              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="巡查要点表:" prop="projectIndex">
                <el-select v-model="tempData.projectIndex" placeholder="请选择">
                  <el-option v-for="(item,index) in initData.projectData" :key="item.id" :label="item.name" :disabled='item.disabled' :value="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

          </div>
        </el-form>
      </div>
      <div slot="foot" style="padding-bottom:20px;">
        <el-button type="default" @click="close">取消</el-button>
        <el-button type="primary" @click="bizAdd">添加</el-button>
      </div>
    </yb-popup>
  </div>
</template>



<script>
import Back from 'utils/back.vue'		//返回上一个页面按钮
import ToggleForm from 'components/ToggleForm'
import YbPopup from 'components/ybpopup/YbPopup';
import YbSelect from 'components/ybselect/YbSelect.vue'
import { getAddData, addSpceial, getInfo, update } from "api/medi/patrol/plan";
import { uploadFile , downloadFile } from 'api/common';
import { listTableByType } from 'api/medi/patrol/project';
import {removeFile} from 'api/cfda/add';

import * as api from "api/cosmetics/patrolPlan";
import { getAreaLevel} from "api/medi/patrol/plan";
import { getEnums } from 'api/common'


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

let _this;
export default {
  components: {
    Back,
    ToggleForm,
    YbPopup,
    YbSelect
  },
  async mounted() {
   await getAreaLevel().then(r => {//判断是否==》区==》相关处理
      let areaLevel = r.data;
      if(areaLevel=='COUNTY'){
        this.initData.isCounty =true;
      }else{
        this.initData.isCounty =false;
      }
      if (!this.initData.isCounty) {
        this.valid.bizType = true;
        this.rules2.startDate[0].required = false;
        this.rules2.endDate[0].required = false;
      }
    });
    _this = this;
    let opt = this.$route.query.opt;
    this.pathFile = this.$store.getters.filePath;
    await getEnums([this.enum], false).then(r => {//主体类型枚举
      this.initData.bizTypes = r.data;
    })
    if (opt == 'add') {
      this.addOrEdit = "ADD";
      let formdata=new FormData();
      formdata.append('loadType', this.addOrEdit);
      await api.getExecutesArray(formdata).then(r => {//下级部分列表
      this.initData.executesArray = r.data;
    })
    } else if (opt == 'edit') {
      this.editInit();
      this.addOrEdit = "EDIT";
    }
   
    this.bizTypeAndProject = [];
  },
  data() {
    return {
      enum:'com.ybveg.govx.enums.cosmetic.CosmeticEntityTypeEnum',//主体类型的枚举
      limit: 5, //限制文件上传的个数
      showBigPic: -1,//是否展示大图
      uploadArr: [],//上传成功的图片数组
      percentage: 0,//需要关联的进度条
      valid: {//表单验证数据
        bizType: false,
        file: false,
        executiveAgency: false
      },
      pickerOptions0: {
        disabledDate: (time) => {
          try {
            let beginDateVal = this.planData.endDate;
            if (beginDateVal) {
              return time.getTime() >= beginDateVal || time.getTime() < Date.now() - 8.64e7;
            }
            return time.getTime() < Date.now() - 8.64e7;
          } catch (err) {
            //              console.log(err)
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          try {
            let beginDateVal = this.planData.startDate;
            if (beginDateVal) {
              return time.getTime() <= beginDateVal || time.getTime() < Date.now() - 8.64e7;
            }
            return time.getTime() < Date.now() - 8.64e7;
          } catch (err) {

          }

        }
      },
      isUploadImag:false,
      pathFile:'',
      imageUrl: '',
      isShow: false,
      addOrEdit: '',
      bizTypeAndProject: [],
      initData: {//初始化数据
        bizTypes: [],
        executesArray: [],
        isCounty: true,
        projectData: [],
      },
      planData: {
        id: "",
        planName: '',//计划名称
        startDate: null,//计划开始日期
        endDate: null,//计划结束日期
        bizType: [],//主体类型
        patrolMain: [],//巡查要点
        executiveAgency: [],//执行机构areaCode
        file: [],//文件,
        desz: '',//描述
        isStart: true,
      },
      tempData: {
        bizTypeIndex: null,
        projectIndex: null,
      },
      rules2: {
        planName: [{ required: true, message: '请输入计划名称', trigger: 'change' }],
        // desz:[{ required: true, message: '请输入计划描述', trigger: 'change' }],
        startDate: [
          { type: 'date', required: true, message: '请选择计划开始日期', trigger: 'change' },
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择计划结束时间', trigger: 'change' },
        ],
      },
      rules: {
        bizTypeIndex: [{ type: 'number', required: true, message: '请选择主体类型', trigger: 'change' }],
        projectIndex: [{ type: 'number', required: true, message: '请选择巡查要点表', trigger: 'change' }],
      }
    }
  },
  methods: {
    backBtn(){
      if(this.addOrEdit == "ADD"){
        if(this.planData != null ){
          this.$confirm('是否确定放弃添加专项巡查计划？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.$router.push({name: "cosmetics.specialList", params: {index:this.$route.query.index}});
          });
        }
      }else if(this.addOrEdit == "EDIT"){
        this.$confirm('是否确定放弃修改专项巡查计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.push({name: "cosmetics.specialList", params: {index:this.$route.query.index}});
        });
      }
    },
    selectRow(select, row) {
      let selected = [];
      if (select && select.length > 0) {
        for (let i = 0; i < select.length; i++) {
          selected.push(select[i].dept_id);
        }
        this.valid.executiveAgency = false;
      } else {
        this.valid.executiveAgency = true;
      }
      this.planData.executiveAgency = selected;
    },
    async editInit() {//编辑初始化
      let id = this.$route.query.id;
      if (!id) return;
      let { data } = await api.getInfo(id);
      if (!data.planInfo.startDate || !data.planInfo.endDate) {
        data.planInfo.startDate = null;
        data.planInfo.endDate = null;
      } else {
        data.planInfo.startDate = new Date(data.planInfo.startDate);
        data.planInfo.endDate = new Date(data.planInfo.endDate);
      }

      this.planData = data.planInfo;
      this.planData.isStart = false;

      this.planData.bizType = data.planInfo.bizType ? data.planInfo.bizType.split(",") : [];
      this.planData.patrolMain = [];

      //处理主体类型Label
      if (data.patrolTableList && data.patrolTableList.length > 0) {
        for (let i = 0; i < data.patrolTableList.length; i++) {
          let labels = {
            type: data.patrolTableList[i].entity_type_name,
            project: data.patrolTableList[i].name,
            typeKey: data.patrolTableList[i].entity_type,
            projectId: data.patrolTableList[i].id
          };
          this.bizTypeAndProject.push(labels);
          this.planData.patrolMain.push(data.patrolTableList[i].id);
        }
      }
      //处理任务分配
      let formdata=new FormData();
      formdata.append('loadType', this.addOrEdit);
      formdata.append('planId', this.$route.query.id);
      await api.getExecutesArray(formdata).then(r=>{
        this.initData.executesArray=r.data;
        this.planData.executiveAgency=[];
        this.$nextTick(function () {
          for (let i = 0; i < this.initData.executesArray.length; i++) {
            if (this.initData.executesArray[i].executor) {
                this.$refs.multipleTable.toggleRowSelection(this.initData.executesArray[i],true);
                this.planData.executiveAgency.push(this.initData.executesArray[i].id)
              }
          }
        })
      })
      

      //处理图片
      if (data.files && data.files.length > 0) {
        this.percentage = 100;
        this.uploadArr = data.files;
        this.uploadArr.forEach(item=>{
          item.path=item.fileId;
          item.type=item.fileName.substring(item.fileName.indexOf(".")+1);
        })
      }

    },
    customValid() {
      if (this.initData.isCounty) {
        if (this.planData.patrolMain.length == 0 || this.planData.bizType.length == 0) {
          this.valid.bizType = true;
        }
      } else {
        this.valid.bizType = false;
      }
      if (this.planData.executiveAgency.length == 0) {
        this.valid.executiveAgency = true;
      }
      if (this.valid.bizType || this.valid.executiveAgency) return false;
      return true;
    },
    addStart() {//保存并启动
      this.planData.isStart = true;
      this.submit();
    },
    add() {//保存
      this.planData.isStart = false;
      this.submit();
    },
    editStart() {//保存并启动
      this.planData.isStart = true;
      this.edit();
    },
    getdate(date) {
        if (date == null || date.getDate == undefined) {
          return date || ''
        }
        let mon = date.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = date.getDate();         //getMonth()返回的是0-11，则需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        debugger
        return date.getFullYear() + "-" + mon + "-" + day;
      },
    edit() {
      if(this.isUploadImag){
        this.$message({
          message: '您所提交的信息正在上传中，请稍后再提交',
          type: 'warning'
        });
        return false;
      }
      this.handleData();
      if (!this.customValid()) {
        return;
      }
      this.$refs["planData"].validate(function (valid) {
        if (valid) {
          _this.$confirm('是否确认更新该计划?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let imgArr=[];
            _this.uploadArr.forEach(item=>{
              imgArr.push(item.id);
            });
            let obj={
              'id':_this.$route.query.id,
              'planName':_this.planData.planName,
              'desz':_this.planData.desz,
              'startDate':_this.getdate(_this.planData.startDate),
              'endDate':_this.getdate(_this.planData.endDate),
              'executorIds':_this.planData.executiveAgency,
              'tableIds':_this.planData.patrolMain,
              'fileIds':imgArr,
              'startPlan':_this.planData.isStart?'YES':'NO'
            }
            api.planspecial_update(obj).then((result) => {
              if(!result.status){
                _this.$message({
                  message: result.message,
                  type: result.level
                });
                return;
              }
              _this.$message({
                message: '保存成功',
                type: 'success'
              });
              setTimeout(() => {
               _this.$router.push({name: "cosmetics.specialList", params: {index:_this.$route.query.index}});
              }, 2000);
            });
          }).catch(_ =>{});;
        }
      })
    },
    submit() {
      if(this.isUploadImag){
        this.$message({
          message: '您所提交的信息正在上传中，请稍后再提交',
          type: 'warning'
        });
        return false;
      }
      this.handleData();
      if (!this.customValid()) {
        return;
      }
      this.$refs["planData"].validate(function (valid) {
        if (valid) {
          _this.$confirm('是否确认保存该计划?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let imgArr=[];
            _this.uploadArr.forEach(item=>{
              imgArr.push(item.id);
            });
            let obj={
              'planName':_this.planData.planName,
              'desz':_this.planData.desz,
              'startDate':_this.getdate(_this.planData.startDate),
              'endDate':_this.getdate(_this.planData.endDate),
              'executorIds':_this.planData.executiveAgency,
              'tableIds':_this.planData.patrolMain,
              'fileIds':imgArr,
              'startPlan':_this.planData.isStart?'YES':'NO'
            }
            api.addSpceial(obj).then((result) => {
              if(!result.status){
                _this.$message({
                  message: result.message,
                  type: result.level
                });
                return;
              }
              _this.$message({
                message: '保存成功',
                type: 'success'
              });
              setTimeout(() => {
                _this.$router.push({name: "cosmetics.specialList", params: {index:_this.$route.query.index}});
              }, 2000);
            });
          }).catch(_ =>{});;
        }
      })
    },
    handleData() {
      this.planData.file = [];

      if (this.uploadArr && this.uploadArr.length > 0) {//处理图片数据
        this.uploadArr.forEach((f) => {
          this.planData.file.push(f.id);
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

      let _this = this
      _this.uploadArr.push(Object.assign({}, {
        fileName: fileName, type: fileType, id: '', fileId: '', path: ''      })
      );

      // 更新进度条
      function callback(e) {
        _this.percentage = Math.floor(e.percent);
      }

      await uploadFile(formdata, { type: 'PATROL_PLAN' }, callback).then((result) => {
        //          console.log(result)
        let data = result.data;
        //          let url = "http://192.168.1.40/fdfs/" + result.data;
        _this.uploadArr[_this.uploadArr.length - 1].path = data.fileId;
        _this.uploadArr[_this.uploadArr.length - 1].id = data.id;
        _this.uploadArr[_this.uploadArr.length - 1].fileId = data.fileId;
        _this.planData.file = result.data;
        _this.imageUrl = result.data;
        this.isUploadImag = false
      });
    },
    // 删除上传的文件
    async removeFile(index, file) {
      /*   console.log(file)  */
      this.$confirm('是否确认删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        if (this.$route.query.opt == 'edit'){
          removeFile(file.id).then(res =>{
            this.$message.success('文件删除成功！');
          })
        }
        this.uploadArr.arrayRemove(index);
      })
    },
    async bizTypeChange(e) {
      if (!e && e == null) {
        return;
      }
      this.tempData.projectIndex = null;
      let bizTypeSelects = this.initData.bizTypes;
      let formdata=new FormData();
      formdata.append('bizType', bizTypeSelects[e].key);
      let { data } = await api.listTableByType(formdata);
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < this.planData.patrolMain.length; j++) {
            if (data[i].id == this.planData.patrolMain[j]) {
              data[i].disabled = true;
            }
          }
        }
      }
      this.initData.projectData = data;
    },
    removeTag(index) {
      let typeAndProject = this.bizTypeAndProject[index];
      let bizTyep = this.planData.bizType;
      let patrol = this.planData.patrolMain;
      for (let i = 0; i < bizTyep.length; i++) {
        if (typeAndProject.typeKey == bizTyep[i]) {
          this.initData.bizTypes[i].disabled = false;
          this.planData.bizType.arrayRemove(i);
        }
      }
      for (let i = 0; i < patrol.length; i++) {
        if (typeAndProject.projectId == patrol[i]) {
          this.planData.patrolMain.arrayRemove(i);
        }
      }
      this.bizTypeAndProject.arrayRemove(index);//移除tag标签

      if (!this.planData.bizType || this.planData.bizType.length == 0) {
        this.valid.bizType = true;
      }

    },
    bizAdd() {
      this.$refs["tempData"].validate(function (valid) {
        if (valid) {
          let bizTypeIndex = _this.tempData.bizTypeIndex != null ? _this.tempData.bizTypeIndex : -1;
          let projectIndex = _this.tempData.projectIndex != null ? _this.tempData.projectIndex : -1;
          let bizTypeData = _this.initData.bizTypes[bizTypeIndex];
          let projectData = _this.initData.projectData[projectIndex];
          _this.planData.bizType.push(bizTypeData.key);
          _this.planData.patrolMain.push(projectData.id);
          let labels = {
            type: bizTypeData.name,
            project: projectData.name,
            typeKey: bizTypeData.key,
            projectId: projectData.id
          };
          _this.bizTypeAndProject.push(labels);
          _this.valid.bizType = false;
          _this.close();
        }
      });

    },
    fileUploadError(err, file) {
      if (this.uploadArr && this.uploadArr.length > 0) {
        let ua = this.uploadArr[this.uploadArr.length - 1];
        if (!ua.url) {
          this.uploadArr.arrayRemove(this.uploadArr.length - 1);
        }
      }
      this.$message.warning("该文件上传失败！");
    },
    async downloadFile(index, file) {
       let fileName = file.fileName;
        if(fileName) {
          fileName = fileName.substr(0,fileName.lastIndexOf('.'));
        }
      // window.open(downloadFile(file.fileId,fileName));
      downloadFile(file.fileId,fileName)
    },
    //判断数组是否包含字符串
    IsInArray(arr,val){
      var testStr=arr.join(",");
      return testStr.indexOf(val)!=-1;
    },
    beforeAvatarUpload(file) {
      //类型和大小限制
      var picType = ["doc","jpg","png","pdf"];
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
      if(!this.IsInArray(picType,testmsg)){
        this.$message.warning(`仅可上传jpg，png，doc，pdf格式的文件`);
        return false;
      }
      if(file.size/1024/1024>10){
        this.$message.warning(`上传文件大小不能超过10M`);
        return false;
      }
    },
    close() {
      this.tempData.bizTypeIndex = null;
      this.tempData.projectIndex = null;
      this.initData.projectData = [];
      this.isShow = false;
    },
    showBizAndProject() {
      this.$refs["tempData"].resetFields();
      this.isShow = true;

      let bizTypeSelects = this.initData.bizTypes;
      if (bizTypeSelects && bizTypeSelects.length > 0) {
        for (let i = 0; i < bizTypeSelects.length; i++) {
          for (let j = 0; j < this.planData.bizType.length; j++) {
            if (bizTypeSelects[i].key == this.planData.bizType[j]) {
              bizTypeSelects[i].disabled = true;
            }
          }
        }
      }
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
    .file-name{
      cursor: pointer;
      margin-right: 20px;

    }
    .file-name:hover{
      color:#1FABDC;
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
    > img {
      display: block;
      max-height: 700px;
    }
  }
}
</style>
<style lang="sass">
.particularly .target span{
  display: inline-block !important;
  max-width: none !important;
  margin:10px 10px !important;
}
</style>


