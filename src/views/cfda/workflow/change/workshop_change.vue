<!-- 小作坊 -->
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
                <el-form-item label="生产形式:" prop="prodForm">
                  <el-checkbox-group v-model="cfda.prodForm" size="large">
                    <el-checkbox-button v-for="item in prodFormBtn" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="生产类别:" prop="prodType">
                  <el-checkbox-group v-model="cfda.prodType" size="large">
                    <el-checkbox-button v-for="item in prodTypeBtn" :label="item.code" :key="item.id">{{item.name}}</el-checkbox-button>
                  </el-checkbox-group>
                  <el-button class="more-btn" @click="showMore = !showMore">更多食品类别</el-button>
                  <search-tap v-if="showMore" :ajax='ajax' listFiled="data" text="name" checkedListFiled="checked" @searchTapChange="searchTapChange1"
                    placeholder="请输入搜索信息,例:酒">
                  </search-tap>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="品种明细:" prop="prodVariety">
                  <search-tap :ajax='ajax2' :checkbox="cfda.prodVariety" listFiled="data" text="name" checkedListFiled="checked" @searchTapChange="searchTapChange2"
                    placeholder="请输入搜索信息,例:酒">
                  </search-tap>
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
                <el-form-item label="生产形式:">
                  {{cfda.prodFormStr}}
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="生产类别:">
                  {{cfda.prodTypeStr}}
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="品种明细:">
                  {{cfda.prodVarietyStr}}
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
  import scroll from "utils/scroll";
  import { bizChange } from "api/cfda/bizWorkflow";
  import SearchTap from "components/SearchTap.vue";
  import { listDictUserItemByDictCode } from 'api/common';
  import { getProd, getProdByList, getProdTypes } from "api/cfda/add.js";
  export default {
    components: {
      ToggleForm,
      SearchTap
    },
    async mounted() {
      //滚动效果
      scroll.call(this, 'slideIndex');

      //生成类别
      await listDictUserItemByDictCode("CFDA_V_CATEGORY").then((r) => {
        this.prodTypeBtn = r.data;
      });

      //生产形式
      await listDictUserItemByDictCode("CFDA_V_FROM").then((r) => {
        this.prodFormBtn = r.data;
      });

      this.init();
    },
    methods: {
      backBtn() {
        this.$router.push({ name: this.$route.query.back });
      },
      async init() {
        let data = Object.assign({}, this.cfdaData);
        await getProdByList('CFDA_V_VARIETY', data.prodVariety).then((res) => {
          data.prodVariety = res.data;
        });
        await getProdTypes(data.prodType, "CFDA_V_CATEGORY").then((r) => {
          this.prodTypeBtn = r.data;
        });
        data.workId = this.$route.query.workId
        this.cfda = data;
      },
      //生产类别数据验证
      prodTypeChangeValid(rule, value, callback) {
        setTimeout(() => {
          if (this.cfda.prodType.length == 0) {
            //如果为空,抛出异常
            if (this.cfda.prodTypeAdded && this.cfda.prodTypeAdded.length == 0) {
              callback(new Error('请选择生产类别'));
              return;
            } else if (this.cfda.prodTypeAdded && this.cfda.prodTypeAdded.length > 0) {
              //如果不为空,抛出正确
              callback();
              return;
            }
            callback(new Error('请选择生产类别'));
          } else {
            callback();
          }
        }, 200);
      },
      prodVarietyChangeValid(rule, value, callback) {
        setTimeout(() => {
          //他为空
          if (this.cfda.prodVariety.length == 0) {
            callback(new Error('请选择品种明细'));
          } else {
            callback();
          }
        }, 200);
      },
      prodTypeBlurValid(rule, value, callback) {
        if (this.cfda.prodType.length == 0) {
          callback(new Error('请选择生产类别'));
        } else {
          callback();
        }
      },
      ajax2(a) {
        return new Promise((resolve, reject) => {
          getProd("CFDA_V_VARIETY", a).then((r) => {
            let list = r.data;
            for (let i = 0; i < list.length; i++) {
              list[i].key = list[i].code;
            }
            let rest = {
              data: list,
              checked: this.cfda.prodVariety
            }
            resolve(rest)
          });
        });
      },
      ajax(a) {
        return new Promise((resolve, reject) => {
          let tbtn = this.prodTypeBtn;
          let types = [];
          for (let i = 0; i < tbtn.length; i++) {
            types.push(tbtn[i].code);
          }
          getProd("CFDA_V_CATEGORY", a, types).then((r) => {
            let list = r.data;
            for (let i = 0; i < list.length; i++) {
              list[i].key = list[i].code;
            }
            let rest = {
              data: list,
              checked: this.cfda.prodTypeAdded
            }
            resolve(rest)
          });
        });
      },
      //当searchTap组件选项变化时触发
      searchTapChange1(checked) {
        this.cfda.prodTypeAdded = checked;
      },
      searchTapChange2(checked) {
        this.cfda.prodVariety = checked;
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
        prodFormBtn: [],
        prodTypeBtn: [],
        cfda: {
          prodTypeAdded: [],
          entityId: '',
          prodForm: [],
          prodType: [],
          prodType2: [],
          prodVariety: [],
          workId: '',
        },
        rules: {
          prodForm: [
            { type: 'array', required: true, message: '请选择生产形式', trigger: 'change' }
          ],
          prodType: [
            { validator: this.prodTypeChangeValid, trigger: 'blur' },
            { validator: this.prodTypeChangeValid, trigger: 'change' },
          ],
          prodVariety: [
            { validator: this.prodVarietyChangeValid, trigger: 'blur' },
            { validator: this.prodVarietyChangeValid, trigger: 'change' },
          ]
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

  // .content {
  //     // padding-left: 25%;
  //     margin-top: 20px;
  // }
</style>