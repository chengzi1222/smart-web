<template>
  <div class="form-block">
      <div class="header">
          <span class="title">{{title}}</span>
          <span class="toggle-btn" :class="show?'el-icon-caret-bottom':'el-icon-caret-top'" @click="show = !show"></span>
      </div>
      <!--<transition name="slide-fade">-->
        <el-collapse-transition>
            <div v-show="show">
                <slot ></slot>
            </div>
        </el-collapse-transition>
        
      <!--</transition>-->
  </div>
</template>

<script>
export default {
  props:{
      title:{
          type:String
      }
  },
  data(){
      return {
          show:true,
      }
  }
}
</script>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier();
}
.slide-fade-enter, .slide-fade-leave-active {
  opacity: 0;
}

.form-block{
    margin-top: 20px;
}
.form-block .header{
    border-left: 3px solid  #606979;
    width: 100%;
}
.form-block .header:after{
    overflow: hidden;
    clear:both;
    content: "";
    display: block;
    height: 0;
}
.form-block .header span{
   box-sizing: border-box;
   height: 30px;
   line-height: 33px;
   background:#F2F5F8;
   color: #6D7787;
   display: inline-block;
}
.form-block .header span.title{
    padding-left: 10px;
    width: calc(100% - 38px);
    margin-right: 2px;
    font-size: 14px;

}
.form-block .header span.toggle-btn{
    width: 30px;
    text-align: center;
    cursor: pointer;
}
</style>

<style lang="sass">
/* 改变多选框组的样式 */
.form-block .el-checkbox-group{
    display: inline-block;
    width: 280px;
    vertical-align: top;
}
.form-block .el-checkbox+.el-checkbox{
	margin:0;
}
.form-block .el-checkbox{
    margin: 0;
}
.form-block .el-checkbox-group .el-checkbox{
    margin:0 15px 10px 0;
}

</style>


