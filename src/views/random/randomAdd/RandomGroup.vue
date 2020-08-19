<template>
    <div v-if="groupDatas">
        <section class="taskItem" v-for="(group,index) in groupDatas" :key="index">
            <div class="number"><span>{{group.num}}</span>组</div>
            <div class="panel">
                <div class="title clear_a">
                    <el-tooltip class="item fl" effect="dark" :content="group.checkDeptName" placement="top-start">
                        <span>{{group.checkedDeptName}}</span>
                    </el-tooltip>
                    <span @click="resetEntity(index)"><i class="icon  iconfont icon-refresh mr5"></i>换一批</span>
                </div>
                <div class="text">待检查主体数：{{group.enterpriseGroups}}</div>
                <div class="clear_a text">
                    <div>待检查主体:&nbsp;</div>
                    <div class="p" v-if="group.entitys">
                        <span v-for="(entity,entityIndex) in group.entitys" :key="entityIndex">
                            {{entity.entityName}};
                        </span>
                    </div>
                </div>
                <button @click="openEntity(group)">管理待检查主体</button>

            </div>

            <div>
                <i class="el-icon-back" style="font-size:26px;margin-top:107px;color:#A2AAB6;"></i>
            </div>

            <div class="panel">
                <div class="title clear_a">
                    <el-tooltip class="item fl" effect="dark" :content="group.checkDeptName" placement="top-start">
                        <span>{{group.checkDeptName}}</span>
                    </el-tooltip>
                    <span @click="resetUser(index)"><i class="icon  iconfont icon-refresh mr5"></i>换一批</span>
                </div>
                <div class="text">组长：{{group.leader}}</div>
                <div class="clear_a text">
                    <div>组员:&nbsp;</div>
                    <div class="p" v-if="group.randomTaskUsers">
                        <span v-for="(user,userIndex) in group.randomTaskUsers" :key="userIndex">
                            {{user.leader == 'NO' ? userIndex == group.randomTaskUsers.length - 1 ? user.userName : user.userName + ',' : ''}}
                        </span>
                    </div>
                </div>

                <button @click="openUser(group)">管理执行人员</button>
            </div>
        </section>

        <div style="z-index:10;" v-if="entityManageShow" class="dialog">
            <random-entity :checkedAreaCode="manageGroup.checkedAreaCode" :entitys="manageGroup.randomTaskEntitys" :enterpriseGroups="manageGroup.enterpriseGroups"
                :groupNum="manageGroup.num" :entityType="manageGroup.entityTypes" @deleteEntity="deleteEntity" @addEntity="addEntity"
                @close="closeEntity">
            </random-entity>
        </div>

        <div style="z-index:10;" v-if="userManageShow" class="dialog">
            <random-user :checkAreaCode="manageGroup.checkAreaCode" :users="manageGroup.randomTaskUsers" :eachGroups="manageGroup.eachGroups"
                :groupNum="manageGroup.num" :bizs="manageGroup.entityTypes" :leaderName="manageGroup.leader" :leaderId="manageGroup.leaderId"
                @deleteUser="deleteUser" @addUser="addUser" @setLeader="setLeader" @close="closeUser">
            </random-user>
        </div>

    </div>
</template>



<script>
    import { randomEntity, randomUser } from "api/random/random";
    import RandomEntity from "views/random/randomAdd/RandomTaskEntity.vue";
    import RandomUser from "views/random/randomAdd/RandomTaskUser.vue";
    export default {
        components: {
            RandomEntity,
            RandomUser
        },
        props: {
            groupDatas: {
                type: Array,
            }
        },
        methods: {
            openEntity(group) {
                this.manageGroup = group;
                this.entityManageShow = true;
            },
            openUser(group) {
                this.manageGroup = group;
                this.manageGroup.eachGroups = parseInt(this.manageGroup.eachGroups);
                this.userManageShow = true;
            },
            closeEntity() {
                this.entityManageShow = !this.entityManageShow;
            },
            closeUser() {
                this.userManageShow = !this.userManageShow;
            },
            /** 删除主体 */
            deleteEntity(groupNum, entityId, entityName) {
                return new Promise((resolve, reject) => {
                    this.groupDatas.forEach(group => {
                        if (group.num == groupNum && group.randomTaskEntitys && group.entitys) {
                            let entityIndex = group.randomTaskEntitys.indexOf(entityId);
                            if (entityIndex > -1) {
                                group.randomTaskEntitys.splice(entityIndex, 1);
                            }
                            let i = group.entitys.length;
                            while (i--) {
                                if (group.entitys[i].entityName == entityName) {
                                    group.entitys.splice(i, 1);
                                }
                            }
                        }
                    });
                    resolve(true);
                });
            },
            /** 删除人员 */
            deleteUser(groupNum, userId, userName) {
                return new Promise((resolve, reject) => {
                    this.groupDatas.forEach(group => {
                        if (group.num == groupNum && group.randomTaskUsers) {
                            let i = group.randomTaskUsers.length;
                            while (i--) {
                                if (group.randomTaskUsers[i].userId == userId) {
                                    group.randomTaskUsers.splice(i, 1);
                                }
                            }
                        }
                    });
                    resolve(true);
                });
            },
            /** 新增主体 */
            addEntity(groupNum, entityId, entityName) {
                return new Promise((resolve, reject) => {
                    this.groupDatas.forEach(group => {
                        if (group.num == groupNum && group.randomTaskEntitys && group.entitys) {
                            group.randomTaskEntitys.push(entityId);
                            group.entitys.push({ entityName: entityName });
                        }
                    });
                    resolve(true);
                });
            },
            /** 新增人员 */
            addUser(groupNum, userId, userName) {
                return new Promise((resolve, reject) => {
                    this.groupDatas.forEach(group => {
                        if (group.num == groupNum && group.randomTaskUsers) {
                            let isExist = false;
                            group.randomTaskUsers.forEach(userItem => {
                                if (userItem.userId == userId) isExist = true;
                            })
                            if (!isExist) {
                                group.randomTaskUsers.push({
                                    userId: userId,
                                    userName: userName,
                                    leader: 'NO'
                                });
                            }
                        }
                    });
                    resolve(true);
                });
            },
            setLeader(groupNum, userId, userName) {
                return new Promise((resolve, reject) => {
                    this.groupDatas.forEach(group => {
                        if (group.num == groupNum) {
                            let isExist = false;
                            group.leader = userName;
                            group.leaderId = userId;
                            let i = group.randomTaskUsers.length;

                            while (i--) {//新组长是否为组员，为组员则将组员设为组长
                                if (group.randomTaskUsers[i].userId == userId) {
                                    group.randomTaskUsers[i].leader = 'YES';
                                    isExist = true;
                                }
                            }
                            if (isExist) {
                                let j = group.randomTaskUsers.length;
                                while (j--) {//将原有组长设置为组员
                                    if (group.randomTaskUsers[j].leader == 'YES' && group.randomTaskUsers[j].userId != userId) {
                                        group.randomTaskUsers[j].leader = 'NO';
                                    }
                                }
                            } else {//新组长不为组员，替换原有组长
                                let x = group.randomTaskUsers.length;
                                while (x--) {
                                    if (group.randomTaskUsers[x].leader == 'YES') {
                                        group.randomTaskUsers.splice(x, 1);
                                    }
                                }
                                group.randomTaskUsers.push({
                                    userId: userId,
                                    userName: userName,
                                    leader: 'YES'
                                });
                            }

                        }
                    });
                    resolve(true);
                });
            },
            resetEntity(index) {
                let group = this.groupDatas[index];
                const item = {
                    enterpriseGroups: group.enterpriseGroups,
                    risk: group.risk,
                    quantify: group.quantify,
                    deptId: group.checkedAreaId,
                    entityType: group.entityType
                }
                let entityIds = [];
                randomEntity(item).then((r) => {
                    this.groupDatas[index].entitys = r.data;
                    if (r.data) {
                        r.data.forEach(entityItem => {
                            entityIds.push(entityItem.id);
                        });
                        this.groupDatas[index].randomTaskEntitys = entityIds;
                    }
                });
                this.$emit("updateGroup", this.groupDatas);

            },
            resetUser(index) {
                let group = this.groupDatas[index];
                randomUser(group.checkAreaId, group.eachGroups, group.entityType).then((r) => {
                    this.groupDatas[index].randomTaskUsers = r.data;
                    this.groupDatas[index].leader = r.data[0].userName;
                    this.groupDatas[index].leaderId = r.data[0].userId;
                });
                this.$emit("updateGroup", this.groupDatas);
            }
        },
        watch: {

        },
        data() {
            return {
                entityManageShow: false,
                userManageShow: false,
                manageGroup: {},
            }
        },
    }
</script>


<style scoped lang="sass">
    .taskItem {
        border-bottom: 1px solid #ccc;
        padding-bottom: 50px;
        margin-top: 50px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        .number {
            font-size: 16px;
            color: #6D7787;
            line-height: 252px;
            span {
                font-size: 33px;
                color: #393939;
            }
        }
        .panel {
            width: 360px;
            height: 212px;
            padding: 20px;
            box-shadow: 0px 5px 12px 5px rgba(109, 119, 135, 0.19);
            border-radius: 10px;
            position: relative;
            .title {
                font-size: 24px;
                margin-bottom: 15px;
                line-height: 33px;
                span {
                    color: #6D7787;
                    font-size: 14px;
                    float: right;
                    cursor: pointer;
                    .mr5 {
                        margin-right: 5px;
                    }
                }
                span.fl {
                    font-size: 24px;
                    float: left;
                    width: 80%;
                    color: #393939;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .text {
                font-size: 14px;
                color: #6D7787;
                line-height: 25px;
            }
            .clear_a {
                div {
                    height: 105px;
                }
                .p {
                    width: 270px;
                    height: 79px;
                    line-height: 25px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
            }
            .clear_b {
                div {
                    width: 42px;
                    height: 105px;
                }
                .p {
                    width: 270px;
                    height: 79px;
                    line-height: 25px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                }
            }
            button {
                height: 32px;
                width: 128px;
                border: 1px solid #0DB5EF;
                color: #0DB5EF;
                font-size: 14px;
                text-align: center;
                line-height: 32px;
                background-color: #fff;
                cursor: pointer;
                -webkit-transition: all .1s;
                transition: all .1s;
                position: absolute;
                left: 20px;
                bottom: 20px;
                outline: none;
                &:hover {
                    color: #0DB5EF;
                    background-color: #ecf5ff;
                }
            }
        }
    }

    .dialog {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .6);
    }
</style>