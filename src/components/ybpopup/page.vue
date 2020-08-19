<template>
    <div>
        <el-button type="primary" @click="isShow=true">打开弹窗</el-button>

        <yb-popup @close="close" :isShow="isShow" title="这里是上方显示的标题">
            <div slot="body">
                这里写内容
            </div>
            <div slot="foot">
                这里放按钮
            </div>
        </yb-popup>
    </div>
</template>

<script>
import YbPopup from 'components/ybpopup/YbPopup.vue'

export default {
  components:{YbPopup},
  data(){
      return {
          isShow:false
      }
  },
  methods:{
      close(){
          this.isShow = false;
      }
  }
}
</script>

<style scoped lang="sass">

</style>

