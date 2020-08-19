<template>
  <div class="sl-mainbody">
    <el-button type="default" @click="isShow=true">选择主体</el-button>

    <yb-popup @close="close" :isShow="isShow" title="选择主体" width="800">
      <div slot="body" class="content-body SelectMainbody-table" >
        <div>
          <div class="demo-input-suffix">
            <el-input
              class="w180"
              placeholder="主体名称、社会信用代码"
              v-model="search"
              @keyup.enter.native = 'handleSearch'
            >
              <i @click="handleSearch" slot="suffix" class="el-input__icon el-icon-search" style="background: #0DB5EF;color:#fff;height:34px;line-height: 34px;width: 40px"></i>
            </el-input>

            <div style="display: inline-block;vertical-align: middle;line-height: 0;">
              <enum-select class="w180 ml10" v-model="select" multiple placeholder="主体类型" @change="selectChange"  :enum="enumClass"></enum-select>
            </div>

            <div style="display: inline-block;vertical-align: middle;line-height: 0;">
              <enum-select class="w200 ml10" v-model="category" multiple placeholder="器械类别" @change="selectChange"  enum="com.ybveg.govx.enums.maai.MaaiProductCategoryEnum"></enum-select>
            </div>
            <div style="display: inline-block;vertical-align: middle;line-height: 0;">
              <el-cascader class="w180 ml10" placeholder="所属辖区" v-model="entityAreaCodeList" style="width: 100%" :show-all-levels="false"
                :change-on-select="true" clearable :options="areaList.options" :props="areaList.props" @change="selectChange">
              </el-cascader>
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
              property="creditCode"
              label="社会信用代码"
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
              property="categoryStr"
              label="器械类别">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              property="deptName"
              label="所属辖区">
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              align="center"
              property="realityAddr"
              label="经营地址">
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
    <popup-body class="popup-body" v-if="isShowTable">
      选择检查要点表
      <!-- 功能模块添加到这一区域 -->
      <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close floatR" @click="isShowTable = false"></i>
      <div class="row">
        <el-form-item label="主体名称:">
          <span>{{this.result.entityName}}</span>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="主体类型:">
          <span>{{this.result.entityTypeStr}}</span>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item :label="result.entityType === 'MAAI_PRODUCT' ? '生产类别':(result.entityType === 'MAAI_MANAGER'?'经营类别':'使用类别')">
          <span>{{this.result.categoryStr}}</span>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="检查要点表:">
          <el-select clearable class="w200 selectHeight" v-model="tableId" placeholder="巡查要点表（全部）" @change="changeTable()">
            <el-option v-for="item in tableList" :key="item.id" :label="item.nameExp" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-button class="floatR" type="primary" @click="confirm">确定</el-button>
    </popup-body>
  </div>
</template>

<script type="module">
  import EnumSelect from 'components/common/EnumSelect.vue';
  import YbPopup from 'components/ybpopup/YbPopup.vue'
  import popupBody from 'components/popup/popupdata';
  import {postFindTable,postDept} from 'api/maai/record/recordDaily';

  export default {
    components:{
      YbPopup,
      EnumSelect,
      popupBody,
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
      },
      bizType:{ type:String },
      changeItem:{type:Boolean}
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
      this.tableId = '';
      postDept({"areaCode":""}).then(r => {
        this.areaList.options = r.data;
      })

    },
    data(){
      return {
        isShow:false, //控制是否显示
        search:'', //搜索的内容
        options: [], //主体类型的下拉选项
        select: [], //主体类型的值
        tableData: [], //主体列表
        isShowTable:false,
        //分页
        currentPage:1,
        total:0,
        limit:8,
        index:-1, //当前选中行的索引
        tableList:[],
        result:{}, //当前选中的数据
        tableId:'',
        category:[],
        areaCodes:[],
        // 所属辖区model
        entityAreaCodeList: [],

        // 所属辖区级联选择器配置
        areaList: {
          options: [],  // 所属辖区数据源
          props: {
            label: 'deptName',
            value: 'areaCode',
            children: 'children',
          }
        },
      }
    },
    methods:{
      //刷新数据
      refresh(){
        if(!this.apiFn) return
        if (this.entryType === 'daily') {
          this.apiFn(this.limit, this.currentPage,
            Object.assign({}, {'search': this.search, 'entityTypes': this.select,'category':this.category,'areaCodes':this.areaCodes,
                'dept':this.entityAreaCodeList[this.entityAreaCodeList.length-1]},
              this.params)).then(r => {
            let data = r.data;
            this.total = data.total;
            this.tableData = [...data.list];
          })
        } else if(this.entryType === 'special') {
          this.apiFn(this.limit,this.currentPage,Object.assign({},{'search':this.search,'entityTypes':this.select,'category':this.category,
            'deptId':this.deptId,'bizType':this.bizType, 'specialId': this.taskGroupId,'dept':this.entityAreaCodeList[this.entityAreaCodeList.length-1]})).then(r =>{
            let data = r.data;
            this.total = data.total;
            this.tableData = [...data.list];
          })
        }

      },
      //关闭弹窗
      close(){
        this.isShow = false;
        this.isShowTable = false;

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
        this.result = Object.assign({},row,{index:this.index})
        let params = {};
        if(this.entryType === 'daily'){
          params={"entityType":this.result.entityType,"categorys":this.result.category,"entityId":this.result.entityId}
        }else{
          params={"specialId":this.taskGroupId,"entityId":this.result.entityId}
        }
        this.findTable(params);
        this.isShowTable = true;
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
      //巡查要点表
      findTable(params){
        postFindTable(params).then(r=>{
          if(r.status){
            this.tableList = r.data;
            this.tableId = r.data[0].id;
          }
        })
      },
      //选择要点表
      confirm(){
        if(this.tableId == null || this.tableId == ""){
          this.$message.warning('请选择检查要点表')
          return;
        }
        if(this.changeItem){
          this.$confirm('变更检查要点将会清空所有检查内容!是否确认该操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.confrimSet();
            this.$emit('citem');
          })
        }else{
          this.confrimSet();
        }
      },

      confrimSet(){
        this.result.tableId = this.tableId;
        this.$emit('slmainbody',this.result);
        this.isShowTable = false;
        this.isShow = false;
        this.tableId = '';
      },

      //下拉框改变
      changeTable(){
        let obj = {};
        obj = this.tableList.find((item)=>{//这里的tableList就是上面遍历的数据源
          return item.id === this.tableId;//筛选出匹配数据
        });
        this.result.tableName = obj.name;
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
      apiFn(val){
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
  .w180{
    width: 172px !important;
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
