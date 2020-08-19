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
  .brN tr:hover>td {
    background-color: #fff !important;
  }

  .mT35 .el-table__header-wrapper {
    display: none;
  }

  .titShow .el-table__header-wrapper {
    display: block;
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
</style>
<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="user-box">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">风险评估检查记录详情</span>
    </div>
    <div class="container" @click="ifbig(-1)">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info">
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <div class="right-info">
        <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <!-- 基本信息 -->
          <toggle-form title="基本信息">
            <div class="content" v-if="patrolDetail">
              <div class="row">
                <el-form-item label="任务名称:" prop="">
                  <span>{{taskEntity.task_name}}</span>
                  <a href="javascript:" @click="$router.push({name: 'activity.taskInfo',query: {'id': patrolDetail.task_id,'flag':'check'}})">查看任务详情</a>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="主体名称:" prop="">
                  <span>{{taskEntity.entity_name}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="许可证备案号:" prop="">
                  <span>{{taskEntity.licence}}</span>
                </el-form-item>
                <el-form-item label="检查记录编号:" prop="">
                  <span>{{patrolDetail.patrol_no}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="量化等级:" prop="">
                  <span>{{patrolDetail.quan_level}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="实际经营地址:" prop="">
                  <span>{{taskEntity.reality_addr}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="检查地址:" prop="">
                  <span v-if="patrolRecordAddressIsShow">{{patrolAddress.address}}</span>
                  <span v-else>暂无</span>
                  <el-button v-if="patrolRecordAddressIsShow" type="text" @click="mapAddressVisible = true">查看地图坐标</el-button>
                  <el-dialog v-if="patrolRecordAddressIsShow" :visible.sync="mapAddressVisible" :modal-append-to-body="false" width="60%">
                    <slot slot="title">
                      {{patrolDetail.entity_name}} <br /> {{patrolAddress.address}}
                    </slot>
                    <div style="height: 300px;">
                      <address-map v-if="patrolRecordAddressIsShow" :lng="patrolAddress.lng" :lat="patrolAddress.lat">
                      </address-map>
                    </div>
                  </el-dialog>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="检查日期:" prop="">
                  <span>{{patrolDetail.patrol_date}}</span>
                </el-form-item>
                <el-form-item label="检查时间:" prop="">
                  <span>{{patrolDetail.patrol_time}}</span>
                </el-form-item>
                <el-form-item label="监督人员:" prop="">
                  <span>{{patrolDetail.so_users_str}}</span>
                </el-form-item>
              </div>
            </div>
          </toggle-form>

          <!-- 检查项 -->
          <toggle-form title="检查信息">
            <div class="mT35">
              <el-table :data="contextList" :span-method="objectSpanMethod2" :border="true" class="table-div titShow">
                <el-table-column show-overflow-tooltip prop="project_no" label="项目编号" min-width="40"></el-table-column>
                <el-table-column show-overflow-tooltip prop="project_name" min-width="50" label="项目名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="context_no" min-width="40" label="要点编号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="context" min-width="100" label="要点内容"></el-table-column>
                <el-table-column show-overflow-tooltip prop="important_name" min-width="40" label="是否重点项"></el-table-column>
                <el-table-column show-overflow-tooltip prop="qual_name" min-width="40" label="是否符合"></el-table-column>
                <el-table-column show-overflow-tooltip prop="remark" min-width="100" label="备注"></el-table-column>
                <el-table-column label="附件" min-width="160">
                  <template slot-scope="scope">
                    <div class="accessoryList" v-if="scope.row.attachList.length>0">
                      <span class="movePoin" @mouseover.stop="accessoryList($event,scope.row)"><i class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </toggle-form>
          <!-- 检查结果 -->
          <toggle-form title="检查结果">
            <div class="content">
              <div class="row ml30" style="margin-left: 40px;">
                <span style="color: #6D7787;">本次检查重点项<span>{{importantCnt}}</span>项，一般项<span>{{normalCnt}}</span>项，共{{total}}项</span>
              </div>

              <div class="row result ml30">
                <div class="item">
                  <div class="number">{{importantQuaNoCnt}}</div>
                  <div class="project-name">重点项不合格</div>
                </div>
                <div class="item">
                  <div class="number">{{normalQuaNoCnt}}</div>
                  <div class="project-name">一般项不合格</div>
                </div>
              </div>
              <div class="row">
                <el-form-item label="检查结果:" prop="">
                  <span>{{patrolDetail.result_name}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="处理方式:" prop="">
                  <span>{{patrolDetail.treat_name}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="检查备注:" prop="">
                  <span v-if="patrolDetail.treat_remark" class="over-y">{{patrolDetail.treat_remark}}</span>
                  <span v-if="!patrolDetail.treat_remark">无</span>
                </el-form-item>
              </div>
              <div class="row" v-if="patrolDetail.rectify_state != 'NOTHING'">
                <el-form-item label="整改情况:" prop="">
                  <span>{{patrolDetail.rectify_state_name}}</span>
                </el-form-item>
              </div>
              <div class="row" v-if="patrolDetail.rectify_state != 'NOTHING'">
                <el-form-item label="整改备注:" prop="">
                  <span v-if="patrolDetail.rectify_remark" class="over-y">{{patrolDetail.rectify_remark}}</span>
                  <span v-if="!patrolDetail.rectify_remark">无</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="拍照留证:" prop="">
                  <div class="imgbox" v-if="patrolDetail.proofs && patrolDetail.proofs.length > 0">
                    <div v-for="(item,index) in patrolDetail.proofs" @click.stop="ifbig(item)" class="imgdiv">
                      <img :src="pathFile + item" alt="">
                      <span>预览</span>
                    </div>
                  </div>
                  <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                    <img :src="bigImgSrc">
                  </div>
                  <div v-if="patrolDetail.proofs.length == 0">
                    <span>无</span>
                  </div>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="企业签名：" prop="">
                  <span v-if="patrolDetail.is_cooperate === 'NO'">企业拒绝配合</span>
                  <span v-if="patrolDetail.is_cooperate === 'YES'">企业配合</span>
                  <div v-if="patrolDetail.entity_sign && patrolDetail.is_cooperate === 'YES'" @click.stop="ifbigq('0')" class="imgdiv" :class="ifbigqy?'imgbig':''">
                    <img :src="pathFile + patrolDetail.entity_sign" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="监督人员签名：" prop="">
                  <div v-if="patrolDetail.so_sign" @click.stop="ifbigq('1')" class="imgdiv" :class="ifbigqy1?'imgbig':''">
                    <img :src="pathFile + patrolDetail.so_sign" alt="">
                    <span>预览</span>
                  </div>
                  <div v-else>
                    无
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
        <el-button style="width:100px;" @click="back">返回</el-button>
        <el-button style="width:100px;" @click="printRecord(patrolId, true)">打印预览</el-button>
        <el-button style="width:100px;" @click="printRecord(patrolId, false)">打印</el-button>
      </div>
    </div>
    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseover.stop="accessoryListIf = true" @mouseout="accessoryListIf = false">
      <p v-for="item in itemPicList" @click="showPic(item)">
        <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
          {{item.fileName}}
        </a>
      </p>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="this.picSrc" style="max-height: 500px;" />
    </popup-pic>

    <!-- 打印组件 -->
    <tablePrint ref="tablePrint" :resultData="infoData" :patrolType="'重大活动保障每日检查'"></tablePrint>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import scroll from "utils/scroll";
  import addressMap from "views/patrol/project/patrolRecordAddressMap";
  import popupPic from 'components/popup/PopupPic';
  import tablePrint from './riskTablePrint.vue'
  import { doPrintRecord } from 'utils/print/doPrint.js'
  import * as risk from 'api/activity/risk';
  import * as everyday from 'api/activity/everyday';

  export default {
    components: {
      ToggleForm,
      addressMap,
      tablePrint,
      popupPic
    },
    mounted() {
      scroll.call(this, 'slideIndex', 0, 50);
      this.patrolId = this.$route.query.id;
      this.detail();
    },
    methods: {
      ifbig(item) {
        let i = this.pathFile + item;
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
      ifbigq(f) {
        if (f == '0') {
          this.ifbigqy = !this.ifbigqy;
        } else {
          this.ifbigqy1 = !this.ifbigqy1;
        }

      },
      detail() {
        everyday.detail({ id: this.$route.query.id }).then(r => {
          // console.log("日志开始");
          // console.log(r);
          // console.log("日志结束");
          // let fdfs = "http://fs-local.ybveg.com/fdfs/";
          let fdfs = this.$store.getters.filePath
          this.taskEntity = r.data.taskEntity;
          this.taskMenuList = r.data.taskMenuList;
          this.contextList = r.data.contextList;
          this.patrolDetail = r.data.patrolDetail;
          this.patrolAddress = r.data.patrolAddress;

          if (this.patrolAddress &&
            this.patrolAddress.address &&
            this.patrolAddress.lng &&
            this.patrolAddress.lat) {
            this.patrolRecordAddressIsShow = true
          }
          // 设置企业签名图片地址
          // if (this.patrolDetail.entity_sign) {
          //   this.patrolDetail.entity_sign = fdfs + this.patrolDetail.entity_sign;
          // }
          // // 设置监督人员签名图片地址
          // if (this.patrolDetail.so_sign) {
          //   this.patrolDetail.so_sign = fdfs + this.patrolDetail.so_sign;
          // }
          // // 设置拍照取证图片地址，
          // if (this.patrolDetail.proofs && this.patrolDetail.proofs.length > 0) {
          //   for (let i = 0; i < this.patrolDetail.proofs.length; i++) {
          //     if (this.patrolDetail.proofs[i]) {
          //       this.patrolDetail.proofs[i] = fdfs + this.patrolDetail.proofs[i];
          //     }
          //   }
          // }
          // 获得重点项、一般项、总数、重点项不合格数、一般项不合格数
          if (this.contextList && this.contextList.length > 0) {
            let row = {};
            this.total = this.contextList.length;
            for (let i = 0; i < this.contextList.length; i++) {
              // this.contextList[i].attachList = [];
              row = this.contextList[i];
              if (row.important === 'YES') {
                this.importantCnt++;
                if (row.qual === 'NO') {
                  this.importantQuaNoCnt++;
                }
              } else if (row.important === 'NO') {
                this.normalCnt++;
                if (row.qual === 'NO') {
                  this.normalQuaNoCnt++;
                }
              }
            }
          }
          this.getSpanRowIndex(this.contextList);
        })
      },
      getSpanRowIndex(data) {
        if (!data || data.length == 0) return;
        let tempIds = this.projectIds;
        for (let i = 0; i < data.length; i++) {
          if (tempIds.indexOf(data[i].project_id) === -1) {
            this.projectIds.push(data[i].project_id);
            tempIds = this.projectIds;
            this.spanRowIndex.push(i);
          }
        }
      },
      objectSpanMethod2({ row, column, rowIndex, columnIndex }) {
        if (columnIndex > 1) return;
        for (let i in this.spanRowIndex) {
          if (rowIndex === this.spanRowIndex[i]) {
            return {
              rowspan: row.pro_cnt,
              colspan: 1
            };
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      },
      back() {
        this.$router.go(-1);
      },
      //鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = content.attachList;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
        //          this.itemPicList = [];
      },
      //显示巡查项图片
      showPic(item) {
        this.picSrc = this.pathFile + item.fileId;
        this.showPicIf = true;
      },
      //关闭巡查项图片
      closePopupBody() {
        this.showPicIf = false;
      },

      /* 打印 */
      async printInitData(id) {
        this.qrcodeId = id
        await risk.detail({ id: id }).then(r => {
          this.infoData = r.data
          let quanLevel = "";
          if (this.infoData.patrolDetail.quan_level) {
            quanLevel = this.infoData.patrolDetail.quan_level;
          } else {
            quanLevel = this.infoData.taskEntity.quan_level;
          }
          this.infoData.quanLevel = quanLevel;
          console.log(this.infoData)

        })
      },

      async printRecord(id, isPreview) {
        this.loading = true
        await this.printInitData(id)
        setTimeout(() => {
          doPrintRecord(isPreview)
          setTimeout(() => {
            this.loading = false
          }, 1000)
        }, 2000)
      },

    },
    data() {
      return {
        pathFile: this.$store.getters.filePath,
        importantCnt: 0, //重点项
        normalCnt: 0, //一般项
        total: 0, //总数
        importantQuaNoCnt: 0, //重点项不合格数
        normalQuaNoCnt: 0, //一般项不合格数
        projectIds: [],
        spanRowIndex: [],
        patrolRecordAddressIsShow: false,
        mapAddressVisible: false,
        slideIndex: -1,
        checkboxGroup1: [],
        ruleForm: {
          name: "",
          checkboxGroup1: []
        },
        // 左边悬浮栏的数据
        progress: [
          {
            title: '基本信息'
          },
          {
            title: '检查信息'
          },
          {
            title: '检查结果'
          }
        ],
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        ifbigqy: false,
        ifbigqy1: false,
        patrolId: null,
        taskEntity: {},
        patrolAddress: {
          address: '',
          lng: 0,
          lat: 0
        },
        contextList: [
          {
            project_id: 'aaa',
            project_no: '1',
            project_name: '检查要点1',
            pro_cnt: 3,
            context_no: '1',
            context: '检查内容卢卡申科的奖励卡的深克隆',
            important: '是'
          },
          {
            project_id: 'aaa',
            project_no: '1',
            project_name: '检查要点1',
            pro_cnt: 3,
            context_no: '2',
            context: '检查内容卢卡12121',
            important: '是'
          },
          {
            project_id: 'aaa',
            project_no: '1',
            project_name: '检查要点1',
            pro_cnt: 3,
            context_no: '3',
            context: '检查内容卢卡324324234',
            important: '是'
          },
          {
            project_id: 'bbb',
            project_no: '2',
            project_name: '检查要点2',
            pro_cnt: 2,
            context_no: '1',
            context: '检查内容卢111112',
            important: '是'
          },
          {
            project_id: 'bbb',
            project_no: '2',
            project_name: '检查要点2',
            pro_cnt: 2,
            context_no: '2',
            context: '检查内容卢卡33333',
            important: '是'
          },
          {
            project_id: 'ccc',
            project_no: '3',
            project_name: '检查要点3',
            pro_cnt: 3,
            context_no: '1',
            context: '师德师风定时发送',
            important: '是'
          },
          {
            project_id: 'ccc',
            project_no: '3',
            project_name: '检查要点3',
            pro_cnt: 3,
            context_no: '2',
            context: '检查内容卢卡2123131233',
            important: '是'
          },
          {
            project_id: 'ccc',
            project_no: '3',
            project_name: '检查要点3',
            pro_cnt: 3,
            context_no: '3',
            context: '23adsasdas21多多少少3',
            important: '是'
          }
        ],
        patrolDetail: {
          proofs: []
        },
        itemPicList: [],
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,
        showPicIf: false,
        picSrc: "",
        loading: false,
        qrcodeId: "",
        infoData: {},
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    margin-bottom: 200px;
  }

  $c:#0db5ef;
  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: 0;
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
    .content {
      width: 600px;
    }
  }

  .content {
    margin-top: 20px;

    a {
      background: #F6F7F8;
      border: 1px solid #C2CAD2;
      padding: 5px 19px;
      font-size: 14px;
      color: #393939;
      height: 30px;
      width: 136px;
      box-sizing: border-box;
      margin-left: 10px;
    }
  }

  .mT35 {
    margin-top: 35px;
  }

  .row .el-form-item {
    min-width: 250px;
  }

  .table-div {
    text-align: center;
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

  .imgbox {
    // display: flex;
    width: 650px;
    // overflow: hidden;
    margin-left: 100px;
  }

  .imgdiv {
    float: left;
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    margin-top: 10px;
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
      left: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    position: relative;
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
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
</style>