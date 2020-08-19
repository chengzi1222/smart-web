<template>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)" class="bigbox">
        <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
            <span style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">审核</span>
        </div>
        <div class="container">

            <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="140px" class="demo-ruleForm">
                <toggle-form title="基本信息">
                    <div class="content">
                        <div class="row">
                            <el-form-item label="经营者名称:">
                                {{initRepatrol.entityName}}
                            </el-form-item>
                        </div>
                        <div class="row">
                            <el-form-item label="申请类型:">
                                {{initRepatrol.applyTypeStr}}
                            </el-form-item>
                            <el-form-item label="业务状态:">
                                {{initRepatrol.businessType}}
                            </el-form-item>

                        </div>
                        <div class="row">
                            <el-form-item label="业务受理号:">
                                {{initRepatrol.businessNo}}
                            </el-form-item>
                            <el-form-item label="核查时间:">
                                {{initRepatrol.sourceTime}}
                            </el-form-item>
                        </div>
                        <div class="row">

                            <el-form-item label="整改截止日期:">
                                {{initRepatrol.sourceRectifyTime}}
                            </el-form-item>
                            <el-form-item label="整改提交时间:">
                                {{initRepatrol.rectifiedTime}}
                            </el-form-item>
                        </div>
                    </div>
                </toggle-form>

                <toggle-form title="线上整改审核（仅显示本次复查的核查项）">
                    <div class="mT35">
                        <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''"
                            :data="item" :span-method="tableOption" border class="table-div brN">
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
                            <el-table-column show-overflow-tooltip label="整改说明" min-width="120">
                                <template slot-scope="scope">
                                    {{scope.row.description?scope.row.description:'暂无'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="整改图片" align="center" min-width="80">
                                <template slot-scope="scope">
                                    <div class="imgbox clear_a w40h40"
                                        v-if="scope.row.files.length>0&&scope.row.files!=null">
                                        <div @click.stop="previewImg(scope.row.files,0,'整改图片')" class="imgdiv">
                                            <img :src="filePath+scope.row.files[0].fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无</p>
                                    <!-- <Preview v-if="scope.row.files.length>0&&scope.row.files!=null"
                                        :showImg="PreviewShow" @close="PreviewShow = false" :currentIndex='PreviewIndex'
                                        :title='PreviewTitle' :imgList="PreviewFileList"></Preview> -->
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="是否符合(必填)" min-width="250">
                                <template slot-scope="scope">
                                    <single-checkbox :currentRowData="scope.row"
                                        @singlecheckboxchange="singlecheckboxchange"></single-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="备注" min-width="180">
                                <template slot-scope="scope">
                                    <input type="text" class="w140" v-model="scope.row.remark" :maxlength="200"
                                        :disabled="!scope.row.result" placeholder="备注前先选择是否符合">
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-form label-width="140px" class="demo-ruleForm">
                        <div class="content">
                            <div class="row">
                                <el-form-item label="整改人:">
                                    {{initRepatrol.rectifyPerson}}
                                </el-form-item>
                                <el-form-item label="手机号:">
                                    {{initRepatrol.rectifyTel?initRepatrol.rectifyTel:'暂无'}}
                                </el-form-item>
                            </div>
                            <div class="row" v-if='initRepatrol.cooperate!="NO"'>
                                <el-form-item label="电子签名:">
                                    <div class="imgbox clear_a " v-if='initRepatrol.sign!=null'>
                                        <div @click.stop="previewImg([initRepatrol.sign],0,'电子签名')" class="imgdiv">
                                            <img :src="filePath+initRepatrol.sign.fileId">
                                        </div>
                                    </div>
                                    <p v-else>暂无电子签名</p>
                                    <!-- <Preview v-if='initRepatrol.sign!=null' :showImg="PreviewShow"
                                        @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
                                        :imgList="PreviewFileList"></Preview> -->
                                </el-form-item>
                            </div>
                            <div class="row" v-if='initRepatrol.cooperate=="NO"'>
                                <el-form-item label="企业拒绝签名理由:">
                                    {{initRepatrol.noCooperateRemark}}
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                </toggle-form>

                <toggle-form title="审核结果">
                    <div class="content">
                        <div class="row ml30 textC" style="color: #6D7787;">
                            本次复查（核查不合格项），关键项{{contextStat.impor3Count}}项，重点项{{contextStat.impor2Count}}项，
                            一般项{{contextStat.impor1Count}}项，共{{contextStat.contextCount}}项，经复查：
                        </div>
                        <div class="row result ml30">
                            <div class="item">
                                <div class="number">
                                    {{contextStat.unImpor3Count}}
                                </div>
                                <div class="project-name">关键项不合格</div>
                            </div>
                            <div class="item">
                                <div class="number">
                                    {{contextStat.unImpor2Count}}
                                </div>
                                <div class="project-name">重点项不合格</div>
                            </div>
                            <div class="item">
                                <div class="number">
                                    {{contextStat.unImpor1Count}}
                                </div>
                                <div class="project-name">一般项不合格</div>
                            </div>
                        </div>
                        <div class="row ml30 mb20 textC" style="color: #6D7787;">
                            判定标准：关键项不符合数：≤{{initRepatrol.standardNoCruxNum}}项，重点项不符合数：≤{{initRepatrol.standardNoImportantNum}}项，一般项+重点项不符合数：≤{{initRepatrol.standardNoGeneralAndNoImportantNum}}项
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="复查结果：" prop="result" :required='true'>
                                <el-radio-group :disabled='true' size="medium" v-model="repatrol.result">
                                    <el-radio-button label="YES">符合规定</el-radio-button>
                                    <el-radio-button label="NO">不符合规定</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                        <div class="row bottomContent">
                            <el-form-item label="处理方式：" prop="treat">
                                <el-radio-group v-model="repatrol.treat" size="medium" @change="rulesChange('treat')"
                                    :disabled='!repatrol.result' :title="'巡查项里【是否符合】为必填项！！！'">
                                    <el-radio-button label="NORMAL">正常</el-radio-button>
                                    <el-radio-button label="RE_RECTIFY" v-if="initRepatrol.repatrolCount<=1">再次限期整改
                                    </el-radio-button>
                                    <el-radio-button label="REJECT">驳回</el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                        <div v-if="repatrol.treat === 'RE_RECTIFY'" class="row bottomContent">
                            <el-form-item label="整改期限：" prop="rectifyTime" :required='true'>
                                <el-date-picker class="w200" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                                    v-model="repatrol.rectifyTime" type="date" placeholder="选择整改期限"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="复查人：" prop="inspectorUserId">
                                <el-select v-model="repatrol.inspectorUserId" class="w250 " placeholder="请输入搜索复查人员"
                                    filterable remote reserve-keyword :remote-method="inspectorUserIdMethod"
                                    :loading="inspectorListLoading" @change="inspectorUserIdChange">
                                    <el-option :data-tel='item.inspectedUserTel' v-for="item in inspectorList"
                                        :key="item.inspectorUserId" :label="item.inspectorUserName"
                                        :value="item.inspectorUserId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="手机号：" prop="inspectorUserTel">
                                <el-input v-model="repatrol.inspectorUserTel" class="w250" @input="change($event)"
                                    :maxlength="11" placeholder="请输入手机号">
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="row bottomContent">
                            <el-form-item label="复查备注：">
                                <el-input v-model="repatrol.remark" class="w250" :maxlength="200" type="textarea"
                                    placeholder="请输入备注，200以内" :rows="4">
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                </toggle-form>
            </el-form>
        </div>
        <!-- 底部按钮 -->
        <div class="foot-btn" style="z-index:1">
            <div>
                <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
                <el-button :disabled="disabled" type="primary" @click="submit">保存</el-button>
            </div>
        </div>
        <Preview :showImg="PreviewShow" @close="PreviewShow = false" :currentIndex='PreviewIndex' :title='PreviewTitle'
            :imgList="PreviewFileList"></Preview>
    </div>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import Preview from 'components/togOss/previewImg';
    import SingleCheckbox from "../com/SingleCheckbox.vue";
    import * as api from '../../../api/xchc/detail';
    import {
        phoneValid
    } from 'utils/validate'
    export default {
        components: {
            ToggleForm,
            SingleCheckbox,
            Preview
        },
        async mounted() {
            this.filePath = this.$store.getters.filePath;
            this.repatrol.id = this.$route.query.id;
            api.repatrolReviewDetail(this.repatrol.id).then(d => {
                if (d.status) {
                    this.initRepatrol = d.data;
                    let datas = d.data.projects;
                    this.tableList = [];
                    this.contextStat.contextCount = 0;
                    this.contextStat.impor3Count = this.initRepatrol.tableStandard.currentCruxNum;
                    this.contextStat.impor2Count = this.initRepatrol.tableStandard.currentImportantNum;
                    this.contextStat.impor1Count = this.initRepatrol.tableStandard.currentGeneralNum;
                    datas.map(item => {
                        let lis = []
                        item.contexts.map(item2 => {
                            this.contextStat.contextCount += 1
                            let obj = {
                                projectsNo: item.no,
                                name: item.name,
                                contextNo: item.no + '.' + item2.contextNo,
                                context: item2.contextName,
                                importantStr: this.filter(item2.contextType),
                                important: item2.contextType,
                                id: item2.id,
                                result: '',
                                remark: '',
                                description: item2.description,
                                files: item2.files,
                            }
                            lis.push(obj)
                        })
                        this.tableList.push(lis)
                    })
                }
            })
        },
        methods: {
            change() {
                this.$forceUpdate()
            },
            getNowDay() {
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let today = y + '-' + m + '-' + d + ' 00:00:00'
                return today
            },
            getNextYear(time) {
                var date = new Date(time);
                var y = date.getFullYear() + 1;
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('1' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                let next = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                return new Date(next).getTime()
            },
            disabledDate(time) {
                let _minTime = new Date(this.getNowDay()).getTime()
                let _maxTime = this.getNextYear(this.getNowDay())
                if (_minTime && _maxTime) {
                    return time.getTime() < _minTime || time.getTime() > _maxTime
                }
            },
            inspectorUserIdMethod(query) {
                if (query !== '') {
                    this.inspectorListLoading = true;
                    api.inspectorList(query).then(d => {
                        if (d.status && d.data) {
                            this.inspectorList = d.data.list;
                        }
                        this.inspectorListLoading = false;
                    })
                } else {
                    this.inspectorList = [];
                }
            },
            inspectorUserIdChange(userId) {
                let list = this.inspectorList.map(obj => obj.inspectorUserId)
                this.repatrol.inspectorUserTel = this.inspectorList[list.indexOf(userId)].inspectedUserTel
            },
            rulesChange(type) {
                this.rules.rectifyTime = ''
                if (this.repatrol.treat == 'RE_RECTIFY') {
                    this.rules.rectifyTime = {
                        required: true,
                        message: '请选择整改期限日期',
                        trigger: 'change'
                    }
                } else {
                    if (this.rules.rectifyTime) {
                        delete this.rules.rectifyTime
                    }
                }
            },
            filter(id) {
                if (id == 'IMPORTANT') {
                    return "重点项(**)"
                } else if (id == 'CRUX') {
                    return "关键项(***)"
                } else {
                    return "一般项(*)"
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
            tableOption({
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
            submit() {
                // 巡查项校验
                let verify = false
                this.tableList.forEach(item => {
                    item.forEach(context => {
                        if (context.result == undefined || context.result == '') {
                            verify = true
                        }
                    })
                })
                if (verify) {
                    this.$message.error('巡查项里【是否符合】为必填项！！！')
                    return false;
                }
                // 
                if (this.repatrol.result == 'YES') {
                    if (this.repatrol.treat == 'RE_RECTIFY' || this.repatrol.treat == 'REJECT') {
                        this.$message.error('复查结果符合规定情况下只能选择‘正常’的处理方式!')
                        return false
                    }
                }
                if (this.repatrol.result == 'NO') {
                    if (this.repatrol.treat == 'NORMAL') {
                        this.$message.error('复查结果不符合规定情况下只能选择‘再次限期整改’和‘驳回’的处理方式!')
                        return false
                    }
                }
                this.$refs['repatrol'].validate((valid) => {
                    if (valid) {
                        this.$confirm('保存后审核状况将生效，是否保存？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.disabled = true;
                            this.repatrol.contexts = []
                            this.tableList.forEach(item => {
                                item.forEach(context => {
                                    let obj = {};
                                    obj.id = context.id;
                                    obj.result = context.result;
                                    obj.remark = context.remark;
                                    this.repatrol.contexts.push(obj);
                                })
                            })
                            api.review(this.repatrol).then(result => {
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
            //表格（是否符合）触发事件
            singlecheckboxchange(args) {
                this.$set(args.row, 'result', args.result);
                this.contextStat.unImpor3Count = 0;
                this.contextStat.unImpor2Count = 0;
                this.contextStat.unImpor1Count = 0;
                this.tableList.forEach(item => {
                    item.forEach(context => {
                        if (context.result === 'NO') {
                            if (context.important === 'CRUX') {
                                this.contextStat.unImpor3Count++;
                            }
                            if (context.important === 'IMPORTANT') {
                                this.contextStat.unImpor2Count++;
                            }
                            if (context.important === 'GENERAL') {
                                this.contextStat.unImpor1Count++;
                            }
                        }
                    })
                })
                let result3 = this.contextStat.unImpor3Count <= this.initRepatrol.standardNoCruxNum
                let result2 = this.contextStat.unImpor2Count <= this.initRepatrol.standardNoImportantNum
                let result1 = this.contextStat.unImpor1Count + this.contextStat.unImpor2Count <= this.initRepatrol
                    .standardNoGeneralAndNoImportantNum
                if (result3 && result2 && result1) {
                    this.repatrol.result = 'YES'
                } else {
                    this.repatrol.result = 'NO'
                }

            },
        },
        data() {
            return {
                inspectorListLoading: false,
                inspectorList: [],

                repatrolId: "",
                tableList: [],
                filePath: '',

                PreviewShow: false,
                PreviewFileList: [],
                PreviewIndex: 0,
                PreviewTitle: '',

                initRepatrol: {
                    sourceTime: ''
                }, //init 数据
                repatrol: {},

                contextStat: {
                    contextCount: 0,
                    impor3Count: 0,
                    impor2Count: 0,
                    impor1Count: 0,
                    unImpor3Count: 0,
                    unImpor2Count: 0,
                    unImpor1Count: 0,
                },
                disabled: false,
                repatrol: {
                    contexts: [],
                    id: '',
                    inspectorUserId: '',
                    inspectorUserTel: '',
                    rectifyTime: '',
                    id: '',
                    result: '',
                    treat: '',
                },
                rules: {
                    treat: {
                        required: true,
                        message: '请选择处理方式',
                        trigger: 'change'
                    },
                    // result: {
                    //   required: true,
                    //   message: '复查项是否符合必须全部勾选才可显示复查结果',
                    //   trigger: 'change'
                    // },
                    inspectorUserId: {
                        required: true,
                        message: '请输入搜索选择复查人',
                        trigger: 'change'
                    },
                    inspectorUserTel: [{
                        required: true,
                        message: '请输入复查人电话',
                        trigger: 'change'
                    }, {
                        validator: phoneValid,
                        trigger: 'blur'
                    }],
                },
                loading: false,
                pickerOptions: {
                    disabledDate: this.disabledDate
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
</style>