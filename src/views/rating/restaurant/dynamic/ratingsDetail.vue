<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>评分详情</span>
        </div>
        <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
            <div class="container">
                <el-form label-width="140px" class="demo-ruleForm">
                    <toggle-form title="检查项">
                        <div class="mT35">
                            <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''"
                                :data="item" :span-method="objectSpanMethod" border class="table-div brN">
                                <el-table-column show-overflow-tooltip prop="projectsNo" label="检查项编号" min-width="50">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="name" label="检查项目" min-width="120">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="ruleStr" label="分值统计" min-width="120">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="contextNo" label="检查内容编号" min-width="50">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="context" label="检查内容" min-width="250">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="score" label="分值" min-width="80">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="result" label="评价结果" min-width="120">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip label="备注" min-width="120">
                                    <template slot-scope="scope">
                                        {{scope.row.remarks?scope.row.remarks:'暂无'}}
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
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <el-form label-width="140px" class="demo-ruleForm">
                            <div class="content">
                                <div class="row bottomContent">
                                    <el-form-item label="分数统计选项:">
                                        {{initRepatrol.statisticsOptions=='YES'?'是':'否'}}
                                    </el-form-item>
                                </div>
                                <div class="row bottomContent">
                                    <el-form-item label="备注:">
                                        {{initRepatrol.tableRemark?initRepatrol.tableRemark:'暂无'}}
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </toggle-form>

                    <toggle-form title="审核结果">
                        <div class="content">
                            <div class="row ml30 mb20 textC" style="color: #6D7787;">
                                本次检查，检查项{{initRepatrol.projectNum}}项，总分{{initRepatrol.totalScore}}分，经检得分：<span
                                    style="font-size:24px;color:#0DB5EF">{{initRepatrol.score}}</span> 分
                            </div>
                            <div class="row bottomContent">
                                <el-form-item label="检查人：">
                                    <div class="rowRemark">
                                        {{initRepatrol.inspector?initRepatrol.inspector:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="row bottomContent">
                                <el-form-item label="手机号：">
                                    <div class="rowRemark">
                                        {{initRepatrol.tel?initRepatrol.tel:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="row bottomContent">
                                <el-form-item label="备注：">
                                    <div class="rowRemark">
                                        {{initRepatrol.remarks?initRepatrol.remarks:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="row bottomContent">
                                <el-form-item label="食品安全负责人：">
                                    <div class="rowRemark">
                                        {{initRepatrol.foodSafetyPerson?initRepatrol.foodSafetyPerson:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="row bottomContent">
                                <el-form-item label="手机号：">
                                    <div class="rowRemark">
                                        {{initRepatrol.foodSafetyPersonTel?initRepatrol.foodSafetyPersonTel:'暂无'}}
                                    </div>
                                </el-form-item>
                            </div>
                             <div class="row bottomContent" v-if='initRepatrol.cooperateSign=="YES"'>
                                <el-form-item label="企业电子签名：">
                                    <div class="imgbox clear_a " v-if='initRepatrol.sign!=null'>
                                        <div @click.stop="previewImg([initRepatrol.sign],0,'企业电子签名：')" class="imgdiv">
                                            <img :src="filePath+initRepatrol.sign.fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无企业电子签名：</p>
                                </el-form-item>
                            </div>
                            <div class="row bottomContent" v-if='initRepatrol.cooperateSign=="NO"'>
                                <el-form-item label="拒绝理由：">
                                    <div class="rowRemark">
                                        {{initRepatrol.refuseSignReason}}
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
                    </toggle-form>
                </el-form>
            </div>
            <Preview :showImg="PreviewShow" @close="PreviewShow = false" :currentIndex='PreviewIndex'
                :title='PreviewTitle' :imgList="PreviewFileList"></Preview>

        </div>
        <!-- 底部按钮 -->
        <div class="foot-btn" style="z-index:1">
            <div>
                <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import Preview from 'components/togOss/previewImg';
    import * as api from "api/rating/restaurantRating";
    export default {
        components: {
            ToggleForm,
            Preview
        },
        async mounted() {
            this.filePath = this.$store.getters.filePath;
            this.id = this.$route.query.id;
            this.get()
        },
        methods: {
            get() {
                this.loading = true;
                api.dynamicDetail(this.id).then(r => {
                    this.loading = false;
                    if (!r.status) {
                        this.$message.error('数据拉取失败!');
                    }
                    this.initRepatrol = r.data;
                    let datas = r.data.dynamicContent;
                    this.tableList = [];
                    datas.map(item => {
                        let lis = []
                        item.scoreRecordContentList.map(item2 => {
                            let obj = {
                                projectsNo: item.no,
                                name: `${item.name}（${item.score}分）`,
                                rule: item.rule,
                                ruleStr: this.contentRule[item.rule],
                                contextNo: item.no + '.' + item2.no,
                                context: item2.content,
                                score: item2.contentScore,
                                files: item2.annex,
                                result: item2.resultStr,
                                remark: item2.remarks,
                                id: item2.id,
                                parentId: item.id,
                            }
                            lis.push(obj)
                        })
                        this.tableList.push(lis)
                    })
                })
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
                id: '',
                filePath: '',
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',
                initRepatrol: {},
                tableList: [],
                contentRule: {
                    'SINGLE': '单选计分',
                    'MULTIPLE': '多选计分',
                    'HIGHEST': '多选最高计分',
                },
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
        width: 475px;
    }


    .rowRemark {
        width: 300px;
    }
</style>