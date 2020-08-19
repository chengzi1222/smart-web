<template>
    <div class="bigbox">
        <div class="page-tilt">
            <b></b><span>资质查看</span><Back></Back>
        </div>
        <div class="databox">
            <p v-if="!bslicImg">暂无数据</p>
            <img v-if="bslicImg" :src="bslicImg" alt="">
        </div>
    </div>
</template>

<script>
import * as plan from "api/trace/supervise"
import Back from 'utils/back.vue'       //返回上一个页面按钮
export default {
    methods: {
        
    },
    mounted() {
        this.bslicImg = this.$route.query.bslicImg;
    },
    data() {
        return {
            bslicImg:null
        };
    },
    components: {
      Back
    }
}
</script>

<style scoped lang="sass">
    .bigbox{
        position: relative;
    }
    .page-tilt{
        margin-bottom: 20px;
    }
    img{
        width: 300px;
        height: 180px;
        border-radius: 10px;
    }
    .databox{
        text-align: center;
        font-size: 18px;
    }
</style>
