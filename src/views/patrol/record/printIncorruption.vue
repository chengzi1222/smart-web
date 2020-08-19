<template>

  <!--  打印html  -->
  <div v-show="printShow" class="user-box" id="content">
    <div class="printContent" style="padding: 0; margin: 0; fontSize: 14px; color: #333333; fontFamilt: '微软雅黑';">
      <div id="printBody" printBodyTop="100" class="printBody">
        <table class="table-content" border="1" cellpadding="5" align="left" style="border: 1px solid #333333; width:100%; borderCollapse: collapse">
          <caption style="text-align: center; fontSize: 16px; fontWeight: 700; fontFamily: '微软雅黑'; color: #000000;">
            <p style="margin-bottom: 10px;">成都高新区市场监督管理局</p>
            <p>现场检查人员工作及廉洁自律情况反馈表</p>
          </caption>
          <tr align="center">
            <td>企业(单位)名称</td>
            <td colspan="5" align="left">
              {{dataInfo.entityName}}
              <span style="float: right; margin-right: 50px">(盖章)</span>
            </td>
          </tr>
          <tr align="center">
            <td>通讯地址</td>
            <td colspan="5" align="left">{{dataInfo.address}}</td>
          </tr>
          <tr align="center">
            <td style="width: 25%">联系人</td>
            <td style="width: 15%">{{dataInfo.contactPerson}}</td>
            <td style="width: 15%">联系电话</td>
            <td style="width: 20%">{{dataInfo.contactTel}}</td>
            <td style="width: 10%">邮编</td>
            <td style="width: 15%">{{dataInfo.postcode}}</td>
          </tr>
          <tr>
            <td colspan="6" style="line-height: 10px;">
              <p style="text-align: center; line-height: 14px; fontWeight: 700; color: #000000;">被告检查企业(单位)书</p>
              <p>一、 请向检查组提供真实、准确和可信的资料；</p>
              <p>二、 不得向检查人员赠送现金、有价证券和礼品；</p>
              <p>三、 不得安排检查人员参加经营性娱乐场所的娱乐活动；</p>
              <p>四、 不得干预和影响检查人员的正常工作；</p>
              <p>五、 如违反上述规定，一经查实，通过检查的结论无效，并予以通报。</p>
            </td>
          </tr>
          <tr align="center">
            <td colspan="6">
              <p>请在相应栏( )中对评价检查人员工作及廉洁自律情况内打"√"</p>
            </td>
          </tr>
          <tr align="center">
            <td >
              <p style="fontWeight: 700; color: #000000;">工作情况</p>
              <p>满 意( {{dataInfo.workingCondition === 'SATISFACTION' ? '√': ''}} )</p>
              <p>基本满意( {{dataInfo.workingCondition === 'BASICALLYATISFIED' ? '√': ''}} )</p>
              <p>不 满 意( {{dataInfo.workingCondition === 'DISSATISFIED' ? '√': ''}} )</p>
              <br/>
            </td>
            <td colspan="5" align="left">
              <p style="text-align:center; fontWeight: 700; color: #000000;">廉洁自律情况</p>
              <p>是否语言礼貌，文明执法？ 是( {{dataInfo.politeCivilized === 'YES' ? '√' : ''}} ) 否( {{dataInfo.politeCivilized === 'NO' ? '√' : ''}} )</p>
              <p>是否接受你单位现金，有价证券和礼品馈赠 是( {{dataInfo.bribe === 'YES' ? '√' : ''}} ) 否( {{dataInfo.bribe === 'NO' ? '√' : ''}} )</p>
              <p>是否要求或参加您单位安排经营性娱乐活动？ 是( {{dataInfo.entertainment === 'YES' ? '√' : ''}} ) 否( {{dataInfo.entertainment === 'NO' ? '√' : ''}} )</p>
              <p>是否在您单位报销应由个人承担的费用？ 是( {{dataInfo.reimbursement === 'YES' ? '√' : ''}} ) 否( {{dataInfo.reimbursement === 'NO' ? '√' : ''}} )</p>
            </td>
          </tr>
          <tr>
            <td colspan="6" style="border-bottom: 0;">其他意见和建议：</td>
          </tr>
          <tr>
            <td colspan="6" style="border-top: 0; border-bottom: 0; padding-left: 20px;">{{dataInfo.suggest}}</td>
          </tr>
          <tr>
            <td colspan="6" style="border-top: 0; border-bottom: 0;"><br/></td>
          </tr>
          <tr align="right">
            <td colspan="6" style="border-top: 0; border-bottom: 0;">被检查企业(单位)负责人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(盖章)</td>
          </tr>
          <tr align="right">
            <td colspan="6" style="border-top: 0;"> {{dataInfo.createTime ? dataInfo.createTime.slice(0,4): '&nbsp;&nbsp;&nbsp;&nbsp;'}}&nbsp;&nbsp;年&nbsp;&nbsp;{{dataInfo.createTime ? dataInfo.createTime.slice(5,7): '&nbsp;&nbsp;&nbsp;&nbsp;'}}&nbsp;&nbsp;月&nbsp;&nbsp;{{dataInfo.createTime ? dataInfo.createTime.slice(8,10): '&nbsp;&nbsp;&nbsp;&nbsp;'}}&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
          </tr>
          <tr>
            <td align="center">现场检查</td>
            <td colspan="5">
              <p>检查单位：{{dataInfo.patrolDept}}</p>
              <p>检查人员：{{dataInfo.patrolPerson}}</p>
            </td>
          </tr>
        </table>
        <p>&nbsp;</p>
        <div class="table-footer" style="width: 100%; margin: 0 auto;">
          <p style="fontFamily: '微软雅黑'; fontWeight: 700; color: #000000;">全国纪检监察机关统一举报电话：12388</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    props: {
      dataInfo: {
        default: function () {
          return {}
        }
      }
    },
    mounted() {
      // this.$nextTick(() => {
      //   let domArr = this.$parent.$refs.PrintIncorruptions
      // })
    },

    methods: {
      
    },
    data() {
      return {
        //打印
        printShow:false,
      }
    },

  }
</script>

