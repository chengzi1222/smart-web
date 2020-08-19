<template>
  <el-dialog
    title="编辑核查内容"
    :visible.sync="showTip"
    width="30%"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="核查内容" prop="content">
        <el-input
          type="textarea"
          class="w300"
          maxlength="200"
          placeholder="请输入核查内容, 200字以内"
          :autosize="{minRows:6}"
          v-model="form.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="重要性" prop="importance">
        <el-select v-model="form.importance" placeholder="请选择活动区域">
          <el-option label="重点项(**)" value="IMPORTANT"></el-option>
          <el-option label="关键项(***)" value="CRUX"></el-option>
          <el-option label="一般项(*)" value="GENERAL"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择活动区域">
          <el-option label="启用" value="YES"></el-option>
          <el-option label="禁用" value="NO"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快捷检查" prop="inspect">
        <el-input
          type="textarea"
          class="w300"
          maxlength="1000"
          placeholder="可配置巡查时的快捷录入项, 换行一次为一个检查项"
          :autosize="{minRows:6}"
          v-model="form.quickCheck"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="floatR" type="primary" @click="confirmAdd">确认</el-button>
        <el-button class="floatR mr20" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import * as api from '../../../api/xchc/index'
export default {
  props: {
    showTip: {
      type: Boolean,
      default: true
    },
    dialogData: {
      type: Object,
    },
    tableId:{
      type:String
    },
    editData:{
      type:Object
    }
  },
  data() {
    return {
      form: {
        projectId:'',
        content: '',
        importance: 'GENERAL',
        status: 'YES',
        quickCheck:'',
        tableId:this.tableId,
        id:''
      },
      addNew:false,
      rules: {
        content: [
          { required: true, message: '请输入核查内容', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        importance: [
          { required: true, message: '请选择重要性', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      projectList:[]
    }
  },
  methods: {
    handleClose() {
      this.$emit("cancel")
    },

    async confirmAdd(){
      let quickCheck = []
      this.form.quickCheck.split(/\n/).map((item) =>{
        if(item !== ''){
          quickCheck.push(item.trim())
        }
      });
      this.form.quickCheck = quickCheck.join(',')
      let result = await api.addContent({
        content:this.form.content,
        importance:this.form.importance,
        status:this.form.status,
        quickCheck:this.form.quickCheck,
        id:this.form.contentId,
        tableId:this.tableId
      })
      if(result.status){
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.handleClose()
        this.$parent.getList()
      }
    }
  },
  mounted(){
    this.form = JSON.parse(JSON.stringify(this.editData))
    this.form.quickCheck = this.form.quickCheck.split(',').join("\n")
  }
}
</script>
<style lang="scss" scoped>
</style>
