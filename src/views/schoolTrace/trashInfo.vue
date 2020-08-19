<template>
    <div class="rightBox">
        <ul class="top clear_a">
            <li class="back_" @click="back"></li>
            <li class="name">餐厨垃圾处理详情</li>
            <li class="time">{{time}}</li>
        </ul>
        <div class="infoBox clear_a" v-loading="loading" element-loading-text="数据正在努力加载中">
            <div class="img baseStyle mr20">
                <el-carousel indicator-position="outside">
                    <el-carousel-item v-if='info.fileDTOList.length>0' v-for="item in info.fileDTOList"
                        :key="item.fileId">
                        <img :src="schoolTraceBaseUrl+item.fileUrl">
                    </el-carousel-item>
                    <el-carousel-item v-if='info.fileDTOList.length<=0' class="relative">
                        <img src="../../assets/img/schoolTrace/imgNull.png">
                        <p class="absolute col999 textC" style="font-size:18px;bottom:20%;width:100%;">暂无现场图片</p>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="base baseStyle ">
                <p class="innerBoxTitie"><span class="line"></span>餐厨垃圾处理详情</p>
                <div class="baseInfo overHide">
                    <p><span class="col66">处理日期：</span>{{info.handleDate}}</p>
                    <p><span class="col66 textell">种类：</span>{{info.type_rd}}</p>
                    <p><span class="col66 textell">重量：</span>{{info.weight}}</p>
                    <div class="clear_a mb14">
                        <div style="width:70px;" class="col66">收运单位：</div>
                        <div style="width:calc(100% - 70px);">{{info.receiveCompany}}</div>
                    </div>
                    <div class="clear_a mb14">
                        <div style="width:60px;" class="col66">收运人：</div>
                        <div style="width:calc(100% - 60px);">{{info.receivePerson}}</div>
                    </div>
                    <div class="clear_a mb14">
                        <div style="width:60px;" class="col66">交接人：</div>
                        <div style="width:calc(100% - 60px);">{{info.deliveryPerson}}</div>
                    </div>
                    <div class="clear_a">
                        <div style="width:48px;" class="col66">备注：</div>
                        <div style="width:calc(100% - 48px);">{{info.remark?info.remark:'暂无备注'}}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import * as api from "../../api/schoolTrace/index";
    import config from "utils/config";
    export default {
        methods: {
            back() {
                history.back()
            },
            timeShow() {
                let mydate = new Date();
                let str = "" + mydate.getFullYear() + "年";
                let M = mydate.getMonth() + 1;
                if (M < 10) {
                    M = "0" + M;
                };
                str += M + "月";
                let D = mydate.getDate();
                if (D < 10) {
                    D = "0" + D;
                };
                str += D + "日";
                let h = mydate.getHours();
                if (h < 10) {
                    h = "0" + h;
                };
                str += " " + h + " : ";
                let s = mydate.getMinutes();
                if (s < 10) {
                    s = "0" + s;
                };
                str += s;
                this.time = str;
            },
            setInterval_time() {
                this.$nextTick(() => {
                    if (this.willDestroy) return;
                    var t = setInterval(() => {
                        this.timeShow();
                    }, 1000);
                    this.timer.push(t);
                });
            },
            getInfo() {
                let obj = {
                    entityId: this.entityId,
                    id: this.id
                }
                this.loading = true;
                api.getTrashInfo(obj).then(r => {
                    if (r.code == 200) {
                        this.info = r.data;
                        let typeDict = this.getUnit('04')
                        let type = this.info.type.split(",")
                        this.info.type_rd = [];
                        type.map(items => {
                            typeDict.map(item => {
                                if (items === item.code) {
                                    this.info.type_rd.push(item.name)
                                }
                            })
                        })
                        this.info.type_rd = this.info.type_rd.join(',')
                        this.loading = false;
                    }
                })
            },
            async getDictTree() {
                await api.getDictTree().then(r => {
                    if (r.code == 200) {
                        this.dictTree = r.data;
                    }
                })
            },
            getUnit(num) {
                let result;
                for (let i in this.dictTree) {
                    if (this.dictTree[i].dictType === num) {
                        result = this.dictTree[i].dictItem
                    }
                }
                return result
            }
        },
        beforeDestroy() {
            this.willDestroy = true;
            this.timer.forEach(item => {
                clearInterval(item);
                item = null;
            });
        },
        async mounted() {
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
            }
            if (this.$route.query.entityId) {
                this.entityId = this.$route.query.entityId;
            }
            this.schoolTraceBaseUrl = config.schoolTraceBaseUrl;
            await this.getDictTree();
            this.setInterval_time()
            this.getInfo()
        },
        data() {
            return {
                loading: true,
                willDestroy: false,
                timer: [],
                time: "",
                id: '',
                entityId: '',
                info: {
                    fileDTOList: []
                },
                schoolTraceBaseUrl: ''
            };
        }
    }
</script>

<style scoped lang='scss'>
    .rightBox {
        width: 1792px;
        height: 1008px;
        position: relative;
        left: 64px;
        top: 36px;
        color: #333;
        background-color: #f5f5f5;

        .top {
            height: 60px;
            line-height: 60px;
            background: #fff;

            .back_ {
                cursor: pointer;
                width: 50px;
                height: 100%;
                background: url("~@/assets/img/schoolTrace/back.png") no-repeat center right;
                background-size: 22px 22px;
            }

            .name {
                width: calc(100% - 230px);
                text-align: center;
                font-size: 20px;
            }

            .time {
                width: 180px;
                text-align: left;
                color: #999;
                font-size: 14px;
            }
        }

        .infoBox {
            height: calc(100% - 60px);
            padding: 20px;
            box-sizing: border-box;

            .baseStyle {
                background: rgba(255, 255, 255, 1);
                border-radius: 10px;
            }

            .img {
                width: 1320px;
                height: calc(100% - 40px);
                padding: 20px;

                .el-carousel {
                    height: 100%;

                }

                .el-carousel__item img {
                    border: 1px solid #f5f5f5e1;
                    max-width: 100%;
                    max-height: 100%;
                    margin: 0 auto;
                    display: block;
                }
            }

            .base {
                width: calc(100% - 1420px);
                height: calc(100% - 40px);
                padding: 20px;

                p.innerBoxTitie {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 30px;

                    span.line {
                        height: 18px;
                        width: 4px;
                        display: inline-block;
                        background: #34C5D7;
                        margin-right: 10px;
                        position: relative;
                        top: 2px;
                    }
                }

                .col66 {
                    color: #666;
                }

                .baseInfo {
                    font-size: 14px;

                    p,
                    .mb14 {
                        margin-bottom: 14px;
                    }
                }

            }
        }
    }
</style>
<style lang='scss'>
    .infoBox .img .el-carousel__container {
        height: 93% !important;
    }
</style>