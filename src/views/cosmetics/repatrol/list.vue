<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>限期整改</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :key="index" :data-index="index"
          :class="index==mess.choose?'li-bott':''" @click="choose(index,item.type)">
        <div :data-index='index'>
                  <span :class="index==mess.choose?'li-span':''">
                    {{item.name}}
                  </span>
          <span v-if="item.name == '待复查'">
                    ({{countMap.TODO}})
                  </span>
          <span v-if="item.name == '已复查'">
                    ({{countMap.END}})
                  </span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div>
      <el-input :placeholder="placeholder" class="w200 mr20 seekIpt"
                v-model="searchMap.entityName" @keyup.enter.native="getPageData">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <el-select @change="getPageData" collapse-tags multiple v-model="searchMap.entityType"
                 class="w200 mr20" placeholder="主体类型(全部)">
        <el-option
          v-for="item in entityTypeSelectdata"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <select-area-grid v-model="selectAreaGridData" class="w150" style="margin-right: 20px;"
                        placeholder="辖区机构(全部)" @change="selectAreaGrid"></select-area-grid>
      <select-dept-grid-all v-if="mess.type != 'not'" class=" w150" placeholder="复查部门(全部)"
                        @change="selectAreaDeptGrid" style="margin-right: 20px;"></select-dept-grid-all>
      <el-select @change="getPageData" collapse-tags multiple v-model="searchMap.result"
                 class="w200 mr20" placeholder="复查结果(全部)" v-if="mess.type == 'ok'">
        <el-option
          v-for="item in resultSelectdata"
          :key="item.key"
          :label="item.name"
          :value="item.key">
        </el-option>
      </el-select>
      <el-select @change="getPageData" collapse-tags multiple v-model="searchMap.treat"
                 class="w200 mr20" placeholder="处理方式(全部)" v-if="mess.type == 'ok'">
        <el-option
          v-for="item in treatSelectdata"
          :key="item.key"
          :label="item.name"
          :value="item.key">
        </el-option>
      </el-select>
      <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox"
         v-if="mess.type == 'ok'"></i>
      <div class="downsele" v-if="down && mess.type == 'ok'">
        <el-date-picker value-format="yyyy-MM-dd" @change="getPageData"
                        v-model="searchMap.startDate" class="sle w140" type="date"
                        placeholder="起始日期" :picker-options="startDate"></el-date-picker>
        至
        <el-date-picker value-format="yyyy-MM-dd" @change="getPageData"
                        v-model="searchMap.endDate" class="sle w140" type="date" placeholder="截止日期"
                        :picker-options="endDate"></el-date-picker>
      </div>
      <div style="display: inline-block;" v-if="mess.type == 'not'">
        <el-date-picker value-format="yyyy-MM-dd" @change="getPageData"
                        v-model="searchMap.startDate" class="sle w140" type="date"
                        placeholder="起始日期" :picker-options="startDate"></el-date-picker>
        至
        <el-date-picker value-format="yyyy-MM-dd" @change="getPageData"
                        v-model="searchMap.endDate" class="sle w140" type="date" placeholder="截止日期"
                        :picker-options="endDate"></el-date-picker>
      </div>
    </div>
    <div :class="down?'tabOffTop145':'tabOffTop170'">
      <el-table v-loading="loading_table" element-loading-text="数据正在努力加载中" :border="true" key='ok'
                :resizable="true" @sort-change="sortChange" :data="dataPage" class="table-div"
                v-if="mess.type == 'not'">
        <el-table-column show-overflow-tooltip min-width='50' type="index" label="序号">
          <!-- <template slot-scope="scope">
              {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
          </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width='80' label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width='80' label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="80"
                         label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" min-width="80"
                         label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceTypeStr" min-width="80"
                         label="关联来源"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceResult" min-width="80"
                         label="巡查结果"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceRemark" min-width="80" label="处理备注">
          <template slot-scope="scope">
            <span
              v-if="scope.row.sourceRemark === '' || scope.row.sourceRemark === undefined">无备注</span>
            <span v-else>{{scope.row.sourceRemark}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceTime" min-width="80" label="巡查时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceRectifyTime" sortable="custom" min-width="80"
                         label="整改截止日期">
          <template slot-scope="scope">
            <span :class="{red : isDate(scope.row.sourceRectifyTime) }">{{scope.row.sourceRectifyTime}}</span>
            <!-- Date.parse(scope.row.rectifyTime) < Date.parse(new Date()) -->
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" min-width="100">
          <template slot-scope="scope">
            <a href="javascript:;" @click="toSource(scope.row, scope.row.sourceTypeStr,'TODO')"
               style="font-size: 12px;color: #1787AD;">巡查详情</a>
            <a @click="goAdd(scope.row);" v-auth="'cosmetic.repatrol.record|func.add'" href="javascript:;"
               style="font-size: 12px;color: #1787AD;">复查</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-loading="loading_table" element-loading-text="数据正在努力加载中" :border="true" key='not'
                :resizable="true" @sort-change="sortChange" :data="dataPage" class="table-div" v-else>
        <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号">
          <!-- <template slot-scope="scope">
              {{(pageObj.pageSize * (pageObj.pageNumber - 1) + scope.$index + 1)}}
          </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="80" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="repatrolRecordNo"
                         label="复查记录编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" min-width="80" label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptCode" min-width="80" label="复查部门"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" min-width="80" width="80"
                         label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="result" min-width="80"
                         label="复查结果"></el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" min-width="80" label="复查备注">
          <template slot-scope="scope">
            <span v-if="scope.row.remark === '' || scope.row.remark === undefined">无备注</span>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treat" min-width="80"
                         label="处理方式"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="sourceTime" label="巡查日期"></el-table-column> -->
        <el-table-column show-overflow-tooltip prop="repatrolTime" sortable="custom" min-width="80"
                         label="复查日期"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作" min-width="100">
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row,'END')"
               style="font-size: 12px;color: #1787AD;">复查详情</a>
            <a href="javascript:;" @click="printRecord(scope.row, true)"
               style="font-size: 12px;color: #1787AD;">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row, false)"
               style="font-size: 12px;color: #1787AD;">打印</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="this.searchMap.pageNum"
                       :page-sizes="[10, 20, 30, 40,50]"
                       :page-size="this.searchMap.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="this.total"
                       @size-change="pageSizeChange"
                       @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>

    <PrintPatrol ref="PrintPatrol"
                 :basicInfoData="basicInfoData"
                 :messengers="messengers"
                 :patrolData="patrolData"
                 :patrolContent="patrolContent"
                 :resultData="resultData"
                 :patrolType="'整改复查'"
                 :qrcodeId="qrcodeId"
    ></PrintPatrol>
  </div>
</template>

<script>
  import * as api from "api/cosmetics/patrolPlan";
  import {
    getAreaCode,
    getResultList,
    getTreatList,
  } from "api/medi/patrol/repatrol.js";
  import SelectAreaGrid from "components/common/SelectAreaGrid.vue"
  import SelectDeptGridAll from 'components/common/SelectDeptGridAll.vue';
  // 打印
  import {doPrintRecord} from 'utils/print/doPrint.js';
  import PrintPatrol from './PrintPatrol.vue';
  import {listFile} from "api/common";
  export default {
    methods: {

      // 切换导航样式
      choose(index, type) {
        this.mess.choose = index
        this.mess.type = type
        console.log(index + ":" + type)
        if (index === 0 && type === 'not') {
          this.searchMap.repatrolStatus = 'TODO'
          this.placeholder = '主体名称'
        } else if (index === 1 && type === 'ok') {
          this.searchMap.repatrolStatus = 'END'
          this.placeholder = '主体名称、编号'
        }
        this.searchMap.entityName = ''
        this.searchMap.entityType = []
        this.searchMap.areaCode = this.areaCode // 因为<select-area-grid>标签暂时没有提供清空功能,所以在表格跳转的时候沿用上一次的区域编码
        this.searchMap.deptCode = "" // 因为<select-area-grid>标签暂时没有提供清空功能,所以在表格跳转的时候沿用上一次的区域编码
        this.searchMap.result = []
        this.searchMap.treat = []
        this.searchMap.startDate = ''
        this.searchMap.endDate = ''
        this.searchMap.pageSize = 10
        this.searchMap.pageNum = 1
        this.total = 0
        this.searchMap.sort = ''
        // this.selectAreaGridData = []
        this.selectAreaGridData.splice(0, this.selectAreaGridData.length);
        this.selectAreaDeptData.splice(0, this.selectAreaDeptData.length);
        // this.areaArray.length = 0
        // this.areaArray.push(this.areaCode)
        this.dataPage = [] // 清空当前的数据,防止在加载数据过程总沿用上次的数据
        this.getPageData();
      },
      // 页数改变
      pagecCurrentChange(num) {
        this.searchMap.pageNum = num
        this.getPageData();
      },
      // 每页数量改变
      pageSizeChange(size) {
        this.searchMap.pageSize = size
        this.getPageData();
      },
      downSeleBox() {
        this.down = !this.down
      },
      getPageData() {
        this.loading_table = true;
        api.page(this.searchMap).then((response) => {
          // 数据装载
          this.dataPage = response.data.list
          this.total = response.data.total
          this.loading_table = false;
        })
      },
      sortChange() {
        // descending下降 ascending上升
        this.searchMap.sort = arguments[0].order
        this.getPageData()
      },
      selectAreaGrid(value) {
        if (value[value.length - 1]) {
          this.searchMap.areaCode = value[value.length - 1]
        } else {
          this.searchMap.areaCode = this.areaCode
        }
        this.getPageData()
      },
      selectAreaDeptGrid(deptId) {
        this.searchMap.deptCode = !deptId ? this.areaCode : deptId[deptId.length - 1];
        this.getPageData()
      },
      isDate(date) {
        var currDate = new Date();
        var strDate = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-"
          + currDate.getDate()
        // console.log(new Date(Date.parse(date) - 8*60*60*1000) + ":" + new Date(Date.parse(strDate)))
        if (Date.parse(new Date(Date.parse(date) - 8 * 60 * 60 * 1000)) < Date.parse(
          new Date(Date.parse(strDate)))) {
          return true
        } else {
          return false
        }
      },
      //跳转复查页面
      goAdd(row) {
        this.$router.push({
          name: 'cosmetics.RepatrolRecordAdd',
          query: {
            'repatrolRecordId': row.id,
            "messType": this.searchMap.repatrolStatus,
            'sourceType': row.sourceTypeStr
          }
        })
      },
      goDetail(row, t) {
        this.$router.push({
          name: 'cosmetics.RepatrolRecordInfo',
          query: {
          'repatrolRecordId': row.id,
          "messType": t, 
          'isList':'YES'
          }
        })
      },
      // 调整巡查详情页面
      toSource(row, type, t) {
        if (type === '日常巡查') {
          this.$router.push(
            {name: "dailyRecord.info", query: {recordId: row.sourceId, patrolType: "DAILY",patrolAreaCode:row.sourcePatrolDept}})
        } else if (type === '整改复查') {
          this.$router.push(
            {
              name: 'cosmetics.RepatrolRecordInfo', query: {
                'repatrolRecordId': row.id,
                'messType': t,
                'isList':'YES'
              }
            })
        } else {
          this.$router.push(
            {name: 'recordSpecial.info', query: {recordId: row.sourceId, patrolType: "SPECIAL",patrolAreaCode:row.sourcePatrolDept}})
        }
      },

      /* 打印 */
      async printInitData(row, type) {
        this.qrcodeId = row.id;
        let id = row.id;
        //基础信息请求参数
        await api.getBascInfo({'id': id}).then(d => {
          if (d.status && d.data) {
            let baseInfo;
            baseInfo = d.data[0];
            this.basicInfoData.entityName = baseInfo.entityName;
            this.basicInfoData.licenseNumber = baseInfo.backupNo;
            this.basicInfoData.spaceAddr = baseInfo.realAddress;
            this.basicInfoData.corpName = baseInfo.legalPerson;
            this.basicInfoData.mobile = baseInfo.corpMobile;
            this.basicInfoData.patrolTime = baseInfo.rePatrolTime;
            this.basicInfoData.patrolSoIdStr = baseInfo.supPerson;
            this.basicInfoData.areaCode = baseInfo.patrolDept;
            this.basicInfoData.deptName = baseInfo.deptName;
            this.resultData.recordNo = baseInfo.patrolRecordNo
            this.messengers = baseInfo.infoPerson;

          }
        })
        //巡查结果

        await api.getResultInfo({'id': id}).then(d => {
          if (d.status && d.data) {
            let resultInfo;
            resultInfo = d.data[0];
            this.resultData.planName = "复查整改";
            this.resultData.treat = resultInfo.treatStr;
            this.resultData.sign = resultInfo.signItem.length === 0 ? '' : resultInfo.signItem[0].fileId;
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
                  this.resultData.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1]
                    + "月" + rectifyTimeArr[2] + "日";
                }
              // }
            }
          }
        })

        //巡查项
        let obj = {
          'id': id,
          'queryType': 'DETAIL'
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
            this.patrolData = JSON.parse(JSON.stringify(this.patrolDataInit));
            this.patrolContent = JSON.parse(JSON.stringify(this.patrolContentInit));
            contentList.forEach(content => {
              if (content.important === '是') {
                this.patrolData.important++;
                if (content.isSuit === 'YES') {
                  this.patrolData.importantQual++;
                  this.patrolData.importantQualStr += content.contextNo + ", ";
                } else {
                  this.patrolData.importantNoQual++;
                  let contentItem = {};
                  contentItem.no = content.contextNo;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '') ? "无"
                    : content.remark;
                  this.patrolContent.important.push(contentItem);
                }
              } else {
                this.patrolData.normal++;
                if (content.isSuit === 'YES') {
                  this.patrolData.normalQual++;
                  this.patrolData.normalQualStr += content.contextNo + ", ";

                } else {
                  this.patrolData.normalNoQual++;
                  let contentItem = {};
                  contentItem.no = content.contextNo;
                  contentItem.context = content.context;
                  contentItem.remark = (content.remark === undefined || content.remark === '') ? "无"
                    : content.remark;
                  this.patrolContent.normal.push(contentItem);
                }
              }
            })
            if (this.patrolData.importantQualStr) {
              this.patrolData.importantQualStr = this.patrolData.importantQualStr.substr(
                0, this.patrolData.importantQualStr.length - 2);
            }
            this.patrolData.importantQualStr = this.patrolData.importantQualStr != ''
              ? this.patrolData.importantQualStr : "无";

            if (this.patrolData.normalQualStr) {
              this.patrolData.normalQualStr = this.patrolData.normalQualStr.substr(
                0, this.patrolData.normalQualStr.length - 2);
            }
            this.patrolData.normalQualStr = this.patrolData.normalQualStr != ''
              ? this.patrolData.normalQualStr : "无";
          }
        })
      },

      async printRecord(row, isPreview) {
        this.loading = true;
        await this.printInitData(row, "");
        this.$refs.PrintPatrol.printStyle();
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      }
    },
    mounted() {
      if (this.$route.query.type) {
        if (this.$route.query.type == 'TODO') {
          this.mess.type = 'not';
          this.mess.choose = 0;
        } else {
          this.mess.type = 'ok';
          this.mess.choose = 1;
        }
        this.searchMap.repatrolStatus = this.$route.query.type;
      }
      // 获取当前区域内的待复查记录和已复查记录数量
      api.countByStateAndAreaCode().then((response) => {
        this.countMap = response.data[0]
      })
      // 获取处理方式下拉列表
      getTreatList().then(r => {
        this.treatSelectdata = r.data
      })
      // 获取复查结果下拉列表
      getResultList().then(r => {
        this.resultSelectdata = r.data
      })
      getAreaCode().then(r => {
        this.searchMap.areaCode = r.data.areaCode
        // this.searchMap.deptCode = r.data.areaCode
        this.areaCode = r.data.areaCode
        this.getPageData()
      })

    },
    data() {
      return {
        placeholder: '主体名称',
        // 主体类型下拉框
        entityTypeSelectdata: [
          {
            code: 'COSMETIC_PRODUCT',
            name: '生产主体',
          }, {
            code: 'COSMETIC_MANAGER',
            name: '经营主体',
          },
          {
            code: 'COSMETIC_EMPLOY',
            name: '使用主体',
          }
        ],
        countMap: {
          END: '',
          TODO: ''
        },
        patternLis: [{
          name: '待复查',
          type: 'not'
        }, {
          name: '已复查',
          type: 'ok'
        }],
        mess: {
          choose: 0,
          type: 'not'
        },
        total: 0,
        dataPage: [],
        pageObj: null,
        // 当前登录区域编码
        areaCode: '',
        // 辖区区域(全部)
        /* areaArray: [],
        areaSelectdata: {
          props: {
            label: 'deptName',
            value: 'areaCode'
          },
          options: []
        }, */
        // 复查结果
        resultSelectdata: [],
        // 处理方式
        treatSelectdata: [],
        // 下拉框绑定属性
        selectmodel: null,
        // 下拉框内容
        // 收齐搜索框按钮
        down: true,
        date: null,
        // 查询条件
        searchMap: {
          repatrolStatus: 'TODO', // 默认设置待复查
          entityName: '', // 关键字
          entityType: [], // 主体类型
          areaCode: '', // 区域id
          deptCode: '',//复查部门
          result: [], // 处理结果
          treat: [], // 处理方式
          startDate: '', // 开始时间
          endDate: '', // 结束时间
          pageSize: 10,
          pageNum: 1,
          sort: '' // 排序规则
        },
        // 只要一个dataPage
        dataPage: [],
        // 辖区机构(全部)
        selectAreaGridData: [],
        selectAreaDeptData: [],
        //打印
        printShow: false,
        qrcodeId: "",
        type: "",
        deptName: "",
        basicInfoData: {areaCode: ''},
        messengers: "",

        patrolData: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContent: {
          normal: [],
          important: []
        },
        patrolDataInit: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInit: {
          normal: [],
          important: []
        },
        resultData: {},
        patrolRecordAddressIsShow: false,
        gross: 0,

        recordData: {
          serialNumber: 123456789,
        },
        loading: false,
        loading_table: false,
        endDate: {
          disabledDate: (time) => {
            let startDate = new Date(this.searchMap.startDate);
            if (this.searchMap.startDate) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        startDate: {
          disabledDate: (time) => {
            let endDate = new Date(this.searchMap.endDate);
            if (this.searchMap.endDate) {
              return time.getTime() > endDate;
            }
          }
        },
      }
    },
    components: {SelectAreaGrid, PrintPatrol, SelectDeptGridAll}
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 20px;
  }

  .tab-box .tabLi {
    width: 128px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }

  .tab-box .li-span {
    color: #393939;
  }

  .tab-box span:first-child {
    margin-right: 10px;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .down {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #C2CAD2;
    color: #A2AAB6;
    text-align: center;
    line-height: 32px;
    font-size: 18px;
  }

  .mr20 {
    margin-right: 20px;
  }

  .downsele {
    padding-left: 220px;
    margin-top: 20px;
  }

  .sle {
    margin: 0 12px;
  }

  .red {
    color: red !important;
  }
</style>
