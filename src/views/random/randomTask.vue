<template>
    <div class="bigbox">
    	<div class="page-tilt">
    	    <b></b><span>双随机任务</span>
    	</div>
        <ul class="tab-box">
            <li class="tabLi" v-for="(item,index) in patternLis" :data-index="index"
                :class="index==mess.choose?'li-bott':''" :key="index" @click="choose(index,item.key)">
                <div :data-index='index'>
                  <span :class="index==mess.choose?'li-span':''">{{item.name}}</span><span>{{item.num}}</span>
                </div>
            </li>
            <li class="tab-bott"></li>
        </ul>
        <div style="margin-bottom:10px;overflow:hidden;">
            <el-input placeholder="计划名称" class="w260 seekIpt" v-model="searchMap.keysWord" style="float:left;">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
            </el-input>
            <div style="float:left;">
              <enum-select v-model="searchMap.entityType" @change="getPageData" enum="com.ybveg.govx.enums.SubTypeEnum" placeholder="主体类型(全部)"></enum-select>
            </div>
            <el-button v-auth="'food.random.task|func.add'" class="w100 dc" type="primary" icon="el-icon" @click="addRandomTask">添加计划</el-button>
        </div>
        <el-table @sort-change="sortChange" :data="dataPage" class="table-div" :key="mess.choose" v-loading="loading">
            <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="taskName" min-width="100" label="计划名称"></el-table-column>
            <el-table-column show-overflow-tooltip prop="startDate" min-width="100" label="开始时间">
              <template slot-scope="scope">
                {{scope.row.startDate.substring(0, scope.row.startDate.length - 9)}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="endDate" min-width="100" label="结束时间">
              <template slot-scope="scope">
                {{scope.row.endDate.substring(0, scope.row.endDate.length - 9)}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="areaCount" min-width="80" label="区域数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="soPersonCount" min-width="80" label="监管人数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="entityCount" min-width="80" label="主体数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="entityType" min-width="100" label="主体类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="endCount" min-width="70" label="已巡查主体数" v-if="mess.choose != 1"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createTime" min-width="120" sortable="custom" label="制定时间"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" min-width="200">
                <template slot-scope="scope">
                  <a v-if="mess.key != 'ALREADY_COMPLETED'" href="javascript:;" @click="edit(scope.row.id)" class="operate-a">编辑</a>
                  <a href="javascript:;" @click="toInfo(scope.row.id)" class="operate-a">详情</a>
                  <a href="javascript:;" class="operate-a" @click="record(scope.row.id)">巡查记录</a>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination background :current-page="page.pageNum"
                         :page-sizes="[10, 20, 30, 40,50]"
                         :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="page.total"
                         @size-change="pageSizeChange"
                         @current-change="pagecCurrentChange">
          </el-pagination>
        </div>
        <!--编辑弹窗-->
        <yb-popup @close="isEdit = false" :isShow="isEdit" title="" width="484">
          <div slot="body">
            <el-form label-width="130px">
              <div style="width:400px;margin:20px auto">
                <div class="row">
                  <el-form-item label="结束时间:">
                    <el-date-picker class="w200" :picker-options="pickerOptions" v-model="endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :clearable="true" placeholder="选择日期">
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
    </div>
</template>

<script>
import EnumSelect from 'components/common/EnumSelect'
import * as randomTask from "api/random/random";
import YbPopup from 'components/ybpopup/YbPopup';
export default {
    methods: {

     async updateEndDate() {
        if (!this.endDate) {
          this.$message({
            message: '结束日期不能为空!',
            type: 'warning'
          })
          return
        }
      await  randomTask.updateEndDate(this.endDate, this.taskId).then(r => {
          this.init()
          this.$message({
            message: "修改成功",
            type: 'success'
          });
        })
        this.isEdit = false
      },
      addRandomTask() {
        this.$router.push({name: "random.task.add"});
      },
        // 分页查询
        getPageData() {
          this.loading=true;
          randomTask.page(this.searchMap, this.page.pageSize, this.page.pageNum).then(r => {
            this.loading=false;
            this.dataPage = r.data.list
            this.page.total = r.data.total
          })
        },
        //切换导航样式
        choose(index,key) {
            this.mess.choose = index
            this.mess.key = key
            this.searchMap.state = key
            this.searchMap.keysWord = ''
            this.searchMap.entityType = ''
            this.searchMap.entityType = ''
            this.dataPage = undefined
            this.getPageData()
        },
        //页数改变
        pagecCurrentChange(num) {
            this.page.pageNum = num
            this.getPageData()
        },
        //每页数量改变
        pageSizeChange(size) {
            this.page.pageSize = size
            this.getPageData()
        },
        sortChange () {
          this.searchMap.sort = arguments[0].order
          this.getPageData();
        },
        toInfo (randomTaskId) {
          this.$router.push({name: 'random.task.info', query: {'randomTaskId': randomTaskId, 'showRandom': 'YES'}})
        },
        edit (randomTaskId) {
          if (this.searchMap.state == 'EXECUTING') {
            randomTask.getInfo(randomTaskId).then(r => {
              this.endDate = r.data.endDate
              this.taskId = r.data.id
              this.isEdit = true
            })
          } else {
            this.$router.push({name: 'random.task.edit', params: {'randomTaskId': randomTaskId}})
          }
        },
        record(id){
          this.$router.push({
            name: 'random.task.record',
            query:{
              taskId:id,
            }
          })
        },
        init () {
          this.loading=true;
          randomTask.getRandomTaskStates().then(r => {
            this.loading=false;
            this.patternLis = r.data
            this.searchMap.state = this.patternLis[0].key
            this.getPageData()
          })
        }
    },
    async mounted() {
      this.init()
    },
    data() {
        return {
            taskId: '',
            endDate: '',
            pickerOptions: {
              disabledDate: (time) => {
                return time.getTime() <  Date.now() - 8.64e7;
              }
            },
            isEdit: false,
            searchMap: {
              entityType: '',
              keysWord: '',
              state:'',
              sort:''
            },
            patternLis:[],
            mess:{
                choose:0,
                key:''
            },
            page: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            dataPage:null,
            subName:'',
            pageObj:null,
            loading: false,
        };
    },
    components: {
      EnumSelect,YbPopup
    }
}
</script>

<style scoped lang="sass">
    .bigbox{
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
    .tab-box .li-span{
        color: #393939;
    }
    .tab-box span:first-child{
        margin-right: 10px;
    }
    .dc{
        float: right;
    }
    .table-div{
        margin: 20px 0;
        text-align: center;
    }
    .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
    .operate-a{
      color:#0DB5EF;
    }
</style>
