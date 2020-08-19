<template>
  <div style="margin: 20px; margin-bottom: 200px;">
    <p>私有云名称：{{clouds.dhName}}</p>
    <div class="ipt-btn-box" style="margin-bottom: 15px; float: right;">
      <el-button v-auth="'food.peri.camera|func.add'" type="primary" icon="plus" slot="append" @click="addCameraPrivate(list)" style="padding-top: 9px;">添加
      </el-button>
    </div>
    <el-table :data="list" class="table-div">
      <el-table-column type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column label="直播点名称" min-width="120">
        <template slot-scope="scope">
          <div style="position: relative;padding: 10px 0 20px;">
            <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.name"></el-input>
            <div style="position: absolute;bottom: 0;">
              <el-tooltip v-if="nameIsNull" class="item" effect="dark" :content="scope.row.nameIsNull" placement="top-end">
                <div style="color: #ff4949;width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.nameIsNull}}</div>
              </el-tooltip>
            </div>
            <span v-if="!(scope.row.isEdit)">{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="摄像头编号" min-width="120">
        <template slot-scope="scope">
          <div style="position: relative;padding: 10px 0 20px;">
            <el-input size="small" style="width: 120px" v-if="scope.row.isCreate" v-model="scope.row.no"></el-input>
            <div style="position: absolute;bottom: 0;">
              <span style="color: #ff4949" v-if="noIsNull">{{scope.row.noIsNull}}</span>
            </div>
            <span v-if="!(scope.row.isCreate)">{{scope.row.no}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="摄像头类型" min-width="140">
        <template slot-scope="scope">
          <enum-select v-if="scope.row.isEdit" v-model="scope.row.type" enum="com.ybveg.govx.enums.CameraPrivateTypeEnum" :multiple="false" :clearable="false" placeholder="请选择类型">
          </enum-select>
          <span v-else>{{scope.row.typeStr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="摄像头地址" min-width="160">
        <template slot-scope="scope">
          <div style="position: relative;padding: 10px 0 20px;">
            <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.playerAddr"></el-input>
            <div style="position: absolute;bottom: 0;">
              <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.playerAddr" placement="top-end">
                <div style="width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.playerAddr}}</div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="视频截图地址" min-width="160">
        <template slot-scope="scope">
          <div style="position: relative;padding: 10px 0 20px;">
            <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.imgAddr"></el-input>
            <div style="position: absolute;bottom: 0;">
              <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.imgAddr" placement="top-end">
                <div style="width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" >{{scope.row.imgAddr}}</div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="通道号" min-width="140">
        <template slot-scope="scope">
          <div style="position: relative;padding: 10px 0 20px;">
            <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.deviceId"></el-input>
            <div style="position: absolute;bottom: 0;">
              <span style="color: #ff4949" v-if="deviceIdIsNull">{{scope.row.deviceIdIsNull}}</span>
              <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.deviceId" placement="top-end">
                <div style="width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.deviceId}}</div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="40">
        <template slot-scope="scope">
          <span>{{scope.row.enableStr}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <a v-if="!scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="showEditCamera(list, scope.row)" class="operate-a">编辑</a>

          <a v-if="!scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="delCamera(scope.row)" class="operate-a">删除</a>

          <a v-if="!scope.row.isEdit && scope.row.enable == 'YES'" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="enableCamera('NO', scope.row)" class="operate-a">禁用</a>

          <a v-if="!scope.row.isEdit && scope.row.enable == 'NO'" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="enableCamera('YES', scope.row)" class="operate-a">启用</a>

          <a v-if="scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="cancel(list, scope.row);" class="operate-a">取消</a>

          <a v-if="scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="sumbitCamera(scope.row)" class="operate-a">保存</a>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>

import EnumSelect from 'components/common/EnumSelect';
import {updateCamera,findCameraList,delCamera} from "api/peri/privatecloud";

export default {
  components: {
    EnumSelect
  },
  async mounted() {
    this.findCameraList();
  },
  props: {
    entityId:{
      required: true,
      type:String,
    },
    clouds:{
      required: true,
      type:Object,
    }
  },
  methods:{
    findCameraList(){
      findCameraList(this.entityId,this.clouds.cloudId).then((result)=>{
        if(result.status){
          this.list = result.data;
        }
      })
    },
    addCameraPrivate(list) {
      let stopCount = 0;
      list.forEach(data => {
        if (data.isEdit || data.isCreate) {
          stopCount++;
        }
      });
      if (stopCount > 0) {
        this.$message({
          message: '请完成之前的保存.',
          type: 'error'
        });
        return false;
      }
      list.unshift({
        isEdit: true,
        isCreate: true,
        enable: 'YES',
        entityId: this.entityId
      });
    },
    cancel(cameraList, row) {
      if (row.isEdit && row.isCreate) {
        cameraList.shift();
        row.isEdit = false;
        row.isCreate = false;
      } else {
        row.name = this.cloneRow.name;
        row.deviceId = this.cloneRow.deviceId;
        row.isEdit = false;
      }
    },
    //修改
    sumbitCamera(row) {
      if (!row.name) {
        this.nameIsNull = true;
        row.nameIsNull = '请输入名称';
        return false;
      }
      this.nameIsNull = false;
      if (!row.no) {
        this.noIsNull = true;
        row.noIsNull = '请输入编码';
        return false;
      }
      this.noIsNull = false;
      if (!row.deviceId) {
        this.deviceIdIsNull = true;
        row.deviceIdIsNull = '请输入通道号';
        return false;
      }
      if(!row.type){
        this.typeIsNull = true;
        row.playerAddrIsNull = '请选择摄像头类型';
        return false;
      }
      this.typeIsNull = false;
      row.cloudId = this.clouds.cloudId;
      row.entityId = this.entityId;
      updateCamera(row).then((result) => {
        if (result.status) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          row.isEdit = false;
          row.isCreate = false;
          this.findCameraList();
        }
      });
    },
    //禁用，启用
    enableCamera(enable, row) {
      row.enable = enable;
      row.entityId = this.entityId;
      updateCamera(row).then((result) => {
        if (result.status) {
          let enableStr = '';
          if (enable == 'YES') {
            enableStr = '启用';
          } else {
            enableStr = '禁用';
          }
          this.$message({
            message: enableStr + '成功',
            type: 'success'
          });
          this.findCameraList();
        }
      });
    },
    //编辑
    showEditCamera(cameraList, row) {
      this.cloneRow.name = row.name;
      this.cloneRow.deviceId = row.deviceId;
//      this.cloneRow.type = row.type;
      let stopCount = 0;
      cameraList.forEach(data => {
        if (data.isEdit || data.isCreate) {
          stopCount++;
        }
      });
      if (stopCount > 0) {
        this.$message({
          message: '请完成之前的操作.',
          type: 'error'
        });
        return false;
      }
      this.$set(row, "isEdit", true);
    },
    //删除
    delCamera(row) {
      this.$confirm('是否确认删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCamera(this.clouds.cloudId,this.entityId,row.cameraId).then((result) => {
          if (result.status) {
            this.$message({
              message: '成功删除设备.',
              type: 'success'
            });
          }
          this.findCameraList();
        })
      });
    },
  },
  data() {
    return {
      nameIsNull: false,
      noIsNull: false,
      typeIsNull:false,
      deviceIdIsNull:false,
      list:[],
      cloneRow:{},
    }
  },
}
</script>
