<template>
    <div class="content">
    	<h2>你好，欢迎使用{{$store.state.common.user.persoName ? $store.state.common.user.persoName : $store.state.common.name}}</h2>
    	<h3>行业领先的食药监管智慧大数据平台</h3>
    	<img class="imgo" src="../../assets/img/Illustration_x2.png" alt=""/>
    	<img class="imgt" src="../../assets/img/texture_x2.png" alt=""/>
    </div>
</template>

<style lang="scss" scoped>
	.content{
		margin-top: 50px;
		text-align: center;
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
		z-index: -1;
		 h2{
		 	font-size: 48px;
			color: #393939;
			font-weight: normal;
			margin-top: 110px;
		 }
		 h3{
		 	font-size: 24px;
			color: #A2AAB6;
			font-weight: normal;
			margin-top: 20px;
		 }
		 img{
		 	position: absolute;
		 }
		 .imgo{
			width: 988px;
			height: 450px;
			bottom: 0px;
			left: 50%;
			margin-left: -499px;
			z-index: -1;
		 }
		 .imgt{
			width: 100%;
			height: 626px;
			bottom: 0;
		 	left: 0;
			z-index: -2;
		 }
	}
</style>

<script>
export default {
    methods: {
  
    },
    data() {
        return {
    
        }
    }
}
</script>
