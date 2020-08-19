<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>学校汇总</span>
    </div>
    <div class="user-box">
      <div class="ipt-btn-box" style="justify-content: end;">
        <el-input placeholder="学校名称、营业执照、许可证号" class="w250 seekIpt" v-model="condition.keyword"
          @keyup.enter.native="handleIconClick">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
        </el-input>

        <enum-select class="selectHeight" v-model="condition.buyerType" placeholder="学校类型"
          enum="com.ybveg.govx.enums.sub.RestaurantSuperviseTypeEnum" @change="searchTab"></enum-select>

        <enum-select class="selectHeight" v-model="condition.scType" placeholder="公立私立"
          enum="com.ybveg.govx.enums.sub.GuardSchoolPropEnum" @change="searchTab"></enum-select>

        <el-cascader class="selectHeight" clearable :change-on-select="true" :options="options" @change="areaChange"
          :props="props"></el-cascader>
      </div>
      <div class="tabOffTop120">
        <el-table v-loading="loading" element-loading-text="数据正在努力加载中" :border="true" :resizable="true"
          :data="tableData" class="table-div" :class="shadowShow?'shadowNo':''">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="buyerName" min-width="190" label="学校名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="togCreditCode" min-width="120" label="营业执照"></el-table-column>
          <el-table-column show-overflow-tooltip prop="togLicense" min-width="120" label="许可证号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="areaName" min-width="100" label="所属区县"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" min-width="100" label="量化等级">
            <template slot-scope="scope">
              <span>{{ scope.row.qualityLevel}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="legalPerson" min-width="100" label="负责人"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" min-width="120" label="学校类型">
            <template slot-scope="scope">
              <span>{{ buyerTypeMapping[scope.row.buyerType]}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" min-width="140" label="公立私立">
            <template slot-scope="scope">
              <span>{{ scTypeMapping[scope.row.scType]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" v-if="scope.row.togId" @click="view(scope.row.togId, scope.row.togEntityType)"
                class="operate-a">主体档案</a>
              <router-link v-if="XCWSOpenSecret!=''&& XCWSOpenSecret!=null"
                :to="{path:'/schoolTrace/license' ,query:{'entityId':scope.row.guid,'XCWSOpenSecret':XCWSOpenSecret,'buyerName':scope.row.buyerName}}"
                target="_blank">
                <span class="operate-a">校餐公示</span>
              </router-link>
              <a href="javascript:;" @click="handleAssess(scope.row)" class="operate-a">等级评定</a>
              <a href="javascript:;" @click="qrCode(scope.row)" class="operate-a">二维码</a>
            </template>
          </el-table-column>

        </el-table>
        <div class="pagination-box">
          <el-pagination background @size-change="pageSizeChange" @current-change="pagecCurrentChange"
            :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="page.total">
          </el-pagination>
        </div>
      </div>
      <!-- 二维码 -->
      <el-dialog class="qrCode-dialog" :visible.sync="qrCodeShow" title="校餐卫士"
        :append-to-body="true" width="300px">
        <p>请使用微信扫描二维码</p>
        <div  v-loading='loadingQrCode'> <img :src='xcwsQrCodeSrc' /></div>
        <el-button type="primary" size="small" @click='down'>下载二维码</el-button>
      </el-dialog>
      <!-- 等级评定弹窗-->
      <el-dialog :title="assessDialog.title" :visible.sync="assessDialog.show" :append-to-body="true"
        :top="assessDialog.top" width="25%">
        <el-form :model="assessDialogForm" ref="assessDialogForm" label-width="80px" style="width: 100%">
          <el-form-item label="量化等级">
            <el-input v-model="assessDialogForm.qualityLevel" vplaceholder="请填写量化等级">
            </el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="assessDialog.show = false">取 消</el-button>
          <el-button type="primary" @click="submitAssess" :disabled="assessDialogSubmitButtonDisabled">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import * as common from 'api/common';
  import EnumSelect from 'components/common/EnumSelect';
  import * as guard from 'api/guard'
  import {setCookie} from "utils/sessionStorage";
  import {getMapping} from "../../xcws/mapping";

  var _this;
  export default {

    beforeCreate() {
      _this = this;
    },

    async mounted() {
      await this.getQualityLevelDict();

      guard.getAreaTree('').then(r => {
        if (r.status) {
          let data = JSON.parse(r.data)
          data.data.forEach(element => {
            element.children = []
          })
          this.options = data.data
        } else {
          this.$message.warning(r.message)
        }
      })
      this.searchTab()
    },
    methods: {
      down() {
        window.location.href = this.xcwsQrCodeSrc;
      },
      qrCode(item) {
        this.xcwsQrCodeSrc = ''
        // 发送请求
        this.loadingQrCode = true;
        guard.xcwsEntityQrcode({
          entityId: item.guid,
          type: 'XCWS'
        }).then(r => {
          if (r.code == 200) {
            this.xcwsQrCodeSrc = r.data.qrCodeUrl
            this.loadingQrCode = false;
          }

        })
        this.qrCodeShow = true;

      },
      async getQualityLevelDict() {
        // 获取量化等级数据字典
        await guard.getDictListByType({
          dictType: "06"
        }).then((res) => {
          if (res.status) {
            let data = JSON.parse(res.data);
            this.quantifyLevelList = data.data;
            data.data.forEach(e => {
              this.qualityLevelDict[e.code] = e.name;
            });
          }
        }).catch(function (error) {
          console.log(error);
        })
        //h5大屏-获取访问密匙
        await guard.getSecretKey().then((res) => {
          if (res.status) {
            this.XCWSOpenSecret = res.data.XCWSOpenSecret;
            setCookie('XCWSOpenSecret',res.data.XCWSOpenSecret)
          } else {
            this.$message.warning('h5大屏获取访问密匙失败')
          }
        }).catch(function (error) {
          console.log(error);
        })
      },

      handleIconClick() { //搜索框按钮点击搜索
        this.a = !this.a;
        this.searchTab();
      },
      searchPage() {
        this.loading = true;
        guard.entityPage(this.page.pageNum, this.page.pageSize, this.condition).then((result) => {
          if (result.status) {
            let data = JSON.parse(result.data)
            this.tableData = data.data.records
            this.page.total = data.data.total
          } else {
            this.$message.warning(result.message)
          }
          this.loading = false
        });

      },
      searchTab() {
        this.page.pageNum = 1;
        this.searchPage();
      },
      pagecCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      handleItemChange(val) {
        let nodes = this.options
        let node
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            if (nodes[j].areaId == val[i]) {
              if (i == val.length - 1) {
                node = nodes[j]
              }
              nodes = nodes[j].children
              break
            }
          }
        }
        guard.getAreaTree(val[val.length - 1]).then(r => {
          if (r.status) {
            let data = JSON.parse(r.data)
            let children = data.data
            children.forEach(element => {
              element.children = []
            })
            if (children.length == 0) {
              node.children = ''
            } else {
              node.children = children
            }
          } else {
            this.$message.warning(r.message)
          }
        })
      },
      view(id, entityType) {
        this.$router.push({
          name: "subject.archives.detail",
          params: {
            type: entityType.toLocaleLowerCase()
          },
          query: {
            id
          }
        })
      },
      areaChange(val) {
        if (!val || val.length == 0) {
          this.condition.areaId = ''
        } else {
          this.condition.areaId = val[val.length - 1]
          this.handleItemChange(val)
        }
        this.searchTab()
      },

      // 评定按钮
      handleAssess(row) {
        this.assessDialog.show = true;
        this.assessDialogForm.entityId = row.guid;
        this.assessDialogForm.qualityLevel = row.qualityLevel;
      },

      // 提交等级评定
      submitAssess() {
        console.log(this.assessDialogForm);
        if (this.assessDialogForm.qualityLevel == '') {
          this.$message({
            message: '请填写评定等级',
            type: 'warning'
          });
          return;
        }

        this.assessDialogSubmitButtonDisabled = true; // 避免重复提交
        guard.assessQualityLevel(this.assessDialogForm).then(res => {
          this.assessDialogSubmitButtonDisabled = false;
          if (res.status) {
            this.$message({
              message: '评定成功',
              type: 'success'
            });
            this.assessDialog.show = false;
            this.pagecCurrentChange(this.page.pageNum);
          } else {
            this.$message.error('评定失败');
            console.log(res.message);
          }
        })
      }
    },
    components: {
      EnumSelect
    },
    computed: {
      tableHeight() {
        return this.$store.state.layout.tableHeight;
      },
      tableWidth() {
        return this.$store.state.layout.tableWidth;
      }
    },
    watch: {

    },
    filters: {
      qualityLevel: function (val) {
        return _this.qualityLevelDict[val]
      }
    },

    data() {
      return {
        qrCodeShow: false,
        xcwsQrCodeSrc: '',
        loadingQrCode: false,
        XCWSOpenSecret: '',
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        loading: false,
        a: false,
        shadowShow: false,
        tableData: [],
        options: [],
        condition: {
          appType: '1', // 校餐卫士
          keyword: '',
          buyerType: '',
          scType: '',
          areaId: ''
        },
        props: {
          value: 'areaId',
          label: 'areaName',
          children: 'children'
        },
        qualityLevelDict: [],
        quantifyLevelList: {},
        assessDialogSubmitButtonDisabled: false,
        assessDialog: {
          title: "量化等级评定",
          top: "30vh",
          show: false
        },
        assessDialogForm: {
          entityId: '',
          qualityLevel: '',
        },
        //字典
        buyerTypeMapping: getMapping().type,
        scTypeMapping: getMapping().scType,
      }
    }
  }
</script>
<style scoped lang="scss">
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
    justify-content: space-between;
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

  .qrCode-dialog {
    text-align: center;

    p {
      font-size: 16px;
      margin-bottom: 20px;
    }

    img {
      width: 200px;
      height: 200px;
      margin: 0 auto 20px;
    }
  }
</style>