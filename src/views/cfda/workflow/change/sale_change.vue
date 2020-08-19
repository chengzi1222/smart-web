<!-- 小经营店（销售） -->
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
      <el-form label-width="110px" :model="cfda" :rules="rules" ref="cfda" class="demo-ruleForm">
        <!-- 经营信息 -->
        <toggle-form title="经营信息">
          <div class="content">

            <div class="row">
              <div class="row">
                <el-form-item label="主营项目:" prop="projectMain">
                  <btn-select :data="projectSidBtn" @changeData="projectSidChange">
                  </btn-select>
                  <p style="color: #ff4949" v-if="cfda.projectMain.length == 0">请至少选择一项</p>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="兼营项目:">
                  <el-checkbox-group v-model="cfda.projectSid" size="large">
                    <el-checkbox-button v-for="item in projectMainItem" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>

          </div>
        </toggle-form>

        <!-- 经营信息（变更前） -->
        <toggle-form title="经营信息(变更前)">
          <div class="content">

            <div>
              <div class="row">
                <el-form-item label="主营项目:">
                  {{cfda.projectMainStr}}
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="兼营项目:">
                  {{cfda.projectSidStr}}
                </el-form-item>
              </div>
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
  import BtnSelect from "components/BtnSelect.vue";
  import scroll from "utils/scroll";
  import { bizChange } from "api/cfda/bizWorkflow";
  import { listDictUserItemByDictCode } from 'api/common';
  export default {
    components: {
      ToggleForm,
      BtnSelect,
    },
    async mounted() {
      //滚动效果
      scroll.call(this, 'slideIndex');
      await listDictUserItemByDictCode("CFDA_S_MAIN").then((r) => {
        let list1 = r.data;
        let list2 = [];
        for (let i = 0; i < list1.length; i++) {
          let item = list1[i];
          let indexof = item.path.indexOf('.');
          if (indexof == -1) {
            let path = item.path + '.';
            list2.push(item);
            for (let j = 0; j < list1.length; j++) {
              let item2 = list1[j];
              indexof = item2.path.indexOf(path);
              if (indexof == 0) {
                item.children = item.children ? item.children : [];
                item.children.push(item2);
              }
            }
          }
        }
        for (let i = 0; i < list2.length; i++) {
          let item = list2[i];
          if (item.children && item.children.length > 0) {
            this.$set(item, 'hasChildren', true);
          } else {
            this.$set(item, 'hasChildren', false);
          }
          if (item.check) {
            this.$set(item, 'active', true);
            this.$set(item, 'cname', item.check.name);
            this.$set(item, 'ccode', item.check.code);
          } else {
            this.$set(item, 'active', false);
            this.$set(item, 'cname', '');
            this.$set(item, 'ccode', '');
          }
        }
        this.projectSidBtn = list2;
      });

      await listDictUserItemByDictCode("CFDA_S_SIDELINE").then((r) => {
        this.projectMainItem = r.data;
      });
      this.init();
    },
    methods: {
      backBtn() {
        this.$router.push({ name: this.$route.query.back });
      },
      init() {
        let data = this.cfdaData;
        let psb = this.projectSidBtn;
        let projectMainData = data.projectMain;

        for (let i = 0; i < projectMainData.length; i++) {
          let fs = projectMainData[i];
          for (let j = 0; j < psb.length; j++) {
            let psbitem = psb[j];
            let indexof = fs.indexOf(psbitem.code);
            if (indexof == 0) {
              if (psbitem.code == fs) {
                psbitem.active = true;
                psbitem.ccode = psbitem.code;
                psbitem.cname = psbitem.name;
              } else {
                let children = psbitem.children
                for (let o = 0; o < children.length; o++) {
                  if (fs == children[o].code) {
                    psbitem.active = true;
                    psbitem.ccode = children[o].code;
                    psbitem.cname = children[o].name;
                  }
                }
              }
            }
          }
        }
        this.cfda = data;
      },
      submitReview() {
        this.$refs['cfda'].validate((valid) => {
          if (valid) {
            bizChange(this.cfda).then((r) => {
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
          } else {
            this.$message({
              message: '请填写完毕所有必填字段!',
              type: 'warning'
            });
          }
        });

      },
      projectSidChange(data) {
        let project = [];
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.ccode && item.ccode != '') {
            project.push(item.ccode);
          }
        }
        this.cfda.projectMain = project;
      },
    },
    props: {
      cfdaData: {
        type: Object
      },
    },
    data() {
      return {
        showMore: false,
        slideIndex: -1,
        tableData: [{ index: 1 }, { index: 2 }],
        cfdaInfo: {},
        isDisable: false,
        projectMainItem: [],
        projectSidBtn: [],
        cfda: {
          entityId: '',
          projectMain: [],
          projectSid: [],
          workId: '',
        },
        rules: {
          projectMain: [
            { type: 'array', required: true, message: '请选择主营项目', trigger: 'change' }
          ],
        },
        // 左边悬浮栏的数据
        progress: [
          {
            title: '变更操作'
          },
          {
            title: '经营项目（变更前）'
          }
        ],

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
      >li {
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

  // 更多食品类别的按钮
  .row .more-btn {
    display: block;
    background: #ebeff2;
    color: #6d7787;
    margin-bottom: 10px;
    border: 0px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
  }

  .content {
    // padding-left: 25%;
    margin-top: 20px;
  }
</style>