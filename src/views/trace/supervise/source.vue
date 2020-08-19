<template>
    <div class="bigbox">
    	<div class="page-tilt">
    	    <b></b><span>来源检测</span><Back></Back>
    	</div>
        <div class="sourceBox">
            <ul class="lisBox">
                <li v-for="item in dataLis" :class="item.guid == orderDetailGuid?'li':''" @click="lisClick(item.guid)">
                    {{item.pdtName}}
                </li>
            </ul>
            <div v-if="!dataIs" style="text-align: center;padding-top: 50px;width: 100%;">
                暂无数据
            </div>
            <div class="sourceSmallBox" v-if="dataPage!=null && dataIs">
                <div class="titImg">
                    <img :src="dataPage.syInfo.pdtImg" alt="">
                    <h3>{{dataPage.syInfo.pdtName}}</h3>
                </div>
                <div class="borBox">
                    <div class="qq"></div>
                    <h2>采购环节</h2>
                    <div class="contBox">
                        <p><span>单位名称：</span>{{dataPage.syInfo.buyerName}}</p>
                        <p><span>单位地址：</span>{{dataPage.syInfo.buyerAddr}}</p>
                        <p><span>下单时间：</span>{{dataPage.syInfo.orderTime}}</p>
                        <p><span>收货时间：</span>{{dataPage.order.dates}}</p>
                    </div>
                </div>
                <div class="borBox">
                    <div class="qq"></div>
                    <h2>配送环节</h2>
                    <div class="contBox">
                        <p><span>单位名称：</span>{{dataPage.syInfo.sellerName}}</p>
                        <p><span>单位地址：</span>{{dataPage.syInfo.sellerName}}</p>
                        <p><span>配送时间：</span>{{dataPage.order.date}}</p>
                        <p><span>配送人：</span>{{dataPage.order.realName}}</p>
                    </div>
                </div>
                <div class="borBox">
                    <div class="qq"></div>
                    <h2>来源环节</h2>
                    <div class="contBox">
                        <p><span>来源类型：</span>{{dataPage.syInfo.sourceType_}}</p>
                        <p><span>来源名称：</span>{{dataPage.syInfo.sourceName}}</p>
                        <p><span>来源区域：</span><span v-if="dataPage.syInfo.areaName">{{dataPage.syInfo.areaName}}</span><span v-if="!dataPage.syInfo.areaName">--</span></p>
                        <p><span>来源地址：</span>{{dataPage.syInfo.sourceAddr}}</p>
                        <!-- 索票索证，图片要能放大预览 -->
                        <p v-if="dataPage.syInfo.tradeCerImg
                                   || dataPage.syInfo.spybCerImg" class="contBox">
                            <span>索票索证：</span>
                            <a v-if="dataPage.syInfo.tradeCerImg" :href="dataPage.syInfo.tradeCerImg" target="_blank">
                                <img :src="dataPage.syInfo.tradeCerImg" alt="">
                            </a>
                            <a v-if="dataPage.syInfo.spybCerImg" :href="dataPage.syInfo.spybCerImg" target="_blank">
                                <img :src="dataPage.syInfo.spybCerImg" alt="">
                            </a>
                        </p>
                    </div>
                </div>
                <!-- 有检测数据才显示检测环节 -->
                <div class="borBox" v-if="dataPage.detectionInfo.detecItem">
                    <div class="qq"></div>
                    <h2>检测环节</h2>
                    <div class="contBox">
                        <p><span>检测类型：</span><span v-if="dataPage.detectionInfo.detecItem">{{dataPage.detectionInfo.detecItem}}</span><span v-if="!dataPage.detectionInfo.detecItem">--</span></p>
                        <p><span>检测项目：</span><span v-if="dataPage.detectionInfo.detecItem">{{dataPage.detectionInfo.detecItem}}</span><span v-if="!dataPage.detectionInfo.detecItem">--</span></p>
                        <p v-if="!cao"><span>标准值：</span><span v-if="dataPage.detectionInfo.standardVal">{{dataPage.detectionInfo.standardVal}}%</span><span v-if="!dataPage.detectionInfo.standardVal">--</span></p>
                        <p v-if="!cao"><span>实测值：</span><span v-if="dataPage.detectionInfo.actualVal">{{dataPage.detectionInfo.actualVal}}%</span><span v-if="!dataPage.detectionInfo.actualVal">--</span></p>
                        <p><span>检测结果：</span>
                            <span v-if="cao && dataPage.detectionInfo.detecResult == '合格'">(阴性){{dataPage.detectionInfo.detecResult}}</span>
                            <span v-if="cao && dataPage.detectionInfo.detecResult == '不合格'">(阳性){{dataPage.detectionInfo.detecResult}}</span>
                            <span v-if="!cao && dataPage.detectionInfo.detecResult">{{dataPage.detectionInfo.detecResult}}</span>
                            <span v-if="!cao && dataPage.detectionInfo.length <= 0">--</span>
                        </p>
                        <p><span>检测时间：</span><span v-if="dataPage.detectionInfo.uploadTime">{{dataPage.detectionInfo.uploadTime}}</span><span v-if="!dataPage.detectionInfo.uploadTime">--</span></p>
                        <p><span>检测人：</span><span v-if="dataPage.detectionInfo.detecPerson">{{dataPage.detectionInfo.detecPerson}}</span><span v-if="!dataPage.detectionInfo.detecPerson">--</span></p>
                        <p><span>检测单位：</span><span v-if="dataPage.detectionInfo.sellerName">{{dataPage.detectionInfo.sellerName}}</span><span v-if="!dataPage.detectionInfo.sellerName">--</span></p>
                    </div>
                </div>
                <!-- 有检测报告图片或者有检测数据才显示检测报告一栏-->
                <div class="borBox borNone" v-if="dataPage.syInfo.detecCerImg || dataPage.detectionInfo.detecItem">
                    <div class="qq" style="left: -7px;"></div>
                    <h2>检测报告</h2>
                    <!-- 检测报告图片，优先显示图片，图片要能放大预览-->
                    <div class="contBox" v-if="dataPage.syInfo.detecCerImg">
                      <a v-if="dataPage.syInfo.detecCerImg" :href="dataPage.syInfo.detecCerImg" target="_blank">
                          <img :src="dataPage.syInfo.detecCerImg">
                      </a>
                    </div>
                    <!-- 检测报告表格, 虽然无检测报告图片，但是有检测数据时-->
                    <div class="contBox report" v-if="!dataPage.syInfo.detecCerImg && dataPage.detectionInfo.detecItem">
                        <h4 class="report-title">检测报告单</h4>
                        <div class="report-item">
                          <span>配送单位：{{dataPage.syInfo.sellerName}}</span>
                          <span>检测项目：{{dataPage.detectionInfo.detecType}}</span>
                          <span>检测日期：{{dataPage.detectionInfo.detecTime.slice(0,4)+'年'+dataPage.detectionInfo.detecTime.slice(5,7)+'月'+dataPage.detectionInfo.detecTime.slice(8,10)+'日'}}</span>
                        </div>
                        <!-- 检测报告表格 -->
                        <div class="report-table">
                          <div class="report-header clearfix">
                            <span>样品名称</span>
                            <span>来源</span>
                            <span>检查结果(抑制率)%</span>
                            <span>判定结果</span>
                          </div>
                          <div class="report-content clearfix">
                            <span>{{dataPage.detectionInfo.pdtName}}</span>
                            <span>{{dataPage.syInfo.sourceName}}</span>
                            <span>{{dataPage.detectionInfo.actualVal}}</span>
                            <span>{{dataPage.detectionInfo.detecResult}}</span>
                          </div>
                        </div>
                        <div class="fr mt20">检测员：<span style="border-bottom: 1px solid #6D7787; padding: 0 50px;">{{dataPage.detectionInfo.detecPerson}}</span></div>
                        <div class="declaration clearfix">
                          <span class="fl">声明：</span>
                          <div class="fl">
                            <p>1. 本报告自检测之日起1日内有效；</p>
                            <p>2. 本检测室严格按照国际GB/T 5009.199-2003进行检测, 抑制率<50%为合格, 50%为不合格；</p>
                            <p>3. 本报告仅对样品负责。</p>
                          </div>
                        </div>
                        <div class="stamp">
                          <img src="../../../assets/img/stamp.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as plan from "api/trace/supervise"
import Back from 'utils/back.vue'       //返回上一个页面按钮
export default {
    methods: {
        getLisData(){
            let form = new FormData();
            form.append('guid',this.guid);//'00040F3BAD3043D4AC444A536BC4D1A1');
            plan.postOdlist(form).then(d => {
                if(d.data){
                    this.dataLis = d.data;
                }
            })
        },
        getSourceData(){
            let form = new FormData();
            form.append('guid',this.guid);//'E6C750EBAED34F059AFB057C9237F257');
            form.append('orderDetailGuid',this.orderDetailGuid);//'1B5E9EE0DBE34A768E72C1B879F27360');
            plan.postSuy(form).then(d => {
                if (JSON.stringify(d.data.syInfo) != '{}') {
                    this.dataIs = true;
                }else{
                    this.dataIs = false;
                }
                if(d.data){
                    this.dataPage = d.data;
                }
            })
        },
        lisClick(guid){
            this.orderDetailGuid = guid;
            this.getSourceData();
        }
    },
    mounted() {//async
        if (this.$store.getters.user.realName == "顺点-曹建") {
            this.cao = true;
        }
        this.guid = this.$route.query.Orderguid;
        this.orderDetailGuid = this.$route.query.DetailGuid;
        // debugger
        this.getLisData();
        this.getSourceData();
    },
    data() {
        return {
            dataIs:true,
            dataLis:null,
            dataPage:null,
            subName:'',
            guid:'',
            orderDetailGuid:'',
            cao:false
        };
    },
    components: {
        Back
    }
}
</script>

<style scoped lang="scss">
    .bigbox{
        height: auto;
        margin-bottom: 20px;
    }
    .sourceBox{
        height: calc(100% - 80px);
        min-height: 500px;
        border: 1px solid #C2CAD2;
        display: flex;
        margin-top: 20px;
    }
    .lisBox{
        width: 220px;
        border-right: 1px solid #ccc;
    }
    .lisBox li{
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size: 14px;
        color: #393939;
    }
    .lisBox .li{
        background: #DFE7F0;
    }
    .sourceSmallBox{
        width: calc(100% - 250px);
        border-left: 1px solid #C2CAD2;
        height: 100%;
        padding-left: 30px;
    }
    .titImg{
        display: flex;
        margin: 20px 0;
    }
    .titImg img{
        width: 70px;
        height: 70px;
        vertical-align: middle;
    }
    .titImg h3{
        font-size: 20px;
        color: #393939;
        margin-left: 20px;
        margin-top: 20px;
    }
    .borBox{
        margin-left: 7px;
        padding-left: 27px;
        border-left: 4px solid #0DB5EF;
        position: relative;
        float: left;
        width: 51%;
    }
    .borNone{
        border: none;
    }
    .borBox .qq{
        border: 4px solid #0DB5EF;
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        box-sizing: border-box;
        left: -11px;
        background: #fff;
    }
    .borBox h2{
        font-size: 18px;
        color: #393939;
    }
    .contBox{
        font-size: 14px;
        color: #6D7787;
        line-height: 24px;
        margin:8px 0 20px;
    }
    .contBox img{
        width: 260px;
        height: 160px;
        border-radius: 7px;
    }
    .table-div{
        margin: 20px 0;
        text-align: center;
    }
    .report {
      width: 150%;
      padding: 40px;
      border: 1px solid #393939;
      box-sizing: border-box;
      position: relative;
      .report-title {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
      }
      .report-item {
        font-size: 12px;
        margin-top: 40px;
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
      }
      .report-table {
        text-align: center;
        vertical-align: middle;
        margin-top: 20px;
        .report-header {
          span {
            font-size: 14px;
            font-weight: 700;
          }
        }
        .report-content {
          span {
            font-size: 12px;
            margin-top: -1px;
          }
        }
        .report-header,.report-content {
          span {
            text-align: center;
            float: left;
            height: 60px;
            line-height: 60px;
            border: 1px solid #6D7787;
            box-sizing: border-box;
          }
          span:first-child {
            width: 15%;
          }
          span:nth-child(2) {
            width: 40%;
            margin-left: -1px;
          }
          span:nth-child(3) {
            width: 30%;
            margin-left: -1px;
          }
          span:last-child {
            width: 15%;
            margin-left: -1px;
          }
        }
      }
      .stamp {
        position: absolute;
        right: 3%;
        top: 50%;
        z-index: 999;
        img {
          width: 100%;
          object-fit: contain;
        }
      }
      .declaration {
        margin-top: 100px;
      }
      .clearfix {
        zoom: 1;
      }
      .clearfix:after {
        content: "";
        display: block;
        height: 0px;
        clear: both;
        visibility: hidden;
      }
    }
</style>
