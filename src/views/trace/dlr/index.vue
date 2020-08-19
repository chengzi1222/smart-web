<template>
    <div>
    <router-view></router-view>
    </div>
</template>

<script>

export default {
    methods: {
    },
    data() {
        return {
           
        };
    },
    mounted(){
        //判断角色进入页面
            let area=this.$store.state.common.user.areaCode;
            switch(area.length)
                {
                case 2://省和直辖市
                console.log("省和直辖市");
                break;
                case 4://市
                this.$router.push({name:"yb.dlrCityChart"});
                break;
                case 6://区县
                this.$router.push({name:"yb.dlrAreaChart"});
                break;
                case 10://街道
                this.$router.push({name:"yb.dlrMarketChart"});
                break;
                case 14://网格社区
                this.$router.push({name:"yb.dlrMarketChart"});
                break;
                default:
                //0是中国
                console.log("中国");
                }
    },
}
</script>

<style scoped lang="sass">
</style>
