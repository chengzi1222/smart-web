<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
        <div class="container">
            <el-form  label-width="140px" class="demo-ruleForm">
                <toggle-form title="基本信息">
                    <div class="content" v-if='subOrSite=="sub"'>
                        <div class="row">
                            <el-form-item label="业务受理号：">
                                {{baseInfoVo.no}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="申请日期：">
                                {{baseInfoVo.applyDate}}
                            </el-form-item>
                            <el-form-item label="申请类型：">
                                {{applyTypes[baseInfoVo.applyType]}}
                            </el-form-item>

                        </div>
                        <div class="row">
                            <el-form-item label="业务状态：">
                                {{baseInfoVo.businessType}}
                            </el-form-item>
                            <el-form-item label="核查日期：">
                                {{baseInfoVo.inspectTime}}
                            </el-form-item>
                        </div>
                    </div>
                    <div class="content" v-if='subOrSite=="site"'>
                        <div class="row">
                            <el-form-item label="经营者名称：">
                                {{baseInfoVo.entityName}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="隶属区县：">
                                {{baseInfoVo.areaName}}
                            </el-form-item>
                            <el-form-item label="申请日期：">
                                {{baseInfoVo.applyDate}}
                            </el-form-item>

                        </div>
                        <div class="row">
                            <el-form-item label="申请类型：">
                                {{applyTypes[baseInfoVo.applyType]}}
                            </el-form-item>
                            <el-form-item label="业务状态：">
                                {{baseInfoVo.businessType}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="主体状态：">
                                {{baseInfoVo.subType}}
                            </el-form-item>
                            <el-form-item label="法人/负责人：">
                                {{baseInfoVo.legalPerson}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="经营场所：">
                                {{baseInfoVo.spaceAddr}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="许可证编号：">
                                {{baseInfoVo.licence}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="业务受理号：">
                                {{baseInfoVo.no}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="导入时间：">
                                {{baseInfoVo.createTime}}
                            </el-form-item>
                        </div>
                    </div>
                </toggle-form>
                <toggle-form title="现场核查项">
                    <div class="mT35">
                        <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''"
                            :data="item" :span-method="objectSpanMethod" border class="table-div brN">
                            <el-table-column show-overflow-tooltip prop="projectsNo" label="核查项编号" min-width="50">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="name" label="核查项目" min-width="120">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="contextNo" label="核查内容编号" min-width="50">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="context" label="核查内容" min-width="250">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="importantStr" label="重要性" min-width="80">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip prop="result" label="是否符合" min-width="120">
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="备注" min-width="120">
                                <template slot-scope="scope">
                                    {{scope.row.remark?scope.row.remark:'暂无'}}
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip label="附件" min-width="120">
                                <template slot-scope="scope">
                                    <div class="imgbox clear_a w40h40"
                                        v-if="scope.row.files.length>0&&scope.row.files!=null">
                                        <div @click.stop="previewImg(scope.row.files,0,'附件')" class="imgdiv">
                                            <img :src="filePath+scope.row.files[0].fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无</p>
                                    <!-- <Preview v-if="scope.row.files.length>0&&scope.row.files!=null"
                                        :showImg="PreviewShow" @close="PreviewShow = false" :currentIndex='PreviewIndex'
                                        :title='PreviewTitle' :imgList="PreviewFileList"></Preview> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-form label-width="140px" class="demo-ruleForm">
                        <div class="content">
                            <div class="row" v-if='subOrSite=="site"'>
                                <el-form-item label="要点表名称：">
                                    {{tableDetail.name}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="使用说明：">
                                    <div class="rowRemark">
                                        {{tableDetail.description?tableDetail.description:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="适用类型：">
                                    <div class="rowRemark">
                                        {{tableDetail.businessType?tableDetail.businessType:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </toggle-form>

                <toggle-form title="核查结果">
                    <div class="content">
                        <div class="row ml30 textC" style="color: #6D7787;">
                            本次核查，关键项{{tableDetail.currentCruxNum}}项，重点项{{tableDetail.currentImportNum}}项，
                            一般项{{tableDetail.currentGeneralNum}}项，共{{tableDetail.currentGeneralNum+tableDetail.currentImportNum+tableDetail.currentCruxNum}}项，经复查：
                        </div>
                        <div class="row result ml30">
                            <div class="item">
                                <div class="number">
                                    {{resultDetailVo.cruxNotPassedNum}}
                                </div>
                                <div class="project-name">关键项不合格</div>
                            </div>
                            <div class="item">
                                <div class="number">
                                    {{resultDetailVo.importanceNotPassedNum}}
                                </div>
                                <div class="project-name">重点项不合格</div>
                            </div>
                            <div class="item">
                                <div class="number">
                                    {{resultDetailVo.generalNotPassedNum}}
                                </div>
                                <div class="project-name">一般项不合格</div>
                            </div>
                        </div>
                        <div class="row ml30 mb20 textC" style="color: #6D7787;">
                            判定标准：关键项不符合数：≤{{tableDetail.cruxNum}}项，重点项不符合数：≤{{tableDetail.importantNum}}项，一般项+重点项不符合数：≤{{tableDetail.generalImportNum}}项
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="核查结果：" prop="result">
                                {{resultDetailVo.resultStr}}
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="处理方式：" prop="treat">
                                {{resultDetailVo.treatStr}}
                            </el-form-item>
                            <el-form-item label="整改期限：" v-if="resultDetailVo.treat=='RECTIFY'" prop="treat">
                                {{resultDetailVo.rectifyTime}}
                            </el-form-item>
                        </div>

                        <div class="row bottomContent">
                            <el-form-item label="核查人：">
                                {{resultDetailVo.inspectorName?resultDetailVo.inspectorName:'暂无'}}
                            </el-form-item>
                            <el-form-item label="手机号：">
                                {{resultDetailVo.inspectorUserTel?resultDetailVo.inspectorUserTel:'暂无'}}
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="备注：">
                                <div class="rowRemark">
                                    {{resultDetailVo.remark?resultDetailVo.remark:'暂无'}}
                                </div>
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="被检查人：">
                                {{resultDetailVo.inspectedUserName?resultDetailVo.inspectedUserName:'暂无'}}
                            </el-form-item>
                            <el-form-item label="手机号：">
                                {{resultDetailVo.inspectedUserTel?resultDetailVo.inspectedUserTel:'暂无'}}
                            </el-form-item>
                        </div>
                        <div class="row bottomContent" v-if="resultDetailVo.cooperate=='YES'">
                            <el-form-item label="企业电子签名：">
                                <div class="imgbox clear_a " v-if='resultDetailVo.sign!=null'>
                                    <div @click.stop="previewImg([resultDetailVo.sign],0,'企业电子签名')" class="imgdiv">
                                        <img :src="filePath+resultDetailVo.sign.fileId">
                                    </div>
                                </div>
                                <p v-else>企业电子签名</p>
                                <!-- <Preview v-if='resultDetailVo.sign!=null' :showImg="PreviewShow"
                                    @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
                                    :imgList="PreviewFileList"></Preview> -->
                            </el-form-item>
                        </div>
                        <div class="row bottomContent" v-else>
                            <el-form-item label="拒绝理由：">
                                <div class="rowRemark">
                                    {{resultDetailVo.noCooperateRemark}}
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </toggle-form>
            </el-form>
        </div>
        <Preview :showImg="PreviewShow" @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
            :imgList="PreviewFileList"></Preview>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import Preview from 'components/togOss/previewImg';
    import SingleCheckbox from "../com/SingleCheckbox.vue";
    import YbPopup from 'components/ybpopup/YbPopup.vue'
    import {
        guardDetail,
        guardReview,
        getBasicInfo
    } from "api/patrol/repatrol";
    import * as api from '../../../api/xchc/detail';
    export default {
        components: {
            ToggleForm,
            SingleCheckbox,
            YbPopup,
            Preview
        },
        props: {
            id: {
                type: String,
                default: ''
            },
            subOrSite: {
                type: String,
                default: 'sub'
            },
        },
        watch: {
            id(val) {
                if (val) {
                    this.get()
                }
            }
        },
        async mounted() {

            this.filePath = this.$store.getters.filePath;
            if (this.id) {
                this.get()
            }
        },
        methods: {
            get() {
                this.loading = true;
                api.hcRecordDetail(this.id).then(r => {
                    this.loading = false;
                    if (!r.status) {
                        this.$message.error('数据拉取失败!');
                    }
                    this.baseInfoVo = r.data.baseInfoVo;
                    this.tableDetail = r.data.tableDetail;
                    this.resultDetailVo = r.data.resultDetailVo;
                    let datas = r.data.projectDetailVos;
                    this.tableList = [];
                    datas.map(item => {
                        let lis = []
                        item.contextDetailVos.map(item2 => {
                            let obj = {
                                projectsNo: item.projectNo,
                                name: item.projectName,
                                contextNo: item.projectNo + '.' + item2.contextNo,
                                context: item2.contextName,
                                importantStr: this.filter(item2.contextType,
                                    'important'),
                                important: item2.contextType,
                                id: item2.contextId,
                                result: this.filter(item2.result, 'result'),
                                remark: item2.remark,
                                files: item2.filePos,
                            }
                            lis.push(obj)
                        })
                        this.tableList.push(lis)
                    })
                })
            },
            filter(id, type) {
                if (type == 'important') {
                    if (id == 'IMPORTANT') {
                        return "重点项(**)"
                    } else if (id == 'CRUX') {
                        return "关键项(***)"
                    } else {
                        return "一般项(*)"
                    }
                } else {
                    if (id == 'YES') {
                        return "是"
                    } else if (id == 'NO') {
                        return "否"
                    } else {
                        return "不适用"
                    }
                }

            },
            previewImg(imgList, index, title) {
                this.PreviewFileList = []
                imgList.map(item => {
                    this.PreviewFileList.push(this.filePath + item.fileId)
                })
                this.PreviewIndex = index;
                this.PreviewTitle = title;
                this.PreviewShow = true;
            },
            objectSpanMethod({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                let rownum = 0;
                for (let i = 0; i < this.tableList.length; i++) {
                    if (this.tableList[i].indexOf(row) >= 0) {
                        rownum = this.tableList[i].length;
                        break;
                    }
                }
                if (columnIndex == 0 || columnIndex == 1) {
                    if (rowIndex % rownum == 0) {
                        return {
                            rowspan: rownum,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
        },
        data() {
            return {
                applyTypes: {
                    'NEW': '新办',
                    'CHANGE': '变更',
                    'CONTINUE': '延续',
                    'SUPPLEMENT': '补证',
                    'LOGOUT': '注销',
                    'REPLACE': '换证',
                },
                filePath: '',

                //init 数据
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',

                baseInfoVo: {},
                resultDetailVo: {},
                tableDetail: {},
                contextList: [],
                tableList: [],
                progress: ['基本信息', '核查项', '核查结果'],
                loading: false,
            };
        }
    }
</script>

<style lang="scss" scoped>
    .mT35 {
        margin-top: 35px;
    }

    .result {
        margin: 20px auto;
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

    .bz {
        line-height: 20px;
        font-size: 12px;
        color: #A2AAB6;
    }


    .container {
        position: relative;
        margin-bottom: 300px;
    }

    $c:#0db5ef;



    .content {
        margin: 20px auto 0;
        width: 750px;
    }

    .table-div {
        text-align: center;

        input {
            background: #FFFFFF;
            border: 1px solid #C2CAD2;
            height: 34px;
            font-size: 12px;
            color: #A2AAB6;
            padding-left: 12px;
            box-sizing: border-box;
        }
    }

    .diva {
        background: #F6F7F8;
        border: 1px solid #C2CAD2;
        font-size: 14px;
        color: #393939;
        height: 34px;
        width: 150px;
        text-align: center;
        line-height: 34px;
        box-sizing: border-box;
    }

    .block {
        width: 252px;
        font-size: 14px;
        color: #6D7787;
        line-height: 26px;
    }

    .brN .is-leaf {
        border-right: 0;
    }

    .brN tr td {
        border-right: 0;
    }

    .brN tr td[colspan="1"] {
        border-right: 1px solid #ebeef5;
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





    .imgbox {
        width: 250px;

        .imgdiv {
            float: left;
            width: 130px;
            height: 130px;
            border: 1px solid #C2CAD2;
            border-radius: 6px;
            position: relative;
            margin-right: 20px;
            margin-top: 10px;
            cursor: pointer;

            img {
                transition: all 0.5s;
                width: 100%;
                height: 100%;
                border-radius: 6px;
            }
        }
    }


    .w40h40 {
        width: 100%;

        .imgdiv {
            width: 100%;
            height: 100%;
            text-align: center;
            margin-right: 0px;
            margin-top: 0px;
            border: none;

            img {
                transition: all 0.5s;
                width: 40px;
                height: 40px;
                border-radius: 6px;
            }
        }
    }

    .bottomContent {
        margin: 0 auto;
        width: 750px;

    }

    .rowRemark {
        width: 300px;
    }
</style>