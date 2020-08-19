<template>
    <div class="box  relative">
        <div class="header">
            <div class="logo absolute">
                <p class="title site absolute">责任主体食品安全指数</p>
            </div>
            <p class="title mt30">{{name?name:'某某火锅店'}}</p>
        </div>
        <div class="baseInfo">
            <p class="baseTitle">基础信息</p>
            <ul class="clear_a">
                <li class="textell"><span>类型：</span>
                    <span class="text">有限责任公司(自然人投资或控股)</span>
                </li>
                <li class="textell"><span>区域：</span>
                    <span class="text">成都市双流区</span>
                </li>
                <li class="textell"><span>法人：</span>
                    <span class="text">孙永聪</span>
                </li>
                <li class="textell"><span>注册时间：</span>
                    <span class="text">2014-5-6</span>
                </li>
                <li class="textell"><span>地址：</span>
                    <span class="text">成都市双流县永安镇普林场街</span>
                </li>
                <li class="textell"><span>电话：</span>
                    <span class="text">18982234435</span>
                </li>
            </ul>
        </div>
        <div class="demo_card clear_a">
            <div class="clear_a">
                <p class="baseTitle">食安指数</p>
                <div class="chartSta clear_a">
                    <ul class="chart clear_a">
                        <li>
                            <p>75</p>
                            <p>食安指数</p>
                        </li>
                        <li></li>
                    </ul>
                </div>
                <div class="chartBox clear_a"  id="chartBox"></div>
            </div>
            <div class="clear_a">
                <p class="baseTitle">产业经营数据分析<span class="more fr">更多 ></span></p>
                <div class="statistic clear_a">
                    <div>
                        <p class="number">0</p>
                        <p class="text">过期证照</p>
                    </div>
                    <div>
                        <p class="number">1</p>
                        <p class="text">过期健康证</p>
                    </div>
                    <div>
                        <p class="number">70%</p>
                        <p class="text">溯源率</p>
                    </div>
                </div>
                <div  class="statistic clear_a">
                    <div>
                        <p class="number">90%</p>
                        <p class="text">留样率</p>
                    </div>
                    <div>
                        <p class="number">95%</p>
                        <p class="text">晨检合格率</p>
                    </div>
                    <div>
                        <p class="number">80%</p>
                        <p class="text">消毒率</p>
                    </div>
                </div>
            </div>
            <div class="clear_a">
                <p class="baseTitle">主体自律<span class="more fr">更多 ></span></p>
                <div class="contrast">
                    <ul class="clear_a">
                        <li class="textell"><span  style="color: #FFDC00;">食安培训 </span>
                            <span class="text"><span class="textSpe" style="color: #FFDC00;">210</span>小时 <i class="el-icon-bottom iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值 </span>
                            <span class="text">500</span>
                        </li>
                        <li class="textell"><span>自检自查</span>
                            <span class="text"><span class="textSpe">0</span>次<i class="el-icon-top iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值 </span>
                            <span class="text">2</span>
                        </li>
                        <li class="textell"><span>信息上报率</span>
                            <span  class="text textSpe">50%<i class="el-icon-bottom iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值</span>
                            <span class="text">70%</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="demo_card clear_a">
            <div class="clear_a">
                <p class="baseTitle">物联网智能分析</p>
                <div class="aiVideo clear_a" >
                    <div >
                        <img style="cursor: pointer;" @click="$router.push({name: 'AICamera.AIScreen'})" src="../../../assets/img/AICamera/aiImg.png" alt="">
                        <ul class="clear_a" style="margin-top: 20px">
                            <li class="textell"><span>摄像头捕获异常</span>
                                <span class="text">3</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul class="clear_a">
                            <li class="textell"><span>累计检测批次</span>
                                <span class="text">456</span>
                            </li>
                            <li class="textell"><span>不合格批次</span>
                                <span class="text">10</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="clear_a">
                <p class="baseTitle">公众监督<span class="more fr">更多 ></span></p>
                <div class="contrast">
                    <ul class="clear_a">
                        <li class="textell"><span  style="color: #4BDD3C;">网络评价 </span>
                            <span class="text"><span class="textSpe" style="color: #4BDD3C;">4.9</span><i class="el-icon-top iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值 </span>
                            <span class="text">4.5</span>
                        </li>
                        <li class="textell"><span>投诉举报</span>
                            <span class="text"><span class="textSpe">1</span>次<i class="el-icon-top iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值 </span>
                            <span class="text">3次</span>
                        </li>
                        <li class="textell"><span>信息公开度</span>
                            <span  class="text textSpe">90%<i class="el-icon-top iconColor"></i></span>
                        </li>
                        <li class="textell"><span>相比行业均值</span>
                            <span class="text">70%</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="clear_a">
                <p class="baseTitle">政府监管<span class="more fr">更多 ></span></p>
                <div class="statistic clear_a">
                    <div>
                        <p class="number">3</p>
                        <p class="text">累计检查</p>
                    </div>
                    <div>
                        <p class="number">1</p>
                        <p class="text">检查不合格</p>
                    </div>
                    <div>
                        <p class="number">0</p>
                        <p class="text">处罚记录</p>
                    </div>
                </div>
                <div class="patrolDate">
                    <ul class="clear_a">
                        <li class="textell"><span>最后一次巡查：</span>
                            <span class="text">2016年7月4日</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as echartFun from "./echarts";

    export default {
        data() {
            return {
                name:'',
                radarData:[{
                    name: '政府监管',
                    max: 100,
                    num:10,
                }, {
                    name: '物联网智能分析',
                    max: 100,
                    num:20,
                }, {
                    name: '产业经营数据分析',
                    max: 100,
                    num:15,
                }, {
                    name: '主体自律',
                    max: 100,
                    num:10,
                }, {
                    name: '公众监督',
                    max: 100,
                    num:20,
                },],
                value: [10, 20, 15, 10, 20]
            };
        },
        mounted() {
            this.name=this.$route.query.name;
            this.getRadar()
        },
        methods: {
            getRadar(){
                echartFun.echartsRadar(this.radarData,this.value,'chartBox');
            }
        }

    };
</script>

<style scoped lang='scss'>
    .box {
        width: 100%;
        min-height: 100%;
        background: #1a1f22;
        border: 1px solid #1a1f22;
        background-size: 100% 100%;
        .header {
            text-align: center;
            height: 80px;
            .logo {
                top: 30px;
                left: 63px;
                width: 380px;
                height: 62px;
                background: url("../../../assets/img/AICamera/aiDataLogo.png") no-repeat;
                .site {
                    top: 0;
                    left: 60px;
                }
            }
        }
        .baseInfo {
            width: 1800px;
            height: 206px;
            background: #1F262C;
            margin: 20px auto;
            padding: 20px 50px;
            box-sizing: border-box;
            > ul {
                padding-top: 20px;
                height: calc(100% - 20px);
                width: 100%;
                li {
                    width: 30%;
                    margin-bottom: 20px;
                    margin-right: 3%;
                    font-size: 18px;
                    font-weight: 400;
                    color: rgba(152,152,152,1);
                    line-height: 22px;
                    span {
                        width: 38%;
                        text-align: left;
                        margin-right: 2%;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    span.text {
                        width: 56%;
                        color:rgba(253,253,253,1);
                        text-align: right;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
                li:last-child{
                    margin-right: 0;
                }
            }
        }
        .demo_card{
            width: 1800px;
            margin: 20px auto;
            > div {
                height: 326px;
                background: #1F262C;
                width: calc(98% /3);
                margin-right: 1%;
                padding: 20px 50px;
                box-sizing: border-box;
                .chartSta{
                    width: 26%;
                    .chart{
                        width: 100%;
                        >li{
                            width: 60%;
                            text-align: center;
                            >p{
                                font-size:72px;
                                height: 150px;
                                font-family:Alibaba PuHuiTi;
                                font-weight:400;
                                color:rgba(255,220,0,1);
                                line-height:273px;
                                margin-top: -20px;
                            }
                            >p:last-child{
                                font-size:18px;
                                height: 17px;
                                font-family:Alibaba PuHuiTi;
                                font-weight:400;
                                color:rgba(253,253,253,1);
                                line-height:68px;
                                margin-top: 0;
                            }
                        }
                        >li:last-child{
                            text-align: center;
                            width: 70%;
                        }
                    }
                }
                .chartBox{
                    width: 350px;
                    height: 300px;
                }
            }
            > div:last-child{
                margin-right: 0;
            }
            .statistic{
                width: 100%;
                margin: 40px 0 0 0;
                > div {
                    height: 100%;
                    width: 20%;
                    margin-right: 20%;
                    text-align: center;
                    p.number {
                        font-size:41px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                        line-height:54px;
                    }
                    p.text {
                        font-size:18px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        color:rgba(124,136,146,1);
                        line-height:24px;
                    }
                }
                >div:last-child{
                    margin-right: 0;
                }
            }
            .aiVideo{
                width: 100%;
                margin: 40px 0 0 0;
                > div {
                    height: calc(100% - 20px);
                    width: 48%;
                    >img{
                        width: 230px;
                        height: 130px;
                    }
                   >ul{
                       >li{
                           width: 100%;
                           margin-bottom: 20px;
                           span {
                               width: 60%;
                               text-align: left;
                               margin-right: 2%;
                               font-size:18px;
                               font-family:Alibaba PuHuiTi;
                               font-weight:400;
                               color:rgba(255,255,255,1);
                               line-height:24px;
                               display: inline-block;
                               vertical-align: middle;
                           }
                           span.text {
                               width: 30%;
                               text-align: right;
                               font-size:36px;
                               font-family:Alibaba PuHuiTi;
                               font-weight:400;
                               color:rgba(255,255,255,1);
                               line-height:36px;
                           }
                       }
                   }
                }
                >div:nth-child(odd){
                    margin-right: 3%;
                }
            }
            .contrast{
                width: 100%;
                margin: 20px auto;
                > ul {
                    height: calc(100% - 20px);
                    width: 100%;
                    li {
                        height: 54px;
                        margin-bottom: 20px;
                        font-size:16px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        color:rgba(199,199,199,1);
                        line-height:27px;
                        span {
                            width: 37%;
                            text-align: left;
                            margin-right: 2%;
                            display: inline-block;
                            vertical-align: middle;
                        }
                        span.text {
                            width: 56%;
                            font-size:16px;
                            text-align: right;
                            font-family:Alibaba PuHuiTi;
                            font-weight:400;
                            color:rgba(199,199,199,1);
                            line-height:27px;
                        }
                        span.textSpe{
                            text-align: right;
                            font-size:36px;
                            font-family:Alibaba PuHuiTi;
                            font-weight:400;
                            color:rgba(255,255,255,1);
                            line-height:70px;
                        }
                    }
                    li:nth-child(odd){
                        width: 60%;
                    }
                    li:nth-child(even){
                        margin-top: 20px;
                        height: 24px;
                        width: 40%;
                        span {
                            width: 43%;
                        }
                        span.text {
                            width: 48%;
                        }
                    }
                    li:last-child{
                        margin-right: 0;
                    }
                }
                > ul {
                    height: calc(100% - 20px);
                    width: 100%;
                    li {
                        height: 54px;
                        margin-bottom: 20px;
                        font-size:16px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        color:rgba(199,199,199,1);
                        line-height:27px;
                        span {
                            width: 37%;
                            text-align: left;
                            margin-right: 2%;
                            display: inline-block;
                            vertical-align: middle;
                        }
                        span.text {
                            width: 56%;
                            font-size:16px;
                            text-align: right;
                            font-family:Alibaba PuHuiTi;
                            font-weight:400;
                            color:rgba(199,199,199,1);
                            line-height:27px;
                        }
                        span.textSpe{
                            text-align: right;
                            font-size:36px;
                            font-family:Alibaba PuHuiTi;
                            font-weight:400;
                            color:rgba(255,255,255,1);
                            line-height:70px;
                        }
                    }
                    li:nth-child(odd){
                        width: 60%;
                    }
                    li:nth-child(even){
                        margin-top: 20px;
                        height: 24px;
                        width: 40%;
                        span {
                            width: 43%;
                        }
                        span.text {
                            width: 48%;
                        }
                    }
                    li:last-child{
                        margin-right: 0;
                    }
                }
            }
            .patrolDate{
                width: 100%;
                margin: 100px 0 0 0;
                > ul {
                    height: calc(100% - 20px);
                    width: 100%;
                    li {
                        width: 100%;
                        margin-bottom: 20px;
                        font-size:18px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        color:rgba(210,212,222,1);
                        line-height:24px;
                        span {
                            width: 37%;
                            text-align: left;
                            margin-right: 2%;
                            display: inline-block;
                            vertical-align: middle;
                        }
                        span.text {
                            margin-right: 0;
                            width: 59%;
                            text-align: right;
                        }
                    }
                }
            }
        }
    }
    .title {
        font-size: 30px;
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        color: rgba(230, 239, 240, 1);
        line-height: 45px;
    }
    .mt30 {
        margin-top: 30px !important;
    }
    .baseTitle{
        width: 100%;
        font-size:16px;
        padding-bottom: 10px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:39px;
        border-bottom: 1px dotted #4b555b;
    }
    .more{
        font-size:16px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height:39px;
    }
    .iconColor{
        color:#97db9a;
        font-size: 16px;
        margin-left: 20px;
    }
</style>


