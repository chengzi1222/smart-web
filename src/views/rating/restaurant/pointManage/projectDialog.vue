<template>
  <el-dialog
    :title="title"
    :visible.sync="showTip"
    width="40%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="140px"
      class="demo-ruleForm content"
    >
      <el-form-item label="检查项目" prop="value">
        <el-input v-model="form.value" :maxlength="30" placeholder="请输入, 20字以内" class="w300"></el-input>
      </el-form-item>
      <el-form-item label="计分规则" prop="rule">
        <el-select v-model="form.rule" placeholder="请选择计分规则" class="w200">
          <el-option
            v-for="item in scoring"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分值" prop="score">
        <el-input v-model="form.score" :maxlength="2" placeholder="请输入分值, 1-40" class="w300"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="scoring">
        <el-select v-model="form.status" placeholder="请选择状态" class="w200">
          <el-option label="启用" value="YES"></el-option>
          <el-option label="禁用" value="NO"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="mt30">
        <el-button class="floatR" type="primary" @click="confirmAdd">确认</el-button>
        <el-button class="floatR mr20" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    projectData: {
      type: Object
    },
    showTip:{
        type:Boolean
    },
    index:{
      default:''
    }
  },
  data() {
    return {
      form: {

      },
      rules: {
        value: [
          { required: true, message: '请输入检查项目', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        rule: [
          { required: true, message: '请选择计分规则', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请输入计分规则', trigger: 'blur' },
          { message: "请输入1-40的整数", pattern: /(^[1-9]$)|(^[1-3][0-9]$)|(^[4][0]$)/, trigger: "blur" },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      },
      scoring: [
        {
          label: '单选计分',
          value: 'SINGLE'
        },
        {
          label: '多选计分',
          value: 'MULTIPLE'
        },
        {
          label: '多选取最高值计分',
          value: 'HIGHEST'
        }
      ]
    }
  },
  methods: {
      handleClose(){
          this.$emit('cancel')
      },
      confirmAdd(){
         this.$refs['form'].validate((valid) => {
          if (valid) {
           this.$emit('success',this.form,this.index)
          }
        });
      }
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.projectData))
   }
}
</script>
<style lang="scss" scoped>
</style>
