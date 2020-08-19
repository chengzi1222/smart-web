<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>食安指数考核</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternList" :data-index="index" :key="index" :class="index==chosenIndex?'li-bott':''" @click="choose(index,item.key)">
        <div :data-index='index'>{{item.type}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="dateBox">
      <el-date-picker v-model="seldate" type="month" class="w120" @change="changeMonth" :picker-options="optionsDate" placeholder="选择月份">
      </el-date-picker>
    </div>
    <toggle-form title="食安指数考核">
      <div class="dataBox">
        <div class="dining" v-if="type === 'XCWS'">
          <div>
            <h3>{{dataList.mi != null ? Number(dataList.mi*100).toFixed(1)+'%' : '-'}}</h3>
            <p>晨检使用率</p>
          </div>
          <div>
            <h3>{{dataList.cad != null ? Number(dataList.cad*100).toFixed(1)+'%' : '-'}}</h3>
            <p>清洗消毒使用率</p>
          </div>
          <div>
            <h3>{{dataList.fs != null ? Number(dataList.fs*100).toFixed(1)+'%' : '-'}}</h3>
            <p>食品留样使用率</p>
          </div>
          <div>
            <h3>{{dataList.kw != null ? Number(dataList.kw*100).toFixed(1)+'%' : '-'}}</h3>
            <p>餐厨垃圾使用率</p>
          </div>
          <div>
            <h3>{{dataList.dr != null ? Number(dataList.dr*100).toFixed(1)+'%' : '-'}}</h3>
            <p>每日菜谱使用率</p>
          </div>
          <div class="riBorder">
            <h3>{{dataList.pam != null ? Number(dataList.pam*100).toFixed(1)+'%' : '-'}}</h3>
            <p>陪餐使用率</p>
          </div>
          <div class="box-left">
            <h3>{{entitySum}}</h3>
            <p>考核主体总数</p>
          </div>
          <div>
            <h3>{{dataList.quaEntity !=null ? dataList.quaEntity : '-'}}</h3>
            <p>合格主体</p>
          </div>
          <div>
            <h3>{{dataList.unQuaEntity !=null ? dataList.unQuaEntity : '-'}}</h3>
            <p>不合格主体</p>
          </div>
        </div>
        <div class="dining" v-else>
          <div class="riBorder">
            <h3><p class="desc"></p>{{dataList.ai != null ? Number(dataList.ai*100).toFixed(1)+'%' : '-'}}</h3>
            <p>AI预警使用率</p>
          </div>
          <div class="box-left">
            <h3>{{entitySum}}</h3>
            <p>考核主体总数</p>
          </div>
          <div>
            <h3>{{dataList.quaEntity !=null ? dataList.quaEntity : '-'}}</h3>
            <p>合格主体</p>
          </div>
          <div>
            <h3>{{dataList.unQuaEntity !=null ? dataList.unQuaEntity : '-'}}</h3>
            <p>不合格主体</p>
          </div>
        </div>
      </div>
    </toggle-form>

    <toggle-form :title="titleName">
      <div v-if="areaCode.length == 6" class="mt20" style="height: 34px;">
        <select-dept-grid class="selectHeight" style="overflow: visible;margin-left: 0 !important" placeholder="请选择街道" @change="areaChange" ref="select"></select-dept-grid>
        <el-button v-if="type === 'XCWS'" @click="configAssess" class="ml20 fr" type="primary">配置考核主体</el-button>
        <el-button class="fr" type="primary" @click="configRate(type)">配置使用率标准值</el-button>
      </div>
      <div v-else class="mt20">
        <el-input placeholder="请输入主体名称" class="w260 seekIpt" v-model="entityName" @keyup.enter.native="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <el-select class="ml20" v-model="assessVal" placeholder="请选择考核结果" @change='assessValSel' clearable>
          <el-option v-for="item in assessOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>

      <el-dialog v-if="isRateConfigShow" :title="configTitle" :visible.sync="isRateConfigShow" :append-to-body="true">
        <div class="tips">提示：标准值配置后按月度生效。即本月数据将按此标准值计算，并于下月1号展示。</div>
        <el-table v-loading="rateConfigLoading" element-loading-text="数据正在努力加载中" :border="true" :data="xcwsConfigData" class="table-div mt20">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="moduleType" min-width="200" label="异常类型">
            <template slot-scope="scope">
                <span>{{type==='XCWS'?xcwsWarnTypes[scope.row.moduleType]:AIWarnTypes[scope.row.moduleType]}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="standardValue" min-width="200" label="标准值">
            <template slot-scope="scope">
              <el-input v-if="scope.row.isEditing" v-model="scope.row.standardValue" placeholder="请输入标准值" maxlength="20" class="w100" @keyup.native="proving(scope.row)"></el-input>
              <span v-if="!scope.row.isEditing">
                {{scope.row.standardValue}}
              </span>
              <span v-if="scope.row.moduleType !== 'KITCHEN_WASTE'">%</span>
              <span v-else>次</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
              <template slot-scope="scope">
                  <a href="javascript:;" class="operate-a" v-if="scope.row.isEditing"
                      @click="operate('confirm',scope.row)">保存</a>
                  <a href="javascript:;" class="operate-a" v-else
                      @click="operate('edit',scope.row)">编辑</a>
              </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <div style="position: relative;">
        <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
          <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
        </div>
        <!-- 区级账号列表 -->
        <div v-if="areaCode.length === 6">
          <el-table v-if="type==='XCWS'" :data="dataPage" class="table-div etable">
            <el-table-column show-overflow-tooltip min-width="80" type="index" label="序号">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="180" label="街道名称">
              <template slot-scope="scope">
                <span>{{scope.row.streetName ? scope.row.streetName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="排名">
              <template slot-scope="scope">
                <span>{{scope.row.rank ? scope.row.rank : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="晨检">
              <template slot-scope="scope">
                <span>{{scope.row.mi != null ? Number(scope.row.mi*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="清洗消毒">
              <template slot-scope="scope">
                <span>{{scope.row.cad != null ? Number(scope.row.cad*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="食品留样">
              <template slot-scope="scope">
                <span>{{scope.row.fs != null ? Number(scope.row.fs*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="餐厨垃圾">
              <template slot-scope="scope">
                <span>{{scope.row.kw != null ? Number(scope.row.kw*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="每日菜谱">
              <template slot-scope="scope">
                <span>{{scope.row.dr != null ? Number(scope.row.dr*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="陪餐">
              <template slot-scope="scope">
                <span>{{scope.row.pam != null ? Number(scope.row.pam*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="合格主体">
              <template slot-scope="scope">
                <span>{{scope.row.quaEntity !=null ? scope.row.quaEntity : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="不合格主体">
              <template slot-scope="scope">
                <span>{{scope.row.unQuaEntity !=null ? scope.row.unQuaEntity : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="80" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" @click="goDetail(scope.row)">详情</a>
              </template>
            </el-table-column>
          </el-table>

          <el-table v-else :data="dataPage" class="table-div etable">
            <el-table-column show-overflow-tooltip min-width="80" type="index" label="序号">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="180" label="街道名称">
              <template slot-scope="scope">
                <span>{{scope.row.streetName ? scope.row.streetName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="排名">
              <template slot-scope="scope">
                <span>{{scope.row.rank ? scope.row.rank : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="AI预警">
              <template slot-scope="scope">
                <span>{{scope.row.ai != null ? Number(scope.row.ai*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="合格主体">
              <template slot-scope="scope">
                <span>{{scope.row.quaEntity !=null ? scope.row.quaEntity : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="不合格主体">
              <template slot-scope="scope">
                <span>{{scope.row.unQuaEntity !=null ? scope.row.unQuaEntity : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="80" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" @click="goDetail(scope.row)">详情</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 街道账号列表 -->
        <div v-else>
          <el-table :data="dataPage" class="table-div etable">
            <el-table-column show-overflow-tooltip min-width="80" type="index" label="序号">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="主体名称">
              <template slot-scope="scope">
                <span>{{scope.row.entityName ? scope.row.entityName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="排名">
              <template slot-scope="scope">
                <span>{{scope.row.rank ? scope.row.rank : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="晨检">
              <template slot-scope="scope">
                <span>{{scope.row.mi != null ? Number(scope.row.mi*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="清洗消毒">
              <template slot-scope="scope">
                <span>{{scope.row.cad != null ? Number(scope.row.cad*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="食品留样">
              <template slot-scope="scope">
                <span>{{scope.row.fs != null ? Number(scope.row.fs*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="餐厨垃圾">
              <template slot-scope="scope">
                <span>{{scope.row.kw != null ? Number(scope.row.kw*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="每日菜谱">
              <template slot-scope="scope">
                <span>{{scope.row.dr != null ? Number(scope.row.dr*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='XCWS'" show-overflow-tooltip min-width="80" label="陪餐">
              <template slot-scope="scope">
                <span>{{scope.row.pam != null ? Number(scope.row.pam*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="type==='AI'" show-overflow-tooltip min-width="80" label="AI预警">
              <template slot-scope="scope">
                <span>{{scope.row.ai != null ? Number(scope.row.ai*100).toFixed(1)+'%' : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="考核结果">
              <template slot-scope="scope">
                <span>{{resultOpt[scope.row.result]? resultOpt[scope.row.result] : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="80" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" class="operate-a" @click="goDetail(scope.row)">详情</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
          </el-pagination>
        </div>
      </div>

      <el-dialog v-if="isDialogShow" title="配置考核主体" :visible.sync="isDialogShow" :close-on-click-modal="false" :modal-append-to-body='false'>
        <div style="position: relative;">
          <div>
            <el-input placeholder="请输入主体名称" class="w200 seekIpt" v-model="dialogEntityName" @keyup.enter.native="searchDialog">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchDialog"></i>
            </el-input>
            <el-select class="ml20" v-model="scType" placeholder="请选择办学性质" @change='searchDialog' clearable>
              <el-option v-for="item in scTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select class="ml20" v-model="buyerType" placeholder="请选择学校类型" @change='searchDialog' clearable>
              <el-option v-for="item in buyerTypeOptions" :key="item.key" :label="item.name" :value="item.key">
              </el-option>
            </el-select>
            <select-dept-grid class="selectHeight" style="overflow: visible" placeholder="请选择街道" ref="dialogSelect" @change="dialogAreaChange"></select-dept-grid>
          </div>
          <div class="mt20" style="text-align: center;">
            <span>申请日期：</span>
            <el-date-picker value-format="yyyy-MM-dd" @change="searchDialog"
                            v-model="dialogDate.startDate" class="w140 ml20" type="date"
                            placeholder="起始创建日期" :picker-options="dialogDate.beforeDate"></el-date-picker>
            至
            <el-date-picker value-format="yyyy-MM-dd" @change="searchDialog"
                            v-model="dialogDate.endDate" class="w140" type="date" placeholder="截止创建日期"
                            :picker-options="dialogDate.afterDate"></el-date-picker>
          </div>
          <ul class="tab-box" style="padding-left:0;">
            <li class="tabLi" v-for="(item,index) in dialogPatternList" :data-index="index" :key="index" :class="index==dialogChosenIndex?'li-bott':''" @click="dialogChoose(index,item.key)">
              <div :data-index='index'>{{item.type}}</div>
            </li>
            <li class="tab-bott"></li>
          </ul>
          <el-button v-if="dialogQuery.type === 'exclude'" class="mt20" type="primary" @click="submitInclude">批量纳入考核</el-button>
          <el-button v-else class="mt20" type="primary" @click="submitExclude">批量取消纳入考核</el-button>
          <div v-if="dialogLoading" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
            <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
          </div>
          <el-table :data="dialogData" @selection-change="SelectionChange" class="table-div etable">
            <el-table-column min-width="80" type="selection" label="">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="主体名称">
              <template slot-scope="scope">
                <span>{{scope.row.buyerName ? scope.row.buyerName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="所属街道">
              <template slot-scope="scope">
                <span>{{scope.row.streetName ? scope.row.streetName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="许可备案号">
              <template slot-scope="scope">
                <span>{{scope.row.license ? scope.row.license : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="社会信用代码">
              <template slot-scope="scope">
                <span>{{scope.row.creditCode ? scope.row.creditCode : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="联系方式">
              <template slot-scope="scope">
                <span>{{scope.row.tel ? scope.row.tel : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="学校类型">
              <template slot-scope="scope">
                <span>{{scope.row.buyerTypeStr ? scope.row.buyerTypeStr : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" label="创建日期">
              <template slot-scope="scope">
                <span>{{scope.row.registTime ? scope.row.registTime : '-'}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box">
            <el-pagination background :current-page="dialogPage.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="dialogPage.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="dialogPage.total" @size-change="dialogPageSizeChange" @current-change="dialogPageCurrentChange">
            </el-pagination>
          </div>
        </div>
      </el-dialog>
    </toggle-form>
  </div>
</template>

<script>
  import * as api from "api/trace/foodAssess"
  import { getEnums } from 'api/common.js';
  import ToggleForm from 'components/ToggleForm'
  import SelectDeptGrid from "components/common/SelectDeptGrid.vue";
  export default {
    computed: {
      month() {
        let date = new Date(this.seldate);
        let mon = '';
        if((date.getMonth() + 1) < 10) {
          mon = '0' + (date.getMonth() + 1)
        } else {
          mon = (date.getMonth() + 1)
        }
        return date.getFullYear() + '-' + mon;
      },
      configTitle() {
        return this.type === 'XCWS' ? '校餐卫士使用率标准值配置' : 'AI预警使用率标准值配置'; 
      },
      entitySum() {
        let sum = parseInt(this.dataList.quaEntity) + parseInt(this.dataList.unQuaEntity);
        return sum ? sum : '-';
      }
    },
    methods: {
      //切换导航样式
      choose(index, key) {
        this.chosenIndex = index;
        this.type = key;
        this.seldate = new Date().getFullYear() + '-' + new Date().getMonth();
        this.streetCode = "";
        if(this.areaCode.length == 6) {
          this.$refs.select.$refs.cascader.$refs.panel.clearCheckedNodes();
        }
        this.page.pageNum = 1;
        this.page.pageSize = 10;
        this.getPageData();
      },
      areaChange(val) {
        if (!val || val.length == 0) {
          this.streetCode = "";
        } else {
          this.streetCode = val[val.length - 1];
        }
        this.page.pageNum = 1;
        this.getPageData();
      },
      assessValSel(val) {
        this.page.pageNum = 1;
        this.getPageData();
      },
      //请求数据
      async getPageData() {
        if(this.areaCode.length == 6) { // 区级账号
          this.lodings = true;
          let queryParams = {
            areaCode: this.areaCode,
            month: this.month
          }
          let res = this.type==='XCWS' ? 
                        await api.getXcwsAreaUsage(queryParams) :
                        await api.getAIAreaUsage(queryParams)
          if(res.status) {
            this.dataList = res.data ? res.data : {};
          }

          let streetQueryParams = {
            streetCode: this.streetCode,
            areaCode: this.areaCode,
            month: this.month,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize
          }
          let listRes = this.type==='XCWS' ? 
                        await api.getXcwsStreetUsage(streetQueryParams) :
                        await api.getAIStreetUsage(streetQueryParams)
          if(listRes.status) {
            this.dataPage = listRes.data ? listRes.data.records : [];
            this.page.total = listRes.data ? listRes.data.total : 0;
          }
          this.lodings = false;
        } else { // 街道账号
          this.lodings = true;
          let streetQueryParams = {
            areaCode: this.areaCode.substr(0,6),
            month: this.month,
            streetCode: this.areaCode,
          }
          let res = this.type==='XCWS' ?
                    await api.getXcwsStreetUsage(streetQueryParams) :
                    await api.getAIStreetUsage(streetQueryParams)
          if(res.status) {
            this.dataList = res.data && res.data.records.length > 0 ? res.data.records[0] : {};
          }

          let entityQueryParams = {
            entityName: this.entityName,
            areaCode: this.areaCode,
            month: this.month,
            pageNum: this.page.pageNum,
            pageSize: this.page.pageSize,
            result: this.assessVal
          }
          let listRes = this.type==='XCWS' ?
                        await api.getXcwsEntityUsage(entityQueryParams) :
                        await api.getAIEntityUsage(entityQueryParams)
          if(listRes.status) {
            this.dataPage = listRes.data ? listRes.data.records : [];
            this.page.total = listRes.data ? listRes.data.total : 0;
          }
          this.lodings = false;
        }
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getPageData();
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getPageData();
      },
      changeMonth() {
        this.page.pageNum = 1;
        this.getPageData();
      },
      //搜索框搜索
      search() {
        this.page.pageNum = 1;
        this.getPageData();
      },
      // 详情
      goDetail(row) {
        if(this.areaCode.length === 6) { 
          // 区级账号，详情跳转到对应街道下的主体列表
          this.$router.push({
            path: '/yb/foodAssess/list',
            query: {
              areaCode: row.streetCode,
              date: new Date(this.seldate).getFullYear() + '-' + (new Date(this.seldate).getMonth() + 1),
              type: this.type
            }
          })
        } else {
          // 街道账号，详情跳转到主体对应的预警详情页面
          let path = this.type === 'XCWS' ? '/xcwsWarn/kitchen/detail' : '/xcwsWarn/AIWarnList/detail'
          this.$router.push({
            path: path,
            query: {
              entityId: row.entityId
            }
          })
        }
      },
      proving(row) {
        row.standardValue = row.standardValue.toString().replace(/[^\.\d]/g,'');
        row.standardValue = row.standardValue.toString().replace('.','');
      },
      async configRate(type) {
        this.isRateConfigShow = true;
        this.rateConfigLoading = true;
        this.hasRowEdit = false;

        let res = await api.getStandardConfig({areaCode: this.areaCode})
        if(res.status) {
            let data = res.data;
            let warningTypeData = [];
            let that = this;

            Object.keys(type==='XCWS' ? that.xcwsWarnTypes : that.AIWarnTypes).forEach(function(key) {
              warningTypeData.push({
                moduleType: key,
                standardValue: key=='KITCHEN_WASTE' ? '3' : '50',
                isEditing: false
              });
            });

            for(let i = 0; i < warningTypeData.length; i++) {
              for(let j = 0; j < data.length; j++) {
                if(warningTypeData[i].moduleType === data[j].moduleType) {
                  if(data[j].moduleType !== 'KITCHEN_WASTE') {
                    data[j].standardValue = Math.ceil(data[j].standardValue*1000)/10;
                  } else {
                    data[j].standardValue = Math.ceil(data[j].standardValue*10)/10;
                  }
                  warningTypeData[i] = Object.assign({}, warningTypeData[i], data[j]);
                }
              }
              warningTypeData[i].isEditing = false;
            }
            this.xcwsConfigData = warningTypeData;
          }
          this.rateConfigLoading = false;
      },
      operate(type, row) {
        if(type === 'confirm') {
          if(row.moduleType != 'KITCHEN_WASTE') { // 百分比标准值
            let standardValue = Math.ceil(row.standardValue);
            if(standardValue<1 || standardValue>100) {
              this.$message.warning("标准值百分比只能在1%-100%之间");
              return;
            }
          }
          let queryParams = {
            areaCode: this.areaCode,
            moduleType: row.moduleType,
            standardValue: row.moduleType != 'KITCHEN_WASTE' ? row.standardValue/100 : row.standardValue, 
            id: row.id ? row.id : ''
          }
          api.updateStandardConfig(queryParams).then(res => {
            if(res.status) {
              this.$message.success('保存成功');
              row.isEditing = false;
              this.hasRowEdit = false;
            } else {
              this.$message.warning(res.message);
            }
          })
        } else {
          if(this.hasRowEdit) {
            this.$message.warning("请先确定编辑中的配置");
            return;
          }
          row.isEditing = true;
          this.hasRowEdit = true;
        }
      },
      // 配置考核主体
      configAssess() {
        this.isDialogShow = true;
        this.dialogPatternList = new Array();
        this.dialogPatternList.push({
          type: '未纳入考核学校',
          key: 'exclude'
        });
        this.dialogPatternList.push({
          type: '已纳入考核学校',
          key: 'include'
        });
        this.dialogQuery.type = this.dialogPatternList[0].key
        this.buyerType = '';
        this.dialogEntityName = '';
        this.dialogPage.pageNum = 1;
        this.dialogPage.pageSize = 10;
        this.scType = '';
        this.dialogStreetCode = '';
        this.dialogDate.startDate = '';
        this.dialogDate.endDate = '';
        getEnums(['com.ybveg.govx.enums.food.licaibao.BuyerTypeEnum'],false).then((r) => {
          this.buyerTypeOptions = r.data
        });
        this.getDialogData();
      },
      SelectionChange(val) {
        this.selection = val;
      },
      searchDialog() {
        this.dialogPage.pageNum = 1;
        this.getDialogData();
      },
      dialogAreaChange(val) {
        if (!val || val.length == 0) {
          this.dialogStreetCode = "";
        } else {
          this.dialogStreetCode = val[val.length - 1];
        }
        this.dialogPage.pageNum = 1;
        this.getDialogData();
      },
      dialogChoose(index, key) {
        this.dialogChosenIndex = index;
        this.dialogQuery.type = key;
        this.buyerType = '';
        this.dialogEntityName = '';
        this.dialogPage.pageNum = 1;
        this.dialogPage.pageSize = 10;
        this.scType = '';
        this.dialogStreetCode = '';
        this.$refs.dialogSelect.$refs.cascader.$refs.panel.clearCheckedNodes();
        this.dialogDate.startDate = '';
        this.dialogDate.endDate = '';
        this.getDialogData();
      },
      async getDialogData() {
        this.dialogLoading = true;
        let queryParams = {
          areaCode: this.areaCode,
          buyerType: this.buyerType,
          entityName: this.dialogEntityName,
          pageNum: this.dialogPage.pageNum,
          pageSize: this.dialogPage.pageSize,
          scType: this.scType,
          streetCode: this.dialogStreetCode,
          startDate: this.dialogDate.startDate,
          endDate: this.dialogDate.endDate,
          includeCheck: this.dialogQuery.type === 'exclude' ? 'NO' : 'YES'
        }
        let res = await api.getConfigList(queryParams)
        if(res.status) {
          this.dialogData = res.data ? res.data.records : [];
          this.dialogPage.total = res.data ? res.data.total : 0;
        }
        this.dialogLoading = false;
      },
      dialogPageSizeChange(size) {
        this.dialogPage.pageSize = size;
        this.getDialogData();
      },
      dialogPageCurrentChange(num) {
        this.dialogPage.pageNum = num;
        this.getDialogData();
      },
      // 批量纳入考核
      async submitInclude() {
        if(this.selection.length==0) {
          this.$message.warning('请先勾选需要纳入考核的主体')
          return
        } else {
          let ids = []
          this.selection.forEach(item => {
            ids.push(item.entityId)
          })
          let res = await api.saveInclude(ids)
          if(res.status) {
            this.$message.success('纳入考核成功')
            this.getDialogData()
          }
        }
      },
      // 批量不纳入考核
      async submitExclude() {
        if(this.selection.length==0) {
          this.$message.warning('请先勾选需要取消纳入考核的主体')
          return
        } else {
          this.$confirm('取消纳入考核的主体本月不再进行考核，是否确定？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = []
            this.selection.forEach(item => {
              ids.push(item.entityId)
            })
            api.saveExclude(ids).then(res => {
              if(res.status) {
                this.$message.success('取消纳入考核成功')
                this.getDialogData()
              }
            })
            document.getElementsByClassName('v-modal')[0].setAttribute('style', 'display:none;');
          }).catch(() => {
            document.getElementsByClassName('v-modal')[0].setAttribute('style', 'display:none;');
          });
        }
      }
    },
    async mounted() {
      this.patternList = new Array();
      this.patternList.push({
        type: '校餐卫士使用率考核',
        key: 'XCWS'
      });
      this.patternList.push({
        type: 'AI预警处理考核',
        key: 'AI'
      });
      this.areaCode = this.$store.state.common.user.areaCode;
      this.titleName = this.areaCode.length===6 ? '街道使用情况' : '主体使用情况'
      this.type = this.patternList[0].key;
      await this.getPageData();
    },
    data() {
      return {
        titleName: '街道使用情况', 
        type: 'XCWS',
        areaCode: '',
        seldate: new Date().getFullYear() + '-' + new Date().getMonth(),
        optionsDate: {
          disabledDate: (time) => {
            let maxDateStr = new Date().getFullYear() + '-' + new Date().getMonth();
            return time.getTime() > new Date(maxDateStr).getTime() || time.getTime() < new Date('2018-01');
          }
        },
        patternList: [],
        chosenIndex: 0,
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataList: {},
        dataPage: [],
        lodings: true,
        entityName: '',
        assessVal: '',
        assessOptions: [{
          label: '合格',
          value: '1'
        }, {
          label: '不合格',
          value: '0'
        }],

        dialogData: [],
        isDialogShow: false,
        dialogLoading: false,
        dialogEntityName: '',
        dialogQuery: {},
        dialogPatternList: [],
        dialogChosenIndex: 0,
        streetCode: '',
        dialogStreetCode: '',
        buyerType: '',
        scType: '',
        buyerTypeOptions: [],
        scTypeOptions: [{
          label: '公立',
          value: 'PUBLIC'
        }, {
          label: '私立',
          value: 'PRIVATE'
        }],
        selection: [],
        dialogDate: {
          startDate: '',
          endDate: '',
          beforeDate: {
            disabledDate: (time) => {
              let endDate = new Date(this.dialogDate.endDate);
              if (this.dialogDate.endDate) {
                return time.getTime() > endDate;
              }
            }
          },
          afterDate: {
            disabledDate: (time) => {
              let startDate = new Date(this.dialogDate.startDate);
              if (this.dialogDate.startDate) {
                return time.getTime() < startDate - 8.64e7;
              }
            }
          }
        },
        dialogPage: {
          pageNum: 1,
          pageSize: 10,
          total: 0 
        },
        xcwsWarnTypes: {
          "MORNING_INSPECTION": "晨检公示", 
          "CLEANING_AND_DISINFECTION": "清洗消毒",
          "FOOD_SAMPLE": "食品留样",
          "KITCHEN_WASTE": "餐厨垃圾",
          "PRINCIPAL_ACCOMPANYING_MEAL": "校长陪餐",
          "DAILY_RECIPE": "每日菜谱"
        },
        AIWarnTypes: {
          "AI": "ai",
        },
        xcwsConfigData: [],
        isRateConfigShow: false,
        rateConfigLoading: false,
        hasRowEdit: false,
        resultOpt: {
          "1": "合格",
          "0": "不合格"
        }
      };
    },
    components: {
      ToggleForm,
      SelectDeptGrid
    }
  }
</script>

<style scoped lang="sass">
  .bigbox {
    position: relative;
    height: 100%;
  }

  .dateBox {
    position: absolute;
    top: 43px;
    right: 0;
    z-index: 666;
  }

  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }

  .tab-box .tabLi {
    width: 180px;
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

  .dataBox {
    display: flex;
    margin: 20px 0;
    justify-content: space-between;
  }

  .dataBox>div {
    height: 126px;
    text-align: center;
    border-left: 1px solid #C2CAD2;
    border-right: 1px solid #C2CAD2;
  }
  .dataBox>div>div {
    height: 126px;
    text-align: center;
    border-top: 1px solid #C2CAD2;
    border-bottom: 1px solid #C2CAD2;
  }

  .dataBox h3 {
    font-size: 28px;
    color: #3B3B3B;
    margin-top: 34px;
    line-height: 35px;
  }

  .dataBox p {
    font-size: 14px;
    color: #A2AAB6;
  }

  .dining {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .dining div {
    border: none;
    width: 33.33%;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .dining .riBorder {
    border-right: 1px solid #C2CAD2;
  }

  .etable tr td:first-child {
    text-align: left;
  }

  .el-dialog{
    width: 80% !important;
  }
  
  .dining .box-left {
    margin-left: 20px;
    border-left: 1px solid #C2CAD2;
  }
  .tips {
    padding-left: 20px;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: #F1822A;
    line-height: 40px;
    background-color: #FFF3E9;
    border: 1px solid #FFD6B6;
  }
</style>