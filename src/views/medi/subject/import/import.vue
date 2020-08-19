<template>
<el-form v-loading="loading" :model="importInformaion" :rules="rules"  ref="form" label-width="130px" class="demo-ruleForm labW150 right-info">
    <div class="content min-food">
      <div class="row">
        <el-form-item label="选择部门:" prop="county">
          <el-select @change="countyChange" v-model="importInformaion.county" placeholder="请选择区县">
            <el-option
              v-for="item in countySelect"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="syj">
          <el-select @change="syjChange" v-model="importInformaion.syj" placeholder="请选择街道">
            <el-option
              v-for="item in syjSelect"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item  prop="grid">
          <el-select @change="validated" v-model="importInformaion.grid" placeholder="请选择社区网格">
            <el-option
              v-for="item in gridSelect"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="row">
        <el-form-item label="配置文件:">
          <el-upload class="avatar-uploader" action="" :disabled="configDisabled"  :http-request="uploadConfig" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
            <el-button :disabled="configDisabled" type="primary" style="margin-right:20px;">点击上传</el-button>
          </el-upload>
          <span style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">文件格式：xls (必填)</span>
          <div class="show-success-file"  >
            <div class="file-item movePoin" v-for="(item,index) in uploadFile" :key="index">
              <span class="file-name not-pic" @click.stop="downloadFile(index,item)">{{item.fileName}}</span>
              <span v-if="!configDisabled" class="delete-btn" @click="removeFile(index,item)">删除</span>
            </div>
          </div>
        </el-form-item>
      </div>

      <div class="row" style="text-align:right">
        <el-form-item>
          <el-upload class="avatar-uploader" action=""  :disabled="disabled" :http-request="uploadImportFile" :show-file-list="false" :on-error="fileUploadError" :before-upload="beforeAvatarUpload">
            <el-button :disabled="disabled" type="primary">导入</el-button>
          </el-upload>
          <span style="white-space:nowrap;position:absolute;left:100px;top:-8px;max-width:316px;color: #A2AAB6;font-size:12px;margin-top: 10px;">文件格式：xls </span>
        </el-form-item>
      </div>
    </div>
</el-form>
</template>

<script>

import { getConfigFile, getSubordinate, relation, getDept } from 'api/sub/import'
import { add } from 'api/medi/subject/import'
import {removeFile} from 'api/cfda/add'
import { uploadFile , downloadFile } from 'api/common'
export default {
  components: {

  },
  mounted() {
    this.importInformaion.entityType = this.entityType.toUpperCase()
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
          this.countySelect.push({id: user.deptId, areaCode: user.areaCode, deptName: user.deptName})
          this.importInformaion.county = user.deptId
          this.countyChange(this.importInformaion.county)
        } else if (isSyj) {
          this.configDisabled = true
          getDept(areaCode.substr(0, 6)).then(rc => {
            let countyDept = rc.data
            this.countySelect.push({id: countyDept.id, areaCode: countyDept.areaCode, deptName: countyDept.deptName})
            this.importInformaion.county = countyDept.id
            const user = this.$store.getters.user
            this.syjSelect.push({id: user.deptId, areaCode: user.areaCode, deptName: user.deptName})
            this.importInformaion.syj = user.deptId
            this.countyChange(this.importInformaion.county)
          })
        }
      })
    } else {
      return
    }
  },
  props: {
    entityType: {
      type: String
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
    var checkSyj = (rule, value, callback) => {
      this.validated()
      if (value === '') {
        callback(new Error('请选择街道'));
      } else {
        callback();
      }
    }
    var checkGrid = (rule, value, callback) => {
      this.validated()
      if (value === '') {
        callback(new Error('请选择社区网格'));
      } else {
        callback();
      }
    }
    return {
      importInformaion: {
        county: '',// 区
        syj: '', // 街道
        grid: '', // 网格
        fileId: '', // 上传文件id
        entityType: '',
        configFileId: ''
      },
      countySelect: [],
      syjSelect: [],
      gridSelect: [],
      uploadFile:[],
      showBigPic: -1,
      disabled: true,
      configDisabled: false,
      loading: false,
      percentage: 0,//需要关联的进度条
      rules: {
        county: [
          { validator: checkCounty, trigger: 'change' }
        ],
        syj: [
          { validator: checkSyj, trigger: 'change' }
        ],
        grid: [
          { validator: checkGrid, trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    //验证
    reset () {

    },
    validated () {
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
    countyChange (county) {
      for(var i = 0; i < this.countySelect.length; i++) {
        if (this.countySelect[i].id === county) {
          getConfigFile(this.countySelect[i].areaCode, this.entityType).then(r => {
            let data = r.data
            if (data) {
              this.importInformaion.configFileId = data.id
              this.uploadFile = []
              this.uploadFile.push(Object.assign({}, {fileName: data.fileName, type: data.type, id: data.id, fileId: data.fileId, path: ''}))
            }
          })
          if (this.$store.getters.user.areaCode.length !== 10) {
            getSubordinate(this.countySelect[i].areaCode, this.entityType).then(r => {
              this.importInformaion.syj = ''
              this.syjSelect = r.data
              for (var j = 0; j < this.syjSelect.length; j++) {
                if (this.syjSelect[j].default) {
                  this.importInformaion.syj = this.syjSelect[j].id
                  this.syjChange(this.importInformaion.syj)
                  break
                }
              }
            })
          }
          break
        }
      }
    },
    syjChange (syj) {
      for(var i = 0; i < this.syjSelect.length; i++) {
        if (this.syjSelect[i].id === syj) {
          getSubordinate(this.syjSelect[i].areaCode, this.entityType).then(r => {
            this.importInformaion.grid = ''
            this.gridSelect = r.data
            for (var j = 0; j < this.gridSelect.length; j++) {
              if (this.gridSelect[j].default) {
                this.importInformaion.grid = this.gridSelect[j].id
                this.validated()
                break
              }
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
    uploadConfig (file, callback) {
      var formdata = new FormData()
      formdata.append('file', file.file)
      let _this = this
      uploadFile(formdata, { type: 'DEPT' }, callback).then((result) => {
        if (result.status) {
          let data = result.data;
          relation(data.id, this.entityType).then(r => {
            if (r.status) {
              _this.uploadFile = []
              _this.uploadFile.push(Object.assign({}, {fileName: data.fileName, type: data.type, id: data.id, fileId: data.fileId, path: ''}))
              this.importInformaion.configFileId = data.id
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
      /*   console.log(file)  */
      this.$confirm('是否确认删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        removeFile(file.id).then(res =>{
          this.importInformaion.configFileId = ''
          this.validated()
          this.$message.success('文件删除成功！')
        })
        // this.uploadFile.arrayRemove(index)
        this.uploadFile.splice(index, 1)
      })
    },
    fileUploadError(err, file) {
      this.$message.warning("文件上传失败！");
    },
    downloadFile(index, file) {
      let fileName = file.fileName.substr(0,file.fileName.lastIndexOf('.'))
      downloadFile(file.fileId, fileName)
    },
    uploadImportFile(file, callback) {
      this.loading = true
      var formdata = new FormData()
      formdata.append('file', file.file)
      let _this = this
      uploadFile(formdata, { type: 'IMPORT' }, callback).then((result) => {
        let data = result.data
        this.importInformaion.fileId = data.id
        add(this.importInformaion).then(r => {
          this.$message({
            message: '共导入' + r.data.total + '条, 导入成功' + r.data.success + '条, 导入失败' + r.data.error + '条',
            type: 'success'
          })
          if (r.data.fileId) {
            downloadFile(r.data.fileId, r.data.fileName)
          }
          this.loading = false
        })
      })
    }
  },
  watch: {
    
  }
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
  .file-item:hover{
    color: #0db5ef;
  }
</style>