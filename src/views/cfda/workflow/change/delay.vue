<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
          <p class="floatR right">
            <span>{{item.successNum}}</span>
            <span>{{item.totalNum}}</span>
          </p>
        </li>
      </ul>
    </div>
    <!-- 左边信息悬浮栏 end-->
    <div class="right-info">
      <el-form label-width="110px" class="demo-ruleForm">
        <!-- 延续操作 -->
        <toggle-form title="延续操作">
          <div class="content">
            <div class="row">
              <el-form-item label="三小备案延续至:">

                <el-date-picker class="w200" :picker-options="options" v-model="cfdaForm.delayDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :clearable="true" placeholder="选择日期">
                </el-date-picker>

              </el-form-item>
            </div>
          </div>
        </toggle-form>

        <!-- 备案有效期（变更前） -->
        <toggle-form title="备案有效期（延续前）">
          <div class="content">
            <div class="row">
              <el-form-item label="三小备案有效期:">
                <span>{{cfdaForm.delayDateStr}}</span>
              </el-form-item>
            </div>
          </div>
        </toggle-form>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button style="width:120px;" @click="backBtn">返回</el-button>
        <el-button type="primary" @click="submitReview" :disabled="isDisable">提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleForm from "components/ToggleForm.vue";
import scroll from "utils/scroll";
import { bizContinue } from "api/cfda/bizWorkflow";
export default {
  components: {
    ToggleForm
  },
  async mounted() {
    //滚动效果
    scroll.call(this, 'slideIndex');
    let date = new Date(this.cfdaForm.delayDate)
    this.beginDate = date.getTime()
  },
  methods: {
    backBtn() {
      this.$router.push({ name: this.$route.query.back });
    },
    submitReview() {
      if (!this.cfdaForm.delayDate) {
        this.$message({
          message: '请选择备案有效期',
          type: 'warning'
        });
        return;
      }
      bizContinue(this.cfdaForm).then((r) => {
        if (!r.status) {
          this.$message({
            message: r.message,
            type: r.level
          });
          return;
        }
        this.$message({
          message: '提交审核成功!',
          type: 'success'
        });
        this.isDisable = true;
        this.backBtn();
      });

    }
  },
  props: {
    cfdaForm: {
      type: Object,
    },
  },
  data() {
    return {
      slideIndex: -1,
      tableData: [{ index: 1 }, { index: 2 }],
      isDisable: false,
      beginDate: Date.now(),
      // 左边悬浮栏的数据
      progress: [
        {
          title: '延续操作'
        },
        {
          title: '备案有效期（延续前）'
        }
      ],
      options: {
        disabledDate: (time) => {
          return time.getTime() < this.beginDate
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 左边悬浮信息栏的样式 start
$c: #0db5ef;

.left-info {
  width: 210px;
  height: 560px;
  background: #fff;
  position: fixed;
  margin-left: -230px;
  margin-top: -20px;
  // z-index: 2;

  .head-block {
    background: #f2f5f8;
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
    > li {
      border-right: 2px solid #ebf1f5;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      cursor: default;
      &:hover {
        background: #f2f5f8;
      }
      .right {
        color: #a2aab6;
      }
    }
    .activePosition {
      border-right: 2px solid $c;
      .left {
        color: $c;
      }
    }
  }
}
// 左边悬浮信息栏的样式 end

.right-info {
  width: 100%;
}

// .content {
//     // padding-left: 25%;
//     margin-top: 20px;
// }
</style>