<template>
  <div>
    <div class="page-tilt">
      <b></b><span>人员档案添加</span>
    </div>
    <div class="mb200">
      <el-form :model="baseObj" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <ToggleForm title="基础信息">
          <div class="content">
            <div class="row">
              <el-form-item label="姓名:" prop="name">
                <el-input placeholder="请输入姓名：" class="w180" maxlength="15" v-model="baseObj.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号(账号)：" prop="name">
                <el-input placeholder="请输入手机号(账号)" class="w180" maxlength="15" v-model="baseObj.name"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="单位名称：" prop="name">
                <el-button type="default" @click="isEntityTableShow=true" style="background:#F6F7F8;margin-bottom:20px;">选择主体</el-button>
                <!-- 选择的主体 -->
                <ul class="mainbody">
                  <i class="el-icon-close close"></i>
                  <li><span>单位名称：</span>大蓉和高新店</li>
                  <li><span>主体类型：</span>大蓉和高新店</li>
                  <li><span>许可备案号：</span>大蓉和高新店</li>
                  <li class="textell"><span>经营地址：</span>成都市武侯区一环路西一段128号</li>
                </ul>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="性别：" prop="name">
                <el-select class="mr20 w150" v-model="queryLimit.type" :clearable="true" placeholder="选择性别">
                  <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="身份证号：" prop="name">
                <el-input placeholder="请输入身份证号" class="w180" maxlength="15" v-model="baseObj.name"></el-input>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="岗位职务：" prop="name">
                <el-input placeholder="请输入岗位职务" class="w180" maxlength="15" v-model="baseObj.name"></el-input>
              </el-form-item>
              <el-form-item label="人员类型：" prop="name">
                <el-select class="mr20 w150" v-model="queryLimit.type" collapse-tags multiple  :clearable="true" placeholder="人员类型">
                  <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="row">
              <el-form-item label="行业类型：" prop="name">
                <el-select class="mr20 w150" collapse-tags multiple  v-model="queryLimit.type" :clearable="true" placeholder="行业类型">
                  <el-option v-for="item in select" :key="item.key" :label="item.name" :value="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="从业年限：" prop="name">
                <el-date-picker class="w120" :picker-options="pickerOptions0" v-model="queryLimit.start" type="month"
                  format="yyyy-MM" value-format="yyyy-MM" :editable="false" :clearable="true" placeholder="考核年度">
                </el-date-picker>
                至
                <el-date-picker class="w120" :picker-options="pickerOptions1" v-model="queryLimit.end" type="month"
                  format="yyyy-MM" value-format="yyyy-MM" :editable="false" :clearable="true" placeholder="考核年度">
                </el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="从业经历：" prop="name">
              <el-input placeholder="请输入从业经历" class="w550" :rows="5" type="textarea" v-model="baseObj.name"></el-input>
            </el-form-item>
            <el-form-item label="从业禁止情况：" prop="name">
              <el-input placeholder="请输入从业禁止情况" class="w550" :rows="5" type="textarea" v-model="baseObj.name">
              </el-input>
              <span style="color: #A2AAB6;font-size:12px;margin-left:5px;">(选填)</span>
            </el-form-item>
            <el-form-item label="健康证有效期：" prop="name">
              <el-date-picker class="w180" :picker-options="pickerOptions" v-model="queryLimit.date" type="date"
                format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" :clearable="true" placeholder="考核年度">
              </el-date-picker>
              <span style="color: #A2AAB6;font-size:12px;margin-left:5px;">(选填)</span>
            </el-form-item>
          </div>
        </ToggleForm>
        <ToggleForm title="附件上传">
          <div class="content">
            <el-form-item label="健康证：" prop="">
              <el-upload action="/api/upload" :limit="1" :data="{type:'REPATROL_RECORD', field: 'PHOTO'}"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
              <p class="bz" style="margin-top: 10px;">图片大小：每张图片小于10M，图片格式：png，jpg，jpeg</p>
            </el-form-item>
            <el-form-item label="免冠照片：" prop="">
              <el-upload action="/api/upload" :limit="1" :data="{type:'REPATROL_RECORD', field: 'PHOTO'}"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>


              <p class="bz" style="margin-top: 10px;">图片大小：每张图片小于10M，图片格式：png，jpg，jpeg</p>
            </el-form-item>
            <el-form-item label="身份证：" prop="">
              <el-upload action="/api/upload" :limit="2" :data="{type:'REPATROL_RECORD', field: 'PHOTO'}"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
              <p class="bz" style="margin-top: 10px;">需要头像面和国徽面，图片大小：每张图片小于10M，图片格式：png，jpg，jpeg</p>
            </el-form-item>
          </div>
        </ToggleForm>
      </el-form>
    </div>
    <!--图片放大 -->
    <div class='big-img' v-show="showBigPic" @click.stop="handlePictureCardPreview('-1')">
      <img :src="bigImgSrc">
    </div>
    <!-- 底部按钮 start-->
    <div class="foot-btn" style="z-index:998">
      <div>
        <el-button class="w100 mr10">返回</el-button>
        <el-button type="primary w100">保存</el-button>
      </div>
    </div>
    <!-- 选择主体弹窗 -->
    <yb-popup width="770" :isShow='isEntityTableShow' @close="hideEntityTable()" :title="'选择主体'" id="popup">
      <div slot="body">
        <div style="width:680px;margin:20px auto 0;">
            <div class="mt20 clear_a" style="margin-bottom: 20px;">
              <el-input placeholder="主体名称、许可备案号" class="w250 seekIpt" style="margin-right: 10px"
                v-model="entityParams.search" @keyup.enter.native="handleEntityIconClick">
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleEntityIconClick"></i>
              </el-input>
              <enum-select v-model="entityParams.entityType" placeholder="主体类型" @change="handleEntityIconClick"
                enum="com.ybveg.govx.enums.active.ActiveEntityTypeEnum"></enum-select>
            </div>

            <el-table style="height:373px;overflow-y:auto;" :data="entityPage" class="table-div" fit
              highlight-current-row @row-click="rowClick">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="单位名称"></el-table-column>
              <el-table-column show-overflow-tooltip label="许可备案号">
                <template slot-scope="scope">
                  <span>{{scope.row.licence?scope.row.licence:"暂无"}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="entityTypeStr" label="主体类型"></el-table-column>
              <el-table-column show-overflow-tooltip label="经营地址/场所地址">
                <template slot-scope="scope">
                  <span>{{scope.row.realityAddr?scope.row.realityAddr:"暂无"}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-box">
              <el-pagination background @size-change="pageSizeEntityChange" @current-change="pageCurrentEntityChange"
                :current-page="entityParams.pageNum" :page-sizes="[5,8,10,15,20,25,30]"
                :page-size="entityParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="entityParams.total">
              </el-pagination>
            </div>
            <br />
        </div>
      </div>
    </yb-popup>
  </div>
</template>

<script>
 import YbPopup from 'components/ybpopup/YbPopup';
  import ToggleForm from "components/ToggleForm.vue";
  import EnumSelect from 'components/common/EnumSelect';
  export default {
    data() {
      return {
        entityParams:{},
        entityPage: [{
          name: '555555'
        }],
        isEntityTableShow: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        pickerOptions0: {
          disabledDate: (time) => {
            let beginDateVal = this.queryLimit.end;
            if (beginDateVal) {
              return time.getTime() >= beginDateVal || time.getTime() < Date.now() - 8.64e7;
            }
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.queryLimit.start;
            if (beginDateVal) {
              return time.getTime() <= beginDateVal || time.getTime() < Date.now() - 8.64e7;
            }
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        select: [{
            name: "存在",
            key: true
          },
          {
            name: "不存在",
            key: false
          }
        ],

        pathFile: this.$store.getters.filePath,
        rules: {},
        queryLimit: {},
        baseObj: {
          industryType: []
        },
        bigImgSrc: '',
        showBigPic: false,
        fileIdList: [],
        entityParams: {
          search: '',
          entityType: '',
          pageSize: 10,
          pageNum: 1,
          total: 0,
          taskId: this.id,
        },
      };
    },
    components: {
      ToggleForm,YbPopup,
      EnumSelect
    },
    mounted() {
      this.pathFile = this.$store.getters.filePath;
    },
    methods: {
       rowClick(row, event, column) {
        if (!this.entityids[row.id]) {
          this.entityids[row.id] = row.id;
          // addCameraConfig(this.id, row.id).then(result => {
          //   if (result.status) {
          //     this.isEntityTableShow = false;
          //     this.entityParams.search = '';
          //     this.findPage();
          //     this.findEntityList();
          //   }
          // })
        }
      },
      //页数改变
      pageCurrentEntityChange(num) {
        this.entityParams.pageNum = num;
        this.findEntityList();
      },
      //每页数量改变
      pageSizeEntityChange(size) {
        this.entityParams.pageSize = size;
        this.findEntityList();
      },
      handleEntityIconClick() {
        this.findEntityList();
      },
      //添加主体
      addEntity() {
        this.isEntityTableShow = true;
        this.findEntityList();
      },
      //取消
      hideEntityTable() {
        this.isEntityTableShow = false;
        this.entityParams.search = '';
        this.entityParams.entityType = '';
      },
      beforeAvatarUpload(file) {
        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          this.$message.error('请上传正确格式的图片(图片格式：png，jpg，jpeg)');
          return false;
        }
        let size = file.size / 1024 / 1024 < 10;
        if (!size) {
          this.$message.error('上传图片大小不能超过 10MB!');
          return false;
        }
      },
      handleRemove(file, fileList) {
        for (let i = 0; i < this.fileIdList.length; i++) {
          let id = this.fileIdList[i];
          if (id === file.response.data.id) {
            this.fileIdList.splice(i, 1);
            break;
          }
        }
      },
      handlePictureCardPreview(file) {
        let i = file.url;
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (file == -1) {
          this.showBigPic = false;
        }
      },
      handleAvatarSuccess(file) {
        if (file.status) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.fileIdList.push(file.data.id);
        }
      },
    },
    watch: {}
  };
</script>

<style scoped lang="scss">
  .content {
    width: 800px;
    margin: 30px auto 0;
  }

  .w550 {
    width: 550px !important;
  }

  .w180 {
    width: 180px !important;
  }

  .mb200 {
    margin-bottom: 200px;
  }

  .mainbody {
    width: 480px;
    height: 116px;
    background: rgba(239, 247, 249, 1);
    border: 1px solid rgba(194, 234, 248, 1);
    padding: 20px 10px;
    color: #1FABDC;
    position: relative;
    font-size: 14px;

    li {
      margin-bottom: 10px;
      width: 95%;
      line-height: 20px;

      span {
        width: 120px;
        display: inline-block;
        text-align: right;
      }
    }

    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 16px;
      color: #1FABDC;
      cursor: pointer;
      font-weight: bolder;
    }
  }

  .big-img {
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

    >img {
      max-height: 700px;
      display: block;
    }
  }
      .pagination-box {
        text-align: right;
        margin-top: 20px;
    }
</style>