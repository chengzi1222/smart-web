<style lang="sass">
  .brN .is-leaf {
    border-right: 0;
  }
  .brN tr td {
    border-right: 0;
  }
  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }
  .brN .el-table__header-wrapper {
    display: none;
  }
  .firsTeit .el-table__header-wrapper {
    display: block;
  }
  .mT35 .el-table {
    border-top: none !important;
  }
  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }
  .upload-hide .el-upload{
    display: none;
  }
</style>
<template>
  <div>
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="$route.query.type == 'daily'">添加日常巡查记录</span>
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;" v-if="$route.query.type == 'special'">添加专项巡查记录</span>
    </div>
    <div class="container">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info">
        <div class="head-block" style="background:#fff;height:0px;padding: 0;"></div>
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
            <!-- <p class="floatR right">
              <span>{{item.successNum}}</span>/<span>{{item.totalNum}}</span>
            </p> -->
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <div class="right-info">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <!-- 基础信息 -->
          <toggle-form title="基础信息">
            <div class="content">
              <div class="row"  v-if="$route.query.type == 'special'">
                <el-form-item label="巡查计划:" prop="" style="margin-bottom:0px;">
                  <select-plan @slplan="slplan" :currentIndex='currentIndex2' enumClass="com.ybveg.govx.enums.cosmetic.CosmeticEntityTypeEnum" :apiFn='selectPlanApiFn'></select-plan>
                </el-form-item>
              </div>
              <div style="margin-left:20px;margin-bottom:20px;">
                <el-tag v-if="ruleForm.planName" closable :disable-transitions="false" @close="closePlan">{{ruleForm.planName}}</el-tag>
              </div>
              <div class="row" v-if="ruleForm.planName || $route.query.type == 'daily'">
                <el-form-item label="主体信息:" prop="">
                  <select-mainbody @slmainbody="slmainbody" :currentIndex='currentIndex' :apiFn='selectMainbodyApiFn' :entryType='$route.query.type'
                    :enumClass='"com.ybveg.govx.enums.cosmetic.CosmeticEntityTypeEnum"' :taskGroupId="ruleForm.patrolPlanId" :key="ruleForm.patrolPlanId"></select-mainbody>
                </el-form-item>
              </div>
              <!-- 选择的主体 -->
              <div class="mainbody" v-if='~currentIndex'>
                <div class="row">
                  <div class="form-item">
                    <div class="title">主体名：</div>
                    <span>{{ruleForm.entityName}}</span>
                  </div>
                  <div class="form-item">
                    <div class="title">主体类型：</div>
                    <span>{{ruleForm.entityTypeStr}}</span>
                  </div>
                </div>
                <div class="row">
                  <div class="form-item">
                    <div class="title">许可备案号：</div>
                    <span>{{ruleForm.backupNo?ruleForm.backupNo:'无'}}</span>
                  </div>
                </div>
                <div class="row" v-if="isNull(this.ruleForm.spaceAddr)">
                  <div class="form-item" style="display: flex;white-space: nowrap;">
                    <div class="title">实际经营地址：</div>
                    <span>{{ruleForm.spaceAddr}}</span>
                  </div>
                </div>
                <i class="el-icon-close close" @click="deleteSL"></i>
              </div>

              <div class="row">
                <el-form-item label="巡查时间:" prop="patrolTime">
                  <div class="block">
                    <el-date-picker @change="timeChange" class="w200" v-model="ruleForm.patrolTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" :picker-options="pickerOptions0">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item :label="$store.getters.user.areaCode.length > 6?'监管人员':'检查人员'" prop="patrolSoId">
                  <el-select @change="blurCount" class="w200" v-model="ruleForm.patrolSoId" multiple collapse-tags :placeholder="$store.getters.user.areaCode.length > 6?'请选择监管人员':'请选择检查人员'" :multiple-limit='5'>
                    <el-option v-for="item in ruleForm.soList" :key="item.userId" :label="item.realName" :value="item.userId" v-auth="'cosmetic.patrol.record|func.add'"></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div class="row" v-if="$store.getters.user.areaCode.length > 6">
                <el-form-item :label="infoTitle" prop="">
                  <el-select @change="blurCount" class="w200" v-model="ruleForm.infoList" multiple collapse-tags :placeholder="infoPlaceholder" :multiple-limit='5'>
                    <el-option v-for="item in ruleForm.info" :key="item.userId" :label="item.realName" :value="item.userId" v-auth="'cosmetic.patrol.record|func.add'"></el-option>
                  </el-select>
                </el-form-item>
              </div>

            </div>
          </toggle-form>

          <!-- 经营者信息 -->
          <!-- 巡查项 -->
          <toggle-form title="巡查项">
            <div v-if="patrolData.length>0" style="margin-top:35px;">
              <el-table :key="index" v-for="(item,index) in patrolData" :class="index==0?'firsTeit':''" :data="item.conList" :span-method="objectSpanMethod"
                border class="table-div brN">
                <el-table-column show-overflow-tooltip label="检查项编号" width="100">
                  <template slot-scope="scope">
                    <span>{{patrolData[index].pno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="item" label="巡查项目" width="120">
                  <template slot-scope="scope">
                    {{patrolData[index].name}}
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="巡查内容编号" width="120">
                  <template slot-scope="scope">
                    <span>{{patrolData[index].pno}}.{{patrolData[index].conList[scope.$index].cno}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容" width="300"></el-table-column>
                <el-table-column show-overflow-tooltip prop="important" label="是否重点项" width="80">
                  <template slot-scope="scope">
                    <span>{{scope.row.important=='YES'?'是':'否'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值" width="50"></el-table-column>
                <el-table-column show-overflow-tooltip prop="qualStr" label="是否检查通过" width="180">
                  <template slot-scope="scope">
                    <single-checkbox :currentRowData='scope.row' @singlecheckboxchange="singlecheckboxchange"></single-checkbox>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" :disabled="!scope.row.qual" :maxlength="500" placeholder="备注前先选择是否检查通过"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                  <template slot-scope="scope">
                    <el-upload action="/api/upload" :before-upload="beforeUpPic" :on-success="picSuccess" :data="{type:'COSMETICS_PATROL',field:'PHOTO'}"
                      :show-file-list="false">
                      <el-button type="default"style="background:#F6F7F8;margin-right:20px;" @click="getRow(scope.row)">上传
                      </el-button>
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="附件" width="160">
                  <template slot-scope="scope" v-if="scope.row.isShowFile">
                    <div class="accessoryList">
                      <span class="movePoin" @mouseenter="accessoryList($event,scope.row)" @mouseleave="accessoryListElse"><i
                          class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="zj" v-if="patrolData.length>0">
                <span>总计：</span>
                <span>{{ruleForm.total}}分</span>
              </div>
            </div>
          </toggle-form>


          <!-- 经营信息 -->
          <toggle-form title="巡查结果">
            <div class="content">
              <div class="row ml30" style="margin-left: 40px;">
                <span style="color: #6D7787;">本次巡查重点项{{ruleForm.important}}项，一般项{{ruleForm.normal}}项，共{{ruleForm.important+ruleForm.normal}}项</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div class="number">{{ruleForm.importantNo}}</div>
                  <div class="project-name">重点项不合格</div>
                </div>
                <div class="item">
                  <div class="number">{{ruleForm.normalNo}}</div>
                  <div class="project-name">一般项不合格</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0">
                <span style="font-size: 18px;color: #393939;">企业得分：</span><span style="color: #0DB5EF;font-size: 18px; ">{{ruleForm.score}}分</span>
                <span style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{ruleForm.total}}分，此评分仅供参考）</span>
              </div>
              <div class="row mRno">
                <el-form-item label="巡查结果：" prop="radioResult">
                  <el-radio-group v-model="ruleForm.radioResult" size="medium" @change="radioResultChange">
                    <el-radio-button label="符合"></el-radio-button>
                    <el-radio-button label="基本符合"></el-radio-button>
                    <el-radio-button label="不符合"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="处理方式：" prop="radioTreat">
                  <el-radio-group v-model="ruleForm.radioTreat" size="medium" @change="radioTreatChange">
                    <el-radio-button label="正常"></el-radio-button>
                    <el-radio-button label="现场整改" v-if="$store.state.common.user.areaCode != '220581'"></el-radio-button>
                    <el-radio-button label="限期整改"></el-radio-button>
                    <el-radio-button label="调查处理" v-if="$store.state.common.user.areaCode != '220581'"></el-radio-button>
                    <el-radio-button label="责令停业"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>

              <div class="row" v-if="ruleForm.treat == 'TIME_LIMIT_RECTIFICATION'">
                <el-form-item label="整改期限：" prop="rectifyTime">
                  <el-date-picker class="w200" v-model="ruleForm.rectifyTime" type="datetime" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择整改期限">
                  </el-date-picker>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="备注：" prop="">
                  <el-input @blur="blurCount" class="w250" type="textarea" placeholder="如有需要请输入备注" :maxlength="500" :rows="4" v-model="ruleForm.treatRemark">

                  </el-input>
                  <span style="font-size: 12px;color: #A2AAB6;">(选填)</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="上传图片：" prop="">
                  <el-upload :file-list="photo" :class="picList.length <=9 ? '':'upload-hide'" action="/api/upload" list-type="picture-card" :on-success="uploadSuccess" :on-error="uploadError"
                    :data="{type:'COSMETICS_PATROL',field:'PHOTO'}" :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview"
                    :on-remove="removePic">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                    <img :src="imageUrl" alt="">
                  </div>
                  <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，jpeg</p>
                  <p class="bz">图片大小：每张图片小于10M</p>
                  <p class="bz">此项为选填项</p>
                </el-form-item>
              </div>


              <div class="row">
                <el-form-item label="量化等级：" prop="">
                  <dict-select @change="blurCount" v-model="ruleForm.quanLevel" dict="MEDI_QUANTIFY" placeholder="选择量化等级"></dict-select>
                  <span style="font-size: 12px;color: #A2AAB6;">(选填)</span>
                </el-form-item>
              </div>

              <div class="row mRno">
                <el-form-item label="企业电子签名：" prop="radioCooperate">
                  <el-radio-group v-model="ruleForm.radioCooperate" size="medium" @change="radioCooperateChange">
                    <el-radio-button label="企业拒绝配合" value="NO"></el-radio-button>
                    <el-radio-button label="企业配合上传" value="YES"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-upload :file-list="sign" :class="picListT.length==0 ? '':'upload-hide'" v-if="ruleForm.isCooperate == 'YES'" action="/api/upload" list-type="picture-card" :on-success="uploadSuccessT"
                  :on-error="uploadError" :data="{type:'COSMETICS_PATROL',field:'SIGN'}" :before-upload="beforeAvatarUpload"
                  :on-preview="handlePictureCardPreview" :on-remove="removePicT" :limit="1">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div v-if="dialogVisible" class="modal" @click.stop="dialogVisible = false;">
                  <img :src="imageUrl" alt="">
                </div>
              </div>
            </div>
          </toggle-form>

        </el-form>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button style="width:120px;" @click="goBack">取消</el-button>
        <el-button type="primary" @click="submit">确认并提交</el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true" @mouseleave="accessoryListIf = false">
      <div>
        <p v-for="item in itemPicList">
          <span @click="showPic(item.picSrc)">
            <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
              {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
            </a>
          </span>
          <span @click="deletePic(item.id,item.contextId)" style="color: #1787AD;cursor:pointer;"> 删除</span>
        </p>
      </div>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="pathFile+this.picSrc" style="max-height: 500px;" />
    </popup-pic>
    <yb-popup @close="close" :isShow="isShow" title="操作提示" width="350">
      <div slot="body" style="height:100px;line-height:100px;padding:0 20px;font-size:16px;">
        操作成功！
      </div>
      <div slot="foot" style="line-heihgt:50px;height:50px;">
        <el-button type="defalut" @click="goBack">返回
        </el-button>
        <el-button type="primary" @click="lookInfo">查看详情</el-button>
        <el-button type="primary" @click="continueAdd">继续添加</el-button>
      </div>
    </yb-popup>


  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import BtnSelect from "components/BtnSelect.vue";
  import scroll from "utils/scroll";
  import SelectMainbody from "./SelectMainbody.vue";
  import SingleCheckbox from "components/SingleCheckbox.vue"
  import DictSelect from 'components/common/DictSelect.vue'
  import YbPopup from 'components/ybpopup/YbPopup.vue'
  import popupPic from 'components/popup/PopupPic';
  import { removeFile } from 'api/cfda/add'
  import SelectPlan from 'components/SelectPlan.vue'

  import * as planApi from "api/cosmetics/dailyRecord";

  export default {
    components: {
      ToggleForm,
      BtnSelect,
      SelectMainbody,
      SingleCheckbox,
      DictSelect,
      YbPopup,
      popupPic,
      SelectPlan
    },
    mounted() {
      scroll.call(this, 'slideIndex', 100, -50);
      this.pathFile = this.$store.getters.filePath;
      if(this.$route.query.type == 'daily'){
        this.selectMainbodyApiFn = planApi.postFindEntityList
        this.ruleForm.patrolPlanType = 'DAILY'
      } else {
        this.ruleForm.patrolPlanType = 'SPECIAL'
      }
    },
    computed: {
      files() {  //文件id
        let arr = [];
        for (let i = 0; i < this.picList.length; i++) {
          arr.push(this.picList[i].fileId)
        }
        return arr;
      }
    },
    data() {
      return {
        ifContNum: [], //判断有没有选择table
        currentSlImportant: 0, //当前选中的重点项
        minImportant: 0,//巡查要点表至少多少个重点项
        //添加成功后查看详情
        patrolType: 'DAILY', //巡查类型
        recordId: "", //巡查记录id
        infoTitle: "信息员:",
        infoPlaceholder: "请选择信息员",
        //限制整改日期的选择
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        isShow: false,
        //图片上传
        imageUrl: "",
        dialogVisible: false,
        photo: [], //图片
        sign: [],  //电子签名
        selectMainbodyApiFn: null, //选择主体的api方法
        selectPlanApiFn: planApi.postFindSpecialPlanList,//选择巡查计划api方法
        currentIndex: -1, //选择主体当前选中的行
        currentIndex2: -1, //选择巡查计划当前选中的行

        slideIndex: -1,
        patrolData: [], //巡查项表格数据
        picList: [],  //存图片相关的内容
        accessoryListIf: false, //是否显示附件列表
        //巡查项图片列表
        itemPicList: [],
        //巡查项图片是否显示
        showPicIf: false,
        //巡查项图片地址
        picSrc: "",
        photoJson: {},
        rowId: '',
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        pathFile: "",
        row_: {},
        ruleForm: {
          radioCooperate: "", //企业是否合作单选按钮
          radioResult: "", //巡查结果单选按钮
          radioTreat: "", //处理方式单选按钮

          //主体信息
          patrolPlanId: '', //巡查计划id
          planName: '', //巡查计划名称
          patrolPlanType: '',//巡查计划类型
          entityId: '', //主体id
          entityName: '', //主体名称
          entityType: '', //主体类型
          type: "",
          entityTypeStr: '', //主体类型对应的中文
          licenseNumber: '', //许可备案号
          spaceAddr: '',  //经营场所
          quanLevel: '', //量化等级
          patrolTime: '', //巡查时间
          infoList: [],//信息员id
          treat: "", //处理方式
          treatRemark: "", //处理备注
          rectifyTime: "",//整改日期
          result: "", //巡查结果

          isCooperate: "", //企业是否合作
          patrolSoId: [], //监管人员
          soList: [], //监管人员列表
          info: [], //信息员列表

          important: 0, //重点项的个数
          importantNo: 0, //重点项目不合格的个数
          normal: 0, //一般项目的个数
          normalNo: 0, //一般项目不合格的个数
          score: 0, //企业得分/巡查总分
          total: 0, //满分

        },
        rules: {
          patrolTime: [
            { required: true, message: '请选择巡查时间', trigger: 'blur' },
            { validator: this.blurCount, trigger: 'blur' }
          ],
          patrolSoId: [
            { required: true, message: this.$store.getters.user.areaCode.length > 6 ? '监管人员' : '检查人员', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
          // infoList: [
          //   {required: true, message: '请选择信息人员', trigger: 'change'},
          //   {validator: this.blurCount, trigger: 'change'}
          // ],

          radioResult: [
            { required: true, message: '请选择巡查结果', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
          radioTreat: [
            { required: true, message: '请选择处理方式', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
          radioCooperate: [
            { required: true, message: '请选择是否配合上传', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
          rectifyTime: [
            { required: true, message: '请选择整改时间', trigger: 'blur' },
            { validator: this.blurCount, trigger: 'blur' }
          ],

        },
        percent: 0, //表单的完成进度
        // 左边悬浮栏的数据
        progress: [
          {
            title: '基础信息',
            successNum: 0,
            totalNum: 7
          },
          {
            title: '巡查项',
            successNum: 0,
            totalNum: 0
          },
          {
            title: '巡查结果',
            successNum: 0,
            totalNum: 5
          },
        ],
        picListT: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        patrolAreaCode: ''
      }
    },
    methods: {
      timeChange() {
        let timeNum = Date.parse(this.ruleForm.patrolTime) + (86400 * 15 * 1000);
        let dates = new Date(timeNum);
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
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
        this.ruleForm.rectifyTime = dates.getFullYear() + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + Second;
      },
      goBack() {
        history.back();
      },
      isNull(str) {
        if (str) {
          return true
        }
        return false
      },
      contexts() {   //巡查项
        this.currentSlImportant = 0;
        let data = this.patrolData;
        let arr = [];
        for (let obj=0;obj<data.length; obj++) {
          let subData = data[obj].conList;
          for (let subObj=0;subObj<subData.length; subObj++) {
            // let newobj = {};
            if (subData[subObj].tag && subData[subObj].important === 'YES') {
              this.currentSlImportant++;
            } //如果是重点项，则当前选中的重点项自增
            if (subData[subObj].qual) {
              //图片
              if (this.photoJson[data[obj].conList[subObj].patrolContextId]) {
                let jsons = this.photoJson[data[obj].conList[subObj].patrolContextId];
                let IdList = [];
                for (let json of jsons) {
                  IdList.push(json.id)
                }
                arr.push({
                  isChoose: 'YES',
                  isSuit: subData[subObj].qual,
                  patrolContextId: subData[subObj].patrolContextId,
                  remark: subData[subObj].remark,
                  itemPhotoUri: IdList
                })
              } else {
                arr.push({
                  isChoose: 'YES',
                  isSuit: subData[subObj].qual,
                  patrolContextId: subData[subObj].patrolContextId,
                  remark: subData[subObj].remark,
                  itemPhotoUri: []
                })
              }
            } else{
              arr.push({
                isChoose: 'NO',
                isSuit: '',
                patrolContextId: subData[subObj].patrolContextId,
                remark: subData[subObj].remark,
                itemPhotoUri: []
              })
            }
          }
        }
        return arr
      },
      //查看详情
      lookInfo() {
        if(this.$route.query.type == 'special'){
          this.$router.push({
            name: 'recordSpecial.info',
            query: {
              recordId: this.recordId,
              patrolType: 'SPECIAL',
              patrolAreaCode: this.patrolAreaCode
            }
          })
        } else if(this.$route.query.type == 'daily'){
          this.$router.push({
            name: 'dailyRecord.info',
            query: {
              recordId: this.recordId,
              patrolType: 'DAILY',
              patrolAreaCode: this.patrolAreaCode
            }
          })
        }
      },
      //选择专项计划
      slplan(obj) {
        this.ruleForm.patrolPlanId = obj.specialId;
        this.ruleForm.planName = obj.planName;
        this.currentIndex2 = obj.planNum;
        //如果计划id不为null开始允许查询主体
        if (obj.planNum) {
          this.selectMainbodyApiFn = planApi.postFindEntityList
        }
        if (this.currentIndex2 == -1) {
          this.selectMainbodyApiFn = null;
          this.patrolData.splice(0, this.patrolData.length);
          this.tableChange()
          this.progress[1].totalNum = 0;
        }
        //如果计划未选中，清空主体
        this.ruleForm.soList.splice(0, this.ruleForm.soList.length);
        this.ruleForm.info.splice(0, this.ruleForm.info.length);
        this.ruleForm.patrolSoId = "";
        this.ruleForm.infoList.splice(0, this.ruleForm.infoList.length);
        this.currentIndex = -1;
        this.patrolData.splice(0, this.patrolData.length);
        this.tableChange()
        // this.$refs.ruleForm.resetFields();
        this.blurCount();
      },
      //删除当前选择的计划
      closePlan() {
        this.ruleForm.planName = "";
        this.ruleForm.patrolPlanId = "";
        this.currentIndex2 = -1;
        if (this.currentIndex2 == -1) {
          this.selectMainbodyApiFn = null;
          this.patrolData.splice(0, this.patrolData.length);
          this.tableChange()
          this.progress[1].totalNum = 0;
          this.blurCount();
        }
        this.ruleForm.entityName = "";
        this.ruleForm.type = "";
        this.ruleForm.entityTypeStr = "";
        this.ruleForm.licenseNumber = "";
        this.ruleForm.spaceAddr = "";
        this.currentIndex = -1;
        //如果主体未选择清空相关表单
        if (this.currentIndex == -1) {
          this.ruleForm.soList.splice(0, this.ruleForm.soList.length);
          this.ruleForm.info.splice(0, this.ruleForm.info.length);
          this.ruleForm.patrolSoId = "";
          this.ruleForm.infoList.splice(0, this.ruleForm.infoList.length);
          this.patrolData.splice(0, this.patrolData.length);
          this.tableChange()
          this.blurCount();
          return
        }
      },
      //更新巡查项表格
      tableChange() {
        this.ruleForm.important = 0;
        this.ruleForm.importantNo = 0;
        this.ruleForm.normal = 0;
        this.ruleForm.normalNo = 0;
        this.ruleForm.score = 0;
        this.ruleForm.total = 0;

        let deduct = 0; //需要扣的分

        let data = this.patrolData;
        for (let obj of data) {
          let subData = obj.conList;
          for (let subObj of subData) {
            this.ruleForm.total += subObj.score * 1;

            if (subObj.important == 'YES') {
              this.ruleForm.important++;
              if (subObj.qual === 'NO') {
                this.ruleForm.importantNo++;
                deduct += subObj.score * 1
              }
            } else if (subObj.important == 'NO') {
              this.ruleForm.normal++;
              if (subObj.qual === 'NO') {
                this.ruleForm.normalNo++;
                deduct += subObj.score * 1
              }
            }
          }
        }

        this.ruleForm.score = this.ruleForm.total - deduct;
      },
      //表格选择是否符合
      singlecheckboxchange(obj) {
        let { row, result } = obj;
        this.$set(row, 'qual', result);
        //如果未选择是否符合，则清空评论
        if (!result) {
          row.remark = "";
          row.tag = false;
          this.ifContNum.splice(this.ifContNum.indexOf(row.patrolContextId),1)
        }
        //选择了是否符合，标记该行有效,否则无效
        if (result) {
          row.tag = true;
          this.ifContNum.push(row.patrolContextId)
        }
        //如果评论不存在，为该行评论添加观察者
        if (!row.remark) {
          this.$set(row, 'remark', '');
        }

        this.tableChange();

        this.blurCount()

      },
      //提交
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$confirm('是否要提交巡查记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.ifContNum.length == 0) {
                this.$message.error(`请选择至少一项巡查内容`);
                return false;
              }
              let obj = {};
              let { type, spaceAddr, quanLevel } = this.ruleForm;
              // obj.updateEntity = { type, spaceAddr, quanLevel };

              let { entityId, patrolTime, score, result, treat, treatRemark, rectifyTime, isCooperate, patrolSoId, infoList, patrolPlanType, patrolPlanId } = this.ruleForm;
              score = score + "";
              obj.cosmeticPatrolRecordPo = {
                entityId,
                patrolTime,
                score,
                result,
                treat,
                treatRemark,
                rectifyTime: treat == 'TIME_LIMIT_RECTIFICATION' ? rectifyTime : '',
                isCooperate,
                patrolPlanType,
                patrolPlanId,
                score: this.ruleForm.total,
                otherQuanrify: this.ruleForm.quanLevel
              };
              obj.cosmeticRepatrolRecordPo = {
                entityId,
                entityName: this.ruleForm.entityName,
                entityType: this.ruleForm.entityType,
                license: this.ruleForm.backupNo,
                specialName: this.ruleForm.planName,
                sourceRemark: treatRemark,
                sourceRectifyTime: treat == 'TIME_LIMIT_RECTIFICATION' ? rectifyTime : ''
              }
              obj.rcList = this.contexts();

              //处理方式为限期整改,需选择至少一条巡查不符合项.
              if (treat === 'TIME_LIMIT_RECTIFICATION') {
                let counttemp = 0;
                this.contexts().forEach(context => {
                  if (context.isSuit === 'NO') {
                    counttemp++;
                  }
                })
                if (counttemp <= 0) {
                  this.$message({
                    message: '处理方式为限期整改,需选择至少一条巡查不符合项.',
                    type: 'warning'
                  })
                  return false
                }
              }


              if (this.ruleForm.isCooperate == 'YES' && this.picListT.length < 1) {
                this.$message.error(`请添加签名文件`);
                return
              }

              let personList = [];
              for (let item of patrolSoId) {
                personList.push({
                  userId: item,
                  type: 'CHECK'
                })
              }
              for (let item of this.ruleForm.infoList) {
                personList.push({
                  userId: item,
                  type: 'ACCOMPANY'
                })
              }

              obj.fileList = this.files;
              if(this.picListT.length){
                obj.fileList.push(this.picListT[0].fileId)
              }
              // obj.fileId = this.picListT.length ? this.picListT[0].fileId:'';
              obj.personList = personList;
              planApi.postAddPatrolRecord(obj).then(res => {
                if (res.status) {
                  this.recordId = res.data.recordId;
                  this.patrolAreaCode = res.data.patrolAreaCode;
                  //添加成功后出现弹窗
                  this.isShow = true;
                }else if(res.message){
                  this.$message.error(res.message);
                } else {
                  this.$message.error('添加失败!');
                }
              })

            }).catch(_ => {
            });
          }
        });

      },
      //弹窗
      close() {
        this.isShow = false;
      },
      //巡查结果单选
      radioResultChange(val) {
        switch (val) {
          case '符合':
            this.ruleForm.result = 'QUALIFIED'
            break;
          case '基本符合':
            this.ruleForm.result = 'PASSED'
            break;
          case '不符合':
            this.ruleForm.result = 'DISQUALIFIED'
            break;
        }

        this.blurCount();
      },
      //处理方式单选
      radioTreatChange(val) {
        switch (val) {
          case '正常':
            this.ruleForm.treat = 'NORMAL'
            break;
          case '现场整改':
            this.ruleForm.treat = 'ON_THE_SPOT_SPOT_RECTIFICATION'
            break;
          case '限期整改':
            this.ruleForm.treat = 'TIME_LIMIT_RECTIFICATION'
            break;
          case '调查处理':
            this.ruleForm.treat = 'INVESTIGATION_AND_TREATMENT'
            break;
          case '责令停业':
            this.ruleForm.treat = 'OUT_OF_BUSINESS'
            break;
        }

        //如果不是限期整改，那么限期整改的时间值为空
        if (this.ruleForm.treat != 'TIME_LIMIT_RECTIFICATION') {
          this.ruleForm.rectifyTime = ""
        } else {
          // this.timeChange();
        }
        if (this.ruleForm.treat == 'TIME_LIMIT_RECTIFICATION') {
          this.progress[2].totalNum = 6
        } else {
          this.progress[2].totalNum = 5
        }

        this.blurCount();
      },
      //企业是否配合上传单选
      radioCooperateChange(val) {
        this.ruleForm.isCooperate = (val == '企业配合上传' ? 'YES' : 'NO');
        if (this.ruleForm.treat == 'TIME_LIMIT_RECTIFICATION') {
          this.progress[2].totalNum = 6
        } else {
          this.progress[2].totalNum = 5
        }
        this.blurCount();
      },
      //图片上传前
      beforeAvatarUpload(file) {
        const type = file.type;
        if (['image/png', 'image/jpg', 'image/jpeg', 'image/jpeg'].indexOf(type) == -1) {
          this.$message.error('请选择png、jpg、jpeg格式的图片！');
          return false
        }
      },
      //图片上传成功
      uploadSuccess(response, file, fileList) {
        let fileId = response.data.id;
        this.imageUrl = file.url;
        this.addPic = false;
        this.picList.push({ fileId: fileId, url: file.url });
        this.$message.success('图片上传成功！');
        this.blurCount();
      },
      //图片上传成功
      uploadSuccessT(response, file, fileList) {
        let fileId = response.data.id;
        this.imageUrl = file.url;
        this.addPic = false;
        this.picListT.push({ fileId: fileId, url: file.url });
        this.$message.success('图片上传成功！');
        this.blurCount();
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      //点击已上传的文件链接
      handlePictureCardPreview(file) {
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
      //删除图片
      removePic(file, fileList) {
        const url = file.url;
        for (let i = 0; i < this.picList.length; i++) {
          let obj = this.picList[i];
          if (obj.url == url) {
            this.picList.splice(i, 1);
            break;
          }
        }
      },
      //删除图片
      removePicT(file) {
        const url = file.url;
        this.picListT = [];
      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      beforeUpPic(file) {
        //类型和大小限制
        var picType = ["bmp", "jpg", "png", "gif", "jpeg"];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (!this.IsInArray(picType, testmsg)) {
          this.$message.warning(`仅可上传bmp,jpg,png,gif,jpeg格式的图片`);
          return false;
        }
        if (file.size / 1024 / 1024 > 10) {
          this.$message.warning(`上传图片大小不能超过10M`);
          return false;
        }
        //个数限制
        let id = this.rowId;
        let list = this.photoJson[id];
        if (this.photoJson[id]) {
          if (list.length > 3) {
            this.$message.warning(`当前限制选择 4 个文件，本次选择了 1 个文件，共选择了 ${list.length} 个文件`);
            return false;
          }
        }
      },
      //鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = this.photoJson[content.patrolContextId];
        this.row_ = content;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
      },
      //图片上传成功
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
      getRow(row) {
        this.rowId = row.patrolContextId;
        this.row_ = row;
      },
      //显示巡查项图片
      showPic(picSrc) {
        this.picSrc = picSrc;
        this.showPicIf = true;
      },
      //关闭巡查项图片
      closePopupBody() {
        this.showPicIf = false;
      },
      //删除图片
      deletePic(id, itemId, row) {
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
      //选择主体类型
      slmainbody(obj) {
        this.deleteSL()
        this.ruleForm.type = obj.type;
        this.ruleForm.entityName = obj.entityName;
        this.ruleForm.entityType = obj.entityType;
        this.ruleForm.entityTypeStr = obj.entityTypeStr;
        this.ruleForm.licenseNumber = obj.licenseNumber;
        this.ruleForm.spaceAddr = obj.realityAddr;
        this.ruleForm.entityId = obj.entityId
        this.ruleForm.backupNo = obj.backupNo
        this.currentIndex = obj.id;
        this.blurCount();
        //获取基础信息
        planApi.postSupPerson().then(res => {
          const data = res.data[0];
          this.ruleForm.soList = data.supPerson;
          this.ruleForm.info = data.infoPerson;
          this.ruleForm.infoList.length = 0;
          //如果后端返回的是区级上级督查，则选择
          if (data.patrolDept == 'county') {
            //监管员默认登录用户
            this.ruleForm.patrolSoId = this.$store.getters.user.id
            for (var i in data.infoList) {
              if (data.infoList[i].id != this.$store.getters.user.id) {
                this.ruleForm.infoList.push(data.infoList[i].id);
                break;
              }
            }
          } else {
            // this.ruleForm.patrolSoId = data.entity.so;
            // this.ruleForm.infoList.push(data.entity.infoAssi);
          }
          this.blurCount();
        })
        //获取巡查项
        let _params = new FormData();
        _params.append('type', 'SYS')
        _params.append('entityId', obj.entityId)
        if (this.$route.query.type == 'daily') {
        }else {
          _params.append('specialId', this.ruleForm.patrolPlanId)
        }
        planApi.getContext(_params).then(res => {
          const data = res.data;
          if (!data) {
            this.$message.error('未配置巡查项！');
            return false;
          }
          let { minImportant, reList } = data;
          this.patrolData = reList;
          this.minImportant = minImportant;
          this.tableChange()
          this.progress[1].totalNum = this.ruleForm.important + this.ruleForm.normal;
        })
        this.photoJson = {};
      },
      //删除当前选择的主体
      deleteSL() {
        this.ruleForm.entityName = "";
        this.ruleForm.type = "";
        this.ruleForm.entityTypeStr = "";
        this.ruleForm.licenseNumber = "";
        this.ruleForm.spaceAddr = "";
        this.currentIndex = -1;
        //如果主体未选择清空相关表单
        if (this.currentIndex == -1) {
          this.ruleForm.soList.splice(0, this.ruleForm.soList.length);
          this.ruleForm.info.splice(0, this.ruleForm.info.length);
          this.ruleForm.patrolSoId = [];
          this.ruleForm.infoList.splice(0, this.ruleForm.infoList.length);

          this.patrolData.splice(0, this.patrolData.length);
          this.tableChange()
          this.progress[1].totalNum = 0;
          this.blurCount();
          return
        }
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
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
      //继续添加
      continueAdd() {
        this.$refs.ruleForm.resetFields();

        //删除当前选择的主体
        this.ruleForm.entityName = "";
        this.ruleForm.type = "";
        this.ruleForm.entityTypeStr = "";
        this.ruleForm.licenseNumber = "";
        this.ruleForm.spaceAddr = "";

        this.currentIndex = -1;

        this.ruleForm.treatRemark = '';
        this.ruleForm.quanLevel = '';
        this.ruleForm.treat = '';
        this.ruleForm.result = '';
        this.ruleForm.isCooperate = '';

        this.photo.splice(0, this.photo.length);
        this.sign.splice(0, this.sign.length);
        this.patrolData.splice(0, this.patrolData.length);

        this.isShow = false;
        this.ifContNum = [];

        this.tableChange()
      },
      blurCount(rule, value, callback) {
        if (callback) {
          callback();
        }
        let cnt1 = 0;
        if (this.currentIndex != -1) {
          if (this.ruleForm.patrolTime != '') {
            cnt1++;
          }
          if (this.ruleForm.entityName != '') {
            cnt1++;
          }
          if (this.ruleForm.spaceAddr != '') {
            cnt1++;
          }
          if (this.ruleForm.entityTypeStr != '') {
            cnt1++;
          }
        }

        if (this.ruleForm.licenseNumber) {
          cnt1++;
        }
        if (this.ruleForm.patrolSoId.length > 0) {
          cnt1++;
        }
        if (this.ruleForm.infoList.length > 0) {
          cnt1++;
        }
        this.progress[0].successNum = cnt1;

        cnt1 = 0;
        cnt1 += this.contexts().length;
        this.progress[1].successNum = cnt1;

        cnt1 = 0;
        if (this.ruleForm.result != '') {
          cnt1++;
        }
        if (this.ruleForm.treat != '') {
          cnt1++;
        }
        if (this.ruleForm.treatRemark != '') {
          cnt1++;
        }
        if (this.ruleForm.quanLevel != '') {
          cnt1++;
        }
        if (this.ruleForm.isCooperate != '') {
          cnt1++;
        }
        if (this.ruleForm.rectifyTime != '') {
          cnt1++;
        }
        this.progress[2].successNum = cnt1;

        let total = 0;
        let success = 0;
        for (let i = 0; i < this.progress.length; i++) {
          total += this.progress[i].totalNum;
          success += this.progress[i].successNum;
        }
        this.percent = new Number(((success / total) * 100).toFixed(0)) * 1;
      },
    },

  }
</script>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    .big-img {
      min-width: 30%;
      max-width: 800px;
      max-height: 500px;
    }
  }

  .mainbody {
    margin-left: 20px;
    margin-bottom: 30px;
    background: #EFF7F9;
    border: 1px solid #C2EAF8;
    padding: 10px;
    width: 720px;
    color: #1FABDC;
    position: relative;
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
    .close {
      position: absolute;
      right: 20px;
      top: 10px;
      font-size: 16px;
      color: #1FABDC;
      cursor: pointer;
      font-weight: bolder;
    }
  }

  .result {
    margin: 20px 0;
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

  .zj {
    border: 1px solid #ebeef5;
    border-top: 0;
    height: 44px;
    line-height: 44px;

    span:first-child {
      margin-left: 36px;
    }
    span:last-child {
      width: 85%;
      display: inline-block;
      text-align: center;
    }
  }

  .container {
    position: relative;
    margin-bottom: 300px;
  }

  $c: #0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: -100px;
    z-index: 2;

    .head-block {
      background: #F2F5F8;
      height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      margin-top: 20px;
      // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      >li {
        border-right: 2px solid #EBF1F5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #F2F5F8;
        }
        .right {
          color: #A2AAB6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c
        }
      }
    }
  }

  // 左边悬浮信息栏的样式 end

  .right-info {
    width: calc(100% - 230px);
    margin-left: 230px;
  }

  .content {
    margin-top: 20px;
    padding-left: 220px;
  }

  .table-div {
    text-align: center;
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
</style>
