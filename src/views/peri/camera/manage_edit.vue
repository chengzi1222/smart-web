<template>
  <div class="user-box">
    <div class="page-tilt">
      <b></b>
      <span>编辑设备</span>
      <Back></Back>
    </div>
    <toggle-form title="主体信息">
      <div class="form-box">
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="主体名称:" prop="name">
            <span class="w200" @click="goEntity();" style="color: #1787AD;cursor:pointer" title="点击查看主体详情">{{entity.entityName}}</span>
          </el-form-item>
          <el-form-item label="分管网格:" prop="code">
            <span class="w200">{{entity.deptName}}</span>
          </el-form-item>
          <el-form-item label="经营者:" prop="type">
            <span class="w200">{{entity.corpName}}</span>
          </el-form-item>
          <el-form-item label="联系方式:" prop="remark">
            <span class="w200">{{entity.mobile}}</span>
          </el-form-item>
          <el-form-item label="经营地址:" prop="remark">
            <span class="w200" v-if="entity.entityType != 'VENDORS'">{{entity.realityAddr}}</span>
            <span class="w200" v-if="entity.entityType == 'VENDORS'">{{entity.placeBiz}}</span>
          </el-form-item>
        </el-form>
      </div>
    </toggle-form>
    <toggle-form title="摄像头管理">
      <div style="margin: 20px;">
        <div class="ipt-btn-box" style="margin-bottom: 15px; float: right;">
          <el-button v-auth="'food.peri.camera|func.add'" type="primary" icon="plus" slot="append" @click="addCamera(cameraList)" style="padding-top: 9px;">添加
          </el-button>
        </div>
        <el-table :data="cameraList" border class="table-div">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column label="直播点名称"  min-width="110">
            <template slot-scope="scope">
              <div style="position: relative;padding: 10px 0 20px;">
                <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.name"></el-input>
                <div style="position: absolute;bottom: 0;">
                  <el-tooltip v-if="nameIsNull" class="item" effect="dark" :content="scope.row.nameIsNull  + ''" placement="top-end">
                    <div style="color: #ff4949;width: 180px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.nameIsNull}}</div>
                  </el-tooltip>
                </div>
                <span v-if="!(scope.row.isEdit)">{{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="摄像头编号"  min-width="160">
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
          <el-table-column label="摄像头类型"  min-width="160">
            <template slot-scope="scope">
              <enum-select v-if="scope.row.isEdit" v-model="scope.row.type" enum="com.ybveg.govx.enums.CameraTypeEnum" @change="changeType($event, scope.$index)"  :multiple="false" :clearable="false" placeholder="请选择类型">
              </enum-select>
              <span v-else>{{scope.row.typeLabel}}</span>
            </template>
          </el-table-column>
          <el-table-column label="NVR编号"  min-width="160">
            <template slot-scope="scope">
              <div style="position: relative;padding: 10px 0 20px;">
                <el-input size="small" style="width: 120px" v-if="scope.row.isEdit&&scope.row.type!=='DH_CUSTOMIZATION'" v-model="scope.row.deviceId"></el-input>
                 <el-select v-model="scope.row.deviceId"  placeholder="请选择" @change="changeNVR($event,scope.$index)" v-if="scope.row.isEdit&&scope.row.type ==='DH_CUSTOMIZATION'">
                  <el-option v-for="item in dhDeviceList" :key="item.code" :label="item.name" :value="item"></el-option>
                </el-select>
                <div style="position: absolute;bottom: 0;">
                  <span style="color: #ff4949" v-if="deviceIdIsNull">{{scope.row.deviceIdIsNull}}</span>
                  <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.deviceId  + ''" placement="top-end">
                    <div style="width: 145px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.deviceId}}</div>
                  </el-tooltip>
                </div>
              </div> 
            </template>
          </el-table-column>
          <el-table-column label="NVR通道号"  min-width="80">
            <template slot-scope="scope">
              <div style="position: relative;padding: 10px 0 20px;">
                <el-input size="small" style="width: 120px" v-if="scope.row.isEdit && scope.row.type === 'HK'" v-model="scope.row.channel"></el-input>
                 <el-select v-model="scope.row.channel"  placeholder="请选择" v-if="scope.row.isEdit&&scope.row.type ==='DH_CUSTOMIZATION'">
                  <el-option v-for="item in selectNum" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span style="color: #ff4949" v-if="channelIsNull">{{scope.row.channelIsNull}}</span>
                <div style="position: absolute;bottom: 0;">
                  <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.channel  + ''" placement="top-end">
                    <div style="width: 50px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" >{{scope.row.channel}}</div>
                  </el-tooltip> 
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="直播流地址"  min-width="160">
            <template slot-scope="scope">
              <div style="position: relative;padding: 10px 0 20px;">
                <el-input size="small" style="width: 120px" v-if="scope.row.isEdit" v-model="scope.row.playerAddr"></el-input>
                <div style="position: absolute;bottom: 0;">
                  <span style="color: #ff4949" v-if="playerAddrIsNull">{{scope.row.playerAddrIsNull}}</span>
                  <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.playerAddr  + ''" placement="top-end">
                    <div style="width: 145px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.playerAddr}}</div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="视频预览图地址"  min-width="160">
            <template slot-scope="scope">
              <div style="position: relative;padding: 10px 0 20px;">
                <el-input size="small" style="width: 120px" maxlength="500" v-if="scope.row.isEdit" v-model="scope.row.imgAddr" :key="scope.row.imgAddr"></el-input>
                <span style="color: #ff4949" v-if="imgAddrIsNull">{{scope.row.imgAddrIsNull}}</span>
                <div style="position: absolute;bottom: 0;">
                  <el-tooltip v-if="!(scope.row.isEdit)" class="item" effect="dark" :content="scope.row.imgAddr + ''" placement="top-end">
                    <div style="width: 145px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" >{{scope.row.imgAddr}}</div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态"  min-width="80">
            <template slot-scope="scope">
              <span>{{scope.row.enableLabel}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"  min-width="200" fixed="right">
            <template slot-scope="scope">
              <a v-if="!scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="showEditCamera(cameraList, scope.row)" class="operate-a">编辑</a>
              <a v-if="!scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="delCamera(scope.row)" class="operate-a">删除</a>
              <a v-if="!scope.row.isEdit && scope.row.enable == 'YES'" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="enableCamera('NO', scope.row)" class="operate-a">禁用</a>
              <a v-if="!scope.row.isEdit && scope.row.enable == 'NO'" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="enableCamera('YES', scope.row)" class="operate-a">启用</a>
              <a v-if="scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="cancel(cameraList, scope.row);" class="operate-a">取消</a>
              <a v-if="scope.row.isEdit" href="javascript:" v-auth="'food.peri.camera|func.add'" @click="sumbitCamera(scope.row)" class="operate-a">保存</a>
              <el-upload v-if="!scope.row.isEdit" style="display: inline-block;" :on-error="sbuploadError" :data="{type: 'CAMERA_COVER'}"
                action="/api/upload" :show-file-list="false" :before-upload="sbbeforeAvatarUpload" :on-success="sbuploadImg">
                <span style="color: #1787ad;" @click='sbup(scope.row)'>上传封面</span> 
              </el-upload>
              <el-upload v-if="scope.row.isEdit" style="display: inline-block;" :on-error="sbuploadError" :data="{type: 'CAMERA_COVER'}"
                action="/api/upload" :show-file-list="false" :before-upload="sbbeforeAvatarUpload" :on-success="sbuploadImgAdd">
                <span style="color: #1787ad;" @click='sbup(scope.row)'>上传封面</span>
              </el-upload>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <yb-popup width="770" :isShow='isEntityTableShow' @close="hideEntityTable()" :title="'选择私有云'" id="popup">
        <div slot="body">
          <div style="width:680px;margin:20px auto 0;">
            <el-form :model="params" ref="entityData" label-width="100px" class="demo-ruleForm">
              <div style="margin-bottom: 20px;" class="clear_a">
                <el-input placeholder="私有云名称" class="w250 seekIpt" style="margin-right: 10px" v-model="params.search" @keyup.enter.native="handleIconClick">
                  <i slot="suffix" class="el-input__icon el-icon-search" @click="handleIconClick"></i>
                </el-input>
              </div>

              <el-table style="height:373px;overflow-y:auto;" :data="tableData" class="table-div" fit highlight-current-row @row-click="rowClick">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dhName" label="私有云名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dhServerIP" label="服务器IP"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dhServerPort" label="服务器端口"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dhUserName" label="账号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="dhUserPwd" label="密码"></el-table-column>
              </el-table>
              <div class="pagination-box">
                <el-pagination background @size-change="pageSizeChange" @current-change="pageCurrentChange" :current-page="page.pageNum"
                               :page-sizes="[5,8,10,15,20,25,30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="page.total">
                </el-pagination>
              </div>
              <br/>
              <div style="text-align:right">
                <el-form-item>
                  <el-button type="default" @click="hideEntityTable();">取消</el-button>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </div>
      </yb-popup>

      <private-camera v-for="(clouds,index) in cameraPrivateList" :key="index" :entityId="entity.entityId" :clouds="clouds" />
      <el-button class="selectHeight floatR" type="primary" v-auth="'food.patrol.record|func.add'" @click="add">
        <i style="margin-right: 5px;font-weight: 700;color: #fff;" class="el-icon-plus"></i>添加私有云
      </el-button>
    </toggle-form>
    <div style="height: 1px"></div>
    <toggle-form title="AI摄像头管理" style="margin-top: 75px;">
      <div style="margin: 20px;">
        <div class="ipt-btn-box" style="margin-bottom: 15px;">
          <el-button v-auth="'food.peri.camera|func.add'" type="primary" icon="plus" slot="append"
            @click="getCheckCamera" style="padding-top: 9px;">添加
          </el-button>
        </div>
        <el-table :data="aiCameraList" border class="table-div" v-loading="AItabLoad">
          <el-table-column type="index" label="序号" min-width="50"></el-table-column>
          <el-table-column prop="livePoint" label="直播点名称" show-overflow-tooltip min-width="150"></el-table-column>
          <el-table-column prop="liveAddress" label="直播流地址" show-overflow-tooltip min-width="150"></el-table-column>
          <el-table-column label="预览封面地址" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              {{scope.row.coverUrl ? scope.row.coverUrl : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="aIPlatformStr" label="AI平台类型" show-overflow-tooltip min-width="150"></el-table-column>
          <el-table-column label="算法模型" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              {{scope.row.models ? scope.row.models : '-'}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="aIStreamId" label="流ID" show-overflow-tooltip min-width="150"></el-table-column> -->
          <!-- <el-table-column label="分析服务" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              {{scope.row.status==0?'关闭':'开启'}}
            </template>
          </el-table-column> -->
          <el-table-column prop="" label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <a href="javascript:;" @click="editAi(scope.row)">编辑</a>
              <a href="javascript:;" @click="getDelAICamera(scope.row)">删除</a>
              <a href="javascript:;" v-if="scope.row.status==0 && scope.row.aIPlatform == 'AL'" @click="getSwitchAICamera(scope.row.id,scope.row.aIPlatform,'1','开启')">开启</a>
              <a href="javascript:;" v-if="scope.row.status==1 && scope.row.aIPlatform == 'AL'" @click="getSwitchAICamera(scope.row.id,scope.row.aIPlatform,'0','关闭')">关闭</a>
              <a href="javascript:;" @click="detailAi(scope.row)">详情</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box textR mt20">
          <el-pagination background @size-change="AIpageSizeChange" @current-change="AIpagecCurrentChange"
            :current-page="pageList.pageAI.pageNum" :page-sizes="[10, 20, 30]" :page-size="pageList.pageAI.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pageList.pageAI.total">
          </el-pagination>
        </div>
        <div class="popupBig" v-if="addAiBox||editAiBox||detailAiBox" v-loading="aiAddLoad">
          <div class="popupBox" style="width: 800px;padding-bottom: 20px;">
            <h3 class="aitit">AI摄像头{{operate}}</h3>
            <div class="row">
              <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>直播点名称：</span>
              <el-input v-if="addAiBox || editAiBox" class="w200" v-model="aiAddData.livePoint" maxlength="20" placeholder="请输入直播点名称"></el-input>
              <span v-else class="detail-text">{{aiAddData.livePoint}}</span>
            </div>
            <div class="row">
              <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>直播流地址：</span>
              <el-input v-if="addAiBox || editAiBox" :disabled="editAiBox && aiAddData.aiplatform == 'DH'" class="w260" v-model="aiAddData.liveAddress" maxlength="300" placeholder="请输入直播流地址"></el-input>
              <span v-else class="detail-text">{{aiAddData.liveAddress}}</span>
            </div>
            <div class="row">
              <span class="titspan">预览封面：</span>
              <span v-if="addAiBox || editAiBox">
                <el-input :disabled="aiAddData.fileId!=''" class="w300" v-model="aiAddData.coverUrl" maxlength="500" placeholder="输入预览封面地址，300字以内，或手动上传"></el-input>
                <el-upload class="ml20" style="display: inline-block;" action="/api/upload" :show-file-list="false"
                  :before-upload="aibeforeAvatarUpload" :on-success="aiuploadImg" :on-error="aiuploadError" :data="{type: 'CAMERA_COVER'}">
                  <el-button size="small" type="primary" v-if="aiAddData.fileId==''">上传预览封面</el-button>
                  <img v-if="aiAddData.fileId!=''" style="width: 100px;height: 40px;vertical-align: top;" 
                      :src="$store.state.common.filePath+aiAddData.fileId">
                </el-upload>
              </span>
              <span v-else class="detail-text">{{aiAddData.coverUrl ? aiAddData.coverUrl : '-'}}</span>
            </div>
            <div class="row inlB">
              <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>AI平台类型：</span>
              <el-select v-if="addAiBox || editAiBox" v-model="aiAddData.aiplatform" :disabled="editAiBox" class="w180" placeholder="请选择AI平台类型" @change="aiSelectChange">
                <el-option v-for="aiplatform in platformOptions" :key="aiplatform.key" :label="aiplatform.name" :value="aiplatform.key"></el-option>
              </el-select>
              <span v-else class="detail-text">{{aiAddData.aiplatformStr}}</span>
            </div>
            <div v-if="addAiBox || editAiBox" class="divider"></div>
            <!-- 阿里， 软件分析平台 -->
            <div v-if="aiAddData.aiplatform === 'AL'">
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>AI分析流ID：</span>
                <el-input v-if="addAiBox || editAiBox" class="w180" :disabled="editAiBox" v-model="aiAddData.aistreamId" placeholder="请输入AI分析流ID"></el-input>
                <span v-else class="detail-text">{{aiAddData.aistreamId}}</span>
              </div>
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>算法模型：</span>
                <span v-if="addAiBox" class="modelSpan mr10 movePoin" :class="aiAddData.models.indexOf(item.code)>=0?'addai':''" v-for="item in modelList" :key="item.code" @click="modelsListFun(item)">{{item.name}}</span>
                <span v-if="editAiBox" class="modelSpan mr10 editai" v-for="(item,index) in editModelList" :key="index">{{item}}</span>
                <span v-if="detailAiBox" class="detail-text">{{aiAddData.models}}</span>
              </div>
              <div class="row mb20">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>分析服务：</span>
                <el-select v-if="addAiBox || editAiBox" v-model="aiAddData.status" class="w180" placeholder="请选择">
                  <el-option label="关闭" value="0"></el-option>
                  <el-option label="开启" value="1"></el-option>
                </el-select>
                <span v-else class="detail-text">{{aiAddData.status==0? '关闭': '开启'}}</span>
              </div>
            </div>
            <!-- 海康，硬件分析平台 -->
            <div v-if="aiAddData.aiplatform === 'HK'">
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>设备序列号：</span>
                <el-input v-if="addAiBox || editAiBox" :disabled="editAiBox" class="w180" v-model="aiAddData.deviceSerial" maxlength="15" placeholder="请输入设备序列号, 1-15字"></el-input>
                <span v-else class="detail-text">{{aiAddData.deviceSerial}}</span>
              </div>
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>通道号：</span>
                <el-select v-if="addAiBox || editAiBox" :disabled="editAiBox" v-model="aiAddData.channelNo" class="w180" placeholder="请选择通道号">
                  <el-option v-for="channelNo in channelOptions" :key="channelNo.value" :label="channelNo.label" :value="channelNo.value"></el-option>
                </el-select>
                <span v-else class="detail-text">{{aiAddData.channelNo}}</span>
              </div>
              <div class="row">
                <span v-if="addAiBox || editAiBox" class="titspan"><b>*</b>算法类型：</span>
                <el-select v-if="addAiBox || editAiBox" v-model="aiAddData.typeName" class="w180" placeholder="请选择算法类型" @change="typeChange">
                  <el-option v-for="typeName in typeNameOptions" :key="typeName.key" :label="typeName.name" :value="typeName.key"></el-option>
                </el-select>
                <!-- <span v-else class="detail-text">{{aiAddData.typeName}}</span> -->
              </div>
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>算法模型：</span>
                <el-input v-if="addAiBox || editAiBox" :disabled="modelDisabled" class="w180" v-model="aiAddData.modelName" @input="inputChange" minlength="2" maxlength="20" placeholder="请输入算法模型, 2-20字符"></el-input>
                <span v-else class="detail-text">{{aiAddData.modelName}}</span>
              </div>
            </div>
            <!-- 大华 大邑分析平台 -->
            <div v-if="aiAddData.aiplatform === 'DH'">
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>学校：</span>
                <el-select v-if="addAiBox || editAiBox" :disabled="editAiBox" class="w180" v-model="aiAddData.deviceSerial" :loading="searchLoading" placeholder="请搜索并选择学校">
                  <el-option v-for="item in searchOpts" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
                <span v-else class="detail-text">{{dhSchollOpts[aiAddData.deviceSerial]}}</span>
              </div>
              <div class="row">
                <span class="titspan"><b v-if="addAiBox || editAiBox">*</b>通道号：</span>
                <el-select v-if="addAiBox || editAiBox" :disabled="editAiBox" v-model="aiAddData.channelNo" class="w180" placeholder="请选择通道号">
                  <el-option v-for="channelNo in channelOptions" :key="channelNo.value" :label="channelNo.label" :value="channelNo.value"></el-option>
                </el-select>
                <span v-else class="detail-text">{{aiAddData.channelNo}}</span>
              </div>
            </div>
            <div class="textR mt20 mr20">
              <el-button v-if="addAiBox || editAiBox" @click="aiQx">取消</el-button>
              <el-button v-else @click="aiQx">关闭</el-button>
              <el-button type="primary" v-if="addAiBox" @click="addAi">确认</el-button>
              <el-button type="primary" v-if="editAiBox" @click="editAiY">确认</el-button>
            </div>
          </div>
        </div>
      </div>
    </toggle-form>

    <toggle-form title="后厨人员头像管理">
      <div style="margin: 20px;">
        <div class="ipt-btn-box" style="justify-content: end;">
          <el-input placeholder="请输入姓名" class="w250 seekIpt" v-model="search" @keyup.enter.native="pageList.page.pageNum=1;getFaceList()">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="pageList.page.pageNum=1;getFaceList()"></i>
          </el-input>
        </div>
        <el-button @click="addface" class="w80 mt20" type="primary">添加</el-button>
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
        <div class="pagination-box textR mt20" style="margin-bottom: 80px;">
          <el-pagination background @size-change="facepageSizeChange" @current-change="facepagecCurrentChange"
            :current-page="pageList.page.pageNum" :page-sizes="[10, 20, 30]" :page-size="pageList.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="pageList.page.total">
          </el-pagination>
        </div>
        <div class="popupBig" v-if="lookBox">
          <div class="popupBox">
            <img :src="lookUrl" object-fit="cover">
            <p class="mt20" style="text-align: center;padding-bottom: 10px;">
              <el-button type="primary" @click="lookBox=false">关闭</el-button>
            </p>
          </div>
        </div>
      </div>
    </toggle-form>

    <div class="foot-btn">
      <div>
        <el-button @click="$router.go(-1);">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>

  import Back from 'utils/back.vue';		//返回上一个页面按钮
  import ToggleForm from 'components/ToggleForm';  //列表块
  import EnumSelect from 'components/common/EnumSelect';
  import YbPopup from 'components/ybpopup/YbPopup.vue'
  import PrivateCamera from './PrivateCamera';
  import { getEntity, updateCamera, getCameraListByEntityId, delCamera } from 'api/peri/camera'
  import {findPage} from "api/peri/privatecloud";
  import { getEnums, policy } from 'api/common'
  import config from "utils/config"
  import { getFaceList, getFaceDelete, postFaceAdd, getListEntityAICamera, getModel, postAddAICamera, getDelAICamera,
           postEditAICamera, getSwitchAICamera, postCoverAdd, getCheckCamera, getEnumTypes, postAddHKAICamera, getDelHKAICamera, postEditHKAICamera, updateCaremaStatus, getDHDevice, addDHAICamera, editDHAICamera } from "api/peri/camera";

  export default {
    async mounted() {
      this.entityId = this.$route.query.id;
      this.schoolTraceBaseUrl = config.schoolTraceBaseUrl
      // ai平台类型
      getEnumTypes(['com.ybveg.govx.enums.food.camera.AiCameraTypeEnum']).then(res => {
        if(res.status === true) {
          this.platformOptions = res.data
          this.facePlatformOpts = res.data
          this.facePlatformOpts.forEach((item, i) => {
            if(item.key === 'DH') {
              item.disabled = true
            }
          })
        }
      }).catch(err => {})
      // 算法类型 
      getEnumTypes(['com.ybveg.govx.enums.food.camera.HKAlgorithmTypeEnum']).then(res => {
        if(res.status === true) {
          this.typeNameOptions = res.data
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

      //主体信息
      let resultData = await getEntity(this.entityId);
      this.entity = resultData.data;

      this.getCameraListByEntityId(); //摄像头列表

      this.getListEntityAICamera();//ai列表
      this.getFaceList();//人脸库
      getModel().then(r=>{//获取模型类型
        if(r.status){
          this.modelList = r.data;
        }
      });
      this.getDHDeviceList()  //获取大华设备信息
    },
    computed: {
      operate() {
        if(this.addAiBox) {
          return "添加"
        } else if(this.editAiBox) {
          return "编辑"
        } else {
          return "详情"
        }
      }
    },
    methods: {
      async getDHDeviceList(){
        for(let i = 0; i < 31; i++){
          this.selectNum.push(i)
        }
        let result = await getDHDevice()
        this.dhDeviceList = result.data.data.data
      },
      changeNVR(item,i){
        let newValue = Object.assign(this.cameraList[i],this.cameraList[i].deviceId = item.code)
        this.$set(this.cameraList,i,newValue)
      },
      changeType(value,i){
        if(value === 'DH_CUSTOMIZATION'){
          let newValue = Object.assign(this.cameraList[i],this.cameraList[i].deviceId = '')
          this.$set(this.cameraList,i,newValue)
        }
      },
      getCheckCamera(){
        getCheckCamera(this.$route.query.id).then(r=>{
          if (r.data.state=='YES') {
            this.aiAddData.aiplatform = "AL"
            this.addAiBox = true
          } else {
            this.$message.error(r.data.state)
          }
        })
      },
      sbup(row){
        this.sbRow = row;
      },
      async getCameraListByEntityId() {
        let result = await getCameraListByEntityId(this.entityId, "edit");
        this.cameraList = result.data.pubList;
        this.cameraPrivateList = result.data.priList;
        this.flushCloudIds();//刷新cloudIds
        this.searchPage();
      },
      goEntity() {
        let type = this.entity.type.toUpperCase();
        var parentType = type;
        var entityType = this.entity.entityType.toLowerCase();
        var entityId = this.entity.entityId;
        if (parentType == 'CFDA') {
            this.$router.push({
              name: 'cfda.archives.detail',
              query: {
                id: entityId,
              }
            });
          } else if(parentType == 'ENTITY'){
            this.$router.push({
              name: "subject.archives.detail",
              params: {
                type: entityType
              },
              query: {
                id: entityId,
              }
            })
        }
      },
      addCamera(cameraList) {
        let stopCount = 0;
        cameraList.forEach(data => {
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

        cameraList.unshift({
          isEdit: true,
          isCreate: true,
          enable: 'YES',
          entityId: this.entityId,
          imgAddr: ''
        });
      },
      showEditCamera(cameraList, row) {
        this.cloneRow.name = row.name;
        this.cloneRow.deviceId = row.deviceId;
        this.cloneRow.playerAddr = row.playerAddr;
        this.cloneRow.imgAddr = row.imgAddr;
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
      cancel(cameraList, row) {
        if (row.isEdit && row.isCreate) {
          cameraList.shift();
          row.isEdit = false;
          row.isCreate = false;
        } else {
          this.deviceIdIsNull = false;
          row.name = this.cloneRow.name;
          row.deviceId = this.cloneRow.deviceId;
          row.playerAddr = this.cloneRow.playerAddr;
          row.imgAddr = this.cloneRow.imgAddr;
          row.isEdit = false;
        }
      },
      enableCamera(enable, row) {
        row.enable = enable;

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

            this.getCameraListByEntityId();
          }
        });
      },
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
          row.deviceIdIsNull = '请输入设备编号';
          return false;
        }
        if (!row.playerAddr) {
          this.playerAddrIsNull = true;
          row.playerAddrIsNull = '请输入直播地址';
          return false;
        }
        if(row.playerAddr.match("[\u4e00-\u9fa5]")){
          this.playerAddrIsNull = true;
          row.playerAddrIsNull = '请输入正确直播地址';
          return false;
        }
        this.playerAddrIsNull = false;
        if(!row.type){
          this.typeIsNull = true;
          row.playerAddrIsNull = '请选择摄像头类型';
          return false;
        }
        this.imgAddrIsNull = false;
        if (row.type === 'HK') {
          if (!row.channel) {
            this.channelIsNull = true
            row.channelIsNull = '通道号不能为空'
            return false
          }
          if (!/([1-9]?\d|100)$/.test(row.channel)) {
            this.channelIsNull = true
            row.channelIsNull = '请输入正确通道号'
            return false
          }
        }
        this.channelIsNull = false
        updateCamera(row).then((result) => {
          if (result.status) {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            row.isEdit = false;
            row.isCreate = false;

            this.getCameraListByEntityId();
          }
        });

      },
      //刷新cloudIds
      flushCloudIds(){
        let privateList = this.cameraPrivateList
        let cloudIds = [];
        for(let i=0;i < privateList.length;i++){
          cloudIds.push(privateList[i].cloudId)
        }
        this.cloudIds = cloudIds;
      },
      delCamera(row) {
        this.$confirm('是否确认删除该设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCamera(row).then((result) => {
            if (result.status) {
              this.$message({
                message: '成功删除设备.',
                type: 'success'
              });
            }
            this.getCameraListByEntityId();
          })
        });
      },
      add(){
        this.isEntityTableShow = true;
      },
      //隐藏关闭弹窗
      hideEntityTable() {
        this.isEntityTableShow = false;
      },
      //条件查询
      handleIconClick(){
        this.searchPage();
      },
      searchPage() {
        this.loading = true;
        let params = this.params;
        params.cloudIds = this.cloudIds;
        findPage(params,this.page.pageNum,this.page.pageSize).then((result) => {
          this.loading = false;
          result.data.pageNum = result.data.pageNum == 0 ? 1 : result.data.pageNum;
          this.page.total = result.data.total;
          this.tableData = result.data.list;
        });
      },
      //点击选择私有云
      rowClick(row, event) {
        let cameraPrivateList = this.cameraPrivateList;
        cameraPrivateList.push({"cloudId":row.cloudId,"dhName":row.dhName});
        this.cameraPrivateList = cameraPrivateList;
        //隐藏弹窗
        this.hideEntityTable();
        //刷新cloudIds
        this.flushCloudIds();
        //查询私有云
        this.searchPage();
      },
      pageCurrentChange(num) {
        this.page.pageNum = num;
        this.searchPage();
      },
      pageSizeChange(size) {
        this.page.pageSize = size;
        this.searchPage();
      },
      aiPlatformChange(row) {
        row.imageUrl = ''
        row.fid = ''
      },
      inputChange() {
        this.$forceUpdate()
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
          pageNum: this.pageList.page.pageNum,
          pageSize: this.pageList.page.pageSize,
        }
        this.addNum = false;
        this.tabload = true;
        getFaceList(params).then(r => {
          this.tabload = false;
          if (r.status) {
            this.tableDataFace = r.data.list;
            this.pageList.page.total = r.data.total;
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
      facepagecCurrentChange(num) {
        this.pageList.page.pageNum = num;
        this.getFaceList();
      },
      facepageSizeChange(size) {
        this.pageList.page.pageSize = size;
        this.getFaceList();
      },
      AIpagecCurrentChange(num) {
        this.pageList.pageAI.pageNum = num;
        this.getListEntityAICamera();
      },
      AIpageSizeChange(size) {
        this.pageList.pageAI.pageSize = size;
        this.getListEntityAICamera();
      },
      getListEntityAICamera(){
        let params = {
          entityId: this.$route.query.id,
          pageNum: this.pageList.pageAI.pageNum,
          pageSize: this.pageList.pageAI.pageSize
        }
        this.AItabLoad = true;
        getListEntityAICamera(params).then(r=>{
          this.AItabLoad = false;
          if(r.status){
            this.aiCameraList = r.data.list;
            this.pageList.pageAI.total = r.data.total;
          }
        })
      },
      modelsListFun(item){
        if(this.aiAddData.models.indexOf(item.code)>=0){
          this.aiAddData.models.splice(this.aiAddData.models.indexOf(item.code),1)
        }else {
          this.aiAddData.models.push(item.code)
        }
      },
      aiSelectChange(aiplatform) {
        if(aiplatform === 'DH') {
          for(let i = 0; i <= 30; i++) {
            this.channelOptions.push({
              label: "通道" + i ,
              value: i + ''
            })  
          }
          this.searchOpts = this.dhDeviceList;
        } else {
          for(let i = 1; i <= 30; i++) {
            this.channelOptions.push({
              label: "通道" + i ,
              value: i + ''
            })
          }
        }
      },
      typeChange(val) { 
        if(val === "GENERAL") { // 普通算法
          this.aiAddData.modelName = ''
          this.modelDisabled = false
        } else { // 校长陪餐/陌生人
          this.typeNameOptions.forEach(item => {
            if(item.key === val) {
              this.aiAddData.modelName = item.name
            }
          })
          this.modelDisabled = true
        }
      },
      addAi(){
        if (!this.aiAddData.livePoint){
          this.$message.error('请输入直播点名称');
          return
        }
        if (!this.aiAddData.liveAddress) {
          this.$message.error('直播流地址');
          return
        }
        if (!this.aiAddData.aiplatform) {
          this.$message.error('请选择AI平台类型');
          return
        }
        if (this.aiAddData.aiplatform === 'AL') {
          if (!this.aiAddData.aistreamId) {
            this.$message.error('请输入AI分析流ID');
            return
          }
          if (this.aiAddData.models.length<=0) {
            this.$message.error('请选择算法模型');
            return
          }
          if (!this.aiAddData.status) {
            this.$message.error('请选择分析服务');
            return
          }
        } else if (this.aiAddData.aiplatform === 'HK') {
          if (!this.aiAddData.deviceSerial) {
            this.$message.error('请输入设备序列号');
            return
          }
          if (!this.aiAddData.channelNo) {
            this.$message.error('请输入通道号');
            return
          }
          if (!this.aiAddData.typeName) {
            this.$message.error('请选择算法类型');
            return
          }
          if (!this.aiAddData.modelName) {
            this.$message.error('请输入算法模型');
            return
          }
        } else {
          if (!this.aiAddData.deviceSerial) {
            this.$message.error('请搜索并选择学校');
            return
          }
          if (!this.aiAddData.channelNo) {
            this.$message.error('请输入通道号');
            return
          }
        }
        this.aiAddData.entityId = this.$route.query.id;
        this.aiAddLoad = true;
        let postAddPromise;
        let paramsData = {
          aiplatform: this.aiAddData.aiplatform,
          coverUrl: this.aiAddData.coverUrl,
          entityId: this.aiAddData.entityId,
          fileId: this.aiAddData.fileId,
          liveAddress: this.aiAddData.liveAddress,
          livePoint: this.aiAddData.livePoint,
        };
        switch (this.aiAddData.aiplatform) {
          case "AL":
            paramsData.aistreamId = this.aiAddData.aistreamId;
            paramsData.models = this.aiAddData.models;
            paramsData.status = this.aiAddData.status;
            postAddPromise = postAddAICamera(paramsData);
            break;
          case "HK": 
            paramsData.modelName = this.aiAddData.modelName;
            paramsData.channelNo = this.aiAddData.channelNo;
            paramsData.deviceSerial = this.aiAddData.deviceSerial;
            postAddPromise = postAddHKAICamera(paramsData);
            break;
          case "DH":
            paramsData.channelNo = this.aiAddData.channelNo;
            paramsData.deviceSerial = this.aiAddData.deviceSerial;
            postAddPromise = addDHAICamera(paramsData);
            break;
          default:
        }
        postAddPromise.then(r=>{
          this.aiAddLoad = false;
          if(r.status){
            this.$message.success('添加成功');
            this.aiAddData = {
              aiplatform: '',
              aistreamId: '',
              coverUrl: '',
              entityId: '',
              fileId: '',
              liveAddress: '',
              livePoint: '',
              models: [],
              status: '',
              deviceSerial: '',
              channelNo: '',
              modelName: ''
            }
            this.addAiBox = false;
            this.getListEntityAICamera();
          }
        })
      },
      editAi(row){
        this.aiAddData = {
          aiplatform: row.aIPlatform,
          coverUrl: row.coverUrl,
          id: row.id,
          fileId: '',
          liveAddress: row.liveAddress,
          livePoint: row.livePoint,
        }
        if(this.aiAddData.aiplatform === "AL") {
          this.aiAddData.aistreamId = row.aIStreamId
          this.aiAddData.models = row.models
          this.editModelList = row.models.replace(eval('/ /g'),'').split(',')
          this.aiAddData.status = row.status+''
        } else if(this.aiAddData.aiplatform === "HK") {
          this.aiAddData.deviceSerial = row.deviceSerial
          this.aiAddData.channelNo = row.channelNo
          this.aiAddData.modelName = row.models
        } else {
          this.aiAddData.deviceSerial = row.deviceSerial
          this.aiAddData.channelNo = row.channelNo
          this.searchOpts = this.dhDeviceList
        }
        this.editAiBox = true;
      },
      editAiY(){
        if (!this.aiAddData.livePoint){
          this.$message.error('请输入直播点名称');
          return
        }
        if (!this.aiAddData.liveAddress) {
          this.$message.error('直播流地址');
          return
        }
        if (this.aiAddData.aiplatform === 'AL') {
          if (!this.aiAddData.aistreamId) {
            this.$message.error('请输入AI分析流ID');
            return
          }
          if (this.aiAddData.models.length<=0) {
            this.$message.error('请选择算法模型');
            return
          }
          if (!this.aiAddData.status) {
            this.$message.error('请选择分析服务');
            return
          }
        } else if (this.aiAddData.aiplatform === 'HK') {
          if (!this.aiAddData.deviceSerial) {
            this.$message.error('请输入设备序列号');
            return
          }
          if (!this.aiAddData.channelNo) {
            this.$message.error('请输入通道号');
            return
          }
          if (!this.aiAddData.typeName) {
            this.$message.error('请选择算法类型');
            return
          }
          if (!this.aiAddData.modelName) {
            this.$message.error('请输入算法模型');
            return
          }
        } else {
          if (!this.aiAddData.deviceSerial) {
            this.$message.error('请搜索并选择学校');
            return
          }
          if (!this.aiAddData.channelNo) {
            this.$message.error('请输入通道号');
            return
          }
        }
        this.aiAddLoad = true;
        let postEditPromise;
        let paramsData = {
          coverUrl: this.aiAddData.coverUrl,
          id: this.aiAddData.id,
          fileId: this.aiAddData.fileId,
          livePoint: this.aiAddData.livePoint,
        };
        switch (this.aiAddData.aiplatform) {
          case "AL":
            paramsData.liveAddress = this.aiAddData.liveAddress;
            paramsData.status = this.aiAddData.status;
            postEditPromise = postEditAICamera(paramsData);
            break;
          case "HK": 
            paramsData.liveAddress = this.aiAddData.liveAddress;
            paramsData.modelName = this.aiAddData.modelName;
            postEditPromise = postEditHKAICamera(paramsData);
            break;
          case "DH":
            postEditPromise = editDHAICamera(paramsData);
            break;
          default:
        }
        postEditPromise.then(r => {
          this.aiAddLoad = false;
          if (r.status) {
            this.$message.success('编辑成功');
            this.aiAddData = {
              aiplatform: '',
              aistreamId: '',
              coverUrl: '',
              entityId: '',
              id: '',
              fileId: '',
              liveAddress: '',
              livePoint: '',
              models: [],
              status: '',
              deviceSerial: '',
              channelNo: '',
              modelName: ''
            }
            this.editAiBox = false;
            this.getListEntityAICamera();
          }
        })
      },
      aiQx(){
        this.aiAddData = {
          aiplatform: '',
          aistreamId: '',
          coverUrl: '',
          entityId: '',
          fileId: '',
          liveAddress: '',
          livePoint: '',
          models: [],
          status: '',
          deviceSerial: '',
          channelNo: '',
          modelName: ''
        }
        this.addAiBox = false;
        this.editAiBox = false;
        this.detailAiBox = false;
      },
      aiuploadImg(file, callback) {
        if (file.status) {
          this.aiAddData.fileId = file.data.fileId;
          this.aiAddData.coverUrl = file.data.fileId;
        } else {
          this.$message.error(file.message)
        }
      },
      aiuploadError(err, file) {
        this.$message.warning("该文件上传失败！");
      },
      aibeforeAvatarUpload(file) {
        //类型和大小限制
        var picType = ["jpg", "jpeg", "png"];
        var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        if (picType.indexOf(testmsg) < 0) {
          this.$message.warning(`仅可上传jpg，png，jpeg格式的文件`);
          return false;
        }
        if (file.size / 1024 / 1024 > 10) {
          this.$message.warning(`上传文件大小不能超过10M`);
          return false;
        }
      },
      getDelAICamera(row){
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let getDelPromise = row.aiplatform === 'AL' ? 
                              getDelAICamera({ id: row.id }) : 
                              getDelHKAICamera({ id: row.id })
          getDelPromise.then(r => {
            if(r.status){
              this.$message.success('删除成功')
              this.getListEntityAICamera();
            }
          })
        })
      },
      getSwitchAICamera(id,platform,status,txt){
        this.$confirm('是否确认'+ txt +'AI分析服务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id,
            status: status
          }
          // let switchAIPromise = platform === 'AL' 
          //                     ? getSwitchAICamera(params) 
          //                     : updateCaremaStatus(params);
          let switchAIPromise = getSwitchAICamera(params);
          switchAIPromise.then(r => {
            if (r.status) {
              this.getListEntityAICamera();
              this.$message.success(txt + '成功');
            }
          })
        })
      },
      // 详情
      detailAi(row) {
        this.aiAddData = {
          aiplatform: row.aIPlatform,
          aiplatformStr: row.aIPlatformStr,
          coverUrl: row.coverUrl,
          id: row.id,
          fileId: '',
          liveAddress: row.liveAddress,
          livePoint: row.livePoint
        }
        if(this.aiAddData.aiplatform === "AL") {
          this.aiAddData.aistreamId = row.aIStreamId
          this.aiAddData.models = row.models
          this.editModelList = row.models.replace(eval('/ /g'),'').split(','),
          this.aiAddData.status = row.status + ''
        } else if(this.aiAddData.aiplatform === "HK") {
          this.aiAddData.deviceSerial = row.deviceSerial
          this.aiAddData.channelNo = row.channelNo
          this.aiAddData.modelName = row.models
        } else {
          this.aiAddData.deviceSerial = row.deviceSerial
          this.aiAddData.channelNo = row.channelNo
          this.dhSchollOpts = {}
          this.dhDeviceList.forEach(item => {
            this.dhSchollOpts[item.code] = item.name
          })
        }
        this.detailAiBox = true;
      },
      sbuploadImg(file, callback) {
        if (file.status) {
          let params = new FormData();
          params.append('id', this.sbRow.id)
          params.append('fId', file.data.id)
          params.append('imgUrl', file.data.fileId)
          // let params = {
          //   id: this.sbRow.id,
          //   fId: file.data.id,
          //   imgUrl: file.data.fileId
          // }
          postCoverAdd(params).then(r=>{
            if(r.status){
              this.$message.success('上传成功');
              this.getCameraListByEntityId();
            }
          })
        } else {
          this.$message.error(file.message)
        }
      },
      sbuploadImgAdd(file, callback) {
        if (file.status) {
          this.$message.success('上传成功');
          this.sbRow.imgAddr = this.$store.state.common.filePath + file.data.fileId;
        } else {
          this.$message.error(file.message)
        }
      },
      sbuploadError(err, file) {
        this.$message.warning("该文件上传失败！");
      },
      sbbeforeAvatarUpload(file) {
        //类型和大小限制
        var picType = ["jpg", "jpeg", "png"];
        var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
        if (picType.indexOf(testmsg) < 0) {
          this.$message.warning(`仅可上传jpg，png，jpeg格式的文件`);
          return false;
        }
        if (file.size / 1024 / 1024 > 10) {
          this.$message.warning(`上传文件大小不能超过10M`);
          return false;
        }
      },
      
    },
    data() {
      return {
        sbRow: {},
        options:[],
        modelList: [],
        editModelList: [],
        aiAddLoad: false,
        AItabLoad: false,
        addAiBox: false,
        editAiBox: false,
        detailAiBox: false,
        aiAddData:{
          aiplatform: '',
          aistreamId: '',
          coverUrl: '',
          entityId: '',
          fileId: '',
          liveAddress: '',
          livePoint: '',
          models: [],
          status: '',
          deviceSerial: '',
          channelNo: '',
          typeName: '',
          modelName: ''
        },
        deviceMess:"",
        entity: {},
        cameraList: [],
        cameraPrivateList:[],
        cameraTypeList: [],
        nameIsNull: false,
        noIsNull: false,
        playerAddrIsNull:false,
        imgAddrIsNull:false,
        typeIsNull:false,
        deviceIdIsNull:false,
        channelIsNull: false,
        cloneRow:{},
        isEntityTableShow:false,
        params:{},
        page:{
          pageNum:1,
          pageSize:10,
          total:0
        },
        tableData:[],
        cloudIds:[],
        pageList: {
          page: {
            pageNum: 1,
            pageSize: 10,
            total: 0
          },
          pageAI: {
            pageNum: 1,
            pageSize: 10,
            total: 0
          }
        },
        lookUrl: '',
        lookBox: false,
        search: '',
        tableDataFace: [],
        addNum: false,
        tabload: false,
        modelDisabled: false,
        aiCameraList: [],
        facePlatformOpts: [],
        platformOptions: [],
        channelOptions: [],
        typeNameOptions: [],
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
        HKFile: null,
        searchLoading: false,
        searchOpts: [],
        dhDeviceList:[],
        selectNum:[],
        dhSchollOpts: {}
      }
    },
    components: {
      Back, ToggleForm, EnumSelect,PrivateCamera,YbPopup
    }
  }
</script>

<style lang="scss" scoped>
  .user-box {
    margin-bottom: 100px;
    position: relative;
  }
  .form-box {
    width: 460px;
    margin: 0 auto 40px;
    overflow: hidden;
  }
  .table-div {
    width: 100%;
    text-align: center;
  }
  .operate-a {
    color: #1787ad;
  }
  .popupBig{
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,.8);
    z-index: 998;
  }
  .popupBox{
    background: #fff;
    margin: 100px auto 0;
    width: 500px;
    .aitit{
      padding-left: 20px;
      line-height: 40px;
      height: 40px;
      font-weight: 500;
    }
    .row{
      margin: 20px 50px 0;
      word-break: break-all;
      .titspan{
        display: inline-block;
        width: 100px;
        text-align: right;
        b{
          color: red;
        }
      }
      .modelSpan{
        display: inline-block;
        padding: 10px;
        border: 1px solid #ccc;
      }
    }
    .inlB{
      display: inline-block;
      width: 37%;
    }
    .divider {
      width: 90%;
      height: 1px;
      border-radius: 1px;
      margin: 20px 0 0 50%;
      transform: translate(-50%);
      background-color: #333333;
    }
    .detail-text {
      color: #606266;
    }
  }
  .popupBox img{
    max-width: 500px;
    max-height: 500px;
    margin-left: 50%;
    transform: translate(-50%);
  }
  .w180{
    width: 180px;
  }
  .addai{
    background: #0db5ef;
    color: #fff;
  }
  .editai {
    background: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
  }
 
</style>
