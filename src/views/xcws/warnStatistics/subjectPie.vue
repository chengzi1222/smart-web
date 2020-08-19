<template>
    <div id="subjectPie">
       <p>主体概况</p>
       <div class="clear_a btnBox">
           <div class="floatL" :class="{'active':active==='subType'}" @click="active='subType'" style="cursor: pointer;">主体类型分布</div>
           <div class="floatR" :class="{'active':active==='risk'}"  @click="active='risk'" style="cursor: pointer;">风险等级分布</div>
       </div>
       <div class="echartBox">
            <div class="echart" id="subType" :class="active=='subType'?'echartIndex':''" >主体类型分布</div>
            <div class="echart" id="risk" :class="active=='risk'?'echartIndex':''" >风险等级分布</div>
       </div>
    </div>
</template>

<script>
    import * as subjectProfile from 'api/xcws/warnStatistics/subjectProfile';
    import * as echartFun from "./leftEcharts";
    export default {
        data() {
            return{
                active:'subType',
                subTypeData: [],
                riskData: []
            }
        },
        methods: {
            getSubSurveyData() {
                subjectProfile.getSubjectDtr().then(r => {
                    if(r.status === true) {
                        this.subTypeData = r.data;
                        echartFun.echartsDoughnut(this.subTypeData, 'subType');
                    }
                }).catch(e=>{})
                subjectProfile.getRiskLevelDtr().then(r => {
                    if(r.status === true) {
                        this.riskData = r.data;
                        echartFun.echartsDoughnut(this.riskData, 'risk');
                    }
                }).catch(e=>{})
            }
        },
        mounted() {
            this.getSubSurveyData();
        },
    }
</script>
<style scoped lang="scss">
#subjectPie{
    width:540px;
    height:430px;
    position: fixed;
    z-index: 2;
    left: 20px;
    top: 110px;
    background: url('~assets/img/boxBG.png') no-repeat center;
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
}

.echartIndex {
    opacity: 1 !important;
    z-index: 6 !important;
}
</style>
