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
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm content"
    >
      <div class="row">
        <el-form-item label="检查项目:">
          <span>t{{form.name}}</span>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="检查内容:" prop="content">
          <el-input
            type="textarea"
            class="w300"
            :maxlength="200"
            :autosize="{minRows:6}"
            placeholder="请输入核查内容, 200字以内"
            v-model="form.content"
          ></el-input>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="分值:" prop="score">
          <el-input v-model="form.score" :maxlength="2" placeholder="请输入分值" class="w300"></el-input>
        </el-form-item>
        <span class="tip" style="margin-left:-20px">0＜分值≤{{score}}</span>
      </div>
      <span class="tips ml140">{{message}}</span>
      <div class="row">
        <el-form-item label="是否包含合理缺项:" prop="absent">
          <el-switch
            v-model="form.absent"
            active-color="#0DB5EF"
            active-value="YES"
            inactive-value="NO"
            inactive-color="#C2CAD2"
          ></el-switch>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="状态:" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" class="w200">
            <el-option label="启用" value="ENABLE"></el-option>
            <el-option label="禁用" value="DISABLE"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="快捷检查:" prop="inspect">
          <el-input
            type="textarea"
            class="w300"
            maxlength="1000"
            placeholder="可配置巡查时的快捷录入项, 换行一次为一个检查项"
            :autosize="{minRows:6}"
            v-model="form.quickCheck"
          ></el-input>
        </el-form-item>
      </div>
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
    editData: {
      type: Object
    },
    showTip: {
      type: Boolean
    },
    projectData: {
      default: []
    },
    tableList: {
      default: []
    }
  },
  data() {
    return {
      form: {
        name: {},
        content: '',
        score: '',
        status: '',
        quickCheck: '',
        absent: 'NO'
      },
      rules: {
        content: [
          { required: true, message: '请输入检查内容', trigger: 'blur' },
        ],
        score: [
          { required: true, message: '请输入分值', trigger: 'blur' },
          { message: "请输入1-40的整数", pattern: /(^[1-9]$)|(^[1-3][0-9]$)|(^[4][0]$)/, trigger: "blur" },
        ],
        absent: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      },
      scoring: [
        {
          label: '单选计分',
          value: 'radio'
        },
        {
          label: '多选计分',
          value: 'multiple'
        },
        {
          label: '多选取最高值计分',
          value: 'highest'
        }
      ],
      score: 0,
      message: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel')
    },
    confirmAdd() {
      let quickCheck = []
      this.form.quickCheck.split(/\n/).map((item) => {
        if (item !== '') {
          quickCheck.push(item.trim())
        }
      });
      this.form.quickCheck = quickCheck.join(',')
      this.$emit('success', this.form)
    },
    selectChange() {
      this.score = this.form.name.score
    }
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.editData))
    this.form.quickCheck = this.form.quickCheck.split(',').join("\n")
    if (this.form.rule == 'MULTIPLE') {
      let index = 0
      let len = 0
      let total = 0
      this.projectData.forEach((item, i) => {
        item.ProjectNo == this.form.projectNo ? index = i : ''
      })
      if (this.tableList.length > 0) {
        this.tableList[index].forEach(item => {
          if (item.status == 'ENABLE') {
            len++
            total = total + Number(item.score)
          }
        })
      }
      this.message = `本检查项目总分${this.form.score}, 已配置${len}项检查内容, 剩余${this.form.score - total}分`
    } else {
      this.message = `本检查项目总分${this.form.score}`
    }
  }
}
</script>
<style lang="scss" scoped>
.tip {
  font-size: 12px;
  font-weight: 400;
  color: #a2aab6;
  line-height: 20px;
  > span {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
  }
}
.ml140 {
  margin-left: 140px;
}
</style>
