<template>
  <!--  打印html  -->
  <div v-show="printShow" class="user-box" id="content">
    <div id="printHead">
      <h2 style="text-align:center;font-size:24px">重大活动保障盒饭供应检查表</h2>
      <p class="number" style="margin-left:48px">编号：{{ resultData.recordNo }}   &nbsp; &nbsp; <span id="printPage" style="display:none">第1页，共X页</span></p>
    </div>
    <div id="printBody" printBodyTop="100" intHeight="85%">
      <div style="width: 600px;margin: 10px auto;">
        <div style="border: 1px solid #000;font-size: 18px;overflow: hidden;position:relative;">
          <div style="font-weight: 700;position: absolute;top: 50%;margin-top:-15px;left: 20px;">
            盒饭供应商家名称（盖章）
          </div>
          <div style="float:right;width: calc(60% - 1px);border-left: 1px solid #000;text-align: center;line-height: 45px;">{{resultData.entityName}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;border-top: none;overflow: hidden;position:relative;">
          <div style="font-weight: 700;position: absolute;top: 50%;margin-top:-15px;left: 70px;">
            盒饭配菜
          </div>
          <div
            style="float:right;width: calc(60% - 1px);text-align: center;border-left: 1px solid #000;min-height: 80px;line-height: 35px;">
            {{resultData.reportedMenu}}
          </div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">盒饭数量（份）
          </div>
          <div style="float:right;width: 59%;text-align: center;">{{resultData.boxQuantity}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">加工时间</div>
          <div style="float:right;width: 59%;text-align: center;">{{resultData.examineDate?resultData.examineDate.split(" ")[0]:""}} &nbsp;{{resultData.processTime}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">运输车辆（车牌）
          </div>
          <div style="float:right;width: 59%;text-align: center;">{{resultData.carNo}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">出发时间</div>
          <div style="float:right;width: 59%;text-align: center;">{{resultData.examineDate?resultData.examineDate.split(" ")[0]:""}}&nbsp;{{resultData.departtime}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">到展时间</div>
          <div style="float:right;width: 59%;text-align: center;">{{resultData.examineDate?resultData.examineDate.split(" ")[0]:""}} &nbsp;{{resultData.arriveTime}}</div>
        </div>
        <div v-if="resultData.contexts" style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">
            属地监管部门（有无封条）
          </div>
          <div v-if="resultData.contexts[2].qual=='是'" style="float:right;width: 59%;text-align: center;">
            有
          </div>
          <div v-if="resultData.contexts[2].qual=='否'" style="float:right;width: 59%;text-align: center;">
            无
          </div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 45px;border-top: none;overflow: hidden;">
          <div style="width:40%;text-align:center;border-right: 1px solid #000;font-weight: 700;float: left;">
            盒饭中心温度（≧60℃）
          </div>
          <div style="float:right;width: 59%;text-align: center;">饭（{{resultData.contexts?
            resultData.contexts[3].examineData: ""}} ℃） 菜（{{resultData.contexts?resultData.contexts[4].examineData: ""}}
            ℃）
          </div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 35px;border-top: none;overflow: hidden;">
          <h3 style="padding-left:10px;">被检查盒饭供应商家负责人签字：</h3>

          <p v-if="!resultData.enterpriseFile || !resultData.enterpriseFile.fileId" style="textIndent:26px"><u>无</u>
          </p>
          <p v-if="resultData.enterpriseFile && resultData.enterpriseFile.fileId" style="textIndent:26px"><u><img
            :src="resultData.enterpriseFile.fileId" alt="" style="max-width: 200px;width: auto;max-height: 200px;height: auto"></u></p>
          <div style="text-align: right;padding-right: 30px">{{resultData.examineDate?resultData.examineDate.split(" ")[0]:""}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 35px;border-top: none;overflow: hidden;">
          <h3 style="padding-left:10px;">检查人员签字：</h3>
          <p v-if="!resultData.supervisFile || !resultData.supervisFile.fileId" style="textIndent:26px"><u>无</u>
          </p>
          <p v-if="resultData.supervisFile && resultData.supervisFile.fileId" style="textIndent:26px"><u><img
            :src="resultData.supervisFile.fileId" alt="" style="max-width: 200px;width: auto;max-height: 200px;height: auto"></u></p>
          <div style="text-align: right;padding-right: 30px">{{resultData.examineDate?resultData.examineDate.split(" ")[0]:""}}</div>
        </div>
        <div style="border: 1px solid #000;font-size: 18px;line-height: 35px;border-top: none;overflow: hidden;">
          <h3 style="padding-left:10px;">监管备注：</h3>
              <span v-if="resultData.remark" style="textIndent: 26px">{{resultData.remark}}</span>
              <span v-if="!resultData.remark" style="textIndent: 26px">无</span>
          <br/>
          <br/>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import QRCode from 'qrcodejs2';

  export default {
    props: {
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
    mounted() {

    },

    methods: {

      qrcode(id) {
        var qrcode = new QRCode('qrcode', {
          // text: '{"id": "' + id + '", "type": "record"}',
          text: `${this.$store.getters.base.qrUrl.qrUrl}?t=` + "F_RECORD&v=1&id=" + id,
          width: 96,
          height: 96,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      },

      printStyle(qrid) {
      },
    },
    computed: {},
    data() {
      return {
        //打印
        printShow: false,
        deptName: "",
        recordData: {
          serialNumber: "180516A000003",
        },
        rectifyTime: ""
      }
    },

    compontents: {
      QRCode
    },
  }
</script>
