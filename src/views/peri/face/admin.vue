<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>人脸库管理</span>
    </div>
    <div class="ipt-btn-box" style="justify-content: end;">
      <el-input placeholder="请输入姓名" class="w250 seekIpt" v-model="search" @keyup.enter.native="page.pageNum=1;getFaceList()">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="page.pageNum=1;getFaceList()"></i>
      </el-input>
    </div>
    <el-button @click="addface" class="w80" type="primary">添加</el-button>
    <el-table :data="tableDataFace" class="table-div mt20" v-loading="tabload">
      <el-table-column type="index" min-width="100" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="AI平台类型">
        <template slot-scope="scope">
          <span v-if="!scope.row.add">{{scope.row.aiPlatformStr}}</span>
          <el-select v-else v-model="scope.row.aiPlatform" class="w180" placeholder="请选择AI平台类型" @change="aiPlatformChange(scope.row)">
            <el-option v-for="aiPlatform in facePlatformOpts" :key="aiPlatform.key" :label="aiPlatform.name" :value="aiPlatform.key" :disabled="aiPlatform.disabled"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="姓名">
        <template slot-scope="scope">
          <span v-if="!scope.row.add">{{scope.row.personName}}</span>
          <el-input v-else placeholder="请输入姓名" class="w200" maxlength="20" v-model="scope.row.personName"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="人员类型">
        <template slot-scope="scope">
          <span v-if="!scope.row.add">{{ scope.row.staffTypeStr ? scope.row.staffTypeStr : "-"}}</span>
          <el-select v-else-if="scope.row.add" v-model="scope.row.staffType" class="w180" placeholder="请选择人员类型">
            <el-option v-for="staffType in staffTypes" :key="staffType.key" :label="staffType.name" :value="staffType.key"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="职务">
        <template slot-scope="scope">
          <span v-if="!scope.row.add">{{ scope.row.personPosition ? scope.row.personPosition : "-"}}</span>
          <el-input v-else-if="scope.row.add" placeholder="请输入职务" class="w200" maxlength="20" v-model="scope.row.personPosition"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" label="性别">
        <template slot-scope="scope">
          <span v-if="!scope.row.add">{{scope.row.sexStr ? scope.row.sexStr : "-"}}</span>
          <el-select v-else v-model="scope.row.sexEnum" class="w180" placeholder="请选择性别">
            <el-option v-for="sexEnum in sexOptions" :key="sexEnum.key" :label="sexEnum.name" :value="sexEnum.key"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="150" label="人脸图">
        <template slot-scope="scope">
          <div v-if="scope.row.aiPlatform === 'AL'">
            <el-upload v-if="!scope.row.imageUrl||scope.row.add" class="upload-demo" action="/api/shanghai/upload"
            :before-upload="beforeAvatarUpload" :on-success="uploadImg" :on-error="uploadError"
            :data="{type: 'PERSON_FACE'}" :show-file-list="false">
            <el-button size="small" type="primary" v-if="!scope.row.imageUrl">上传</el-button>
            <img v-if="scope.row.imageUrl" style="width: 100px;height: 40px;" :src="'http://aicamera-pic-res.ybveg.com/' + scope.row.imageUrl">
          </el-upload>
          <img v-if="scope.row.imageUrl&&!scope.row.add" style="width: 100px;height: 40px;" :src="'http://aicamera-pic-res.ybveg.com/' + scope.row.imageUrl" @click="look('http://aicamera-pic-res.ybveg.com/' + scope.row.imageUrl)">
          </div>
          <div v-if="scope.row.aiPlatform === 'HK'">
            <el-upload  v-if="!scope.row.imageUrl||scope.row.add" class="upload-demo" :action="obj.host" :before-upload="beforeHKAvatarUpload" :on-success="HKUploadSuccess" :on-error="HKUploadError" :data="uploadData" :show-file-list="false">
              <el-button size="small" type="primary" v-if="!scope.row.imageUrl">上传</el-button>
              <img v-if="scope.row.imageUrl" style="width: 100px;height: 40px;" :src="schoolTraceBaseUrl + scope.row.imageUrl">
            </el-upload>
            <img v-if="scope.row.imageUrl&&!scope.row.add" style="width: 100px;height: 40px;" :src="schoolTraceBaseUrl + scope.row.imageUrl" @click="look(schoolTraceBaseUrl + scope.row.imageUrl)">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width='100' fixed="right">
        <template slot-scope="scope">
          <a v-if="scope.row.add" href="javascript:;" @click="save(scope.row)" class="operate-a">保存</a>
          <a v-if="scope.row.add" href="javascript:;" @click="getFaceList" class="operate-a">取消</a>
          <a v-if="!scope.row.add" href="javascript:;" @click="goDelete(scope.row)" class="operate-a">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box textR mt20">
      <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange"
        :current-page="page.pageNum" :page-sizes="[10, 20, 30]" :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>
    <div class="popupBig" v-if="lookBox">
      <div class="popupBox">
        <img :src="lookUrl">
        <p class="mt20" style="text-align: center;padding-bottom: 10px;"><el-button type="primary" @click="lookBox=false">关闭</el-button></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { getFaceList, getFaceDelete, postFaceAdd, getEnumTypes} from "api/peri/camera";
  import config from "utils/config";
  import { policy } from 'api/common';
  export default {
    mounted() {
      // ai平台类型
      getEnumTypes(['com.ybveg.govx.enums.food.camera.AiCameraTypeEnum']).then(res => {
        if(res.status === true) {
          this.facePlatformOpts = res.data
          this.facePlatformOpts.forEach((item, i) => {
            if(item.key === 'DH') {
              item.disabled = true
            }
          })
        }
      }).catch(err => {})
      // 人脸库 => 人员类型枚举
      getEnumTypes(['com.ybveg.govx.enums.food.camera.AiFaceStaffTypeEnum']).then(res => {
        if(res.status === true) {
          this.staffTypes = res.data
        }
      }).catch(err => {})
      // 人脸库 => 性别枚举
      getEnumTypes(['com.ybveg.govx.enums.SexEnum']).then(res => {
        if(res.status === true) {
          this.sexOptions = res.data
        }
      }).catch(err => {})
      this.schoolTraceBaseUrl = config.schoolTraceBaseUrl
      this.getFaceList()
    },
    methods: {
      aiPlatformChange(row) {
        row.imageUrl = ''
        row.fid = ''
      },
      addface() {
        if (this.addNum) {
          this.$message.warning('请先保存上一个')
          return
        }
        this.addNum = true;
        this.tableDataFace.unshift({
          add: true,
          aiPlatform: '',
          personName: '',
          staffType: '',
          imageUrl: '', 
          fid: '', 
          personPosition: '',
          sexEnum: ''
        });
      },
      save(row) {
        if (!row.aiPlatform){
          this.$message.error('请选择AI平台类型');
          return
        }
        if (!row.personName){
          this.$message.error('请输入姓名');
          return
        }
        if (!row.staffType){
          this.$message.error('请选择人员类型');
          return
        }
        if (!row.personPosition){
          this.$message.error('请输入职务');
          return
        }
        if (!row.imageUrl && !row.fid){
          this.$message.error('请上传人脸图');
          return
        }

        let params = new FormData();
        params.append("entityId", this.$route.query.id);
        params.append("aiPlatform", row.aiPlatform);
        params.append("personName", row.personName);
        params.append("staffType", row.staffType);
        params.append("personPosition", row.personPosition);
        params.append("imageUrl", row.imageUrl);
        params.append("sexEnum", row.sexEnum);
        params.append("fid", row.fid);
        if(row.aiPlatform === "HK") {
          params.append("file", this.HKFile)
        }
        this.tabload = true;
        postFaceAdd(params).then(r => {
          this.tabload = false;
          if (r.status) {
            row.add = false;
            this.addNum = false;
            this.$message.success('添加成功')
            this.getFaceList()
          }
        })
      },
      goDelete(row) {
        let params = {
          id: row.id
        }
        getFaceDelete(params).then(r => {
          if (r.status) {
            this.getFaceList()
            this.$message.success('删除成功')
          }
        })
      },
      getFaceList() {
        let params = {
          entityId: this.$route.query.id,
          personName: this.search,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
        }
        this.addNum = false;
        this.tabload = true;
        getFaceList(params).then(r => {
          this.tabload = false;
          if (r.status) {
            this.tableDataFace = r.data.list;
            this.page.total = r.data.total;
          } else {
            this.tableDataFace = []
          }
        })
      },
      uploadImg(file, callback) {
        if (file.status) {
          this.tableDataFace[0].imageUrl = file.data.fileId;
          this.tableDataFace[0].fid = file.data.id;
        } else {
          this.$message.error(file.message)
        }
      },
      uploadError(err, file) {
        this.$message.warning("该文件上传失败！");
      },
      beforeAvatarUpload(file) {
        //类型和大小限制
        const picType = ["jpg", "jpeg", "png"];
        let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const isJPG = picType.indexOf(testmsg) >= 0
        const isLt1M = file.size / 1024 / 1024 <= 1
        if(!isJPG) {
          this.$message.warning(`仅可上传jpg，png，jpeg格式的文件`)
        }
        if(!isLt1M) {
          this.$message.warning(`上传文件大小不能超过1M`)
        }

        const isSize = new Promise((resolve, reject) => {
          const WH = 1280;
          let _URL = window.URL || window.webkitURL
          let image = new Image()
          image.onload = function() {
            let valid = image.width <= WH && image.height <= WH
            valid ? resolve() : reject();
          };
          image.src = _URL.createObjectURL(file)
        }).then(
            () => {
              return file
            },
            () => {
              this.$message.warning("上传人脸图片尺寸不能大于1280*1280");
              return Promise.reject();
            }
          )
        return isJPG && isLt1M && isSize;
      },
      random_string(len, type) {
        //随机名字
        len = len || 32;
        var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        var maxPos = chars.length;
        var pwd = "";
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let fullDate = year + seperator1 + month + seperator1 + strDate;
        return fullDate + pwd + "." + type;
      },
      async get_signature() {
        //获取是否超时
        // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
        this.obj.now = Date.parse(new Date()) / 1000;
        let obj_ = {};
        console.log(this.obj.expire, this.obj.now);
        if (this.obj.expire < this.obj.now + 3) {
          obj_ = await this.send_request();
          this.obj.host = obj_["host"];
          this.obj.policyBase64 = obj_["policy"];
          this.obj.accessid = obj_["accessId"];
          this.obj.signature = obj_["signature"];
          this.obj.expire = parseInt(obj_["expire"]);
          this.obj.callbackbody = obj_["callback"];
          this.obj.key = obj_["dir"];
        }
      },
      async send_request() {
        //向后端得到签名
        let data = {};
        await policy().then(r => {
          if (r.status && r.data && r.data !== null) {
            data = r.data;
          }
        });
        return data;
      },
      async beforeHKAvatarUpload(file) {
        const picType = ["jpg", "jpeg", "png"];
        let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        const isJPG = picType.indexOf(testmsg) >= 0
        const isLt1M = file.size / 1024 / 1024 <= 1
        if(!isJPG) {
          this.$message.warning(`仅可上传jpg，png，jpeg格式的文件`)
        }
        if(!isLt1M) {
          this.$message.warning(`上传文件大小不能超过1M`)
        }
        const isSize = new Promise((resolve, reject) => {
          const WH = 1280;
          let _URL = window.URL || window.webkitURL
          let image = new Image()
          image.onload = function() {
            let valid = image.width <= WH && image.height <= WH
            valid ? resolve() : reject();
          };
          image.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          () => {
            this.$message.warning("上传人脸图片尺寸不能大于1280*1280");
            return Promise.reject();
          }
        )
        if(isJPG && isLt1M && isSize) {
          await this.get_signature();
          this.uploadData = {
            key: this.obj.key +
              this.random_string(
                20,
                file.type.substring(file.type.lastIndexOf("/") + 1)
              ),
            policy: this.obj.policyBase64,
            OSSAccessKeyId: this.obj.accessid,
            success_action_status: "200", //让服务端返回200,不然，默认会返回204
            callback: this.obj.callbackbody,
            signature: this.obj.signature,
            "x:original_filename": file.name
          };
        }
        return isJPG && isLt1M && isSize;
      },
      HKUploadSuccess(res, file) {
        if (res.status) {
          this.tableDataFace[0].imageUrl = res.data.fileId;
          this.tableDataFace[0].fid = res.data.id;
          this.HKFile = file.raw
        } else {
          this.$message.error(file.message)
        }
      },
      HKUploadError(err, file) {
        this.$message.warning("该文件上传失败！");
      },
      look(url) {
        this.lookUrl = url;
        this.lookBox = true;
      },
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.getFaceList();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.getFaceList();
      }
    },
    components: {},
    data() {
      return {
        page: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        lookUrl: '',
        lookBox: false,
        search: '',
        tableDataFace: [],
        addNum: false,
        tabload: false,
        facePlatformOpts: [],
        staffTypes: [],
        sexOptions: [],
        obj: {
          accessid: "",
          host: "", //地址
          policyBase64: "",
          signature: "", //时间
          expire: 0,
          callback: "",
          key: "",
          now: Date.parse(new Date()) / 1000,
          dir: "" //key
        },
        uploadData: {},
        schoolTraceBaseUrl: '',
        HKFile: null
      }
    }
  }
</script>

<style scoped lang="sass">
  .popupBig{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,.8);
    z-index: 99;
  }
  .popupBox{
    background: #fff;
    margin: 100px auto 0;
    width: 500px;
  }
  .popupBox img{
    max-width: 500px;
    max-height: 500px;
  }
  .ipt-btn-box {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
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
</style>