<template>
  <div class="user-box">
        <div class="page-tilt">
            <b></b>
            <span>其他设置</span>
        </div>
       <toggle-form title="直属部门管理">
           <div class="ipt-btn-box" style="margin: 15px 0px; float: right;">
            <el-button  type="primary" icon="plus" slot="append" @click="add_('directly','add',null)" style="padding-top: 9px;">添加
            </el-button>
           </div>
            <el-table :data="directly" class="table-div" :key="'directly'"  v-loading="loading" element-loading-text="数据正在努力加载中" >
                <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                <el-table-column label="直属部门名称"  prop="name" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="成员"  prop="members" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注"  prop="remark" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作"  min-width="140">
                    <template slot-scope="scope">
                    <a href="javascript:" v-if="scope.row.enable=='YES'" @click="enableChange('directly',false,scope.row)" class="operate-a">禁用</a>
                    <a href="javascript:" v-if="scope.row.enable!='YES'" @click="enableChange('directly',true,scope.row)" class="operate-a">启用</a>
                    <a href="javascript:" @click="del('directly',scope.row)"  class="operate-a">删除</a>
                    <a href="javascript:" v-if="scope.row.enable=='YES'"  @click="" class="operate-a"  @click="add_('directly','edit',scope.row)" >编辑</a>
                    <a href="javascript:" v-if="scope.row.enable=='YES'"  @click="" class="operate-a"  @click="transferChange('directly',scope.row)" >添加成员</a>
                    </template>
                </el-table-column>
            </el-table>
        <yuanben-page :page="page0" @size-change="pageSizeChange0" @current-change="pageCurrentChange0" style="margin-top:10px;">
        </yuanben-page>
       </toggle-form>
       <toggle-form title="职务管理">
            <div class="ipt-btn-box" style="margin: 15px 0px; float: right;">
                <el-button type="primary" icon="plus" slot="append" @click="add_('duty','add',null)" style="padding-top: 9px;">添加
                </el-button>
            </div>
           <el-table :data="duty" class="table-div"  :key="'duty'"  v-loading="loading1" element-loading-text="数据正在努力加载中" >
                <el-table-column type="index" label="序号" min-width="50"></el-table-column>
                <el-table-column label="职务名称" prop="name"   min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="成员" prop="members"   min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注"  prop="remark"   min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作"  min-width="140">
                    <template slot-scope="scope">
                    <a href="javascript:" v-if="scope.row.enable=='YES'" @click="enableChange('duty',false,scope.row)" class="operate-a">禁用</a>
                    <a href="javascript:" v-if="scope.row.enable!='YES'" @click="enableChange('duty',true,scope.row)" class="operate-a">启用</a>
                    <a href="javascript:" @click="" @click="del('duty',scope.row)" class="operate-a">删除</a>
                    <a href="javascript:" v-if="scope.row.enable=='YES'"  @click="add_('duty','edit',scope.row)" class="operate-a">编辑</a>
                    <a href="javascript:" v-if="scope.row.enable=='YES'"  @click="transferChange('duty',scope.row)" class="operate-a">添加成员</a>
                    </template>
                </el-table-column>
            </el-table>
            <yuanben-page :page="page1" @size-change="pageSizeChange1" @current-change="pageCurrentChange1" style="margin-top:10px;">
            </yuanben-page>
       </toggle-form>
        <!-- 添加和编辑 -->
        <transition name="el-fade-in-linear">
            <YbPopup :title='title' :isShow="addIsShow" :ischoose="false">
            <div slot="body" class="mt20">
                <div class="form-item">
                <span class="input-t" v-if='add.type=="directly"'>直属部门名称:</span>
                <span class="input-t" v-else>职务名称:</span>
                <el-input :placeholder="add.type=='directly'?'请输入直属部门名称(必填)':'请输入职务名称(必填)'" v-model="add.name" maxlength="30" class="w260"></el-input><br>
                <span style="color:red;"class='mt10' v-if='nameIS&&add.type=="directly"'>直属部门名称为必填项！</span>
                <span style="color:red;"class='mt10' v-if='nameIS&&add.type!="directly"'>职务名称为必填项！</span>
                </div>
                
                <div class="form-item">
                <span class="input-t">备注:</span>
                <el-input placeholder="请输入备注" v-model="add.remark"  type="textarea" :rows="6" :maxlength="300" class="w260"></el-input>
                </div>
            </div>
            <div slot="foot" class="mt20">
                <el-button type="default" @click="addIsShow=false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :disabled="disabled">确定</el-button>
            </div>
            </YbPopup>
        </transition>
       <!-- 穿梭框 -->
       <transition name="el-fade-in-linear">
        <pop  v-if='popIsShow' :type='popObj.type' :id='popObj.id' @cancel='cancel_' @success='success'></pop>
       </transition>
  </div>
</template>



<script>
import ToggleForm from "components/ToggleForm";
import * as api from "api/admin/userSystem";
import YuanbenPage from "components/common/YuanbenPage";
import YbPopup from "components/ybpopup/YbPopup";
import pop from "./transferPop";
export default {
  mounted() {
    this.getSubDeptPaging();
    this.getPostPaging();
  },
  methods: {
    addSubmit() {
      this.nameIS = this.add.name.trim() == "" ? true : false;
      if (this.nameIS) {
        this.disabled = false;
        return;
      }
      this.disabled = true;
      if (this.add.type == "directly") {
        api.add_directly(this.add).then(r => {
          if (!r.status) {
            this.$message.error(r.message);
            this.disabled = false;
            return;
          }
          let t = this.add.opt != "add" ? "编辑直属部门" : "添加直属部门";
          this.$message.success(t + "成功！");
          this.addIsShow = false;
          this.getSubDeptPaging();
          this.disabled = false;
        });
      } else {
        api.add_duty(this.add).then(r => {
          if (!r.status) {
            this.$message.error(r.message);
            this.disabled = false;
            return;
          }
          let t = this.add.opt != "add" ? "编辑职务" : "添加职务";
          this.$message.success(t + "成功！");
          this.addIsShow = false;
          this.getPostPaging();
          this.disabled = false;
        });
      }
    },
    add_(type, opt, row) {
      //type:类型，opt:操作类型，row:每一行的信息
      this.add.name = "";
      this.add.remark = "";
      this.add.id = null;
      this.add.type = type;
      this.add.opt = opt;
      this.title = "";
      this.addIsShow = true;
      this.disabled = false;
      this.nameIS = false;
      if (type == "directly") {
        this.title = opt != "add" ? "编辑直属部门" : "添加直属部门";
      } else {
        this.title = opt != "add" ? "编辑职务" : "添加职务";
      }
      if (opt != "add") {
        this.add.name = row.name;
        this.add.remark = row.remark;
        this.add.id = row.id;
      }
    },
    transferChange(type, row) {
      //type:类型，id:
      this.popObj = {
        type: type,
        id: row.id
      };
      this.popIsShow = true;
    },
    cancel_() {
      this.popObj = {
        type: null,
        id: ""
      };
      this.popIsShow = false;
    },
    success(t) {
      this.popIsShow=false;
      if (t == "directly") {
        this.getSubDeptPaging();
      } else {
        this.getPostPaging();
      }
    },
    del(type, row) {
      //type:类型，row:每一行的信息
      let text1 = type == "directly" ? "是否确认删除该直属部门，删除部门成功后会自动清空相应的成员的部门标签？" : "是否确认删除该职务，删除职务成功后会自动清空相应的成员的职务标签？";
      this.$confirm(text1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == "directly") {
            //直属部门
            api.del_directly(row.id).then(r => {
              if (!r.status) {
                this.$message.error(r.message);
                return;
              }
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getSubDeptPaging();
            });
          } else {
            api.del_duty(row.id).then(r => {
              if (!r.status) {
                this.$message.error(r.message);
                return;
              }
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getPostPaging();
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    enableChange(type, enable, row) {
      //type:类型，enable：状态，row:每一行的信息
      let text1 ;
      let text = enable ? "启用" : "禁用";
      if(enable){
        text1 = type == "directly" ? "是否确认启用该直属部门？" : "是否确认启用该职务？";
      }else{
        text1 = type == "directly" ? "是否确认禁用该直属部门，禁用部门成功后会自动清空相应的成员的部门标签？" : "是否确认禁用该职务，禁用职务成功后会自动清空相应的成员的职务标签？";
      }
      this.$confirm(text1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == "directly") {
            //直属部门
            api.getIsEnable_directly(row.id, enable).then(r => {
              if (!r.status) {
                this.$message.error(r.message);
                return;
              }
              this.$message({
                message: text + "成功",
                type: "success"
              });
              this.getSubDeptPaging();
            });
          } else {
            //职务
            api.getIsEnable_duty(row.id, enable).then(r => {
              if (!r.status) {
                this.$message.error(r.message);
                return;
              }
              this.$message({
                message: text + "成功",
                type: "success"
              });
              this.getPostPaging();
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + text
          });
        });
    },
    getSubDeptPaging() {
      this.loading=true
      api.getSubDeptPaging(this.page0.pageNum, this.page0.pageSize).then(r => {
        if (!r.status) {
          this.loading=false
          this.$message.error(r.message);
          return;
        }
        this.page0.total = r.data.total;
        this.directly = r.data.list;
        this.loading=false
      });
    },
    getPostPaging() {
      this.loading1=true
      api.getPostPaging(this.page1.pageNum, this.page1.pageSize).then(r => {
        if (!r.status) {
          this.loading1=false
          this.$message.error(r.message);
          return;
        }
        this.page1.total = r.data.total;
        this.duty = r.data.list;
        this.loading1=false;
      });
    },
    pageSizeChange0(s) {
      if (s !== this.page0.pageSize) {
        this.page0.pageSize = s;
        this.getSubDeptPaging();
      }
    },
    pageSizeChange1(s) {
      if (s !== this.page1.pageSize) {
        this.page1.pageSize = s;
        this.getPostPaging();
      }
    },
    pageCurrentChange0(n) {
      if (n !== this.page0.pageNum) {
        this.page0.pageNum = n;
        this.getSubDeptPaging();
      }
    },
    pageCurrentChange1(n) {
      if (n !== this.page1.pageNum) {
        this.page1.pageNum = n;
        this.getPostPaging();
      }
    }
  },
  components: {
    ToggleForm,
    YuanbenPage,
    pop,
    YbPopup
  },
  data() {
    return {
      directly: [],
      page0: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      duty: [],
      popIsShow: false,
      popObj: {
        type: null,
        id: ""
      },
      page1: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      title: "",
      addIsShow: false,
      add: {
        remark: "",
        name: ""
      },
      nameIS: false,
      disabled: false,
      loading:false,
      loading1:false
    };
  }
};
</script>
<style scoped lang="sass">
.user-box{
  width: 100%;
  height: 100%;
  padding-bottom: 100px;
}
</style>
