<template>
    <div class="gaoxinHome">
        <div class="topTitle">高新区市场监督管理局智慧监管系统</div>
        <div class="content">
            <div class="innerBg"> </div>
            <div class="innerBox">
                <ul class="menTitle">
                    <li v-for='(item,index) in arr' :key="index" @click="go(item)">{{item.title}}</li>
                </ul>
                <ul class="globe clear_a relative">
                    <li v-for='(item,index) in arr' :key="index" :class="'absolute menu menu'+index">
                        <div class="icon"><img :src='"../../src/assets/img/gaoxinHome/icon"+(index+1)+".png"'>
                        </div>
                        <div class="textC"> {{item.title}}</div>
                        <div :class="'absoluteTip line'+index">
                            <div class="absolute"></div>
                        </div>
                        <ul :class="'absoluteTip  tip'+index">
                            <li v-for='(item2,index2) in item.detail' :key="index2">
                                <img src="../../src/assets/img/gaoxinHome/circle2.png" alt="">
                                {{item2}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>



        </div>
    </div>
</template>

<script>
    export default {
        created() {

        },
        computed: {

        },
        mounted() {
            this.$store.dispatch('getMenus','FOOD');
        },
        data() {
            return {
                arr: [{
                    'title': '投诉监管系统',
                    'url': '/guard/complaint/list',
                    'detail': ['投诉反馈', '处理情况']
                }, {
                    'title': '预警及监管考核',
                    'url': '/xcwsWarn/food',
                    'detail': ['辖区考核', '主体考核', '溯源预警', '检测异常预警', '监管检察预警', '后厨管理预警', 'AI摄像头预警']
                }, {
                    'title': '智慧监管',
                    'url': '/biz/patrol/situation/statistics',
                    'detail': ['日常巡查', '专项巡查', '限期整改', '行政执法', '双随机', '重大活动保障', '自检自查']
                }, {
                    'title': '高风险综合管理',
                    'url': '/gaoxinHighRisk',
                    'detail': ['高新区高风险大数据平台', '主体概况', '风险分布', '考核排名', '风险处理情况']
                }, {
                    'title': '主体数据库',
                    'url': '/sub/statistics/restaurant/index',
                    'detail': ['主体概况', '生产主体', '流通主体', '餐饮主体', '三小管理']
                }, {
                    'title': '明厨亮灶',
                    'url': '/camera',
                    'detail': ['直播列表', '设备管理', '人脸库', '短信告警']
                }, {
                    'title': '大数据展示',
                    'url': '/bigData/index',
                    'detail': ['主体全局分布', '主体统计分布', '城市大脑', '视频直播', '溯源监控']
                }, ]
            };
        },
        methods: {
            go(item){
                this.$router.push(item.url)
            }
        },
        watch: {}
    };
</script>

<style lang="scss" scoped>
    @keyframes hover_display {
        0% {
            opacity: 0
        }

        100% {
            opacity: 1;
        }
    }

    .gaoxinHome {
        width: calc(100% - 40px);
        height: calc(100% - 60px);
        padding: 40px 20px 20px;
        background: url('~assets/img/gaoxinHome/bg.png') no-repeat;
        background-size: 100% 100%;
        // box-sizing: border-box;

        .topTitle {
            height: 40px;
            line-height: 40px;
            font-size: 40px;
            font-family: zcool-gdh;
            font-weight: 400;
            text-align: center;
            color: rgba(59, 216, 255, 1);
            background: url('~assets/img/gaoxinHome/topTitle.png') no-repeat;
            background-size: 100% 100%;
            margin-bottom: 40px;
        }

        .content {
            height: calc(100% - 80px);
            width: 100%;
            background: url('~assets/img/gaoxinHome/contentBg.png') no-repeat;
            background-size: 100% 100%;
            position: relative;

            >div {
                position: absolute;
                left: 0;
                top: 0;
            }

            .innerBg {
                height: 100%;
                width: 100%;
                background: url('https://stg-res.ybveg.com/backup/earthline.gif') no-repeat center -150px;
            }

            .innerBox {
                width: calc(100% - 60px);
                height: calc(100% - 60px);
                padding: 30px;
                z-index: 1;
            }

            .menTitle {
                width: calc(100% - 260px);
                height: 50px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                margin: 0 auto;

                li {
                    width: 180px;
                    height: 100%;
                    font-size: 18px;
                    font-family: Alibaba PuHuiTi;
                    font-weight: 400;
                    color: rgba(58, 216, 255, 1);
                    line-height: 50px;
                    height: 50px;
                    text-align: center;
                    background: url('~assets/img/gaoxinHome/menTitle.png') no-repeat;
                    background-size: 100% 100%;
                    cursor: pointer;
                    transition: all 0.8s;

                    &:hover {
                        background: url('~assets/img/gaoxinHome/menTitleActive.png') no-repeat;
                        background-size: 100% 100%;
                        color: #F4F355;
                    }
                }
            }

            .globe {
                width: 100%;
                height: calc(100% - 50px);

                li.menu {
                    height: 210px;
                    width: 160px;
                    // cursor: pointer;

                    .icon {
                        height: 160px;
                        width: 160px;
                        margin-bottom: 10px;

                        img {
                            height: 100%;
                            width: 1005;
                        }
                    }

                    .textC {
                        line-height: 40px;
                        height: 40px;
                        color: #3AD8FF;
                        background: url('~assets/img/gaoxinHome/titleBg.png') no-repeat;
                        background-size: 100% 100%;
                    }

                    .absoluteTip {
                        position: absolute;
                        display: none;

                        >div {
                            width: 24px;
                            height: 24px;
                            top: -12px;
                            right: -21px;
                            background: url('~assets/img/gaoxinHome/circle1.png') no-repeat;
                            background-size: 100% 100%;
                        }

                        >li {
                            padding-bottom: 20px;
                            line-height: 20px;
                            font-size: 18px;
                            font-family: Alibaba PuHuiTi;
                            font-weight: 400;
                            color: rgba(123, 241, 255, 1);

                            img {
                                position: relative;
                                top: 4px;
                                margin-right: 20px;
                            }
                        }
                    }

                    &:hover .absoluteTip {
                        animation: hover_display 0.8s;
                        display: block;
                    }

                    .line0 {
                        width: 204px;
                        height: 64px;
                        background: url('~assets/img/gaoxinHome/line1.png') no-repeat;
                        background-size: 100% 100%;
                        top: -72px;
                        left: 76px;
                        z-index: 1;

                    }

                    .tip0 {
                        width: 170px;
                        height: 92px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg1.png') no-repeat;
                        background-size: 100% 100%;
                        top: -135px;
                        left: 288px;
                    }

                    .line1 {
                        width: 62px;
                        height: 240px;
                        background: url('~assets/img/gaoxinHome/line2.png') no-repeat;
                        background-size: 100% 100%;
                        top: -246px;
                        left: 82px;
                        z-index: 1;

                    }

                    .tip1 {
                        width: 200px;
                        height: 306px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg2.png') no-repeat;
                        background-size: 100% 100%;
                        top: -415px;
                        left: 151px;
                    }

                    .line2 {
                        width: 64px;
                        height: 232px;
                        background: url('~assets/img/gaoxinHome/line6.png') no-repeat;
                        background-size: 100% 100%;
                        top: -238px;
                        left: 18px;
                        z-index: 1;

                        >div {
                            top: -12px;
                            left: -22px;
                            right: auto;
                        }

                    }

                    .tip2 {
                        width: 200px;
                        height: 315px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg2.png') no-repeat;
                        background-size: 100% 100%;
                        top: -412px;
                        left: -221px;
                    }

                    .line3 {
                        width: 62px;
                        height: 264px;
                        background: url('~assets/img/gaoxinHome/line2.png') no-repeat;
                        background-size: 100% 100%;
                        top: -272px;
                        left: 82px;
                        z-index: 1;

                        >div {
                            top: -12px;
                            right: -21px;
                        }

                    }

                    .tip3 {
                        width: 290px;
                        height: 225px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg4.png') no-repeat;
                        background-size: 100% 100%;
                        top: -400px;
                        left: 152px;
                    }

                    .line4 {
                        width: 62px;
                        height: 244px;
                        background: url('~assets/img/gaoxinHome/line2.png') no-repeat;
                        background-size: 100% 100%;
                        top: -252px;
                        left: 79px;
                        z-index: 1;

                        >div {
                            top: -12px;
                            right: -21px;
                        }

                    }

                    .tip4 {
                        width: 170px;
                        height: 222px;
                        padding-top: 28px;
                        padding-left: 30px;
                        top: -380px;
                        left: 150px;
                        background: url('~assets/img/gaoxinHome/popBg5.png') no-repeat;
                        background-size: 100% 100%;
                    }

                    .line5 {
                        width: 60px;
                        height: 244px;
                        background: url('~assets/img/gaoxinHome/line6.png') no-repeat;
                        background-size: 100% 100%;
                        top: -250px;
                        left: 27px;
                        z-index: 1;

                        >div {
                            top: -12px;
                            left: -21px;
                            right: auto;
                        }

                    }

                    .tip5 {
                        width: 170px;
                        height: 181px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg6.png') no-repeat;
                        background-size: 100% 100%;
                        top: -354px;
                        left: -180px;
                    }

                    .line6 {
                        width: 200px;
                        height: 64px;
                        background: url('~assets/img/gaoxinHome/line7.png') no-repeat;
                        background-size: 100% 100%;
                        top: -72px;
                        left: -117px;
                        z-index: 1;

                        >div {
                            top: -12px;
                            left: -21px;
                            right: auto;
                        }

                    }

                    .tip6 {
                        width: 170px;
                        height: 227px;
                        padding-top: 28px;
                        padding-left: 30px;
                        background: url('~assets/img/gaoxinHome/popBg7.png') no-repeat;
                        background-size: 100% 100%;
                        top: -199px;
                        left: -326px;
                    }
                }

                //w1820,h830
                .menu0 {
                    left: 3.3%;
                    top: 29%;
                }

                .menu1 {
                    left: 10%;
                    top: 61%;
                }

                .menu2 {
                    left: 25%;
                    top: 53%;
                }

                .menu3 {
                    left: 45%;
                    top: 71%;
                }

                .menu4 {
                    right: 25%;
                    top: 53%;
                }

                .menu5 {
                    right: 10%;
                    top: 61%;
                }

                .menu6 {
                    right: 3.3%;
                    top: 29%;
                }
            }



        }
    }
</style>