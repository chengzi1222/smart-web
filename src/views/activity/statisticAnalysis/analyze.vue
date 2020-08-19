<template>
  <div class="user-box">
    <div class="content">
      <h3 class="box-tit">今日实时数据<span class="ml20">{{day}}</span></h3>
      <ul class="flex-box mt20" v-if="dataLis">
        <li>
          <h3>{{dataLis.today.boxDistribution}}</h3>
          <p>盒饭配送总数</p>
        </li>
        <li>
          <h3>{{dataLis.today.boxPass}}</h3>
          <p>盒饭通过总数</p>
        </li>
        <li>
          <h3>{{dataLis.today.boxSupplyTotal}}</h3>
          <p>盒饭实际供应总数</p>
        </li>
        <li>
          <h3>{{dataLis.today.mealspersons}}</h3>
          <p>堂食就餐人次</p>
        </li>
        <li>
          <h3>{{dataLis.today.boxPerson}}</h3>
          <p>出动食品监管人员</p>
        </li>
        <li>
          <h3>{{dataLis.today.patrolDay}}</h3>
          <p>每日现场保障检查</p>
        </li>
        <li>
          <h3>{{dataLis.today.boxCheck}}</h3>
          <p>盒饭供应检查</p>
        </li>
      </ul>
    </div>
    <div class="content mt20">
      <h3 class="box-tit">累计数据
      </h3>
      <ul class="flex-box mt20" v-if="dataLis">
        <li>
          <h3>{{dataLis.total.boxpersonAll}}</h3>
          <p>保障餐饮总人次</p>
        </li>
        <li>
          <h3>{{dataLis.total.boxSupplyTotalAll}}</h3>
          <p>供应盒饭人次</p>
        </li>
        <li>
          <h3>{{dataLis.total.mealspersonsALL}}</h3>
          <p>提供堂食人次</p>
        </li>
        <li>
          <h3>{{dataLis.total.boxCheckAll}}</h3>
          <p>盒饭供应检查</p>
        </li>
        <li>
          <h3>{{dataLis.total.patrolDayAll}}</h3>
          <p>每日现场保障检查</p>
        </li>
        <li>
          <h3>{{dataLis.total.patrolRiskAll}}</h3>
          <p>风险评估检查</p>
        </li>
      </ul>
    </div>
    <div class="way-box mt20">
      <div class="way-div">
        <h3>盒饭检查情况</h3>
        <div id="boxStatus"></div>
      </div>
      <div class="way-div">
        <h3>每日现场检查情况</h3>
        <div id="dayStatus"></div>
      </div>
    </div>
    <div class="way-box mt20">
      <div class="way-div" style="width: 35%;">
        <h3>整改情况</h3>
        <div id="abarbeitungStatus"></div>
      </div>
      <div class="way-div" style="width: 63%;">
        <h3>供应商今日盒饭配送情况</h3>
        <el-select class="w150 ml20 selBox" v-model="selValue" @change="getBar" placeholder="排序" clearable>
          <el-option v-for="item in selLis" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <div id="bar-div"></div>
      </div>
    </div>
    <div class="mt20 state-box">
      <h3>实时盒饭检查动态</h3>
      <el-table :data="tableData" style="width: 100%;margin-top:20px;font-size:12px;">
        <el-table-column align="center" label="序号" type="index" min-width="50"></el-table-column>
        <el-table-column align="center" label="企业名称" prop="entityName" min-width="100"></el-table-column>
        <el-table-column align="center" label="处理方式" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.treatStr == '通过'" size="mini" type="success">{{scope.row.treatStr}}</el-tag>
            <el-tag v-if="scope.row.treatStr == '拒收'" size="mini" type="danger">{{scope.row.treatStr}}</el-tag>
            <span v-if="!scope.row.treatStr">暂无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="盒饭数量" prop="passTotal" min-width="80"></el-table-column>
        <el-table-column align="center" label="联系方式" prop="mobile" min-width="100"> </el-table-column>
        <el-table-column align="center" label="检查时间" prop="examineTime" min-width="100"></el-table-column>
      </el-table>
    </div>
    <div class="mt20 state-box">
      <h3>每日现场检查动态</h3>
      <el-table :data="tableDayData" style="width: 100%;margin-top:20px;font-size:12px;">
        <el-table-column align="center" label="序号" type="index" min-width="50"></el-table-column>
        <el-table-column align="center" label="企业名称" prop="entityName" min-width="100"></el-table-column>
        <el-table-column align="center" label="处理方式" min-width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.treat == 'NORMAL'" size="mini" type="success">{{scope.row.treatStr}}</el-tag>
            <el-tag v-if="scope.row.treat == 'RECTIFY'" size="mini" type="danger">{{scope.row.treatStr}}</el-tag>
            <span v-if="!scope.row.treatStr">暂无</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="检查结果" prop="resultStr" min-width="80"></el-table-column>
        <el-table-column align="center" label="联系方式" prop="mobile" min-width="100"> </el-table-column>
        <el-table-column align="center" label="检查时间" prop="patrolTime" min-width="100"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import * as plan from 'api/activity/anaylze'
  import * as pie from './echartsFun.js'
  export default {
    props: {
      id: {
        type: String
      }
    },
    mounted() {
      this.getPie();
      this.getTabData();
      this.getdate();
      this.getAllData();
    },
    methods: {
      getdate() {
        if (this.willDestroy) return
        setTimeout(() => {
          this.getdate();
        }, 60000);
        let dates = new Date();
        let mon = dates.getMonth() + 1;
        let day = dates.getDate();
        let hours = dates.getHours();
        let min = dates.getMinutes();

        if (mon <= 9) mon = "0" + mon;
        if (day <= 9) day = "0" + day;
        if (hours <= 9) hours = "0" + hours;
        if (min <= 9) min = "0" + min;

        this.day = dates.getFullYear() + "-" + mon + "-" + day + ' ' + hours + ':' + min;
        let dateNum = dates.getFullYear() + "-" + mon + "-" + day;
        plan.getTodayData(this.id, { 'startDate': dateNum, 'endDate': dateNum }).then((r) => {
          this.dataLis.today = r.data;
        })
        this.dateNum = dateNum;
        this.getBar()
      },
      getAllData() {
        plan.getAllData(this.id).then((r) => {
          this.dataLis.total = r.data;
        })
      },
      getPie() {
        plan.getPie(this.id).then((r) => {
          this.pieData.boxCheckMap.data.push({ value: r.data.boxCheckMap.inpass, name: '通过' });
          this.pieData.boxCheckMap.data.push({ value: r.data.boxCheckMap.rejected, name: '拒收' });

          this.pieData.dayCheckMap.data.push({ value: r.data.dayCheckMap.patrolNomal, name: '正常' });
          this.pieData.dayCheckMap.data.push({ value: r.data.dayCheckMap.patrolRectify, name: '责令整改' });

          this.pieData.rectifyMap.data.push({ value: r.data.rectifyMap.rectifyDone, name: '已整改' });
          this.pieData.rectifyMap.data.push({ value: r.data.rectifyMap.rectifyDodo, name: '整改中' });

          pie.draw(this.pieData.boxCheckMap.data, this.pieData.boxCheckMap.name, 'boxStatus')
          pie.draw(this.pieData.dayCheckMap.data, this.pieData.dayCheckMap.name, 'dayStatus')
          pie.draw(this.pieData.rectifyMap.data, this.pieData.rectifyMap.name, 'abarbeitungStatus')
        })
      },
      getBar() {
        let params = {
          startDate: this.dateNum,
          endDate: this.dateNum,
          sortType: this.selValue
        }
        plan.getBar(this.id, params).then((r) => {
          let legendData = ['通过数', '拒绝数', '配送中', '无法送达'],
            seriesData = [{
              name: '通过数',
              type: 'bar',
              data: []
            }, {
              name: '拒绝数',
              type: 'bar',
              data: []
            }, {
              name: '配送中',
              type: 'bar',
              data: []
            }, {
              name: '无法送达',
              type: 'bar',
              data: []
            }],
            xData = [];
          for (var i = 0; i < r.data.length; i++) {
            xData.push(r.data[i].entityName);
            seriesData[0].data.push(r.data[i].passTotal)
            seriesData[1].data.push(r.data[i].rejectedTotal)
            seriesData[2].data.push(r.data[i].dispatchTotal)
            seriesData[3].data.push(r.data[i].cannotTotal)
          }
          pie.totalPatrol(legendData, xData, seriesData, 'bar-div')
        })
      },
      getTabData() {
        if (this.willDestroy) return
        this.TabNum++;
        plan.getTabData(this.id, this.TabNum, 5).then((r) => {
          this.tableData = r.data.list;
          if (r.data.total / this.TabNum <= 5) {
            this.TabNum = -1;
          }
          setTimeout(() => {
            this.getTabData();
          }, 10000);
        })
        plan.getDaycheckList(this.id, this.TabNum, 5).then((r) => {
          this.tableDayData = r.data.list;
        })
      }
    },
    beforeDestroy() {
      this.willDestroy = true;
    },
    components: {
    },
    data() {
      return {
        tableData: [],
        tableDayData: [],
        dataLis: {
          total: {},
          today: {}
        },
        pieData: {
          boxCheckMap: {
            data: [],
            name: ['通过', '拒收']
          },
          dayCheckMap: {
            data: [],
            name: ['正常', '责令整改']
          },
          rectifyMap: {
            data: [],
            name: ['已整改', '整改中']
          }
        },
        willDestroy: false,
        day: '',
        TabNum: 0,
        dateNum: '',
        selLis: [{
          name: '通过率',
          value: 'PASS'
        }, {
          name: '供应总数',
          value: 'TOTAL'
        }],
        selValue: ''
      }
    }
  }
</script>

<style scoped lang="scss">
  .user-box {
    background-color: #edf0f3;
    padding: 20px;
    margin-top: -22px;
    margin-left: -20px;
    width: 100%;
  }

  .content {
    padding: 15px 20px;
    background: #fff;
  }

  .box-tit {
    font-size: 15px;
    height: 21px;
    color: rgba(57, 57, 57, 1);
    line-height: 21px;
    span {
      font-size: 14px;
      font-weight: 100;
    }
  }

  .flex-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 24%;
      text-align: center;
      height: 100px;
      padding-top: 15px;
      box-sizing: border-box;
      h3 {
        font-size: 30px;
        color: rgba(51, 51, 51, 1);
        line-height: 42px;
      }
      p {
        font-size: 14px;
        color: rgba(162, 170, 182, 1);
        line-height: 20px;
      }
    }
  }

  .way-box {
    display: flex;
    position: relative;
    justify-content: space-between;
    .way-div {
      width: 49%;
      height: 300px;
      background: #fff;
      h3 {
        font-size: 15px;
        color: #393939;
        line-height: 50px;
        padding-left: 20px;
      }
      div {
        height: 250px;
      }
      .selBox {
        position: absolute;
        top: 23px;
        right: 300px;
        z-index: 666;
        height: 40px;
      }
      #bar-div {
        top: -21px;
        height: 270px;
      }
    }
  }

  .state-box {
    background: #fff;
    padding: 16px 20px;
    h3 {
      font-size: 15px;
      color: #393939;
    }
  }
</style>