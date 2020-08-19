<template>
    <div>
        <div  @click="isShow = true">点击</div>
        <transition name="dialog-fade">
            <popupBody class="popup-body" v-if="isShow">
                <!-- 功能模块添加到这一区域 -->
                <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close" @click="isShow = false"></i>
                <el-input placeholder="请输入内容"></el-input>
                <el-input placeholder="请输入内容"></el-input>
                <el-input placeholder="请输入内容"></el-input>
                <el-button>取消</el-button>
                <el-button type="primary">确定</el-button>
            </popupBody>
        </transition>
    </div>
</template>

<script>
    import popupBody from 'components/popup/popupdata';
    export default {
        methods: {
        
        },
        data() {
       		return {
                isShow:false
        	}
        },
    	components:{
            popupBody
    	}
    }
</script>

<style scoped lang="sass">
    .popup-hide{
        position: absolute;
        top: 10px;
        right: 20px;
    }

    .dialog-fade-enter-active {
        animation: dialog-fade-in .3s
    }

    .dialog-fade-leave-active {
        animation: dialog-fade-out .3s
    }

    @keyframes dialog-fade-in {
        0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1
        }
    }

    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1
        }
        100% {
            transform: translate3d(0, -20px, 0);
            opacity: 0
        }
    }
</style>