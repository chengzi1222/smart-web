<template>
 <div class="pop_config" v-show='isShow'>
     <p class="title">
         设置
         <a href="javascript:;" class="close movePoin" @click="close">x</a>
     </p>
    <div class="form-item">
        <p>地图中心点经度：</p>
        <div>
            <input type="text" v-model="obj.lng" placeholder="-180到180之间，保留6位小数(必填)">
        </div>
        <span class="red" v-if='error1'>*经度未通过验证！请重新填写</span>
    </div>
    <div  class="form-item">
        <p>地图中心点纬度：</p>
        <div>
            <input type="text" v-model="obj.lat" placeholder="-90到90之间，保留6位小数(必填)">
        </div>
         <span class="red" v-if='error2'>*纬度未通过验证！请重新填写</span>
    </div>
    <div  class="form-item">
        <p>任务半径范围：</p>
        <div>
            <input style="width:230px;margin-right:10px;"  v-model="obj.range" type="text"  placeholder="5到100之间，保留2位小数(必填)"><span style="color:#fff">公里</span>
        </div>
         <span class="red" v-if='error3'>*公里数未通过验证！请重新填写</span>
    </div>
    <p class="popConfigBtn clear_a">
        <a href="javascript:;" class="movePoin ml30"  @click="succeedData">确定</a>
        <a href="javascript:;" class="movePoin" @click="close">取消</a>
    </p>
 </div>
</template>

<script>
import * as api from "api/bigData/map";

export default {
   props: {
    isShow: {
      type: Boolean,
      default: false,
      disabled:false,
    },
  },
  data() {
    return {
        obj:{
            lat:'',
            lng:'',
            range:''
        },
        error1:false,
        error2:false,
        error3:false,
    }
  },
  mounted() {
  },
  methods: {
    close(){
        this.error1=false;
        this.error2=false;
        this.error3=false;
        this.disabled=false;
        this.$emit('closePop')
    },
    succeedData(){
        this.disabled=true;
        if(this.disabled){
            if(this.validate()){
               this.$emit('succeed',this.obj)
            }else{
                this.disabled=false;
            }
            
        }
    },
    validateNum(val,n){
        let v = val.split(".");
        if(v[1]==undefined){return true;}
        if(v[1].length>n){
            return false;
        }else{
            return true;
        }
    },
    validate(){
        let val=this.obj.lng.trim();
        if(val!='' && val*1 >= -180 && val*1 <= 180 && this.validateNum(val,6)){
             this.error1=false;
        }else{
            console.log(val!='',val*1 >= -180,val*1 <= 180,this.validateNum(val,6))
            this.error1=true;
            return false;
        }
        val=this.obj.lat.trim();
        if(val!='' && val*1 >= -90 && val*1 <= 90 && this.validateNum(val,6)){
             this.error2=false;
        }else{
             this.error2=true;
            return false;
        }
        val=this.obj.range.trim();
        if(val!='' && val*1 >= 5 && val*1 <= 100 && this.validateNum(val,2)){
             this.error3=false;
        }else{
             this.error3=true;
            return false;
        }
        return true;
    }
  },
  watch:{
    isShow(val){
      this.isShow=val;
    }
  }
};
</script>

<style scoped lang='scss'>
.pop_config{
    z-index: 1000000;
    width: 400px;
    height: 424px;
    box-sizing: border-box;
    position: fixed;
    left: calc(50% - 200px);
    top: calc(50% - 212px);
    background: transparent url('../../../../assets/img/bigData/bg2.png') no-repeat;
    background-size: 100% 100%;
    padding: 20px;
    .title{
        margin-bottom: 11px;
        color: #37C7FB;
        font-size: 16px;
        .close{
            color: #fff;
            font-size: 22px;
            position: absolute;
            top: 12;
            right: 34px;
        }
    }
    .form-item{
        margin-bottom: 0;
        height: 94px;
        .red{
                color: red;
                font-size: 12px;
                // text-align: right;
                line-height: 12px;
                width: 100%;
                display: inline-block;
            }
        p{
            font-size:14px;
            color:rgba(255,255,255,1);
            margin-bottom: 10px;
        }
        input{
            width:320px;
            height:40px;
            line-height: 40px;
            background:rgba(15,46,58,1);
            border:1px solid rgba(27,150,195,1);
            border-radius:2px;
            padding: 0 20px;
            color: #fff;
        }
        input::input-placeholder{color:#1B96C3!important;} 

        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
        color: #1B96C3!important; 
        } 
        input:-moz-placeholder, textarea:-moz-placeholder { 
        color: #1B96C3!important; 
        } 
        input::-moz-placeholder, textarea::-moz-placeholder { 
        color: #1B96C3!important; 
        } 
        input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
        color: #1B96C3!important; 
        } 
    }
    .popConfigBtn{
        margin-top: 10px;
        >a{
            width:100px;
            height:40px;
            background:rgba(12,47,60,1);
            border:1px solid rgba(27,150,195,1);
            border-radius:2px;
            text-align: center;
            line-height: 40px;
            display: block;
            color: #37C7FB;
            float: right;
        }
        .ml30{
            margin-left: 30px;
        }
    }
}


</style>