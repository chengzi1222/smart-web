<template>
    <div class="bigbox">
         <div class="page-tilt">
            <b></b>
            <span>溯源闭环</span>
        </div>
        <div v-if='startLoad' class="startLoad">
            <div class="logo clear_a mb20">
                <img :src='yblogo'><div class="ml10">溯源闭环</div>
            </div>
            <div class=" mb20">
                <el-autocomplete
                value-key='name' v-model="entity"
                :fetch-suggestions="querySearch_entity"
                placeholder="请输入主体名称选择主体"
                :trigger-on-focus="false"
                @select="handleSelect_entity"
                ></el-autocomplete>
               
                <el-date-picker
                class="ml20 w150"
                v-model="obj.date"
                type="date"  @change="selectDate"
                :clearable="true"
                placeholder="选择日期"
                :picker-options="pickerOptions">
                </el-date-picker>

                 <el-autocomplete
                class="ml20" value-key='name' v-model="pdt"
                :fetch-suggestions="querySearch_pdt"
                placeholder="请输入商品名字选择商品"
                :trigger-on-focus="false"
                @select="handleSelect_pdt"
                ></el-autocomplete>
                <el-button type="primary" class="w100 ml20"  @click="loadEchart">合成</el-button>
            </div>
        </div>
        <div  v-else>
            <div class="mt20 mb20">
                 <el-autocomplete
                value-key='name' v-model="entity"
                :fetch-suggestions="querySearch_entity"
                placeholder="请输入主体名称选择主体"
                :trigger-on-focus="false"
                @select="handleSelect_entity"
                ></el-autocomplete>
               
                <el-date-picker
                class="ml20 w150"
                v-model="obj.date"
                type="date" @change="selectDate"
                :clearable="true"
                placeholder="选择日期"
                :picker-options="pickerOptions">
                </el-date-picker>

                 <el-autocomplete
                class="ml20" value-key='name' v-model="pdt"
                :fetch-suggestions="querySearch_pdt"
                placeholder="请输入商品名字选择商品"
                :trigger-on-focus="false"
                @select="handleSelect_pdt"
                ></el-autocomplete>
                <el-button type="primary" class="w100 ml20" @click="loadEchart">合成</el-button>
                <!-- <el-button type="primary" class=" ml20">一键短信通知</el-button> -->
            </div>
            <div id='echartsBox' v-loading="loading"  element-loading-text="数据正在努力合成中">
                <span  v-html="text" class="textC" style="width:100%"></span>
            </div>
        </div>

    </div>
</template>

<script>
import {closedLoopEcharts} from "./e.js";
import * as api from "api/trace/closedLoop.js";
export default {
    methods: {
        getdate(date) {
            let dates =date || new Date();
            let mon = dates.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
            if(mon <=9){                                     //如果小于9的话，则需要加上0
                mon = "0" + mon;
            }
            let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
            if(day <=9){                                     //如果小于9的话，则需要加上0
                day = "0" + day;
            }
            return dates.getFullYear() + "-" + mon + "-" +  day;
        },
        selectDate(){
            this.selectDate_=true;
        },
        handleSelect_entity(item){
            this.obj.entity=item.value;
        },
        handleSelect_pdt(item){
            this.obj.pdt=item.value;
        },
        async querySearch_entity(queryString, cb) {
            this.obj.entity="";
            this.obj.pdt="";
            this.pdt="";
            var restaurants;
            let form = new FormData();
            form.append('areaId',this.regionCode);
            form.append('name',queryString);
            await api.subAuto(form).then((d)=>{
                if(d.state){
                    restaurants=d.data;
                   if(restaurants.length==0){
                        this.$message({
                            message: '未匹配出主体，请重新输入选择！',
                            type: 'warning'
                        })
                        cb([]);
                   }else{
                        cb(restaurants);
                   }
                }else{
                    this.$message({
                        message: '请求失败',
                        type: 'warning'
                    })
                   cb([]);
                }
            });
        },
        async querySearch_pdt(queryString, cb) {
            this.obj.pdt="";
            if(this.obj.entity==''|| this.obj.date==''){
                this.$message({
                    message: '请先选择正确的主体和日期才可以选择商品！',
                    type: 'warning'
                });
                cb([]);
                return false;
            };
            var restaurants;
            let form = new FormData();
            form.append('code',this.obj.entity);
            form.append('name',queryString);
            form.append('date',this.selectDate_?this.getdate(this.obj.date):this.obj.date);
            api.pdtAuto(form).then((d)=>{
                if(d.state){
                   restaurants=d.data;
                   if(restaurants.length==0){
                        this.$message({
                            message: '未匹配出商品，请重新输入选择！',
                            type: 'warning'
                        })
                        cb([]);
                   }else{
                        cb(restaurants);
                   }
                }else{
                    this.$message({
                        message: '请求失败',
                        type: 'warning'
                    })
                   cb([]);
                }
            });
        },
        loadEchart(){
            if(this.obj.entity=="" || this.obj.pdt =="" || this.obj.date==""|| this.obj.date==null){
                this.$message({
                    message: '请正确选择所有的选项！（选择主体与商品后才能去合成）',
                    type: 'warning'
                });
                return this.isClick=true;
            }
            if(!this.isClick){return;this.isClick=true;}
            this.startLoad=false;
            this.isClick=false;
            this.loading=true;
            let form = new FormData();
            form.append('subCode',this.obj.entity);
            form.append('pdtCode',this.obj.pdt);
            form.append('date',this.selectDate_?this.getdate(this.obj.date):this.obj.date);
            // form.append('subCode', "3151010600041");
            // form.append('pdtCode', "315101060004100002");
            // form.append('date', "2018-10-15");
            this.$nextTick(()=>{
                this.suyAllData=[];
                api.suyAllData(form).then((d)=>{
                    if(d.state){
                        this.suyAllData=d.data;
                        if(d.data.supLi.length==0&&d.data.buyerLi.length==0&&d.data.sellerLi.length==0){
                            this.text="暂无数据合成!!!";
                            this.loading=false;
                            this.isClick=true;
                            closedLoopEcharts(this);
                            return;
                        }else{
                            this.text="";
                        }
                        closedLoopEcharts(this);
                        this.loading=false;
                        this.isClick=true;
                    }else{
                        this.loading=false;
                        this.isClick=true;
                        this.$message({
                            message: '请求失败',
                            type: 'warning'
                        })
                    }
                })
            })
        },
    },
    mounted() {
    },
    computed:{
        regionCode () {
            if (this.$route.query.source == '4k') {
                return '5101'
            } else if(this.$store.state.common.user.areaCode.length==4){
                 return this.$store.state.common.user.areaCode
            }else{
                 return this.$store.state.common.user.regionCode
            }
           
        }
    },
    data() {
        return {
            text:'',
            loading:true,
            isClick:true,//避免重复点击
            selectDate_:false,//首次时间不需要处理格式
            startLoad:true,//初始化进入显示yblogo
            yblogo:require('assets/img/yblogo.png'),
            pickerOptions: {
                disabledDate(time) {
                return time.getTime() > Date.now() - 8.64e6;
                }
            },
            entity:"",
            pdt:"",
            obj:{
                entity:"",
                pdt:"",
                date:this.getdate()
            },
            suyAllData:[]
        }
    },
    components: {
      
    }
}
</script>
<style lang="scss" scoped>
.startLoad{
    width:730px;
    height:150px;
    margin:300px auto 0;
    .logo{
        width: 255px;
        margin: 0 auto;
        height:50px;
        font-size:30px;
        color:rgba(57,57,57,1);
        line-height:50px;
        img{
            width:118px;
            height:42px;
        }
    }
}
#echartsBox{
    width:100%;
    height:700px;
}
</style>


