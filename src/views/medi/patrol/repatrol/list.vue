<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="bigbox">
    <div class="page-tilt">
      <b></b><span>限期整改</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :key="index" :data-index="index" :class="index==mess.choose?'li-bott':''"
        @click="choose(index,item.type)">
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
      <el-input v-if="mess.type == 'not'" placeholder="主体名称" class="w200 mr20 seekIpt" v-model="searchMap.keysWord" @keyup.enter.native="seekEnter($event)">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <el-input v-if="mess.type == 'ok'" placeholder="主体名称、编号" class="w200 mr20 seekIpt" v-model="searchMap.keysWord" @keyup.enter.native="seekEnter($event)">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <el-select @change="entityChange" collapse-tags multiple v-model="searchMap.entityType" class="w200 mr20" placeholder="主体类型(全部)">
        <el-option v-for="item in entityTypeSelectdata" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <select-area-grid v-model="selectAreaGridData" class="w150" style="margin-right: 20px;" placeholder="辖区机构(全部)" @change="selectAreaGrid"></select-area-grid>
      <el-select @change="resultChange" collapse-tags multiple v-model="searchMap.result" class="w200 mr20" placeholder="复查结果(全部)"
        v-if="mess.type == 'ok'">
        <el-option v-for="item in resultSelectdata" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <el-select @change="treatChange" collapse-tags multiple v-model="searchMap.treat" class="w200 mr20" placeholder="处理方式(全部)"
        v-if="mess.type == 'ok'">
        <el-option v-for="item in treatSelectdata" :key="item.key" :label="item.name" :value="item.key">
        </el-option>
      </el-select>
      <i :class="down?'el-icon-caret-top':'el-icon-caret-bottom'" class="down" @click="downSeleBox" v-if="mess.type == 'ok'"></i>
      <div class="downsele" v-if="down && mess.type == 'ok'">
        <el-date-picker value-format="yyyy-MM-dd" @change="startTimeChange" v-model="searchMap.startTime" class="sle w140" type="date"
          placeholder="起始日期" :picker-options="startTime"></el-date-picker>
        至
        <el-date-picker value-format="yyyy-MM-dd" @change="endTimeChange" v-model="searchMap.endTime" class="sle w140" type="date"
          placeholder="截止日期" :picker-options="endTime"></el-date-picker>
      </div>
      <div style="display: inline-block;" v-if="mess.type == 'not'">
        <el-date-picker value-format="yyyy-MM-dd" @change="startTimeChange" v-model="searchMap.startTime" class="sle w140" type="date"
          placeholder="起始日期" :picker-options="startTime"></el-date-picker>
        至
        <el-date-picker value-format="yyyy-MM-dd" @change="endTimeChange" v-model="searchMap.endTime" class="sle w140" type="date"
          placeholder="截止日期" :picker-options="endTime"></el-date-picker>
      </div>
    </div>
    <div :class="down?'tabOffTop145':'tabOffTop170'">
      <el-table :border="true" :resizable="true" @sort-change="sortChange" :data="dataPage" class="table-div" :class="dataPage && mess.type == 'not'?'opct0':''">
        <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="repatrolRecordNo" label="复查记录编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" width="80" label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="result" width="80" label="复查结果"></el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="复查备注">
          <template slot-scope="scope">
            <span v-if="scope.row.remark === '' || scope.row.remark === undefined">无备注</span>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="treat" width="80" label="处理方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="repatrolTime" sortable="custom" label="复查日期"></el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="goDetail(scope.row.id)" style="font-size: 12px;color: #1787AD;">复查详情</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, true)" style="font-size: 12px;color: #1787AD;">打印预览</a>
            <a href="javascript:;" @click="printRecord(scope.row.id, false)" style="font-size: 12px;color: #1787AD;">打印</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :border="true" :resizable="true" @sort-change="sortChange" :data="dataPage" class="table-div" :class="dataPage && mess.type != 'not'?'opct0':''">
        <el-table-column show-overflow-tooltip min-width='50' type="index" label="序号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="deptName" label="辖区机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="corpName" width="80" label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" width="80" label="联系方式"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceType" width="80" label="关联来源"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceResult" width="80" label="巡查结果"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceRemark" label="处理备注">
          <template slot-scope="scope">
            <span v-if="scope.row.sourceRemark === '' || scope.row.sourceRemark === undefined">无备注</span>
            <span v-else>{{scope.row.sourceRemark}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceTime" label="巡查时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sourceRectifyTime" sortable="custom" label="整改截止日期">
          <template slot-scope="scope">
            <span :class="{red : isDate(scope.row.sourceRectifyTime) }">{{scope.row.sourceRectifyTime}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="toSource(scope.row.sourceId, scope.row.sourceType)" style="font-size: 12px;color: #1787AD;">巡查详情</a>
<!--            <a v-if="areaCode.length===10" @click="goAdd(scope.row.id);" v-auth="'medi.repatrol.record|func.add'" href="javascript:;"-->
            <a  @click="goAdd(scope.row.id);" v-auth="'medi.repatrol.record|func.add'" href="javascript:;"
              style="font-size: 12px;color: #1787AD;">复查</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
        </el-pagination>
      </div>
    </div>

    <PrintPatrol ref="PrintPatrol" :basicInfoData="basicInfoData" :messengers="messengers" :patrolData="patrolData" :patrolContent="patrolContent"
      :resultData="resultData" :patrolType="'整改复查'" :qrcodeId="qrcodeId"></PrintPatrol>
  </div>
</template>

<script>
  import {
    countByStateAndAreaCode,
    getAreaCode,
    getResultList,
    getTreatList,
    page
  } from "api/medi/patrol/repatrol.js";
  import { getSubTypeList } from "api/medi/patrol/planSpecial.js";
  import {
    getBasicInfo,
    getBasicInfoR,
    getRepatrolRecord,
    listRepatrolRecordContext
  } from "api/medi/patrol/repatrol";
  import SelectAreaGrid from "components/common/SelectAreaGrid.vue"

  import { doPrintRecord } from 'utils/print/doPrint.js';
  import PrintPatrol from '../record/PrintPatrol.vue';
  import { listFile } from "api/common";

  function getType(entityType) {
    let type;
    if (entityType === 'PRODUCT') {
      type = 'ENTITY'
    } else if (entityType === 'CIRCULATION') {
      type = 'ENTITY'
    } else if (entityType === 'RESTAURANT') {
      type = 'ENTITY'
    } else if (entityType === 'WORKSHOP') {
      type = 'CFDA'
    } else if (entityType === 'SALE') {
      type = 'CFDA'
    } else if (entityType === 'CFDARESTAURANT') {
      type = 'CFDA'
    } else if (entityType === 'VENDORS') {
      type = 'CFDA'
    }
    return type;
  }

  export default {
    methods: {

      // 切换导航样式
      choose(index, type) {
        this.mess.choose = index
        this.mess.type = type
        console.log(index + ":" + type)
        if (index === 0 && type === 'not') {
          this.searchMap.state = 'TODO'
        } else if (index === 1 && type === 'ok') {
          this.searchMap.state = 'END'
        }
        this.searchMap.keysWord = ''
        this.searchMap.entityType = []
        this.searchMap.areaCode = this.areaCode // 因为<select-area-grid>标签暂时没有提供清空功能,所以在表格跳转的时候沿用上一次的区域编码
        this.searchMap.result = []
        this.searchMap.treat = []
        this.searchMap.startTime = ''
        this.searchMap.endTime = ''
        this.searchMap.pageSize = this.page.pageSize
        this.searchMap.pageNum = this.page.pageNum
        this.searchMap.sort = undefined
        this.selectAreaGridData.splice(0, this.selectAreaGridData.length);
        this.dataPage = [] // 清空当前的数据,防止在加载数据过程总沿用上次的数据
        this.getPageData();
      },
      // 页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num
        this.searchMap.pageNum = num
        this.getPageData();
      },
      // 每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size
        this.searchMap.pageSize = size
        this.getPageData();
      },
      downSeleBox() {
        this.down = !this.down
      },
      getPageData() {
        this.loading = true;
        page(this.searchMap).then((response) => {
          this.loading = false;
          // 数据装载
          this.dataPage = response.data.list
          this.page.total = response.data.total
        })
      },
      entityChange() {
        this.getPageData()
      },
      resultChange() {
        this.getPageData()
      },
      treatChange() {
        this.getPageData()
      },
      startTimeChange() {
        this.getPageData()
      },
      endTimeChange() {
        this.getPageData()
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
      isDate(date) {
        var currDate = new Date();
        var strDate = currDate.getFullYear() + "-" + (currDate.getMonth() + 1) + "-"
          + currDate.getDate()
        if (Date.parse(new Date(Date.parse(date) - 8 * 60 * 60 * 1000)) < Date.parse(
          new Date(Date.parse(strDate)))) {
          return true
        } else {
          return false
        }
      },
      //跳转复查页面
      goAdd(repatrolRecordId) {
        this.$router.push({
          name: 'mediRepatrolRecordAd',
          params: { 'curd': 'add', 'repatrolRecordId': repatrolRecordId }
        })
      },
      goDetail(repatrolRecordId) {
        this.$router.push({
          name: 'mediRepatrolRecordAd',
          params: { 'curd': 'detail', 'repatrolRecordId': repatrolRecordId }
        })
      },
      // 调整巡查详情页面
      toSource(id, type) {
        if (type === '日常巡查') {
          this.$router.push(
            { name: "mediPatrolRecordDetail", query: { recordId: id, patrolType: "DAILY" } })
        } else if (type === '整改复查') {
          this.$router.push(
            { name: 'mediRepatrolRecordAd', params: { 'curd': 'detail', 'repatrolRecordId': id } })
        } else {
          this.$router.push(
            { name: 'mediPatrol.record.detail', query: { recordId: id, patrolType: "SPECIAL" } })
        }
      },

      /* 打印 */
      async printInitData(id, type) {
        this.qrcodeId = id;

        await getRepatrolRecord(id).then((result) => {
          if (result && result.status) {
            this.type = getType(result.data.entityType);
            this.resultData = result.data;
            if (!this.resultData.planName) {
              this.resultData.planName = "复查整改";
            }
            this.resultData.recordNo = this.resultData.repatrolRecordNo;
            if (this.resultData.rectifyTime) {
              if (this.resultData.rectifyTime.indexOf(" ") > 0) {
                let rectifyTimeStr = this.resultData.rectifyTime.split(' ')[0];
                let rectifyTimeArr = [];
                if (rectifyTimeStr.indexOf("-") > 0) {
                  rectifyTimeArr = rectifyTimeStr.split('-');
                } else if (rectifyTimeStr.indexOf("/") > 0) {
                  rectifyTimeArr = rectifyTimeStr.split('/');
                }
                if (rectifyTimeArr != []) {
                  this.resultData.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1] + "月"
                    + rectifyTimeArr[2] + "日";
                }
              }
            }
          }
        })

        await listFile(id).then(fileList => {
          fileList.data.forEach(file => {
            if (file.colu === 'SIGN') {
              this.resultData.sign = file.fileId;
            }
          })
        })

        await getBasicInfo(this.resultData.entityId, this.type, '').then((d) => {
          if (d && d.status) {
            this.basicInfoData.entityName = d.data.entity.entityName;
            this.basicInfoData.licenseNumber = d.data.entity.licenseNumber;
            this.basicInfoData.spaceAddr = d.data.entity.spaceAddr;
            this.basicInfoData.corpName = d.data.entity.corpName;
            this.basicInfoData.mobile = d.data.entity.mobile;
            // this.basicInfoData.patrolSoIdStr = d.data.entity.soUserName;
            this.basicInfoData.patrolTime = this.resultData.repatrolTime;
            // this.messengers = d.data.entity.infoAssiUserName;
            this.basicInfoData.areaCode = this.areaCode;
          }
        });
          await getBasicInfoR(id, 'REPATROL').then(d => {
          this.messengers = "";
          d.data.messengerList.forEach(messenger => {
            this.messengers += messenger.messengerStr + "、"
          })
          this.basicInfoData.patrolSoIdStr = d.data.patrolSoIdStr
          this.messengers = this.messengers.substr(0, this.messengers.length - 1);
        });

        await listRepatrolRecordContext(id, '').then(d => {
          this.patrolData = JSON.parse(JSON.stringify(this.patrolDataInit));
          this.patrolContent = JSON.parse(JSON.stringify(this.patrolContentInit));
          //this.patrolData = d.data;
          d.data.forEach(content => {
            if (content.important === 'YES') {
              this.patrolData.important++;
              if (content.initQual === 'YES') {
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
              if (content.initQual === 'YES') {
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
          this.patrolData.importantQualStr = this.patrolData.importantQualStr.substr(
            0, this.patrolData.importantQualStr.length - 2);
          this.patrolData.importantQualStr = this.patrolData.importantQualStr != ''
            ? this.patrolData.importantQualStr : "无";

          this.patrolData.normalQualStr = this.patrolData.normalQualStr.substr(
            0, this.patrolData.normalQualStr.length - 2);
          this.patrolData.normalQualStr = this.patrolData.normalQualStr != ''
            ? this.patrolData.normalQualStr : "无";
        });
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
      }
    },
    mounted() {
      this.loading = true;

      getAreaCode().then(r => {
        this.areaCode = r.data.areaCode;
      })

      // 获取当前区域内的待复查记录和已复查记录数量
      countByStateAndAreaCode(this.searchMap.areaCode).then((response) => {
        this.countMap = response.data
      })
      // 获取处理方式下拉列表
      getTreatList().then(r => {
        this.treatSelectdata = r.data
      })
      // 获取复查结果下拉列表
      getResultList().then(r => {
        this.resultSelectdata = r.data
      })
      // 获取主体类型下拉列表
      getSubTypeList().then(r => {
        this.entityTypeSelectdata = r.data
      })
      getAreaCode().then(r => {
        this.searchMap.areaCode = r.data.areaCode
        this.areaCode = r.data.areaCode
        this.getPageData()
      })

    },
    data() {
      return {
        areaCode:'',
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
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataPage: [],
        pageObj: null,
        // 当前登录区域编码
        areaCode: '',
        // 主体类型下拉框
        entityTypeSelectdata: [],
        // 复查结果
        resultSelectdata: [],
        // 处理方式
        treatSelectdata: [],
        // 下拉框绑定属性
        selectmodel: null,
        // 下拉框内容
        selectdata: [{
          value: '选项1',
          label: '黄金糕'
        }],
        // 收齐搜索框按钮
        down: true,
        date: null,
        // 查询条件
        searchMap: {
          state: 'TODO', // 默认设置待复查
          keysWord: '', // 关键字
          entityType: [], // 主体类型
          areaCode: '', // 区域id
          result: [], // 处理结果
          treat: [], // 处理方式
          startTime: undefined, // 开始时间
          endTime: undefined, // 结束时间
          pageSize: 10,
          pageNum: 1,
          sort: undefined // 排序规则
        },
        dataPage: [],
        // 辖区机构(全部)
        selectAreaGridData: [],

        //打印
        printShow: false,
        qrcodeId: "",
        type: "",
        deptName: "",
        basicInfoData: {
          areaCode:''
        },
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
        endTime: {
          disabledDate: (time) => {
            let startDate = new Date(this.searchMap.startTime);
            if (this.searchMap.startTime) {
              return time.getTime() < startDate - 8.64e7;
            }
          }
        },
        startTime: {
          disabledDate: (time) => {
            let endDate = new Date(this.searchMap.endTime);
            if (this.searchMap.endTime) {
              return time.getTime() > endDate;
            }
          }
        },
      }
    },
    components: { SelectAreaGrid, PrintPatrol }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    width: 100%;
    position: relative;
  }

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

  .opct0 {
    display: none;
  }

  .red {
    color: red !important;
  }
</style>
