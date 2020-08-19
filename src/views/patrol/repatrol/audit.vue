<style lang="sass">
    .mT35 .el-table__header-wrapper {
        display: none;
    }

    .mT35 .firsTeit .el-table__header-wrapper {
        display: block;
    }

    .mT35 .el-table {
        border-top: none !important;
    }

    .mT35 .firsTeit {
        border-top: 1px solid #ebeef5 !important;
    }

    .detail table {
        width: calc(100% - 270px) !important;
    }
</style>

<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
        <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">线上整改审核</span>
        </div>
        <div class="container">
            <!-- 左边信息悬浮栏 -->
            <div class="left-info">
                <ul class="main-block">
                    <li class="clearfix " :class="slideIndex==index?'activePosition':''"
                        v-for="(item,index) in progress" :key="index">
                        <p class="floatL left">{{item}}</p>
                    </li>
                </ul>
            </div>
            <!-- 左边信息悬浮栏 end-->
            <div class="right-info">
                <div class="diva" style="cursor: pointer;" @click="goPatrolDetail">查看检查记录</div>
                <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="140px" class="demo-ruleForm">
                    <toggle-form title="基础信息">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="整改联系人:">
                                    {{initRepatrol.guardPersonName}}
                                </el-form-item>
                                <el-form-item label="联系方式:">
                                    {{initRepatrol.guardMobile}}
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="电子签名:">
                                    <div class="imgbox clear_a " v-if='initRepatrol.file!=null'>
                                        <div @click.stop="previewImg([initRepatrol.file],0,'电子签名')" class="imgdiv">
                                            <img :src="initRepatrol.file.fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无电子签名</p>
                                    <Preview v-if='initRepatrol.file!=null' :showImg="PreviewShow"
                                        @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
                                        :imgList="PreviewFileList"></Preview>
                                </el-form-item>
                            </div>
                        </div>
                    </toggle-form>

                    <toggle-form title="巡查项">
                        <div class="mT35">
                            <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''"
                                :data="item" :span-method="objectSpanMethod" border class="table-div brN">
                                <el-table-column show-overflow-tooltip prop="projectsNo" label="检查项编号" min-width="60">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="projectsName" label="检查项目" min-width="120">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="contextNo" label="检查内容编号" min-width="60">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="contextName" label="检查内容" min-width="250">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="important" label="是否重点项" min-width="60">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="score" label="分值" min-width="60">
                                </el-table-column>
                                <el-table-column show-overflow-tooltip prop="description" label="整改说明" min-width="120">
                                </el-table-column>
                                <el-table-column label="整改图片" align="center" min-width="80">
                                    <template slot-scope="scope">
                                        <div class="imgbox clear_a w40h40"
                                            v-if="scope.row.files.length>0&&scope.row.files!=null">
                                            <div @click.stop="previewImg(scope.row.files,0,'整改图片')" class="imgdiv">
                                                <img :src="scope.row.files[0].fileId">
                                            </div>
                                        </div>
                                        <p v-else>暂无</p>
                                        <Preview v-if="scope.row.files.length>0&&scope.row.files!=null"
                                            :showImg="PreviewShow" @close="PreviewShow = false"
                                            :currentIndex='PreviewIndex' :title='PreviewTitle'
                                            :imgList="PreviewFileList"></Preview>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="检查结果(必填)" min-width="185">
                                    <template slot-scope="scope">
                                        <single-checkbox :currentRowData="scope.row"
                                            @singlecheckboxchange="singlecheckboxchange"></single-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="备注" min-width="140">
                                    <template slot-scope="scope">
                                        <input type="text" class="w140" v-model="scope.row.remark"
                                            :disabled="!scope.row.qual" placeholder="备注前先选择是否检查通过">
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="zj">
                                <span>总计：</span>
                                <span>{{contextStat.scoreTotal}}分</span>
                            </div>
                        </div>
                    </toggle-form>

                    <toggle-form title="审核信息">
                        <div class="content">
                            <div class="row ml30" style="margin-left: 40px;">
                                <span
                                    style="color: #6D7787;">本次复查，共复查问题项共{{contextStat.contextCount}}项，其中包含重点项{{contextStat.importantCount}}项目，经复查：</span>
                            </div>
                            <div class="row result ml30">
                                <div class="item">
                                    <div class="number">{{contextStat.qualCount}}
                                    </div>
                                    <div class="project-name">合格项</div>
                                </div>
                                <div class="item">
                                    <div class="number">
                                        {{contextStat.unqualImportantCount}}</div>
                                    <div class="project-name">重点项不合格</div>
                                </div>
                                <div class="item">
                                    <div class="number">
                                        {{contextStat.unqualCount}}</div>
                                    <div class="project-name">不合格项</div>
                                </div>
                            </div>
                            <div class="row ml30" style="margin: 20px 0">
                                <span style="font-size: 18px;color: #393939;">企业得分：</span>
                                <span style="color: #0DB5EF;font-size: 18px; ">{{contextStat.scoredTotal}}分</span>
                                <span
                                    style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{contextStat.scoreTotal}}分，此评分仅供参考）</span>
                            </div>
                            <div class="row">
                                <el-form-item label="复查结果：" prop="result">
                                    <el-radio-group v-model="repatrol.result" size="medium">
                                        <el-radio-button label="QUALIFIED">符合</el-radio-button>
                                        <el-radio-button label="PASSED">基本符合</el-radio-button>
                                        <el-radio-button label="DISQUALIFIED">不符合</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="复查处理方式：" prop="treat">
                                    <el-radio-group v-model="repatrol.treat" size="medium">
                                        <el-radio-button label="NORMAL">复查通过</el-radio-button>
                                        <el-radio-button label="TIME_LIMIT_RECTIFICATION">再次限期整改</el-radio-button>
                                        <el-radio-button label="INVESTIGATION_AND_TREATMENT">调查处理</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </div>

                            <div v-if="repatrol.treat == 'TIME_LIMIT_RECTIFICATION'" class="row">
                                <el-form-item label="整改期限：" prop="rectifyTime">
                                    <el-date-picker class="w200" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions" v-model="repatrol.rectifyTime" type="date"
                                        placeholder="选择整改期限">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="监管人员:" prop="patrolSoId">
                                    <el-select v-model="repatrol.patrolSoId" class="w200" placeholder="请选择监管人员">
                                        <el-option v-for="item in soList" :key="item.id" :label="item.realName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>

                            <div class="row">
                                <el-form-item label="监管陪同人员:">
                                    <el-select collapse-tags :multiple='true' :multiple-limit='5'
                                        v-model="repatrol.userIds" class="w200" placeholder="请选择监管陪同人员">
                                        <el-option v-for="item in infoList" :key="item.id" :label="item.realName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="row">
                                <el-form-item label="复查记录备注：">
                                    <el-input v-model="repatrol.remark" class="w250" maxlength="300" type="textarea"
                                        placeholder="如有需要请输入备注,300字以内" :rows="4">
                                    </el-input>
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
                <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
                <el-button :disabled="disabled" type="primary" @click="updateRepatroRecord">提交并保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import Preview from 'components/togOss/previewImg';
    import SingleCheckbox from "components/SingleCheckbox.vue";
    import scroll from "utils/scroll";
    import YbPopup from 'components/ybpopup/YbPopup.vue'
    import {
        guardDetail,
        guardReview,
        getBasicInfo
    } from "api/patrol/repatrol";

    function getType(entityType) {
        let type;
        if (entityType == 'PRODUCT') {
            type = 'ENTITY'
        } else if (entityType == 'CIRCULATION') {
            type = 'ENTITY'
        } else if (entityType == 'RESTAURANT') {
            type = 'ENTITY'
        } else if (entityType == 'WORKSHOP') {
            type = 'CFDA'
        } else if (entityType == 'SALE') {
            type = 'CFDA'
        } else if (entityType == 'CFDARESTAURANT') {
            type = 'CFDA'
        } else if (entityType == 'VENDORS') {
            type = 'CFDA'
        }
        return type;
    }
    export default {
        components: {
            ToggleForm,
            SingleCheckbox,
            YbPopup,
            Preview
        },
        async mounted() {
            // scroll.call(this, 'slideIndex');

            this.filePath = this.$store.getters.filePath;
            this.repatrolId = this.$route.query.repatrolId;
            // this.repatrolId = '08557e2593f611ea8b71000c29fc5d43';
            await guardDetail(this.repatrolId).then((result) => {
                if (result && result.status) {
                    this.initRepatrol = result.data;
                    let datas = result.data.projects;
                    this.tableList = [];
                    this.contextStat.scoreTotal = 0;
                    this.contextStat.contextCount = 0;
                    this.contextStat.importantCount = 0;
                    datas.map(item => {
                        let lis = []
                        item.contexts.map(item2 => {
                            this.contextStat.scoreTotal += item2.score * 1
                            this.contextStat.contextCount += 1
                            if (item2.important == 'YES') {
                                this.contextStat.importantCount += 1
                            }
                            let obj = {
                                projectsNo: item.no,
                                projectsName: item.name,
                                contextNo: item.no + '.' + item2.contextNo,
                                contextName: item2.contextName,
                                important: item2.important == 'NO' ? '否' : '是',
                                id: item2.id,
                                score: item2.score,
                                description: item2.description,
                                files: item2.files,
                                qual: '',
                                remark: '',
                                index: this.contextStat.contextCount - 1
                            }

                            lis.push(obj)
                        })
                        this.tableList.push(lis)

                    })
                }
            })
            getBasicInfo(this.initRepatrol.entityId, getType(this.initRepatrol.entityType)).then((result) => {
                if (result && result.status) {
                    this.soList = result.data.soList;
                    this.infoList = result.data.infoList;
                }
            })

        },
        methods: {
            previewImg(imgList, index, title) {
                this.PreviewFileList = []
                imgList.map(item => {
                    this.PreviewFileList.push(item.fileId)
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
            updateRepatroRecord() {
                this.$refs['repatrol'].validate((valid) => {

                    this.repatrol.repatrolId = this.repatrolId;
                    this.repatrol.contexts = []
                    this.tableList.map(item => {
                        item.map(context => {
                            let obj = {
                                id: context.id,
                                qual: context.qual,
                                remark: context.remark
                            }
                            this.repatrol.contexts.push(obj)
                        })
                    })
                    if (this.contextList.length != this.repatrol.contexts.length) {
                        this.$message.error('每一项检查通过或者不通过，监管人员必填');
                        return false;
                    }
                    if (this.repatrol.treat == 'TIME_LIMIT_RECTIFICATION') {
                        let counttemp = 0;
                        this.tableList.map(item => {
                            item.map(context => {
                                if (context.qual == 'NO') {
                                    counttemp++;
                                }
                            })
                        })
                        if (counttemp <= 0) {
                            this.$message({
                                message: '处理方式为再次限期整改,需选择至少一条复查不符合项.',
                                type: 'warning'
                            })
                            return false
                        }
                    }
                    if (this.repatrol.result == 'QUALIFIED' || this.repatrol.result == 'PASSED') {
                        if (this.repatrol.treat != 'NORMAL') {
                            this.$message.error('复查结果为符合和基本符合时，复查处理方式只能选择复查通过，');
                            return false;
                        }
                    }
                    if (this.repatrol.result == 'DISQUALIFIED' && this.repatrol.treat == 'NORMAL') {
                        this.$message.error('复查结果为不符合时，支持选择再次限期整改和调查处理');
                        return false;
                    }

                    if (valid) {
                        this.disabled = true
                        this.$confirm('保存后审核状况将生效，是否保存？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            guardReview(this.repatrol).then(result => {
                                if (result && result.status) {
                                    this.$message({
                                        message: '审核成功，马上返回列表',
                                        type: 'success'
                                    })
                                    setTimeout(() => {
                                        this.$router.go(-1)
                                    }, 3000)
                                } else {
                                    this.disabled = false
                                    this.$message({
                                        message: result.message,
                                        type: 'error'
                                    })
                                }
                            })
                        })
                    }
                })
            },
            singlecheckboxchange(args) {

                console.log(args)
                this.$set(args.row, 'qual', args.result);
                this.contextStat.qualCount = 0
                this.contextStat.unqualCount = 0
                this.contextStat.unqualImportantCount = 0
                this.contextStat.scoredTotal = 0

                this.tableList.map(item => {
                    item.map(context => {
                        if (context.qual !== undefined && context.qual !== '') {
                            if (context.qual == 'YES') {
                                this.contextStat.qualCount++;
                                this.contextStat.scoredTotal += context.score * 1;
                            }
                            if (context.qual == 'NO') {
                                this.contextStat.unqualCount++;
                                if (context.important == '是') {
                                    this.contextStat.unqualImportantCount++;
                                }
                            }
                            if (this.contextList.indexOf(context.id) == -1) {
                                this.contextList.push(context.id);
                            }
                        } else {
                            let index = this.contextList.indexOf(context.id)
                            this.contextList.splice(index, 1);
                        }
                    })
                })

            },
           
            goPatrolDetail() {
                if (this.initRepatrol.sourceType == 'DAILY') {
                    this.$router.push({
                        path: '/biz/patrol/repatrol/detail',
                        query: {
                            recordId: this.initRepatrol.sourceId,
                            patrolType: "DAILY"
                        }
                    })
                } else if (this.initRepatrol.sourceType == 'REPATROL') {
                    this.$router.push({
                        name: 'patrol.repatrol.ad',
                        params: {
                            'curd': 'detail',
                            'repatrolRecordId': this.initRepatrol.sourceId
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/biz/patrol/repatrol/detail',
                        query: {
                            recordId: this.initRepatrol.sourceId,
                            patrolType: "SPECIAL"
                        }
                    })
                }
            },
        },
        data() {
            return {
                slideIndex: -1,
                repatrolId: "",

                //init 数据
                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',

                initRepatrol: {},
                contextList: [],
                tableList: [],
                contextStat: {
                    scoreTotal: 0,
                    contextCount: 0,
                    importantCount: 0,
                    qualCount: 0,
                    unqualCount: 0,
                    unqualImportantCount: 0,
                    scoredTotal: 0,
                },
                soList: [],
                infoList: [],
                disabled: false,
                repatrol: {
                    contexts: [],
                    patrolSoId: '',
                    userIds: [],
                    rectifyTime: '',
                    remark: '',
                    repatrolId: '',
                    result: '',
                    treat: '',
                },
                rules: {
                    rectifyTime: {
                        required: true,
                        message: '请选择整改期限',
                        trigger: 'blur'
                    },
                    patrolSoId: {
                        required: true,
                        message: '请选择监管员',
                        trigger: 'blur'
                    },
                    result: {
                        required: true,
                        message: '请选择复查结果',
                        trigger: 'blur'
                    },
                    treat: {
                        required: true,
                        message: '请选择复查处理方式',
                        trigger: 'blur'
                    },
                },
                progress: ['基本信息', '检查项', '检查结果'],
                loading: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
            };
        }
    }
</script>

<style lang="scss" scoped>
    .mT35 {
        margin-top: 35px;
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

    .left-info {
        width: 210px;
        height: 560px;
        background: #fff;
        position: fixed;
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
            margin-top: 20px;

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
    }

    .content {
        margin-top: 20px;
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
        width: 650px;

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
</style>