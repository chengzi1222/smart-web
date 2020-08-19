<template>
  <div class="bigbox">
    <div class="page-tilt">
      <b></b><span>供应商管理</span>
    </div>
    <div style="margin:20px 0;overflow:hidden;">
      <el-input placeholder="名称、账号、信用代码、许可备案号、负责人" class="w350 seekIpt" v-model="search" @keyup.enter.native="getPageData">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPageData"></i>
      </el-input>
      <el-button class="w76 dc" type="primary" icon="el-icon-plus" @click="popupShow('add')">添加</el-button>
    </div>
    <el-table :data="dataPage" class="table-div" v-loading="loading">
      <el-table-column show-overflow-tooltip type="index" min-width='50' label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="entity_name" min-width='150' label="供应商名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="user_name" min-width='100' label="账号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="credit_code" min-width='100' label="社会信用代码"></el-table-column>
      <el-table-column show-overflow-tooltip prop="licence" min-width='70' label="许可备案号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="corp_name" min-width='70' label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mobile" min-width='70' label="联系方式"></el-table-column>
      <el-table-column show-overflow-tooltip prop="quan_level" min-width='70' label="量化等级"></el-table-column>
      <el-table-column show-overflow-tooltip prop="reality_addr" min-width='120' label="经营地址"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="redact(scope.row)" class="operate-a">编辑</a>
          <a href="javascript:;" @click="info(scope.row.id)" class="operate-a">详情</a>
          <a href="javascript:;" @click="resetPass(scope.row.id,scope.row.entity_name)" class="operate-a">重置密码</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination background :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40,50]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total" @size-change="pageSizeChange" @current-change="pagecCurrentChange">
      </el-pagination>
    </div>

    <div class="popup-box" v-if="popup">
      <div class="popup-body content">
        <!-- 功能模块添加到这一区域 -->
        <p>
          <span v-if="popupTit == 'add'">添加</span>
          <i class="dc movePoin el-dialog__close el-icon-close" @click="cancel"></i>
          <span v-if="popupTit == 'info'">详情</span>
          <span v-if="popupTit == 'redact'">编辑</span>
        </p>

        <el-form label-width="110px" class="demo-ruleForm ml35">
          <div class="row">
            <el-form-item label="供应商名称：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.entityName" class="w162" :maxlength="30" placeholder="请输入供应商名称"
                @blur="letter"></el-input>
              <span v-if="popupTit == 'add' || popupTit == 'redact'" class="required">（必填）</span>
              <el-button v-if="popupTit == 'info' && infoData.biz_entity_id" class="zhuti" @click="ifType(infoData.biz_entity_id,infoData.biz_entity_type)">主体档案
              </el-button>
              <span v-if="popupTit == 'info'" class="required">{{infoData.entity_name?infoData.entity_name:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="供应商账号：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.userName" class="w162" :maxlength="16" :minlength="3"
                placeholder="请输入供应商账户"></el-input>
              <span v-if="popupTit == 'add' || popupTit == 'redact'" class="required">（必填）</span>
              <span v-if="popupTit == 'info'" class="required">{{infoData.user_name?infoData.user_name:'暂无'}}</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="统一社会信用代码：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.creditCode" class="w162" :maxlength="30" placeholder="请输入统一社会信用代码"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.credit_code?infoData.credit_code:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="许可备案号：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.licence" class="w162" :maxlength="30" placeholder="请输入许可备案号"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.licence?infoData.licence:'暂无'}}</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="负责人：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.corpName" class="w100" :maxlength="10" placeholder="请输入姓名"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.corp_name?infoData.corp_name:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="联系方式：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.mobile" class="w162" :maxlength="13" placeholder="请输入联系方式"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.mobile?infoData.mobile:'暂无'}}</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="量化等级：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.quanLevel" class="w162" :maxlength="5" placeholder="请输入量化等级"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.quan_level?infoData.quan_level:'暂无'}}</span>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="经营地址：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.realityAddr" class="w312" :maxlength="30" placeholder="请输入经营地址"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.reality_addr?infoData.reality_addr:'暂无'}}</span>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="经度：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.lng" class="w220" :maxlength="10" placeholder="-180到180之间,保留6位小数"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.lng?infoData.lng:'暂无'}}</span>
            </el-form-item>
            <el-form-item label="纬度：" prop="">
              <el-input v-if="popupTit == 'add' || popupTit == 'redact'" v-model="rulesForm.lat" class="w220" :maxlength="10" placeholder="-90到90之间,保留6位小数"></el-input>
              <span v-if="popupTit == 'info'" class="required">{{infoData.lat?infoData.lat:'暂无'}}</span>
            </el-form-item>
          </div>

        </el-form>
        <div class="butDiv">
          <el-button v-if="popupTit == 'info'" class="w65" type="info" plain @click="cancel">关闭</el-button>
          <el-button v-if="popupTit == 'add' || popupTit == 'redact'" class="w65" type="info" plain @click="cancel">取消
          </el-button>
          <el-button v-if="popupTit == 'add'" class="w65" type="primary" @click="add" :disabled="rulesForm.entityName == '' || rulesForm.userName == '' || !butClick">确定
          </el-button>
          <el-button v-if="popupTit == 'redact'" class="w65" type="primary" @click="update" :disabled="rulesForm.entityName == '' || rulesForm.userName == '' || !butClick">确定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as activity from "api/activity";

  export default {
    data() {
      return {
        page: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        },
        dataPage: null,
        pageObj: null,
        search: '',
        input: '',
        popup: false,
        rulesForm: {
          entityType: 'SUPPLIER',
          entityName: '',
          userName: '',
          creditCode: '',
          licence: '',
          corpName: '',
          mobile: '',
          quanLevel: '',
          realityAddr: '',
          lng: '',
          lat: ''
        },
        loading: true,
        popupTit: '',
        infoData: {},
        butClick: true
      };
    },
    methods: {
      // 分页查询
      getPageData() {
        this.loading = true;
        const params = new FormData()
        params.append('pageSize', this.page.pageSize)
        params.append('pageNum', this.page.pageNum)
        params.append('entityType', 'SUPPLIER')
        params.append('search', this.search)
        activity.entityList(params).then(r => {
          this.loading = false;
          this.dataPage = r.data.list
          this.page.total = r.data.total
        })
      },
      //页数改变
      pagecCurrentChange(num) {
        this.page.pageNum = num
        this.getPageData()
      },
      //每页数量改变
      pageSizeChange(size) {
        this.page.pageSize = size
        this.getPageData()
      },
      letter() {
        if (this.rulesForm.entityName != '' && this.popupTit == 'add') {
          const params = new FormData()
          params.append('entityName', this.rulesForm.entityName)
          activity.entityName(params).then((r) => {
            this.rulesForm.userName = r.data.userName
          })
        }
      },
      add() {
        this.butClick = false;
        if (this.rulesForm.mobile != '') {
          let ph = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
          let mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
          if (!ph.test(this.rulesForm.mobile) && !mb.test(this.rulesForm.mobile)) {
            this.$message.error('联系方式请输入手机号或固话号码！')
            this.butClick = true;
            return false
          }
        }
        if (this.rulesForm.userName.length < 3) {
          this.$message.error('供应商账号长度不能小于3位')
          this.butClick = true;
          return false
        }
        if ((this.rulesForm.lng + '').split('.').length == 2 && (this.rulesForm.lng + '').split('.')[1].length >= 7) {
          this.$message.error('经度小数点大于6位')
          this.butClick = true;
          return false
        }
        if (this.rulesForm.lng > 180 || this.rulesForm.lng < -180) {
          this.$message.error('经度不合规范')
          this.butClick = true;
          return false
        }


        if ((this.rulesForm.lat + '').split('.').length == 2 && (this.rulesForm.lat + '').split('.')[1].length >= 7) {
          this.$message.error('纬度小数点大于6位')
          this.butClick = true;
          return false
        }
        if (this.rulesForm.lat > 180 || this.rulesForm.lat < -180) {
          this.$message.error('纬度不合规范')
          this.butClick = true;
          return false
        }
        let params = new FormData();
        params.append('entityType', this.rulesForm.entityType);
        params.append('entityName', this.rulesForm.entityName);
        params.append('userName', this.rulesForm.userName);
        params.append('creditCode', this.rulesForm.creditCode);
        params.append('licence', this.rulesForm.licence);
        params.append('corpName', this.rulesForm.corpName);
        params.append('mobile', this.rulesForm.mobile);
        params.append('quanLevel', this.rulesForm.quanLevel);
        params.append('realityAddr', this.rulesForm.realityAddr);
        params.append('lng', this.rulesForm.lng);
        params.append('lat', this.rulesForm.lat);
        activity.entityAdd(params).then((r) => {
          this.butClick = true;
          if (r.status) {
            this.$message.success('添加成功!')
            this.cancel();
            this.getPageData()
          } else {
            this.$message.error(r.message)
          }
        })
      },
      update() {
        this.butClick = false;
        if (this.rulesForm.mobile != '') {
          let ph = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
          let mb = /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
          if (!ph.test(this.rulesForm.mobile) && !mb.test(this.rulesForm.mobile)) {
            this.$message.error('联系方式请输入手机号或固话号码！')
            this.butClick = true;
            return false
          }
        }
        if (this.rulesForm.userName.length < 3) {
          this.$message.error('供应商账号长度不能小于3位')
          this.butClick = true;
          return false
        }
        if ((this.rulesForm.lng + '').split('.').length == 2 && (this.rulesForm.lng + '').split('.')[1].length >= 7) {
          this.$message.error('经度小数点大于6位')
          this.butClick = true;
          return false
        }
        if (this.rulesForm.lng > 180 || this.rulesForm.lng < -180) {
          this.$message.error('经度不合规范')
          this.butClick = true;
          return false
        }


        if ((this.rulesForm.lat + '').split('.').length == 2 && (this.rulesForm.lat + '').split('.')[1].length >= 7) {
          this.$message.error('纬度小数点大于6位')
          this.butClick = true;
          return false
        }
        if (this.rulesForm.lat > 180 || this.rulesForm.lat < -180) {
          this.$message.error('纬度不合规范')
          this.butClick = true;
          return false
        }
        let params = new FormData();
        params.append('id', this.rulesForm.id);
        params.append('entityType', this.rulesForm.entityType);
        params.append('entityName', this.rulesForm.entityName);
        params.append('userName', this.rulesForm.userName);
        params.append('creditCode', this.rulesForm.creditCode);
        params.append('licence', this.rulesForm.licence);
        params.append('corpName', this.rulesForm.corpName);
        params.append('mobile', this.rulesForm.mobile);
        params.append('quanLevel', this.rulesForm.quanLevel);
        params.append('realityAddr', this.rulesForm.realityAddr);
        params.append('lng', this.rulesForm.lng);
        params.append('lat', this.rulesForm.lat);
        activity.entitUpdate(params).then((r) => {
          this.butClick = true;
          if (r.status) {
            this.$message.success('编辑成功!')
            this.cancel();
            this.getPageData()
          } else {
            this.$message.error(r.message)
          }
        })
      },
      popupShow(title) {
        this.popupTit = title;
        this.popup = true;
      },
      info(id) {
        this.popupTit = 'info';
        activity.entitInfo(id).then((r) => {
          this.infoData = r.data;
          this.popup = true;
        })
      },
      redact(row) {
        this.popupTit = 'redact';
        this.rulesForm = {
          id: row.id,
          entityType: 'SUPPLIER',
          entityName: row.entity_name,
          userName: row.user_name,
          creditCode: row.credit_code,
          licence: row.licence,
          corpName: row.corp_name,
          mobile: row.mobile,
          quanLevel: row.quan_level,
          realityAddr: row.reality_addr,
          lng: row.lng,
          lat: row.lat
        }
        this.popup = true;
      },
      cancel() {
        this.popup = false;
        this.rulesForm = {
          entityType: 'SUPPLIER',
          entityName: '',
          userName: '',
          creditCode: '',
          licence: '',
          corpName: '',
          mobile: '',
          quanLevel: '',
          realityAddr: '',
          lng: '',
          lat: ''
        }
      },
      resetPass(id, name) {
        this.$confirm('是否确认重置‘' + name + '’的密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          activity.entitResetPwd({ 'entityId': id }).then((r) => {
            if (r.status) {
              this.$message({
                type: 'success',
                message: '重置成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置'
          });
        });
      },
      ifType(entityId, entityType) {
        entityType = entityType.toLowerCase();
        this.$router.push({
          name: "subject.archives.detail",
          params: {
            type: entityType
          },
          query: {
            id: entityId,
          }
        })
      },
    },
    mounted() {
      this.getPageData()
    },
    components: {}
  }
</script>

<style scoped lang="scss">
  .bigbox {
    position: relative;
  }

  .dc {
    float: right;
  }

  .table-div {
    margin: 20px 0;
    text-align: center;
  }

  .pagination-box {
    text-align: right;
    margin-top: 20px;
  }

  .operate-a {
    color: #0DB5EF;
  }

  .popup-box {
    position: fixed;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: rgba(0, 0, 0, .5);
    text-align: center;
    overflow: auto;
  }

  .popup-body {
    text-align: left;
    width: 780px;
    background: #ffffff;
    display: inline-block;
    margin-top: 100px;
    p {
      line-height: 40px;
      background: rgba(242, 245, 248, 1);
      margin-bottom: 30px;
      i {
        font-size: 16px;
        margin-top: 10px;
      }
      span {
        font-size: 14px;
        margin-left: 20px;
      }
      i {
        margin-right: 5px;
      }
    }
    .butDiv {
      text-align: right;
      margin-bottom: 20px;
      margin-top: 22px;
      margin-right: 20px;
    }
  }

  .required {
    float: right;
    margin-top: 0px;
    margin-left: 6px;
    font-size: 12px;
    color: #A2AAB6;
  }

  .w162 {
    width: 162px;
    ;
  }

  .w312 {
    width: 312px;
  }

  .ml35 {
    margin-left: 35px;
  }

  .required {
    color: #2c3035
  }

  .zhuti {
    float: right;
    margin-left: 10px;
  }

  .w220 {
    width: 220px;
  }
</style>