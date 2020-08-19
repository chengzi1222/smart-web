<template>
    <div id="AssessRank">
        <p>考核排名</p>
        <div class="clear_a btnBox">
            <div class="floatL" :class="{'active':active=='areaAssess'}" @click="active='areaAssess'" style="cursor: pointer;">辖区考核排名</div>
            <div class="floatR" :class="{'active':active=='subRisk'}"  @click="active='subRisk'" style="cursor: pointer;">主体风险排名</div>
        </div>
        <div class="echartBox">
            <div class="echart" id="areaAssess" :class="active=='areaAssess'?'echartIndex':''" >辖区考核排名</div>
            <div class="echart" id="subRisk" :class="active=='subRisk'?'echartIndex':''" >主体风险排名</div>
        </div>
        <div class="more-btn">
            <span @click="checkMore">查看更多</span>
        </div>
    </div>
</template>
<script>
    import {listDemo, getSubRisk} from 'api/xcws/warnStatistics/subjectProfile';
    import * as echartFun from "./leftEcharts";

    export default {
        data() {
            return{
                active:'areaAssess',
                areaAssessData: [],
                subRiskData: []
            }
        },
        methods: {
            getAssessRankData() {
                let dateNow = new Date();
                let year = dateNow.getFullYear();
                let mon = (dateNow.getMonth() + 1);
                let month
                if(mon < 10) {
                    month = year + '-0' + mon; // 当前月 1-9
                } else {
                    month = year + '-' + mon; // 当前月 10-12
                }
           
                listDemo().then(r => {
                    if(r.status == true) {
                        this.areaAssessData = r.data;
                        echartFun.echartsBar(this.areaAssessData, 'areaAssess');
                    }
                }).catch(e => {
                    console.log(e)
                })
                // 获取 主体风险排名
                let subRiskParams = {
                    'areaId': '',
                    'month': month,
                    'size': 8,
                    'current': 1,
                    'keyword': '',  
                    'riskRating': '',
                    'scoreOrder': 'ASC'
                }
                getSubRisk(subRiskParams).then(r => {
                    if(r.status == true) {
                        this.subRiskData = r.data.records;
                        echartFun.echartsBar(this.subRiskData, 'subRisk');
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            checkMore() {
                this.$emit("ifrShow", this.active === 'areaAssess' ? '/xcws/areaAssess' : '/xcws/subjectAssess')
            }
        },
        mounted() {
            this.getAssessRankData();
        }
    }
</script>
<style scoped lang="scss">
#AssessRank{
    width:540px;
    height:500px;
    position: fixed;
    z-index: 2;
    left: 20px;
    bottom: 20px;
    background: url('~assets/img/boxBG500.png') no-repeat center;
    >p{
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size:20px;
        color: #fff;
    }
    .btnBox{
        height: 50px;
        width: 100%;
        >div{
            width: 160px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: #CCCCCC;
            font-size: 14px;
            margin-top: 20px;
            transition: all;
            background: url('~assets/img/btnDefault.png') no-repeat center;
        }
        .floatL{
            margin-left: 20px;
        }
        .floatR{
            float: right !important;
            margin-right: 20px;
        }
        .active{
            background: url('~assets/img/btnSelected.png') no-repeat center;
            color: #fff;
        }
    }
    .echartBox{
        width: 100%;
        height: calc(100% - 80px);
        position: relative;
        .echart {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            z-index: -1;
        }
    }
    .more-btn {
        z-index: 9;
        width: 500px;
        height: 30px;
        margin-left: 20px;
        position: absolute;
        bottom: 18px;
        background-color: #142128;
        opacity:0.6;
        text-align: center;
        span {
            cursor: pointer;
            line-height: 30px;
            color: #CCCCCC;
            font-size: 14px;
        }
    }
}
.echartIndex {
    opacity: 1 !important;
    z-index: 6 !important;
}
</style>
