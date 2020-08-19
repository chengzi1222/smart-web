<template>
  <div class="edit" @scroll="scroll">
    <div class="page-tilt">
      <b></b><span class="title">角色{{curdStr}}</span><Back></Back>
    </div>
    <ToggleForm title="基本信息">
      <div class="infoBox">
        <p class="mt20">
          <span class="tit mr10">角色名称:</span>
          <el-input v-if="curd != 'detail'" placeholder='请输入角色名称' v-model="role.name" class="w250 success"></el-input>
          <span v-if="curd == 'detail'">{{role.name}}</span>
        </p>
        <p class="mt20">
          <span class="tit mr10">角色简介:</span>
          <el-input v-if="curd != 'detail'" class="w200 success" type="textarea" v-model="role.intro" placeholder="请输入角色介绍"></el-input>
          <span v-if="curd == 'detail'">{{role.intro}}</span>
        </p>
      </div>
    </ToggleForm>
    <ToggleForm title="权限编辑" id="edit">
      <!-- 左边信息悬浮栏 -->
      <div class="left-info">
        <ul class="main-block">
          <li class="clearfix" :class="slideIndex==index?'activePosition':''" v-for="(item,index) in AllTabData":key="item.lable">
            <a href="javascript:;" @click="goTop('#'+item.lable)"><p class="floatL left">{{item.lableName}}</p></a>
          </li>
        </ul>
      </div>
      <div class="permission mt20">
        <div class="tabHead">
          <span style="width: 20%">权限分类</span>
          <span style="width: 38%">权限分类</span>
          <span style="width: 41%">巡查内容</span>
        </div>
        <div class="PermissionBox" v-for="(item,index) in AllTabData" :key="item.lable" :id="item.lable">
          <div class="onePermission" :style="{'line-height': AllTabData[index].list.length * 84 + 'px'}">
            <span class="movePoin" @click.stop="addOne(item)" v-if="curd != 'detail'">
              <i class="el-icon-minus" :class="allPermissionObj[item.lable]&&allPermissionObj[item.lable].list.length==item.itemNum?'el-icon-check okI':allPermissionObj[item.lable]&&allPermissionObj[item.lable].list.length>0? 'okI':''"></i>
              {{item.lableName}}
            </span>
            <span v-if="curd == 'detail'">{{item.lableName}}</span>
          </div>
          <div class="PermissionBoxMin">
            <div class="twoPermissionBox" v-for="(itemT,indexT) in item.list" :key="itemT.group">
              <p class="twoPermission">
                <span class="movePoin" @click.stop="addTwo(item.lable,itemT)" v-if="curd != 'detail'">
                  <i class="el-icon-minus" :class="allPermissionObj[item.lable]&&allPermissionObj[item.lable][itemT.group]&&allPermissionObj[item.lable][itemT.group].list.length>0&&allPermissionObj[item.lable][itemT.group].list.length< itemT.list.length?'okI':allPermissionObj[item.lable]&&allPermissionObj[item.lable][itemT.group]&&allPermissionObj[item.lable][itemT.group].list.length==itemT.list.length? 'el-icon-check okI':''"
                  ></i>
                  {{itemT.groupName}}
                </span>
                <span v-if="curd == 'detail'">{{itemT.groupName}}</span>
              </p>
              <div class="threePermission">
                <span v-if="curd != 'detail'" v-for="(itemTH,indexTH) in itemT.list" :key="itemTH.id" class="movePoin spaceNowrap ml20" @click.stop="addTree(item.lable,itemT.group,itemTH)">
                  <i class="el-icon-check threePermissionI" :class="allPermissionArr.indexOf(itemTH.id) >= 0? 'okI':''"></i>
                  {{itemTH.name}}
                </span>
                <span v-if="curd == 'detail'" v-for="(itemTH,indexTH) in itemT.list" :key="itemTH.id" class="spaceNowrap ml20">{{itemTH.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToggleForm>
    <div class="foot-btn" style="z-index:2">
      <div>
        <el-button style="width:100px;" @click="$router.go(-1)">返回</el-button>
        <el-button v-if="curd != 'detail'" class="w100" :disabled="subBool" @click="submitRole">保存</el-button>
        <el-button v-if="curd == 'detail'" type="primary" @click="goEdit">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script type="module">
  import Back from 'utils/back.vue';
  import ToggleForm from "components/ToggleForm.vue";
  import { getRoleById,listFuncByRoleIdGroup, updateRole } from 'api/support/role';
  export default{
    data(){
      return {
        slideIndex: 0,
        AllTabData: null,
        allPermissionArr: [],
        allPermissionObj: {},
        role: {
          name: '',
          intro: ''
        },
        curd:'',
        curdStr:'',
        roleId: '',
        deptId: '',
        belong: '',
        subBool: false
      }
    },
    mounted() {
      this.curd = this.$route.params.curd;
      if (this.curd != 'add') {
        this.roleId = this.$route.query.id;
        getRoleById(this.roleId).then(result => {
          this.role = result.data;
        });
      } else {
        this.deptId = this.$route.query.deptId;
      }
      this.belong = this.$route.query.belong;
      this.curdStr = this.getCurdStr(this.curd);
    },
    methods:{
      goTop(hash){
        document.querySelector(hash).scrollIntoView(true);
      },
      goEdit() {
        this.$router.push({
          path: "/support/roles/edit",
          query: {
            belong: this.belong,
            id: this.roleId,
          }
        });
      },
      getCurdStr(curd) {
        let params = {
          roleId: this.$store.getters.user.id,
          deptId: this.$store.getters.user.deptId
        }
        let curdStr = '';
        if (curd === 'add') {
          curdStr = '创建'; 
          listFuncByRoleIdGroup(this.roleId,this.$store.getters.user.deptId).then(r => {
            this.AllTabData = r.data.func;
          })
        } else if (curd === 'edit') {
          curdStr = '编辑';
          listFuncByRoleIdGroup(this.roleId,this.$store.getters.user.deptId).then(r => {
            this.AllTabData = r.data.func;
            let datas = r.data.funcRole;
            for (let i = 0; i < datas.length; i++) {
              this.allPermissionObj[datas[i].lable] = {};
              this.allPermissionObj[datas[i].lable].list = [];
              for (let j = 0; j < datas[i].list.length; j++) {
                this.allPermissionObj[datas[i].lable][datas[i].list[j].group] = {};
                this.allPermissionObj[datas[i].lable][datas[i].list[j].group].list = [];
                for (let l = 0; l < datas[i].list[j].list.length; l++) {
                  this.allPermissionArr.push(datas[i].list[j].list[l].id);
                  this.allPermissionObj[datas[i].lable].list.push(datas[i].list[j].list[l].id);
                  this.allPermissionObj[datas[i].lable][datas[i].list[j].group].list.push(datas[i].list[j].list[l].id);
                }
              }
            }
          })
        } else if (curd === 'detail') {
          curdStr = '详情';
          listFuncByRoleIdGroup(this.roleId,this.$store.getters.user.deptId).then(r => {
            this.AllTabData = r.data.funcRole;
          })
        }
        return curdStr;
      },
      scroll() {
        if (document.body.getElementsByClassName('edit')[0].scrollTop > 240) {
          document.getElementsByClassName('left-info')[0].classList.add('left-info-fixed')
        } else{
          document.getElementsByClassName('left-info')[0].classList.remove('left-info-fixed')
        }
        let offTop = document.body.getElementsByClassName('edit')[0].scrollTop;
        for(let i=0; i<this.AllTabData.length; i++){
          if(offTop >= document.getElementById(this.AllTabData[this.AllTabData.length-1].lable).offsetTop){
            this.slideIndex = this.AllTabData.length - 1;
            return
          }
          if(i+1 == this.AllTabData.length){return}
          if (offTop >= document.getElementById(this.AllTabData[i].lable).offsetTop && offTop < document.getElementById(this.AllTabData[i + 1].lable).offsetTop) {
            this.slideIndex = i;
            return
          }
        }
      },
      addOne(item){
        if (this.allPermissionObj[item.lable] && this.allPermissionObj[item.lable].list.length == item.itemNum) {
          for (let i = 0; i < item.list.length; i++) {
            for (let j = 0; j < item.list[i].list.length; j++) {
              this.allPermissionArr.splice(this.allPermissionArr.indexOf(item.list[i].list[j].id), 1)
              this.allPermissionObj[item.lable].list.splice(this.allPermissionObj[item.lable].list.indexOf(item.list[i].list[j].id), 1)
              this.allPermissionObj[item.lable][item.list[i].group].list.splice(this.allPermissionObj[item.lable][item.list[i].group].list.indexOf(item.list[i].list[j].id), 1)
            }
          }
        } else{
          this.allPermissionObj[item.lable] = {};
          this.allPermissionObj[item.lable].list = [];
          for (let i = 0; i < item.list.length; i++) {
            this.allPermissionObj[item.lable][item.list[i].group] = {};
            this.allPermissionObj[item.lable][item.list[i].group].list = [];
            for(let j=0; j<item.list[i].list.length; j++){
              this.allPermissionObj[item.lable][item.list[i].group].list.push(item.list[i].list[j].id);
              this.allPermissionObj[item.lable].list.push(item.list[i].list[j].id);
              if (this.allPermissionArr.indexOf(item.list[i].list[j].id) < 0) {
                this.allPermissionArr.push(item.list[i].list[j].id);
              }
            }
          }
        }
      },
      addTwo(oneName,item){
        if (this.allPermissionObj[oneName]) {
          if (this.allPermissionObj[oneName][item.group] && this.allPermissionObj[oneName][item.group].list.length == item.list.length) {
            for (let i = 0; i < item.list.length; i++) {
              this.allPermissionArr.splice(this.allPermissionArr.indexOf(item.list[i].id), 1)
              this.allPermissionObj[oneName].list.splice(this.allPermissionObj[oneName].list.indexOf(item.list[i].id), 1)
              this.allPermissionObj[oneName][item.group].list.splice(this.allPermissionObj[oneName][item.group].list.indexOf(item.list[i].id), 1)
            }
          }else if(this.allPermissionObj[oneName][item.group] && this.allPermissionObj[oneName][item.group].list.length > 0){
            for (let i = 0; i < item.list.length; i++) {
              if (this.allPermissionObj[oneName][item.group].list.indexOf(item.list[i].id) < 0) {
                this.allPermissionObj[oneName][item.group].list.push(item.list[i].id);
                this.allPermissionObj[oneName].list.push(item.list[i].id);
                this.allPermissionArr.push(item.list[i].id);
              }
            }
          } else {
            this.allPermissionObj[oneName][item.group] = {};
            this.allPermissionObj[oneName][item.group].list = [];
            for (let i = 0; i < item.list.length; i++) {
              this.allPermissionObj[oneName][item.group].list.push(item.list[i].id);
              this.allPermissionObj[oneName].list.push(item.list[i].id);
              this.allPermissionArr.push(item.list[i].id);
            }
          }
        } else{
          this.allPermissionObj[oneName] = {};
          this.allPermissionObj[oneName].list = [];
          this.allPermissionObj[oneName][item.group] = {};
          this.allPermissionObj[oneName][item.group].list = [];
          for(let i=0; i<item.list.length; i++){
            this.allPermissionObj[oneName][item.group].list.push(item.list[i].id);
            this.allPermissionObj[oneName].list.push(item.list[i].id);
            this.allPermissionArr.push(item.list[i].id);
          }
        }
      },
      addTree(oneName, twoName, item){
        if (this.allPermissionArr.indexOf(item.id) >= 0) {
          this.allPermissionArr.splice(this.allPermissionArr.indexOf(item.id), 1)
          this.allPermissionObj[oneName].list.splice(this.allPermissionObj[oneName].list.indexOf(item.id), 1)
          this.allPermissionObj[oneName][twoName].list.splice(this.allPermissionObj[oneName][twoName].list.indexOf(item.id), 1)
        } else{
          if (this.allPermissionObj[oneName]){
            this.allPermissionObj[oneName].list.push(item.id);
            if (this.allPermissionObj[oneName][twoName]) {
              this.allPermissionObj[oneName][twoName].list.push(item.id);
            } else {
              this.allPermissionObj[oneName][twoName] = {};
              this.allPermissionObj[oneName][twoName].list = [item.id];
            }
          }else {
            this.allPermissionObj[oneName] = {};
            this.allPermissionObj[oneName].list = [item.id];
            this.allPermissionObj[oneName][twoName] = {};
            this.allPermissionObj[oneName][twoName].list = [item.id];
          }
          this.allPermissionArr.push(item.id);
        }
      },
      submitRole() {
        this.subBool = true;
        if (this.allPermissionArr.length <= 0) {
          this.$message({
            message: "请勾选至少一个权限.",
            type: 'error'
          });
          this.subBool = false;
          return false;
        }
        if(this.role.intro == '' || this.role.name == ''){
          this.$message({
            message: "请填写基础信息",
            type: 'error'
          });
          this.subBool = false;
          return false;
        }
        let params = {};
        params.role = this.role;
        params.role.belong = this.belong;
        params.moduleFuncList = this.allPermissionArr;
        let message = '';
        if (this.curd === 'add') {
          params.role.deptId = this.deptId;
          message = '添加角色成功!';
        } else if (this.curd === 'edit') {
          params.role.id = this.roleId;
          message = '编辑角色成功!';
        }
        updateRole(params).then((result) => {
          this.subBool = false;
          if (result.status) {
            this.$message({
              message: message,
              type: 'success'
            });
            this.$router.push('/support/roles');
          } else {
            this.$message({
              message: result.message,
              type: 'error'
            });
          }
        })
      }
    },
    components: {
      Back,
      ToggleForm
    }
  }
</script>

<style scoped lang="sass">
  .edit{
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 20px;
    width: 100%;
    position: relative;
    max-height: 100%;
  }
  .infoBox{
    margin-top: 30px;
    p{
      width: 400px;
      margin: 0 auto;
      .tit{
        display: inline-block;
        width: 80px;
        text-align: right;
      }
    }
  }
  .left-info {
    width: 210px;
    height: 500px;
    background: #fff;
    position: absolute;
    z-index: 2;
    .head-block {
      background: #F2F5F8;
      height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
    }
    .main-block {
      > li {
        border-right: 2px solid #EBF1F5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #F2F5F8;
        }
        a{
          width: 100%;
          height: 100%;
          display: inline-block;
          color: #000;
        }
      }
      .activePosition {
        border-right: 2px solid #0db5ef;
        .left {
          color: #0db5ef
        }
      }
    }
  }
  .left-info-fixed{
    position: fixed;
    top: 75px;
  }
  .permission{
    border: 1px solid #C2CAD2;
    margin-left: 230px;
    color: #393939;
    font-size: 12px;
    margin-bottom: 100px;
    i{
      padding: 2px;
      border: 1px solid #C2CAD2;
      font-weight: 700;
      color: #fff;
      margin-right: 5px;
    }
    .okI{
      border: 1px solid rgba(0,0,0,0);
      background: #0DB5EF;
    }
    .tabHead{
      border-bottom: 1px solid #C2CAD2;
      height:40px;
      line-height: 40px;
      background: #F2F5F8;
      color: #787878;
      font-size:12px;
      span{
        display: inline-block;
        text-align: center;
      }
    }
    .PermissionBox{
      display: flex;
      border-bottom: 1px solid #C2CAD2;
    }
    .onePermission{
      text-align: center;
      width: 20%;
      border-right: 1px solid #C2CAD2;
      box-sizing: border-box;
    }
    .PermissionBoxMin{
      width: 80%;
      .twoPermissionBox{
        overflow: hidden;
        line-height: 84px;
        border-bottom: 1px solid #C2CAD2;
        box-sizing: border-box;
      }
      .twoPermissionBox:last-child{
        border-bottom: none;
      }
      .twoPermission{
        width: 45%;
        text-align: center;
        float: left;
      }
      .threePermission{
        float: right;
        width: 55%;
        line-height: 28px;
        padding: 10px 0;
        span{
          display: inline-block;
          width: 180px;
        }
      }
    }
  }
</style>