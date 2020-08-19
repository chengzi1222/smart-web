<template>
<div>
    <div class="page-tilt">
      <b></b>
      <span>投诉反馈</span>
    </div>
  <div class="user-box">
    <ul class="tab-box">
      <li v-for="(item,index) in lists" @click="liClick(item.key)" :data-index='index' :class="item.key == defaultKey? 'li-bott':''" :key="item.key">
        <span @click="liClick(item.key)" :data-index='index'>{{item.value}}</span>
        <!-- <span v-if="item.key" style="margin-left:20px;">{{item.num}}</span> -->
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="mt20 mb20" style="line-height: 35px;">
      <el-input placeholder="投诉编号、投诉标题、投诉人、投诉人电话" class="w300 seekIpt selectHeight" v-model="condition.keysWork" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>
      <!--<enum-select v-model="condition.schoolType" placeholder="学校类型" enum="com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum"-->
                   <!--@change="searchTab" class="w200"></enum-select>-->
      <!--<enum-select class="w200" v-model="condition.schoolProp" placeholder="公立私立" enum="com.ybveg.govx.enums.sub.GuardSchoolPropEnum"-->
                   <!--@change="searchTab"></enum-select>-->
      <!--<el-cascader class="selectHeight w200" clearable :change-on-select="true" :options="options" @change="areaChange"-->
                   <!--:props="props"></el-cascader>-->
      <el-select v-if="defaultKey == 'CLOSE'" v-model="condition.beforeState" placeholder="反馈状态"
                 class="selectHeight w200" @change="searchTab">
        <el-option v-for="item in complaintStateList" :key="item.key" :label="item.name"
                    :value="item.key"></el-option>
      </el-select>
      <enum-select v-model="condition.problemType" placeholder="问题类型" enum="com.ybveg.govx.enums.food.GuardComplaintProblemTypeEnum"
                   @change="searchTab" class="w200 mr20"></enum-select>
      <span class="upDownSpan movePoin" @click="upDown=!upDown">
        <i :class="!upDown?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
      </span>
      <div style="margin-left: 345px;" v-show="upDown">
        <enum-select class="w200 mr20" style="overflow: initial;margin-left: 0 !important;" v-if="defaultKey == 'CLOSE'" v-model="condition.closeCause" placeholder="关闭原因"
          enum="com.ybveg.govx.enums.food.GuardComplaintCloseCauseEnum" @change="searchTab"></enum-select>
        <div style="display: inline-block;">
          投诉日期
          <el-date-picker v-model="condition.startCreateTime" @change="searchTab" type="date" value-format="yyyy-MM-dd"
            placeholder="开始日期" class="ml10 mr10"></el-date-picker>至
          <el-date-picker v-model="condition.endCreateTime" @change="searchTab" type="date" value-format="yyyy-MM-dd"
            placeholder="结束日期" class="ml10 mr10"></el-date-picker>
        </div>
        <div style="display: inline-block;" v-if="defaultKey != 'WAIT_FEEDBACK'">
          反馈日期
          <el-date-picker v-model="condition.startFeedbackTime" @change="searchTab" type="date" value-format="yyyy-MM-dd"
            placeholder="开始日期" class="ml10 mr10"></el-date-picker>至
          <el-date-picker v-model="condition.endFeedbackTime" @change="searchTab" type="date" value-format="yyyy-MM-dd"
            placeholder="结束日期" class="ml10 mr10"></el-date-picker>
        </div>
      </div>
    </div>
    <div class="tabOffTop120">
      <el-table @sort-change="sortChange" v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"  :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''" :key="maxheight">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip prop="complaintNo" min-width="190" label="编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="被投诉主体"></el-table-column>
        <el-table-column show-overflow-tooltip prop="complaintTitle" min-width="100" label="投诉标题"></el-table-column>
        <el-table-column show-overflow-tooltip prop="problemType" min-width="100" label="问题类型">
          <template slot-scope="scope">
            <span>{{ scope.row.problemType | problemType }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="complaintContent" min-width="120" label="投诉内容"></el-table-column>
        <el-table-column show-overflow-tooltip prop="complaintPerson" min-width="120" label="投诉人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="complaintPhone" min-width="100" label="投诉人电话"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区县"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityContacts" min-width="100" label="经营者/负责人"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityPhone" min-width="100" label="被投诉主体电话"></el-table-column>
        <el-table-column show-overflow-tooltip prop="createTime" min-width="100" label="投诉时间" sortable></el-table-column>
        <el-table-column v-if="defaultKey != 'WAIT_FEEDBACK'" show-overflow-tooltip prop="feedbackCompay" min-width="100" label="反馈部门"></el-table-column>
        <el-table-column v-if="defaultKey != 'WAIT_FEEDBACK'" show-overflow-tooltip prop="feedbackTime" min-width="100" sortable label="反馈时间"></el-table-column>
        <el-table-column v-if="defaultKey == 'CLOSE'" show-overflow-tooltip prop="closeCause" min-width="100" sortable label="关闭原因">
          <template slot-scope="scope">
            <span>{{ scope.row.closeCause | closeCause }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="defaultKey == 'CLOSE'" show-overflow-tooltip prop="closeTime" min-width="100" label="关闭时间"></el-table-column>
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="defaultKey == 'WAIT_FEEDBACK'" @click="open('INFO', scope.row)" class="operate-a">详情</a>
            <a href="javascript:;" v-if="defaultKey == 'ALREADY_FEEDBACK'" @click="open('ALREADY_INFO', scope.row)" class="operate-a">详情</a>
            <a href="javascript:;" v-if="defaultKey == 'CLOSE'" @click="open('FEEDINFO', scope.row)" class="operate-a">详情</a>
            <a href="javascript:;" v-if="defaultKey == 'WAIT_FEEDBACK'" @click="open('FEED', scope.row)" class="operate-a">反馈</a>
            <a href="javascript:;" v-if="defaultKey == 'WAIT_FEEDBACK'" @click="open('CLOSE', scope.row)" class="operate-a">关闭</a>
            <a href="javascript:;" v-if="defaultKey == 'CLOSE'" @click="open('OPEN', scope.row)" class="operate-a">恢复</a>
            <a href="javascript:;" v-if="defaultKey == 'ALREADY_FEEDBACK'" @click="open('CLOSE', scope.row)" class="operate-a">关闭</a>
            <a href="javascript:;" v-if="defaultKey == 'ALREADY_FEEDBACK'" @click="open('REFEED', scope.row)" class="operate-a">重新反馈</a>
          </template>
        </el-table-column>

      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
      <infoPopup @close="status=false" v-if="status" :type="type" :record="record" @refClose="refClose"></infoPopup>
    </div>
  </div>
</div>
</template>

<script>
import * as common from 'api/common';
import EnumSelect from 'components/common/EnumSelect';
import * as guard from 'api/guard'
import { calcTableHeight, boxShadow } from 'utils/utils';
import infoPopup from './infoPopup'
export default {
  mounted() {
    common.getEnums(['com.ybveg.govx.enums.food.GuardComplaintStateEnum']).then((r) => {
       for (let i = 0; i < r.data.length; i++) {
        let state = r.data[i]
        if (state.key === 'CLOSE' || state.key === 'REVOKE') {
          r.data.splice(i, 1)
          i--
        }
       }
       console.log('aaaaaaaaaaaaa', r.data)
       this.complaintStateList = r.data
    })
    guard.getAreaTree('').then(r => {
      if (r.status) {
        let data = JSON.parse(r.data)
        data.data.forEach(element => {
          element.children = []
        })
        this.options = data.data
      } else {
        this.$message.warning(r.message)
      }
    })
    this.searchTab()
    this.maxheight = calcTableHeight(this.tableHeight, 190);
    setTimeout(() => {
      this.shadowShow = boxShadow(document.getElementsByClassName("el-table")[0].clientWidth, document.getElementsByClassName("el-table__body")[0].clientWidth);
    }, 0)
  },
  methods: {
    sortChange (sort) {
      if (sort.prop && sort.order) {
        this.condition.sortColu = sort.prop
        if (sort.order === 'ascending') {
          this.condition.sortType = 'ASC'
        } else {
          this.condition.sortType = 'DESC'
        }
        this.searchPage()
      }
    },
    open (type, record) {
      this.type = type
      if (this.type === 'OPEN') {
        if (this.defaultKey === 'ALREADY_FEEDBACK') {

        } else if (this.defaultKey === 'CLOSE') {
          this.$confirm('是否确认恢复？恢复后该记录将显示在' + (record.beforeState === '02' ? '已反馈' : '待反馈') + '列表' + (record.beforeState === '02' ? '，并进行公示！' : ''), '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            guard.closeOpen(record.id, 'NO', '').then(r => {
              if (r.status) {
                this.$message({
                  type: 'success',
                  message: '恢复成功!'
                })
                this.refClose()
              } else {
                this.$message.warning(r.message)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消恢复'
            })     
          })
        }
      } else {
        this.status = true
        this.record = record
      }
    },
    refClose () {
      this.searchTab()
      this.status = false
    },
    liClick(key) {   //点击导航切换样式
      if (this.defaultKey !== key) {
        this.condition = {
          keysWork: '',
          schoolType: '',
          schoolProp: '',
          state: '',
          beforeState: '',
          areaCode: '',
          sortType: '',
          sortColu: '',
          problemType: '',
          closeCause: '',
          startFeedbackTime: null,
          endFeedbackTime: null,
          startCreateTime: null,
          endCreateTime: null
        },
        this.defaultKey = key
        this.condition.state = key
        this.searchTab()
      }
    },
    handleIconClick() {	//搜索框按钮点击搜索
      this.a = !this.a;
      this.searchTab();
    },
    searchPage() {
      this.loading=true;
      guard.complaintPage(this.page.pageNum, this.page.pageSize, this.condition).then((result) => {
        if (result.status) {
          let data = JSON.parse(result.data)
          this.tableData = data.data.records
          this.page.total = data.data.total
        } else {
          this.$message.warning(result.message)
        }
        this.loading = false
      })
    },
    searchTab() {
      this.page.pageNum = 1;
      this.searchPage();
    },
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.searchPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.searchPage();
    },
    handleItemChange(val) {
      let nodes = this.options
      let node
      for (let i = 0; i < val.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].areaId == val[i]) {
            if (i == val.length - 1) {
              node = nodes[j]
            }
            nodes = nodes[j].children
            break
          }
        }
      }
      guard.getAreaTree(val[val.length - 1]).then(r => {
        if (r.status) {
          let data = JSON.parse(r.data)
          let children = data.data
          children.forEach(element => {
            element.children = []
          })
          if (children.length == 0) {
            node.children = ''
          } else {
            node.children = children
          }
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    showLicense (id) {

    },
    areaChange (val) {
      if (!val || val.length == 0) {
        this.condition.areaCode = ''
      } else {
        this.condition.areaCode = val[val.length - 1]
        this.handleItemChange(val)
      }
      this.searchTab()
    }
  },
  components: { EnumSelect, infoPopup },
  computed: {
    tableHeight() {
      return this.$store.state.layout.tableHeight;
    },
    tableWidth() {
      return this.$store.state.layout.tableWidth;
    }
  },
  watch: {

  },
  filters:{
    closeCause:function (val) {
      switch (val) {
        case "01":
          return "无效信息";
        case "02":
          return "其他原因";
      }
    },
    problemType:function (val) {
      switch (val) {
        case "01":
          return "环境卫生";
        case "02":
          return "人员管理";
        case "03":
          return "食材问题";
        case "04":
          return "菜品问题";
        case "05":
          return "其他问题";  
      }
    }
  },
  data() {
    return {
      complaintStateList: [],
      record: {},
      maxheight: '',
      upDown: false,
      type: '',
      status: false,
      defaultKey: 'WAIT_FEEDBACK',
      lists: [
          {
              key: 'WAIT_FEEDBACK',
              value: '待反馈'
          },
          {
              key: 'ALREADY_FEEDBACK',
              value: '已反馈'
          },
          {
              key: 'CLOSE',
              value: '已删除'
          }
      ],  
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      loading:false,
      a: false,
      shadowShow: false,
      tableData: [{}],
      options: [],
      condition: {
        keysWork: '',
        schoolType: '',
        schoolProp: '',
        state: 'WAIT_FEEDBACK',
        beforeState: '',
        areaCode: '',
        sortType: '',
        sortColu: '',
        problemType: '',
        closeCause: '',
        startFeedbackTime: null,
        endFeedbackTime: null,
        startCreateTime: null,
        endCreateTime: null
      },
      props: {
        value: 'areaId',
        label: 'areaName',
        children: 'children'
      }
    }
  }
}
</script>
<style scoped lang="scss">
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

  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
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

.ipt-btn-box {
  margin: 20px 0;
  /* display: flex;
  justify-content: space-between; */
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}

.table-div {
  width: 100%;
  text-align: center;
}

.operate-a {
  color: #1787ad;
}

table tr td:last-child .cell a {
  border-right: 1px solid #ccc;
  padding-right: 5px;
}
table tr td:last-child .cell a:last-child {
  border-right: none;
  padding-right: 0px;
}
.upDownSpan{
  height: 32px;
  width: 32px;
  display: inline-block;
  background:rgba(246,247,248,1);
  border:1px solid rgba(194,202,210,1);
  text-align: center;
  overflow: hidden;
  color: #A2AAB6;
}
</style>
