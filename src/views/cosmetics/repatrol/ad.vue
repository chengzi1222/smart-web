<style lang="sass">
  .mT35 .el-table__header-wrapper {
    display: none;
  }

  .mT35 .firsTeit .el-table__header-wrapper {
    display: block;
  }

  .mT35 .el-table {
    border-top: none !important;
  }

  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }

  .detail table {
    width: calc(100% - 270px) !important;
  }
</style>

<template>
  <div v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">添加整改复查记录</span>
    </div>
    <div class="container">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info">
        <div class="head-block" style="background: #fff;height: 40px;">
          <!-- <span>信息完成度:<span class="num" style="margin-left:20px;">{{percent}}%</span></span>
          <el-progress :percentage="percent" style="margin-top:5px;"></el-progress> -->
        </div>
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''"
              v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
            <!-- <p class="floatR right"><span>{{item.successNum}}</span>/<span>{{item.totalNum}}</span> -->
            </p>
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <div class="right-info">
        <div class="diva" style="cursor: pointer;" @click="goPatrolDetail">查看复查来源记录</div>
        <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="110px"
                 class="demo-ruleForm">
          <!-- 基础信息 -->
          <toggle-form title="基础信息">
            <div class="content">
              <div class="row">
                <el-form-item label="复查时间:" prop="repatrolTime">
                  <el-date-picker style="width: 210px;" @change="timeChange"
                                  v-model="repatrol.repatrolTime" type="datetime"
                                  placeholder="选择复查时间" :picker-options="pickerOptions0">
                  </el-date-picker>
                  <span style="font-size: 12px;color: #A2AAB6;">（复查截止日期{{baseInfo.rectifyTime}}）</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item :label="text.superior" prop="superson">
                  <el-select multiple :multiple-limit='5' v-model="repatrol.superson" style="width: 280px;"
                             placeholder="请选择监管人员">
                    <el-option
                      v-for="item in soList"
                      :key="item.userId"
                      :label="item.realName"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                  <div v-if="patrolSoIdRequired" style="color: #f56c6c; font-size: 12px;">请选择检查人员或者监管人员
                  </div>
                </el-form-item>
              </div>
              <div class="row" v-if="areaCode.length===10||areaCode.length===14">
                <el-form-item :label="text.subordinate" prop="infoPerson">
                  <el-select multiple :multiple-limit='5' v-model="repatrol.infoPerson" style="width: 280px;" collapse-tags
                             placeholder="请选择信息员">
                    <el-option
                      v-for="item in infoList"
                      :key="item.userId"
                      :label="item.realName"
                      :value="item.userId">
                    </el-option>
                  </el-select>
                  <!-- <div v-if="personListRequired" style="color: #f56c6c; font-size: 12px;">请选择陪同人员或者信息员
                  </div> -->
                  <span style="font-size: 12px;color: #A2AAB6;">(选填)</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="主体名:">
                  <span>{{baseInfo.entityName ? baseInfo.entityName  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="主体类型:">
                  <span> {{baseInfo.entityTypeStr ? baseInfo.entityTypeStr  : '暂无'}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item :label="patrolRecordNo_">
                  <span
                    :key="curd + '-repatrolRecordNo'">{{baseInfo.patrolRecordNo ? baseInfo.patrolRecordNo  : '暂无'}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="许可备案号:">
                  <span :key="curd + '-license'"> {{baseInfo.backupNo ? baseInfo.backupNo  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row ww">
                <el-form-item label="巡查时间:">
                  <span :key="curd + '-sourceTime'"> {{baseInfo.patrolTime ? baseInfo.patrolTime  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="来源类型:">
                  <span :key="curd + '-sourceTypeLabel'">{{baseInfo.sourceTypeStr ? baseInfo.sourceTypeStr  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="巡查结果:">
                  <span
                    :key="curd + '-sourceResultLabel'">{{baseInfo.sourceResult ? baseInfo.sourceResult  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="不合格项数:">
                  <span
                    :key="curd + '-initContext.count'">{{baseInfo.allContextNum ? baseInfo.allContextNum  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="重点不合格项数:">
                  <span
                    :key="curd + '-initContext.importantCount'">{{baseInfo.importContextNum ? baseInfo.importContextNum  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="巡查备注:">
                  <div class="block over-y" style="margin-top: 8px;">
                    {{baseInfo.sourceRemark ? baseInfo.sourceRemark : '暂无'}}
                  </div>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 巡查项 -->
          <toggle-form title="巡查项（仅显示本次检查的巡查项）">
            <div class="mT35" v-if="tableList">
              <el-table v-for="(item,index) in tableList" :key="item.id"
                        :class="index==0?'firsTeit':''" :data="item" :span-method="objectSpanMethod"
                        border class="table-div brN">
                <el-table-column show-overflow-tooltip prop="projectNo" label="检查项编号"
                                 min-width="100"></el-table-column>
                <el-table-column show-overflow-tooltip prop="projectName" label="巡查项目"
                                 min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="contextNo" label="巡查内容编号"
                                 min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容"
                                 min-width="250"></el-table-column>
                <el-table-column show-overflow-tooltip prop="important" label="是否重点项"
                                 min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值"
                                 min-width="60"></el-table-column>
                <el-table-column align="center" label="是否检查通过" min-width="185">
                  <template slot-scope="scope">
                    <single-checkbox :currentRowData="scope.row"
                                     @singlecheckboxchange="singlecheckboxchange"></single-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="备注" min-width='140'>
                  <template slot-scope="scope">
                    <input type="text" class="w140" v-model="scope.row.remark" :maxlength="30"
                           :disabled="!scope.row.isSuit" placeholder="备注前先选择是否符合">
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件" min-width='80'>
                  <template slot-scope="scope">
                    <el-upload
                      action="/api/upload"
                      :before-upload="beforeUpPic"

                      :on-success="picSuccess"
                      :data="{type:'COSMETICS_REPATROL',field:'PHOTO'}"
                      :show-file-list="false">
                      <el-button type="default" style="background:#F6F7F8;margin-right:20px;"
                                 @click="getRow(scope.row)">上传
                      </el-button>
                    </el-upload>
                  </template>
                </el-table-column>
                <el-table-column label="附件" min-width="160"> 
                  <template slot-scope="scope" v-if="scope.row.isShowFile">
                    <div class="accessoryList">
                      <span class="movePoin" @mouseenter="accessoryList($event,scope.row)"
                            @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="zj">
                <span>总计：</span>
                <span>{{contextStat.scoreTotal}}分</span>
              </div>
            </div>
            <span v-if="contextListRequired"
                  style="color: #f56c6c; font-size: 12px;">请选择至少一项巡查内容</span>
          </toggle-form>

          <!-- 经营信息 -->
          <toggle-form title="巡查结果">
            <div class="content">
              <div class="row ml30" style="margin-left: 40px;">
                <span style="color: #6D7787;">本次复查，共复查问题项共{{contextStat.contextCount}}项，其中包含重点项{{contextStat.importantCount}}项目，经复查：</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div class="number">
                    {{contextStat.qualCount}}
                  </div>
                  <div class="project-name">合格项</div>
                </div>
                <div class="item">
                  <div class="number">
                    {{contextStat.unqualCount}}
                  </div>
                  <div class="project-name">不合格项</div>
                </div>
                <div class="item">
                  <div class="number">
                    {{contextStat.unqualImportantCount}}
                  </div>
                  <div class="project-name">重点项不合格</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0">
                <span style="font-size: 18px;color: #393939;">企业得分：</span><span
                style="color: #0DB5EF;font-size: 18px; ">{{contextStat.scoredTotal}}分</span>
                <span
                  style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{contextStat.scoreTotal}}分，此评分仅供参考）</span>
              </div>
              <div class="row mRno">
                <el-form-item label="巡查结果：" prop="result">
                  <el-radio-group
                                  v-model="repatrol.result" size="medium">
                    <!-- :disabled='repatrol.treat=="TIME_LIMIT_RECTIFICATION"||repatrol.treat=="INVESTIGATION_AND_TREATMENT"' -->
                    <el-radio-button label="QUALIFIED">符合</el-radio-button>
                    <!-- :disabled='repatrol.treat=="TIME_LIMIT_RECTIFICATION"||repatrol.treat=="INVESTIGATION_AND_TREATMENT"' -->
                    <el-radio-button label="PASSED">基本符合</el-radio-button>
                    <!-- :disabled='repatrol.treat=="NORMAL"'  -->
                    <el-radio-button label="DISQUALIFIED">不符合</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="处理方式：" prop="treat">
                  <el-radio-group v-model="repatrol.treat" size="medium">
                    <el-radio-button label="NORMAL">复查通过</el-radio-button>
                    <!-- :disabled='repatrol.result=="DISQUALIFIED"'  -->
                    <el-radio-button label="TIME_LIMIT_RECTIFICATION">再次限期整改</el-radio-button>
                    <!-- :disabled='repatrol.result=="QUALIFIED"' -->
                    <el-radio-button label="INVESTIGATION_AND_TREATMENT" v-if="$store.state.common.user.areaCode != '220581'">调查处理</el-radio-button>
                    <!-- :disabled='repatrol.result=="QUALIFIED"'  -->
                  </el-radio-group>
                </el-form-item>
              </div>

              <div v-if="repatrol.treat === 'TIME_LIMIT_RECTIFICATION'"
                   class="row">
                <el-form-item label="整改期限：" prop="">
                  <el-date-picker
                    class="w200"
                    v-model="repatrol.rectifyTime"
                    type="datetime"
                    placeholder="选择整改期限" :picker-options="pickerOptions1">
                  </el-date-picker>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="备注：">
                  <el-input v-model="repatrol.remark" class="w250" :maxlength="300"
                            type="textarea" placeholder="如有需要请输入备注" :rows="4">
                  </el-input>
                  <span style="font-size: 12px;color: #A2AAB6;">(选填)</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="上传图片：" prop="">
                  <el-upload action="/api/upload" :data="{type:'COSMETICS_REPATROL', field: 'PHOTO'}"
                             list-type="picture-card"
                             :on-preview="handlePictureCardPreview"
                             :on-remove="handleRemove"
                             :on-success="handleAvatarSuccess"
                             :on-error="uploadError"
                             :on-exceed='maxLimit'
                             :limit="10"
                             :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                    <!--<p style="color: #A2AAB6;font-size:14px">点击上传</p>-->
                  </el-upload>

                  <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，jpeg</p>
                  <p class="bz">图片大小：每张图片小于10M</p>
                  <p class="bz">此项为选填项</p>
                </el-form-item>
              </div>


              <div class="row mRno">
                <el-form-item label="企业电子签名：" prop="isCooperate">
                  <el-radio-group v-model="repatrol.isCooperate" size="medium"
                  >
                    <el-radio-button label="NO">企业拒绝配合</el-radio-button>
                    <el-radio-button label="YES">企业配合上传</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <!-- <el-upload v-if="repatrol.isCooperate === 'YES'" :data="{type:'COSMETICS_REPATROL', field: 'SIGN'}"
                  class="avatar-uploader upload-pic"
                  action="/api/upload"
                  :show-file-list="false"
                  :on-success="handleSignSuccess"
                  :before-upload="beforeSignUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="avatar-uploader-icon el-icon-plus">
                    <p style="color: #A2AAB6;font-size:14px">点击上传签名</p>
                  </i>
                </el-upload> -->
                <el-upload
                  :file-list="sign"
                  v-if="repatrol.isCooperate === 'YES'"
                  action="/api/upload"
                  list-type="picture-card"
                  :on-success="handleSignSuccess"
                  :on-error="uploadError"
                  :data="{type:'COSMETICS_REPATROL', field: 'SIGN'}"
                  :before-upload="beforeSignUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-exceed='maxLimit1'
                  :limit="1">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>


            </div>
          </toggle-form>
        </el-form>
      </div>
    </div>

    <!-- 操作成功弹窗 -->
    <yb-popup @close="close" :isShow="isShow" title="操作提示" width="350">
      <div slot="body" style="height:100px;line-height:100px;padding:0 20px;font-size:16px;">
        操作成功！
      </div>
      <div slot="foot">
        <el-button type="defalut"
                   @click="$router.push({name: 'cosmetics.RepatrolRecordList',query: {'type':this.messType}})">返回
        </el-button>
        <el-button type="primary" @click="goDetail()">查看详情</el-button>
      </div>
    </yb-popup>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>

        <!-- <el-button v-if="curd === 'detail'" @click="printRecord(repatrolRecordId, true);"
                   style="width:120px;">打印预览
        </el-button>
        <el-button v-if="curd === 'detail'" @click="printRecord(repatrolRecordId, false);"
                   style="width:120px;">打印
        </el-button> -->
        <el-button @click="$router.push({name: 'cosmetics.RepatrolRecordList', query: { 'type': messType}});;"
                   style="width:120px;">取消
        </el-button>
        <el-button :disabled="updateSuccess" type="primary"
                   @click="updateRepatroRecord">确认并提交
        </el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf"
         @mouseenter="accessoryListIf = true" @mouseleave="accessoryListIf = false">
      <div>
        <p v-for="item in itemPicList">
            <span @click="showPic(item.picSrc)">
              <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
                {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
              </a>
            </span>
          <span @click="deletePic(item.id,item.contextId)" style="color: #1787AD;cursor:pointer;">   删除</span>
        </p>
      </div>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="filePath+this.picSrc" style="max-height: 500px;"/>
    </popup-pic>


  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import BtnSelect from "components/BtnSelect.vue";
  import SingleCheckbox from "components/SingleCheckbox.vue";
  import scroll from "utils/scroll";
  import YbPopup from 'components/ybpopup/YbPopup.vue'
  import popupPic from 'components/popup/PopupPic';
  import {removeFile} from 'api/cfda/add'
  import {
    getAreaCode,
  } from "api/medi/patrol/repatrol.js";
  import * as api from "api/cosmetics/patrolPlan";

  export default {
    components: {
      ToggleForm,
      BtnSelect,
      SingleCheckbox,
      YbPopup,
      popupPic,
    },
    async mounted() {
      scroll.call(this, 'slideIndex');
      this.filePath = this.$store.getters.filePath;
      this.messType = this.$route.query.messType;
      this.repatrolRecordId = this.$route.query.repatrolRecordId;

      getAreaCode().then(r => {
        this.areaCode = r.data.areaCode;
        if(this.areaCode.length === 10 || this.areaCode.length === 14) {
          this.text.superior = '监管人员';
          this.text.subordinate = '信息员';
          this.progress[0].totalNum = 3
        }
      })


      let infoObj
      //if (this.$route.query.messType == '整改复查') {
        infoObj = {'id': this.repatrolRecordId, 'queryType': 'REPATROL'}
      // } else {
      //   infoObj = {'id': this.repatrolRecordId, 'queryType': 'OTHER'}
      // }
      //添加基础信息请求参数
      await api.getBascInfo(infoObj).then(d => {
        if (d.status && d.data) {
          this.baseInfo = d.data[0];
          if (this.baseInfo.sourceTypeStr == '整改复查') {
            this.patrolRecordNo_ = '复查记录编号'
          }
        }
      })
      await api.get_soList_or_infoList().then(d => {
        if (d.status && d.data) {
          this.soList = d.data[0].supPerson;
          this.infoList = d.data[0].infoPerson;
        }
      })
      //巡查内容请求参数
      await api.listRepatrolRecordContext({
        'id': this.repatrolRecordId,
        'queryType': 'REPATROL'
      }).then(result => {
        if (result && result.status) {
          let d = result.data;
          if (!d) {
            this.$message.error('未配置巡查项！');
            return false;
          }
          for (let i = 0; i < d.length; i++) {
            let list = [];
            for (let j = 0; j < d[i].context.length; j++) {
              let obj = {}
              obj = d[i].context[j];
              obj.projectNo = d[i].projectNo;
              obj.projectName = d[i].projectName;
              obj.projectId = d[i].projectId;
              obj.contextNo = d[i].projectNo + '.' + d[i].context[j].contextNo;
              obj.remark = '';
              obj.itemFile = [];
              obj.isSuit = '';
              list.push(obj);
            }
            this.tableList.push(list);
          }
          this.initContext.contextList = result.data;
          this.initContext.contextList.forEach(item => {
            item.context.forEach(context => {
              this.contextStat.scoreTotal += context.score;//算总分
            })
          });
        }
      })
    },
    methods: {
      timeChange() {
        let timeNum = Date.parse(this.repatrol.repatrolTime) + (86400 * 15 * 1000);
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
        this.repatrol.rectifyTime = dates.getFullYear() + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + Second;
      },
      //点击已上传的文件链接预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      //表格配置
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
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
      //提交
      updateRepatroRecord() {
        this.$refs['repatrol'].validate((valid) => {
          //判断是否监管人员
          if (this.repatrol.superson.length === 0) {
            this.patrolSoIdRequired = true;
            return false;
          } else {
            this.patrolSoIdRequired = false;
          }
          // //判断是否选择下级人员
          // if(areaCode.length===10||areaCode.length===14){
          //   if (this.repatrol.infoPerson.length === 0) {
          //     this.personListRequired = true;
          //     return false;
          //   } else {
          //     this.personListRequired = false;
          //   }
          // }

          //判断至少选择一个巡查项
          let contextList = [];
          this.initContext.contextList.forEach(item => {
            item.context.forEach(context => {
              if (context.isSuit !== undefined && context.isSuit !== '') {
                contextList.push(context);
              }
            })
          })
          if (contextList.length === 0) {
            this.contextListRequired = true;
            return false;
          } else {
            this.contextListRequired = false;
          }
          //处理方式为再次限期整改,需选择至少一条巡查不符合项.
          if (this.repatrol.treat === 'TIME_LIMIT_RECTIFICATION') {
            let counttemp = 0;
            contextList.forEach(context => {
              if (context.isSuit === 'NO') {
                counttemp++;
              }
            })
            if (counttemp <= 0) {
              this.$message({
                message: '处理方式为再次限期整改,需选择至少一条巡查不符合项.',
                type: 'warning'
              })
              return false
            }
          }
          //判断选择企业签名
          if (this.repatrol.isCooperate === 'YES') {
            let hasSign = false;
            for (let i = 0; i < this.fileIdList.length; i++) {
              if (this.fileIdList[i] === this.signId) {
                hasSign = true;
                break;
              }
            }
            if (!hasSign) {
              this.$message({
                message: '请添加签名文件.',
                type: 'warning'
              })
              return false
            }
          }
          //校验完成弹出提示框
          if (valid) {
            this.$confirm('是否要提交复查记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let contextList = [];
              this.initContext.contextList.forEach(item => {
                item.context.forEach(context => {
                    let obj = {};
                    obj.patrolContextId = context.contextId;
                    obj.patrolRecordId = this.repatrolRecordId;
                    obj.isSuit = context.isSuit=='NO'? context.isSuit:'YES'
                    obj.remark = context.remark
                    //图片
                    if (this.photoJson[context.contextId]) {
                      let jsons = this.photoJson[context.contextId];
                      let IdList = [];
                      for (let json of jsons) {
                        IdList.push(json.id)
                      }
                      obj.itemPic = IdList;
                    }
                    contextList.push(obj);
                })
              })
              this.repatrol.score = this.contextStat.scoredTotal;
              this.repatrol.id = this.repatrolRecordId;
              this.repatrol.entityId = this.baseInfo.entityId;
              this.repatrol.entityName = this.baseInfo.entityName;
              this.repatrol.entityType = this.baseInfo.entityType;
              this.repatrol.sourceId = this.baseInfo.sourceId;

              //若企业拒绝签名，提交前检查并删除签名文件
              if (this.repatrol.isCooperate === "NO") {
                for (let i = 0; i < this.fileIdList.length; i++) {
                  if (this.fileIdList[i] === this.signId) {
                    this.fileIdList.splice(i, 1);
                    break;
                  }
                }
              }
              let personList_ = [];
              this.repatrol.infoPerson.forEach(item => {
                this.infoList.forEach(item2 => {
                  let obj = {};
                  if (item == item2.userId) {
                    personList_.push(item)
                  }
                })
              })
              let supersonList_ = [];
              this.repatrol.superson.forEach(item => {
                this.soList.forEach(item2 => {
                  let obj = {};
                  if (item == item2.userId) {
                    supersonList_.push(item)
                  }
                })
              })
              let updateParam = {
                repatrol: this.repatrol,
                personList: personList_,
                supersonList: supersonList_,
                contextList: contextList,
                fileIdList: this.fileIdList
              };
              api.update(updateParam).then(result => {
                if (result && result.status) {
                  this.$message({
                    message: '添加成功.',
                    type: 'success'
                  })
                  this.detailRepatrolRecordId.id = result.data.repatrolRecordId;
                  this.isShow = true;
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
      //上传图片成功提示
      handleAvatarSuccess(file) {
        if (file.status) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.fileIdList.push(file.data.id);
        }
      },
      maxLimit(files, fileList) {
        // 上传数量限制
        this.$message({
          message: '最多上传10张图片!',
          type: 'warning'
        });
      },
      maxLimit1(files, fileList) {
        // 上传数量限制
        this.$message({
          message: '最多上传1张签名!',
          type: 'warning'
        });
      },
      //上传图片
      beforeAvatarUpload(file) {

        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          this.$message({
            message: '请上传正确格式的图片(图片格式：png，jpg，jpeg)',
            type: 'error'
          })
          return false;
        }
      },
      //签名和图片公用删除图片
      handleRemove(file, fileList) {
        for (let i = 0; i < this.fileIdList.length; i++) {
          let id = this.fileIdList[i];
          if (id === file.response.data.id) {
            this.fileIdList.splice(i, 1);
            break;
          }
        }
      },

      //签名成功提示
      handleSignSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.fileIdList.push(res.data.id);

        if (res.data.colu === "SIGN") {
          this.signId = res.data.id;
        }
      },
      //签名
      beforeSignUpload(file) {
        let fileType = file.type.split("/")[1];

        const isPic = fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg';
        const isSize = file.size / 1024 / 1024 > 10;

        if (isPic) {
          this.$message.error('请上传正确格式的图片(图片格式：png，jpg，jpeg)')
        }
        if (isSize) {
          this.$message.error('上传图片大小不能超过 10MB!');
        }
        return !isPic && !isSize;
      },
      //表格（是否符合）触发事件
      singlecheckboxchange(args) {
        this.$set(args.row, 'isSuit', args.result);
        this.contextStat = {
          scoreTotal: this.contextStat.scoreTotal,
          contextCount: 0,
          importantCount: 0,
          qualCount: 0,
          unqualCount: 0,
          unqualImportantCount: 0,
          duceTotal: 0,
        },

          this.tableList.forEach(item => {
            item.forEach(context => {
              if (context.isSuit != undefined && context.isSuit != '') {
                this.contextStat.contextCount++;
                if (context.isSuit === 'YES') {
                  this.contextStat.qualCount++;
                }
                if (context.isSuit === 'NO') {
                  this.contextStat.duceTotal += context.score;
                  this.contextStat.unqualCount++;
                  if (context.important === '是') {
                    this.contextStat.unqualImportantCount++;
                  }
                }
                if (context.important === '是') {
                  this.contextStat.importantCount++;
                }

                if (this.contextList.indexOf(context) === -1) {
                  this.contextList.push(context);
                }
              } else {
                if (this.contextList.indexOf(context) != -1) {
                  var index = this.contextList.indexOf(context)
                  this.contextList.splice(index, 1);
                }

                // this.contextStat.duceTotal += context.score;
              }
            })
          })
        this.contextStat.scoredTotal = this.contextStat.scoreTotal - this.contextStat.duceTotal + 0;
      },
      //弹窗
      close() {
        this.isShow = false;
      },
      //查看来源跳转
      goPatrolDetail() {
        if (this.baseInfo.sourceTypeStr === '日常巡查') {
          this.$router.push(
            {name: "dailyRecord.info", query: {recordId: this.baseInfo.sourceId, patrolType: "DAILY",patrolAreaCode:this.baseInfo.sourcePatrolDept}})
        } else if (this.baseInfo.sourceTypeStr === '整改复查') {
          this.$router.push(
            {
              name: 'cosmetics.RepatrolRecordInfo', query: {
                'repatrolRecordId': this.baseInfo.sourceId,
                'messType': this.messType,
              }
            })
        } else {
          this.$router.push(
            {name: 'recordSpecial.info', query: {recordId: this.baseInfo.sourceId, patrolType: "SPECIAL",patrolAreaCode:this.baseInfo.sourcePatrolDept}})
        }
      },
      //跳详情
      goDetail() {
        this.isShow = false;
        this.$router.push({
          name: 'cosmetics.RepatrolRecordInfo',
          query: {
            'repatrolRecordId': this.detailRepatrolRecordId.id,
            "messType": 'END',
            "newID": 'YES',
            'treat': this.repatrol.treat
          }
        })
      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      //附件上传相关
      beforeUpPic(file) {
        //类型和大小限制
        var picType = ["bmp", "jpg", "png", "jpeg"];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (!this.IsInArray(picType, testmsg)) {
          this.$message.warning(`仅可上传bmp,jpg,png,jpeg格式的图片`);
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
      //add鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = this.photoJson[content.contextId];
        this.row_ = content;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
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
      //附件上传按钮得到这一行的id
      getRow(row) {
        this.rowId = row.contextId;
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
    },
    data() {
      return {
        patrolRecordNo_: '巡查记录编号',
        areaCode: '',
        messType: '',//列表传过来->判断是已复查还是待复查
        repatrolRecordId: "",//列表传过来的id
        sourceId: '',//来源id
        text: {
          superior: '检查人员:',
          subordinate: '陪同人员:'
        },
        //基础信息展示2
        baseInfo: {},
        //sumbit 数据集合
        repatrol: {
          superson: [],
          remark: "",
          infoPerson: [],
          rectifyTime: ""
        },
        slideIndex: -1,
        yes: true,
        patrolType: "REPATROL",
        basicInfoData: {},
        filePath: "",
        personListRequired: false,
        contextListRequired: false,
        patrolSoIdRequired: false,

        curd: "",
        detailRepatrolRecordId: {},

        //init 数据
        initContext: {},
        contextList: [],
        tableList: [],
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
        row_: {},
        contextStat: {
          scoreTotal: 0,
          contextCount: 0,
          importantCount: 0,
          qualCount: 0,
          unqualCount: 0,
          unqualImportantCount: 0,
          scoredTotal: 0,
          duceTotal: 0,
        },

        soList: [],
        infoList: [],
        infoAssiUserName: "",
        soUserName: "",

        signId: "",


        rules: {
          repatrolTime: {required: true, message: '请选择巡查时间', trigger: 'blur'},
          // patrolSoId: {required: true, message: '请选择检查人员或者监管人员', trigger: 'blur'},
          // infoPerson: {required: true, message: '请选择陪同人员或者信息员', trigger: 'blur'},
          result: {required: true, message: '请选择巡查结果', trigger: 'blur'},
          treat: {required: true, message: '请选择处理方式', trigger: 'blur'},
          isCooperate: [
            {required: true, message: '请选择是否配合上传', trigger: 'change'},
            // {validator: this.blurCount, trigger: 'change'}
          ],
        },
        percent: 0, //表单的完成进度
        // 左边悬浮栏的数据
        progress: [
          {
            title: '基础信息',
            successNum: 0,
            totalNum: 2
          },
          {
            title: '巡查项',
            successNum: 0,
            totalNum: 1
          },
          {
            title: '巡查结果',
            successNum: 0,
            totalNum: 2
          },
        ],

        dialogImageUrl: '',
        dialogVisible: false,
        fileIdList: [],
        imageUrl: '',

        resultData: {
          photo: [],
          sign: [],
        },
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        isShow: false,
        updateSuccess: false,
        sign: [],  //电子签名
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,

        //打印
        printShow: false,
        qrcodeId: "",
        type: "",
        deptName: "",
        basicInfoDataPrint: {},
        messengersPrint: "",

        patrolDataPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentPrint: {
          normal: [],
          important: []
        },
        patrolDataInitPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInitPrint: {
          normal: [],
          important: []
        },
        resultDataPrint: {},

        recordDataPrint: {
          serialNumber: 123456789,
        },

        loading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        //限制整改日期的选择
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      };
    }
  }
</script>

<style lang="scss" scoped>
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
      > li {
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
    > img {
      display: block;
      max-height: 700px;
    }
  }
</style>
