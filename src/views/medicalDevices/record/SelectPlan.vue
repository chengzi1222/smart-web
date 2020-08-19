<template>
  <div class="sl-mainbody">
      <el-button type="default" @click="isShow=true">选择巡查计划</el-button>

      <yb-popup @close="close" :isShow="isShow" title="选择巡查计划" width="800">
        <div slot="body" class="content-body SelectMainbody-table">
          <div>
            <div class="demo-input-suffix">
              <el-input
                class="w250"
                placeholder="专项计划巡查名、计划编号"
                v-model="search"
                @keyup.native = 'handleSearch'
              >
                <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search" style="background: #0DB5EF;color:#fff;height:34px;line-height: 34px;width: 40px"></i>
              </el-input>

              <div class="ml20" style="display: inline-block;vertical-align: middle;line-height: 0;">
                <el-cascader class="w150" placeholder="制定机构" v-model="entityAreaCodeList" style="width: 100%" :show-all-levels="false"
                             :change-on-select="true" clearable :options="areaList.options" :props="areaList.props" @change="selectDept">
                </el-cascader>
              </div>
              <div style="display: inline-block;vertical-align: middle;line-height: 0;">
                <el-select v-model="select" placeholder="请选择" @change="selectChange()" :clearable="true">
                  <el-option v-for="(item,index) in bizTypes" :key="item.bizType" :label="item.bizTypeName" :disabled=item.disabled :value="item.bizType">
                  </el-option>
                </el-select>
              </div>


            </div>

            <el-table class="table-div"
              @row-click = "handleClick"
              :row-style = "handleStyle"
              :data="tableData"
              style="margin: 20px 0;max-height:286px;overflow-y:auto;">
              <el-table-column
                align="center" show-overflow-tooltip
                label="序号"
                type="index"
                min-width="80">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="planName"
                label="专项计划名称"  min-width="110"
               >
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="planNum"
                label="计划编号" min-width="110"
               >
              </el-table-column>
               <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="deptName" min-width="110"
                label="制定机构"
               >
              </el-table-column>
              <el-table-column
                v-if="$store.getters.user.areaCode.length > 4"
                :show-overflow-tooltip="true" min-width="110"
                align="center"
                label="起止时间">
                <template slot-scope="scope" >
                    <span>{{scope.row.startDate}}至{{scope.row.endDate}}</span>
                </template>
              </el-table-column>
            </el-table>

            <div style="text-align: right;" >
              <el-pagination
                :background="true"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 10, 20, 30]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
        <!-- <div slot="foot">
          <el-button type="primary" @click='close'>确定</el-button>
        </div> -->
      </yb-popup>
  </div>
</template>

<script type="module">
import YbPopup from 'components/ybpopup/YbPopup.vue'
import * as Api from 'api/patrol/dailyRecordAdd'
import {postDept,postBizTypes} from 'api/maai/record/recordSpecial';

export default {
    components:{
      YbPopup,
    },
    props:{
      //查询的api方法
      apiFn:{
        default:function () {
          return function () {}
        }
      },
      //当前选中的行（这里只能传id进来，传index有错）
      currentIndex:{
        default:function(){
          return -1
        }
      },
      //枚举 双随机一般主体
      enumClass:{
        type: String,
        default: "com.ybveg.govx.enums.EntityEnum"
      },
    },
    mounted(){
      // Api.getSubTypeList().then(r => {
      //      this.options = r.data;
      // }),

      this.refresh()

      this.index = this.currentIndex
      this.BizTypes();
      postDept({"areaCode":"5101"}).then(r => {
        this.areaList.options = r.data;
      })


    },
    data(){
      return {
        isShow:false, //控制是否显示
        search:'', //搜索的内容
        options: [], //主体类型的下拉选项
        select: '', //主体类型的值
        tableData: [], //主体列表

        //分页
        currentPage:1,
        total:0,
        limit:8,
        index:-1, //当前选中行的索引

        result:{},//当前选中的数据

        // 所属辖区model
        entityAreaCodeList: [],
        dept:'',

        // 所属辖区级联选择器配置
        areaList: {
          options: [],  // 所属辖区数据源
          props: {
            label: 'deptName',
            value: 'areaCode',
            children: 'children',
          }
        },

        bizTypes:[],
      }
    },
    methods:{
      //刷新数据
      refresh(params={}){
           this.apiFn(this.limit,this.currentPage,
           this.select,
           this.search,
           this.dept
           ).then(r =>{
                let data = r.data;
                this.total = data.total;
                this.tableData = [...data.list];
            })
      },
      //关闭弹窗
      close(){
        this.isShow = false;
      },
      //搜索
      handleSearch(){
        this.refresh();
      },
      //选择主体类型
      selectChange(){
        this.refresh();
      },
      //点击行
      handleClick(row,e){
       let i = this.tableData.indexOf(row);
       if(i == this.index){
          this.index = -1
          this.result = Object.assign({},{index:this.index})
       }else{
          this.index = i;
          this.result = Object.assign({},row,{index:this.index})
       }
       this.$emit('slplan',this.result);
       this.isShow = false;
      },
      //处理样式
      handleStyle(obj){
        let i = obj.row.id;
        if(i == this.index){
          return {
            'background':'#EFF7F9',
            'color':'#0DB5EF'
          }
        }
      },
      //分页变化
      handleCurrentChange(val){
        this.currentPage = val
        this.refresh();
      },
      handleSizeChange(val){
        this.limit = val
        this.refresh();
      },
      selectDept(){
        this.dept = this.entityAreaCodeList[this.entityAreaCodeList.length-1];
        this.refresh();
      },
      BizTypes(){
        postBizTypes().then(r=>{
          if(r.status){
            this.bizTypes = r.data;
          }
        })
      }
    },
    watch:{
      currentIndex(val){
        this.index = val
      },
    }
}
</script>

<style lang="scss" scoped>
.sl-mainbody{
  display: inline-block;
}
.content-body{
  padding: 20px;
}
</style>
