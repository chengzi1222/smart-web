<template>
  <div v-if="accountLevel == 3 || accountLevel == 4" class="wrap" >
  <!-- <div class="wrap"> -->
    <div class="page-tilt">
      <b></b>
      <span>预警短信手机号配置</span>
    </div>
    <toggle-form title="监管部门预警手机号配置">
      <div class="box">
        <div v-if="accountLevel == 3" class="area-select">
        <!-- <div class="area-select"> -->
          <el-tree :data="deptTree" :props="deptTreeProps" :node-key="deptTreeKey" :default-expanded-keys="deptTreeExpanded" :highlight-current="true" :expand-on-click-node="false"  @node-expand="deptTreeNodeExpand" @current-change="deptTreeCurrentChange" accordion class="tree-box"></el-tree>
        </div>
        <div :class="accountLevel == 3 ? 'phone-table' : ''">
        <!-- <div class="phone-table"> -->
          <div class="ipt-btn-box">
            <div class="mb20">
              <el-button @click="addPhone" class="w80" type="primary">添加</el-button>
              <div class="ml20" style="display: inline-block">
                当前部门：<span>{{accountLevel == 3 ? dept.deptName : $store.getters.user.deptName}}</span>
              </div>
            </div>
            <el-input placeholder="请输入手机号、姓名" class="w300 seekIpt" v-model="superviseSearch" @keyup.enter.native="searchSupervise()">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchSupervise()"></i>
            </el-input>
          </div>
          <el-table :data="tableDataSupervise" class="table-div mt20" v-loading="tableSuperviseLoad">
            <el-table-column type="index" min-width="120" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="180" label="手机号" prop="phone">
              <template slot-scope="scope">
                <div v-if="!scope.row.isChanging">{{scope.row.phone}}</div>
                <el-input v-else size="small" style="width: 120px" v-model="scope.row.phone" placeholder="请输入手机号" maxlength="11"></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="180" label="姓名" prop="name">
              <template slot-scope="scope">
                <div v-if="!scope.row.isChanging">{{scope.row.name}}</div>
                <el-input v-else size="small" style="width: 120px" v-model="scope.row.name" placeholder="姓名, 10字以内" maxlength="10"></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="180" label="预警开关" prop="ewStatus">
              <template slot-scope="scope">
                <div v-if="!scope.row.isChanging">{{scope.row.ewStatusStr}}</div>
                <el-select v-else v-model="scope.row.ewStatus" class="w180" placeholder="请选择预警开关">
                  <el-option v-for="(ewStatus, index) in ewStatusOptions" :key="index" :label="ewStatus.name" :value="ewStatus.key"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" fixed="right">
              <template slot-scope="scope">
                <a v-if="scope.row.isChanging" href="javascript:;" @click="cancleSupervise(scope.row)" class="operate-a">取消</a>
                <a v-if="scope.row.isChanging" href="javascript:;" @click="saveSupervise(scope.row)" class="operate-a">保存</a>
                <a v-if="!scope.row.isChanging" href="javascript:;" @click="editSupervise(scope.row)" class="operate-a">编辑</a>
                <a v-if="!scope.row.isChanging" href="javascript:;" @click="delSuperVise(scope.row)" class="operate-a">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-box textR mt20">
            <el-pagination background @size-change="supervisePageSizeChange" @current-change="supervisePageCurrentChange"
              :current-page="pageSupervise.pageNum" :page-sizes="[10, 20, 30]" :page-size="pageSupervise.pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="pageSupervise.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </toggle-form>
    <toggle-form title="食品主体预警预留手机号管理" style="padding-bottom: 100px !important;">
      <div style="margin: 20px;">
        <div class="ipt-btn-box">
          <el-button @click="addSubject" class="w80" type="primary" style="display: block">添加</el-button>
          <el-input placeholder="请输入主体名称、联系人、手机号" class="w300 seekIpt mt20" v-model="subjectSearch" @keyup.enter.native="searchSubject()">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchSubject()"></i>
          </el-input>
          <el-select v-model="subjectType" class="w180 ml20" placeholder="请选择主体类型" clearable @change="subjectTypeChange">
            <el-option v-for="(subjectType,index) in subjectTypeOptions" :key="index" :label="subjectType.name" :value="subjectType.key"></el-option>
          </el-select>
          <el-select v-model="ewStatus" class="w180 ml20" placeholder="请选择预警开关" clearable @change="ewStatusChange">
            <el-option v-for="(ewStatus,index) in ewStatusOptions" :key="index" :label="ewStatus.name" :value="ewStatus.key"></el-option>
          </el-select>
        </div>
        <el-table :data="tableDataSubject" class="table-div mt20" v-loading="tableSubjectLoad">
          <el-table-column type="index" min-width="120" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="主体名称" prop="buyerName">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging || isEditing">{{scope.row.buyerName}}</div>
              <el-select v-else v-model="scope.row.buyerName" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="searchLoading" placeholder="请搜索要添加的主体" @change="nameChange(scope.row)">
                <el-option v-for="item in searchOpts" :key="item.entityId" :label="item.buyerName" :value="item.entityId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="手机号" prop="phone">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging">{{scope.row.phone}}</div>
              <el-input v-else v-model="scope.row.phone" placeholder="请输入手机号" maxlength="11"></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="联系人" prop="name">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging">{{scope.row.name}}</div>
              <el-input v-else v-model="scope.row.name" placeholder="请输入联系人"></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="预警开关" prop="ewStatus">
            <template slot-scope="scope">
              <div v-if="!scope.row.isChanging">{{scope.row.ewStatusStr}}</div>
              <el-select v-else v-model="scope.row.ewStatus" class="w180" placeholder="请选择预警开关">
                <el-option v-for="(ewStatus, index) in ewStatusOptions" :key="index" :label="ewStatus.name" :value="ewStatus.key"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" label="地址" prop="address">
            <template slot-scope="scope">
              <div>{{scope.row.address ? scope.row.address : "-"}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <a v-if="scope.row.isChanging" href="javascript:;" @click="cancleSubject(scope.row)" class="operate-a">取消</a>
              <a v-if="scope.row.isChanging" href="javascript:;" @click="saveSubject(scope.row)" class="operate-a">保存</a>
              <a v-if="!scope.row.isChanging" href="javascript:;" @click="editSubject(scope.row)" class="operate-a">编辑</a>
              <a v-if="!scope.row.isChanging" href="javascript:;" @click="delSubject(scope.row)" class="operate-a">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box textR mt20">
          <el-pagination background @size-change="subjectPageSizeChange" @current-change="subjectPageCurrentChange"
            :current-page="pageSubject.pageNum" :page-sizes="[10, 20, 30]" :page-size="pageSubject.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pageSubject.total">
          </el-pagination>
        </div>
      </div>
    </toggle-form>
  </div>
</template>

<script>
import ToggleForm from 'components/ToggleForm'
import * as organizeApi from 'api/support/organize'
import * as msgWarnApi from 'api/xcws/messageWarning'
import {getEnums} from 'api/common'
import qs from 'qs'
/**
 * 手机号正则校验
*/
function checkMobile(phone) {
  let regu =/^[1]([3-9])[0-9]{9}$/
  let re = new RegExp(regu)
  if (re.test(phone)) {
    return true
  }else{
    return false
  }
}

export default {
  components: {
    ToggleForm
  },
  data() {
    return {
      //组织结构的树
      deptTree: [],
      deptTreeProps: {
        label: 'deptName',
        children: 'children'
      },
      deptTreeKey: 'id',
      rootId: '',
      deptTreeExpanded: [],
      //当前的选中的部门
      dept: {},

      accountLevel: null,
      isUpdating: false, // 页面中是否有处于添加/编辑状态的行
      isEditing: false, // 页面中是否有处于编辑状态的行
      tableSuperviseLoad: false,
      tableSubjectLoad: false,
      tableDataSupervise: [],
      tableDataSubject: [],
      superviseSearch: "",
      subjectSearch: "",
      subjectType: "",
      subjectTypeOptions: [],
      ewStatus: "",
      ewStatusOptions: [],
      pageSupervise: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      pageSubject: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      searchLoading: false,
      searchOpts: [],
      setTimeoutId: null
    }
  },
  methods: {
    /**监管部门预警手机号配置*/
    initTreeData(areaCode) {
      let areaCodeCurrent
      if(areaCode.length === 6) { //区级
        areaCodeCurrent = areaCode.slice(0,4)
      }
      organizeApi.getDeptTree({ areaCode: areaCodeCurrent }).then((res) => {
        if(res.data.length > 1) {
          res.data.forEach(item => {
            if(item.areaCode == areaCode) {
              this.deptTree = [item]
            }
          })
        } else { // 街道
          this.deptTree = res.data
        }
        if (this.deptTree.length > 0) {
          //设置当前部门
          this.dept = this.deptTree[0]
          this.getTableSuperviseList()
        }
      })
    },
    //组织结构树的事件
    deptTreeNodeExpand(node) {//部门节点展开事件
      node.children = [];
      if(node.codeLevel >= 4) return // 最多展开到街道一级
      organizeApi.getDeptTree({ areaCode: node.areaCode }).then((results) => {
        node.children = results.data
      })
    },
    //部门节点选中事件
    deptTreeCurrentChange(data) {
      if (this.dept.id == data.id) {//如果还是之前的部门.
        return
      }
      this.dept = data
      this.getTableSuperviseList()
    },
    addPhone() {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次添加/编辑")
        return
      }
      if(this.pageSupervise.total >= 20) {
        this.$message.warning("一个部门最多配置20个手机号码")
        return
      }
      this.isUpdating = true
      this.tableDataSupervise.unshift(
        {
          isChanging: true,
          phone: "",
          name: "",
          ewStatus: null
        }
      )
    },
    searchSupervise() {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      this.pageSupervise.pageNum = 1
      this.getTableSuperviseList()
    },
    cancleSupervise(row) {
      row.isChanging = false
      this.getTableSuperviseList()
    },
    saveSupervise(row) {
      if(!row.phone) {
        this.$message.warning("请输入手机号")
        return
      } else {
        if(row.phone.length !== 11 || !checkMobile(row.phone)) {
          this.$message.warning("请输入正确的手机号")
          return
        }
      }
      if(!row.name) {
        this.$message.warning("请输入姓名")
        return
      }
      this.superviseConfigUpdate(row)
    },
    editSupervise(row) {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      row.isChanging = true
      this.isUpdating = true
    },
    delSuperVise(row) {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      this.$confirm('是否确认删除该手机号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        msgWarnApi.delPhone({id: row.id}).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success("删除成功")
            this.getTableSuperviseList()
          }
          row.isChanging = false
        }).catch(err => {})
      })
    },
    superviseConfigUpdate(row) {
      if(!row.id) { // 添加
        let addParams = {
          phone: row.phone,
          name: row.name,
          entityId: this.dept.id ? this.dept.id : this.$store.getters.user.regionCode,
          ewStatus: row.ewStatus,
          applyType: 'SUPERVISION',
          regionId: this.dept.areaCode
        }
        msgWarnApi.addPhone(qs.stringify(addParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('添加成功')
            row.isChanging = false
            this.getTableSuperviseList()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {})
      } else { // 编辑
        let updateParams = {
          id: row.id,
          name: row.name,
          phone: row.phone,
          ewStatus: row.ewStatus
        }
        msgWarnApi.updatePhone(qs.stringify(updateParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('编辑成功')
            row.isChanging = false
            this.getTableSuperviseList()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {})
      }
    },
    getTableSuperviseList() {
      let superviseParams = {
        current: this.pageSupervise.pageNum,
        size: this.pageSupervise.pageSize,
        regionId: this.dept.areaCode,
        keyword: this.superviseSearch,
        ewStatus: '',
        buyerType: ''
      }
      this.tableSuperviseLoad = true
      msgWarnApi.getSupervisionPhoneList(qs.stringify(superviseParams)).then(res => {
        if(res.status) {
          let data = res.data
          this.pageSupervise.total = data.total
          data.records.forEach(item => {
            item.isChanging = false
          })
          this.tableDataSupervise = data.records
        }
        this.tableSuperviseLoad = false
        this.isUpdating = false 
      }).catch(err => {})
    },
    supervisePageSizeChange(size) {
      this.pageSupervise.pageNum = 1
      this.pageSupervise.pageSize = size
      this.getTableSuperviseList()
    },
    supervisePageCurrentChange(num) {
      this.pageSupervise.pageNum = num
      this.getTableSuperviseList()
    },

    /**食品主体预警预留手机号管理*/
    addSubject() {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次添加/编辑")
        return
      }
      this.isUpdating = true
      this.tableDataSubject.unshift({
        isChanging: true,
        buyerName: "",
        phone: "",
        name: "",
        ewStatus: "",
        address: ""
      })
    },
    searchSubject() {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      this.pageSubject.pageNum = 1
      this.getTableSubjectList()
    },
    subjectTypeChange() {
      this.getTableSubjectList()
    },
    ewStatusChange() {
      this.getTableSubjectList()
    },
    // 输入搜索主体
    remoteMethod(text) {
      clearTimeout(this.setTimeoutId);
      this.searchLoading = true;
      if (text != '' && text.length > 0) {
        this.loading = false;
        this.setTimeoutId = setTimeout(() => {
          msgWarnApi.getAreaSubList({name: text}).then(res => {
            this.searchOpts = res.data
            this.searchLoading = false;
          })
        }, 200);
      } else {
        this.searchLoading = false;
        this.searchOpts = [];
      }
    },
    nameChange(row) {
      this.searchOpts.forEach(item => {
        if(item.entityId === row.buyerName) {
          row.address = item.address
          row.phone = item.tel
          row.name = item.legalPerson
          row.ewStatus = 'OFF'
          row.buyerName = item.buyerName
          row.regionId = item.areaId
          row.entityId = item.entityId
        }
      })
    },
    cancleSubject(row) {
      row.isChanging = false
      this.getTableSubjectList()
    },
    saveSubject(row) {
      if(!row.buyerName) {
        this.$message.warning("请选择主体名称")
        return
      }
      if(!row.phone) {
        this.$message.warning("请输入手机号")
        return
      } else {
        if(row.phone.length !== 11 || !checkMobile(row.phone)) {
          this.$message.warning("请输入正确的手机号")
          return
        }
      }
      if(!row.name) {
        this.$message.warning("请输入联系人")
        return
      }
      if(!row.ewStatus) {
        this.$message.warning("请选择预警开关")
        return
      }
      this.subjectConfigUpdate(row)
    },
    editSubject(row) {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      this.isEditing = true
      row.isChanging = true
      this.isUpdating = true
    },
    delSubject(row) {
      if(this.isUpdating) {
        this.$message.warning("请先保存上一次的添加/编辑")
        return
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        msgWarnApi.delPhone({id: row.id}).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success("删除成功")
            this.getTableSubjectList()
          } else {
            this.$message.warning(res.message)
          }
          row.isChanging = false
        }).catch(err => {})
      })
    },
    
    subjectConfigUpdate(row) {
      if(!row.id) { // 添加
        let addParams = {
          phone: row.phone,
          name: row.name,
          entityId: row.entityId,
          ewStatus: row.ewStatus,
          applyType: 'ENTITY',
          regionId: row.regionId
        }
        msgWarnApi.addPhone(qs.stringify(addParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('添加成功')
            row.isChanging = false
            this.getTableSubjectList()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(err => {})
      } else { // 编辑
        let updateParams = {
          id: row.id,
          name: row.name,
          phone: row.phone,
          ewStatus: row.ewStatus
        }
        msgWarnApi.updatePhone(qs.stringify(updateParams)).then(res => {
          if(res.status && res.code == 200) {
            this.$message.success('编辑成功')
            row.isChanging = false
            this.getTableSubjectList()
          } else {
            this.isUpdating = true
            this.$message.warning(res.message)
          }
        }).catch(err => {})
      }
    },
    getTableSubjectList() {
      let subjectParams = {
        current: this.pageSubject.pageNum,
        size: this.pageSubject.pageSize,
        keyword: this.subjectSearch,
        ewStatus: this.ewStatus,
        buyerType: this.subjectType
      }
      this.tableSubjectLoad = true
      msgWarnApi.getEntityPhoneList(qs.stringify(subjectParams)).then(res => {
        if(res.status) {
          let data = res.data
          this.pageSubject.total = data.total
          data.records.forEach(item => {
            item.isChanging = false
          })
          this.tableDataSubject = data.records
        }
        this.isEditing = false
        this.isUpdating = false 
        this.tableSubjectLoad = false
      }).catch(err => {})
    },
    subjectPageSizeChange(size) {
      this.pageSubject.pageNum = 1
      this.pageSubject.pageSize = size
      this.getTableSubjectList()
    },
    subjectPageCurrentChange(num) {
      this.pageSubject.pageNum = num
      this.getTableSubjectList()
    },
  },

  mounted() {
    this.accountLevel = this.$store.getters.mapCenter.level
    getEnums(['com.ybveg.govx.ewcenter.enums.NoteEWStatusEnum'],false).then((r) => {
      this.ewStatusOptions = r.data
    });
    // getEnums(['com.ybveg.govx.ewcenter.enums.HandleDeptEnum'],false).then((r) => {
    //   console.log(r.data)
    // });
    getEnums(['com.ybveg.govx.enums.food.licaibao.BuyerTypeEnum'],false).then((r) => {
      this.subjectTypeOptions = r.data
    });
    if (this.$store.getters.user.areaCode) {
      this.initTreeData(this.$store.getters.user.areaCode)
    }
    this.getTableSubjectList()
  },
  watch: {
    '$store.getters.user.areaCode'() {
      if (this.$store.getters.user.areaCode) {
        this.initTreeData(this.$store.getters.user.areaCode)
      }
    },
    '$store.getters.mapCenter.level'() {
      if (this.$store.getters.mapCenter.level) {
        this.accountLevel = this.$store.getters.mapCenter.level
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .operate-a {
    color: #1787ad;
  }
  .clearfix:after{
    content: "";
    display: block;
    height: 0;
    clear:both;
    visibility: hidden;
  }
  .box{
    margin: 20px;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .area-select {
      width: 400px;
      height: 100%;
      .tree-box {
        padding: 20px;
        box-sizing: border-box;
        border: none;
        background: #f2f5f8;
        height: 700px;
        overflow-y: auto;
      }
    }
    .phone-table {
      width: calc(100% - 420px);
      border-left: 1px solid #edf0f3;
      border-top-left-radius: 1px;
      border-bottom-left-radius: 1px;
      box-sizing: border-box;
      padding-left: 20px;
      margin-left: 20px;
    }
  }
</style>