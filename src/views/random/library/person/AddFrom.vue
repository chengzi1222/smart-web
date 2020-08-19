<template>
  <el-dialog title="设置人员属性" custom-class="stg-dialog" :close-on-click-modal="false" :modal="modal" width="580px" :modal-append-to-body="false"
    :visible="visible" @close="close" @open="open">
    <el-form :model="model" :rules="rules" ref="from" label-width="100px" class="mt20">
      <div class="row" v-show="isEdit">
        <el-form-item label="姓名:">
          <span>{{model.userName}}</span>
        </el-form-item>
      </div>
      <div class="row" v-show="isEdit">
        <el-form-item label="所属部门:">
          <span>{{model.userDeptName}}</span>
        </el-form-item>
      </div>
      <div class="row">
        <el-form-item label="是否组长:">
          <el-switch v-model="model.leader"></el-switch>
        </el-form-item>
      </div>
      <div class="row contw70">
        <el-form-item label="分管业务:" prop="biz" style="width: 100%">
          <el-checkbox-group v-model="model.biz" size="large" class="check">
            <el-checkbox-button v-for="item in bizs" :key="item.key" :label="item.key">
              {{item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-form-item label="备注:" prop="remark">
        <el-input type="textarea" placeholder="请输入备注" class="w400" :rows="5" v-model="model.remark"></el-input>
        <span class="tip">(选填)</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close" class="w65">取消</el-button>
      <el-button @click="submit" class="w65" type="primary">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as common from 'api/common';
  import { checkText } from 'utils/validate';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      modal: {
        type: Boolean,
        default: false,
      },
      data: {
        required: false,
        type: Object,
      }
    },
    mounted() {
      common.getEnums(['com.ybveg.govx.enums.SubTypeEnum']).then(result => {
        if (result.status) {
          this.bizs = result.data
        }
      })
    },
    methods: {
      submit() {
        this.$refs.from.validate(valid => {
          if (valid) {
            const model = Object.assign({}, this.model,
              {
                biz: this.model.biz.join(","),
                leader: this.model.leader === true ? 'YES' : "NO",
                leaderLabel: this.model.leader === true ? '是' : "否"
              });
            if (model.id) { // 有ID 说明是编辑
              this.isEdit = true;
              const bizLabelArr = [];
              const biz = this.model.biz;
              this.bizs.forEach(item => {
                if (biz.includes(item.key)) {
                  bizLabelArr.push(item.name);
                }
              });
              model.bizLabel = bizLabelArr.join(",")
            }
            this.$emit("submit", model);
          } else {
            this.$message("数据校验失败,无法保存!")
          }
        })
      },
      open() {
        if (this.data) {
          this.model = this.data
        } else {
          this.model = {
            biz: [],
            remark: "",
            leader: false,
          }
        }
      },
      close() {
        this.$emit('update:visible', false);  // 双向绑定
      }
    },
    watch: {
    },
    data() {
      return {
        bizs: [],
        model: {
          biz: [],
          remark: "",
          leader: false,
        },
        isEdit: false,
        rules: {
          biz: [{
            type: "array",
            required: true,
            message: "请选择分管业务",
            trigger: "change"
          }],
          remark: [
            { min: 0, max: 120, message: '长度在 0 到 120 个字符', trigger: 'change' },
            { validator: checkText, trigger: 'change' }
          ]
        }
      }
    },
  }
</script>

<style scoped lang="sass">
  .check {
    display: inline-block;
    width: 100% !important;
  }
</style>
