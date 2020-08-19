<template>
    <toggle-form title="任务分配">
        <div class="taskBox">
            <button class="titleBtn titleBtn1">待检查区域</button><button class="titleBtn titleBtn2">执行机构</button>
            <el-button class="resetbtn" @click="getRandomGroup" type="primary">重新随机</el-button>
            <!-- 随机分组 -->
            <div style="margin-top:44px;">
                <div class="loading" v-show="!isShow && isGroup"> </div>
                <random-group v-if="isShow" @updateGroup="updateGroup" :groupDatas="groups"></random-group>
            </div>
        </div>
        <!-- 底部按钮 randomAdd-->
        <div class="foot-btn" style="z-index:1" >
            <div>
                <el-button type="default" @click="goBack">返回并取消</el-button>
                <el-button type="primary" @click="lastStep">上一步</el-button>
                <el-button type="primary" v-if="!$route.params.randomTaskId && isGroup" @click="submitTask" style="width:120px;">保存并提交</el-button>
                <el-button type="primary" v-if="$route.params.randomTaskId && isGroup" @click="updateTask" style="width:120px;">提交更新</el-button>
            </div>
        </div>
    </toggle-form>
</template>

<script>
import ToggleForm from "components/ToggleForm.vue";
import RandomGroup from "./RandomGroup.vue";
import {addTask, updateTask, randomTask } from "api/random/random";
export default {
  mounted() {
    if(!this.$route.params.randomTaskId){
        this.getRandomGroup();
    }else{
        let taskGroup = Object.assign([],this.taskData.randomTaskGroup);
        let randomTskEntityTypes = [];
            if(this.taskData.entityType){
                this.taskData.entityType.forEach(entityItem => {
                    randomTskEntityTypes.push(entityItem.typeKey);
                });
        }
        this.generateGroup(taskGroup, this.taskData.enterpriseGroups,randomTskEntityTypes.join(","));
        this.isGroup = true;
    }
  },
  props: {
    taskData: {
      type: Object
    }
  },
  methods: {
    goBack () {
      if (this.$route.params.randomTaskId) {
        // 编辑
        this.$confirm('是否确认取消修改双随机计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
        })
      } else {
        // 添加
        this.$confirm('是否确认取消添加双随机计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
        })
      }
    },
    submitTask(){
      this.$confirm('是否确认添加双随机计划？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        addTask(this.taskAdd).then((r) => {
            if (!r.status) {
              this.$message({
                  message: r.message,
                  type: r.level
              });
              return;
            }
            this.$message({
                  message: '提交保存成功!',
                  type: 'success'
            });
            this.$router.push({name: "random.task"});
        });
      })
    },
    updateTask(){
        this.$confirm('是否确认修改双随机计划？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          updateTask(this.taskAdd).then((r) => {
            if (!r.status) {
              this.$message({
                  message: r.message,
                  type: r.level
              });
              return;
            }
            this.$message({
                  message: '提交保存成功!',
                  type: 'success'
            });
            this.$router.push({name: "random.task"});
          });
        })
    },
    updateGroup(val){
        // debugger
        Object.assign(this.taskAdd,this.taskData,{randomTaskGroup: val});
        this.taskAdd.risk = this.taskAdd.risk ? this.taskAdd.risk.join(",") : "";
        this.taskAdd.quantify = this.taskAdd.quantify ? this.taskAdd.quantify.join(",") : "";
        let randomTaskItems = [];
        let entityTypes = [];
        if(this.taskAdd.entityType){
            this.taskAdd.entityType.forEach(entityItem => {
                randomTaskItems.push(entityItem.projectId);
                entityTypes.push(entityItem.typeKey);
            });
        }
        this.taskAdd.entityType = entityTypes ? entityTypes.join(',') : '';
        this.taskAdd.randomTaskItems = randomTaskItems;
    },
    getRandomGroup() {
      this.isShow = false;
      let task = Object.assign({}, this.taskData);
      task.risk = task.risk ? task.risk.join(",") : "";
      task.quantify = task.quantify ? task.quantify.join(",") : "";
      let taskAreas = [];
      let randomTskEntityTypes = [];
      if(task.entityType){
        task.entityType.forEach(entityItem => {
            randomTskEntityTypes.push(entityItem.typeKey);
        });
       }
       task.entityType = randomTskEntityTypes.join(",");
      if(task.taskAreas){
          task.taskAreas.forEach(areaItem => {
              taskAreas.push(areaItem.deptId);
          });
      }
      task.taskAreas = taskAreas;
      randomTask(task).then(r => {
          if(!r.status){
            this.isGroup = false;
            this.$confirm(r.message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '返回上一步',
                type: r.level
                }).then(() => {
                    
                }).catch(() => {
                  this.lastStep();
            });
            return;
          }
        this.isGroup = true;
        const resultGroups = r.data.randomTaskGroup;
        this.generateGroup(resultGroups,r.data.enterpriseGroups,task.entityType);
      });
    },
    generateGroup(resultGroups,enterpriseGroups,entityKeys){
        if (resultGroups) {
          let groupArr = [];
          resultGroups.forEach(groupItem => {
            let leader = "";
            let leaderId = "";
            if (
              groupItem.randomTaskUsers &&
              groupItem.randomTaskUsers.length > 0
            ) {
              leader = groupItem.randomTaskUsers[0].userName;
              leaderId = groupItem.randomTaskUsers[0].userId;
            }

            let randomTaskEntitys = [];
            if(groupItem.randomTaskEntityItems){
                groupItem.randomTaskEntityItems.forEach(entityItem => {
                    randomTaskEntitys.push(entityItem.id);
                });
            }

            const group = {
              num: groupItem.num,
              enterpriseGroups: enterpriseGroups, //每组主体数量
              checkedAreaId: groupItem.checkedAreaItem.id, //带检查区域部门ID
              checkedAreaCode: groupItem.checkedAreaItem.areaCode, //带检查区域部门区域编码
              checkedDeptName: groupItem.checkedAreaItem.deptName, //带检查区域部门名称
              checkAreaId: groupItem.checkAreaItem.id, //执行机构
              checkAreaCode: groupItem.checkAreaItem.areaCode, //执行机构区域编码
              checkDeptName: groupItem.checkAreaItem.deptName, //执行机构部门名称
              entitys: groupItem.randomTaskEntityItems, //带检查主体
              entityType: entityKeys, //带检查主体
              entityTypes: entityKeys.split(','), //带检查主体
              randomTaskEntitys: randomTaskEntitys,
              randomTaskUsers: groupItem.randomTaskUsers,
              leader: leader, //执行机构人员
              leaderId: leaderId, //执行机构人员ID
              risk: this.taskData.risk.join(","),
              quantify: this.taskData.quantify.join(","),
              eachGroups: this.taskData.eachGroups
            };
            groupArr.push(group);
          });
          this.groups = groupArr;
          this.updateGroup(groupArr);
        }
    },
    lastStep(){
       this.$emit("lastStep")
    },
    baseData(val){
      alert(val);
    }
  },
  data() {
    return {
      groups: [], //分组数据
      taskAdd:{},
      isGroup: false,
      isShow: false,
    };
  },
  watch:{
     groups(val){
        if(val){
            setTimeout(() => {
                this.isShow = true;
            },4000);
        }else{
            this.isShow=false;
        }
     } 
  },
  components: {
    ToggleForm,
    RandomGroup
  }
};
</script>


<style lang="scss" scoped>
.loading{
    background: url(../../../assets/img/randomLoading.gif) no-repeat  center;
    background-size:420px 260px;
    height:400px;
}
.taskBox{
    position:relative;
    padding:35px 0;
    width:950px;
    margin:0 auto;
    .resetbtn{
        position:absolute;
        top:25px;
        right:0;
    }
    section{
        padding-top:50px;
        padding-bottom:50px;
    }
    .line{
        height:1px;
        width:890px;
        background-color:#C2CAD2;
        margin-left:60px;
    }
}
.taskItem{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    .number{
            font-size:16px;
            color:#6D7787;
            line-height:252px;
        span{
            font-size:33px;
            color:#393939;
        }
    }
    .panel{
        width:360px;
        height:212px;
        padding:20px;
        box-shadow: 0px 5px 12px 5px rgba(109,119,135,0.19) ;
        border-radius: 10px;
        position:relative;
        .title{
            font-size:24px;
            color:#393939;
            margin-bottom:15px;
            line-height:33px;
            span{
                color:#6D7787;
                font-size:14px;
                float:right;
                cursor:pointer;
            }
        }
        .text{
            font-size:14px;
            color:#6D7787;
            line-height:25px;
        }
        .clear_a{
            div{
                width:85px;
                height:105px;
            }
            .p{
                width:270px;
                height:79px;
                line-height:25px;
               display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
        }
        button{
            height:32px;
            width:128px;
            border:1px solid #0DB5EF;
            color:#0DB5EF;
            font-size:14px;
            text-align:center;
            line-height:32px;
            background-color:#fff;
            cursor:pointer;
            -webkit-transition:all .1s;
            transition:all .1s;
            position:absolute;
            left:20px;
            bottom:20px;
            outline:none;
            &:hover {
                color:#0DB5EF;
                background-color:#ecf5ff;
            }
        }
    }
}
.titleBtn{
    width:118px;
    height:34px;
    background:rgba(242,245,248,1);
    border-radius:17px;
    -webkit-border-radius:17px;
    -o-border-radius:17px;
    -ms-border-radius:17px;
    -moz-border-radius:17px;
    border:1px solid #C2CAD2;
    color:#787878;
    font-size:14px;
    line-height:34px;
    text-align:center;
    position:absolute;
    top:25px;
}
.titleBtn1{
    left:200px;
}
.titleBtn2{
    left:687px;
}
</style>
