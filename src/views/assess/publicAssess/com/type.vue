<template>
    <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="考核类型管理">
            <div class="content">
                <el-form-item label="考核辖区" prop="industryType">
                    <el-checkbox-group class="w550" @change="industryChange" v-model="baseObj.industryType">
                        <el-checkbox-button class="mr20" v-for="item in industryArr" :label="item.code"
                            :key="item.code">{{item.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="考核类型：" prop="industryType">
                    <el-checkbox-group class="w550" @change="industryChange" v-model="baseObj.industryType">
                        <el-checkbox-button class="mr20" v-for="item in industryArr" :label="item.code"
                            :key="item.code">{{item.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="人员类型：" prop="industryType">
                    <el-checkbox-group class="w550" @change="industryChange" v-model="baseObj.industryType">
                        <el-checkbox-button class="mr20" v-for="item in industryArr" :label="item.code"
                            :key="item.code">{{item.name}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
            </div>
        </ToggleForm>
    </el-form>
</template>

<script>
    import ToggleForm from "components/ToggleForm.vue";

    export default {
        components: {
            ToggleForm
        },
        data() {
            return {
                industryArr: [{
                        code: "5855",
                        name: "食品销售经营类"
                    },
                    {
                        code: "5505",
                        name: "餐饮服务经营类"
                    },
                    {
                        code: "5755",
                        name: "单位食堂类"
                    },
                    {
                        code: "5555",
                        name: "食用农产品经营类"
                    },
                    {
                        code: "5455",
                        name: "食品小经营店（销售）"
                    },
                    {
                        code: "5553",
                        name: "食品小经营店（餐饮）"
                    },
                    {
                        code: "5552",
                        name: "市场开办方"
                    }
                ],
                rules: {},
                select: [{
                        name: "存在",
                        key: true
                    },
                    {
                        name: "不存在",
                        key: false
                    }
                ],
                baseObj: {
                    industryType: []
                },

            };
        },

        mounted() {
        },
        methods: {
            industryChange() {},
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