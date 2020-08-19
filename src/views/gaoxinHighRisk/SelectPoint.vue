<template>
    <bm-overlay ref="overlay" class="bm-overlay" pane="mapPane" @draw="draw">
        <div class="detail-box" v-show="active" ref="detailBox">
            <div class="main-content">
                <div class="left relative">
                    <div class="left-right">
                        <p class="title">
                            <span class="circle" v-show="this.info.ewRiskRating == '04'"></span>
                            <span class="yellowCircle" v-show="this.info.ewRiskRating == '03'"></span>
                            <span class="blueCircle" v-show="this.info.ewRiskRating == '02'"></span>
                            <span class="greenCircle" v-show="this.info.ewRiskRating == '01'"></span>
                            {{info.buyerName}}
                            <img src="../../assets/img/bigData/close.png" class="closeIcon absolute" @click="close"
                                 alt="">
                        </p>

                        <p>综合评级：
                            <span>{{risk[info.ewRiskRating]}}</span>
                        </p>
                        <p>食安指数：
                            <span>{{ info.score }}</span></p>
                        <p>当前预警：
                            <span>{{ info.ewCurrentNum }}</span>
                        </p>
                        <p>最近预警时间：
                            <span>{{ info.ewDate === null || info.ewDate == '' ? '暂无': info.ewDate}}</span>
                        </p>
                        <p>所属街道：
                            <span>{{ info.streetName === null || info.streetName == '' ?  '暂无':info.streetName}}</span>
                        </p>
                        <p>负责人：
                            <span>{{ info.legalPerson }}</span>
                        </p>
                        <p>联系电话：
                            <span>{{ info.tel }}</span>
                        </p>
                        <p>地址：
                            <span>{{ info.address }}</span>
                        </p>
                        <button class="detailBtn" @click="goDetail">查看详情</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="bm-point" @click="show">
            <span class="iconfont icon-triangle tri" v-show="active"></span>
            <img v-bind:src="icon" :width="size" :height="size"/>
        </div>
    </bm-overlay>
</template>

<script>
    import {BmOverlay} from 'vue-baidu-map';
    import {getMapping} from "./mapping";

    export default {
        name: 'select-point',
        components: {
            BmOverlay,
        },
        props: {
            point: Object,
            activeItem: Object,
            zoom: Number
        },
        data() {
            return {
                active: false,
                icon: null,
                high: require('assets/img/point_red.png'),
                middle: require('assets/img/point_yellow.png'),
                low: require('assets/img/point_blue.png'),
                not: require('assets/img/point_green.png'),
                size: 36,
                info: {},
                load: false,
                month: '',
                risk: getMapping().risk,
            }
        },
        mounted() {
            this.getNowMonth();
            if (this.point.ewRiskRating == '02') {
                this.icon = this.low
            } else if (this.point.ewRiskRating == '03') {
                this.icon = this.middle
            } else if (this.point.ewRiskRating == '04') {
                this.icon = this.high
            } else if (this.point.ewRiskRating == '01') {
                this.icon = this.not
            }
            if (this.zoom >= 18) {
                this.size = 66
            } else if (this.zoom > 16) {
                this.size = 56
            } else if (this.zoom > 14) {
                this.size = 46
            } else if (this.zoom > 8) {
                this.size = 36
            }
            if (this.activeItem.entityId === this.point.entityId) {
                this.toggle(true);
            }
        },
        methods: {
            getNowMonth() {
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }

                let fullDate = year + seperator1 + month;
                this.month = fullDate;
            },
            goDetail() {
                this.$router.push({
                    name: 'xcws.subjectAssessDetail',
                    query: {
                        entityId: this.info.entityId,
                        month: this.month
                    }
                });
            },
            show() {
                if (this.active) {
                    this.$emit("actived", "");
                } else {
                    this.$emit("actived", this.point);
                }
            },
            toggle(active) {
                if (active) {
                    if (!this.load) {
                        this.load = true;
                        this.info = this.point;
                        this.active = active;
                        this.reszieInfoWindow();
                    } else {
                        this.active = active;
                        this.reszieInfoWindow();
                    }
                } else {
                    this.active = active;
                }
            },
            reszieInfoWindow() {
                if (this.active) {
                    this.$nextTick(() => {
                        const c = this.$refs.detailBox;
                        const w = c.offsetWidth;
                        c.style.left = -(w / 2) + 30 + 'px';
                    })
                }
            },
            draw({el, BMap, map}) {
                const {lng, lat} = this.point;
                const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
                el.style.left = pixel.x + "px";
                el.style.top = pixel.y + "px";
                this.reszieInfoWindow();
            },
            close() {
                this.$emit("close", {});
            }
        },
        watch: {
            'point': {
                handler() {
                    if (this.$refs.overlay && this.$refs.overlay.reload) {
                        this.$refs.overlay.reload()
                    }
                },
                deep: true
            },
            activeItem() {
                if (this.activeItem.entityId === this.point.entityId) {
                    if (!this.active) {
                        this.toggle(true);
                    }
                } else {
                    if (this.active) {
                        this.toggle(false);
                    }
                }
            },
            zoom() {
                if (this.zoom >= 18) {
                    this.size = 66
                } else if (this.zoom > 16) {
                    this.size = 56
                } else if (this.zoom > 14) {
                    this.size = 46
                } else if (this.zoom > 8) {
                    this.size = 36
                }
            }
        }
    }
</script>

<style lang="scss">
    .bm-overlay .bm-point {
        cursor: pointer;
        z-index: 999;
    }

    .point-active {
        z-index: 1000;
    }

    .bm-overlay .detail-box {
        height: 180px;
        top: -174px;
        /* left: -72px; */
        z-index: 998;
        position: absolute;
        color: #fff;
        opacity: 1;
    }

    .bm-overlay .detail-box .main-content {
        display: flex;
        border-radius: 5px;
    }

    .bm-overlay .detail-box .main-content .left {
        overflow: hidden;
        height: 296px;
        float: left;
        background: rgba(20, 39, 44, .5);
        padding: 10px;
        display: flex;
        flex-wrap: nowrap;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    }

    .bm-overlay .detail-box .main-content .right {
        cursor: pointer;
        float: left;
        height: 180px;
        background: rgba(79, 86, 95, 1);
        line-height: 180px;
        font-size: 25px;
        padding: 0 8px;
        margin-right: -41px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .bm-overlay .detail-box .main-content .left,
    .bm-overlay .detail-box .main-content .right {
        box-sizing: border-box;
    }

    .bm-overlay .detail-box .main-content .left-left {
        float: left;
    }

    .bm-overlay .detail-box .main-content .left-left > img {
        display: block;
        border-radius: 6px;
        width: 80px;
        height: 80px;
        border: 1px solid #ccc;
        margin-right: 10px;
    }

    .bm-overlay .detail-box .main-content .left-right {
        float: left;
    }

    .bm-overlay .detail-box .main-content .left-right .closeIcon {
        right: 12px;
        top: 17px
    }

    .bm-overlay .detail-box .main-content .left-right .detailBtn {
        padding: 0;
        border: 1px solid transparent;
        margin: 10px auto;
        width: 200px;
        height: 30px;
        background-image: url(../../assets/img/btn_img.png);
        color: #fff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

    }

    .bm-overlay .detail-box .main-content .left-right p {
        color: #fff;
        font-size: 12px;
        margin-bottom: 0px;
        white-space: nowrap;
    }

    .bm-overlay .detail-box .main-content .left-right p > span {
        margin-left: 5px;
    }

    .bm-overlay .detail-box .main-content .left-right .title {
        font-size: 16px;
        color: #ffffff;
        margin-bottom: 10px;
        margin-top: 0px;
        padding-right: 15px;
    }

    .bm-overlay .detail-box .main-content .left-right .title .circle {
        vertical-align: 5%;
        margin-right: 7px;
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #FD4F41;
    }

    .bm-overlay .detail-box .main-content .left-right .title .yellowCircle {
        @extend .circle;
        background: #FCE233;
    }

    .bm-overlay .detail-box .main-content .left-right .title .greenCircle {
        @extend .circle;
        background: #5BDA9D;
    }

    .bm-overlay .detail-box .main-content .left-right .title .blueCircle {
        @extend .circle;
        background: #3AC8E1;
    }

    .bm-overlay .detail-box .main-content .left-right .star-box {
        margin-top: 3px;
    }

    .bm-overlay .detail-box .main-content .left-right .star {
        color: #ffb442;
        font-size: 20px;
        vertical-align: sub;
    }

    .bm-point .tri {
        color: #151920;
        position: absolute;
        left: 2px;
        bottom: 52px;
        font-size: 53px;
        line-height: 0px;
        opacity: 0.7;
        /* z-index: -1; */
    }
</style>
