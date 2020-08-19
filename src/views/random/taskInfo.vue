<template>
	<div>
		<div class="page-tilt mb20">
    	    <b></b><span>双随机任务详情</span>
    	</div>
		<toggle-form title="基础内容">
			<div class="base fs14">
				<div  class="clear_a">
					<div>任务名称：</div>
					<span>{{infoData.taskName}}</span>
				</div>
				<div  class="clear_a">
					<div>起止时间：</div>
					<span>{{infoData.startDate.substring(0,infoData.startDate.length - 9)}} 至 {{infoData.endDate.substring(0,infoData.endDate.length - 9)}}</span>
				</div>
				<div  class="clear_a">
					<div>主体类型：</div>
					<div style="width:80%;">
            <span v-for="(randomTable,index) in infoData.randomTables" :key="index" style="width:100%;display: inline-block;">
              {{randomTable.entityType}}({{randomTable.name}})
            </span>
          </div>
				</div>
				<div  class="clear_a">
                    <div>任务区域：</div>
                    <div style="width: 70%;">
                        <span v-for="(group,index) in infoData.groups"  class="spaceNowrap" style="width: 100%;" :key="index" :title="group.areaName">{{group.areaName}}；</span>
                    </div>
				</div>
				<div class="clear_a item">
					<div  class="clear_a">
						<div>每组人数：</div>
						<span>{{infoData.eachGroups}}</span>
					</div>
					<div  class="clear_a">
						<div>每组企业数：</div>
						<span>{{infoData.enterpriseGroups}}</span>
					</div>
				</div>
        <div  class="clear_a">
          <div>风险等级：</div>
          <span :title="infoData.risk">{{infoData.risk}}</span>
        </div>
        <div  class="clear_a">
          <div>量化等级：</div>
          <span :title="infoData.quantify">{{infoData.quantify}}</span>
        </div>
				<div class="clear_a">
					<div>任务描述：</div>
					<span :title="infoData.remarks" style="word-wrap: break-word;max-width: calc(100% - 120px);">{{infoData.remarks}}</span>
				</div>
				<div  class="clear_a">
 					<div>相关文件：</div>
          <div class="show-success-file">
            <div class="file-item" v-for="(item,index) in infoData.files" :key="index">
              <span class="file-name not-pic" @click.stop="downloadFile(index,item)" v-if="['png','jpg','jpeg'].indexOf(item.ext)==-1" >{{item.fileName}}</span>
              <span class="file-name" @click.stop="showBigPic=index" v-if="~['png','jpg','jpeg'].indexOf(item.ext)">{{item.fileName}}</span>
              <div class='big-img' v-show="showBigPic==index" @click.stop="showBigPic = -1" v-if="~['png','jpg','jpeg'].indexOf(item.ext)">
                <img :src="$store.getters.filePath + item.fileId" alt="">
              </div>
            </div>
          </div>
				</div>
			</div>
		</toggle-form>
        <toggle-form v-show="showRandom != 'NO'" title="任务分配">
            <div class="taskBox">
                <button class="titleBtn titleBtn1">待检查区域</button><button class="titleBtn titleBtn2">执行机构</button>
                <section class="taskItem" v-for="(item,index) in infoData.groups" :key="index">
                    <div class="number">第<span>{{index + 1}}</span>组</div>
                    <div class="panel">
                         <div class="title">
                            <el-tooltip class="item fl" effect="dark" :content="item.checkedArea" placement="top-start">
                                <span >{{item.checkedArea}}</span>
                            </el-tooltip>
                        </div>
                        <div class="text">随机检查主体数:{{item.entityCount}}</div>
                        <div class="clear_a text">
                            <div >随机检查主体:</div>
                            <div class="p">
                                <span v-for="(entity,index2) in item.entitys" :key="index2">
                                  {{entity.entityName}}；
                                </span>
                            </div>
                        </div>
                        <button @click="entityPage(infoData.id, item.id, item.checkedArea)">随机检查主体信息</button>
                    </div>
                    <div ><i class="el-icon-back" style="font-size:26px;margin-top:107px;color:#A2AAB6;"></i></div>
                    <div class="panel">
                       <div class="title">
                            <el-tooltip class="item fl" effect="dark" :content="item.checkArea" placement="top-start">
                                <span >{{item.checkArea}}</span>
                            </el-tooltip>
                        </div>
                        <div class="text">组长:{{item.groupLeader}}</div>
                        <div class="text">组员:{{item.groupMembers}}</div>
                    </div>
                </section>
            </div>
        </toggle-form>
        <div class="foot-btn" style="z-index:1" >
          <div>
            <el-button v-if="showRandom === 'NO'" type="default" @click="$router.push({name: 'random.executor.list'})" >返回</el-button>
            <el-button v-if="showRandom === 'YES'" type="default" @click="$router.push({name: 'random.task'})" >返回</el-button>
          </div>
        </div>
        <el-dialog
        :visible.sync="dialogTableVisible"
        :modal-append-to-body="false">
          <slot slot="title">
              随机检查主体信息-{{currentCheckArea}}
          </slot>
          <random-task-entity-list v-if="dialogTableVisible" :randomTaskId="infoData.id" :randomTaskGroupId="currentRandomTaskGroupId"></random-task-entity-list>
        </el-dialog>
	</div>
</template>



<script>
import ToggleForm from "components/ToggleForm.vue";
import * as randomTask from "api/random/random";
import {downloadFile} from 'api/common';
import RandomTaskEntityList from "./randomTaskEntityList";
export default {
	data() {
		return {
      currentCheckArea: '',
      currentRandomTaskGroupId: '',
      dialogTableVisible: false,
      showBigPic: -1, // 图片是否现实大图
      infoData: {
          id: '',
          taskName: '',
          startDate: '',
          endDate: '',
          entityType: '',
          eachGroups: '',
          enterpriseGroups: '',
          risk: '',
          quantify: '',
          remarks: '',
          areaNames: [],
          files: [],
          groups: [],
      },

      showRandom: ""  //是否展示任务分配
    }
	},
	components: {
        ToggleForm,
        RandomTaskEntityList
  },
  mounted () {
    randomTask.getInfo(this.$route.query.randomTaskId).then(r => {
      this.infoData = r.data
    })

    this.showRandom = this.$route.query.showRandom;
  },
  methods: {
    downloadFile(index,file){
      downloadFile(file.fileId, file.fileName.substring(0, file.fileName.lastIndexOf(file.ext) - 1));
    },
    entityPage (randomTaskId, randomTaskGroupId, checkArea) {
      this.currentRandomTaskGroupId = randomTaskGroupId
      this.currentCheckArea = checkArea
      this.dialogTableVisible = true
    }
  }
}
</script>


<style scoped lang="sass">
.taskBox{
    position:relative;
    padding:0px 0 35px;
    width:950px;
    margin:30px auto 0;
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
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            span{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
            }
        }
        .text{
            font-size:14px;
            color:#6D7787;
            line-height:25px;
        }
        .clear_a{
            div{
                width:95px;
                height:105px;
            }
            .p{
                width:250px;
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
.base{
	width:400px;
	margin:30px 0 30px 40%;
	line-height:26px;
	color:#A2AAB6;
	>div{
		min-height:50px;
		div{
			width:20%;
		}
		span{
			color:#393939;
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
		}
		.file{
			width:80%;
			a{
			display:block;
			color:#1787AD;
			cursor:pointer;
				&:hover{
					text-decoration: underline;
				}
			}
		}
	}
	.item{
		width:100%;
		>div{
			width:50%;
			div{
				width:43%;
			}
			span{
				width:57%;
				color:#393939;
				overflow:hidden;
				text-overflow:ellipsis;
				white-space:nowrap;
			}
		}
	}
}
.borSty{
  border:1px solid #ccc;
  padding:5px;
}
  .show-success-file{
  .file-item{
  .el-progress{
    display: inline-block;
    width: 130px;
  }
  .file-name{
    cursor: pointer;
    margin-right: 20px;
    color: #1787AD;
  }
  .not-pic{
    // color: #6D7787;
  }
  .delete-btn{
    color: #1787AD;
    cursor: pointer;
  }
  }
  .big-img{
    height: 100%;
    width: 100%;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  >img{
    display: block;
    max-height: 700px;
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
    top:-6px;
}
.titleBtn1{
    left:215px;
}
.titleBtn2{
    left:687px;
}
</style>
