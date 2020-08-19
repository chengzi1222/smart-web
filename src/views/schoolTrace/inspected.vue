<template>
    <div class="rightBox">
        <div class="titie clear_a">
            <div class="titie_left">晨检公示</div>
            <div class="titie_right">
                <el-date-picker class="w200 fr" :clearable='false' @change="getInfo" v-model="time" type="date"
                                align="right"
                    :picker-options="option" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <div class="innerBox h272 mb20">
            <p class="innerBoxTitie"><span class="line"></span>晨检基本信息</p>
            <div class="clear_a info"  v-loading="loading" element-loading-text="数据正在努力加载中" >
                <div class="baseInfo">
                    <p><span class="col66">晨检时间：</span>{{dataNull?"暂无":data.inspectDate+' '+ data.inspectTime}}</p>
                    <p><span class="col66">检查人：</span>{{dataNull?"暂无":data.checkers}}</p>
                    <div class="clear_a">
                        <div style="width:48px;" class="col66">备注：</div>
                        <div style="width:calc(100% - 60px);">{{data.remark!=''?data.remark:'暂无备注'}}</div>
                    </div>
                </div>
                <div  class="baseImg">
                    <p  class="col66 mb20">图片附件：</p>
                    <ul class="clear_a">
                        <span v-if='data.fileDTOList.length<=0' >暂无图片!</span>
                        <li v-if='data.fileDTOList.length>0'  v-for="item in data.fileDTOList" :key="item.fileId"><img :src="schoolTraceBaseUrl+item.fileUrl"></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="innerBox h758 relative">
            <p class="innerBoxTitie"><span class="line"></span>晨检明细表</p>
            <div style="height:460px;">
                <el-scrollbar  style="height:100%;width:100%;">
                    <div>
                        <el-table :data="data.bigScreeDetailsDTOList" class="table-div"  v-loading="loading" element-loading-text="数据正在努力加载中" >
                            <el-table-column show-overflow-tooltip prop="empName" min-width="100" label="被检查人"></el-table-column>
                            <el-table-column show-overflow-tooltip prop="empPost" min-width="100" label="职务"></el-table-column>
                            <el-table-column label="发热" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 0001 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('0001')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('0001')" @click="getProblemItemInfo(scope.row,'0001','发热')" class="yes no">不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="感冒咳嗽" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 0002 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('0002')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('0002')" class="yes no"  @click="getProblemItemInfo(scope.row,'0002','感冒咳嗽')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="外伤" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 0003 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('0003')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('0003')" class="yes no"  @click="getProblemItemInfo(scope.row,'0003','外伤')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="呕吐腹泻" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 0004 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('0004')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('0004')" class="yes no"  @click="getProblemItemInfo(scope.row,'0004','呕吐腹泻')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="皮肤疾病" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 0005 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('0005')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('0005')" class="yes no"  @click="getProblemItemInfo(scope.row,'0005','皮肤疾病')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="其他疾病" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 5000 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('5000')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('5000')" class="yes no"  @click="getProblemItemInfo(scope.row,'5000','其他疾病')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="着装不规范" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 5001 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('5001')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('5001')" class="yes no"  @click="getProblemItemInfo(scope.row,'5001','着装不规范')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="双手不干净" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 5002 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('5002')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('5002')" class="yes no"  @click="getProblemItemInfo(scope.row,'5002','双手不干净')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="指甲过长" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 5003 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('5003')" class="yes">合格</span>
                                    <span v-if="scope.row.problemItemCodeList.includes('5003')" class="yes no"  @click="getProblemItemInfo(scope.row,'5003','指甲过长')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="戒指等饰品" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 5004 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('5004')" class="yes">合格</span>
                                    <span  v-if="scope.row.problemItemCodeList.includes('5004')" class="yes no"  @click="getProblemItemInfo(scope.row,'5004','戒指等饰品')" >不合格</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="其他卫生问题" min-width="100">
                                <template slot-scope="scope">
                                    <!-- 9999 -->
                                    <span v-if="!scope.row.problemItemCodeList.includes('9999')" class="yes">合格</span>
                                    <span  v-if="scope.row.problemItemCodeList.includes('9999')" class="yes no"  @click="getProblemItemInfo(scope.row,'9999','其他卫生问题')" >不合格</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
            <div class="infoPop absolute" v-if="infoPopShow"  v-loading="infoPopShowLoading" >
                <i class="icon-exit iconfont movePoin close" @click="infoPopShow = false"></i>
                <p class="mt20"><span>被检查人：</span>{{card.empName==""?'暂无':card.empName}}</p>
                <p><span>职务：</span>{{card.empPost==""?'暂无':card.empPost}}</p>
                <p><span>问题项：</span>{{card.problemItemCode_r==""?'暂无':card.problemItemCode_r}}</p>
                <p><span>处理结果：</span>{{card.processResult==""?'暂无':card.processResult}}</p>
            </div>
        </div>

    </div>
</template>

<script>
    import * as api from "../../api/schoolTrace/index";
    import config from "utils/config";
import traceVue from './trace.vue';
    export default {
        methods: {
            getProblemItemInfo(item,problemItemCode,text){
                this.infoPopShowLoading=true;
                let obj={
                    empId:item.empId,
                    miId:this.data.id,
                    problemItemCode:problemItemCode
                }
                api.getProblemItemInfo(obj).then(r=>{
                    if(r.code==200){
                        this.card=r.data;
                        this.card.problemItemCode_r=text;
                        this.infoPopShowLoading=false;
                        this.infoPopShow=true;
                    }
                })
            },
            getInfo(){
                this.loading=true;
                let obj={
                    entityId:this.entityId,
                    date:this.time
                }
                api.getInspected(obj).then(r=>{
                        if(r.code==200&&r.data!==null){
                            this.data=r.data;
                            this.dataNull=false;
                            this.time =  r.timestamp;
                            if(this.data.bigScreeDetailsDTOList===null||this.data.bigScreeDetailsDTOList.length<=0){
                                this.data.bigScreeDetailsDTOList=[];
                            }
                            if(this.data.fileDTOList===null||this.data.fileDTOList.length<=0){
                                this.data.fileDTOList=[];
                            }
                            this.data.bigScreeDetailsDTOList.map(item=>{
                                if(item.problemItemCodeList===null||item.problemItemCodeList.length<=0){
                                    item.problemItemCodeList=[];
                                }
                            })
                        }else{
                            this.dataNull=true;
                            this.data.fileDTOList=[];
                            this.data.bigScreeDetailsDTOList=[];
                            this.data.remark='';
                        }
                        this.loading=false;
                })
            }
        },
        mounted() {
            this.schoolTraceBaseUrl=config.schoolTraceBaseUrl;
            if(this.$route.query.entityId){
                this.entityId=this.$route.query.entityId;
            }
            this.getInfo()
        },
        data() {
            return {
                infoPopShowLoading:false,
                card:{
                    empName: "",
                    empPost: "",
                    problemItemCode: "",
                    processResult: ""
                },
                infoPopShow:false,
                dataNull:false,
                loading:true,
                data:{fileDTOList:[],bigScreeDetailsDTOList:[]},
                schoolTraceBaseUrl:'',
                traceNull:require('assets/img/schoolTrace/traceNull.png'),
                time:'',
                option: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
            };
        }
    }
</script>

<style scoped lang='scss'>
*{
    color:#333;
}
.rightBox{
    width:calc(100% - 60px);
    padding: 0 30px;
    height: 100%;
    .titie{
        height: 80px;
        line-height: 80px;
        .titie_left{
            font-size:20px;
            font-weight:500;
            color:rgba(51,51,51,1);
            width: 50%;
            height: 100%;
        }
        .titie_right{
            width: 50%;
            height: 100%;
            text-align: right;
        }
    }
    .h272{
         height:calc(272px - 40px);
    }
    .h758{
         height:calc(600px - 80px);
    }
    .innerBox{
        width:calc(100% - 40px);
        padding: 20px 20px;
        background:#fff;
        border-radius:10px;
        .col66{
            color: #666;
        }
        p.innerBoxTitie{
            font-size:16px;
            color: #333;
            margin-bottom: 30px;
            span.line{
                height: 18px;
                width: 4px;
                display: inline-block;
                background: #34C5D7;
                margin-right: 10px;
                position: relative;
                top: 2px;
            }
        }
        .info{
            height: 200px;
            >div{
                width: 50%;
                height: 100%;
            }
             .baseInfo{
                p{
                    margin-bottom: 14px;
                }
            }
            .baseImg{
                li{
                    width: 110px;
                    height: 110px;
                    margin-right: 15px;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
.yes{
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    width:58px;
    height:28px;
    border-radius:4px;
    border:1px solid rgba(112,206,151,1) !important;
    color: rgba(112,206,151,1);
    cursor: pointer;
}
.no{
    border:1px solid #ED8C98 !important;
    color: #ED8C98;
}
.infoPop{
    width: 300px;
    min-height: 164px;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    left: calc((1358px - 340px) / 2);
    top: 150px;
    box-shadow: 0 0 10px #999;
    z-index: 5;
    .close{
        position:absolute;
        font-size: 18px;
        color: #666;
        right: 20px;
        top: 20px;
    }
    p{
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        span{
            color: #666;
        }
    }
}
</style>
<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>


