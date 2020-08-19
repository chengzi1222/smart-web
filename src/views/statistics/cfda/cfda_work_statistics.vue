<template>
  <div class="user-box">
    <enum-select v-model="workType" multiple placeholder="办件类型" @change="selectChange" enum="com.ybveg.govx.enums.cfda.CfdaWorkTypeEnum"></enum-select>
    <div class="clear_a" style="display: inline-block">
      <div style="line-height:34px;text-align:center;width:100px;margin-right: -20px;">办件日期：</div>
      <el-date-picker @change="selectChange" value-format="yyyy-MM-dd" class="selectHeight" type="date"
                      v-model="startDate"
                      placeholder="起始时间" :picker-options="beforeDate"></el-date-picker>
      <div style="line-height:34px;text-align:center;width:30px;">至</div>
      <el-date-picker @change="selectChange" value-format="yyyy-MM-dd" v-model="endDate"
                      class="selectHeight" style="margin-left:0 !important;"
                      type="date" placeholder="截止时间" :picker-options="afterDate"></el-date-picker>
    </div>
    <el-button @click="exportWorkFile" class="floatR" type="primary" style="margin-top:20px;">导出</el-button>
    <el-table :data="report" class="table-div" v-loading="loading">
      <el-table-column type="index" align="center" label="排名" width="50">
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="deptName" min-width="90" label="单位名称"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="cfdarestaurant" min-width="90" label="小经营店（餐饮）"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="sale" min-width="90" label="小经营店（销售）"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="workshop" min-width="90" label="小作坊"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="vendors" min-width="90" label="小摊贩"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="sum" min-width="90" label="小计"></el-table-column>

    </el-table>
  </div>
</template>
<script>
  import { workForms, exportWorkFile } from 'api/statistics/statistics';
  import EnumSelect from 'components/common/EnumSelect.vue';
  import { downloadFile } from 'api/common';

  export default {
    components:{
      EnumSelect
    },
    async mounted() {
      this.selectChange();
      this.getDate();
    },
    methods: {
      async selectChange() {
        this.loading = true;
        let params = {"bType":"CFDA","workType":this.workType,"startDate":this.startDate,"endDate":this.endDate}
        let report = await workForms(params);
        this.loading = false;
        this.report = report.data;
      },
      exportWorkFile() {
        let title = '办件统计';
        let params = {"title":title,"bType":"CFDA","workType":this.workType,"startDate":this.startDate,"endDate":this.endDate}
        exportWorkFile(params).then((result) => {
          downloadFile(result.data.fileId, title);
        });
      },
      liClick(e) {
        //点击导航切换样式
        var me = this;
        if (me.defaultIndex == e.target.dataset.index) {
          return;
        }
        me.defaultIndex = e.target.dataset.index;
        this.$router.push({ path: this.lists[me.defaultIndex].router });
      },
      getDate(){
        const dates = new Date();
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        this.startDate = dates.getFullYear() + '-01-01';
        this.endDate = dates.getFullYear() + '-' + mon + '-' + day
      }
    },
    data() {
      return {
        workType: ['FIRST'],
        report: [],
        loading: false,
        startDate:"",
        endDate:"",
        afterDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.startDate);
            if (this.startDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        beforeDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.endDate);
            if (this.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
      }
    }
  }
</script>

<style lang="sass">
  section.select .el-select {
    margin-top: 20px;
    margin-right: 20px;
    width: 150px;
  }

  .tab-box {
    padding-left: 20px;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott span {
    color: #393939;
  }

  .tab-box .tab-bott {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #ebf1f5;
  }
</style>
