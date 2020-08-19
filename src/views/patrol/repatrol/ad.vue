<style lang="sass">
  .mT35 .el-table__header-wrapper {
    display: none;
  }

  .mT35 .firsTeit .el-table__header-wrapper {
    display: block;
  }

  .mT35 .el-table {
    border-top: none !important;
  }

  .mT35 .firsTeit {
    border-top: 1px solid #ebeef5 !important;
  }

  .detail table {
    width: calc(100% - 270px) !important;
  }
</style>

<template>
  <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)"
    class="bigbox">
    <div style="margin-top:20px;border-left:3px solid  #0DB5EF;">
      <span v-if="curd === 'add'" style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">添加整改复查记录</span>
      <span v-if="curd === 'detail'" style="margin-left:10px;font-size: 16px;color: #393939;font-weight:bolder;">检查记录详情</span>
    </div>
    <div class="container">
      <!-- 左边信息悬浮栏 -->
      <div v-show="curd === 'add'" class="left-info">
        <div class="head-block">
          <span>信息完成度:<span class="num" style="margin-left:20px;">{{percent}}%</span></span>
          <el-progress :percentage="percent" style="margin-top:5px;"></el-progress>
        </div>
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
            <p class="floatR right"><span>{{item.successNum}}</span>/<span>{{item.totalNum}}</span></p>
          </li>
        </ul>
      </div>
      <div v-show="curd === 'detail'" :class="curd === 'detail'?'marNo':''" class="left-info">
        <ul class="main-block">
          <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
            <p class="floatL left">{{item.title}}</p>
          </li>
        </ul>
      </div>
      <!-- 左边信息悬浮栏 end-->
      <div class="right-info">
        <div class="diva" style="cursor: pointer;" @click="goPatrolDetail">查看检查记录</div>
        <el-form :model="repatrol" :rules="rules" ref="repatrol" label-width="110px" class="demo-ruleForm">
          <!-- 基础信息 -->
          <toggle-form title="基础信息">
            <div class="content">
               <div class="row" v-if="curd != 'add'">
                <el-form-item label="复查记录编号:">
                  <span :key="curd + '-repatrolRecordNo'">{{initRepatrol.repatrolRecordNo}}</span>
                </el-form-item>
                <el-form-item :label="initRepatrol.rectificationTypeLabel ==='线上整改'?'线上审核时间':'线下复查时间'">
                  <span :key="curd + '-repatrolTime'">{{initRepatrol.repatrolTime}}</span>
                </el-form-item>
              </div>
               <div class="row">
                <el-form-item label="监管人员:" prop="patrolSoId">
                  <el-select v-if="curd === 'add'" :key="curd + '-patrolSoId'" v-model="repatrol.patrolSoId" style="width: 180px;" placeholder="请选择监管人员">
                    <el-option @change="blurCount" v-for="item in soList" :key="item.id" :label="item.realName" :value="item.id" :disabled="item.disabled">
                    </el-option>
                  </el-select>
                  <span v-if="curd === 'detail'" :key="curd + '-soUserName'">{{basicInfoData.patrolSoIdStr}}</span>
                </el-form-item>
                <el-form-item label="陪同监管人员:">
                  <el-select v-if="curd === 'add'" :key="curd + '-personList'" collapse-tags multiple multiple-limit=5 v-model="personList" style="width: 280px;" placeholder="请选择信息员">
                    <el-option v-for="item in infoList" :key="item.id" :label="item.realName" :value="item.id" :disabled="item.disabled">
                    </el-option>
                  </el-select>
                  <div v-if="personListRequired" style="color: #f56c6c; font-size: 12px;">请选择信息员</div>
                  <span v-if="curd === 'detail'" :key="curd + '-infoAssiUserName'">
                    <span v-for="(item,index) in basicInfoData.messengerList" :key="index">{{item.messengerStr}}<span v-if="index<basicInfoData.messengerList.length-1">，</span></span>
                  </span>
                </el-form-item>
              </div>
               <div class="row" v-if="curd != 'add'">
                <el-form-item label="整改方式:">
                  <span :key="curd + '-rectificationTypeLabel'">{{initRepatrol.rectificationTypeLabel}}</span>
                </el-form-item>
                <!-- <el-form-item label="整改截止日期:">
                  <span :key="curd + '-sourceRectifyTime'">{{initRepatrol.sourceRectifyTime}}</span>
                </el-form-item> -->
              </div>
              <div class="row">
                <el-form-item label="主体名:">
                  <span :key="curd + '-entityName'">{{initRepatrol.entityName}}</span>
                </el-form-item>
                <el-form-item label="主体类型:">
                  <span :key="curd + '-entityTypeLabel'">{{initRepatrol.entityTypeLabel}}</span>
                </el-form-item>
              </div>
               <div class="row">
                <el-form-item label="许可备案号:">
                  <span :key="curd + '-license'">{{initRepatrol.license}}</span>
                </el-form-item>
              </div>
               <div class="row ww">
                <el-form-item label="检查时间:">
                  <span :key="curd + '-sourceTime'">{{initRepatrol.sourceTime}}</span>
                </el-form-item>
                 <el-form-item label="检查结果:">
                  <span :key="curd + '-sourceResultLabel'">{{initRepatrol.sourceResultLabel}}</span>
                </el-form-item>
              </div>
              <div class="row">
                <el-form-item label="复查时间:" prop="repatrolTime" v-if="curd === 'add'">
                  <el-date-picker @change="timeChange"  style="width: 210px;" v-model="repatrol.repatrolTime" type="datetime"
                    placeholder="选择复查时间" :picker-options="pickerOptions0" value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="复查时间:" prop="repatrolTime" v-if="curd === 'detail'&&initRepatrol.rectificationTypeLabel === '线上整改'">
                  <span :key="curd + '-repatrolTime'" >{{initRepatrol.repatrolTime}}</span>
                  <!-- <span :key="curd + '-sourceRectifyTime'" style="font-size: 12px;color: #A2AAB6;">（复查截止日期{{initRepatrol.sourceRectifyTime}}）</span> -->
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="不合格项数:">
                  <span :key="curd + '-initContext.count'">{{initContext.count}}</span>
                </el-form-item>
                <el-form-item label="重点不合格项数:" label-width="130px">
                  <span :key="curd + '-initContext.importantCount'">{{initContext.importantCount}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="整改任务来源:">
                  <span :key="curd + '-sourceTypeLabel'">{{initRepatrol.sourceTypeLabel}}</span>
                </el-form-item>
              </div>
               <div class="row" v-if="curd === 'detail'">
                <el-form-item label="整改人:">
                  <span :key="curd + '-initRepatrol.guardPersonName'">{{initRepatrol.guardPersonName?initRepatrol.guardPersonName:'暂无'}}</span>
                </el-form-item>
                <el-form-item label="整改人联系方式:" label-width="130px">
                  <span :key="curd + '-initRepatrol.guardMobile'">{{initRepatrol.guardMobile?initRepatrol.guardMobile:'暂无'}}</span>
                </el-form-item>
              </div>

              <!-- <div class="row">
                <el-form-item label="巡查备注:">
                  <div class="block over-y" style="margin-top: 8px;">
                    {{initRepatrol.sourceRemark}}
                  </div>
                </el-form-item>
              </div> -->
            </div>
          </toggle-form>

          <!-- 巡查项 -->
          <toggle-form title="检查项（仅显示本次检查的巡查项）">
            <div class="mT35" v-if="tableList && curd === 'detail'">
              <el-table v-for="(item,index) in tableList" :key="index" :class="index==0?'firsTeit':''" :data="item" :span-method="objectSpanMethod"
                border class="table-div brN">
                <el-table-column show-overflow-tooltip prop="projectNo" label="检查项编号" min-width="100"></el-table-column>
                <el-table-column show-overflow-tooltip prop="projectName" label="巡查项目"  min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="contextNo" label="巡查内容编号"  min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容"  min-width="250"></el-table-column>
                <el-table-column show-overflow-tooltip prop="importantLabel" label="是否重点项"  min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值"  min-width="60"></el-table-column>
                <el-table-column prop="initQualLabel" label="检查结果"  min-width="140">
                  <template slot-scope="scope">
                    {{scope.row.initQual==='YES'?'检查通过':'检查不通过'}}
                  </template>
                </el-table-column>
                  <el-table-column label="附件"  min-width="140" v-if="initRepatrol.rectificationTypeLabel ==='线下整改'">
                  <template slot-scope="scope">
                    <div class="accessoryList" v-if="scope.row.itemPic.length>0">
                      <span class="movePoin" @mouseenter="accessoryDetailList($event,scope.row)" @mouseleave="accessoryListElse"><i
                          class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="整改图片"  min-width="140" v-if="initRepatrol.rectificationTypeLabel ==='线上整改'">
                  <template slot-scope="scope">
                    <el-image  v-if="scope.row.itemPic.length > 0" style="width: 100px; height: 100px"
                       :src="filePath + scope.row.itemPic[0].fileId" :preview-src-list="scope.row.itemPic.map(item =>{return filePath+item.fileId})">
                    </el-image>
                  </template>
                </el-table-column>
                  <el-table-column show-overflow-tooltip prop="description" label="整改说明"  v-if="initRepatrol.rectificationTypeLabel ==='线上整改'" min-width="100"></el-table-column>
                <el-table-column prop="remark" label="备注"  min-width="80"></el-table-column>
              </el-table>
              <div class="zj">
                <span>总计：</span>
                <span :key="curd">{{initRepatrol.scoreFull}}分</span>
              </div>
            </div>

            <div class="mT35" v-if="tableList && curd === 'add'">
              <el-table v-for="(item,index) in tableList" :key="item.id" :class="index==0?'firsTeit':''" :data="item" :span-method="objectSpanMethod"
                border class="table-div brN">
                <el-table-column show-overflow-tooltip prop="projectNo" label="检查项编号" min-width="100"></el-table-column>
                <el-table-column show-overflow-tooltip prop="projectName" label="巡查项目" min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="contextNo" label="巡查内容编号" min-width="120"></el-table-column>
                <el-table-column show-overflow-tooltip prop="context" label="巡查内容" min-width="250"></el-table-column>
                <el-table-column show-overflow-tooltip prop="importantLabel" label="是否重点项" min-width="80"></el-table-column>
                <el-table-column show-overflow-tooltip prop="score" label="分值" min-width="60"></el-table-column>
                <el-table-column align="center" label="是否检查通过" min-width="185">
                  <template slot-scope="scope">
                    <single-checkbox :currentRowData="scope.row" @singlecheckboxchange="singlecheckboxchange"></single-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="备注" min-width="140">
                  <template slot-scope="scope">
                    <input type="text" class="w140" v-model="scope.row.remark" :disabled="!scope.row.qual" placeholder="备注前先选择是否检查通过">
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件" min-width="80">
                  <template slot-scope="scope">
                    <el-upload action="/api/upload" :before-upload="beforeUpPic" :on-success="picSuccess" :data="{type:'PATROL_RECORD',field:'PHOTO'}"
                      :show-file-list="false">
                      <el-button type="default" style="background:#F6F7F8;margin-right:20px;" @click="getRow(scope.row)">上传</el-button>
                    </el-upload>
                  </template>
                </el-table-column>
                   <el-table-column label="附件" min-width="160">
                  <template slot-scope="scope" v-if="scope.row.isShowFile">
                    <div class="accessoryList">
                      <span class="movePoin" @mouseenter="accessoryList($event,scope.row)" @mouseleave="accessoryListElse"><i
                          class="el-icon-picture-outline"></i>&nbsp;附件列表</span>
                    </div>
                  </template>
                </el-table-column>

              </el-table>
              <div class="zj">
                <span>总计：</span>
                <span>{{contextStat.scoreTotal}}分</span>
              </div>
            </div>
            <span v-if="contextListRequired" style="color: #f56c6c; font-size: 12px;">请选择至少一项巡查内容</span>
          </toggle-form>

          <!-- 经营信息 -->
          <toggle-form title="检查结果">
            <div class="content">
              <div class="row ml30" style="margin-left: 40px;">
                <span :key="curd + '-contextStat.contextCount'" style="color: #6D7787;">本次复查，共复查问题项共{{contextStat.contextCount}}项，其中包含重点项{{contextStat.importantCount}}项目，经复查：</span>
              </div>
              <div class="row result ml30">
                <div class="item">
                  <div :key="curd + '-contextStat.qualCount'" class="number">{{contextStat.qualCount}}</div>
                  <div class="project-name">合格项</div>
                </div>
                <div class="item">
                  <div :key="curd + '-contextStat.unqualCount'" class="number">{{contextStat.unqualCount}}</div>
                  <div class="project-name">不合格项</div>
                </div>
                <div class="item">
                  <div :key="curd + '-contextStat.unqualImportantCount'" class="number">{{contextStat.unqualImportantCount}}</div>
                  <div class="project-name">重点项不合格</div>
                </div>
              </div>
              <div class="row ml30" style="margin: 20px 0"  v-if="curd === 'add'">
                <span style="font-size: 18px;color: #393939;">企业得分：</span><span :key="curd +'-contextStat.scoredTotal'" style="color: #0DB5EF;font-size: 18px; ">{{contextStat.scoredTotal}}分</span>
                <span :key="curd + '-contextStat.scoreTotal'" style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{contextStat.scoreTotal}}分，此评分仅供参考）</span>
              </div>
              <div class="row ml30" style="margin: 20px 0"  v-if="curd === 'detail'">
                <span style="font-size: 18px;color: #393939;">企业得分：</span><span :key="curd +'-contextStat.scoredTotal'" style="color: #0DB5EF;font-size: 18px; ">{{initRepatrol.score}}分</span>
                <span :key="curd + '-contextStat.scoreTotal'" style="font-size: 12px;color: #A2AAB6;margin-left: 40px;">（满分：{{initRepatrol.scoreFull}}分，此评分仅供参考）</span>
              </div>
              <div class="row mRno">
                <el-form-item label="复查结果：" prop="result">
                  <el-radio-group v-if="curd === 'add'" @change="blurCount" v-model="repatrol.result" size="medium">
                    <el-radio-button label="QUALIFIED">符合</el-radio-button>
                    <el-radio-button label="PASSED">基本符合</el-radio-button>
                    <el-radio-button label="DISQUALIFIED">不符合</el-radio-button>
                  </el-radio-group>
                  <span v-if="curd === 'detail'">{{initRepatrol.resultLabel}}</span>
                </el-form-item>
              </div>
              <div class="row mRno">
                <el-form-item label="处理方式：" prop="treat">
                  <el-radio-group v-if="curd === 'add'"  @change="blurCount" v-model="repatrol.treat" size="medium">
                    <el-radio-button label="NORMAL" :disabled="repatrol.result !== 'QUALIFIED' &&repatrol.result !== 'PASSED'" >复查通过</el-radio-button>
                    <el-radio-button label="TIME_LIMIT_RECTIFICATION" :disabled="repatrol.result !== 'DISQUALIFIED'">再次限期整改</el-radio-button>
                    <el-radio-button label="INVESTIGATION_AND_TREATMENT" :disabled="repatrol.result !== 'DISQUALIFIED'" v-if="$store.state.common.user.areaCode != '220581'">调查处理</el-radio-button>
                  </el-radio-group>
                  <span v-if="curd === 'detail'">{{initRepatrol.treatLabel}}</span>
                  <div v-if="treatNotNull" style="color: #f56c6c; font-size: 12px;">请选择处理方式</div>
                </el-form-item>
              </div>

              <div v-if="curd === 'add' && repatrol.treat === 'TIME_LIMIT_RECTIFICATION'" class="row">
                <el-form-item label="整改期限：" prop="">
                  <el-date-picker class="w200" value-format="yyyy-MM-dd" v-model="repatrol.rectifyTime" type="date" placeholder="选择整改期限">
                  </el-date-picker>
                  <div v-if="rectifyTimeNotNull" style="color: #f56c6c; font-size: 12px;">选择整改期限</div>
                </el-form-item>
              </div>

              <div v-if="curd === 'detail' && initRepatrol.treat === 'TIME_LIMIT_RECTIFICATION'" class="row">
                <el-form-item label="整改截止日期：" prop="">
                  <span>{{initRepatrol.rectifyTime}}</span>
                </el-form-item>
              </div>

              <div class="row">
                <el-form-item label="复查记录备注：">
                  <el-input v-if="curd === 'add'" v-model="repatrol.remark" class="w250" type="textarea" placeholder="如有需要请输入备注" :rows="4">
                  </el-input>
                  <span v-if="curd === 'add'" style="font-size: 12px;color: #A2AAB6;">(选填)</span>
                  <span v-if="curd === 'detail'" class="over-y">{{initRepatrol.remark}}</span>
                </el-form-item>
              </div>

              <div v-if="curd === 'add'" class="row">
                <el-form-item label="上传图片：" prop="">
                  <el-upload action="/api/upload" :data="{type:'REPATROL_RECORD', field: 'PHOTO'}" list-type="picture-card" :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                  </el-upload>

                  <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <p class="bz" style="margin-top: 10px;">图片格式：png，jpg，jpeg</p>
                  <p class="bz">图片大小：每张图片小于10M</p>
                  <p class="bz">此项为选填项</p>
                </el-form-item>
              </div>

              <!-- <div v-if="curd === 'detail'" class="row">
                <el-form-item label="上传图片：" prop="">
                  <div class="imgbox">
                    <div v-for="(item,index) in resultData.photo" :key="index" @click.stop="ifbig(item)" class="imgdiv">
                      <img :src="filePath + item" alt="">
                      <span>预览</span>
                    </div>
                  </div>
                  <div class='big-img' v-show="showBigPic" @click.stop="ifbig('-1')">
                    <img :src="bigImgSrc">
                  </div>
                  <div v-if="resultData.photo.length == 0">
                    <span>无</span>
                  </div>
                </el-form-item>
              </div> -->

              <div v-if="curd === 'add'" class="row mRno">
                <el-form-item label="企业电子签名：" prop="isCooperate">
                  <el-radio-group v-model="repatrol.isCooperate" size="medium">
                    <el-radio-button label="NO">企业拒绝配合</el-radio-button>
                    <el-radio-button label="YES">企业配合上传</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-upload :file-list="sign" v-if="repatrol.isCooperate === 'YES'" action="/api/upload" list-type="picture-card" :on-success="handleSignSuccess"
                  :on-error="uploadError" :data="{type:'REPATROL_RECORD', field: 'SIGN'}" :before-upload="beforeSignUpload"
                  :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :limit="1">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>

              <div v-if="curd === 'detail'" class="row">
                <el-form-item label="企业电子签名：" prop="">
                  <span v-if="resultData.sign.length === 0">企业拒绝配合</span>
                  <span v-if="resultData.sign.length !== 0">企业配合</span>
                  <div v-if="resultData.sign.length !== 0" @click.stop="ifbigq()" class="imgdiv" :class="ifbigqy?'imgbig':''">
                    <img :src="filePath + resultData.sign" alt="">
                    <span>预览</span>
                  </div>
                </el-form-item>
              </div>

            </div>
          </toggle-form>
        </el-form>
      </div>
    </div>

    <!-- 操作成功弹窗 -->
    <yb-popup @close="close" :isShow="isShow" title="操作提示" width="350">
      <div slot="body" style="height:100px;line-height:100px;padding:0 20px;font-size:16px;">
        操作成功！
      </div>
      <div slot="foot">
        <el-button type="defalut" @click="$router.push({name: 'patrol.repatrol.list'});">返回</el-button>
        <el-button type="primary" @click="goDetail()">查看详情</el-button>
      </div>
    </yb-popup>

    <!-- 底部按钮 -->
    <div class="foot-btn" style="z-index:1">
      <div>
        <el-button v-if="curd === 'detail'" @click="goBack" style="width:120px;">返回</el-button>
         <el-button v-if="curd === 'detail'&& from === 'not'&& rectificationType === '线上整改'" v-auth="'food.peri.repatrol|func.add'" @click="goAudit(auditId)" style="width:120px;">去审核</el-button>
        <!-- <el-button v-if="curd === 'detail'" @click="printRecord(repatrolRecordId, true);" style="width:120px;">打印预览</el-button>
        <el-button v-if="curd === 'detail'" @click="printRecord(repatrolRecordId, false);" style="width:120px;">打印</el-button> -->
        <el-button v-if="curd === 'add'" @click="$router.push({name: 'patrol.repatrol.list'});" style="width:120px;">取消</el-button>
        <el-button v-if="curd === 'add'" :disabled="updateSuccess" type="primary" @click="updateRepatroRecord">确认并提交</el-button>
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="imgNameBox" :style="imgNameStyle" v-if="accessoryListIf" @mouseenter="accessoryListIf = true" @mouseleave="accessoryListIf = false">
      <div v-if="curd === 'add'">
        <p v-for="item in itemPicList" :key="item.id">
          <span @click="showPic(item.picSrc)">
            <a href="javascript:" style="color: #1787AD;text-decoration: underline;">
              {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
            </a>
          </span>
          <span @click="deletePic(item.id,item.contextId)" style="color: #1787AD;cursor:pointer;"> 删除</span>
        </p>
      </div>
      <div v-if="curd === 'detail'">
        <p v-for="item in itemPicList" :key="item.fileId" @click="showPic(item.fileId)" style="color: #1787AD;text-decoration: underline;" class="movePoin">
          {{item.fileName.length>24?(item.fileName.substring(0,12)+'...'+item.fileName.substring(item.fileName.length-12,item.fileName.length)):item.fileName}}
        </p>
      </div>
    </div>
    <popup-pic v-if="showPicIf" @close="closePopupBody">
      <img :src="filePath+this.picSrc" style="max-height: 500px;" />
    </popup-pic>

    <PrintPatrol v-if="curd === 'detail'" ref="PrintPatrol" :basicInfoData="basicInfoDataPrint" :messengers="messengersPrint"
      :patrolData="patrolDataPrint" :patrolContent="patrolContentPrint" :resultData="resultDataPrint" :patrolType="'整改复查'"
      :qrcodeId="qrcodeId"></PrintPatrol>
  </div>
</template>

<script>
  import ToggleForm from "components/ToggleForm.vue";
  import SingleCheckbox from "components/SingleCheckbox.vue";
  import scroll from "utils/scroll";
  import YbPopup from 'components/ybpopup/YbPopup.vue'
  import { listFile } from "api/common";
  import {
    getBasicInfo,
    getBasicInfoR,
    getRepatrolRecord,
    listRepatrolRecordContext,
    update
  } from "api/patrol/repatrol";
  import popupPic from 'components/popup/PopupPic';
  import { removeFile } from 'api/cfda/add'

  import { doPrintRecord } from 'utils/print/doPrint.js';
  import PrintPatrol from '../record/PrintPatrol.vue';

  function getType(entityType) {
    let type;
    if (entityType === 'PRODUCT') {
      type = 'ENTITY'
    } else if (entityType === 'CIRCULATION') {
      type = 'ENTITY'
    } else if (entityType === 'RESTAURANT') {
      type = 'ENTITY'
    } else if (entityType === 'WORKSHOP') {
      type = 'CFDA'
    } else if (entityType === 'SALE') {
      type = 'CFDA'
    } else if (entityType === 'CFDARESTAURANT') {
      type = 'CFDA'
    } else if (entityType === 'VENDORS') {
      type = 'CFDA'
    }
    return type;
  }

  export default {
    components: {
      ToggleForm,
      SingleCheckbox,
      YbPopup,
      popupPic,
      PrintPatrol
    },

    async mounted() {
      scroll.call(this, 'slideIndex');

      this.filePath = this.$store.getters.filePath;
      this.curd = this.$route.params.curd;
      this.repatrolRecordId = this.$route.params.repatrolRecordId;
      this.auditId = this.$route.query.id
      this.rectificationType = this.$route.query.type
      this.from = this.$route.query.from
      await getRepatrolRecord(this.repatrolRecordId).then((result) => {
        if (result && result.status) {
          this.initRepatrol = result.data;
          this.type = getType(this.initRepatrol.entityType);
        }
      })

      await listRepatrolRecordContext(this.initRepatrol.sourceId, 'NO').then((result) => {
        if (result && result.status) {
          let datas = result.data;
          if (!datas) {
            this.$message.error('未配置巡查项！');
            return false;
          }
          if (this.curd === 'add') {
            datas.forEach(context => {
              context.remark = "";
            })
          }
          let lis = [];
          let tablis = [];
          for (var i = 0; i < datas.length; i++) {
            if (lis.indexOf(datas[i].projectId) < 0) {
              lis.push(datas[i].projectId);
            }
          }
          for (var i = 0; i < lis.length; i++) {
            var tabdata = [];
            for (var j = 0; j < datas.length; j++) {
              if (datas[j].projectId == lis[i]) {
                tabdata.push(datas[j]);
              }
            }
            tablis.push(tabdata);
          }
          this.tableList = tablis;

          this.initContext.contextList = result.data;
          this.initContext.count = this.initContext.contextList.length;
          this.initContext.importantCount = 0;
          this.initContext.contextList.forEach(context => {
            this.contextStat.scoreTotal += context.score;
            if (context.important === 'YES') {
              this.initContext.importantCount++;
            }
          });
        }
      })


      await getBasicInfo(this.initRepatrol.entityId, this.type, '').then((result) => {
        if (result && result.status) {

          const data = result.data
          this.soList = data.soList;
          this.infoList = data.infoList;

          if (this.curd === 'detail') {
            this.infoAssiUserName = data.entity.infoAssiUserName;
            this.soUserName = data.entity.soUserName;
          }

          //如果后端返回的是区级上级督查，则选择
          if (data.patrolDept == 'county') {
              //监管员默认登录用户
              this.repatrol.patrolSoId = this.$store.getters.user.id
              for (var i in data.infoList) {
                  if (data.infoList[i].id != this.$store.getters.user.id) {
                      this.personList.push(data.infoList[i].id);
                      break;
                  }
              }
          } else {
              this.repatrol.patrolSoId = data.entity.so;
              this.personList.push(data.entity.infoAssi);
          }
        }
      })

      if (this.curd === 'detail') {

        await getBasicInfoR(this.repatrolRecordId, this.patrolType).then(d => {
          this.basicInfoData = d.data;
        });

        await listRepatrolRecordContext(this.repatrolRecordId).then((result) => {   //TODO
          if (result && result.status) {
            let datas = result.data;
            if (!datas) {
              this.$message.error('未配置巡查项！');
              return false;
            }
            let lis = [];
            let tablis = [];
            for (var i = 0; i < datas.length; i++) {
              if (lis.indexOf(datas[i].projectId) < 0) {
                lis.push(datas[i].projectId);
              }
            }
            for (var i = 0; i < lis.length; i++) {
              var tabdata = [];
              for (var j = 0; j < datas.length; j++) {
                if (datas[j].projectId == lis[i]) {
                  tabdata.push(datas[j]);
                }
              }
              tablis.push(tabdata);
            }
            this.tableList = tablis;

            this.initContext.contextList = result.data;
            this.contextStat.scoreTotal = this.initRepatrol.score;
            this.initContext.contextList.forEach(context => {
              this.contextStat.contextCount++;
              if (context.important === 'YES') {
                this.contextStat.importantCount++;
              }
              if (context.initQual === 'YES') {
                this.contextStat.qualCount++;
              } else if (context.initQual === 'NO') {
                this.contextStat.duceTotal += context.score;
                this.contextStat.unqualCount++;
                if (context.important === 'YES') {
                  this.contextStat.unqualImportantCount++;
                }
              }
            });
            this.contextStat.scoredTotal = this.contextStat.scoreTotal - this.contextStat.duceTotal
          }
        })

        await listFile(this.repatrolRecordId).then(fileList => {
          fileList.data.forEach(file => {
            if (file.colu === 'PHOTO') {
              this.resultData.photo.push(file.fileId);
            } else if (file.colu === 'SIGN') {
              this.resultData.sign.push(file.fileId);
            }
          })
        })
      }

      if (this.curd === 'add') {
        this.blurCount();
      }
    },
    methods: {
      goAudit(id){
        this.$router.push({name:'patrol.repatrol.audit',query:{repatrolId:id}})
      },
      timeChange() {
        let timeNum = Date.parse(this.repatrol.repatrolTime) + (86400 * 15 * 1000);
        let dates = new Date(timeNum);
        let mon = dates.getMonth() + 1;         //getMonth()返回的是0-11，则需要加1
        if (mon <= 9) {                                     //如果小于9的话，则需要加上0
          mon = "0" + mon;
        }
        let day = dates.getDate();                   //getdate()返回的是1-31，则不需要加1
        if (day <= 9) {                                     //如果小于9的话，则需要加上0
          day = "0" + day;
        }
        this.repatrol.rectifyTime =  dates.getFullYear() + "-" + mon + "-" + day;
      },
      //企业是否配合上传单选
      radioCooperateChange(val) {
        this.repatrol.isCooperate = (val == '企业配合上传' ? 'yes' : 'no');

        this.blurCount();
      },
      //点击已上传的文件链接
      handlePictureCardPreview(file) {
        this.imageUrl = file.url;
        this.dialogVisible = true;
      },
      //删除图片
      removePic(file, fileList) {
        const url = file.url;
        for (let i = 0; i < this.fileIdList.length; i++) {
          let obj = this.fileIdList[i];
          if (obj.url == url) {
            this.fileIdList.splice(i, 1);
            break;
          }
        }
      },
      //图片上传失败
      uploadError() {
        this.$message.error('图片上传失败！');
      },
      ifbig(item) {
        let i = this.pathFile + item
        if (this.bigImgSrc == null || this.bigImgSrc != i) {
          this.bigImgSrc = i;
          this.showBigPic = true;
        } else {
          this.bigImgSrc = null;
        }
        if (item == -1) {
          this.showBigPic = false;
        }
      },
      ifbigq() {
        this.ifbigqy = !this.ifbigqy;
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        let rownum = 0;
        for (var i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].indexOf(row) >= 0) {
            rownum = this.tableList[i].length;
            break;
          }
        }
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % rownum == 0) {
            return {
              rowspan: rownum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      updateRepatroRecord() {
        this.$refs['repatrol'].validate((valid) => {
          if (this.personList.length === 0) {
            this.personListRequired = true;
            return false;
          } else {
            this.personListRequired = false;
          }
          let contextList = [];
          this.initContext.contextList.forEach(context => {
            if (context.qual !== undefined && context.qual !== '') {
              context.patrolRecordId = this.repatrolRecordId;
              contextList.push(context);
            }
          })

          if (this.repatrol.treat === undefined ||
          this.repatrol.treat === null ||
          this.repatrol.treat === '') {
            this.treatNotNull = true
            return false
          } else {
            this.treatNotNull = false
          }

          if (contextList.length === 0) {
            this.contextListRequired = true;
            return false;
          } else {
            this.contextListRequired = false;
          }

          if (this.repatrol.treat === 'TIME_LIMIT_RECTIFICATION') {
            if (this.repatrol.rectifyTime === undefined ||
            this.repatrol.rectifyTime === null) {
              this.rectifyTimeNotNull = true
              return false
            } else {
              this.rectifyTimeNotNull = false
            }

            let counttemp = 0;
            contextList.forEach(context => {
              if (context.qual === 'NO') {
                counttemp++;
              }
            })
            if (counttemp <= 0) {
              this.$message({
                message: '处理方式为再次限期整改,需选择至少一条巡查不符合项.',
                type: 'warning'
              })
              return false
            }
          }

          if (this.repatrol.isCooperate === 'YES') {
            let hasSign = false;
            for (let i = 0; i < this.fileIdList.length; i++) {
              if (this.fileIdList[i] === this.signId) {
                hasSign = true;
                break;
              }
            }
            if (!hasSign) {
              this.$message({
                message: '请添加签名文件.',
                type: 'warning'
              })
              return false
            }
          }

          if (valid) {
            this.$confirm('是否要提交复查记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let contextList = [];
              this.initContext.contextList.forEach(context => {
                  context.patrolRecordId = this.repatrolRecordId;
                  //图片
                  if (this.photoJson[context.id]) {
                    let jsons = this.photoJson[context.id];
                    let IdList = [];
                    for (let json of jsons) {
                      IdList.push(json.id)
                    }
                    context.itemPhotoUri = IdList;
                  }
                  context.qual = context.qual=='NO'? context.qual:'YES'
                  contextList.push(context);
              })

              this.repatrol.score = this.contextStat.scoredTotal;
              this.repatrol.importantNo = this.contextStat.unqualImportantCount;
              this.repatrol.normalNo = this.contextStat.unqualCount;
              this.repatrol.entityId = this.initRepatrol.entityId;

              this.repatrol.id = this.repatrolRecordId;

              //若企业拒绝签名，提交前检查并删除签名文件
              if (this.repatrol.isCooperate === "NO") {
                for (let i = 0; i < this.fileIdList.length; i++) {
                  if (this.fileIdList[i] === this.signId) {
                    this.fileIdList.splice(i, 1);
                    break;
                  }
                }
              }

              let updateParam = {
                repatrol: this.repatrol,
                personList: this.personList,
                contextList: contextList,
                fileIdList: this.fileIdList
              };
              update(updateParam).then(result => {
                if (result && result.status) {
                  this.$message({
                    message: '添加成功.',
                    type: 'success'
                  })
                  this.detailRepatrolRecordId = result.data;
                  this.isShow = true;
                } else {
                  this.$message({
                    message: result.message,
                    type: 'error'
                  })
                }
              })
            })
          }
        })
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

      beforeAvatarUpload(file) {
        let fileType = file.type.split("/")[1];
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          this.$message({
            message: '请上传正确格式的图片(图片格式：png，jpg，jpeg)',
            type: 'error'
          })
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
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      handleSignSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.fileIdList.push(res.data.id);

        if (res.data.colu === "SIGN") {
          this.signId = res.data.id;
        }
      },
      beforeSignUpload(file) {
        let fileType = file.type.split("/")[1];

        const isPic = fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg';
        const isSize = file.size / 1024 / 1024 > 10;

        if (isPic) {
          this.$message.error('请上传正确格式的图片(图片格式：png，jpg，jpeg)')
        }
        if (isSize) {
          this.$message.error('上传图片大小不能超过 10MB!');
        }
        return !isPic && !isSize;
      },

      singlecheckboxchange(args) {
        this.$set(args.row, 'qual', args.result);
        this.contextStat = {
          scoreTotal: this.contextStat.scoreTotal,
          contextCount: 0,
          importantCount: 0,
          qualCount: 0,
          unqualCount: 0,
          unqualImportantCount: 0,
          duceTotal: 0,
        },

          this.initContext.contextList.forEach(context => {
            if (context.qual !== undefined && context.qual !== '') {
              this.contextStat.contextCount++;
              if (context.qual === 'YES') {
                this.contextStat.qualCount++;
              }
              if (context.qual === 'NO') {
                this.contextStat.duceTotal += context.score;
                this.contextStat.unqualCount++;
                if (context.important === 'YES') {
                  this.contextStat.unqualImportantCount++;
                }
              }
              if (context.important === 'YES') {
                this.contextStat.importantCount++;
              }

              if (this.contextList.indexOf(context) === -1) {
                this.contextList.push(context);
              }
            } else {
              var index = this.contextList.indexOf(context)
              this.contextList.splice(index, 1);
            }
          })
        this.contextStat.scoredTotal = this.contextStat.scoreTotal - this.contextStat.duceTotal + 0;

        this.blurCount();
      },

      blurCount(rule, value, callback) {

        if (callback) {
          callback();
        }

        let cnt1 = 0;
        if (this.repatrol.repatrolTime) cnt1++;
        if (this.repatrol.patrolSoId != '') cnt1++;
        if (this.infoList.length > 0) cnt1++;
        this.progress[0].successNum = cnt1;

        cnt1 = 0;
        if (this.contextList.length > 0) {
          cnt1 = 1;
        } else {
          cnt1 = 0;
        }
        this.progress[1].successNum = cnt1;

        cnt1 = 0;
        if (this.repatrol.result) cnt1++;
        if (this.repatrol.treat) cnt1++;
        this.progress[2].successNum = cnt1;

        let total = 0;
        let success = 0;
        for (let i = 0; i < this.progress.length; i++) {
          total += this.progress[i].totalNum;
          success += this.progress[i].successNum;
        }
        this.percent = new Number(((success / total) * 100).toFixed(0)) * 1;
      },

      //弹窗
      close() {
        this.isShow = false;
      },

      goPatrolDetail() {
        if (this.initRepatrol.sourceType === 'DAILY') {
          this.$router.push(
            { path: '/biz/patrol/repatrol/detail', query: { recordId: this.initRepatrol.sourceId, patrolType: "DAILY" } })
        } else if (this.initRepatrol.sourceType === 'REPATROL') {
          this.$router.push(
            { name: 'patrol.repatrol.ad', params: { 'curd': 'detail', 'repatrolRecordId': this.initRepatrol.sourceId } })
        } else {
          this.$router.push(
            { path: '/biz/patrol/repatrol/detail', query: { recordId: this.initRepatrol.sourceId, patrolType: "SPECIAL" } })
        }
      },

      goDetail() {
        this.isShow = false;
        this.$router.push({ name: 'patrol.repatrol.ad', params: { 'curd': 'detail', 'repatrolRecordId': this.detailRepatrolRecordId } })
      },
      //判断数组是否包含字符串
      IsInArray(arr, val) {
        var testStr = arr.join(",");
        return testStr.indexOf(val) != -1;
      },
      beforeUpPic(file) {
        //类型和大小限制
        var picType = ["bmp", "jpg", "png", "jpeg"];
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (!this.IsInArray(picType, testmsg)) {
          this.$message.warning(`仅可上传bmp,jpg,png,jpeg格式的图片`);
          return false;
        }
        if (file.size / 1024 / 1024 > 10) {
          this.$message.warning(`上传图片大小不能超过10M`);
          return false;
        }
        //个数限制
        let id = this.rowId;
        let list = this.photoJson[id];
        if (this.photoJson[id]) {
          if (list.length > 3) {
            this.$message.warning(`当前限制选择 4 个文件，本次选择了 1 个文件，共选择了 ${list.length} 个文件`);
            return false;
          }
        }
      },
      //add鼠标移入显示附件列表
      accessoryList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 5 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = this.photoJson[content.id];
        this.row_ = content;
      },
      //detail鼠标移入显示附件列表
      accessoryDetailList(_e, content) {
        let event = _e ? _e : window.event;
        this.accessoryListIf = true;
        this.imgNameStyle.top = event.clientY + 1 + 'px';
        this.imgNameStyle.left = event.clientX - 215 + 'px';
        this.itemPicList = content.itemPic;
      },
      //鼠标移除隐藏附件列表
      async accessoryListElse() {
        this.accessoryListIf = false;
      },
      //图片上传成功
      picSuccess(file, fileList) {
        //图片地址
        let fileId = file.data.id;
        //图片名称
        let fileName = file.data.fileName;
        //图片地址
        let picSrc = file.data.fileId
        let id = this.rowId;
        let array = [];
        let json = {};
        if (!this.photoJson[id]) {
          json["id"] = fileId;
          json["fileName"] = fileName;
          json["picSrc"] = picSrc;
          json["contextId"] = id;
          array.push(json);
          this.photoJson[id] = array;
        } else {
          json["id"] = fileId;
          json["fileName"] = fileName;
          json["picSrc"] = picSrc;
          json["contextId"] = id;
          array = this.photoJson[id];
          array.push(json)
          this.photoJson[id] = array;
        }
        this.$set(this.row_, 'isShowFile', true);
        this.$message.success('图片上传成功！');
      },
      getRow(row) {
        this.rowId = row.id;
        this.row_ = row;
      },
      //显示巡查项图片
      showPic(picSrc) {
        this.picSrc = picSrc;
        this.showPicIf = true;
      },
      //关闭巡查项图片
      closePopupBody() {
        this.showPicIf = false;
      },
      //删除图片
      deletePic(id, itemId) {
        this.$confirm('是否确认删除该图片吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          removeFile(id).then(res => {
            let itemPicList = this.photoJson[itemId];
            let newItemPicList = [];
            for (let obj of itemPicList) {
              if (id != obj.id) {
                newItemPicList.push(obj);
              }
            }
            if (newItemPicList.length == 0) {
              this.$set(this.row_, 'isShowFile', false);
            }
            //更新记录列表
            this.photoJson[itemId] = newItemPicList;
            //更新显示列表
            this.itemPicList = newItemPicList;
            this.$message.success('图片删除成功！');
          })
        })
      },
      /* 打印 */
      async printInitData(id, type) {
        this.qrcodeId = id;

        await getRepatrolRecord(id).then((result) => {
          if (result && result.status) {
            this.type = getType(result.data.entityType);
            this.resultDataPrint = result.data;
            if (!this.resultDataPrint.planName) {
              this.resultDataPrint.planName = "复查整改";
            }
            this.resultDataPrint.recordNo = this.resultDataPrint.repatrolRecordNo;
            if (this.resultDataPrint.rectifyTime) {
              if (this.resultDataPrint.rectifyTime.indexOf(" ") > 0) {
                let rectifyTimeStr = this.resultDataPrint.rectifyTime.split(' ')[0];
                let rectifyTimeArr = [];
                if (rectifyTimeStr.indexOf("-") > 0) {
                  rectifyTimeArr = rectifyTimeStr.split('-');
                } else if (rectifyTimeStr.indexOf("/") > 0) {
                  rectifyTimeArr = rectifyTimeStr.split('/');
                }
                if (rectifyTimeArr != []) {
                  this.resultDataPrint.rectifyTime = rectifyTimeArr[0] + "年" + rectifyTimeArr[1] + "月" + rectifyTimeArr[2] + "日";
                }
              }
            }
          }
        })

        await listFile(this.repatrolRecordId).then(fileList => {
          fileList.data.forEach(file => {
            if (file.colu === 'SIGN') {
              this.resultDataPrint.sign = file.fileId;
            }
          })
        })

        await getBasicInfo(this.resultDataPrint.entityId, this.type, '').then((d) => {
          if (d && d.status) {
            this.basicInfoDataPrint.entityName = d.data.entity.entityName;
            this.basicInfoDataPrint.licenseNumber = d.data.entity.licenseNumber;
            this.basicInfoDataPrint.spaceAddr = d.data.entity.spaceAddr;
            this.basicInfoDataPrint.corpName = d.data.entity.corpName;
            this.basicInfoDataPrint.mobile = d.data.entity.mobile;
            this.basicInfoDataPrint.patrolTime = this.initRepatrol.repatrolTime;
            this.basicInfoDataPrint.areaCode=d.data.entity.areaCode
          }
        });

        await getBasicInfoR(this.repatrolRecordId, this.patrolType).then(d => {
          this.messengersPrint = "";
          d.data.messengerList.forEach(messenger => {
            this.messengersPrint += messenger.messengerStr + "、"
          })
          this.basicInfoDataPrint.patrolSoIdStr = d.data.patrolSoIdStr
          this.messengersPrint = this.messengersPrint.substr(0, this.messengersPrint.length - 1);
        });

        await listRepatrolRecordContext(id, '').then(d => {
          this.patrolDataPrint = JSON.parse(JSON.stringify(this.patrolDataInitPrint));
          this.patrolContentPrint = JSON.parse(JSON.stringify(this.patrolContentInitPrint));
          //this.patrolData = d.data;
          d.data.forEach(content => {
            if (content.important === 'YES') {
              this.patrolDataPrint.important++;
              if (content.initQual === 'YES') {
                this.patrolDataPrint.importantQual++;
                this.patrolDataPrint.importantQualStr += content.contextNo + ", ";
              } else {
                this.patrolDataPrint.importantNoQual++;
                let contentItem = {};
                contentItem.no = content.contextNo;
                contentItem.context = content.context;
                contentItem.remark = (content.remark === undefined || content.remark === '') ? "无" : content.remark;
                this.patrolContentPrint.important.push(contentItem);
              }
            } else {
              this.patrolDataPrint.normal++;
              if (content.initQual === 'YES') {
                this.patrolDataPrint.normalQual++;
                this.patrolDataPrint.normalQualStr += content.contextNo + ", ";

              } else {
                this.patrolDataPrint.normalNoQual++;
                let contentItem = {};
                contentItem.no = content.contextNo;
                contentItem.context = content.context;
                contentItem.remark = (content.remark === undefined || content.remark === '') ? "无" : content.remark;
                this.patrolContentPrint.normal.push(contentItem);
              }
            }
          })

          if (this.patrolDataPrint.importantQualStr) {
            this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr.substr(0, this.patrolDataPrint.importantQualStr.length - 2);
          }
          this.patrolDataPrint.importantQualStr = this.patrolDataPrint.importantQualStr != '' ? this.patrolDataPrint.importantQualStr : "无";

          if (this.patrolDataPrint.normalQualStr) {
            this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr.substr(0, this.patrolDataPrint.normalQualStr.length - 2);
          }
          this.patrolDataPrint.normalQualStr = this.patrolDataPrint.normalQualStr != '' ? this.patrolDataPrint.normalQualStr : "无";
        });


      },

      async printRecord(id, isPreview) {
        this.loading = true;
        await this.printInitData(id, "");
        this.$refs.PrintPatrol.printStyle();
        setTimeout(() => {
          doPrintRecord(isPreview);
          setTimeout(() => {
            this.loading = false;
          }, 1000)
        }, 2000)
      },
        goBack(){
          if(this.$route.params.page == 'warn'){//来自预警中心监管页面
              this.$router.go(-1);
          }
            this.$router.push({name: 'patrol.repatrol.list'});
        }

    },
    watch: {
      async '$route'(to, from) {
        //刷新参数放到这里里面去触发就可以刷新相同界面了
        this.curd = this.$route.params.curd;
        this.repatrolRecordId = this.$route.params.repatrolRecordId;

        await getRepatrolRecord(this.repatrolRecordId).then((result) => {
          if (result && result.status) {
            this.initRepatrol = result.data;
            this.type = getType(this.initRepatrol.entityType);
          }
        })

        await listRepatrolRecordContext(this.initRepatrol.sourceId, 'NO').then((result) => {
          if (result && result.status) {
            let datas = result.data;
            if (!datas) {
              this.$message.error('未配置巡查项！');
              return false;
            }
            let lis = [];
            let tablis = [];
            for (var i = 0; i < datas.length; i++) {
              if (lis.indexOf(datas[i].projectId) < 0) {
                lis.push(datas[i].projectId);
              }
            }
            for (var i = 0; i < lis.length; i++) {
              var tabdata = [];
              for (var j = 0; j < datas.length; j++) {
                if (datas[j].projectId == lis[i]) {
                  tabdata.push(datas[j]);
                }
              }
              tablis.push(tabdata);
            }
            this.tableList = tablis;

            this.initContext.contextList = result.data;
            this.initContext.count = this.initContext.contextList.length;
            this.initContext.importantCount = 0;
            this.initContext.contextList.forEach(context => {
              this.contextStat.scoreTotal += context.score;
              if (context.important === 'YES') {
                this.initContext.importantCount++;
              }
            });
          }
        })

        await getBasicInfo(this.initRepatrol.entityId, this.type).then((result) => {
          if (result && result.status) {
            this.soList = result.data.soList;
            this.infoList = result.data.infoList;

            if (this.curd === 'detail') {
              this.infoAssiUserName = result.data.entity.infoAssiUserName;
              this.soUserName = result.data.entity.soUserName;
            }

            this.repatrol.patrolSoId = result.data.entity.so;
            this.personList.push(result.data.entity.infoAssi);
          }
        })

        if (this.curd === 'detail') {
          await listRepatrolRecordContext(this.repatrolRecordId).then((result) => {   //TODO
            if (result && result.status) {
              let datas = result.data;
              let lis = [];
              let tablis = [];
              for (var i = 0; i < datas.length; i++) {
                if (lis.indexOf(datas[i].projectId) < 0) {
                  lis.push(datas[i].projectId);
                }
              }
              for (var i = 0; i < lis.length; i++) {
                var tabdata = [];
                for (var j = 0; j < datas.length; j++) {
                  if (datas[j].projectId == lis[i]) {
                    tabdata.push(datas[j]);
                  }
                }
                tablis.push(tabdata);
              }
              this.tableList = tablis;

              this.initContext.contextList = result.data;
              this.contextStat.scoreTotal = 0;
              this.initContext.contextList.forEach(context => {
                this.contextStat.scoreTotal += context.score;
                this.contextStat.contextCount++;
                if (context.important === 'YES') {
                  this.contextStat.importantCount++;
                }
                if (context.initQual === 'YES') {
                  this.contextStat.qualCount++;
                } else if (context.initQual === 'NO') {
                  this.contextStat.unqualCount++;
                  if (context.important === 'YES') {
                    this.contextStat.unqualImportantCount++;
                  }
                }
              });
            }
          })

          await listFile(this.repatrolRecordId).then(fileList => {
            fileList.data.forEach(file => {
              if (file.colu === 'PHOTO') {
                this.resultData.photo.push(file.fileId);
              } else if (file.colu === 'SIGN') {
                this.resultData.sign.push(file.fileId);
              }
            })
          })
        }

        if (this.curd === 'add') {
          this.blurCount();
        }
      },
      'personList': function () {
          this.soList.forEach(s => {
              s.disabled = false
              this.personList.forEach(j => {
                  if (j === s.id) {
                      s.disabled = true
                  }
              })
          })
      },
      'repatrol.patrolSoId': function () {
          this.infoList.forEach(s => {
              s.disabled = false
              if (this.repatrol.patrolSoId === s.id) {
                  s.disabled = true
              }
          })
      }
    },
    data() {
      return {
        treatNotNull: false,
        rectifyTimeNotNull: false,
        from:'',
        auditId:'',
        rectificationType:'',
        slideIndex: -1,
        yes: true,
        patrolType: "REPATROL",
        basicInfoData: {areaCode:''},
        filePath: "",
        personListRequired: false,
        contextListRequired: false,

        curd: "",
        repatrolRecordId: "",
        detailRepatrolRecordId: "",

        //init 数据
        initRepatrol: {},
        initContext: {},
        contextList: [],
        tableList: [],
        accessoryListIf: false, //是否显示附件列表
        //巡查项图片列表
        itemPicList: [],
        //巡查项图片是否显示
        showPicIf: false,
        //巡查项图片地址
        picSrc: "",
        photoJson: {},
        rowId: '',
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        pathFile: this.$store.getters.filePath,
        row_: {},
        contextStat: {
          scoreTotal: 0,
          contextCount: 0,
          importantCount: 0,
          qualCount: 0,
          unqualCount: 0,
          unqualImportantCount: 0,
          scoredTotal: 0,
          duceTotal: 0,
        },

        soList: [],
        infoList: [],
        infoAssiUserName: "",
        soUserName: "",

        signId: "",

        //sumbit 数据
        repatrol: {
          patrolSoId: "",
          remark: "",
          rectifyTime: ""
        },
        personList: [],

        rules: {
          repatrolTime: { required: true, message: '请选择巡查时间', trigger: 'blur' },
          patrolSoId: { required: true, message: '请选择巡查员', trigger: 'blur' },
          result: { required: true, message: '请选择巡查结果', trigger: 'blur' },
          // treat: { required: true, message: '请选择处理方式', trigger: 'blur' },
          isCooperate: [
            { required: true, message: '请选择是否配合上传', trigger: 'change' },
            { validator: this.blurCount, trigger: 'change' }
          ],
        },
        percent: 0, //表单的完成进度
        // 左边悬浮栏的数据
        progress: [
          {
            title: '基础信息',
            successNum: 0,
            totalNum: 3
          },
          {
            title: '巡查项',
            successNum: 0,
            totalNum: 1
          },
          {
            title: '巡查结果',
            successNum: 0,
            totalNum: 2
          },
        ],

        dialogImageUrl: '',
        dialogVisible: false,
        fileIdList: [],
        imageUrl: '',

        resultData: {
          photo: [],
          sign: [],
        },
        bigImgSrc: null,//拍照图片查看路径
        showBigPic: false,//拍照图片查看是否显示
        ifbigqy: false,

        isShow: false,
        updateSuccess: false,
        sign: [],  //电子签名
        imgNameStyle: {
          left: '0px',
          top: '0px'
        },
        accessoryListIf: false,

        //打印
        printShow: false,
        qrcodeId: "",
        type: "",
        deptName: "",
        basicInfoDataPrint: {areaCode:''},
        messengersPrint: "",

        patrolDataPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentPrint: {
          normal: [],
          important: []
        },
        patrolDataInitPrint: {
          normal: 0,
          normalQual: 0,
          normalNoQual: 0,
          normalQualStr: "",

          important: 0,
          importantQual: 0,
          importantNoQual: 0,
          importantQualStr: "",
        },
        patrolContentInitPrint: {
          normal: [],
          important: []
        },
        resultDataPrint: {},

        recordDataPrint: {
          serialNumber: 123456789,
        },

        loading: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
      };
    }
  }
</script>

<style lang="scss" scoped>
  .mT35 {
    margin-top: 35px;
  }

  .mainbody {
    margin-left: 20px;
    margin-bottom: 30px;
    background: #EFF7F9;
    border: 1px solid #C2EAF8;
    padding: 10px;
    width: 720px;
    color: #1FABDC;
    .form-item {
      margin: 10px 0;
      display: inline-block;
      width: 350px;
      .title {
        width: 100px;
        display: inline-block;
        text-align: right;
      }
    }
  }

  .result {
    margin: 20px 0;
    width: 402px;
    height: 90px;
    border: 1px solid #C2CAD2;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .number {
        font-size: 26px;
        color: #3B3B3B;
      }
      .project-name {
        font-size: 14px;
        color: #A2AAB6;
      }
    }
  }

  .bz {
    line-height: 20px;
    font-size: 12px;
    color: #A2AAB6;
  }

  // 图片上传
  .upload-pic {
    border: 1px solid #cbcbcb;
    width: 130px;
    height: 130px;
    border-radius: 6px;
    margin-left: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-pic-left {
    margin-left: 0px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #fff;
    background: #0DB5EF;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .zj {
    border: 1px solid #ebeef5;
    border-top: 0;
    height: 44px;
    line-height: 44px;

    span:first-child {
      margin-left: 36px;
    }
    span:last-child {
      width: 85%;
      display: inline-block;
      text-align: center;
    }
  }

  .container {
    position: relative;
    margin-bottom: 300px;
  }

  $c:#0db5ef;

  .left-info {
    width: 210px;
    height: 560px;
    background: #fff;
    position: fixed;
    margin-left: -230px;
    margin-top: -100px;
    z-index: 2;

    .head-block {
      background: #F2F5F8;
      height: 70px;
      padding: 14px 20px;
      box-sizing: border-box;
      .num {
        color: $c;
      }
    }
    .main-block {
      margin-top: 20px;
      // border-right: 2px solid #EBF1F5;
      // min-height: 470px;
      >li {
        border-right: 2px solid #EBF1F5;
        padding: 0 20px;
        height: 50px;
        line-height: 50px;
        cursor: default;
        &:hover {
          background: #F2F5F8;
        }
        .right {
          color: #A2AAB6;
        }
      }
      .activePosition {
        border-right: 2px solid $c;
        .left {
          color: $c
        }
      }
    }
  }

  // 左边悬浮信息栏的样式 end

  .right-info {
    width: calc(100% - 230px);
    margin-left: 230px;
  }

  .content {
    margin-top: 20px;
  }

  .table-div {
    text-align: center;
    input {
      background: #FFFFFF;
      border: 1px solid #C2CAD2;
      height: 34px;
      font-size: 12px;
      color: #A2AAB6;
      padding-left: 12px;
      box-sizing: border-box;
    }
  }

  .diva {
    background: #F6F7F8;
    border: 1px solid #C2CAD2;
    font-size: 14px;
    color: #393939;
    height: 34px;
    width: 150px;
    text-align: center;
    line-height: 34px;
    box-sizing: border-box;
  }

  .block {
    width: 252px;
    font-size: 14px;
    color: #6D7787;
    line-height: 26px;
  }

  .brN .is-leaf {
    border-right: 0;
  }

  .brN tr td {
    border-right: 0;
  }

  .brN tr td[colspan="1"] {
    border-right: 1px solid #ebeef5;
  }

  /*.table-div .el-table__body-wrapper{
    max-height: 350px;
  }*/
  .imgdiv {
    width: 130px;
    height: 130px;
    border: 1px solid #C2CAD2;
    border-radius: 6px;
    position: relative;
    margin-right: 20px;
    img {
      transition: all 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    span {
      display: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(0, 0, 0, 0.40);
      border-radius: 0 0 5px 5px;
      font-size: 14px;
      color: #FFFFFF;
      position: absolute;
      bottom: 0;
    }
  }

  .imgdiv:hover {
    span {
      display: inline-block;
    }
  }

  .imgbig {
    z-index: 999;
    span {
      display: none !important;
    }
    img {
      transform: scale(2);
      border-radius: 0;
    }
  }

  .marNo {
    margin: 0 !important;
  }

  .accessoryList span:hover {
    border-bottom: 1px solid #ccc;
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
  }

  .imgNameBox {
    position: fixed;
    min-height: 50px;
    padding: 20px;
    min-width: 200px;
    z-index: 999;
    top: 100px;
    left: 100px;
    background: #fff;
    box-shadow: 0px 4px 12px 0px rgba(109, 119, 135, 0.19);
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
      display: block;
      max-height: 700px;
    }
  }
</style>
