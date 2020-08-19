<template>
  <div>
    <div class="page-tilt">
      <b></b><span>设备导入</span>
    </div>
    <el-form v-loading="loading" :model="importInformaion" :rules="rules" ref="form" label-width="130px"
      class="demo-ruleForm labW150 right-info">
      <div class="content min-food">
        <div class="row">
          <el-form-item label="选择部门:" prop="county">
            <el-select @change="countyChange" v-model="importInformaion.county" placeholder="请选择区县">
              <el-option v-for="item in countySelect" :key="item.id" :label="item.deptName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row">
          <el-form-item label="配置文件:">
            <el-upload class="avatar-uploader" action="" :disabled="configDisabled" :http-request="uploadConfig"
              :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
              <el-button :disabled="configDisabled" type="primary" style="margin-right:20px;">点击上传</el-button>
            </el-upload>
            <span class="txtClass">文件格式：xls
              (必填)</span>
            <div class="show-success-file">
              <div class="file-item movePoin" v-for="(item,index) in uploadFile" :key="index">
                <span class="file-name not-pic" @click.stop="downloadFile(index,item)">{{item.fileName}}</span>
                <span v-if="!configDisabled" class="delete-btn" @click="removeFile(index,item)">删除</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="row" style="text-align:right">
          <el-form-item>
            <el-upload class="avatar-uploader" action="" :disabled="disabled" :http-request="uploadImportFile"
              :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
              <el-button :disabled="disabled" type="primary">导入</el-button>
            </el-upload>
            <span class="txtClass">文件格式：xls
            </span>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { getConfigFile, getSubordinate, relation, getDept } from 'api/sub/import'
  import { getEntityImport } from 'api/special/elevator'
  import { removeFile } from 'api/cfda/add'
  import { uploadFile, downloadFile } from 'api/common'
  export default {
    mounted() {
      this.entityType = this.$route.query.entityType;
      this.importInformaion.entityType = this.$route.query.entityType;
      let areaCode = this.$store.getters.user.areaCode
      let isCity = areaCode.length === 4
      let isCounty = areaCode.length === 6
      let isSyj = areaCode.length === 10
      if (isCounty || isSyj || isCity) {
        getSubordinate(areaCode, this.entityType).then(r => {
          if (isCity) {
            this.configDisabled = true
            this.countySelect = r.data
          } else if (isCounty) {
            this.configDisabled = false
            const user = this.$store.getters.user
            this.countySelect.push({ id: user.deptId, areaCode: user.areaCode, deptName: user.deptName })
            this.importInformaion.county = user.deptId
            this.countyChange(this.importInformaion.county)
          } else if (isSyj) {
            this.configDisabled = true
            getDept(areaCode.substr(0, 6)).then(rc => {
              let countyDept = rc.data
              this.countySelect.push({ id: countyDept.id, areaCode: countyDept.areaCode, deptName: countyDept.deptName })
              this.importInformaion.county = countyDept.id
              const user = this.$store.getters.user
              this.countyChange(this.importInformaion.county)
            })
          }
        })
      } else {
        return
      }
    },
    data() {
      var checkCounty = (rule, value, callback) => {
        this.validated()
        if (value === '') {
          callback(new Error('请选择区域'));
        } else {
          callback();
        }
      }
      return {
        importInformaion: {
          county: '',// 区
          fileId: '', // 上传文件id
          entityType: '',
        },
        entityType: '',
        countySelect: [],
        uploadFile: [],
        disabled: true,
        configDisabled: false,
        loading: false,
        rules: {
          county: [
            { validator: checkCounty, trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      validated() {
        let flag = false
        Object.keys(this.importInformaion).forEach(key => {
          if (key !== 'fileId') {
            if (!this.importInformaion[key]) {
              flag = true
            }
          }
        })
        this.disabled = flag
      },
      countyChange(county) {
        for (var i = 0; i < this.countySelect.length; i++) {
          if (this.countySelect[i].id === county) {
            getConfigFile(this.countySelect[i].areaCode, this.entityType).then(r => {
              let data = r.data
              if (data) {
                this.uploadFile = []
                this.uploadFile.push(Object.assign({}, { fileName: data.fileName, type: data.type, id: data.id, fileId: data.fileId, path: '' }))
              }
            })
            break
          }
        }
      },
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf('.'))
        let flag = true
        if (type !== '.xls') {
          flag = false
          this.$message.warning('上传格式错误')
        }
        return flag
      },
      uploadConfig(file, callback) {
        var formdata = new FormData()
        formdata.append('file', file.file)
        let _this = this
        uploadFile(formdata, { type: 'TZSB_INSPECT_REPORT' }, callback).then((result) => {
          if (result.status) {
            let data = result.data;
            relation(data.id, this.entityType).then(r => {
              if (r.status) {
                _this.uploadFile = []
                _this.uploadFile.push(Object.assign({}, { fileName: data.fileName, type: data.type, id: data.id, fileId: data.fileId, path: '' }))
                this.validated()
              } else {
                _this.$message.warning(r.message)
              }
            })
          } else {
            _this.$message.warning(result.message)
          }
        })
      },
      // 删除上传的文件
      removeFile(index, file) {
        this.$confirm('是否确认删除该文件吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(file.id).then(res => {
            this.validated()
            this.$message.success('文件删除成功！')
          })
          this.uploadFile.splice(index, 1)
        })
      },
      fileUploadError(err, file) {
        this.$message.warning("文件上传失败！");
      },
      downloadFile(index, file) {
        let fileName = file.fileName.substr(0, file.fileName.lastIndexOf('.'))
        downloadFile(file.fileId, fileName)
      },
      uploadImportFile(file, callback) {
        this.loading = true
        var formdata = new FormData()
        formdata.append('file', file.file)
        let _this = this
        uploadFile(formdata, { type: 'TZSB_INSPECT_REPORT' }, callback).then((result) => {
          let data = result.data
          this.importInformaion.fileId = data.id
          getEntityImport(this.importInformaion).then(r => {
            this.loading = false
            if (!r.status) {return}
            this.$message({
              message: '共导入' + r.data.total + '条, 导入成功' + r.data.success + '条, 导入失败' + r.data.error + '条',
              type: 'success'
            })
            if (r.data.fileId) {
              downloadFile(r.data.fileId, r.data.fileName)
            }
          })
        })
      }
    },
  };
</script>

<style scoped lang="sass">
  .progress-box {
    position: fixed;
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    z-index: 9999;
  }

  .file-item:hover {
    color: #0db5ef;
  }
  .txtClass{
    white-space:nowrap;
    position:absolute;
    left:100px;
    top:-8px;
    max-width:316px;
    color: #A2AAB6;
    font-size:12px;
    margin-top: 10px;
  }
</style>