<template>
    <div class="popup-box" v-if='isShow'>
    	<div class="popup-div" ref="popup">
            <div class="head clearfix">
                <span class="title">{{title}}</span>
                <i class="el-icon-close icon" @click="handleClick"></i>
            </div>
            <div class="body">
                <slot name="body"></slot>
            </div>

            <div class="foot">
                <slot name="foot"></slot>
            </div>
    	</div>
    </div>
</template>

<script>
	export default {
    props:['isShow','title'],
		data(){
			return{

			}
		},

    methods:{
      handleClick(){
        this.$emit("close")
      }
    }
	}
</script>


<style scoped lang="scss">
	.popup-box{
	    position: absolute;
	    background: rgba(0,0,0,.5);
	    top: 0px;
		bottom:0;
		left:0;
		right:0;
	    z-index: 3000;
	}
	.popup-div{
		/* border: 1px solid #ccc; */
	    background: #fff;
	    width: 690px;
	    box-sizing: border-box;
        margin:20px auto 0;
        .head{
            height:40px;
            line-height: 40px;
            background: #F2F5F8;
            font-size: 16px;
            position: relative;
            .title{
                position: absolute;
                left: 20px;
                top: 0px;
                color: #393939;
                font-size: 14px;
            }
            .icon{
                position: absolute;
                right: 20px;
                top: 12px;
                cursor: pointer;
                color: #9A9A9A;
            }
        }
        .body{
            height:500px;
            .form-item{
                text-align: center;
                margin: 20px 0;
            }
        }
        .foot{
            text-align: right;
            height: 50px;
            line-height: 50px;
            padding: 0 50px;
        }
	}
</style>
