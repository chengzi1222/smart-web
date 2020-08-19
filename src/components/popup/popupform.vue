<template>
    <div class="popup-box">
    	<div class="popup-div" ref="popup"  :style="{width:width+'px',top:top+'px'}">
    	    <slot><!-- <i class="movePoin el-dialog__close el-icon el-icon-close"></i> --></slot>
    	</div>
    </div>
</template>

<style scoped lang="sass">
	.form-item {
		text-align: center;
		margin-left:-30px;
	}
	.form-btn{
		text-align: right;
		margin-top: 50px;
	}
	.form-btn .el-button{
		width: 100px;
	}
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
    border: 1px solid #ccc;
    position: fixed;
    background: #fff;
    min-width: 500px;
    box-sizing: border-box;
    padding: 40px 0px 30px 30px;
    left: 50%;
    margin-left: -325px;
    top: 250px;
    max-height: 650px;
	}
	.el-input,.el-select{
		margin: 10px 0;
	}

</style>

<script>
	export default {
		mounted(){
			let popup = this.$refs.popup;
			let w = popup.offsetWidth;
			popup.style.marginLeft = (-w/2)+"px";
		},
		data(){
			return{
        showif:true
			}
		},
    props:{
      width:{
        type: Number,
        default:function(){
          return "690"
        }
      },
      top:{
        type: Number,
        default:function(){
          return "250"
        }
      }
    }
	}
</script>
