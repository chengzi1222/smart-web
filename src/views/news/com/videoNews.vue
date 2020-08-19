<template>
  <div class="right-info">
    <el-form label-width="130px" class="demo-ruleForm" :model="dto" :rules="rules" ref="ruleForm">
      <!-- 基本信息 -->
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dto.title" class="w250" placeholder="请输入资讯标题">
              </el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="发布部门：" prop="pubDeptName">
              <el-input v-model="dto.pubDeptName" placeholder="请输入发布人">
              </el-input>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="是否发布：">
              <el-switch
                v-model="dto.pubYes"
                active-color="#0DB5EF"
                inactive-color="#E7ECF2"
                active-value="YES"
                inactive-value="NO">
              </el-switch>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="请选择资讯标签：" prop="newsTypeId">
              <el-select v-model="dto.newsTypeId" placeholder="请选择资讯标签" class="w250">
                <el-option
                  v-for="item in typeFlag.array"
                  :key="item.id"
                  :label="item.type_name"
                  :value="item.id" class="w250">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="视频链接：" prop="videoUrl">
              <el-input v-model="dto.videoUrl" class="w250" placeholder="请在这粘贴视频链接">
              </el-input>
            </el-form-item>
          </div>

          <div class="row">
            <el-form-item label="发布端类型:" prop="releaseTypeList">
              <el-checkbox-group v-model="dto.releaseTypeList" size="large">
                <el-checkbox-button v-for="item in releaseTypeEnumList" :label="item.key" :key="item.key">{{item.name}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
      </toggle-form>
    </el-form>
    <!-- 巡查项 -->
    <toggle-form title="资讯内容">
      <div class="editorBox">
        <editor-demo @EditorChange="editHmtl" :resetHtml="resetHtml" @getPicIdToParent="getPicIdFromChild"></editor-demo>
      </div>
    </toggle-form>
    <!--浮动的保存按钮层-->
    <div class="foot-btn">
      <div>
        <el-button @click="backList();">返回</el-button>
        <el-button type="primary" @click="sumbit('ruleForm');" v-if="submitYes == 'YES'">保存</el-button>
        <el-button type="primary" @click="sumbit('ruleForm');" v-else disabled>保存</el-button>
      </div>
    </div>
    <br/><br/><br/><br/><br/><br/><br/>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import EditorDemo from "components/EditorDemo.vue";
  import * as newsApi from 'api/news/news';
  import { getEnums } from 'api/common.js';  

  export default {
    components: {
      ToggleForm, EditorDemo
    },
    mounted() {
      this.typeFlag.array = this.newsTypeList;
      if (this.newsTypeList != null && this.newsTypeList.length > 0) {
        this.defaultNewsType();
      }
      this.submitYes = 'YES';
      getEnums(['com.ybveg.govx.enums.newscenter.NewsReleaseType'], false).then(r => {
        if (r.status) {
          this.releaseTypeEnumList = r.data
        } else {
          this.$message.warning(r.message)
        }
      })
    },
    props: ['newsTypeList', 'editInfo'],
    watch: {
      newsTypeList(val){
        this.typeFlag.array = val;
        this.defaultNewsType();
      },
      editInfo(val) {
        this.editInfoData= val;
        if (val.isEdit) {
          this.dto = val.detail;
          delete this.dto.imgurls; //必须删除newsDto中未定义的imgurls
          this.resetHtml = val.detail.content;
          this.editHmtl(this.resetHtml);
        }
      }
    },
    methods: {
      sumbit(formName) {
        this.submitYes = '';
        if (!this.validateForm()) {
          this.submitYes = 'YES';
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid)  {
            let formData = {
              newsJson: JSON.stringify(this.dto)
            };
            if (!this.editInfo.isEdit) {
              newsApi.add(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯添加成功！');
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            } else {
              newsApi.edit(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯编辑成功！');
                  this.backList();
                }
                this.submitYes = 'YES';
              });
            }
          } else {
            console.log('表单验证出错!');
            this.submitYes = 'YES';
            return false;
          }
        });
      },
    validateForm() {
      let dto = this.dto;
      if (!dto.content) {
        this.$message.error("请输入资讯内容");
        return false;
      }
      if (dto.content.length > 20000) {
        this.$message.error("资讯内容不能超过20000个字符");
        return false;
      }
      if (dto.releaseTypeList.length <= 0) {
        this.$message.error("发布端类型不能为空");
        return false;
      }
      return true;
    },
      editHmtl(html) {
        // console.log(html, 8888)
        this.dto.content = html;
      },
      // 设置默认的值
      defaultNewsType(){
            this.dto.newsTypeId  = this.typeFlag.array[0].id;
      },
      // 返回列表页
      backList() {
        this.$router.push({name: 'news.list', query:{tab_type:'newsTable'}});
      },
      //获得富文本编辑器上传的图片文件的id,并添加到this.dto.picIdList中去
      getPicIdFromChild(data) {
        if (!data) {
          return ;
        }
        this.dto.picIdList.push(data);
      }
    },
    data() {
      return {
        releaseTypeEnumList: [],
        submitYes:'',
        editInfoData: {},
        resetHtml:"",
          dto: {
            title: "",
            viewType: 'VIDEO',
            videoYes: 'YES',
            pubDeptName: this.$store.getters.user.deptName,
            content: "",
            pubYes:'YES',
            newsTypeId: '',
            videoUrl: '',
            releaseTypeList: []
          },
          typeFlag:{
            array: [],
            id: ''
          },
          rules: {
            title: [
              { required: true, message: '请输入资讯标题', trigger: 'blur' },
              { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
            ],
            pubDeptName: [
              { required: true, message: '请输入发布部门', trigger: 'blur' },
              { min: 3, max: 32, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            videoUrl: [
              { required: true, message: '请输入视频链接地址', trigger: 'blur' },
              { min: 3, max: 500, message: '长度在 3 到 500 个字符', trigger: 'blur' }
            ],
            newsTypeId: [
              { required: true, message: '请选择资讯标签', trigger: 'change' }
            ]
          }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
