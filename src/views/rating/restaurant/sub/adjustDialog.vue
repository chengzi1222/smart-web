<template>
  <el-dialog
    title="调整风险等级"
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
      <p class="tip mb20">
        静态得分:{{listData.staticScore}}, 动态得分:{{listData.dynamicScore}}, 总得分:{{listData.dynamicScore+listData.staticScore}}, 风险等级:
        <span
          :class="listData.riskLevel"
        >{{listData.riskLevel}}</span>
      </p>
      <div class="row">
        <el-form-item label="调整风险等级:" prop="adjustedLevel">
          <el-select
            v-model="form.adjustedLevel"
            placeholder="请选择风险等级"
            @change="changeGrade"
            class="w200"
          >
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
        <span class="tip" style="margin-left:-20px">{{adjust == 'up'? '上调':adjust =='down'?'下调':''}}</span>
      </div>
      <span class="tips ml140">存在上调/下调风险等级的情形，建议上调/下调1个、2个风险等级。</span>
      <div class="row">
        <el-form-item label="审核人:" prop="reviewerName">
          <el-select v-model="form.reviewerName" placeholder="请选择审核人" class="w200">
            <el-option
              :label="item.inspectorUserName"
              :value="item.inspectorUserName"
              v-for="item in inspectorList"
              :key="item.inspectorUserId"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <p class="tip mb20" v-if="adjust">选择{{adjust === 'up'?'上调':'下调'}}原因(必填, 多选):</p>
      <div v-if="adjust == 'up'">
        <el-checkbox-group v-model="form.reasonIds">
          <el-checkbox v-for="item in up" :key="item.id" :label="item.id">{{item.content}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-if="adjust == 'down'">
        <el-checkbox-group v-model="form.reasonIds">
          <el-checkbox v-for="item in down" :key="item.id" :label="item.id">{{item.content}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-form-item class="mt30">
        <el-button class="floatR" type="primary" @click="confirmAdd">确认</el-button>
        <el-button class="floatR mr20" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import *  as api from '../../../../api/rating/restaurantRating2'
export default {
  props: {
    showTip: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
    },
    listData: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        reviewerName: '',
        adjustedLevel: '',
        reasonIds: [],
        entityId: ''
      },
      adjust: '',
      up: [],
      down: [],
      rules: {
        adjustedLevel: [
          { required: true, message: '请选择风险等级', trigger: 'change' }
        ],
        reviewerName: [
          { required: true, message: '请选择审核人', trigger: 'change' }
        ]
      },
      grade: {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3
      },
      inspectorList: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel')
    },
    async confirmAdd() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (!this.checkGrade('adjust') || !this.checkGrade('none')) { return }
          this.form.entityId = this.listData.id
          let result = await api.addjustLevel(this.form)
          if (result.status) {
            this.$emit('success')
          }
        }
      });
    },
    changeGrade() {
      if (!this.checkGrade('adjust')) { return }
      if (this.grade[this.form.adjustedLevel] > this.grade[this.listData.riskLevel]) {
        this.adjust = 'up'
      } else if (this.grade[this.form.adjustedLevel] < this.grade[this.listData.riskLevel]) {
        this.adjust = 'down'
      } else {
        this.adjust = ''
      }
    },
    async getReason() {
      let up = await api.getReason({ adjustType: 'UP' })
      let down = await api.getReason({ adjustType: 'DOWN' })
      this.up = up.data
      this.down = up.data
    },
    async getInspectorList() {
      let result = await api.inspectorList()
      this.inspectorList = result.data.list
    },
    checkGrade(key) {
      if (key === 'adjust') {
        if (Math.abs(this.grade[this.form.adjustedLevel] - this.grade[this.listData.riskLevel]) > 2) {
          this.$message.error('上调/下调等级不能超过两个等级');
          return false
        }
      }
      if (key == 'none') {
        if (this.grade[this.form.adjustedLevel] == this.grade[this.listData.riskLevel]) {
          this.$message.error('等级未调整');
          return false
        }
      }
      return true
    }
  },
  mounted() {
    this.getReason()
    this.getInspectorList()
  }
}
</script>
<style lang="scss" scoped>
.content {
  padding: 0 60px;
  box-sizing: border-box;
}
.tip {
  font-size: 14px;
  font-weight: 400;
  color: #A2AAB6;
  line-height: 20px;
  > span {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
  }
}
.tips{
  @extend .tip;
  font-size: 12px;
}
.ml140 {
  margin-left: 140px;
}
.mt30 {
  margin-top: 30px;
}
.center {
  text-align: center;
}
.A {
  color: #60ce99;
}
.B {
  color: #0db5ef;
}
.C {
  color: #ffbc40;
}
.D {
  color: #f95557;
}
.el-checkbox {
  margin-top: 20px;
  display: block;
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
}
</style>
