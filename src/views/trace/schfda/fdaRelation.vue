<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>学校监管</span>
    </div>
    <div class="big-box mb90">

      <div class="tree-div">
        <div class="area-name">
          <span>行政区域</span>

        </div>
        <!--部门树-->
        <el-tree :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 :highlight-current="true"
                 :default-expanded-keys="expandDeptId"
                 accordion
                 @node-click="handleNodeClick" class="tree-box"></el-tree>
      </div>

      <div style="width:calc(100% - 240px)">
        <div class="box-tit">
          <span>所选区域： {{treeCurrentNodeData.label}}</span>
          <!--<button>编辑</button>-->
        </div>

        <div class="ipt-btn-box">
          <div class="clear_a">
            <el-input placeholder="请输入学校名称、联系人、联系电话" class="w300 seekIpt" v-model="search.searchWord" @keyup.enter.native="seekEnter">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
            </el-input>
            <el-select clearable class="selectHeight w150" v-model="search.binded" placeholder="是否已纳入监管" @change="handleIconClick">
              <el-option v-for="item in bindedList" :key="item.binded" :label="item.bindedName" :value="item.binded">
              </el-option>
            </el-select>
            <el-select clearable class="selectHeight w150" v-model="search.buyerTypes" placeholder="学校类型" @change="handleIconClick">
              <el-option v-for="item in buyerTypeList" :key="item.buyerType" :label="item.buyerTypeName" :value="item.buyerType">
              </el-option>
            </el-select>
            <el-select clearable class="selectHeight w150" v-model="search.scTypes" placeholder="办学性质" @change="handleIconClick">
              <el-option v-for="item in scTypeList" :key="item.scType" :label="item.scTypeName" :value="item.scType">
              </el-option>
            </el-select>
          </div>
        </div>
        <div  style="position: relative;">
          <div v-if="loadings" style="position: absolute;top: 0;left: 0;bottom: 0;right: 0;z-index: 99;text-align: center;background-color: rgba(0,0,0,.1);">
                  <span style="position: absolute;top: 50%;margin-top: -30px;">
                      <i class="icon el-icon-loading" style="font-size: 40px;"></i>
                  </span>
          </div>
        <el-table :data="buyerFdaData" v-loading="loading" element-loading-text="正在进行监管操作">
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
            <el-table-column label="所属食药所" prop="townDeptName" show-overflow-tooltip>
            </el-table-column>
          <el-table-column label="学校名称" prop="buyerName" show-overflow-tooltip >
          </el-table-column>
          <el-table-column label="学校地址" prop="address" show-overflow-tooltip>
          </el-table-column>

          <el-table-column label="联系人" prop="legalPerson" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="联系电话" prop="tel" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" :width="200">
            <template slot-scope="scope">
              <span v-if="isTownFdaDept" >
                <el-checkbox :checked="scope.row.checked" :key="scope.row.buyerMainCode" @change="checkBoxChange(scope.row)">纳入监管</el-checkbox> <!-- 添加一个多选框,控制选中与否 -->
              </span>
              <span v-if="!isTownFdaDept">
                <span v-if="scope.row.binded == 'TRUE'" style="color:#00CD00">
                  已纳入监管
                </span>
                <span v-if="scope.row.binded == 'FALSE'" style="color:red">
                  未纳入监管
                </span>
              </span>
            </template>
          </el-table-column>
        </el-table>
          <div class="pagination-box mb20">
            <el-pagination background :page-sizes="[10, 20, 30, 40, 50]" :page-size="page.pageSize" :current-page="page.pageNum" :total="page.total" layout="total, sizes, prev, pager, next, jumper" @current-change="pagecCurrentChange" @size-change="pageSizeChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import popupBody from 'components/popup/popupdata';
  import transfer from 'components/transfer/transfer';
  import * as api from 'api/trace/fdaRelation'

  export default {
    mounted() {
      // 加载左侧部门树
      api.deptree("").then(r=>{
        this.treeData = r.data;
        if (this.treeData && this.treeData.length >0) {
          // 设置默认的显示的所选区域字符串
          this.treeCurrentNodeData = this.treeData[0];
          // 设置默认展开的部门id
          this.expandDeptId.push(this.treeData[0].id);
          this.search.tobAreaCode = this.treeCurrentNodeData.tob_area_code;
          if (this.treeCurrentNodeData.area_code.length == 10) {
            this.selectDeptId = this.treeCurrentNodeData.id;
            this.search.townAreaCode =  this.treeCurrentNodeData.area_code;
          } else {
            this.search.townAreaCode = "";
          }
          // 分页查询
          this.getPage();
          // console.log(this.expandDeptId);
        }
      });
    },
    methods: {
      // 部门树被点击
      handleNodeClick(data) {
        this.selectDeptId = data.id;
        this.selectDeptCode = data.area_code;
        this.treeCurrentNodeData = data;
        this.search.tobAreaCode = data.tob_area_code;
        // 当前点击的部门是食药所
        if (data.area_code && data.area_code.length == 10) {
          this.isTownFdaDept = true;
          this.search.townAreaCode = data.area_code;
        } else {
          this.isTownFdaDept = false;
          this.search.townAreaCode = "";
        }
        this.page.pageNum = 1;
        this.getPage();
      },
      getPage() {
        api.schoolTypeList().then(r=>{
          console.log(r);
        });
        this.loadings = true;
        let pageData = {
          pageNumber: this.page.pageNum,
          pageSize: this.page.pageSize,
          searchWord: this.search.searchWord,
          townAreaCode: this.search.townAreaCode,
          tobAreaCode: this.search.tobAreaCode,
          buyerTypes: this.search.buyerTypes,
          scTypes: this.search.scTypes,
          binded: this.search.binded
        };
        api.listBuyerFdaPage(pageData).then(r=>{
          this.loadings = false;
          if (r.data) {
            this.page.total = r.data.pageObj.totalRecords | 0;
            if (r.data.data) {
              this.buyerFdaData = r.data.data;
              this.setCheckBox();
            }
          }
          // console.log(r);
        });
      },
      setCheckBox() {
        this.buyerFdaData.forEach(item=>{
          if (item.binded == 'TRUE') {
            item.checked = true;
          } else {
            item.checked = false;
          }
          item.show = true;
        });
      },
      checkBoxChange(val){
        val.checked = !val.checked;
        this.loading = true;
        // console.log(val);
        // let zz = new FormData();
        // relationDto.append("buyerGuid",val.guid);
        // relationDto.append("buyerMainCode",val.buyerMainCode);
        // relationDto.append("binded", val.checked ? "YES" : "FALSE");
        // relationDto.append("buyerType", val.buyerType);
        // relationDto.append("scType", val.scType);
        // relationDto.append("state", val.state);
        // relationDto.append("townFdaDeptId", this.selectDeptId);
        // relationDto.append("townAreaCode", this.search.townAreaCode);
        let relationDto = {
          buyerGuid: val.guid,
          buyerMainCode: val.buyerMainCode,
          binded: val.checked ? "YES" : "NO",
          buyerType: val.buyerType,
          scType: val.scType,
          townDeptId: this.selectDeptId,
          townAreaCode: this.search.townAreaCode,
          townDeptName: this.treeCurrentNodeData.label,
          countyAreaCode: this.treeCurrentNodeData.parent_code,
          countyDeptId: this.treeCurrentNodeData.parent_id,
          countyDeptName: this.treeCurrentNodeData.parent_name,
          cityDeptId: this.treeCurrentNodeData.grand_id,
          cityAreaCode: this.treeCurrentNodeData.grand_code,
          cityDeptName: this.treeCurrentNodeData.grand_name,
          streetAreaId: this.treeCurrentNodeData.region_code,
          townDeptState: 'YES',
          createUser: this.$store.state.common.user.id
        };
        if (val.checked) {
            // 添加关联
          api.addRelation(relationDto).then(r=>{
            if (r.status) {
                if (r.data.state) {
                } else {
                    this.$message({
                        message: "纳入监管失败！原因：" + r.data.msg,
                        type: 'error'
                    });
                }
            } else {
              this.$message({
                message: "纳入监管失败！原因：" + r.message,
                type: 'error'
              });
            }
            this.getPage();
            this.loading = false;
          }).catch(t =>{
            this.loading = false;
            this.$message({
              message: "纳入监管失败！原因：" + r.message,
              type: 'error'
            });
          });
        } else if (!val.checked) {
           // 删除关联
          api.deleteRelation(val.guid).then(r=>{
            if (r.status) {
                if (r.data.state) {
                } else {
                    this.$message({
                        message: "取消监管失败",
                        type: 'error'
                    });
                }
            } else {
              this.$message({
                message: "取消监管失败！",
                type: 'error'
              });
            }
            this.getPage();
            this.loading = false;
          }).catch(t =>{
            this.loading = false;
          });

        } else {
          this.loading = false;
        }
      },
      handleSelectionChange (row) {
        this.buyerFdaData.forEach(item => {
          // 排他,每次选择时把其他选项都清除
          if (item.buyerMainCode !== row.buyerMainCode) {
            item.checked = false
          }
        })
      },
      //搜索框搜索
      seekEnter(_e) {
        let event = _e ? _e : window.event;
        if (event.keyCode == 13) {
          this.page.pageNum = 1;
          this.getPage();
        } else {

        }
      },
      handleIconClick() {	//搜索框按钮点击搜索
        this.page.pageNum = 1;
        this.getPage();
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.getPage();
      },
      pageSizeChange(pageSize) {
        this.page.pageSize = pageSize;
        this.page.pageNum = 1;
        this.getPage();
      },
    },
    components: {
      popupBody,
      transfer
    },
    data() {
      return {
        loading:false,
        search: {
          binded: '',
          searchWord: "",   //搜索
          tobAreaCode: '',
          townAreaCode: '',
          buyerTypes: "", //学校类型
          scTypes: ""//办学性质
        },
        loadings: true,
        selectDeptId: '',
        selectDeptCode: '',
        isTownFdaDept: false,
        treeData: [],
        expandDeptId: [],
        bindedList: [
          {
            binded: 'YES',
            bindedName: '已纳入监管'
          },
          {
            binded: 'NO',
            bindedName: '未纳入监管'
          }
        ],
        scTypeList: [
          {
            scType: 'PUBLIC',
            scTypeName: '公立'
          },
          {
            scType: 'PRIVATE',
            scTypeName: '私立'
          },
          {
            scType: 'OTHER',
            scTypeName: '其他'
          }
        ],
        buyerTypeList:  [
            {
              buyerType: 'KINDSC',
              buyerTypeName: '幼儿园'
            },
            {
              buyerType: 'PRISC',
              buyerTypeName: '小学'
            },
            {
              buyerType: 'MIDSC',
              buyerTypeName: '初中'
            },
            {
              buyerType: 'HIGSC',
              buyerTypeName: '高中'
            },
            {
              buyerType: 'UNVSC',
              buyerTypeName: '大学'
            },
          ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //当前选中节点的区域
        treeCurrentNodeData: {},
        a: false,
        page: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
        },
        bindRadio: '',
        //用户
        buyerFdaData: []
      };
    }
  }
</script>

<style scoped lang="sass">
  .popup-hide {
    position: absolute;
    top: 10px;
    right: 20px;
  }

  .tree-box {
    border: none;
    background: #f2f5f8;
    max-height: 83%;
    overflow-y: scroll;
    margin-top: 10px;
  }

  .big-box {
    display: flex;
    margin-top: 20px;
    min-height: 600px;
    border: 1px solid #ccc;
    padding-right: 20px;
  }

  .tree-div {
    width: 360px;
    min-height: 650px;
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

  .area-name .add-btn {
    background: #ffffff;
    border: 1px solid #c2cad2;
    width: 26px;
    height: 26px;
    color: #a2aab6;
    text-align: center;
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
  .re{
    padding-bottom:20px;
    padding-top: 10px;
    position: relative;
  }
  .reDiv{
    position: absolute;
    bottom: 0;
    color: red;
  }
</style>
