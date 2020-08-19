<template>

  <!--  打印html  -->
  <div v-show="printShow" class="user-box" id="content">
    <div class="printContent">
      <div id="printHead">
        <span id="qrcode"></span>
        <div class="printTitle" ref="title">现场检查笔录</div>
        <p class="number">编号：{{ resultData.recordNo }} <span id="printPage">第1页，共X页</span></p>
        <hr>
      </div>
      <div id="printBody">
        <p>检查事由： <u>{{ resultData.planName }}</u></p>
        <p>被检查单位（人）：<u> {{basicInfoData.entityName}}</u></p>
        <p>社会信用代码： <u> {{basicInfoData.creditCode}}</u></p>
        <p> 检查地点：<u> {{basicInfoData.spaceAddr}}</u></p>
        <p><span style="width:350px; display: inline-block;"> 法人：<u> {{basicInfoData.corpName}}</u></span>联系方式：
          <u> {{basicInfoData.mobile}}</u></p>
        <p v-if="isShow">
          <span style="width:200px; display: inline-block;"> 监管人员:<u> {{basicInfoData.patrolSoIdStr}}</u></span>
          <span style="width: 450px;display: inline-block;"> 信息员：<u> {{messengers}} </u></span>
        </p>
        <p v-else>
          <span style="width:200px; display: inline-block;"> 检查人员:<u> {{basicInfoData.patrolSoIdStr}}</u></span>
        </p>
        <p>检查类别： <u> {{patrolType}} </u></p>
        <p>检查时间： <u> {{basicInfoData.patrolTime}}</u></p>
        <hr>
        <p class="text_indent">我们是<u> {{basicInfoData.deptName}}</u>的执法人员 <u>{{basicInfoData.patrolSoIdStr}}{{messengers==''?'':'、'+messengers}}</u>，执法证件名称、编号是：
          ________________________ </p>
        <p class="text_indent">我们在你单位
          ____________（职务）____________（姓名）陪同下进行现场检查。依照法律规定，对于检察人员，在以下情形之一的，应当自行回避，你也有权申请检察人员回避：（1）系当事人或当事人的近亲属；（2）与本案有直接利害关系；（3）与当事人有其他关系，可能影响案件公正处理的。</p>
        <p class="text_indent radio">
          <span>是否申请调查人员回避，</span>
          <template>
            <el-radio v-model="recordData.radio" label="yes" size="mini">是</el-radio>
            <el-radio v-model="recordData.radio" label="no" size="mini">否</el-radio>
          </template>
          <span style="margin-left:20px;">签字： ____________ </span>
        </p>
        <p class="text_indent">现场检查记录：执法人员向被检查单位（人）说明来意后进行监督检查。 </p>
        <hr>
        <p class="text_indent"> 此次巡查共巡查重点项：<u> {{patrolData.important}}</u>个；一般项： <u>
          {{patrolData.normal}}</u>个。
          其中重点项不符合：<u> {{patrolData.importantNoQual}}</u>个；一般项不符合：<u>
            {{patrolData.normalNoQual}}</u>个；
          符合的重点项的编号为：<u> {{patrolData.importantQualStr}}</u> 符合的一般项的编号为：<u>
            {{patrolData.normalQualStr}}</u></p>
        <p v-if="patrolContent.important == ''" class="text_indent">重点项不符合项目： 无</p>
        <p v-if="patrolContent.important != ''" class="text_indent">重点项不符合项目： </p>
        <p v-if="patrolContent.important != ''" class="text_indent"
           v-for="(item, index) in patrolContent.important"> {{index + 1}}，编号： {{item.no}}；内容：&nbsp;{{item.context}}&nbsp;备注：&nbsp;{{item.remark}}&nbsp; </p>
        <p v-if="patrolContent.normal == ''" class="text_indent"> 一般项不符合项目： 无</p>
        <p v-if="patrolContent.normal != ''" class="text_indent"> 一般项不符合项目： </p>
        <p v-if="patrolContent.normal != ''" class="text_indent"
           v-for="(item, index) in patrolContent.normal"> {{index + 1}}，编号： {{item.no}}；内容：&nbsp;{{item.context}}&nbsp;备注：&nbsp;{{item.remark}}&nbsp;</p>
        <hr>
        <!-- 检查结果 -->
        <p class="text_indent" v-if="resultData.treat === 'TIME_LIMIT_RECTIFICATION'"> 针对上述问题，巡查结果为：<u>不符合</u>；处理方式为：<u>再次限期整改</u>。责令经营者务于
          {{resultData.rectifyTime}} 前整改到位，并将整改情况反馈给 __________ （联系电话：__________ ）。 </p>
        <!--<p class="text_indent" v-if="resultData.treat === 'ON_THE_SPOT_SPOT_RECTIFICATION'">-->
          <!--针对上述问题，巡查结果为：<u>基本符合</u>；处理方式为：<u>现场整改</u>。 </p>-->
        <!--<p class="text_indent" v-if="resultData.treat === 'NORMOUT_OF_BUSINESSAL'"> 针对上述问题，巡查结果为：<u>不符合</u>；处理方式为：<u>责令停业</u>。-->
        <!--</p>-->
        <p class="text_indent" v-if="resultData.treat === 'INVESTIGATION_AND_TREATMENT'">
          针对上述问题，巡查结果为：<u>不符合</u>；处理方式为：<u>调查处理</u>。 </p>
        <p class="text_indent" v-if="resultData.treat === 'NORMAL'">针对上述问题，巡查结果为：<u>符合</u>；处理方式为：<u>正常，无需处理</u>。
        </p>
        <!-- 检查结果结束-->
        <p class="text_indent">被检查人：___________职务： __________ &nbsp;&nbsp; ________年____月____日</p>
        <p class="text_indent">
          见证人： _____________
          身份证号：______________________________&nbsp;&nbsp;
          ________年____月____日
        </p>
        <p class="text_indent">
          执法人员：_____________&nbsp;&nbsp;
          ________年____月____日
        </p>
        <p v-if="!resultData.sign" class="text_indent">电子签名：<u>无</u></p>
        <p v-if="resultData.sign" class="text_indent">电子签名：<u><img :src="pathFile + resultData.sign"
                                                                   alt=""></u></p>
        <p class="text_indent">
          注：存档（1）.被检查人在检查笔录上逐页签字或者按指纹，并注明对笔录真实性的意见。笔录修改处，应由被检查人签字或者按指纹。被检查人拒绝签字的，应邀请见证人到场，并由见证人签字或盖章；同时由两名以上行政执法人员在笔录中注明拒绝签字的理由。执法人员应在笔录上签字。</p>
      </div>
    </div>
  </div>

</template>

<script type="module">
  import QRCode from 'qrcodejs2';

  export default {
    props: {
      basicInfoData: {
        default: function () {
          return {}
        }
      },
      messengers: {
        type: String,
        default: function () {
          return ""
        }
      },
      patrolData: {
        default: function () {
          return {}
        }
      },
      patrolContent: {
        default: function () {
          return {}
        }
      },
      resultData: {
        default: function () {
          return {}
        }
      },
      patrolType: {
        type: String,
        default: function () {
          return ""
        }
      },
      qrcodeId: {
        type: String,
        default: function () {
          return ""
        }
      },
    },
    watch:{
      "basicInfoData.areaCode"(){
        if(this.basicInfoData.areaCode.length ===10||this.basicInfoData.areaCode.length ===14){
          this.isShow=true
        }
      }
    },
    mounted() { 
      this.deptName = this.$store.getters.user.deptName;
      this.pathFile = this.$store.getters.filePath;
    },

    methods: {

      qrcode(id) {
        var qrcode = new QRCode('qrcode', {
          // text: '{"id": "' + id + '", "type": "record"}',
          text: `${this.$store.getters.base.qrUrl.qrUrl}?t=` + "M_RECORD&v=1&id=" + id,
          width: 96,
          height: 96,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      },

      printStyle() {
        let content = document.getElementsByClassName('printContent')[0];
        let all = content.getElementsByTagName("p");
        for (let i = 0; i < all.length; i++) {
          all[i].style.padding = "0";
          all[i].style.margin = "0";
          all[i].style.lineHeight = "25px";
          all[i].style.fontSize = "12px";
        }
        content.style.fontFamily = "微软雅黑";
        let title = content.getElementsByClassName("printTitle");
        content.getElementsByClassName("el-radio__original")[0].style.position = "relative";
        content.getElementsByClassName("el-radio__original")[0].style.top = "5px";
        content.getElementsByClassName("el-radio__original")[1].style.position = "relative";
        content.getElementsByClassName("el-radio__original")[1].style.top = "5px";
        let text_indent = content.getElementsByClassName("text_indent");
        for (let i = 0; i < text_indent.length; i++) {
          text_indent[i].style.textIndent = "26px";
        }
        for (let i = 0; i < title.length; i++) {
          title[i].style.textAlign = "center";
          title[i].style.fontSize = "14px";
          title[i].style.paddingTop = "50px";
          title[i].style.paddingBottom = "20px";
          title[i].style.fontFamily = "微软雅黑";
        }
        document.getElementById("qrcode").style.position = "absolute";
        document.getElementById("qrcode").style.right = "5px";
        document.getElementById("qrcode").style.top = "20px";
        document.getElementById("qrcode").style.width = "96px";
        document.getElementById("qrcode").style.height = "96px";
        document.getElementById("qrcode").innerHTML = '';
        this.qrcode(this.qrcodeId);

      },
    },
    data() {
      return {
        //打印
        printShow: false,
        deptName: "",
        recordData: {
          serialNumber: "180516A000003",
        },
        rectifyTime: "",
        isShow:false,
      }
    },

    compontents: {
      QRCode
    },
  }
</script>

