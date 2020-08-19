<template>
    <div style="position:relative;" id="kitchenLive">
        <div class="zhezhao" v-if="loadings">
            <i class="el-icon-loading"></i>
        </div>
        <div class="liveError" v-if='numBoolean'>
            <div class="clear_a">
                <div class="img">
                    <img :src="errImg">
                </div>
                <div class="text">
                    <p class="mb10 p_1">暂未接入阳光厨房</p>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="title">
                {{this.firstData.entityName}}&nbsp;&nbsp;{{this.cameraName}}<span>{{this.firstData.entityTypeStr}}</span>
            </p>
            <div class="live clear_a">
                <div class="video">
                    <div class="shuidi-ctn" style="width:100%;height:100%;position:relative;" id="player">

                    </div>
                </div>
                <div class="videoInfo">
                    <el-tooltip effect="dark" :content="this.firstData.entityName" placement="top-start">
                        <p class="liveTitle textell">{{this.firstData.entityName}}</p>
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="this.firstData.realityAddr" placement="top-start">
                        <p class="liveTitle1 textell">地址：{{this.firstData.realityAddr}}</p>
                    </el-tooltip>
                    <p class="liveTitle1">联系方式：{{this.firstData.mobile}}</p>
                    <div class="box">
                        <p>直播频道：</p>
                        <ul>
                            <li class="clear_a mb20 active" v-for="(camera,index) in this.firstDataList"
                                @click="playFlow(camera,index,true);">
                                <div class="left relative">
                                    <img :src="camera.imgAddr">
                                    <div class="flag" v-if="index==nowCamera">当前摄像头</div>
                                </div>
                                <div class="right">{{camera.name}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <p class="title">更多直播点位</p>
            <div class="slideBox mb20">
                <ul class="ULbox clear_a">
                    <li v-for="(data,index) in this.listData" @click="firstShow(data,true)">
                        <div class="flag" v-if="data.entityId == firstData.entityId">当前直播</div>
                        <div class="hover"><img :src="hoverImg"></div>
                        <div class="imgbox"><img :src="data.cameraList[0].imgAddr"></div>
                        <el-tooltip effect="dark" :content="data.entityName" placement="top-start">
                            <p class="textell imgp">{{data.entityName}}</p>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import {
        showCameraEntity
    } from "api/activity/camera";

    export default {
        components: {

        },
        mounted() {
            this.findList();
        },
        methods: {
            findList() {
                showCameraEntity(this.id).then(result => {
                    if (result.status) {
                        let res = result.data;
                        if (res && res.length > 0) {
                            this.firstShow(res[0], true)
                            this.listData = res;
                        }
                        this.numBoolean = !(res.length > 0);
                    }
                    this.loadings = false
                })
            },
            //直播展示
            firstShow(item, autostart) {
                this.firstData = item;
                this.firstDataList = item.cameraList;
                this.cameraName = item.cameraList[0].name;
                var videoObj = {
                    "id": "player",
                    "source": item.cameraList[0].playerAddr,
                    "width": "100%",
                    "height": "86%",
                    "autoplay": true,
                    "isLive": true,
                    "rePlay": false,
                    "playsinline": true,
                    "preload": true,
                    "language": "zh-cn",
                    "controlBarVisibility": "hover",
                    "useH5Prism": true,
                    "extraInfo": {
                        "crossOrigin": "anonymous"
                    },
                    "skinLayout": [{
                            "name": "bigPlayButton",
                            "align": "blabs",
                            "x": 30,
                            "y": 80
                        },
                        {
                            "name": "H5Loading",
                            "align": "cc"
                        },
                        {
                            "name": "infoDisplay"
                        },
                        {
                            "name": "tooltip",
                            "align": "blabs",
                            "x": 0,
                            "y": 56
                        },
                        {
                            "name": "thumbnail"
                        }
                    ]
                }
                var player = new Aliplayer(videoObj, function (player) {
                    console.log("播放器创建了。");
                })
                this.player = player;
            },
            playFlow(item, index, autostart) {
                this.nowCamera = index;
                this.cameraName = item.name;
                var player = this.player;
                player.loadByUrl(item.playerAddr);
            }
        },
        beforeDestroy() {
            this.player.dispose(); //离开页面时销毁播放器，停止流直播
        },
        data() {
            return {
                errImg: require('assets/img/liveError.png'),
                hoverImg: require('assets/img/play_icon.svg'),
                firstData: {},
                firstDataList: [],
                listData: [],
                numBoolean: false,
                nowCamera: 0,
                cameraName: '',
                loadings: true,
                player: null, //播放对象
            }
        },
        props: {
            id: {
                type: String
            },
        }
    }
</script>
<style lang='scss' scoped>
    .title {
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        color: rgba(57, 57, 57, 1);
        line-height: 22px;
        margin-bottom: 20px;

        span {
            width: 68px;
            height: 24px;
            background: rgba(241, 249, 251, 1);
            border-radius: 4px;
            border: 1px solid rgba(13, 181, 239, 1);
            margin-left: 20px;
            font-size: 13px;
            display: inline-block;
            font-family: PingFangSC-Regular;
            color: rgba(13, 181, 239, 1);
            line-height: 24px;
            text-align: center;
        }
    }

    .live {
        height: 500px;
        width: 100%;
        border: 1px solid rgba(57, 65, 69, 1);
        margin-bottom: 20px;

        .video {
            width: 70%;
            height: 100%;
        }

        .videoInfo {
            width: 30%;
            height: 100%;
            background: rgba(57, 65, 69, 1);
            padding: 15px 20px;
            box-sizing: border-box;

            >.liveTitle1 {
                font-size: 14px;
                font-family: PingFangSC-Regular;
                color: rgba(162, 170, 182, 1);
                line-height: 26px;
            }

            >.liveTitle {
                font-size: 16px;
                font-family: PingFangSC-Semibold;
                color: rgba(255, 255, 255, 1);
                line-height: 22px;
                margin-bottom: 10px;
            }

            .box {
                margin-top: 70px;

                >p {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold;
                    color: rgba(255, 255, 255, 1);
                    line-height: 22px;
                    margin-bottom: 15px;
                }

                ul {
                    height: 280px;
                    overflow-y: auto;

                    li {
                        margin-bottom: 20px;

                        .left {
                            width: 60%;
                            height: 110px;
                            border-radius: 5px;
                            overflow: hidden;
                            background: #fff;
                            box-sizing: border-box;

                            img {
                                width: 100%;
                                height: 100%;
                            }

                            >.flag {
                                width: 90px;
                                height: 24px;
                                background: rgba(13, 181, 239, 1);
                                border-radius: 12px;
                                opacity: 0.9;
                                font-size: 14px;
                                font-family: PingFangSC-Regular;
                                color: rgba(255, 255, 255, 1);
                                line-height: 24px;
                                text-align: center;
                                position: absolute;
                                right: 10px;
                                top: 10px;
                                z-index: 2;
                            }
                        }

                        .right {
                            height: 60px;
                            width: calc(40% - 20px);
                            padding-left: 20px;
                            font-size: 16px;
                            font-family: PingFangSC-Regular;
                            color: rgba(162, 170, 182, 1);
                            line-height: 22px;
                            padding-top: 50px;
                        }
                    }

                    li.active {
                        .left {
                            border: 3px solid rgba(13, 181, 239, 1);
                        }

                        .right {
                            color: rgba(13, 181, 239, 1);
                        }
                    }
                }

            }
        }
    }

    .slideBox {
        height: 400px;

        ul {
            height: 100% !important;

            li {
                width: 23%;
                position: relative;
                margin-right: calc((100% - 92%) / 3);

                &:hover .hover {
                    display: block;
                }

                >.flag {
                    width: 82px;
                    height: 24px;
                    background: rgba(13, 181, 239, 1);
                    border-radius: 12px;
                    opacity: 0.9;
                    font-size: 14px;
                    font-family: PingFangSC-Regular;
                    color: rgba(255, 255, 255, 1);
                    line-height: 24px;
                    text-align: center;
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    z-index: 2;
                }

                >.hover {
                    width: 100%;
                    height: 154px;
                    background: rgba(9, 9, 9, .1);
                    position: absolute;
                    left: 0;
                    top: 0;
                    border-radius: 8px;
                    overflow: hidden;
                    display: none;

                    img {
                        width: 44px;
                        height: 44px;
                        margin: 55px auto;
                        display: block;
                    }
                }

                >.imgbox {
                    background: #ddd;
                    width: 100%;
                    height: 154px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .imgp {
                    font-size: 16px;
                    font-family: PingFangSC-Regular;
                    color: rgba(57, 57, 57, 1);
                    line-height: 22px;
                }
            }

            li:nth-child(4n+4) {
                margin-right: 0;
            }
        }
    }

    .liveError {
        width: 100%;
        min-height: 100%;
        height: 100%;

        >div {
            width: 850px;
            height: 250px;
            margin: 0 auto;
            margin-top: 170px;

            >.img {
                width: 423px;
                height: 230px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            >.text {
                width: 300px;
                height: 230px;
                margin-left: 76px;

                .p_1 {
                    margin-top: 80px;
                    font-size: 36px;
                    font-family: PingFangSC-Semibold;
                    color: rgba(57, 57, 57, 1);
                    line-height: 50px;
                }
            }
        }
    }

    .zhezhao {
        position: absolute;
        background: #fff;
        /* background:rgba(0,0,0,.8); */
        text-align: center;
        width: calc(100% + 40px);
        height: 100%;
        z-index: 99;
        margin-left: -20px;
        margin-top: -20px;

        i {
            font-size: 35px;
            color: #ccc;
            margin-top: 200px;
        }
    }
</style>
<style lang="scss">
    #kitchenLive .el-carousel,
    #kitchenLive .el-carousel__container,
    #kitchenLive .el-carousel__item {
        height: 250px;
    }

    #kitchenLive .el-carousel__arrow,
    #kitchenLive .el-carousel__arrow:hover {
        width: 40px;
        height: 60px;
        background: rgba(0, 0, 0, .5);
        font-size: 18px;
        font-weight: 600;
    }

    #kitchenLive .el-carousel__arrow--right {
        right: 0;
        border-radius: 8px 0px 0px 8px;
    }

    #kitchenLive .el-carousel__arrow--left {
        left: 0;
        border-radius: 0px 8px 8px 0px;
    }
</style>