<template>
	<div class="randomTask" style="padding:0 0 40px 0">
    <div class="page-tilt">
        <b></b><span>{{ title }}双随机任务</span>
    </div>
    <div class="step-box">
      <div class="item green">
          <div class="sub-item-num">1</div>
          <div class="sub-item-title">填写基础内容</div>
      </div>
      <div class="item-line" :class="{green:type == 'randomAdd'}" style="left:54px;">
        <div class="line1 line"></div>
      </div>
      <div class="item" :class="{green:type == 'randomAdd'}">
          <div class="sub-item-num">2</div>
          <div class="sub-item-title">任务分配</div>
      </div>
    </div>
    <taskBase v-if="type == 'taskBase'" @getBaseData="getBase" :backData="randomTaskData" ></taskBase>
    <randomAdd :taskData="randomTaskData" v-if="type == 'randomAdd'" @lastStep="page_lastStep"></randomAdd>

	</div>
</template>



<script>
import taskBase from "./randomAdd/taskBase.vue";
import randomAdd from "./randomAdd/randomAdd.vue";
export default {
  async mounted() {
    let randomTaskId = this.$route.params.randomTaskId;
    if(randomTaskId != null){
      this.title = '编辑';
    }
  },
	methods: {
    getBase(val){
      this.randomTaskData = val;
      this.type='randomAdd';
      console.log(this.randomTaskData,"1111");
    },
    page_lastStep(){
      this.type='taskBase';
    }

	},
	data() {
		return {
			type:'taskBase',
      title:'添加',

      randomTaskData: {
        taskName: '',
        startDate:'',
        endDate:'',
        entityType:[],
        taskArea:[],
        eachGroups:'',
        enterpriseGroups:'',
        quantify:[],
        risk:[],
        fileId:'',
        description:''
      },
		}
	},
	components: {
    taskBase,
    randomAdd
	}
}
</script>


<style scoped lang="sass">

.step-box {
  display: flex;
  position: relative;
  width: 341px;
  margin: 31px auto;
  justify-content: space-between;
  .line {
    background-color: #989a9c;
    height: 4px;
    width: 247px;
  }
  .item-line {
    position: absolute;
    top: 10px;
  }
  .item {
    color: #6d7787;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .sub-item-num {
      height: 20px;
      width: 20px;
      line-height: 20px;
      text-align: center;
      border: 2px solid #c2cad2;
      border-radius: 50%;
      margin-bottom: 5px;
    }
  }
}
.green {
  color: #32c25e !important;
  .sub-item-num {
    border-color: #32c25e !important;
  }
  .line {
    background-color: #32c25e !important;
  }
}
</style>
