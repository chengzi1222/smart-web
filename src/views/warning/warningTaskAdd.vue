<template>
	<div class="warningTask" style="padding:0 0 40px 0">
    <div class="page-tilt">
        <b></b><span>药品预警任务发布</span>
    </div>
    <taskBase v-if="type == 'taskBase'"></taskBase>
	</div>
</template>



<script>
import taskBase from "./taskBase.vue";
export default {
  async mounted() {

  },
	methods: {
    getBase(val){
      this.randomTaskData = val;
      this.type='warningAdd';
    }
	},
	data() {
		return {
			type:'taskBase',
      title:'添加',
		}
	},
	components: {
    taskBase
	}
}
</script>


<style scoped lang="sass">


</style>
