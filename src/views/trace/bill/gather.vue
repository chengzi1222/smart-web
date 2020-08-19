<template>
    <div class="bigbox">
    	<div class="page-tilt"> 
    	    <b></b><span>账单汇总</span>
    	</div>
        <div class="dateBox">
            <span class="demonstration"></span>
            <el-select class="w130" style="margin-right: 10px;" v-model="transferData.type" @change="sx" placeholder="请选择">
                <el-option
                    v-for="item in patternLis"
                    :key="item.type"
                    class="w140"
                    :label="item.type"
                    :value="item.key">
                </el-option>
            </el-select>
                <el-date-picker
                    v-model="seldate"
                    type="month"
                    class="w140"
                    @change="singleDate()"
                    placeholder="选择月份">
                </el-date-picker>
        </div>
        <div class="dataBox">
            <div class="collect" @click="getPageDataSingle('allSchool')">
                <h3>{{this.dataLis.all}}<span style="font-size:14px;color:#A2AAB6;">万</span></h3>
                <p>总金额</p>
            </div>
            <div class="dining" >
                <div @click="getPageDataSingle('zhongXue')">
                    <h3>{{this.dataLis.zx}}<span style="font-size:14px;color:#A2AAB6;">万</span></h3>
                    <p>中学</p>
                </div>
                <div @click="getPageDataSingle('xiaoXue')">
                    <h3>{{this.dataLis.xx}}<span style="font-size:14px;color:#A2AAB6;">万</span></h3>
                    <p>小学</p>
                </div>
                <div @click="getPageDataSingle('yey')">
                    <h3>{{this.dataLis.yey}}<span style="font-size:14px;color:#A2AAB6;">万</span></h3>
                    <p>幼儿园</p>
                </div>
            </div>
        </div>
        
        <div>
            <el-select v-model="type" placeholder="请选择"  @change="handleChange">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
               >
                </el-option>
            </el-select>
            <el-input style="margin-left: 20px;vertical-align: middle;" placeholder="请输入学校"  class="w260 seekIpt"  v-model="subName" @keyup.enter.native ="seekEnter()">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
            <el-button @click="importBoxShow = true" class="w100" style="float: right;" type="primary">账单导出</el-button>
        </div>
        <div style="position: relative;">
          <div v-if="lodings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
            <span style="position: absolute;top: 50%;margin-top: -30px;"><i class="icon el-icon-loading" style="font-size: 40px;"></i></span>
          </div>
            <el-table :data="dataPage" class="table-div">
                <el-table-column show-overflow-tooltip prop="buyerName" min-width="200" label="学校名称"  align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="buyerType" min-width="100" label="学校类型"  align="left"></el-table-column>
                <el-table-column show-overflow-tooltip prop="areaName" min-width="120" label="区域"></el-table-column>
                <el-table-column show-overflow-tooltip prop="address" min-width="200" align="left" label="地址"></el-table-column>
                <el-table-column show-overflow-tooltip prop="orderNum" min-width="120" label="账单数"></el-table-column>
                <el-table-column show-overflow-tooltip  min-width="80" label="操作">
                    <template slot-scope="scope">
                        <a style="color: #1787AD;cursor:pointer" @click="go(scope.row)">账单明细</a>
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
        </div>
        <YbPopup :title='"账单导出"' :ischoose='false' :width='"600"' :isShow="importBoxShow">
            <div slot="body">
                <el-form label-width="100px" style="width:520px;margin:0 auto;">
                    <div class="row">
                        <el-form-item label="学校类型">
                            <el-select  class="w200" @change="importBoxChange('type')" v-model="importBox.type" placeholder="请选择学校类型">
                                <el-option
                                v-for="item in options_sc"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="row">
                        <el-form-item label="办学类型">
                            <el-select class="w200" @change="importBoxChange('scType')"  style="margin-right: 10px;" v-model="importBox.scType" placeholder="请选择办学类型">
                                <el-option
                                    v-for="item in patternLis"
                                    :key="item.type"
                                    class="w200"
                                    :label="item.type"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="row">
                        <el-form-item label="学校名称">
                        <el-autocomplete  class="w200"  v-model="scName"
                        :fetch-suggestions="querySearchAsync" clearable
                        placeholder="请输入学校名称选择学校"
                        @select="handleSelect" value-key='name'>
                        </el-autocomplete>
                         </el-form-item>
                    </div>                    
                    <div class="row">
                        <el-form-item label="品类">
                        <el-cascader placeholder="请选择品类" class="w200" 
                        :options="options_pdt" clearable
                        change-on-select
                        @change="pdtChange"
                        ></el-cascader>
                        </el-form-item>
                    </div>
                    <div class="row relative">
                        <span style="color:red;position: absolute;top:13px;left:21px;">*</span>
                            <el-form-item label="配送时间">
                            <el-date-picker class="w140" v-model="importBox.timeS" type="date" placeholder="开始月份" :picker-options="pickerOptions3" >
                            </el-date-picker>
                            <span>至</span>
                            <el-date-picker class="w140" v-model="importBox.timeE" type="date" placeholder="结束月份" :picker-options="pickerOptions4" >
                            </el-date-picker>
                         </el-form-item>
                    </div>
                    <p  class="remark">备注</p>
                    <p  class="remark">1.请选择搜索条件，系统会根据搜索条件导出账单汇总信息</p>
                    <p  class="remark">2.配送时间必填，并且必须在1个月以内，否则不予导出</p>
                </el-form>
                
            </div>
            <div slot="foot" class="mt20 relative" style="height: 35px;">
                <el-button type="default" class="absolute" style="right:130px" @click="importBoxShow=false">取消</el-button>
                <el-button type="primary" class="absolute" style="z-index:2;right:20px" @click="importSubmit" >确认导出</el-button>
                <a :href="derive"  ref="godown" style="width:90px;right:20px" class="absolute floatR godown" download="filename">确认导出</a>
            </div>
        </YbPopup>
    </div>
</template>

<script>
import * as billAPI from "api/trace/bill.js";
import YbPopup from "components/ybpopup/YbPopup.vue";
import config from "utils/config";

export default {
  methods: {
    pdtType(){
        billAPI.pdtType().then(r=>{
          if(r.data&&r.data!==null){
            this.options_pdt=r.data;
          }
        })
    },
    import_() {
      // if (this.dataPage && this.dataPage.length <= 0) {
      //   this.$message({
      //     message: "暂无数据可导出",
      //     type: "warning"
      //   });
      //   return;
      // }
      // for(let i in this.importBox){
      //   this.importBox[i]=""
      // }
      // this.importBox.timeS=this.importBoxTime('S')
      // this.importBox.timeE=this.importBoxTime('E')
      // this.importBoxShow = true;
    },
    importBoxTime(t){
      let d=new Date();
      let date=t=='E'?d:d.setMonth(d.getMonth()-1)
      let mon = new Date(date).getMonth() + 1; //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {
        //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day=new Date(date).getDate()
      if (day <= 9) {
        //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      return new Date(date).getFullYear() + "-" + mon+"-"+day;
    },
    getdateSub(date){
       let dates =date? new Date(date) : new Date();
      let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {
        //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      let day=dates.getDate()
       if (day <= 9) {
        //如果小于9的话，则需要加上0
        day = "0" + day;
      }
      return dates.getFullYear() + "-" + mon+"-"+day;
    },
    pdtChange(value) {
      this.importBox.pdtType = !value ? "" : value[value.length - 1];
    },
    importBoxChange(t){
      if(t=='type'){
        if(this.importBox.type!=''){
          this.importBox.scName='';
          this.scName='';
        }
      }
      if(t=='scType'){
        if(this.importBox.scType!=''){
          this.importBox.scName='';
          this.scName='';
        }
      }
    },
    importSubmit() {
      if( this.importBox.timeS===null||this.importBox.timeE===null){
        this.$message({
            message: "配送时间必填，并且必须在1个月以内，否则不予导出",
            type: "warning"
          });
          return;
      }
      if(this.scName&&this.importBox.scName==''){
        this.$message({
          message: "你输入的学校未被匹配出，请重新输入并且必须选中学校！",
          type: "warning"
        });
        return;
      }
      let code= this.importBox.pdtType? this.importBox.pdtType:'';
      this.derive = encodeURI(config.Derive + 'govapi/bill/exports?areaId=' + this.regionCode
              + '&sDate=' + this.getdateSub(this.importBox.timeS)
              + '&eDate=' + this.getdateSub(this.importBox.timeE))
              + '&typeCode=' + code
            + '&buyerType=' +  this.importBox.type
            + '&scType=' +  this.importBox.scType
            + '&byGuid=' +  this.importBox.scName
      console.log(this.derive)
      setTimeout(()=>{
      this.$refs.godown.click();
      this.importBoxShow=false;
      })
      
    },
    querySearchAsync(queryString, cb) {
        let restaurants;
        this.importBox.scName = '';
        let form = new FormData();
        form.append('name', queryString);
        form.append('areaId', this.regionCode);
        form.append('isSchool', 'TRUE');
        form.append('buyerType', this.importBox.type);
        form.append('scType', this.importBox.scType);
        billAPI.buyerAuto(form).then(r => {
          restaurants = r.data;
          cb(restaurants);
        })
    },
    handleSelect(item) {
        this.importBox.scName= item.value;
    },
    sx() {
      this.gettransferData();
      this.getPageData();
    },
    //  获取时间，默认为当前时间
    getdate(date) {
      let dates = date || new Date();
      let mon = dates.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
      if (mon <= 9) {
        //如果小于9的话，则需要加上0
        mon = "0" + mon;
      }
      this.transferData.date = dates.getFullYear() + "-" + mon;
    },
    //转换参数类型，请求数据
    gettransferData() {
      let form = new FormData();
      form.append("areaId", this.transferData.areaId);
      form.append("type", this.transferData.type);
      form.append("date", this.transferData.date);
      billAPI.postMain(form).then(d => {
        this.dataLis = d.data;
      });
    },
    //转换参数类型，请求分页数据
    getPageData() {
      this.lodings = true;
      let form = new FormData();
      form.append("scType", this.transferData.type);
      form.append("subName", this.subName);
      form.append("type", this.type);
      form.append("date", this.transferData.date);
      form.append("areaId", this.transferData.areaId);
      form.append("pageSize", this.page.pageSize);
      form.append("pageNumber", this.page.pageNum);
      billAPI.postPage(form).then(d => {
        this.lodings = false;
        this.dataPage = d.data;
        this.page.total = d.pageObj.totalRecords;
      });
    },
    //点击查询
    getPageDataSingle(type) {
      this.type = type;
      this.getPageData();
    },
    //页数改变
    pagecCurrentChange(num) {
      this.page.pageNum = num;
      this.getPageData();
    },
    //每页数量改变
    pageSizeChange(size) {
      this.page.pageNum=1;
      this.page.pageSize = size;
      this.getPageData();
    },
    //改变日期
    singleDate() {
      this.page.pageNum=1;
      this.getdate(this.seldate);
      this.gettransferData();
      this.getPageData();
    },
    //下拉改变
    handleChange() {
      this.page.pageNum=1;
      this.getPageData();
    },
    //搜索框搜索
    seekEnter() {
      this.page.pageNum=1;
      this.getPageData();
    },
    //搜索框搜索
    handleIconClick() {
      this.page.pageNum=1;
      this.getPageData();
    },
    //进入二级页面
    go(rowData) {
      let { guid, buyerName } = rowData;
      let { date, areaId } = this.transferData;
      sessionStorage.setItem("billGatherDate", date);
      this.$router.push(
        "/yb/bill/detail/?guid=" +
          guid +
          "&date=" +
          date +
          "&areaId=" +
          areaId +
          "&buyerName=" +
          buyerName
      );
    }
  },
  mounted() {
    if (this.$route.query.source == '4k') {
      this.$store.dispatch('getMenus', 'FOOD');
    }
    if (this.$route.query.source == '4k') {
      this.transferData.areaId = '5101'
    } else if (this.$store.state.common.user.areaCode.length <= 4) {
      this.transferData.areaId = this.$store.state.common.user.areaCode;
    } else {
      this.transferData.areaId = this.count;
    }
    if (sessionStorage.getItem("billGatherDate")) {
      this.seldate = sessionStorage.getItem("billGatherDate");
      this.transferData.date = sessionStorage.getItem("billGatherDate");
    } else {
      this.getdate();
      this.seldate = this.transferData.date;
    }
    this.gettransferData();
    this.getPageData();
    // 弹框初始化
    this.pdtType();
    this.importBox.timeS=this.importBoxTime('S')
    this.importBox.timeE=this.importBoxTime('E')
  },
  computed: {
    count() {
      return this.$store.state.common.user.regionCode;
    },
    regionCode() {
      if(this.$route.query.source == '4k') {
        return '5101'
      }else if (this.$store.state.common.user.areaCode.length == 4) {
          return this.$store.state.common.user.areaCode
      } else {
          return this.$store.state.common.user.regionCode
      }
    }
  },
  data() {
    return {
      importBox: {
        type: "",
        scType: "",
        pdtType: "",
        scName: "",
        timeS: "",
        timeE:''
      },
      importBoxShow: false,
      options_pdt: [],
      pickerOptions3: {
                disabledDate: (time) => {   
                    if(this.importBox.timeE){
                    let currentTime = new Date(this.importBox.timeE);
                    let threeMonths = currentTime.setMonth(currentTime.getMonth()-1);   
                    currentTime.setMonth(currentTime.getMonth()+1)
                      return time.getTime() < threeMonths ||time.getTime() >  currentTime  ; 
                    }
                    
                    }
      },
      pickerOptions4: {
                disabledDate: (time) => {   
                    if(this.importBox.timeS){
                      let currentTime =  new Date(this.importBox.timeS);
                      let threeMonths = currentTime.setMonth(currentTime.getMonth()+1);   
                      currentTime.setMonth(currentTime.getMonth()-1)
                      return  time.getTime() > threeMonths||time.getTime() <currentTime ; 
                    }
                    }
      },
      derive:'',
      scName:'',
      seldate: null,
      patternLis: [
        {
          type: "全部办学类型",
          key: ""
        },
        {
          type: "公立",
          key: "PUBLIC"
        },
        {
          type: "私立",
          key: "PRIVATE"
        }
      ],
      options: [
        {
          value: "allSchool",
          label: "全部"
        },
        {
          value: "yey",
          label: "幼儿园"
        },
        {
          value: "xiaoXue",
          label: "小学"
        },
        {
          value: "zhongXue",
          label: "中学"
        },
        {
          value: "daXue",
          label: "大学"
        }
      ],
      options_sc: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "KINDSC",
          label: "幼儿园"
        },
        {
          value: "PRISC",
          label: "小学"
        },
        {
          value: "MIDSC",
          label: "初中"
        },
        {
          value: "HIGSC",
          label: "高中"
        },
        {
          value: "UNVSC",
          label: "大学"
        }
      ],
      type: "allSchool",

      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      transferData: {
        areaId: "",
        date: null,
        type: ""
      },
      dataLis: {},
      dataPage: [],
      subName: "",
      lodings: true
    };
  },
  components: {
    YbPopup
  }
};
</script>

<style scoped lang="sass">
.bigbox {
  position: relative;
}
.dateBox {
  position: absolute;
  top: 15px;
  right: 0;
  z-index: 666;
}
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}
.tab-box .tabLi {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}
.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}
.dataBox {
  display: flex;
  margin: 60px 0 20px;
  justify-content: space-between;
}
.dataBox div {
  height: 90px;
  text-align: center;
  border: 1px solid #c2cad2;
  cursor: pointer;
}
.dataBox h3 {
  font-size: 28px;
  color: #3b3b3b;
  margin-top: 14px;
  line-height: 35px;
}
.dataBox p {
  font-size: 14px;
  color: #a2aab6;
}
.collect {
  width: 18%;
}
.dining {
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.dining div {
  border: none;
  width: 33.33%;
}
.dc {
  float: right;
}
.table-div {
  margin: 20px 0;
  text-align: center;
}
.pagination-box {
  text-align: right;
  margin-top: 20px;
}
.dining .riBorder {
  border-right: 1px solid #c2cad2;
}
.remark{
  padding-left:24px;
  font-size:14px;
  color:#c0b3b3
}
</style>
