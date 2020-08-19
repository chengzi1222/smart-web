<template>
    <div class="user-box">
        <div class="page-tilt">
            <b></b>
            <span>{{workId ? '重新申请' : '编辑'}}-{{entityInfo.entityTypeStr}}</span>
        </div>
        <div class="typeName">
        	<span>主体名称：{{entityInfo.entityName}}</span>
        	<span>证照类型：{{entityInfo.natureTypeStr}}</span>
        </div>
        <ul class="tab-box">
            <li v-for="(item,index) in lists" :key="item.tabName" @click="liClick(index)" :data-index='index' :class="index == defaultIndex? 'li-bott':''">
                <span @click="liClick" :data-index='index'>{{item.tabName}}</span>
            </li>
            <li class="tab-bott"></li>
        </ul>
        <div class="main-body no-star">
            <!--  -->
            <entity-edit :entityId="entityId"  v-if="defaultIndex == 0"></entity-edit>

            <!-- 主体详情 -->
            <detail-component :data="entityInfo" v-if="defaultIndex == 1"></detail-component>

            <!-- 主体工单记录 -->
            <workflow-record :entity-id="entityId" :entity-type="entityType" from="detail" v-if="defaultIndex == 2"></workflow-record>
            
            <!-- 巡查记录 -->
            <patrol-record v-if="defaultIndex == 3" :entityId="entityId"></patrol-record>

            <!-- 处罚记录 -->
            <punish-record v-if="defaultIndex == 4" :entityId="entityId"></punish-record>
        </div>
        <!-- 底部按钮背景 -->
        <div class="foot-btn" style="z-index:0">
            <div>
                <el-button style="width:120px;" @click="backBtn">返回</el-button>
            </div>
        </div>
    </div>
</template>



<script>
import PatrolRecord from "views/patrol/record/entityPatrolRecord";
import PunishRecord from "views/enforce/entityPunishRecord";
import WorkflowRecord from "./common/WorkflowRecord";
import DetailComponent from "./common/DetailComponent";
import EntityEdit from "views/subject/workflow/Change";
import { getSubInfo } from "api/sub/sub";

export default {
  components: {
    EntityEdit,
    PatrolRecord,
    PunishRecord,
    DetailComponent,
    WorkflowRecord
  },
  created() {
    this.entityId = this.$route.query.entityId;
    this.type = this.$route.params.type;
    this.workId = this.$route.query.workId;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getSubInfo(this.entityId).then(results => {
        this.entityInfo = results.data;
      });
    },
    backBtn() {
      this.$router.go(-1);
    },
    liClick(index) {
      //点击导航切换样式
      this.defaultIndex = index;
    }
  },
  watch: {
    "$route.query.entityId"() {
      this.init(this.$route.query.id);
    }
  },
  data() {
    return {
      entityId: "",
      type: "",
      workId: '',
      entityInfo: {},
      lists: [
        { tabName: "编辑申请" },
        { tabName: "主体信息" },
        { tabName: "备案编辑记录" },
        { tabName: "巡查记录" },
        { tabName: "处罚记录" }
      ],
      defaultIndex: 0 //控制tab导航样式
    };
  }
};
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
.tab-box a {
  color: #9a9a9a;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 666;
  position: relative;
}

.li-bott a {
  color: #393939;
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
  .el-button {
    background: #0db5ef;
    color: #fff;
  }
}

.typeName {
  margin-top: 24px;
  margin-left: 20px;
}

.typeName span:first-child {
  font-size: 15px;
  color: #393939;
}
.typeName span:last-child {
  font-size: 15px;
  color: #a2aab6;
  margin-left: 20px;
}
</style>
