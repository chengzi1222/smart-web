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
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">限期整改记录详情</span>
    </div>
    <div class="container">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info marNo">
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''"
              v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <!-- 右边开始 -->
      <div class="right-info">
        <div class="diva" style="cursor: pointer;" @click="goPatrolDetail">查看复查来源记录</div>
        <el-form label-width="110px"
                 class="demo-ruleForm">
          <!-- 基础信息 -->
          <toggle-form title="基础信息">
            <div class="content">
              <div class="row">
                <el-form-item label="复查时间:">
                  <span>{{baseInfo.repatrolTime? baseInfo.repatrolTime  : '暂无'}}</span>
                  <span style="font-size: 12px;color: #A2AAB6;">（复查截止日期{{baseInfo.rectifyTime? baseInfo.rectifyTime  : '暂无'}}）</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item :label="text.superior">
                  <span>{{baseInfo.supPerson ? baseInfo.supPerson  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row" v-if="areaCode.length===10||areaCode.length===14">
                <el-form-item :label="text.subordinate">
                  <span>
                    {{baseInfo.infoPerson ? baseInfo.infoPerson  : '暂无'}}
                    <!-- <span v-for="(item,index) in baseInfo.infoPerson">{{item.messengerStr}}<span v-if="index<basicInfoData.messengerList.length-1">，</span></span> -->
                  </span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="主体名:">
                  <span> {{baseInfo.entityName ? baseInfo.entityName  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="主体类型:">
                  <span> {{baseInfo.entityTypeStr ? baseInfo.entityTypeStr  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="社会信用代码:">
                  <span> {{baseInfo.creditCode ? baseInfo.creditCode  : '暂无'}}</span>
                </el-form-item>
                <el-form-item :label="categoryLabel">
                  <span>{{baseInfo.categoryStr}}</span>
                </el-form-item>
              </div>

              <div class="row ww">
                <el-form-item label="复查记录编号:">
                  <span> {{baseInfo.repatrolRecordNo ? baseInfo.repatrolRecordNo  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="巡查时间:">
                  <span> {{baseInfo.patrolTime ? baseInfo.patrolTime  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="来源类型:">
                  <span>{{baseInfo.sourceTypeStr ? baseInfo.sourceTypeStr  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="巡查结果:">
                  <span>{{baseInfo.sourceResultStr ? baseInfo.sourceResultStr  : '暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="不合格项数:">
                  <span>{{baseInfo.allContextNum ? baseInfo.allContextNum  : '暂无'}}</span>
                </el-form-item>
                <el-form-item label="重点不合格项数:">
                  <span>{{baseInfo.importContextNum ? baseInfo.importContextNum  : '暂无'}}</span>
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
            <div  style="height: 50px;line-height: 50px;padding-left: 14px;">检查要点表: <span>{{baseInfo.tableName}}</span></div>
            <div v-if="tableList">
              <el-table v-for="(item,index) in tableList" :key="index"
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
                <el-table-column show-overflow-tooltip prop="important" label="是否重点项" min-width="80">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值"
                                 min-width="60"></el-table-column>
                <el-table-column label="是否检查通过" min-width="80">
                  <template slot-scope="scope">
                    {{scope.row.suit==='YES'?'检查通过':'检查不通过'}}
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
                <el-table-column label="附件" min-width="140">
                  <template slot-scope="scope">
                    <div class="accessoryList" v-if="scope.row.itemFile.length>0">
                      <span class="movePoin" @mouseenter="accessoryDetailList($event,scope.row)"
                            @mouseleave="accessoryListElse"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="zj">
                <span>总计：</span>
                <span :key="curd">{{resultInfo.fullScore?resultInfo.fullScore:0}}分</span>
              </div>
            </div>
          </toggle-form>

          <!-- 经营信息 -->
          <toggle-form title="巡查结果">
            <div class="content">
              <div class="row ml30" style="margin-left: 40px;">
                <span style="color: #6D7787;">本次复查，共复查问题项共{{resultInfo.allNum?resultInfo.allNum:0}}项，其中包含重点项{{resultInfo.improtNum?resultInfo.improtNum:0}}项目，经复查：</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div class="number">
                    {{resultInfo.suitNum?resultInfo.suitNum:0}}
                  </div>
                  <div class="project-name">合格项</div>
                </div>
                <div class="item">
                  <div class="number">
                    {{resultInfo.notSuitNum?resultInfo.notSuitNum:0}}
                  </div>
                  <div class="project-name">不合格项</div>
                </div>
                <div class="item">
                  <div class="number">
                    {{resultInfo.importNotSuitNum?resultInfo.importNotSuitNum:0}}
                  </div>
                  <div class="project-name">重点项不合格</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0">
                <span style="font-size: 18px;color: #393939;">企业得分：</span>
                <span style="color: #0DB5EF;font-size: 18px; ">{{resultInfo.entScore?resultInfo.entScore:0}}分</span>
                <span style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{resultInfo.fullScore?resultInfo.fullScore:0}}分，此评分仅供参考）</span>
              </div>
              <div class="row mRno">
                <el-form-item label="巡查结果：" prop="resultStr">
                  <span>{{resultInfo.resultStr?resultInfo.resultStr:'暂无'}}</span>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="处理方式：" prop="treatStr">
                  <span>{{resultInfo.treatStr?resultInfo.treatStr:'暂无'}}</span>
                </el-form-item>
              </div>

              <div v-if="resultInfo.treatStr === '再次限期整改'"
                   class="row">
                <el-form-item label="整改期限：" prop="">
                  <span>{{resultInfo.rectifyTime?resultInfo.rectifyTime:'暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="备注：">
                  <span class="over-y">{{resultInfo.remark?resultInfo.remark:'暂无'}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="上传图片：" prop="">
                  <div class="imgbox">
                    <div>
                      <img class="imgdiv" v-for="(item,index) in resultInfo.imgItem" @click.stop="ifbig(item)" :src="filePath + item.fileId" alt="">
                      <span>预览</span>
                    </div>
                  </div>
                  <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                    <img :src="bigImgSrc">
                  </div>
                  <div v-if="resultInfo.imgItem.length == 0">
                    <span>无</span>
                  </div>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="企业电子签名：" prop="">
                  <span v-if="resultInfo.signItem.length === 0">企业拒绝配合</span>
                  <span v-if="resultInfo.signItem.length !== 0">企业配合</span>
                  <div v-for="(item,index) in resultInfo.signItem" @click.stop="ifbigq()" class="imgdiv"
                       :class="ifbigqy?'imgbig':''">
                    <img :src="filePath + item.fileId" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>

            </div>
          </toggle-form>
        </el-form>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button @click="back()"
                   style="width:120px;">返回
        </el-button>
        <el-button @click="printRecord(repatrolRecordId, true);"
                   style="width:120px;">打印预览
        </el-button>
        <el-button @click="printRecord(repatrolRecordId, false);"
                   style="width:120px;">打印
        </el-button>

      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf"
         @mouseenter="accessoryListIf = true" @mouseleave="accessoryListIf = false">
      <div>
        <p v-for="item in itemPicList" @click="showPic(item.fileId)"
           style="color: #1787AD;text-decoration: underline;" class="movePoin">
          {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
        </p>
      </div>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="filePath+this.picSrc" style="max-height: 500px;"/>
    </popup-pic>

    <PrintPatrol ref="PrintPatrol"
                 :basicInfoData="basicInfoDataPrint"
                 :messengers="messengersPrint"
                 :patrolData="patrolDataPrint"
                 :patrolContent="patrolContentPrint"
                 :resultData="resultDataPrint"
                 :patrolType="'整改复查'"
                 :qrcodeId="qrcodeId"
    ></PrintPatrol>
  </div>
</template>

<script type="module">
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import {listFile} from "api/common";
  import popupPic from 'components/popup/PopupPic';

  import {doPrintRecord} from 'utils/print/doPrint.js';
  import PrintPatrol from './PrintPatrol.vue';
  import * as api from "api/medicalDevices/repatrol.js";

  export default {
    components: {
      ToggleForm,
      popupPic,
      PrintPatrol
    },

    async mounted() {
      scroll.call(this, 'slideIndex');

      this.filePath = this.$store.getters.filePath;
      this.messType = this.$route.query.messType;
      this.repatrolRecordId = this.$route.query.repatrolRecordId;

      this.isAwait = false;
      //基础信息请求参数
      let objInfo
      objInfo = {
        'id': this.repatrolRecordId,
        'queryType': 'DETAIL',
        'state':this.messType
      }
      await api.getBascInfo(objInfo).then(d => {
        if (d.status && d.data) {
          this.baseInfo = d.data;
          this.areaCode = d.data.patrolDept;
          if (this.areaCode.length === 10 || this.areaCode.length === 14) {
            this.text.superior = '监管人员';
            this.text.subordinate = '信息员';
            this.progress[0].totalNum = 3
          }
          this.isAwait = true;
        }
      })


      //巡查内容和巡查结果的请求参数集合
      let obj
      obj = {
        'id': this.repatrolRecordId,
        'queryType': 'DETAIL',
        'state':this.messType
      }
      await api.listRepatrolRecordContext(obj).then(result => {
        if (result && result.status) {
          if (!result.data) {
            this.$message.error('未配置巡查项！');
            return false;
          }
          for (let i = 0; i < result.data.length; i++) {
            let list = [];
            for (let j = 0; j < result.data[i].context.length; j++) {
              let obj = result.data[i].context[j];
              obj.projectNo = result.data[i].projectNo;
              obj.projectName = result.data[i].projectName;
              obj.projectId = result.data[i].projectId;
              obj.contextNo = result.data[i].projectNo + '.' + result.data[i].context[j].contextNo;
              list.push(obj);
            }
            this.tableList.push(list);
          }
        }
      })


      let objResult
      objResult = {
        'id': this.repatrolRecordId,
        'state':this.messType
      }
      await api.getResultInfo(objResult).then(d => {
        if (d.status && d.data) {
          this.resultInfo = d.data;
        }
      })
    },
    methods: {
      back() {
        if (this.$route.query.isList == 'YES') {
          this.$router.push({name: 'medicalDevices.RepatrolRecordList', query: {'type': this.messType}});
        } else {
          this.$router.go(-1)
        }
      },
      async cz(id) {
        this.isAwait = false;
        //基础信息请求参数
        this.baseInfo = [];
        this.tableList = [];
        this.resultInfo = [];
        await api.getBascInfo({'id': id,'queryType':"DETAIL",'state':'END'}).then(d => {
          if (d.status && d.data) {
            this.baseInfo = d.data;
            this.isAwait = true;
            this.areaCode = d.data.patrolDept;
            if (this.areaCode.length === 10 || this.areaCode.length === 14) {
              this.text.superior = '监管人员';
              this.text.subordinate = '信息员';
              this.progress[0].totalNum = 3
            } else {
              this.text.superior = '检查人员';
              this.text.subordinate = '陪同人员';
              this.progress[0].totalNum = 2
            }
            ;
          }
          ;
        });
        //巡查内容和巡查结果的请求参数集合
        let obj = {
          'id': id,
          'queryType': 'DETAIL',
          'state':'END'
        }


        await api.listRepatrolRecordContext(obj).then(result => {
          if (result && result.status) {
            let d = result.data;
            if (!d) {
              this.$message.error('未配置巡查项！');
              return false;
            }

            for (let i = 0; i < d.length; i++) {
              let list = [];
              for (let j = 0; j < d[i].context.length; j++) {
                let obj = d[i].context[j];
                obj.projectNo = d[i].projectNo;
                obj.projectName = d[i].projectName;
                obj.projectId = d[i].projectId;
                obj.contextNo = d[i].projectNo + '.' + d[i].context[j].contextNo;
                list.push(obj);
              }
              this.tableList.push(list);
            }
          }
        })
        await api.getResultInfo({'id': id,'state':'END'}).then(d => {
          if (d.status && d.data) {
            this.resultInfo = d.data;
          }
        })
      },
      ifbig(item) {
        let i = this.filePath + item.fileId
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (item == -1) {
          this.showBigPic = false;
        }
      },
      ifbigq() {
        this.ifbigqy = !this.ifbigqy;
      },

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
      goPatrolDetail() {
        if (this.isAwait == false) {
          return
        }
        if (this.baseInfo.sourceTypeStr === '日常巡查') {
          this.$router.push(
            {
              name: "maai.dailyRecord.info",
              query: {
                recordId: this.baseInfo.sourceId,
                patrolType: "DAILY",
                patrolAreaCode: this.baseInfo.sourcePatrolDept
              }
            })
        } else if (this.baseInfo.sourceTypeStr === "整改复查") {
          this.cz(this.baseInfo.sourceId);
        } else {
          this.$router.push(
            {
              name: 'maai.specialRecord.info',
              query: {
                recordId: this.baseInfo.sourceId,
                patrolType: "SPECIAL",
                patrolAreaCode: this.baseInfo.sourcePatrolDept
              }
            })
        }
      },
      //detail鼠标移入显示附件列表
      accessoryDetailList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = content.itemFile;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
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

      /* 打印 */
      async printInitData(id, type) {
        this.qrcodeId = id;

        //基础信息请求参数
        await api.getBascInfo({'id': id,state: this.messType,'queryType': 'DETAIL',}).then(d => {
          if (d.status && d.data) {
            let baseInfo;
            baseInfo = d.data;
            this.basicInfoDataPrint.entityName = baseInfo.entityName;
            this.basicInfoDataPrint.creditCode = baseInfo.creditCode;
            this.basicInfoDataPrint.spaceAddr = baseInfo.spaceAddr;
            this.basicInfoDataPrint.corpName = baseInfo.legalPerson;
            this.basicInfoDataPrint.mobile = baseInfo.contactMobile;
            this.basicInfoDataPrint.patrolTime = baseInfo.repatrolTime;
            this.basicInfoDataPrint.patrolSoIdStr = baseInfo.supPerson;
            this.basicInfoDataPrint.areaCode = baseInfo.patrolDept;
            this.basicInfoDataPrint.deptName = baseInfo.deptName;
            this.resultDataPrint.recordNo = baseInfo.repatrolRecordNo
            // this.messengersPrint = baseInfo.infoPerson;
            this.messengersPrint = baseInfo.infoPerson.replace(/\s/g,"");
          }
        })
        let objResult

        objResult = {
          'id': this.repatrolRecordId,
          'state': this.messType,
          'queryType': 'DETAIL'
        }
        //巡查结果

        await api.getResultInfo(objResult).then(d => {
          if (d.status && d.data) {
            let resultInfo;
            resultInfo = d.data;
            this.resultDataPrint.planName = "复查整改";
            this.resultDataPrint.treat = resultInfo.treat;
            this.resultDataPrint.sign = resultInfo.signItem.length === 0 ? '' : resultInfo.signItem[0].fileId;
            if (resultInfo.rectifyTime) {
              // if (resultInfo.rectifyTime.indexOf(" ") > 0) {
              let rectifyTimeStr = resultInfo.rectifyTime
              // .split(' ')[0];
              let rectifyTimeArr = [];
              if (rectifyTimeStr.indexOf("-") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('-');
              } else if (rectifyTimeStr.indexOf("/") > 0) {
                rectifyTimeArr = rectifyTimeStr.split('/');
              }
              if (rectifyTimeArr != []) {
                this.resultDataPrint.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1]
                  + "月" + rectifyTimeArr[2] + "日";
              }
              // }
            }
          }
        })

        //巡查项
        let obj
        obj = {
          'id': this.repatrolRecordId,
          'queryType': 'DETAIL',
          'state': this.messType
        }

        await api.listRepatrolRecordContext(obj).then(result => {
          if (result && result.status) {
            let d = result.data;
            let contentList = [];
            for (let i = 0; i < d.length; i++) {
              for (let j = 0; j < d[i].context.length; j++) {
                let obj = d[i].context[j];
                obj.projectNo = d[i].projectNo;
                obj.projectName = d[i].projectName;
                obj.projectId = d[i].projectId;
                obj.contextNo = d[i].projectNo + '.' + d[i].context[j].contextNo;
                contentList.push(obj);
              }
            }
            this.patrolDataPrint = JSON.parse(JSON.stringify(this.patrolDataInitPrint));
            this.patrolContentPrint = JSON.parse(JSON.stringify(this.patrolContentInitPrint));
            contentList.forEach(content => {
              if (content.importantStr === '是') {
                this.patrolDataPrint.important++;
                if (content.suit === 'YES') {
                  this.patrolDataPrint.importantQual++;
                  this.patrolDataPrint.importantQualStr += content.contextNo + ", ";
                } else {
                  this.patrolDataPrint.importantNoQual++;
                  let contentItem = {};
                  contentItem.no = content.contextNo;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '') ? "无"
                    : content.remark;
                  this.patrolContentPrint.important.push(contentItem);
                }
              } else {
                this.patrolDataPrint.normal++;
                if (content.suit === 'YES') {
                  this.patrolDataPrint.normalQual++;
                  this.patrolDataPrint.normalQualStr += content.contextNo + ", ";

                } else {
                  this.patrolDataPrint.normalNoQual++;
                  let contentItem = {};
                  contentItem.no = content.contextNo;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '') ? "无"
                    : content.remark;
                  this.patrolContentPrint.normal.push(contentItem);
                }
              }
            })
            if (this.patrolDataPrint.importantQualStr) {
              this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr.substr(
                0, this.patrolDataPrint.importantQualStr.length - 2);
            }
            this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr != ''
              ? this.patrolDataPrint.importantQualStr : "无";

            if (this.patrolDataPrint.normalQualStr) {
              this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr.substr(
                0, this.patrolDataPrint.normalQualStr.length - 2);
            }
            this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr != ''
              ? this.patrolDataPrint.normalQualStr : "无";
          }
        })
      },

      async printRecord(id, isPreview) {
        this.loading = true;
        await this.printInitData(id, "");
        this.$refs.PrintPatrol.printStyle();
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      },

    },
    computed: {
      categoryLabel: function () {
        if(JSON.stringify(this.baseInfo) == '{}'){
          return ''
        }
        return this.baseInfo.entityTypeStr.slice(0, 2) + "类别:";
      }
    },
    data() {
      return {
        isAwait: false,//加载成功才能允许点击（防止快速点击得不到sourceId）
        areaCode: '',
        text: {
          superior: '检查人员:',
          subordinate: '陪同人员:'
        },
        messType: '',//列表传过来->判断是已复查还是待复查
        repatrolRecordId: "",//列表传过来的id
        sourceId: '',//来源id
        slideIndex: -1,
        yes: true,
        patrolType: "REPATROL",
        basicInfoData: {},
        filePath: "",
        curd: "detail",
        //init 数据
        baseInfo: {},
        resultInfo: {
          imgItem: [],
          signItem: []
        },
        initRepatrol: {},
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
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },


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

        resultData: {
          photo: [],
          sign: [],
        },
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        ifbigqy: false,

        sign: [],  //电子签名
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,

        //打印start
        printShow: false,
        qrcodeId: "",
        type: "",
        deptName: "",
        basicInfoDataPrint: {
          areaCode: ''
        },
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
        //打印end
        loading: false,
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
    left: 0 !important;
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
