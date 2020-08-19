
<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>专项巡查计划管理</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in PlanStateList" :key="item.key" :data-index="index" :class="index==mess.choose?'li-bott':''"
       @click="choose(index,item.key)" v-show="item.key != 'PEND_START' || tabIsSHow">
        <div :data-index='index'>{{item.name}}
          <span>
            <span style="margin-left:20px;">{{item.total == null ? 0 : item.total}}</span>
          </span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="计划名称、计划编号" class="w250 seekIpt" v-model="search.select" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <el-select clearable class="selectHeight" v-model="search.agencies" placeholder="制定机构（全部）" @change="handleIconClick">
        <el-option v-for="item in agenciesList" :key="item.agencies" :label="item.agencies_name" :value="item.agencies">
        </el-option>
      </el-select>

      <el-select clearable class="selectHeight" v-model="search.bizType" placeholder="主体类型" @change="handleIconClick">
        <el-option v-for="item in bizTypeList" :key="item.bizType" :label="item.bizTypeName" :value="item.bizType">
        </el-option>
      </el-select>

      <el-button class="selectHeight" type="primary" v-if="areaLevel != 'TOWN'" v-auth="" @click="add">添加计划</el-button>

    </div>
    <!--编辑弹窗-->
    <yb-popup @close="isEdit = false" :isShow="isEdit" title="" width="484">
      <div slot="body">
        <el-form label-width="130px">
          <div style="width:400px;margin:20px auto">
            <div class="row">
              <el-form-item label="结束时间:">
                <el-date-picker class="w200" :picker-options="pickerOptions" v-model="newTableData.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :clearable="true" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="foot">
        <el-button type="default" @click="isEdit = false">取消</el-button>
        <el-button type="primary" @click="updateEndDate">确定</el-button>
      </div>
    </yb-popup>
    <div class="tabOffTop170">
      <el-table  v-loading="loading" element-loading-text="数据正在努力加载中"   :border="true" :resizable="true"  :data="tableData" class="table-div" @sort-change="handleSortChange">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="plan_name" width="180" label="计划名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="plan_num" label="计划编号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="agencies_name" width="180" label="制定机构"></el-table-column>
        <el-table-column show-overflow-tooltip prop="start_date" width="100" label="开始时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="end_date" width="100" label="结束时间"></el-table-column>
        <el-table-column show-overflow-tooltip prop="biz_type_name" resizable label="主体类型"></el-table-column>
        <el-table-column show-overflow-tooltip prop="ent_cnt" v-if="search.state != 'PEND_START'" label="已巡查主体数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="create_time" sortable="custom" min-width="130" label="制定时间"></el-table-column>
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <a href="javascript:" @click="view(scope.row.id)" class="operate-a">详情</a>
            <!-- v-auth="'medi.special.plan|func.edit'" 启动编辑删除-->
            <a href="javascript:" v-if="search.state == 'PEND_START' && (areaLevel == 'CITY' || areaLevel == 'COUNTY')" @click="start(scope.row.id)" class="operate-a">启动</a>
            <a href="javascript:" v-if="search.state == 'EXECUTING' && (areaLevel == 'CITY' || areaLevel == 'COUNTY') " @click="complete(scope.row)" class="operate-a">完成</a>
            <a href="javascript:" v-if="(areaLevel == 'CITY' || areaLevel == 'COUNTY') && (search.state == 'PEND_START' || search.state == 'EXECUTING') && scope.row.parent_id == -1" @click="edit(scope.row)" class="operate-a">编辑</a>
            <a href="javascript:" v-if="(areaLevel == 'CITY' || areaLevel == 'COUNTY') && search.state == 'PEND_START' && scope.row.parent_id == -1" class="operate-a" @click="deleteById(scope.row.id)">删除</a>
            <a href="javascript:" v-if="(areaLevel == 'CITY' || areaLevel == 'COUNTY') && search.state != 'PEND_START'" class="operate-a" @click="statistics(scope.row)">统计分析</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum" :page-sizes="[5,8,10,15,20,25,30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type='module'>
import YbPopup from 'components/ybpopup/YbPopup';

import * as api from "api/medicalDevices/patrolPlan";

export default {
  async mounted() {
    //制定机构下拉表
    api.getAgencies().then(r => {
      this.agenciesList = r.data;
    });
    //主体类型下拉列表
    api.loadBizType().then(r =>{
      this.bizTypeList = r.data;
    });

    // 当前用户等级
    api.getAreaLevel().then(r => {
      this.areaLevel = r.data;
      if(this.areaLevel == 'TOWN'||this.areaLevel == 'GRID'){
        this.tabIsSHow=false;
      }else{
        this.tabIsSHow=true;
      }
    });

    this.titleTotal();

    let index = this.$route.params.index || this.$route.query.index-0;
    if (index) {
      if(index==2){
        this.choose(index, "ALREADY_COMPLETED");
      }
      if(index==0){
        this.choose(index, "EXECUTING");
      }
      if(index==1){
        this.choose(index, "PEND_START");
      }
      this.$route.params.index = null;
    } else {
      //专项巡查状态
      this.getPage();
    }
  },
  methods: {

    //  统计分析
    statistics(row) {
      this.$router.push({
          name: 'maai.specialStatis',
          query:{
              id:row.id,
              planName:row.plan_name,
              state:this.PlanStateList[this.mess.choose].name
          }
      })
    },
    titleTotal(){
      api.getPlanState().then(r => {
        this.PlanStateList[0].total=r.data[this.PlanStateList[0].key];
        this.PlanStateList[1].total=r.data[this.PlanStateList[1].key];
        this.PlanStateList[2].total=r.data[this.PlanStateList[2].key];
        if (this.$route.query.stateTxt) {
          let _index, _key;
          for (var i = 0; i < this.PlanStateList.length; i++) {
            if (this.PlanStateList[i].name == this.$route.query.stateTxt) {
              _index = i;
              _key = this.PlanStateList[i].key;
            }
          }
          this.choose(_index, _key);
        }
      });
    },
    add() {
      this.$router.push({ path: "add", query: { opt: 'add', index: this.mess.choose } });
    },
    edit(tableData) {
      if (this.search.state == 'EXECUTING') {
        this.editStartDate = tableData.start_date;
        this.newTableData.id = tableData.id;
        this.newTableData.endDate = tableData.end_date;
        this.isEdit = true;
      } else {
        this.$router.push({ path: "add", query: { opt: 'edit', id: tableData.id, index: this.mess.choose } });
      }
    },
    view(id) {
      this.$router.push({ path: "info", query: { id: id, index: this.mess.choose } });
    },
    // 启动
    start(id) {
      this.$confirm('确定启动该专项巡查计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        api.startPlan(id).then(r => {
          if (!r.status) {
            this.$message({
              message: r.message,
              type: r.level
            });
            return;
          }
          this.$message({
            message: "启动成功",
            type: 'success'
          });
          this.titleTotal();
          this.getPage();
        })
      }).catch(_ => { });
    },

    //页面查询
    async getPage() {
      this.loading=true;
      let params = this.search;
      let formdata=new FormData();
      formdata.append('pageSize', this.page.pageSize);
      formdata.append('pageNum', this.page.pageNum);
      formdata.append('searchWord', this.search.select);
      formdata.append('agencies', this.search.agencies);
      formdata.append('state', this.search.state);
      formdata.append('bizType', this.search.bizType);
      formdata.append('sortType', this.search.sortType);
      api.getPage(formdata).then(r => {
        // this.page.pageNum == 0 ? 1 : r.data.pageNum;
        // this.page.pagesize = r.data.pagesize;
        this.page.total = r.data.total;
        this.tableData = r.data.list;
        this.loading=false;
      })
    },
    handleIconClick() {
      this.page.pageNum=1;
      this.getPage();
    },
    //分页条
    pageCurrentChange(num) {
      this.page.pageNum = num;
      this.getPage();
    },
    pageSizeChange(size) {
      this.page.pageSize = size;
      this.getPage();
    },
    // 排序
    handleSortChange({ order }) {
      this.search.sortType = order == 'descending' ? 'DESC' : 'ASC';
      this.getPage();
    },
    //切换导航样式
    choose(index, key) {
      //        this.$router.push({path: "list", query: {index:index}});
      this.mess.choose = index;
      this.search.state = key;
      this.getPage();
    },
    //删除
    deleteById(id) {
      this.$confirm('是否确认删除该专项巡查计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        api.deletePlan(id).then(r => {
          if(r.status){
            this.$message({
              message: "删除成功",
              type: 'success'
            });
            this.titleTotal();
            this.getPage();
          }else{
            this.$message({
              message: d.message,
              type: 'success'
            });
          }

        })
      });
    },
    complete(row){//完成按钮
     this.$confirm('是否确认该计划已完成？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          api.complete(row.id).then(d=>{
            if(d.status){
               this.$message({
                  message: '已修改为完成状态！',
                  type: 'success'
                });
               this.getPage();
               this.titleTotal();
            }else{
                this.$message({
                  message: d.message,
                  type: d.level
                });
            }
          })
        })

    },
    // 更新结束时间
    updateEndDate() {
      let params = this.newTableData;
      if (!params.endDate) {
        this.$message({
          message: '结束日期不能为空!',
          type: 'warning'
        });
        return;
      }
      api.updateEndDateById(params).then(result => {
        if(result.status){
          this.$message({
            message: "修改成功",
            type: 'success'
          });
          this.isEdit = false;
          this.getPage();
        }else{
           this.$message({
              message: result.message,
              type: result.level
            });
        }
      })
    }

  },
  components: {
    YbPopup
  },
  data() {
    return {
      tabIsSHow:false,
      loading:false,
      pickerOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.editStartDate;
          if (beginDateVal) {
            return time.getTime() <  Date.now() - 8.64e7;
          }
//          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      editStartDate: Date.now(),//编辑结束日期不能小于等于起始日期
      isEdit: false,
      newTableData: {
        id: "",
        endDate: ""
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      search: {
        select: "",   //搜索
        id: "",  //制定机构
        bizType: "", //主体类型
        agencies: "",//制定机构
        state: "EXECUTING", //计划状态
        sortType: "DESC",
        sortColumnName: "create_time",
        ok: true
      },
      mess: {
        choose: 0,
      },
      //下拉表
      agenciesList: [],
      //主体类型下拉列表
      bizTypeList: [],
      PlanStateList: [
        {total: "0", name: "执行中", key: "EXECUTING"},
        {total: "0", name: "待启动", key: "PEND_START"},
        {total: "0", name: "已完成", key: "ALREADY_COMPLETED"}
      ],
      //列表数据
      tableData: [],
      areaLevel: "",
      chartData: "",

    }
  }
}
</script>

<style scoped lang="sass">
.tab-box {
  width: 100%;
  display: flex;
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

.ipt-btn-box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
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

.tab-box a {
  color: #9a9a9a;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.tab-box a span {
  float: right;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott a {
  color: #393939;
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
  display: flex;
  justify-content: space-between;
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
</style>
