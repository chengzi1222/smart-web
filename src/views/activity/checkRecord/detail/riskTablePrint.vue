<template>
  <div class="tablePrint" v-show="printShow">
    <div id="printHead">
      <p class="print_w100 print_titie1">餐饮单位风险评估现场审查表</p>
      <p v-if="resultData.patrolDetail">编号：{{ resultData.patrolDetail.patrol_no }} &nbsp; &nbsp; <span id="printPage" style="display:none">第1页，共X页</span></p>
    </div>
    <div id="printBody" printBodyTop="110" intHeight="85%">
      <p style="margin-top:10px;margin-bottom:5px;width:100%;font-size:16px;" v-if="resultData.taskEntity">
        <span style="width: 50%;display: inline-block;">餐饮单位名称：&nbsp; {{resultData.taskEntity.entity_name}} </span>
        量化等级：&nbsp;{{resultData.quanLevel}}
      </p>
      <table class="print_w100 print_table" border="1" cellspacing="0" cellpadding="0">
        <tr>
          <td class="thead_t w10"> 编号</td>
          <td class="thead_t w65" style="text-align: left;">现场审查内容</td>
          <td class="thead_t w25">是否符合要求（√）</td>
        </tr>
        <tr v-for="(item,index) in resultData.contextList">
          <td class="w10"> {{index+1}}</td>
          <td class=" w65" style="text-align: left;">{{item.context}}</td>
          <td class="w25">
            是<span v-if="item.qual=='YES'">（√）</span><span v-else>（&nbsp;&nbsp;）</span>
            否<span v-if="item.qual=='NO'">（√）</span><span v-else>（&nbsp;&nbsp;）</span>
          </td>
        </tr>

      </table>
      <p style="margin-top:20px;margin-bottom:5px;width:100%;" v-if="resultData.patrolDetail">
        <span style="width: 48%;margin-right:2%;">被检查人签名:&nbsp;
          <span v-if="resultData.patrolDetail.is_cooperate === 'NO'">企业拒绝配合&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
          <img :src="pathFile + resultData.patrolDetail.entity_sign" alt="" v-if="resultData.patrolDetail.entity_sign && resultData.patrolDetail.is_cooperate === 'YES'"
            style="max-width: 200px;width: auto;max-height: 200px;height: auto" />
        </span>
        <span>
          监督人员签名:&nbsp;<img :src="pathFile + resultData.patrolDetail.so_sign" alt="" style="max-width: 200px;width: auto;max-height: 200px;height: auto">
        </span>
      </p>
      <p>
        <span style="width:48%;display: inline-block;text-align:center;">{{resultData.patrolDetail?resultData.patrolDetail.patrol_date:""}}</span>
        <span style="width:48%;display: inline-block;text-align:center;">{{resultData.patrolDetail?resultData.patrolDetail.patrol_date:""}}</span>
      </p>

    </div>
  </div>
</template>

<script>

  export default {
    props: {
      resultData: {
        default: function () {
          return {}
        }
      }
    },
    methods: {},
    mounted() {
      let content = document.getElementsByClassName('tablePrint')[0];
      let w100 = content.getElementsByClassName("print_w100");
      for (let i = 0; i < w100.length; i++) {
        w100[i].style.width = "100%";
        w100[i].style.textAlign = "center";
      }
      let title1 = content.getElementsByClassName("print_titie1");
      for (let i = 0; i < title1.length; i++) {
        title1[i].style.fontSize = "18px";
        title1[i].style.paddingTop = "25px";
        title1[i].style.paddingBottom = "2px";
        title1[i].style.fontFamily = "微软雅黑";
      }
      let textAlignLeft = content.getElementsByClassName("print_leftAlign");
      for (let i = 0; i < textAlignLeft.length; i++) {
        textAlignLeft[i].style.textAlign = "left";
      }

      let table = content.getElementsByClassName("print_table")[0];
      table.style.boxSizing = "border-box";
      let table_td = content.getElementsByTagName("td");
      for (let i = 0; i < table_td.length; i++) {
        table_td[i].style.paddingLeft = '5px';
        table_td[i].style.paddingRight = '5px';
        table_td[i].style.lineHeight = "25px";
        table_td[i].style.fontSize = "14px";
      }
      let table_thead_t = content.getElementsByClassName("thead_t");
      for (let i = 0; i < table_thead_t.length; i++) {
        table_thead_t[i].style.lineHeight = "35px";
        table_thead_t[i].style.fontSize = "15px";
      }
      let w10 = content.getElementsByClassName("w10")[0];
      let w25 = content.getElementsByClassName("w25")[0];
      let w65 = content.getElementsByClassName("w65")[0];
      w10.style.width = '10%';
      w25.style.width = '25%';
      w65.style.width = '65%';

    },
    data() {
      return {
        pathFile: this.$store.getters.filePath,
        radio: '',
        printShow: false,
      }
    },
  }
</script>

<style scoped lang="sass">
</style>