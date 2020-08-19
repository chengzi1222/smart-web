<template>
  <div class="right-info">
    <el-form  label-width="130px" class="demo-ruleForm" :model="dto" :rules="rules" ref="ruleForm">
      <!-- 基本信息 -->
      <toggle-form title="基本信息">
        <div class="content">
          <div class="row">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dto.title" class="w250" placeholder="请输入资讯标题">
              </el-input>
            </el-form-item>
          </div>
          <div class="row" >
            <el-form-item label="发布部门：" prop="pubDeptName">
              <el-input v-model="dto.pubDeptName" placeholder="请输入发布部门">
              </el-input>
            </el-form-item>
          </div>
          <div class="row" >
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
          <div class="row" >
            <el-form-item label="请选择资讯标签：" prop="newsTypeId">
              <el-select v-model="dto.newsTypeId" placeholder="请选择资讯标签"  class="w250">
                <el-option
                  v-for="item in typeFlag.array"
                  :key="item.id"
                  :label="item.type_name"
                  :value="item.id"  class="w250">
                </el-option>
              </el-select>
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

      <toggle-form title="资讯内容" >
        <div class="editorBox">
          <editor-demo @EditorChange="editHmtl" :resetHtml="resetHtml" @getPicIdToParent="getPicIdFromChild"></editor-demo>
        </div>
      </toggle-form>
    </el-form>
    <!--
    <template>
      <el-button type="text" @click="open">点击打开 Message Box</el-button>
    </template> -->
    <!-- 巡查项 -->
    <!--浮动的保存按钮层-->
    <div class="foot-btn">
      <div>
        <el-button @click="backList()">返回</el-button>
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
      ToggleForm,EditorDemo
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
    // 这里用watch来监听newsTypeList的值，因父组件引入子组件后，子组件初始化获得的是父组件中空的newsTypeList，此时newsTypeList还没有异步访问服务器来获得真正的数据，
    // 当从服务器拿到数据后，newsTypeList才会是真正有数据的，而mounted获得的数据应该是父组件的静态数据，是父组件初始化中就有的。
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
      sumbit(formName){
        this.submitYes = "";
        if (!this.validateForm()) {
          this.submitYes = 'YES';
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid)  {
            let formData = {
              newsJson: JSON.stringify(this.dto)
            };
            if (!this.editInfoData.isEdit) {
              //添加资讯
              newsApi.add(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯添加成功！');
                  this.backList();
                }
                this.submitYes = "YES";
              });
            } else {
              //编辑资讯
              newsApi.edit(formData).then((r) => {
                if (r.status) {
                  this.$message.success('资讯编辑成功！');
                  this.backList();
                }
                this.submitYes = "YES";
              });
            }

          } else {
            console.log('表单验证出错!');
            this.submitYes = "YES";
            return false;
          }
        });
      },
      editHmtl(html){
        this.dto.content = html;
        // console.log(html,8888);

      },
      // 设置默认的值
      defaultNewsType(){
        this.dto.newsTypeId  = this.typeFlag.array[0].id;
      },
      // 返回列表页
      backList() {
        this.$router.push({name: 'news.list', query:{tab_type:'newsTable'}});
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
        submitYes: "",
        editInfoData: {},
        resetHtml:"",
        dto: {
          title: "",
          viewType: 'WORD',
          videoYes: 'NO',
          pubDeptName: this.$store.getters.user.deptName,
          content: "",
          pubYes:'YES',
          newsTypeId: '',
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
          newsTypeId: [
            { required: true, message: '请选择资讯标签', trigger: 'change' }
          ]
        }

        /* 此为下拉框列表数据例子
          typeFlag:{
          array: [{
                  key: '选项1',
                  label: '黄金糕'
                  }, {
                  key: '选项2',
                  label: '双皮奶'
                  }, {
                  key: '选项3',
                  label: '蚵仔煎'
                  }, {
                  key: '选项4',
                  label: '龙须面'
                  }, {
                  key: '选项5',
                  label: '北京烤鸭'
                  }],
          key: ''
      }*/
      }
    }
  }
</script>

<style lang="scss">
  .editorBox{
    padding: 20px 50px;
  }
</style>
