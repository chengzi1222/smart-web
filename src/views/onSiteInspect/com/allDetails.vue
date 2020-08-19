<template>
    <div>
        <div class="page-tilt">
            <b></b>
            <span>详情</span>
        </div>
        <ul class="tabBox">
            <li class="tabLi" v-for="(item,index) in patternLis" :key="index" :class="index==currentNum?'li-bott':''"
                @click="choose(item,index)">
                <div>
                    <span :class="index==currentNum?'li-span':''">
                        {{item.name}}
                    </span>
                </div>
            </li>
            <li class="tabBott"></li>
        </ul>
         <component  v-for="(item,index) in patternLis" :key="index"  :subOrSite='subOrSite' :id='item.id'   :is='item.component' v-if="currentNum==index"></component>
        <!-- 底部按钮 -->
        <div class="foot-btn" style="z-index:1">
            <div>
                <el-button @click="$router.go(-1)" style="width:120px;">返回</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import oneTime from './oneTime';
    import twoTimeAndThreeTime from './twoTimeAndThreeTime';
    import * as api from '../../../api/xchc/detail';
    export default {
        data() {
            return {
                patternLis: [{
                    name: '核查记录'
                }, {
                    name: '第一次复查'
                }, {
                    name: '第二次复查'
                }],
                currentNum: 0,
                subOrSite: 'sub',
                id:'',
                recordId: '',
                count: '',
                messType:''

            }
        },
        methods: {
            choose(item,index) {
                this.currentNum = index;
                this.id=item.id;
            },
            filter(num) {
                if (num == 1) {
                    return '第一次复查记录'
                } else {
                    return '第二次复查记录'
                }
            }
        },
        mounted() {
            this.subOrSite = this.$route.query.subOrSite;
            this.recordId = this.$route.query.id;
            this.count = this.$route.query.count;
            this.messType = this.$route.query.messType;
            let type=''
            if(this.count==0){
                type='PATROL' 
                this.currentNum=0
                // 高亮核查
            }
            if(this.messType=='not'&&this.count==1){
                type='PATROL'
                 this.currentNum=0
                 // 高亮核查
            }
            if(this.messType=='not'&&this.count==2){
                type='REPATROL'
                 this.currentNum=1
                 // 高亮第一次复查
            }
            if(this.messType=='ok'&&this.count==1){
                type='REPATROL'
                 this.currentNum=1
                 // 高亮第一次复查
            }
            if(this.messType=='ok'&&this.count==2){
                type='REPATROL'
                this.currentNum=2
                 // 高亮第二次复查
            }
            api.recordList(this.recordId,type).then((d) => {
                if (d.status) {
                    this.patternLis = []
                    d.data.map((item,index) => {
                        let obj = {
                            name: item.type == 'PATROL' ? '核查记录' : this.filter(item.repatrolCount),
                            id:item.id,
                            component:item.type == 'PATROL' ?'oneTime':'twoTimeAndThreeTime'
                        }
                        if(index==this.currentNum){
                            this.id=item.id;
                        }
                        this.patternLis.push(obj)
                    })
                    if(this.subOrSite){
                        this.currentNum=this.patternLis.length-1
                    }
                }
            })
        },
        components: {
            oneTime,
            twoTimeAndThreeTime,
        }
    }
</script>
<style lang="scss" scoped>
    .tabBox {
        width: 100%;
        display: flex;
        position: relative;
        margin-bottom: 20px;
    }

    .tabBox .tabLi {
        width: 128px;
        height: 50px;
        line-height: 50px;
        margin-right: 30px;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #9A9A9A;
        text-align: center;
        cursor: pointer;
    }

    .tabBox .li-bott {
        border-bottom: 2px solid #0DB5EF;
        z-index: 666;
        position: relative;

    }

    .tabBox .li-span {
        color: #393939;
    }

    .tabBox span:first-child {
        margin-right: 10px;
    }

    .tabBox .tabBott {
        background: #EBF1F5 !important;
        height: 2px !important;
        width: 100% !important;
        position: absolute;
        bottom: 0;
    }
</style>