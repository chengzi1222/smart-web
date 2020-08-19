<template>
  <el-form :model="basicInfoData" :rules="rules2" ref="basicInfoData" label-width="110px">
        <toggle-form title="基础内容">
          <div class="content">
            <div class="row clear_a">
              <el-form-item label="任务名称:" prop="taskName">
                <el-tooltip class="item" effect="dark" content="最多可输入30个字符" placement="right">
                  <el-input placeholder="请输入任务名称" class="w250 seekIpt" v-model="basicInfoData.taskName" :maxlength="30"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="起止日期:" prop="startDate">
                <el-date-picker
                  v-model="basicInfoData.startDate"
                  type="daterange"
                  clearable
                  format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  value-format="yyyy-MM-dd"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions0">
                </el-date-picker>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="主体类型:">
                  <div  style="width:595px;">
                          <div>
                                <div class="el-icon-plus add" @click="showBizAndProject" v-if="pageStatus != 'EDIT' && pageStatus != 'EDITBACK'"></div>
                                <span v-if="valid.bizType" style="width:85px" class="el-form-item__error">请选择主体类型</span>
                          </div>
                          <div>
                                <el-tag type="primary" v-if="bizTypeAndProject.length != 0" v-for="(item,index) in bizTypeAndProject" :key="index" :closable="entityTypeClosable" @close="removeTag(index)">
                                  {{item.type}}({{item.project}})
                                </el-tag>
                          </div>
                  </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="任务区域:">
                   <div style="width:595px;">
                          <el-select v-model="taskareaDate.dataIndex" placeholder="请选择" @change="handleTaskArea($event)" v-if="pageStatus != 'EDIT' && pageStatus != 'EDITBACK'">
                              <el-option v-for="(item,index) in taskareaDate.data" :key="item.areaCode" :label="item.areaName" :value="index" :disabled=item.disabled>
                              </el-option>
                          </el-select>
                          <span v-if="valid.taskArea" style="width:130px" class="el-form-item__error">{{ taskAreaTxt }}</span>
                          <div class="taskarea">
                                <el-tag type="primary" v-if="taskareaDate.arr.length != 0" v-for="(item,index) in taskareaDate.arr" :key="index" :closable="taskAreaClosable" @close="removeTaskArea(index)">
                                  {{item.areaName}}
                                </el-tag>
                          </div>
                  </div>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="每组人数:" prop="eachGroups">
                  <el-select v-model="basicInfoData.eachGroups" placeholder="请选择每组人数"  clearable :disabled="eachGroupsDisabled">
                      <el-option v-for="(item,index) in arrNumber.data" :key="index" :label="item.num" :value="item.num">
                      </el-option>
                  </el-select>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="每组企业数:" prop="enterpriseGroups">
                <el-tooltip class="item" effect="dark" content="只能输入100以内的正整数" placement="right">
                  <el-input v-model="basicInfoData.enterpriseGroups" class="w250" :maxlength="3" :disabled="enterpriseGroupsDisabled"
                          placeholder="请输入每个区域随机的主体数"></el-input>
                </el-tooltip>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="企业量化等级:" prop="quantify">
                <el-checkbox-group v-model="basicInfoData.quantify" size="large" :disabled="quantityDisabled">
                  <el-checkbox-button v-for="item in quantify.resData" :label="item.id" :key="item.id" @change="handleQuantify" >{{item.nameOQ}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="企业风险等级:" prop="risk">
                <el-checkbox-group v-model="basicInfoData.risk" size="large" :disabled="riskDisabled">
                  <el-checkbox-button v-for="item in risk.resData" :label="item.id" :key="item.id" @change="handleRisk">{{item.nameOR}}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <div class="row clear_a">
              <el-form-item label="任务描述:" prop="remarks">
                <div class="clear_a">
                  <el-tooltip class="item" effect="dark" content="最多可输入300个字符" placement="right">
                    <el-input v-model="basicInfoData.remarks" type="textarea" :rows="4" class="w400"
                              placeholder="请填写任务描述" :maxlength="300">
                    </el-input>
                  </el-tooltip>
                    <span style="color: #A2AAB6;font-size:12px;line-height: 96px;margin-left: 20px;">(选填)</span>
                </div>
              </el-form-item>
            </div>

            <div class="row">
              <el-form-item label="相关文件:" prop="fileList">
                <el-upload
                  class="upload-demo"
                  action="/api/upload"
                  :data="{type: 'RANDOM_TASK'}"
                  :on-preview="handlePreview"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :before-upload="beforeUpload"
                  :file-list="fileList2"
                  :limit="fileLimit"
                  :on-exceed="handleExceed">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <span style="color: #A2AAB6;font-size:12px;margin-left: 20px;">(选填)</span>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png/doc/pdf文件，且不超过10M，最多可上传5个文件
                  </div>
                </el-upload>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img class="bigImg"  :src="dialogImageUrl" alt="">
                </div>
              </el-form-item>
            </div>
          </div>
           <!-- 弹窗 -->
            <yb-popup @close="close" :isShow="isShow" title="添加主体类型" width="470">
              <div slot="body">
                <el-form :model="tempData" :rules="rules" ref="tempData" label-width="120px">
                  <div style="width:400px;margin:20px auto">
                    <div class="row">
                      <el-form-item label="主体类型:" prop="bizTypeIndex">
                        <el-select v-model="tempData.bizTypeIndex" placeholder="请选择" @change="bizTypeChange($event)" >
                          <el-option v-for="(item,index) in initData.bizTypes" :key="item.key" :label="item.name" :disabled=item.disabled :value="index">
                          </el-option>
                        </el-select>

                      </el-form-item>
                    </div>

                    <div class="row">
                      <el-form-item label="巡查要点表:" prop="projectIndex">
                        <el-select v-model="tempData.projectIndex" placeholder="请选择">
                          <el-option v-for="(item,index) in initData.projectData" :key="item.id" :label="item.name" :disabled=item.disabled :value="index">
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
          <!-- 底部按钮taskBase -->
          <div class="foot-btn" style="z-index:1" >
            <div>
              <el-button type="default" @click="goBack">取消并返回</el-button>
              <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
          </div>
        </toggle-form>
  </el-form>
</template>



<script>
import ToggleForm from 'components/ToggleForm'
import YbPopup from 'components/ybpopup/YbPopup';
import { uploadFile, downloadFile, getEnums } from 'api/common';
import { listTableByType } from 'api/random/project';
import * as randomTask from 'api/random/random';
import { listDict } from "api/enforce/punish";
Array.prototype.arrayRemove = function (dx) {
  if (isNaN(dx) || dx > this.length) { return false; }
  this.splice(dx, 1);
}

let _this;
export default {
  components: {
    ToggleForm,
    YbPopup,
  },
  async mounted() {
    this.getEntityType();
    this.listTaskArea();
    this.listQuantify();
    this.listRisk();
    // 上一步
    let backData = this.backData;
    let randomTaskId = this.$route.params.randomTaskId;
    if(backData.startDate != '' && randomTaskId == null){
      this.pageStatus = 'BACK';
      this.basicInfoData = backData;
      // 起止日期
      var backDate = new Array(2);
      backDate[0] = backData.startDate;
      backDate[1] = backData.endDate;
      this.basicInfoData.startDate = backDate;
      // 主体类型
      for(let i = 0;i < backData.entityType.length; i++){
        this.bizTypeAndProject.push(backData.entityType[i]);
      }
      // 任务区域
      for(let i = 0;i < backData.taskAreas.length; i++){
        this.taskareaDate.arr.push(backData.taskAreas[i]);
      }
      this.disableTaskArea(backData.taskAreas,backData.taskAreaList);
      // 相关文件
      this.showFileList(backData.fileList);
      this.isQuantifySelected = true;
      this.isRiskSelected = true;
      this.isTaskAreaSelected = true;
    }else if(randomTaskId != null && backData.startDate == ''){
      this.pageStatus = 'EDIT';
      // 编辑
      randomTask.getRandomTaskById(randomTaskId).then(r => {
        this.basicInfoData = r.data;
        this.initEditData(r.data);
      })
    }else if(randomTaskId != null && backData.startDate != ''){
      // 编辑上一步
      this.pageStatus = 'EDITBACK';
      this.basicInfoData = backData;
      this.editLastStepData(backData);
    }else {
      this.bizTypeAndProject = [];
    }

    _this = this;
    this.pathFile = this.$store.getters.filePath;
    this.checkedAttrData = [];


  },
  data() {
    var checkQuantify = (rule, value, callback) => {
      if (!this.isQuantifySelected) {
        callback(new Error('请选择企业量化等级'));
      } else {
        callback();
      }
    };
    var checkRisk = (rule, value, callback) => {
      if (!this.isRiskSelected) {
        callback(new Error('请选择企业风险等级'));
      } else {
        callback();
      }
    };
    var checkEnterpriseGroups = (rule, value, callback) => {

      if (!this.basicInfoData.enterpriseGroups || this.basicInfoData.enterpriseGroups == 0) {
        callback(new Error('请输入每组企业数'));
      }else{
        if(/^[0-9]+$/.test(value) && value <= 100){
          callback();
        }else{
          callback(new Error('请输入正确的数值'));
        }
      }
    };
    return {
      risk:{
        arr:[],
        resData:[]
      },//风险
      quantify:{
        arr:[],
        resData:[]
      },//量化
      taskareaDate:{//任务区域相关数据
          data:[],//任务区域下来框显示数据
          dataIndex:"",//当前选择index
          arr:[],//选择的数据数组
      },
      arrNumber:{
        index:null,
        data:[
          {num:"2",key:"2"},
          {num:"3",key:"3"},
          {num:"4",key:"4"},
          {num:"5",key:"5"},
          {num:"6",key:"6"},
          {num:"7",key:"7"},
          {num:"8",key:"8"},
          {num:"9",key:"9"},
          {num:"10",key:"10"},
        ]
      },//每组人数
      fileLimit: 5, //限制文件上传的个数
      showBigPic: -1,//是否展示大图
      uploadArr: [],//上传成功的图片数组
      valid: {//表单验证数据
        bizType: false,
        file: false,
        executiveAgency: false,
        taskArea: false
      },
      taskAreaTxt: "",
       date:{
        start:null,
        end:null
      },
      initData:{
        bizTypes: [],
        projectData:[],
      },
      isTaskAreaSelected: false,
      isQuantifySelected: false,
      isRiskSelected: false,
      isFileUpload: false,
      entityTypeClosable: true,
      taskAreaClosable: true,
      quantityDisabled: false,
      riskDisabled: false,
      eachGroupsDisabled: false,
      enterpriseGroupsDisabled: false,
      isListQuantify: true,
      isListRisk: true,
      fileList2: [],
      basicInfoData: {
        randomTaskId: '',
        taskName: '',
        startDate:[],
        endDate:'',
        entityType:[],
        taskAreas:[],
        eachGroups:'',
        enterpriseGroups:'',
        quantify:[],
        risk:[],
        remarks:'',
        fileList:[],
        quantifyList:[],
        riskList:[],
        taskAreaList: []
      },
      taskAreaList: [],
      entityTypeList: [],
      projectTableList: [],
      pickerOptions0: {

      },
      pageStatus: 'FIRST',
      pathFile:'',
      imageUrl: '',
      isShow: false,//弹框
      addOrEdit: '',
      checkedAttrData: [],
      detailedEngage:[],
      bizTypeAndProject: [],
      dialogVisible: false,
      planData: {
        bizType: [],//主体类型
        patrolMain: [],//巡查要点
      },
      tempData: {
        bizTypeIndex: null,
        projectIndex: null,
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
          }
        }
      },

      rules: {
        bizTypeIndex: [{ required: true, message: '请选择主体类型', trigger: 'change' }],
        projectIndex: [{ required: true, message: '请选择巡查内容', trigger: 'change' }],
      },
      rules2: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        startDate: [
          {required: true, message: '请选择起止日期', trigger: 'change'}
        ],
        eachGroups: [
          { required: true, message: '请选择每组人数', trigger: 'change' }
        ],
        enterpriseGroups: [
          {validator: checkEnterpriseGroups, trigger: 'change' }
        ],
        quantify: [
          {validator: checkQuantify, message: '请选择企业量化等级', trigger: 'change'}
        ],
        risk: [
          {validator: checkRisk, message: '请选择企业风险等级', trigger: 'change'}
        ],
      },
    }
  },
  props:{
    backData:Object
  },
  methods: {
    goBack () {
      if (this.$route.params.randomTaskId) {
        // 编辑
        this.$confirm('是否确认取消修改双随机计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
        })
      } else {
        // 添加
        this.$confirm('是否确认取消添加双随机计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
        })
      }
    },
    nextStep(){
      if(!this.customValid()){
        return false;
      }else {
        this.$refs['basicInfoData'].validate((valid) => {
          if (valid) {
            let val =  this.basicInfoData.startDate;
            this.basicInfoData.startDate = val.slice(0,val.indexOf(","))[0];
            this.basicInfoData.endDate = val.slice(val.indexOf(","))[0];
            this.basicInfoData.quantifyList = this.quantify.resData;
            this.basicInfoData.riskList = this.risk.resData;
            this.basicInfoData.taskAreaList = this.taskareaDate.data;
            this.$emit("getBaseData",this.basicInfoData);
          } else {
            return false;
          }
        });
      }
    },
    customValid() {
      var flag = true;
      if (!this.basicInfoData.entityType || this.basicInfoData.entityType.length == 0) {
        this.valid.bizType = true;
        flag = false;
      }
      if(!this.basicInfoData.taskAreas || this.basicInfoData.taskAreas.length == 0){
        this.valid.taskArea = true;
        this.taskAreaTxt = "请选择任务区域"
        flag = false;
      }else if(this.basicInfoData.taskAreas.length < 2) {
        this.valid.taskArea = true;
        this.taskAreaTxt = "请至少选择2个任务区域"
        flag = false;
      }

      return flag;
    },

    getEntityType(){
      var entityEnum = "com.ybveg.govx.enums.SubTypeEnum";

      // 主体类型下拉列表
      getEnums([entityEnum], false).then(result => {
        this.initData.bizTypes = result.data;
      })
    },

    listTaskArea(){
      // 任务区域下拉列表
      randomTask.listTaskArea().then(result => {

        if(this.pageStatus == 'BACK'){
          this.taskareaDate.data = this.basicInfoData.taskAreaList;
        }else {
          this.taskareaDate.data = result.data;
        }

      })
    },

    listQuantify(){
      var quantifyLevelDictCode = "OTHER_QUANTIFY";
      // 量化等级下拉列表
      listDict(quantifyLevelDictCode).then(result => {
        if(this.isListQuantify){
          this.quantify.resData = result.data;
          this.quantify.resData.push({"nameOQ":"未评估","id":'未评估'});
        }
      })


    },

    listRisk(){
      var riskLevelDictCode = "OTHER_RISK";
      // 风险等级下拉列表
      listDict(riskLevelDictCode).then(result => {
        if(this.isListRisk){
          this.risk.resData = result.data;
          this.risk.resData.push({"nameOR":"未评估","id":'未评估'});
        }
      })
    },

    showFileList(val){
      for(let i = 0;i < val.length; i++){
        this.fileList2.push({name:val[i].fileName,url:this.pathFile + val[i].fileId});
      }

    },

    handleQuantify(){
      let quantify = this.basicInfoData.quantify;
      if(quantify.length == 0){
        this.isQuantifySelected = false;
      }else{
        this.isQuantifySelected = true;
      }
    },

    handleRisk(){
      let risk = this.basicInfoData.risk;
      if(risk.length == 0){
        this.isRiskSelected = false;
      }else{
        this.isRiskSelected = true;
      }
    },

    //区域选择事件
    handleTaskArea(index){
      let taskArea = this.taskareaDate.data[index];
      taskArea.disabled = true;
      this.taskareaDate.arr.push(taskArea);
      this.basicInfoData.taskAreas.push(taskArea);
      this.isTaskAreaSelected = true;
      this.checkTaskArea();

    },
    checkTaskArea(){

      if (!this.basicInfoData.taskAreas || this.basicInfoData.taskAreas.length == 0) {
        this.valid.taskArea = true;
        this.taskAreaTxt = "请选择任务区域"
      }else if(this.basicInfoData.taskAreas.length < 2){
        this.valid.taskArea = true;
        this.taskAreaTxt = "请至少选择2个任务区域"
      }else{
        this.valid.taskArea = false;
      }
    },
    removeTaskArea(index){//区域选择删除
      let key = this.taskareaDate.arr[index].areaCode;
      for(let i in this.taskareaDate.data){
        if(this.taskareaDate.data[i].areaCode == key) {
          this.taskareaDate.data[i].disabled=false;
        }
      }
      this.taskareaDate.arr.arrayRemove(index);
      this.basicInfoData.taskAreas.arrayRemove(index);
      this.taskareaDate.dataIndex = "";

      this.checkTaskArea();
    },
    // 相关文件上传成功后钩子
    handleSuccess(response) {
      this.isFileUpload = true;
      this.basicInfoData.fileList.push(response.data);
    },
    // 上传失败后钩子
    handleError(response) {
      this.$message.error(
        `文件上传失败！`);
    },
    // 超出限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `最多可上传 5 个文件， 当前已选择 ${fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      if (file.status != 'ready') {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
    handleRemove(file, fileList) {
      this.basicInfoData.fileList.splice(
        this.basicInfoData.fileList.indexOf(file), 1);

    },
    handlePreview(file) {
      let type = file.name.substr(file.name.lastIndexOf('.'));
      let isJPG =
        type === '.png' ||
        type === '.jpg' ||
        type === '.jpeg';
      if (isJPG) {
        this.dialogVisible = true;
        if(this.pageStatus == 'BACK' || this.pageStatus == 'EDITBACK'){
          this.dialogImageUrl = this.pathFile + file.url;
        }else if(this.pageStatus == 'EDIT'){
          this.dialogImageUrl = file.url;
        }else{
          this.dialogImageUrl = this.pathFile + file.response.data.fileId;
        }
      } else {
        let index
        this.handleDownload(file.response.data.fileId, ((index = file.name.lastIndexOf('.')) == -1 ? file.name : file.name.substring(0, index)));
      }
    },
    // 下载文件
    async handleDownload(fileId, fileName) {
      // window.open(downloadFile(fileId, fileName));
      downloadFile(fileId, fileName)
    },
    //判断数组是否包含字符串
    IsInArray(arr,val){
      var testStr=arr.join(",");
      return testStr.indexOf(val)!=-1;
    },
    beforeUpload(file) {
      //类型和大小限制
      var picType = ["doc","jpg","png","pdf"];
      var testmsg=file.name.substring(file.name.lastIndexOf('.')+1).toLowerCase();
      if(!this.IsInArray(picType,testmsg)){
        this.$message.warning(`仅可上传jpg，png，doc，pdf格式的图片`);
        return false;
      }
      if(file.size/1024/1024>10){
        this.$message.warning(`上传图片大小不能超过10M`);
        return false;
      }
    },
    async bizTypeChange(e) {
      if (!e && e == null) {
        return;
      }
      this.tempData.projectIndex = null;
      let bizTypeSelects = this.initData.bizTypes;
      let { data } = await listTableByType(bizTypeSelects[e].key);
      this.initData.projectData = data;
    },
    removeTag(index) {
      let key =  this.bizTypeAndProject[index].typeKey;
      let bizTypes = this.initData.bizTypes;
      for(let i = 0; i < bizTypes.length; i++){
        if(key == bizTypes[i].key){
          bizTypes[i].disabled = false;
        }
      }

      this.bizTypeAndProject.arrayRemove(index);//移除tag标签
      this.basicInfoData.entityType.arrayRemove(index);
      if (!this.basicInfoData.entityType || this.basicInfoData.entityType.length == 0) {
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
          _this.basicInfoData.entityType.push(labels);
          _this.valid.bizType = false;
          _this.close();
        }
      });

    },
    close() {
      this.tempData.bizTypeIndex = null;
      this.tempData.projectIndex = null;
      this.initData.projectData = [];
      this.isShow = false;
    },
    showBizAndProject() { //弹框事件
      this.$refs["tempData"].resetFields();
      this.isShow = true;
      let bizTypeSelects = this.initData.bizTypes;
      if (bizTypeSelects && bizTypeSelects.length > 0) {
        for (let i = 0; i < bizTypeSelects.length; i++) {
          for (let j = 0; j < this.bizTypeAndProject.length; j++) {
            if (bizTypeSelects[i].key == this.bizTypeAndProject[j].typeKey) {
              bizTypeSelects[i].disabled = true;
            }
          }
        }
      }

    },
    disableTaskArea(taskAreas){
      let taskAreaList = this.taskareaDate.data;
      for(let i = 0;i < taskAreas.length; i++){
        for(let j = 0;j < taskAreaList.length; j++){
          if(taskAreas[i].areaCode == taskAreaList[j].areaCode){
            taskAreaList[j].disabled = true;
          }
        }
      }

    },

    initEditData(initData){
      let baseData = this.basicInfoData;
      this.isQuantifySelected = true;
      this.isRiskSelected = true;
      this.isTaskAreaSelected = true;

      // 起止日期
      var editDate = new Array(2);
      editDate[0] = initData.startDate.substr(0,10);
      editDate[1] = initData.endDate.substr(0,10);
      baseData.startDate = editDate;
      // 主体类型
      var entityTypeList = initData.entityTypeList;
      this.entityTypeClosable = false;
      for(let i = 0; i <  entityTypeList.length; i++){
        let labels = {
          type: entityTypeList[i].entityTypeName,
          project: entityTypeList[i].tableName,
          typeKey: entityTypeList[i].entityType,
          projectId: entityTypeList[i].tableId,
      };
      this.bizTypeAndProject.push(labels);
      baseData.entityType = this.bizTypeAndProject;
      }

      // 任务区域
      this.taskAreaClosable = false;
      this.taskareaDate.arr = initData.taskAreaList;
      baseData.taskAreas = initData.taskAreaList;
      // 量化等级
      baseData.quantify = initData.quantify.split(",");
      let quantify = this.quantify.resData;
      if(quantify.length === 0){
        this.listQuantify();
        quantify = this.quantify.resData;
      }
      var selectedQuantify = new Array();
      for(let v = 0; v < quantify.length; v++){
        for(let j = 0; j < baseData.quantify.length; j++){
          if(quantify[v].id == baseData.quantify[j]){
            selectedQuantify.push(quantify[v]);
          }
        }
      }
      this.quantify.resData = selectedQuantify;
      this.quantityDisabled = true;

      // 风险等级
      baseData.risk = initData.risk.split(",");
      let risk = this.risk.resData;
      var selectedRisk = new Array();
      for(let k = 0; k < risk.length; k++){
        for(let r = 0; r < baseData.risk.length; r++){
          if(risk[k].id == baseData.risk[r]){
            selectedRisk.push(risk[k]);
          }
        }
      }
      this.risk.resData = selectedRisk;
      this.riskDisabled = true;
      // 每组人数
      this.eachGroupsDisabled = true;
      // 每组企业数
      this.enterpriseGroupsDisabled = true;
      // 相关文件
      this.showFileList(initData.fileList);
    },

    editLastStepData(initData){
      let baseData = this.basicInfoData;
      baseData.taskName = initData.taskName;
      baseData.remarks = initData.remarks;
      this.isQuantifySelected = true;
      this.isRiskSelected = true;
      this.isTaskAreaSelected = true;

      // 起止日期
      var editDate = new Array(2);
      editDate[0] = initData.startDate.substr(0,10);
      editDate[1] = initData.endDate.substr(0,10);
      baseData.startDate = editDate;
      // 主体类型
      var entityTypeList = initData.entityTypeList;
      this.entityTypeClosable = false;
      for(let i = 0; i <  entityTypeList.length; i++){
        let labels = {
          type: entityTypeList[i].entityTypeName,
          project: entityTypeList[i].tableName,
          typeKey: entityTypeList[i].entityType,
          projectId: entityTypeList[i].tableId,
        };
        this.bizTypeAndProject.push(labels);
        baseData.entityType = this.bizTypeAndProject;
      }

      // 任务区域
      this.taskAreaClosable = false;
      this.taskareaDate.arr = initData.taskAreas;
      baseData.taskAreas = initData.taskAreas;
      // 量化等级
      this.quantify.resData = initData.quantifyList;
      this.isListQuantify = false;
      this.quantityDisabled = true;
      // 风险等级
      this.risk.resData = initData.riskList;
      this.isListRisk = false;
      this.riskDisabled = true;
      // 每组人数
      baseData.eachGroups = initData.eachGroups;
      this.eachGroupsDisabled = true;
      // 每组企业数
      baseData.enterpriseGroups = initData.enterpriseGroups;
      this.enterpriseGroupsDisabled = true;
      // 相关文件
      this.showFileList(initData.fileList);
      this.isQuantifySelected = true;
      this.isRiskSelected = true;
      this.isTaskAreaSelected = true;

    }
  },
  computed: {
    filePath() {
      return this.$store.getters.filePath
    },
  }
}
</script>

<style lang="scss" scoped>
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .row .el-form-item {
    margin-right: 0 !important;
  }

  .el-tag{
    display:inline-block;
    margin: 10px 10px 10px 0;
    height: auto;
    padding: 5px;
  }
  .taskarea .el-tag{
    display: inline-block !important;
    margin: 10px 10px 10px 0;
    height: auto;
    padding: 5px;
  }
  .content {
    width: 710px;
    min-height: 800px;
    margin: 20px auto;
  }
  .row{
    margin-bottom:25px;
  }
  .label{
    display: inline-block;
    line-height:34px;
    width: 100px;
    text-align:right;
    margin-right:10px;
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

  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top: 0;
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,.5);

  }
  .bigImg{
    min-width: 450px;
    max-width: 80%;
  }
</style>


