<template>
  <!-- treetable的测试例子 -->
  <div class="hello">

    <div class="page-tilt">
      <b></b>
      <span>菜单管理</span>
    </div>
    <div class="big-box">
      <div style="width: 100%;">
        <div class="ipt-btn-box">
          <div>
          </div>
          <div>
            <el-button type="primary"
                       @click="isShow = true; menu.id = ''; menu.name = ''; menu.route = ''; menu.sort=''; menu.icon='';">
              <i class="el-icon-plus el-icon--left"></i>菜单添加
            </el-button>

            <!--添加弹窗-->
            <transition name="dialog-fade">
              <popupBody class="popup-body" v-if="isShow">
                <!-- 功能模块添加到这一区域 -->
                <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close"
                   @click="isShow = false"></i>
                <div class="form-item">
                  <span class="input-t">菜单名称:</span>
                  <el-input placeholder="请输入菜单名" v-model="menu.name" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">路由名称:</span>
                  <el-input placeholder="请输入路由名" v-model="menu.route" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">菜单顺序:</span>
                  <el-input placeholder="请输入菜单顺序" v-model="menu.sort" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">菜单icon:</span>
                  <el-input placeholder="请输入菜单icon" v-model="menu.icon" class="w200"></el-input>
                </div>
                <div class="form-btn">
                  <el-button @click="isShow = false">取消</el-button>
                  <el-button type="primary" @click="addMenu">确定</el-button>
                </div>
              </popupBody>
            </transition>

            <!--编辑弹窗-->
            <transition name="dialog-fade">
              <popupBody class="popup-body" v-if="isShowEdit">
                <!-- 功能模块添加到这一区域 -->
                <i class="popup-hide movePoin el-dialog__close el-icon el-icon-close"
                   @click="isShowEdit = false"></i>
                <div class="form-item">
                  <span class="input-t">菜单名称:</span>
                  <el-input placeholder="请输入菜单名" v-model="menu.name" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">路由名称:</span>
                  <el-input placeholder="请输入路由名" v-model="menu.route" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">菜单顺序:</span>
                  <el-input placeholder="请输入菜单顺序" v-model="menu.sort" class="w200"></el-input>
                </div>
                <div class="form-item">
                  <span class="input-t">菜单icon:</span>
                  <el-input placeholder="请输入菜单icon" v-model="menu.icon" class="w200"></el-input>
                </div>
                <div class="form-btn">
                  <el-button @click="isShowEdit = false">取消</el-button>
                  <el-button type="primary" @click="editMenu">确定</el-button>
                </div>
              </popupBody>
            </transition>
          </div>
        </div>

        <tree-grid :columns="columns" :tree-structure="true"
                   :showOption="showOption"
                   :data-source="menuTableData" :buttons="buttons" :handleData="handleData"
                   class="menu-tree">
        </tree-grid>

        <div class="block" style="float: right; margin-top: 15px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pagination.pageNum" :page-sizes="[8, 10, 15]"
                         :page-size="pagination.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import TreeGrid from "components/TreeGrid";
import qs from "qs";
import http from "utils/http";
import popupBody from "components/popup/popupdata";
import Utils from "utils/dataTranslate.js";

import * as moduleApi from "api/admin/module";
import * as menuApi from "api/admin/menu";

export default {
  async beforeMount() {
    //真实情况调用接口请求

    let response = await menuApi.page(this.page);
    let list = response.data.list;

    //处理数据
    this.handleData(list);

    this.menuTableData = list;
    this.pagination.total = response.data.total;
  },
  data() {
    return {
      handleData: function(dataArr = []) {
        //处理数据
        for (let item of dataArr) {
          //判断是否子数据
          if (!item.leaf) {
            item.isHasChildren = !item.leaf;
            item.url = "admin/menu/list";
            item.ajaxHttp = function() {
              let data = qs.stringify({ pid: item.id });
              return http({
                method: "post",
                url: "admin/menu/list",
                data
              });
            };
          }
        }
      },
      //点击添加子菜单后返回的信息
      addMenuInfo: {},
      // 列字段
      columns: [
        { text: "菜单名称", dataIndex: "name" },
        { text: "路由名称", dataIndex: "route" },
        { text: "菜单等级", dataIndex: "level" },
        { text: "菜单顺序", dataIndex: "sort" },
        { text: "权限代码", dataIndex: "authCode" },
        { text: "菜单icon", dataIndex: "icon" },
        { text: "创建时间", dataIndex: "createTime" }
      ],

      //弹出层控制
      isShow: false,
      isShowEdit: false,
      isShowModule: false,

      //表数据
      menuTableData: [],
      page: {
        keyword: "{}",
        pageNum: 1,
        pageSize: 8
      }, //后端分页
      pagination: {
        pageNum: 1,
        pageSize: 8
      },
      showOption: {
        //控制行内编辑
        id: 0,
        exclude: ["createTime", "level"],
        open: true
      },
      // 操作按钮
      buttons: [
        {
          text: "删除",
          type: "danger",
          event: (currentTrData, index, dataArr, scope) => {
            /**
               先删除数据数组中的，再删除父亲上挂载的自己的信息。
               */
            this.$confirm("要删除该条数据吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                //es6 map赋值
                let { id, leaf, parentId, path } = currentTrData;
                let menu = { id, leaf, parentId, path };

                menuApi.delMenu(menu).then(result => {
                  if (result.status) {
                    //获取需要删除的子元素个数
                    let len = scope._self.DelLen(currentTrData);
                    dataArr.splice(index, 1 + len);

                    // 如果被删除的父亲存在，且父亲的子存在，在父亲中找到自己并删除
                    if (
                      currentTrData._parent &&
                      currentTrData._parent.children
                    ) {
                      let parent_children = currentTrData._parent.children;
                      for (var i in parent_children) {
                        if (parent_children[i] == currentTrData) {
                          parent_children.splice(i, 1);
                        }
                        //如果父亲的子元素被删除完，去掉父亲的展开按钮
                        if (!parent_children.length) {
                          currentTrData._parent.isHasChildren = false;
                        }
                      }
                    }
                  }
                });
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          }
        },

        {
          text: "编辑",
          type: "default",
          event: (currentTrData, index, data, scop) => {
            this.menu.id = currentTrData.id;
            this.menu.name = currentTrData.name;
            this.menu.route = currentTrData.route;
            this.menu.sort = currentTrData.sort;
            this.menu.icon = currentTrData.icon;
            this.menu.authCode = currentTrData.authCode

            if (this.showOption != undefined && this.showOption.open) {
              if (this.showOption.id == currentTrData.id) {
                this.showOption.id = -1;
                this.editMenu();
              } else {
                this.showOption.id = currentTrData.id;
              }
            } else {
              this.isShowEdit = true;
            }
          }
        },
        {
          //增加同理，加在数组中，并且还要写进父亲children的信息里
          text: "添加子菜单",
          type: "success",
          show: currentTrData => {
            if (currentTrData.level >= 3) {
              return false;
            }
            return true;
          },
          event: (currentTrData, index, data) => {
            this.isShow = true;
            this.addMenuInfo = {
              currentTrData,
              index,
              data
            };
            this.menu.id = "";
            this.menu.name = "";
            this.menu.route = "";
            this.menu.sort = "";
            this.menu.icon = "";
            this.menu.parentId = currentTrData.id;
            // {{}}
          }
        }
      ],
      selectMenuId: "",
      menu: {
        name:'',
        route:'',
        icon:'',
        sort:''
      },

      //穿梭框
      search1: "",
      search2: "",
      transferData_left: [],
      transferData_right: [],
      //可以在回调函数中进行提交操作以及数据操作。
      callback: function() {
        console.log(this.transferData_left);
        console.log(this.transferData_right);
      }
    };
  },
  methods: {
    //分页方法
    //分页方法 siez
    handleSizeChange(val) {
      this.page.pageSize = val;
      menuApi.page(this.page).then(result => {
        let list = result.data.list;

        //处理数据
        this.handleData(list);

        this.menuTableData = list;
        this.pagination.total = result.data.total;
        this.pagination.pageSize = val;
      });
    },
    //分页方法 num
    handleCurrentChange(val) {
      this.page.pageNum = val;
      menuApi.page(this.page).then(result => {
        let list = result.data.list;

        //处理数据
        this.handleData(list);

        this.menuTableData = list;
        this.pagination.total = result.data.total;
        this.pagination.pageNum = val;
      });
    },

    //添加菜单
    addMenu() {
      menuApi.addMenu(this.menu).then(result => {
        if (result.status) {
          this.isShow = false;
          // {{}}
          //把新加的数据转换结构
          let newdata = [];
          newdata.push(result.data);
          let addData = Utils.MSDataTransfer.treeToArray(
            newdata,
            this.addMenuInfo.currentTrData,
            this.addMenuInfo.currentTrData._level,
            false
          );
          //新数据加入的数组中去
          this.addMenuInfo.data.splice(
            this.addMenuInfo.index + 1,
            0,
            addData[0]
          );
          // 如果当前行没有children这个属性的话就添加一个children属性,并且显示有子
          if (!this.addMenuInfo.currentTrData.hasOwnProperty("children")) {
            this.addMenuInfo.currentTrData.children = [];
          }
          this.addMenuInfo.currentTrData.isHasChildren = true;
          //在父元素中添加新添加的元素
          this.addMenuInfo.currentTrData.children.push(addData[0]);
        }
      });
    },

    //编辑菜单
    editMenu() {
      menuApi.editMenu(this.menu).then(result => {
        if (result.status) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.isShowEdit = false;
        } else {
          this.$message({
            message: "修改失败",
            type: "error"
          });
        }
      });
    }
  },
  components: {
    TreeGrid,
    popupBody
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.form-item {
  text-align: center;
}

.tree-box {
  border: none;
  background: #f2f5f8;
  height: 82%;
  overflow-y: scroll;
}

.big-box {
  display: flex;
  margin-top: 20px;
  min-height: 600px;
  padding-right: 20px;
}

.tree-div {
  min-width: 220px;
  margin-right: 20px;
  border-right: 1px solid #ccc;
  background: #f2f5f8;
}

.area-name {
  padding: 10px;
  background: #e7edf4;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #495669;
  line-height: 26px;
}

.area-name button {
  background: #ffffff;
  border: 1px solid #c2cad2;
  width: 26px;
  height: 26px;
  color: #a2aab6;
  text-align: center;
}

.ipt-div {
  border: 1px solid #ccc;
  margin: 10px;
  height: 34px;
  line-height: 34px;
  background: #fff;
}

.ipt-div i {
  margin: 0 10px 0 13px;
  color: #c5cfd9;
}

.ipt-div input {
  border: none;
  outline: none;
}

.box-tit {
  margin: 20px 0 10px 0;
  color: #393939;
}

.box-tit span {
  font-size: 18px;
}

.box-tit button {
  background: #f6f7f8;
  border: 1px solid #c2cad2;
  height: 28px;
  width: 88px;
  font-size: 14px;
  margin-left: 13px;
}

.tab-box {
  width: 100%;
  display: flex;
  position: relative;
}

.tab-box li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  font-size: 15px;
  color: #9a9a9a;
  text-align: center;
}

.tab-box .li-bott {
  border-bottom: 2px solid #0db5ef;
  z-index: 1;
  position: relative;
}

.li-bott span {
  color: #393939;
}

.tab-box .tab-bott {
  width: 100%;
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #ebf1f5;
}

.ipt-btn-box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}

.typeWidth {
  width: 150px;
  margin-right: 20px;
}

.pagination-box {
  text-align: right;
  margin-top: 20px;
}

.table-div {
  width: 100%;
  text-align: center;
}

.operate-a {
  color: #1787ad;
}

.center-border {
  display: inline-block;
  width: 3px;
  border-right: 1px solid #ccc;
  height: 12px;
  margin: 0 8px 0 5px;
}

/*popup start*/
.popup-hide {
  position: absolute;
  top: 10px;
  right: 20px;
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

/*popup end*/

/*transfer start*/
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>

<style lang="sass">
/* 全局的css */
/* 修改treetable表格中按钮的样子 */
.menu-tree .el-button--danger,
.menu-tree .el-button--default:nth-child(2) {
  width: 44px;
}

.menu-tree .el-button--default:nth-child(3) {
  width: 68px;
}

.menu-tree .el-button--success {
  width: 80px;
}
</style>
