<template>
    <el-form :model="baseObj" :rules="rules_" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
            <div class="content">
                <el-form-item label="题库名称：" prop="name" >
                    <p v-if='show'>{{baseObj.name}}</p>
                    <el-input v-else placeholder="30字以内" :disabled='id!=""&&type=="add"' class="w300" maxlength="30"
                        v-model="baseObj.name"></el-input>
                </el-form-item>
                <el-form-item label="题库描述：" prop="description" >
                    <p v-if='show'>{{baseObj.description}}</p> 
                    <el-input v-else placeholder="100字以内" class="w300" :rows="5" maxlength="100" type="textarea"
                        v-model="baseObj.description">
                    </el-input>
                </el-form-item>
                <el-form-item label="行业类型：" prop="entityType" >
                    <p v-if='show'>{{baseObj.entityTypeStr}}</p>
                    <el-checkbox-group v-else class="w550" :disabled='id!=""&&type=="add"' v-model="baseObj.entityType">
                        <el-checkbox-button class="mr20" v-for="item in entityType" :label="item.key" :key="item.key">
                            {{item.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
            </div>
            <div class="textR">
                <el-button type="primary w100" @click="submit" v-if='!show'>保存
                </el-button>
                <el-button type="primary w100" @click="show=false" v-if='show&&type=="edit"'>编辑
                </el-button>
            </div>
        </ToggleForm>
    </el-form>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";
    import {
        getPublic,
        getEntityType,
        getYear
    } from "../../com.js";
    import * as api from "api/assess/index";
    export default {
        components: {
            ToggleForm
        },
        props: {
            id: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                show: false,
                type: 'add',
                rules_: {
                    name: [{
                            required: true,
                            message: '请输入题库名称',
                            trigger: 'blur'
                        },
                    ],
                    description: [{
                        required: true,
                        message: '请输入题库描述',
                        trigger: 'blur'
                    }, ],
                    entityType: [{
                        required: true,
                        type: 'array',
                        message: '请选择行业类型',
                        trigger: 'change'
                    }]
                },
                baseObj: {
                    entityType: [],
                    name: '',
                    description: '',
                },
                entityType: [],
            };
        },
        watch: {
            id(val) {
                this.get(val)
            }
        },
        async mounted() {
            if (this.$route.query.type) {
                this.type = this.$route.query.type;
            }
            this.entityType = await getEntityType()
        },
        methods: {
            get(id_) {
                api.questionDepotInfo({
                    id: id_
                }).then(r => {
                    if (r.status) {
                        this.baseObj = r.data;
                        this.baseObj.entityType = this.baseObj.entityType.split(',')
                    }

                })
            },
            submit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        const data = new FormData()
                        data.append('entityType', this.baseObj.entityType.toString())
                        data.append('name', this.baseObj.name)
                        data.append('description', this.baseObj.description)
                        data.append('id', this.id)
                        api.questionDepotAddOrUpdate(data, this.type == 'add' ? 'add' : 'update').then((r) => {
                            if (!r.status) {
                                this.$message({
                                    message: r.message,
                                    type: r.level
                                });
                                return;
                            }
                            let str = this.type == 'edit' ? '编辑' : '添加'
                            this.$message({
                                message: '题库基础信息' + str + '成功!',
                                type: 'success'
                            });
                            this.show = true;
                            if (this.type == 'add') {
                                this.$emit('ok', r.data)
                            } else {
                                this.get(this.id)
                            }
                        })
                    }
                })
            }
        }
    };
</script>
<style scoped lang="scss">
    .content {
        width: 700px;
        margin: 30px auto 0;
    }

    .w550 {
        width: 550px !important;
    }
</style>