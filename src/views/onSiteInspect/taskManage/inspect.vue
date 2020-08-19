<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">核查</span>
    </div>
    <div class="container">
      <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="140px" class="demo-ruleForm">
        <!-- 基本信息 -->
        <toggle-form title="基本信息">
          <div class="content">
            <div class="row">
              <el-form-item label="经营者名称:">
                <span>{{baseInfo.entityName ? baseInfo.entityName  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="隶属区县:">
                <span>{{baseInfo.areaName ? baseInfo.areaName  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="申请日期:">
                <span> {{baseInfo.applyDate ? baseInfo.applyDate  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="申请类型:">
                <span>{{applyType[baseInfo.applyType]}}</span>
              </el-form-item>
              <el-form-item label="业务状态:">
                <span>{{baseInfo.businessType ? baseInfo.businessType  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="主体状态:">
                <span>{{baseInfo.subType ? baseInfo.subType  : '暂无'}}</span>
              </el-form-item>
              <el-form-item label="法人/负责人:">
                <span>{{baseInfo.legalPerson ? baseInfo.legalPerson  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="经营场所:">
                <span>{{baseInfo.spaceAddr ? baseInfo.spaceAddr  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="许可证编号:">
                <span>{{baseInfo.licence ? baseInfo.licence  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="业务受理号:">
                <span>{{baseInfo.no ? baseInfo.no  : '暂无'}}</span>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="导入时间:">
                <span>{{baseInfo.createTime ? baseInfo.createTime  : '暂无'}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 巡查项 -->
        <toggle-form title="现场核查项">
          <div class="content row">
            <el-form-item :label="tableList.length > 0? '更换要点表:':'选择要点表:'">
              <el-button size="medium" round @click="showTip = true">{{formName}}</el-button>
            </el-form-item>
          </div>
          <div class="mT35" v-if="tableList">
            <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item"
              :span-method="tableOption" border class="table-div brN mT0">
              <el-table-column show-overflow-tooltip prop="projectsNo" label="核查项编号" min-width="50"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120"></el-table-column>
              <el-table-column show-overflow-tooltip prop="contextNo" label="核查内容编号" min-width="50"></el-table-column>
              <el-table-column show-overflow-tooltip prop="context" label="核查内容" min-width="250"></el-table-column>
              <el-table-column show-overflow-tooltip prop="importantStr" label="重要性" min-width="80"></el-table-column>
              <el-table-column align="center" label="是否符合" min-width="250">
                <template slot-scope="scope">
                  <single-checkbox :currentRowData="scope.row" :currentResult="scope.row.result"
                    @singlecheckboxchange="singlecheckboxchange">
                  </single-checkbox>
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注" min-width='180'>
                <template slot-scope="scope">
                  <input type="text" class="w140" v-model="scope.row.remark" :maxlength="100"
                    :disabled="!scope.row.result" placeholder="备注前先选择是否符合">
                </template>
              </el-table-column>
              <el-table-column align="center" label="附件" min-width='80'>
                <template slot-scope="scope">
                  <el-upload action="/api/upload" :before-upload="beforeUpPic" :on-success="picSuccess"
                    :on-error="uploadError" :data="{type:'',field:'PHOTO'}" :show-file-list="false">
                    <el-button type="default" style="background:#F6F7F8;margin-right:20px;" @click="getRow(scope.row)">
                      上传
                    </el-button>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column label="附件" min-width="120">
                <template slot-scope="scope" v-if="scope.row.isShowFile">
                  <div class="accessoryList">
                    <span class="movePoin" @mouseenter="accessoryList($event,scope.row)"
                      @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="content row">
            <el-form-item label="使用说明: ">
              <span>{{formInfo.description?formInfo.description:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="使用类型: ">
              <span>{{formInfo.businessType?formInfo.businessType:'暂无'}}</span>
            </el-form-item>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form title="巡查结果">
          <div class="content">
            <div class="row ml30 textC" style="color: #6D7787;">
              本次核查（核查不合格项），关键项{{formInfo.currentCruxNum}}项，重点项{{formInfo.currentImportNum}}项，
              一般项{{formInfo.currentGeneralNum}}项，共{{formInfo.currentCruxNum+formInfo.currentImportNum+formInfo.currentGeneralNum}}项，经核查：
            </div>
            <div class="row result ml30">
              <div class="item">
                <div class="number">
                  {{contextStat.unImpor3Count}}
                </div>
                <div class="project-name">关键项不合格</div>
              </div>
              <div class="item">
                <div class="number">
                  {{contextStat.unImpor2Count}}
                </div>
                <div class="project-name">重点项不合格</div>
              </div>
              <div class="item">
                <div class="number">
                  {{contextStat.unImpor1Count}}
                </div>
                <div class="project-name">一般项不合格</div>
              </div>
            </div>
            <div class="row ml30 mb20 textC" style="color: #6D7787;">
              判定标准：关键项不符合数：≤{{formInfo.cruxNum}}项，重点项不符合数：≤{{formInfo.importantNum}}项，一般项+重点项不符合数：≤{{formInfo.generalImportNum}}项
            </div>
            <div class="row bottomContent">
              <el-form-item label="核查结果：" :required='true'>
                <el-radio-group :disabled='true' size="medium" v-model="repatrol.result">
                  <el-radio-button label="YES">符合规定</el-radio-button>
                  <el-radio-button label="NO">不符合规定</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="处理方式：" prop="treat">
                <el-radio-group v-model="repatrol.treat" size="medium" @change="rulesChange('treat')"
                  :disabled='!repatrol.result' :title="'巡查项是否符合必须全部勾选！！！'">
                  <el-radio-button label="NORMAL">正常</el-radio-button>
                  <!-- v-if="baseInfo.repatrolConut<=1"  -->
                  <el-radio-button label="RECTIFY">限期整改</el-radio-button>
                  <el-radio-button label="REJECT">驳回</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

            <div v-if="repatrol.treat === 'RECTIFY'" class="row bottomContent">
              <el-form-item label="整改期限：" prop="rectifyTime" :required='true'>
                <el-date-picker class="w200" v-model="repatrol.rectifyTime" type="date" placeholder="选择整改期限"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="核查人：" prop="inspectorUserId">
                <el-select v-model="repatrol.inspectorUserId" class="w250 " placeholder="请输入搜索核查人员" filterable remote
                  reserve-keyword :remote-method="inspectorUserIdMethod" :loading="inspectorListLoading"
                  @change="inspectorUserIdChange">
                  <el-option :data-tel='item.inspectedUserTel' v-for="item in inspectorList" :key="item.inspectorUserId"
                    :label="item.inspectorUserName" :value="item.inspectorUserId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="手机号：" prop="inspectorUserTel">
                <el-input v-model="repatrol.inspectorUserTel" class="w250" @input="change($event)" :maxlength="11"
                  placeholder="请输入手机号">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="备注：">
                <el-input v-model="repatrol.remark" class="w250" :maxlength="100" type="textarea"
                  placeholder="请输入备注，200以内" :rows="4">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="被检查人：" prop="inspectedUserName">
                <el-input v-model="repatrol.inspectedUserName" class="w250" @input="change($event)"
                  placeholder="请输入被检查人">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="手机号：" prop="inspectedUserTel">
                <el-input v-model="repatrol.inspectedUserTel" class="w250" @input="change($event)" :maxlength="11"
                  placeholder="请输入申请人联系电话">
                </el-input>
              </el-form-item>
            </div>
            <div class="row bottomContent">
              <el-form-item label="企业电子签名：" prop="cooperate">
                <el-radio-group v-model="repatrol.cooperate" size="medium" @change="rulesChange('cooperate')">
                  <el-radio-button label="YES">企业配合上传</el-radio-button>
                  <el-radio-button label="NO">企业拒绝配合</el-radio-button>
                </el-radio-group>
                <!--  -->
                <el-upload :class="{'hide':signLimit}" :file-list="sign" class="mt20" action="/api/upload"
                  v-if="repatrol.cooperate === 'YES'" list-type="picture-card" :on-success="signSuccess"
                  :on-error="uploadError" :data="{type:'', field: 'SIGN'}" :before-upload="beforeSignUpload"
                  :on-preview="signPreview" :on-remove="signRemove" :limit="1">
                  <i class="avatar-uploader-icon el-icon-plus">
                    <p class="upload-p">点击上传签名</p>
                  </i>
                </el-upload>
                <Preview v-if='signId' :key='"signId"' :showImg="PreviewShow" @close="PreviewShow = false"
                  :currentIndex='PreviewIndex' :title='PreviewTitle' :imgList="PreviewFileList"></Preview>
                <p class="bz" v-if="repatrol.cooperate === 'YES'" style="margin-top: 10px;">支持jpg、png、gif格式，1张，5m以内</p>
              </el-form-item>
            </div>
            <div class="row bottomContent" v-if="repatrol.cooperate === 'NO'">
              <el-form-item label="拒绝签名理由：" prop="noCooperateRemark" :required="true">
                <el-input v-model="repatrol.noCooperateRemark" class="w250" :maxlength="100" type="textarea"
                  placeholder="请输入理由，100字以内" :rows="4">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
    </div>


    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>

        <el-button @click="$router.go(-1)" style="width:120px;">返回
        </el-button>
        <el-button :disabled="updateSuccess" type="primary" @click="submit">保存
        </el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true"
      @mouseleave="accessoryListIf = false">
      <div>
        <p v-for="(item,index) in itemPicList" :key="item.picSrc">
          <span @click.stop="previewImg(itemPicList,index,'巡查项附件')">
            <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
              {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
            </a>
          </span>
          <span @click="deletePic(item.id,item.contextId)" style="color: #1787AD;cursor:pointer;"> 删除</span>
        </p>
      </div>
    </div>
    <Preview v-if='itemPicList.length>0' :key='"itemPicList"' :showImg="PreviewShow" @close="PreviewShow = false"
      :currentIndex='PreviewIndex' :title='PreviewTitle' :imgList="PreviewFileList"></Preview>
    <Select-form :showTip="showTip" v-if="showTip" @cancel="cancel" @addConfirm="addConfirm"></Select-form>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import SingleCheckbox from "../com/SingleCheckbox.vue";
  import Preview from 'components/togOss/previewImg';
  import SelectForm from './seletForm';
  import {
    removeFile
  } from 'api/cfda/add'
  import * as api from '../../../api/xchc/index';
  import {
    phoneValid
  } from 'utils/validate'

  export default {
    components: {
      ToggleForm,
      SingleCheckbox,
      Preview,
      SelectForm
    },
    data() {
      return {
        formName: '请选择要点表',
        showTip: false,
        inspectorListLoading: false,
        inspectorList: [],
        formInfo: {
          businessType: '',
          description: '',
          cruxNum: 0,
          generalImportNum: 0,
          importantNum: 0,
          currentCruxNum: 0,
          currentGeneralNum: 0,
          currentImportNum: 0
        },
        applyType: {
          'NEW': '新办',
          'CHANGE': '变更',
          'CONTINUE': '延续',
          'SUPPLEMENT': '补证',
          'LOGOUT': '注销',
          'REPLACE': '换证'
        },
        baseInfo: {
          sourceTime: ''
        }, //init 数据
        tableList: [],
        //sumbit 数据集合
        repatrol: {
          contents: [],
          cooperate: '',
          taskId: '',
          patrolTableId: '',
          inspectorUserId: '',
          inspectorUserTel: '',
          inspectedUserName: '',
          noCooperateRemark: '',
          remark: "",
          rectifyTime: "",
          result: '',
          treat: '',
          sign: ''
        },
        filePath: "",
        //巡查项图片显示相关
        accessoryListIf: false,
        itemPicList: [],
        PreviewShow: false,
        PreviewFileList: [],
        PreviewIndex: 0,
        PreviewTitle: '',
        //巡查项图片地址
        photoJson: {},
        rowId: '',
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        row_: {},
        contextStat: {
          contextCount: 0,
          impor3Count: 0,
          impor2Count: 0,
          impor1Count: 0,
          unImpor3Count: 0,
          unImpor2Count: 0,
          unImpor1Count: 0,
        },

        rules: {
          treat: {
            required: true,
            message: '请选择处理方式',
            trigger: 'change'
          },
          // result: {
          //   required: true,
          //   message: '核查项是否符合必须全部勾选才可显示核查结果',
          //   trigger: 'change'
          // },
          inspectorUserId: {
            required: true,
            message: '请输入搜索选择核查人',
            trigger: 'change'
          },
          inspectedUserTel: [{
            required: true,
            message: '请输入被检查人电话',
            trigger: 'change'
          }, {
            validator: phoneValid,
            trigger: 'blur'
          }],
          inspectorUserTel: [{
            required: true,
            message: '请输入核查人电话',
            trigger: 'change'
          }, {
            validator: phoneValid,
            trigger: 'blur'
          }],
          inspectedUserName: {
            required: true,
            message: '请输入被检查人',
            trigger: 'blur'
          },
          cooperate: {
            required: true,
            message: '请选择是否配合上传',
            trigger: 'change'
          },
        },

        updateSuccess: false,
        signId: "", //签名图片
        sign: [],
        signLimit: false,
        loading: false,
        pickerOptions: {
          disabledDate: this.disabledDate
        },
        today: '',
      };
    },
    mounted() {
      this.filePath = this.$store.getters.filePath;
      this.repatrol.taskId = this.$route.query.id;
      this.getBaseInfo()
    },
    methods: {
      async getBaseInfo() {
        let result = await api.checkBaseInfo({
          taskId: this.repatrol.taskId
        })
        this.baseInfo = result.data
        this.repatrol.inspectedUserName = result.data.legalPerson
      },
      cancel() {
        this.showTip = false
      },
      async addConfirm(id, name) {
        this.showTip = false
        this.formName = name
        api.projectInfo(id).then(result => {
          if (result.status) {
            let d = result.data
            this.tableList = [];
            for (let i = 0; i < d.length; i++) {
              let list = [];
              for (let j = 0; j < d[i].contentInfoList.length; j++) {
                // this.contextStat.contextCount += 1
                if (d[i].contentInfoList[j].status !== 'NO') {
                  this.photoJson[d[i].contentInfoList[j].id] = []
                  let obj = {
                    projectsNo: d[i].no,
                    contextNo: d[i].contentInfoList[j].no,
                    name: d[i].name,
                    id: d[i].contentInfoList[j].id,
                    context: d[i].contentInfoList[j].content,
                    importantStr: this.filter(d[i].contentInfoList[j].importance),
                    important: d[i].contentInfoList[j].importance,
                    quickCheck: d[i].contentInfoList[j].quickCheck,
                    result: '',
                    remark: '',
                    files: []
                  }
                  list.push(obj);
                }
              }
              d[i].contentInfoList.length > 0 && list.length > 0 ? this.tableList.push(list) : '';
            }
            this.repatrol = {
              contents: [],
              cooperate: '',
              taskId: this.$route.query.id,
              patrolTableId: id,
              inspectorUserId: '',
              inspectorUserTel: '',
              inspectedUserName: this.baseInfo.legalPerson,
              noCooperateRemark: '',
              remark: "",
              rectifyTime: "",
              result: '',
              treat: '',
              sign: ''
            }
            this.contextStat.unImpor3Count = 0
            this.contextStat.unImpor2Count = 0
            this.contextStat.unImpor1Count = 0
          }
        })
        this.repatrol.patrolTableId = id
        let result = await api.getBaseData({
          tableId: id
        })
        this.formInfo = result.data
        this.getNowDay()
      },
      submit() {
        // 巡查项校验
        let verify = false
        this.tableList.forEach(item => {
          item.forEach(context => {
            if (context.result == undefined || context.result == '') {
              verify = true
            }
          })
        })
        if (verify) {
          this.$message.error('巡查内容是否符合必须全部勾选')
          return false;
        }
        // 
        if (this.repatrol.cooperate == 'YES' && this.signId == '') {
          this.$message.error('请添加企业电子签名!')
          return false
        }
        // 
        if (this.repatrol.result == 'YES') {
          if (this.repatrol.treat == 'RECTIFY' || this.repatrol.treat == 'REJECT') {
            this.$message.error('核查结果符合规定情况下只能选择‘正常’的处理方式!')
            return false
          }
        }
        if (this.repatrol.result == 'NO') {
          if (this.repatrol.treat == 'NORMAL') {
            this.$message.error('核查结果不符合规定情况下只能选择‘限期整改’和‘驳回’的处理方式!')
            return false
          }
        }
        //
        this.$refs['repatrol'].validate((valid) => {
          //校验完成弹出提示框
          if (valid) {
            this.$confirm('是否要提交核查记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tableList.forEach(item => {
                item.forEach(context => {
                  let obj = {};
                  obj.id = context.id;
                  obj.result = context.result;
                  obj.remark = context.remark;
                  obj.quickCheck = context.quickCheck;
                  //图片
                  if (this.photoJson[context.id]) {
                    let jsons = this.photoJson[context.id];
                    obj.fileIds = jsons.map(json => json.id);
                  }
                  this.repatrol.contents.push(obj);
                })
              })
              this.repatrol.sign = this.signId
              api.AddInspectRecord(this.repatrol).then(result => {
                if (result && result.status) {
                  this.$message({
                    message: '添加成功,正在返回列表页！',
                    type: 'success'
                  })
                  setTimeout(() => {
                    this.$router.go(-1)
                  }, 2000)
                } else {
                  this.$message({
                    message: result.message,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
      },
      change() {
        this.$forceUpdate()
      },
      rulesChange(type) {
        if (type == 'treat') {
          this.rules.rectifyTime = ''
          if (this.repatrol.treat == 'RECTIFY') {
            this.rules.rectifyTime = {
              required: true,
              message: '请选择整改期限日期',
              trigger: 'change'
            }
          } else {
            if (this.rules.rectifyTime) {
              delete this.rules.rectifyTime
            }
          }
        } else {
          this.signId = '';
          this.signLimit = false;
          if (this.repatrol.cooperate == 'NO') {
            this.rules.noCooperateRemark = {
              required: true,
              message: '请输入拒绝签名理由',
              trigger: 'change'
            }
          } else {
            this.rules.noCooperateRemark = ''
            if (this.rules.noCooperateRemark) {
              delete this.rules.noCooperateRemark
            }
          }
        }

      },
      getNextYear(time) {
        var date = new Date(time);
        var y = date.getFullYear() + 1;
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('1' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        let next = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        return new Date(next).getTime()
      },
      getNowDay() {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let today = y + '-' + m + '-' + d + ' 00:00:00'
        this.today = today
      },
      disabledDate(time) {
        let _minTime = new Date(this.today).getTime()
        let _maxTime = this.getNextYear(this.today)
        if (_minTime && _maxTime) {
          return time.getTime() < _minTime || time.getTime() > _maxTime
        }
      },
      filter(id) {
        if (id == 'IMPORTANT') {
          return "重点项(**)"
        } else if (id == 'CRUX') {
          return "关键项(***)"
        } else {
          return "一般项(*)"
        }
      },
      inspectorUserIdMethod(query) {
        if (query !== '') {
          this.inspectorListLoading = true;
          api.inspectorList(query).then(d => {
            if (d.status && d.data) {
              this.inspectorList = d.data.list;
            }
            this.inspectorListLoading = false;
          })
        } else {
          this.inspectorList = [];
        }
      },
      inspectorUserIdChange(userId) {
        let list = this.inspectorList.map(obj => obj.inspectorUserId)
        this.repatrol.inspectorUserTel = this.inspectorList[list.indexOf(userId)].inspectedUserTel
      },
      timeChange() {
        let timeNum = Date.parse(this.repatrol.repatrolTime) + (86400 * 15 * 1000);
        let dates = new Date(timeNum);
        let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) { //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate(); //getdate()返回的是1-31，则不需要加1
        if (day <= 9) { //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        let hours = dates.getHours();
        if (hours <= 9) {
          hours = "0" + hours;
        }
        let min = dates.getMinutes();
        if (min <= 9) {
          min = "0" + min;
        }
        let Second = dates.getDate();
        if (Second <= 9) {
          Second = "0" + Second;
        }
        this.repatrol.rectifyTime = dates.getFullYear() + "-" + mon + "-" + day + " " + hours + ":" + min + ":" +
          Second;
      },

      tableOption({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        let rownum = 0;
        for (var i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].indexOf(row) >= 0) {
            rownum = this.tableList[i].length;
            break;
          }
        }
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % rownum == 0) {
            return {
              rowspan: rownum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },

      //点击电子签名预览
      signPreview(file) {
        this.PreviewFileList = []
        this.PreviewFileList[0] = file.url
        this.PreviewIndex = 0;
        this.PreviewTitle = '电子签名';
        this.PreviewShow = true;
      },
      //签名和图片公用删除图片
      signRemove(file, fileList) {
        this.$confirm('是否确认删除电子签名吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(this.signId).then(res => {
            if (!res.status) {
              this.$message.error('电子签名删除失败！');
              return
            } else {
              this.$message.success('电子签名删除成功！');
              this.signId = '';
              this.signLimit = false;
            }

          })
        })
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      //签名成功提示
      signSuccess(res, file) {
        if (res.data.colu === "SIGN") {
          this.signId = res.data.id;
          this.signLimit = true;
        }
      },
      //签名
      beforeSignUpload(file) {
        this.updateSuccess = true
        return new Promise(async (resolve, reject) => {
          //类型和大小限制
          var picType = ["gif", "jpg", "png", "jpeg"];
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
          if (!this.IsInArray(picType, testmsg)) {
            this.$message.warning(`仅可上传gif,jpg,png格式的图片`);
            this.updateSuccess = false
            return reject(false);
          }
          if (file.size / 1024 / 1024 > 5) {
            this.$message.warning(`上传图片大小不能超过5M`);
            this.updateSuccess = false
            return reject(false);
          }
          this.updateSuccess = false
          return resolve(true)
        });
      },
      //表格（是否符合）触发事件
      singlecheckboxchange(args) {
        this.$set(args.row, 'result', args.result);
        this.contextStat.unImpor3Count = 0;
        this.contextStat.unImpor2Count = 0;
        this.contextStat.unImpor1Count = 0;
        this.tableList.forEach(item => {
          item.forEach(context => {
            if (context.result === 'NO') {
              if (context.important === 'CRUX') {
                this.contextStat.unImpor3Count++;
              }
              if (context.important === 'IMPORTANT') {
                this.contextStat.unImpor2Count++;
              }
              if (context.important === 'GENERAL') {
                this.contextStat.unImpor1Count++;
              }
            }
          })
        })
        let result3 = this.contextStat.unImpor3Count <= this.formInfo.cruxNum
        let result2 = this.contextStat.unImpor2Count <= this.formInfo.cruxNum
        let result1 = this.contextStat.unImpor1Count + this.contextStat.unImpor2Count <= this.formInfo
          .generalImportNum
        if (result3 && result2 && result1) {
          this.repatrol.result = 'YES'
        } else {
          this.repatrol.result = 'NO'
        }

      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      //附件上传相关 
      beforeUpPic(file) {
        this.updateSuccess = true
        return new Promise(async (resolve, reject) => {
          //类型和大小限制
          var picType = ["gif", "jpg", "png", "jpeg"];
          var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
          if (!this.IsInArray(picType, testmsg)) {
            this.$message.warning(`仅可上传gif,jpg,png格式的图片`);
            this.updateSuccess = false
            return reject(false);
          }
          if (file.size / 1024 / 1024 > 5) {
            this.$message.warning(`上传图片大小不能超过5M`);
            this.updateSuccess = false
            return reject(false);
          }
          //个数限制
          let id = this.rowId;
          let list = this.photoJson[id];
          if (this.photoJson[id]) {
            if (list.length > 3) {
              this.$message.warning(`当前限制选择 4 个文件`);
              this.updateSuccess = false
              return reject(false);
            }
          }
          this.updateSuccess = false
          return resolve(true)
        });
      },
      //附件图片上传成功
      picSuccess(file, fileList) {
        //图片地址
        let fileId = file.data.id;
        //图片名称
        let fileName = file.data.fileName;
        //图片地址
        let picSrc = file.data.fileId
        let id = this.rowId;
        let array = [];
        let json = {};
        if (!this.photoJson[id]) {
          json["id"] = fileId;
          json["fileName"] = fileName;
          json["picSrc"] = picSrc;
          json["contextId"] = id;
          array.push(json);
          this.photoJson[id] = array;
        } else {
          json["id"] = fileId;
          json["fileName"] = fileName;
          json["picSrc"] = picSrc;
          json["contextId"] = id;
          array = this.photoJson[id];
          array.push(json)
          this.photoJson[id] = array;
        }
        this.$set(this.row_, 'isShowFile', true);
        this.$message.success('图片上传成功！');
      },
      //删除图片
      deletePic(id, itemId) {
        this.$confirm('是否确认删除该图片吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(id).then(res => {
            let itemPicList = this.photoJson[itemId];
            let newItemPicList = [];
            for (let obj of itemPicList) {
              if (id != obj.id) {
                newItemPicList.push(obj);
              }
            }
            if (newItemPicList.length == 0) {
              this.$set(this.row_, 'isShowFile', false);
            }
            //更新记录列表
            this.photoJson[itemId] = newItemPicList;
            //更新显示列表
            this.itemPicList = newItemPicList;
            this.$message.success('图片删除成功！');
          })
        })
      },
      //add鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = this.photoJson[content.id];
        this.row_ = content;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
      },
      //附件上传按钮得到这一行的id
      getRow(row) {
        this.rowId = row.id;
        this.row_ = row;
      },
      //显示巡查项图片
      previewImg(imgList, index, title) {
        this.PreviewFileList = []
        imgList.map(item => {
          this.PreviewFileList.push(this.filePath + item.picSrc)
        })
        this.PreviewIndex = index;
        this.PreviewTitle = title;
        this.PreviewShow = true;
      },

    },

  }
</script>

<style lang="scss" scoped>
  .mT0 {
    margin: 0
  }

  .mT35 {
    margin-top: 35px;
  }

  .mainbody {
    margin-left: 20px;
    margin-bottom: 30px;
    background: #EFF7F9;
    border: 1px solid #C2EAF8;
    padding: 10px;
    width: 720px;
    color: #1FABDC;

    .form-item {
      margin: 10px 0;
      display: inline-block;
      width: 350px;

      .title {
        width: 100px;
        display: inline-block;
        text-align: right;
      }
    }
  }

  .result {
    margin: 20px auto;
    width: 402px;
    height: 90px;
    border: 1px solid #C2CAD2;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;

      .number {
        font-size: 26px;
        color: #3B3B3B;
      }

      .project-name {
        font-size: 14px;
        color: #A2AAB6;
      }
    }
  }

  .bz {
    line-height: 20px;
    font-size: 12px;
    color: #A2AAB6;
  }

  // 图片上传
  .upload-pic {
    border: 1px solid #cbcbcb;
    width: 130px;
    height: 130px;
    border-radius: 6px;
    margin-left: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-pic-left {
    margin-left: 0px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    background: #0DB5EF;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .container {
    position: relative;
    margin-bottom: 300px;
  }

  $c: #0db5ef;

  .right-info {
    width: 100%;
  }

  .content {
    margin: 20px auto 0px;
    width: 750px;
  }

  .table-div {
    text-align: center;

    input {
      background: #FFFFFF;
      border: 1px solid #C2CAD2;
      height: 34px;
      font-size: 12px;
      color: #A2AAB6;
      padding-left: 12px;
      box-sizing: border-box;
    }
  }

  .diva {
    background: #F6F7F8;
    border: 1px solid #C2CAD2;
    font-size: 14px;
    color: #393939;
    height: 34px;
    width: 150px;
    text-align: center;
    line-height: 34px;
    box-sizing: border-box;
  }

  .block {
    width: 252px;
    font-size: 14px;
    color: #6D7787;
    line-height: 26px;
  }

  .brN .is-leaf {
    border-right: 0;
  }

  .brN tr td {
    border-right: 0;
  }

  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }

  /*.table-div .el-table__body-wrapper{
    max-height: 350px;
  }*/
  .imgdiv {
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;

    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }

    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    z-index: 999;

    span {
      display: none !important;
    }

    img {
      transform: scale(2);
      border-radius: 0;
    }
  }

  .marNo {
    margin: 0 !important;
  }

  .accessoryList span:hover {
    border-bottom: 1px solid #ccc;
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
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

  .bottomContent {
    margin: 0 auto;
    width: 475px;
  }

  .upload-p {
    color: rgb(162, 170, 182);
    font-size: 14px;
    line-height: 20px;
    width: 148px;
    position: relative;
    left: -57px;
    top: 25px;
  }
</style>
<style lang='scss'>
  // 隐藏上传按钮
  .hide .el-upload--picture-card {
    display: none;
  }
</style>