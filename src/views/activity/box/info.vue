<style lang="sass">
    .brN .is-leaf {
        border-right: 0;
    }

    .brN tr td {
        border-right: 0;
    }

    .brN tr td[colspan="1"] {
        border-right: 1px solid #ebeef5;
    }

    /*.brN .el-table__body-wrapper{
        max-height: 350px;
    }*/
    .brN tr:hover>td {
        background-color: #fff !important;
    }

    .titShow .el-table__header-wrapper {
        display: block;
    }

    .firsTeit .el-table__header-wrapper {
        display: block;
    }

    .mT35 .el-table {
        border-top: none !important;
    }

    .mT35 .firsTeit {
        border-top: 1px solid #ebeef5 !important;
    }
</style>
<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
        class="user-box">
        <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">盒饭检查记录详情</span>
        </div>
        <div class="container" @click="ifbig(-1)">
            <!-- 左边信息悬浮栏 -->
            <div class="left-info">
                <ul class="main-block">
                    <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
                        <p class="floatL left">{{item.title}}</p>
                    </li>
                </ul>
            </div>
            <!-- 左边信息悬浮栏 end-->
            <div class="right-info">
                <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <!-- 基本信息 -->
                    <toggle-form title="基本信息">
                        <div class="content" v-if="basicInfoData">
                            <div class="row">
                                <el-form-item label="任务名称:" prop="">
                                    <span>{{basicInfoData.taskName}}</span>
                                    <a href="javascript:;" @click="$router.push({name: 'activity.taskInfo',query: {'id': basicInfoData.taskId}})">查看任务详情</a>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="主体名称:" prop="">
                                    <span>{{basicInfoData.entityName}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="许可证备案号:" prop="">
                                    <span>{{basicInfoData.licence}}</span>
                                </el-form-item>
                                <el-form-item label="检查记录编号:" prop="">
                                    <span>{{basicInfoData.recordNo}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="经营地址:" prop="">
                                    <span>{{basicInfoData.realityAddr}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="检查地址:" prop="">
                                    <span v-if="patrolRecordAddressIsShow">{{basicInfoData.address}}</span>
                                    <span v-else>暂无</span>
                                    <el-button v-if="patrolRecordAddressIsShow" type="text" @click="mapAddressVisible = true">查看地图坐标</el-button>
                                    <el-dialog v-if="patrolRecordAddressIsShow" :visible.sync="mapAddressVisible" :modal-append-to-body="false" width="60%">
                                        <slot slot="title">
                                            <!-- <h1>{{basicInfoData.entityName}}:</h1> -->
                                            {{basicInfoData.entityName}} <br /> {{basicInfoData.address}}
                                        </slot>
                                        <!-- <footer slot="footer">
                                    <h1 align="center">footer</h1>
                                  </footer> -->
                                        <div style="height: 300px;">
                                            <address-map v-if="patrolRecordAddressIsShow" :lng="basicInfoData.lng" :lat="basicInfoData.lat">
                                            </address-map>
                                        </div>
                                    </el-dialog>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="车牌号:" prop="">
                                    <span>{{basicInfoData.carNo}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="押送人员:" prop="">
                                    <span>{{basicInfoData.userName}}</span>
                                </el-form-item>
                                <el-form-item label="身份证:" prop="">
                                    <span>{{basicInfoData.userNo}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="检查日期:" prop="">
                                    <span>{{basicInfoData.examineDate}}</span>
                                </el-form-item>
                                <el-form-item label="加工时间:" prop="">
                                    <span>{{basicInfoData.processTime}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="出发时间:" prop="">
                                    <span>{{basicInfoData.departtime}}</span>
                                </el-form-item>
                                <el-form-item label="到展时间:" prop="">
                                    <span>{{basicInfoData.arriveTime}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="检查时间:" prop="">
                                    <span>{{basicInfoData.examineTime}}</span>
                                </el-form-item>
                                <el-form-item label="监督人员:" prop="">
                                    <span>{{basicInfoData.superviseName}}</span>
                                </el-form-item>
                            </div>
                        </div>
                    </toggle-form>

                    <!-- 检查项 -->
                    <toggle-form title="检查信息">
                        <div class="mT35" v-if="basicInfoData && basicInfoData.contexts">
                            <el-table :data="basicInfoData.contexts" :border="true" :resizable="true" class="table-div titShow">
                                <el-table-column type="index" min-width="50" label="序号"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="examineContextName" label="检查内容" width="250"></el-table-column>
                                <el-table-column show-overflow-tooltip prop="qual" label="是否符合" width="80"></el-table-column>
                                <el-table-column show-overflow-tooltip label="扩展项" width="200">
                                    <template slot-scope="scope">
                                        {{scope.row.examineContextSimpleName ? scope.row.examineContextSimpleName + ':' + scope.row.examineData : '无'}}
                                    </template>
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
                                <el-table-column label="附件" width="160">
                                    <template slot-scope="scope">
                                        <div class="accessoryList" v-if="scope.row.fileList.length>0">
                                            <span class="movePoin" @mouseover.stop="accessoryList($event,scope.row)" @mouseout="accessoryListElse"><i
                                                    class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </toggle-form>

                    <!-- 检查结果 -->
                    <toggle-form title="检查结果">
                        <div class="content" v-if="basicInfoData">
                            <div class="row">
                                <el-form-item label="检查结果:" prop="">
                                    <span>{{basicInfoData.resultStr}}</span>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="处理方式：" prop="">
                                    <span>{{basicInfoData.treatStr}}</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="检查备注:" prop="">
                                    <span v-if="basicInfoData.remark" class="over-y">{{basicInfoData.remark}}</span>
                                    <span v-if="!basicInfoData.remark">无</span>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="拍照留证:" prop="">
                                    <div class="imgbox" v-if="basicInfoData.proveFileList.length >= 1">
                                        <div v-for="(item,index) in basicInfoData.proveFileList" @click.stop="ifbig(item.fileId)" class="imgdiv">
                                            <img :src="item.fileId" alt="">
                                            <span>预览</span>
                                        </div>
                                    </div>
                                    <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                                        <img :src="bigImgSrc">
                                    </div>
                                    <div v-if="basicInfoData.proveFileList.length == 0">
                                        <span>无</span>
                                    </div>
                                </el-form-item>
                            </div>

                            <div class="row mRno">
                                <el-form-item label="企业电子签名：" prop="">
                                    <span v-if="basicInfoData.isCoordinate === 'NO'">企业拒绝配合</span>
                                    <span v-if="basicInfoData.isCoordinate === 'YES'">企业配合</span>
                                    <div v-if="basicInfoData.isCoordinate === 'YES' && basicInfoData.enterpriseFile && basicInfoData.enterpriseFile.fileId" @click.stop="ifbigq()"
                                        class="imgdiv" :class="ifbigqy?'imgbig':''">
                                        <img :src="basicInfoData.enterpriseFile.fileId" alt="">
                                        <span>预览</span>
                                    </div>
                                </el-form-item>
                            </div>

                            <div class="row mRno">
                                <el-form-item label="监督人员电子签名：" prop="">
                                    <div v-if="basicInfoData.supervisFile" @click.stop="ifbigc()" class="imgdiv" :class="ifbigcs?'imgbig':''">
                                        <img :src="basicInfoData.supervisFile.fileId" alt="">
                                        <span>预览</span>
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
                    </toggle-form>

                </el-form>
            </div>
        </div>


        <!-- 底部按钮 -->
        <div class="foot-btn" style="z-index:1">
            <div>
                <el-button style="width:100px;" @click="back">返回</el-button>
                <el-button style="width:100px;" @click="printRecord(examineId, true)">打印预览</el-button>
                <el-button style="width:100px;" @click="printRecord(examineId, false)">打印</el-button>
            </div>
        </div>

        <!-- 附件列表 -->
        <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseover.stop="accessoryListIf = true" @mouseout="accessoryListIf = false">
            <p v-for="item in itemPicList" @click="showPic(item.fileId)">
                <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
                    {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
                </a>
            </p>
        </div>
        <popup-pic v-if="showPicIf" @close="closePopupBody">
            <img :src="this.picSrc" style="max-height: 500px;" />
        </popup-pic>

        <!-- 打印组件 -->
        <PrintPatrol ref="PrintPatrol" :resultData="infoData" :patrolType="'重大活动保障盒饭检查'">
        </PrintPatrol>

    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue"
    import scroll from "utils/scroll"
    import addressMap from "views/patrol/project/patrolRecordAddressMap"
    import popupPic from 'components/popup/PopupPic'
    import { info } from 'api/activity/box'
    import { doPrintRecord } from 'utils/print/doPrint.js'
    import PrintPatrol from './printPatrol.vue'

    export default {
        components: {
            ToggleForm,
            addressMap,
            popupPic,
            PrintPatrol
        },
        mounted() {
            scroll.call(this, 'slideIndex', 0, 50);
            this.examineId = this.$route.query.examineId;
            this.initData();
        },
        methods: {
            ifbig(item) {
                let i = this.pathFile + item
                if (this.bigImgSrc == null || this.bigImgSrc != i) {
                    this.bigImgSrc = i;
                    this.showBigPic = true;
                } else {
                    this.bigImgSrc = null;
                }
                if (item == -1) {
                    this.showBigPic = false;
                }
            },
            ifbigq() {
                this.ifbigqy = !this.ifbigqy;
            },
            ifbigc() {
                this.ifbigcs = !this.ifbigcs
            },
            initData() {
                info(this.examineId).then(r => {
                    this.basicInfoData = r.data
                    if (r.data.address && r.data.lng && r.data.lat) {
                        this.patrolRecordAddressIsShow = true
                    }
                })
            },
            back() {
                this.$router.go(-1);
            },
            //鼠标移入显示附件列表
            accessoryList(_e, content) {
                let event = _e ? _e : window.event;
                this.accessoryListIf = true;
                this.imgNameStyle.top = event.clientY + 1 + 'px';
                this.imgNameStyle.left = event.clientX - 215 + 'px';
                this.itemPicList = content.fileList;
            },
            //鼠标移除隐藏附件列表
            async accessoryListElse() {
                this.accessoryListIf = false;
                //          this.itemPicList = [];
            },
            //显示巡查项图片
            showPic(picSrc) {
                this.picSrc = picSrc;
                this.showPicIf = true;
            },
            //关闭巡查项图片
            closePopupBody() {
                this.showPicIf = false;
            },
            /* 打印 */
            async printInitData(id) {
                this.qrcodeId = id
                await info(id).then(r => {
                    this.infoData = r.data
                    let names = this.infoData.deptName.split(',')
                    let set = new Set()
                    names.forEach(element => {
                        set.add(element)
                    })
                    let deptNameArray = new Array()
                    set.forEach(element => {
                        deptNameArray.push(element)
                    })
                    this.infoData.deptName = deptNameArray.join(',')
                    this.infoData.sum = this.infoData.contexts.length
                    let noQual = 0
                    let qualArray = new Array()
                    let qualStr = new Array()
                    this.infoData.contexts.forEach(element => {
                        if (element.qual == '否') {
                            noQual++
                        } else {
                            qualArray.push(element)
                            qualStr.push(element.no)
                        }
                    })
                    this.infoData.qualStr = qualStr.join(',')
                    this.infoData.qualArray = qualArray
                    this.infoData.noQual = noQual
                    console.log(this.infoData);
                })
            },

            async printRecord(id, isPreview) {
                this.loading = true
                await this.printInitData(id)
                this.$refs.PrintPatrol.printStyle(id)
                setTimeout(() => {
                    doPrintRecord(isPreview)
                    setTimeout(() => {
                        this.loading = false
                    }, 1000)
                }, 2000)
            }
        },
        data() {
            return {
                noPassScore: 0,
                patrolRecordAddressIsShow: false,
                mapAddressVisible: false,
                slideIndex: -1,
                pathFile: "",
                checkboxGroup1: [],
                ruleForm: {
                    name: "",
                    checkboxGroup1: []
                },
                // 左边悬浮栏的数据
                progress: [
                    {
                        title: '基本信息'
                    },
                    {
                        title: '检查信息'
                    },
                    {
                        title: '检查结果'
                    }
                ],
                bigImgSrc: null,//拍照图片查看路径
                showBigPic: false,//拍照图片查看是否显示
                ifbigqy: false,
                ifbigcs: false,
                examineId: null,
                basicInfoData: null,
                patrolData: null,
                resultData: null,
                gross: 0,
                itemPicList: [],
                imgNameStyle: {
                    left: '0px',
                    top: '0px'
                },
                accessoryListIf: false,
                showPicIf: false,
                picSrc: "",
                qrcodeId: '',
                infoData: {},
                loading: false,
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        position: relative;
        margin-bottom: 200px;
    }

    $c:#0db5ef;
    .left-info {
        width: 210px;
        height: 560px;
        background: #fff;
        position: fixed;
        margin-left: -230px;
        margin-top: 0;
        z-index: 2;
        .head-block {
            background: #F2F5F8;
            height: 70px;
            padding: 14px 20px;
            box-sizing: border-box;
            .num {
                color: $c;
            }
        }
        .main-block {
            // border-right: 2px solid #EBF1F5;
            // min-height: 470px;
            >li {
                border-right: 2px solid #EBF1F5;
                padding: 0 20px;
                height: 50px;
                line-height: 50px;
                cursor: default;
                &:hover {
                    background: #F2F5F8;
                }
                .right {
                    color: #A2AAB6;
                }
            }
            .activePosition {
                border-right: 2px solid $c;
                .left {
                    color: $c
                }
            }
        }
    }

    // 左边悬浮信息栏的样式 end
    .right-info {
        width: calc(100% - 230px);
        margin-left: 230px;
        .content {
            width: 600px;
        }
    }

    .content {
        margin-top: 20px;

        a {
            background: #F6F7F8;
            border: 1px solid #C2CAD2;
            padding: 5px 19px;
            font-size: 14px;
            color: #393939;
            height: 30px;
            width: 136px;
            box-sizing: border-box;
            margin-left: 10px;
        }
    }

    .mT35 {
        margin-top: 35px;
    }

    .row .el-form-item {
        min-width: 250px;
    }

    .table-div {
        text-align: center;
    }

    .zj {
        border: 1px solid #ebeef5;
        border-top: 0;
        height: 44px;
        line-height: 44px;

        span:first-child {
            margin-left: 36px;
        }
        span:last-child {
            width: 85%;
            display: inline-block;
            text-align: center;
        }
    }

    .result {
        margin: 20px 0;
        width: 402px;
        height: 90px;
        border: 1px solid #C2CAD2;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            .number {
                font-size: 26px;
                color: #3B3B3B;
            }
            .project-name {
                font-size: 14px;
                color: #A2AAB6;
            }
        }
    }

    .imgbox {
        // display: flex;
        width: 650px;
        // overflow: hidden;
        margin-left: 100px;
    }

    .imgdiv {
        float: left;
        width: 130px;
        height: 130px;
        border: 1px solid #C2CAD2;
        border-radius: 6px;
        position: relative;
        margin-right: 20px;
        margin-top: 10px;
        img {
            transition: all 0.5s;
            width: 100%;
            height: 100%;
            border-radius: 6px;
        }
        span {
            display: none;
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: rgba(0, 0, 0, 0.40);
            border-radius: 0 0 5px 5px;
            font-size: 14px;
            color: #FFFFFF;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }

    .imgdiv:hover {
        span {
            display: inline-block;
        }
    }

    .imgbig {
        position: relative;
        z-index: 999;
        span {
            display: none !important;
        }
        img {
            transform: scale(2);
            border-radius: 0;
        }
    }

    .imgNameBox {
        position: fixed;
        min-height: 50px;
        padding: 20px;
        min-width: 200px;
        z-index: 999;
        top: 100px;
        left: 100px;
        background: #fff;
        box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
    }

    .border-top {
        border-top: 1px solid #ebeef5 !important;
    }

    .big-img {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        >img {
            display: block;
            max-height: 700px;
        }
    }
</style>