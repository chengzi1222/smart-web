<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>企业帐号管理</span>
    </div>
    <ul class="tab-box">
      <li v-for="item in lists" @click="tabChange(item.key)" :key="item.key" :class="state == item.key? 'li-bott':''">
        <div>{{item.name}}
          <span>
            <span v-if="item.num" style="margin-left:20px;">{{item.num}}</span>
          </span>
        </div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div class="ipt-btn-box" style="justify-content:flex-start;">
      <el-input :placeholder="placeholder" class="w300 seekIpt" v-model="searchMap.keysWord" @keyup.enter.native="handleIconClick">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
      </el-input>

      <select-area-grid class="selectHeight" placeholder="分管网格" @change="deptChange"></select-area-grid>

      <enum-select class="selectHeight" v-model="searchMap.onlineStatus" placeholder="状态" enum="com.ybveg.govx.enums.medi.EnterpriseUserStateEnum"
        @change="tabSearch" v-show="state == 'BINDING'"></enum-select>
    </div>
    <div class="tabOffTop50">
      <el-table :border="true" :resizable="true" :data="tableData" @sort-change="sortChange" class="table-div" v-show="state == 'BINDING'">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realName" min-width="50" label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" min-width="80" label="手机号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="100" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realityAddr" min-width="110" label="经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="grid" min-width="100" label="分管网格"></el-table-column>
        <el-table-column show-overflow-tooltip prop="update_time" min-width="110" label="更新时间" sortable='custom'></el-table-column>
        <el-table-column show-overflow-tooltip prop="onlineStatus" min-width="70" label="状态"></el-table-column>
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="relieveBin(scope.row.id,scope.row.seuId)" class="operate-a">解除绑定</a>
            <a href="javascript:;" @click="reBindShow(scope.row)" class="operate-a">重新绑定</a>
            <a href="javascript:;" @click="relievePsw(scope.row.seuId)" class="operate-a">重置密码</a>
          </template>
        </el-table-column>
      </el-table>
      <el-table :border="true" :resizable="true" :data="tableData" @sort-change="sortChange" class="table-div" v-show="state == 'UNBINDING'">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="entityName" min-width="100" label="主体名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="backupNo" min-width="80" label="许可备案号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realityAddr" min-width="110" label="经营地址"></el-table-column>
        <el-table-column show-overflow-tooltip prop="grid" min-width="100" label="分管网格"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showBind(scope.row)" class="operate-a">绑定</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange" :current-page="page.pageNum"
          :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
        </el-pagination>
      </div>
    </div>

    <popupBody v-if="isPopShow" class="mT-50" :top="250" :width="484">
      <p class="popTit">
        <span>{{ popTitle }}</span>
        <span @click="closePop" class="movePoin"><i class="el-icon-close"></i></span>
      </p>
      <div class="contBox">
        <el-form :model="userInfo" :rules="rules" ref="userInfo">
          <el-form-item label="手机号:" label-width="80px" prop="phone">
            <el-input class="w300" v-model="userInfo.phone" auto-complete="off" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="名称:" label-width="80px" prop="realName">
            <el-input class="w300" v-model="userInfo.realName" auto-complete="off" @change="nameChange" :maxlength="100" ></el-input>
          </el-form-item>
        </el-form>
        <div class="poptip">
          {{ tipInfo }}
        </div>
      </div>
      <div class="botBox">
        <el-button type="default" class="w65" @click="closePop">取消</el-button>
        <el-button type="primary" class="w65" @click="saveBind">确定</el-button>
      </div>
    </popupBody>

  </div>
</template>

<script>
  import * as enterprise from "api/medi/enterprise/enterprise";
  import SelectAreaGrid from 'components/common/SelectAreaGrid';
  import EnumSelect from 'components/common/EnumSelect';
  import popupBody from 'components/popup/popupform';

  export default {
    mounted() {
      this.searchMap.entityType = this.$route.params.type.toUpperCase()
      this.entityType = this.$route.params.type.toUpperCase()
      this.init();
    },
    watch: {
      // userInfo: {
      //   handler() {
      //     if (this.isInfoChange) {
      //       this.tipInfo = ""
      //     }
      //     this.isInfoChange = true
      //     if (this.userInfo.phone && this.userInfo.phone.length === 11) {
      //       if (this.userInfo.oldPhone === this.userInfo.phone) {
      //         return
      //       }
      //       this.getUserByPhone()
      //     } else {
      //       this.isDisabled = false
      //     }
      //   },
      //   deep: true
      // }
    },
    methods: {
      getUserByPhone() {
        enterprise.getEUserByPhone(this.userInfo.phone).then(r => {
          if (r.data) {
            this.tipInfo = "提示：系统中已存在手机号为：" + r.data.phone + "的用户" + r.data.realName + "，是否绑定该用户？"
            this.userInfo.realName = r.data.realName
            this.userInfo.userId = r.data.id
            this.isDisabled = true
          } else {
            this.isDisabled = false
            this.userInfo.userId = ""
          }
        })
        this.clearValidate("userInfo")
      },
      nameChange() {
        this.tipInfo = ""
      },
      relieveBin(id,seuId) {
        this.$confirm('是否解除绑定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          enterprise.relieveBin(id,seuId).then(r => {
            this.$message({
              message: "解除绑定成功！",
              type: 'success'
            });
            this.reCount()
          })
        })
      },
      relievePsw(id) {
        this.$confirm('是否重置密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          enterprise.relievePsw(id).then(r => {
            if (r.status) {
              this.$message({
                message: "重置密码成功！",
                type: 'success'
              });
            }
            this.reCount()
          })
        })
      },
      saveBind() {
        this.$refs["userInfo"].validate((valid) => {
          this.userInfo.entityType = this.entityType
          if (valid) {
            //重新绑定
            let msg = ''
            if (this.userInfo.userId) {
              msg = '绑定成功!'
            } else {
              msg = '已添加该手机号用户并绑定企业，用户初始密码为：111111'
            }
            if (this.isReBind) {
              enterprise.rebinding(this.userInfo).then(r => {
                if (r.status) {
                  this.$message({
                    message: msg,
                    type: 'success'
                  });
                  this.reCount()//重新计算
                }
              })
            } else {
              //绑定
              enterprise.binding(this.userInfo).then(r => {
                if (r.status) {
                  this.$message({
                    message: msg,
                    type: 'success'
                  });
                  this.reCount()//重新计算
                }else {
                  this.$message.warning(r.message)
                }
              })
            }
          }
        }, () => {
        })
      },
      reBindShow(data) {
        this.isReBind = true
        this.popTitle = "重新绑定"
        this.tipInfo = ""
        this.isPopShow = true
        this.isDisabled = false
        this.userInfo.userId = data.seuId
        this.userInfo.entityId = data.id
        this.userInfo.oldPhone = data.phone
        this.clearValidate("userInfo")
      },
      showBind(data) {
        this.isInfoChange = false
        this.isReBind = false
        this.popTitle = "绑定"
        this.isDisabled = false
        this.tipInfo = ""

        if (data.corp_mobile !== '' && data.corp_mobile && data.corp_mobile.length === 11 && data.corp_name !== '') {
          this.userInfo.phone = data.corp_mobile
          this.userInfo.realName = data.corp_name
          this.tipInfo = '已从主体档案中获取负责人信息,如信息正确，可直接点击绑定。'
        }

        this.userInfo.entityId = data.id
        this.isPopShow = true
        this.clearValidate("userInfo")
      },
      closePop() {
        this.isPopShow = false
        this.userInfo.oldPhone = ""
        this.userInfo.phone = ""
        this.userInfo.entityId = ""
        this.userInfo.userId = ""
        this.userInfo.realName = ""
        this.clearValidate("userInfo")
      },
      clearValidate(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].clearValidate();
        }
      },
      tabChange(state) {   //点击导航切换样式
        if (state === "BINDING") {
          this.placeholder = "主体名称、许可证号、姓名、手机号"
        } else {
          this.placeholder = "主体名称、许可证号"
        }
        this.state = state;
        this.searchMap.state = state;
        this.tabSearch();
      },
      init() {
        enterprise.getBindingNum(this.entityType).then(r => {
          this.lists = r.data
          this.searchMap.state = this.lists[0].key
          this.tabSearch()
        })
      },
      reCount() {
        enterprise.getBindingNum(this.entityType).then(r => {
          this.lists = r.data
          this.tabSearch()
        })
      },
      sortChange(column) {
        if (column.order == 'ascending') {
          this.searchMap.sort = 'ascending';
        }
        if (column.order == 'descending') {
          this.searchMap.sort = 'descending'
        }
        this.tabSearch();
      },
      deptChange(deptId) {
        this.searchMap.areaCode = !deptId ? "" : deptId[deptId.length - 1];
        this.tabSearch();
      },
      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.tabSearch();
      },
      searchPage() {
        const params = this.searchMap;
        const formData = {
          params: params,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        };
        enterprise.findPage(formData).then((result) => {
          if (result) {
            result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
            this.page.total = result.data.total;
            this.tableData = result.data.list;
          }
        });
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      tabSearch() {
        this.closePop();
        this.page.pageNum = 1;
        this.searchPage();
      },
    },
    components: { SelectAreaGrid, EnumSelect, popupBody },
    data() {
      let checkPhone = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入手机号码'));
        } else if (value != '' && !(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码'));
        } else if (this.userInfo.oldPhone === this.userInfo.phone && this.userInfo.phone !== '') {
          callback(new Error('请勿输入重复的手机号'));
        } else {
          callback();
        }
      };
      return {
        isInfoChange: false,
        placeholder: "主体名称、许可证号、姓名、手机号",
        isReBind: false,
        popTitle: "",
        state: 'BINDING',
        isDisabled: true,
        isPopShow: false,
        tipInfo: "",
        lists: [],
        tableData: [],
        entityType: "",
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        searchMap: {
          state: "BINDING",
          areaCode: "", //网格
          keysWord: "",   //搜索
          sort: "descending",
          onlineStatus: "",
          entityType: "",
        },
        userInfo: {
          phone: "",
          realName: "",
          entityId: "",
          userId: "",
          oldPhone: "",
          entityType: ""
        },
        rules: {
          phone: [
            { validator: checkPhone, trigger: 'change' }
          ],
          realName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        }
      }
    }
  }
</script>

<style scoped lang="sass">
  .tab-box {
    width: 100%;
    display: flex;
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
    justify-content: flex-start;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .tab-box li {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9a9a9a;
    text-align: center;
  }

  .tab-box a {
    color: #9a9a9a;
    width: 100%;
    height: 100%;
    display: inline-block;
  }

  .tab-box a span {
    float: right;
  }

  .tab-box .li-bott {
    border-bottom: 2px solid #0db5ef;
    z-index: 666;
    position: relative;
  }

  .li-bott a {
    color: #393939;
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
    justify-content: flex-start;
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

  table tr td:last-child .cell a {
    border-right: 1px solid #ccc;
    padding-right: 5px;
  }

  table tr td:last-child .cell a:last-child {
    border-right: none;
    padding-right: 0px;
  }

  .poptip {
    color: #ff0000;
    width: 400px;
    margin: 0px auto;
    font-size: 12px;
  }

  .popTit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: rgba(242, 245, 248, 1);
  }

  .popTit span:first-child {
    margin-left: 20px;
    font-size: 14px;
    color: rgba(57, 57, 57, 1);
  }

  .popTit span:last-child {
    float: right;
    margin-right: 10px;
    color: rgba(154, 154, 154, 1);
  }

  .contBox {
    width: 484px;
    margin-top: 20px;
  }

  .contBox .row {
    margin-top: 20px;
  }

  .botBox {
    text-align: right;
    margin-top: 30px;
    padding: 0 40px 0 0;
  }

  .botBox button:first-child {
    background: rgba(246, 247, 248, 1);
    border: 1px solid #C2CAD2;
    color: #393939;
  }
</style>
