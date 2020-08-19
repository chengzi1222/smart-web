<!-- 录入页面 -->
<template>
  <div class="user-box">

    <!-- 头部选项 -->
    <div class="page-tilt">
      <b></b>
      <span>{{isDrafts?'草稿箱':(entityName+'主体录入')}}</span>
    </div>
    <ul class="tab-box">
      <li v-for="(item,index) in lists" @click="liClick(item,index)" :key="index" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
        <span @click="liClick(item,index)" :data-index='index'>{{item.tabName}}</span>
        <span v-if="item.num" style="margin-left:20px;">{{item.num}}</span>
      </li>
      <li class="tab-bott"></li>
    </ul>

    <!-- 草稿箱 start-->
    <draft v-if="isDrafts" @edit="draftEdit" :entityType="form.entityType" @changeTable='getBackupNum'></draft>

    <!-- 信息录入 start -->
    <div v-if="!isDrafts">

      <!-- 主要内容 start -->
      <div class="main-body no-star">
        <div class="form-item">今日已提交{{entityName}}主体数:
          <span style="margin-left:10px;">{{count}}</span>
        </div>
        <div class="form-item">主体类型:
          <el-button @click="btnClick(item,index)" class="router-btn" :class="{'active':index==currentBtn}" v-for="(item,index) in btns" :key="index">
            {{item.title}}
          </el-button>
        </div>

        <!-- 左边信息悬浮栏 start-->
        <div class="left-info">

        <div class="head-block">
          <ul class="main-block">
            <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
              <p class="floatL left">{{item.title}}</p>
            </li>
          </ul>
        </div>
        </div>
        <!-- 左边信息悬浮栏 end-->

        <!-- 右边表单部分 start-->
        <div class="right-info">

          <!-- 基础信息 -->
          <base-component @getData="getData" :entityType="form.entityType" :handleState="handleState" :initData="form" :key="currentBtn" :natureType="form.natureType" ref="prodcut" @validated="validated"></base-component>

          <!-- 负责人信息 -->
          <corp-component @getData="getData" :handleState="handleState" :initData="form" ref="corp" @validated="validated"></corp-component>

          <!--经营信息-->
          <manage-component @getData="getData" :handleState="handleState" :initData="form" ref="manage" @validated="validated"></manage-component>

          <!-- 责任落实 -->
          <duty-component @getData="getData" :handleState="handleState" :initData="form" ref="duty" @validated="validated"></duty-component>

        </div>
        <!-- 右边表单部分 end-->
      </div>
      <!-- 主要内容 end -->
      <!-- 底部按钮 start-->
      <div class="foot-btn" style="z-index:998">
        <div>
          <el-button style="width:120px;" @click="saveback">保存到草稿箱</el-button>
          <el-button type="primary" @click="submitSub">提交审核</el-button>
        </div>
      </div>
      <!-- 底部按钮 end-->
    </div>
    <!-- 信息录入 end -->
  </div>
</template>

<script>
import scroll from "utils/scroll";
import draft from '../draft'
import CorpComponent from 'views/subject/common/CorpComponent';
import DutyComponent from 'views/subject/common/DutyComponent';
import BaseComponent from 'views/subject/common/BaseComponent';
import ManageComponent from './common/ManageComponent';

import { saveback, getToDayCnt, saveEntityInfo, getBackupNumTotal } from "api/sub/add.js";

export default {
  components: {
    draft,
    CorpComponent,
    DutyComponent,
    BaseComponent,
    ManageComponent
  },
  mounted() {
    //滚动效果
    scroll.call(this, 'slideIndex');
    this.getBackupNum();
    getToDayCnt(this.form.entityType).then((r) => {
      this.count = r.data;
    });
    if (this.$route.query.isDrafts) {
      this.isDrafts = this.$route.query.isDrafts
      this.defaultIndex = 1;
    }
  },
  data() {
    return {
      handleState: 'add',//当前操作是添加，需要自动保存
      entityName: "生产",
      slideIndex: -1,
      // 左边悬浮栏的数据
      progress: [
        {
          title: '基础信息',
          successNum: 0,
          totalNum: 0
        },
        {
          title: '负责人信息',
          successNum: 0,
          totalNum: 0
        },
        {
          title: '经营信息',
          successNum: 0,
          totalNum: 0
        },
        {
          title: '责任落实',
          successNum: 0,
          totalNum: 0
        },
      ],
      isDrafts: false,
      percentage: 0,
      count: 0,
      lists: [
        { tabName: '信息录入' },
        { tabName: '草稿箱', num: 0 },
      ],
      defaultIndex: 0,		//控制tab导航样式
      currentBtn: 0,
      btns: [
        {
          title: '有证有照',
          value: 'YZYZ'
        },
        {
          title: '有照无证',
          value: 'YZWZ'
        },
        {
          title: '无证无照',
          value: 'WZWZ'
        },
      ],
      // 表单数据
      form: {
        entityType: 'PRODUCT',
        natureType: 'YZYZ',//默认是有证有照
        percentageNumber: 0
      },
    }
  },
  methods: {
    //重新申请提交
    applySubmit() {

    },
    //编辑提交
    editSubmit() {

    },
    //验证计算
    validated(obj) {
      this.leftCount(obj);
    },
    //获得组件里的数据
    getData(componentData) {
      this.form = Object.assign(this.form, componentData);
      if(this.form.operType){
        this.form.operType = [...new Set(this.form.operType.concat(this.form.operTypeMoreCode))];
      }
    },
    getBackupNum(){
      getBackupNumTotal(this.form.entityType).then(r => {
        this.lists[1].num = r.data;
      });
    },
    //左边侧边栏计算
    leftCount({ totalNum, successNum, title }) {
      // 更新侧边栏
      const obj = { totalNum, successNum, title };
      for (let i = 0; i < this.progress.length; i++) {
        const objItem = this.progress[i];
        if (objItem.title === title) {
          this.progress.splice(i,1,obj);
          break;
        }
      }
      let total = 0, success = 0;

      for (let i = 0; i < this.progress.length; i++) {
        let objItem = this.progress[i];
        total += objItem.totalNum;
        success += objItem.successNum;
      }
      this.percentage = ~~(success / total * 100)
    },
    // 切换证照状态
    btnClick(item, index) {
      this.currentBtn = index;
      this.form = {
        entityType:'PRODUCT',
        natureType:'YZYZ',//默认是有证有照
        percentageNumber:0
      };
      ['prodcut','corp','manage','duty'].map(item=>(
        this.$refs[item].reset()
      ));
      this.handleState = 'add';
      this.form.natureType = item.value ? item.value.toUpperCase() : item.value;
    },
    //点击导航切换
    liClick(item, index) {
      this.defaultIndex = index
      if (item.tabName === '草稿箱') this.isDrafts = true;
      if (item.tabName === '信息录入') {
        this.isDrafts = false;

        //重置表单
        this.handleState = 'add';
        this.form = {
          entityType: 'PRODUCT',
          natureType: 'YZYZ',//默认是有证有照
          percentageNumber: 0
        }
        this.currentBtn = 0;
      }
    },
    //保存到草稿箱
    saveback() {
      saveback(this.form).then((r) => {
        if (!r.status) {
          this.$message({
            message: r.message,
            type: r.level
          });
          return;
        }
        this.form.backupId = r.data;
        this.$message({
          message: '保存草稿成功!!',
          type: 'success'
        });
        this.getBackupNum();
      });
    },
    // 提交审核
    submitSub() {
      this.$confirm('是否要提交审核?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
        Promise.all(['prodcut', 'corp', 'manage', 'duty'].map(item => (
          this.$refs[item].submitSub()
        )))
          .then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            //全部验证通过
            saveEntityInfo(this.form).then((r) => {
              if (r.status) {
                this.$message({
                  message: '提交审核成功!',
                  type: 'success'
                });
                this.isDrafts = true;
                this.defaultIndex = 1;
                loading.close();

                return;
              }
              loading.close();
              this.$message({
                message: r.message,
                type: 'warning'
              });

            });

          })
          .catch((err) => {
            //至少有一项没有通过
            this.$message({
              message: '请输入必填字段!',
              type: 'warning'
            });
          })
      }).catch(() => {});
    },
    draftEdit(draftData) {
      this.handleState = 'edit';
      this.isDrafts = false;
      this.defaultIndex = 0;
      draftData.natureType = draftData.natureType.toUpperCase();
      this.form = draftData;
      for(var i=0;i<this.btns.length;i++){
        if(draftData.natureType == this.btns[i].value){
          this.currentBtn = i;
        }
      }
    }
  },
  watch: {
    percentage(val) {
      this.form.percentageNumber = val;
    }
  }
}
</script>


<style scoped lang="scss">
.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

/* 切换页面下面的内容 */

.main-body {
  margin-top: 20px;
  margin-bottom: 430px;
  padding-left: 230px;
  position: relative;
  .router-btn {
    margin: 0 5px;
  }
}

.active {
  background: #0db5ef;
  color: #fff;
}

// 左边悬浮信息栏的样式 start
$c: #0db5ef;

.left-info {
  width: 210px;
  height: 560px;
  background: #fff;
  position: fixed;
  margin-left: -230px;
  margin-top: -100px;
  z-index: 2;

  /* .head-block {
    background: #f2f5f8;
    height: 70px;
    padding: 14px 20px;
    box-sizing: border-box;
    .num {
      color: $c;
    }
  } */

.head-block {
    // background: #f2f5f8;
    // height: 70px;
    padding: 14px 20px;
    box-sizing: border-box;
    .num {
      color: $c;
    }
  }

  .main-block {
    margin-top: 20px; // border-right: 2px solid #EBF1F5;
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
</style>
