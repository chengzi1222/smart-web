<template>
  <div class="sl-mainbody">
      <el-button type="default" @click="isShow=true">选择主体</el-button>

      <yb-popup @close="close" :isShow="isShow" title="选择主体" width="800">
        <div slot="body" class="content-body SelectMainbody-table" >
          <div>
            <div class="demo-input-suffix">
              <el-input
                class="w250"
                placeholder="主体名称、许可备案号"
                v-model="search"
                @keyup.enter.native = 'handleSearch'
              >
                <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search" style="background: #0DB5EF;color:#fff;height:34px;line-height: 34px;width: 40px"></i>
              </el-input>

             <div style="display: inline-block;vertical-align: middle;line-height: 0;">
                <enum-select  v-model="select" multiple placeholder="主体类型" @change="selectChange"  :enum="enumClass"></enum-select>
             </div>


            </div>

            <el-table
              @row-click = "handleClick"
              :row-style = "handleStyle"
              :data="tableData"
              style="width: 100%;margin: 20px 0;max-height:286px;overflow-y:auto;">
              <el-table-column
                align="center"
                label="序号"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="entityName"
                label="主体名"
                width="120">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="backupNo"
                label="许可备案号"
                width="120">
              </el-table-column>
               <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="entityTypeStr"
                label="主体类型"
                width="120">
              </el-table-column>
              <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                property="realityAddr"
                label="经营地址/场所地址">
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

<script>
  import EnumSelect from 'components/common/EnumSelect.vue';
  import YbPopup from 'components/ybpopup/YbPopup.vue'

  export default {
    components:{
      YbPopup,
      EnumSelect
    },
    props:{
      //用于查询的参数
      params:{
        default:function(){
          return {}
        }
      },
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
      //下拉选项
      selected:{
        default:function(){
          return []
        }
      },
      //入口
      entryType:{
        default:function(){
          return ""
        }
      },
      //枚举 双随机一般主体
      enumClass:{
        type: String,
        default: "com.ybveg.govx.enums.EntityEnum"
      },
      //任务id
      taskGroupId:{
        type: String,
        default:function(){
          return ""
        }
      }
    },
    mounted(){
      // Api.getSubTypeList().then(r => {
      //      this.options = r.data;
      // }),
     this.refresh()
//console.log(1)
//      return false;

      this.index = this.currentIndex
      this.select = this.selected;


    },
    data(){
      return {
        isShow:false, //控制是否显示
        search:'', //搜索的内容
        options: [], //主体类型的下拉选项
        select: [], //主体类型的值
        tableData: [], //主体列表

        //分页
        currentPage:1,
        total:0,
        limit:8,
        index:-1, //当前选中行的索引

        result:{} //当前选中的数据
      }
    },
    methods:{
      //刷新数据
      refresh(){
        if(!this.apiFn) return
        if (this.entryType === 'daily') {
          this.apiFn(this.limit, this.currentPage,
            Object.assign({}, {'search': this.search, 'entityTypes': this.select},
              this.params)).then(r => {
            let data = r.data;
            this.total = data.total;
            this.tableData = [...data.list];
          })
        } else if(this.entryType === 'special') {
          this.apiFn(this.limit,this.currentPage,Object.assign({},{'search':this.search,'entityTypes':this.select, 'patrolId': this.taskGroupId})).then(r =>{
            let data = r.data;
            this.total = data.total;
            this.tableData = [...data.list];
          })
        }

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
      //  let i = this.tableData.indexOf(row);
      //  if(i == this.index){
      //     this.index = -1
      //     this.result = Object.assign({},{index:this.index})
      //  }else{
      //     this.index = i;
          this.result = Object.assign({},row,{index:this.index})
      //  }
       this.$emit('slmainbody',this.result);
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
      }
    },
    watch:{
      currentIndex(val){
        this.index = val
      },
      selected(val){
        this.select = val
      },
      params(val){
         this.refresh();
      },
      apiFn(){
        this.refresh();
      }
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
<style lang="sass">
.sl-mainbody .el-table--enable-row-hover .el-table__body tr:hover>td{
  background:transparent;
}
.sl-mainbody .el-table .cell{
  white-space:nowrap;

}
.SelectMainbody-table .el-table__body,.SelectMainbody-table .el-table__header,.SelectMainbody-table .cell{
  width: 100% !important;
}
</style>
