<template>
  <div>
    <!-- 左边信息悬浮栏 -->
    <div class="left-info">
      <ul class="main-block">
        <li class="clearfix " :class="slideIndex==index?'activePosition':''" v-for="(item,index) in progress" :key="index">
          <p class="floatL left">{{item.title}}</p>
        </li>
      </ul>
    </div>

    <div class="right-info">

      <el-form label-width="130px" class="demo-ruleForm labW150">
        <!-- 基础信息 -->
        <toggle-form v-if="fieldChange.based ? fieldChange.based.show : false" title="基础信息（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.based?fieldChange.based.entityName:false) ? 'font-color':''">
                <el-form-item label="主体名称:">
                  <span>{{beforeSubInfo.entityName ? beforeSubInfo.entityName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.based?fieldChange.based.creditCode:false) ? 'font-color':''" v-if="beforeSubInfo.natureType == 'YZYZ' || beforeSubInfo.natureType == 'YZWZ' || beforeSubInfo.type == 'WORKSHOP' || beforeSubInfo.type == 'SALE' || beforeSubInfo.type == 'CFDARESTAURANT'">
                <el-form-item label="统一社会信用代码:">
                  <span>{{beforeSubInfo.creditCode ? beforeSubInfo.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <span v-if="beforeSubInfo.natureType == 'YZYZ' || beforeSubInfo.natureType == 'YZWZ'">
              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.legalPerson:false) ? 'font-color':''">
                  <el-form-item label="经营者姓名:">
                    <span>{{beforeSubInfo.legalPerson ? beforeSubInfo.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
                <span :class="(fieldChange.based?fieldChange.based.creditType:false) ? 'font-color':''">
                  <el-form-item label="主体工商状态:">
                    <span>{{beforeSubInfo.creditTypeStr ? beforeSubInfo.creditTypeStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span v-if="beforeSubInfo.natureType == 'YZYZ'">

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licenceType:false) ? 'font-color':''">
                  <el-form-item label="许可证类型:">
                    <span>{{beforeSubInfo.licenceTypeStr ? beforeSubInfo.licenceTypeStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licence:false) ? 'font-color':''">
                  <el-form-item label="许可备案号:">
                    <span>{{beforeSubInfo.licence ? beforeSubInfo.licence : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licDate:false) ? 'font-color':''">
                  <el-form-item label="有效期:">
                    <span>{{beforeSubInfo.licBegin}} - {{beforeSubInfo.licEnd}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licState:false) ? 'font-color':''">
                  <el-form-item label="许可证状态(主体状态):">
                    <span>{{beforeSubInfo.licStateStr ? beforeSubInfo.licStateStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

          </div>
        </toggle-form>

        <toggle-form v-if="fieldChange.based ? fieldChange.based.show : false" title="基础信息（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.based?fieldChange.based.entityName:false) ? 'font-color':''">
                <el-form-item label="主体名称:">
                  <span>{{afterSubInfo.entityName ? afterSubInfo.entityName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.based?fieldChange.based.creditCode:false) ? 'font-color':''" v-if="beforeSubInfo.natureType == 'YZYZ' || beforeSubInfo.natureType == 'YZWZ' || beforeSubInfo.type == 'WORKSHOP' || beforeSubInfo.type == 'SALE' || beforeSubInfo.type == 'CFDARESTAURANT'">
                <el-form-item label="统一社会信用代码:">
                  <span>{{afterSubInfo.creditCode ? afterSubInfo.creditCode : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <span v-if="beforeSubInfo.natureType == 'YZYZ' || beforeSubInfo.natureType == 'YZWZ'">
              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.legalPerson:false) ? 'font-color':''">
                  <el-form-item label="经营者姓名:">
                    <span>{{afterSubInfo.legalPerson ? afterSubInfo.legalPerson : '暂无'}}</span>
                  </el-form-item>
                </span>
                <span :class="(fieldChange.based?fieldChange.based.creditType:false) ? 'font-color':''">
                  <el-form-item label="主体工商状态:">
                    <span>{{afterSubInfo.creditTypeStr ? afterSubInfo.creditTypeStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

            <span v-if="beforeSubInfo.natureType == 'YZYZ'">

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licenceType:false) ? 'font-color':''">
                  <el-form-item label="许可证类型:">
                    <span>{{afterSubInfo.licenceTypeStr ? afterSubInfo.licenceTypeStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licence:false) ? 'font-color':''">
                  <el-form-item label="许可备案号:">
                    <span>{{afterSubInfo.licence ? afterSubInfo.licence : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licDate:false) ? 'font-color':''">
                  <el-form-item label="有效期:">
                    <span>{{afterSubInfo.licBegin}} - {{afterSubInfo.licEnd}}</span>
                  </el-form-item>
                </span>
              </div>

              <div class="row">
                <span :class="(fieldChange.based?fieldChange.based.licState:false) ? 'font-color':''">
                  <el-form-item label="许可证状态(主体状态):">
                    <span>{{afterSubInfo.licStateStr ? afterSubInfo.licStateStr : '暂无'}}</span>
                  </el-form-item>
                </span>
              </div>
            </span>

          </div>
        </toggle-form>

        <!-- 负责人信息 -->
        <toggle-form v-if="fieldChange.personCharge ? fieldChange.personCharge.show : false"
                     :title="entryType == 'cfda'? '经营者信息（编辑前）': '负责人信息（编辑前）'">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.corpName:false) ? 'font-color':''">
                <el-form-item label="负责人:">
                  <span>{{beforeSubInfo.corpName ? beforeSubInfo.corpName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.mobile:false) ? 'font-color':''">
                <el-form-item label="负责人联系电话:">
                  <span>{{beforeSubInfo.mobile ? beforeSubInfo.mobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.idNo:false) ? 'font-color':''">
                <el-form-item label="负责人身份证:">
                  <span>{{beforeSubInfo.idNo ? beforeSubInfo.idNo : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType === 'cfda'" class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.censusReg:false) ? 'font-color':''">
                <el-form-item label="户籍地址:">
                  <span>{{beforeSubInfo.censusReg ? beforeSubInfo.censusReg : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.address:false) ? 'font-color':''">
                <el-form-item  :label="entryType == 'cfda'? '通讯地址:': '负责人住所:'">
                  <span>{{beforeSubInfo.address ? beforeSubInfo.address : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="fieldChange.personCharge ? fieldChange.personCharge.show : false"
                     :title="entryType == 'cfda'? '经营者信息（编辑后）': '负责人信息（编辑后）'">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.corpName:false) ? 'font-color':''">
                <el-form-item label="负责人:">
                  <span>{{afterSubInfo.corpName ? afterSubInfo.corpName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.mobile:false) ? 'font-color':''">
                <el-form-item label="负责人联系电话:">
                  <span>{{afterSubInfo.mobile ? afterSubInfo.mobile : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.idNo:false) ? 'font-color':''">
                <el-form-item label="负责人身份证:">
                  <span>{{afterSubInfo.idNo ? afterSubInfo.idNo : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>


            <div v-if="entryType === 'cfda'" class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.censusReg:false) ? 'font-color':''">
                <el-form-item label="户籍地址:">
                  <span>{{afterSubInfo.censusReg ? afterSubInfo.censusReg : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.personCharge?fieldChange.personCharge.address:false) ? 'font-color':''">
                <el-form-item :label="entryType == 'cfda'? '通讯地址:': '负责人住所:'">
                  <span>{{afterSubInfo.address ? afterSubInfo.address : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="fieldChange.management ? fieldChange.management.show : false" title="经营信息（编辑前）">
          <div class="content">

            <div class="row">
              <span v-if="entryType === 'cfda'" :class="(fieldChange.management?fieldChange.management.mngTypeStr:false) ? 'font-color':''">
                <el-form-item label="经营形态:">
                  <span>{{beforeSubInfo.mngTypeStr ? beforeSubInfo.mngTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.spaceArea:false) ? 'font-color':''">
                <el-form-item label="经营面积:">
                  <span>{{beforeSubInfo.spaceArea ? beforeSubInfo.spaceArea : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.spaceNature:false) ? 'font-color':''">
                <el-form-item label="场地信息:">
                  <span>{{beforeSubInfo.spaceNature ? beforeSubInfo.spaceNature : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="beforeSubInfo.spaceNature == '租赁'" :class="(fieldChange.management?fieldChange.management.landlordName:false) ? 'font-color':''">
                <el-form-item label="房东名字:">
                  <span>{{beforeSubInfo.landlordName ? beforeSubInfo.landlordName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="beforeSubInfo.spaceNature == '租赁'" :class="(fieldChange.management?fieldChange.management.landlordPhone:false) ? 'font-color':''">
                <el-form-item label="手机号:">
                  <span>{{beforeSubInfo.landlordPhone ? beforeSubInfo.landlordPhone : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS'" :class="(fieldChange.management?fieldChange.management.pedlarType:false) ? 'font-color':''">
                <el-form-item label="摊贩类型:">
                  <span>{{beforeSubInfo.pedlarType ? (beforeSubInfo.pedlarType == 'FLOW' ? '流动摊贩' : '固定摊贩') : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && beforeSubInfo.pedlarType == 'FLOW'" :class="(fieldChange.management?fieldChange.management.placeBiz:false) ? 'font-color':''">
                <el-form-item label="经营区域:">
                  <span>{{beforeSubInfo.placeBiz ? beforeSubInfo.placeBiz : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && beforeSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?fieldChange.management.placeWork:false) ? 'font-color':''">
                <el-form-item label="加工地址:">
                  <span>{{beforeSubInfo.placeWork ? beforeSubInfo.placeWork : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && beforeSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?fieldChange.management.placeBiz:false) ? 'font-color':''">
                <el-form-item label="经营区域:">
                  <span>{{beforeSubInfo.placeBiz ? beforeSubInfo.placeBiz : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && beforeSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?(fieldChange.management.placeTimeBegin && fieldChange.management.placeTimeEnd):false) ? 'font-color':''">
                <el-form-item label="经营时间段:">
                  <span>{{beforeSubInfo.placeTimeBegin ? beforeSubInfo.placeTimeBegin : '暂无'}} 到 {{beforeSubInfo.placeTimeEnd ? beforeSubInfo.placeTimeEnd : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType != 'VENDORS' && beforeSubInfo.pedlarType != 'FLOW'" :class="(fieldChange.management?fieldChange.management.spaceDstStr:false) ? 'font-color':''">
                <el-form-item label="场所分布:">
                  <span>{{beforeSubInfo.spaceDstStr ? beforeSubInfo.spaceDstStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.spaceAddr:false) ? 'font-color':''">
                <el-form-item label="经营场所:">
                  <span>{{beforeSubInfo.spaceAddr ? beforeSubInfo.spaceAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="subEntityType === 'RESTAURANT'">
              <span :class="(fieldChange.management?fieldChange.management.superviseType:false) ? 'font-color':''">
                <el-form-item label="监管类型:">
                  <span>{{beforeSubInfo.superviseTypeStr ? beforeSubInfo.superviseTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.networkOperation:false) ? 'font-color':''">
                <el-form-item label="网络经营:">
                  <span>{{beforeSubInfo.networkOperationStr ? beforeSubInfo.networkOperationStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.empNumber:false) ? 'font-color':''">
                <el-form-item label="从业人数:">
                  <span>{{beforeSubInfo.empNumber ? beforeSubInfo.empNumber : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="entryType !== 'cfda'" :class="(fieldChange.management?fieldChange.management.subType:false) ? 'font-color':''">
                <el-form-item label="主体业态:">
                  <span>{{beforeSubInfo.subTypeStr ? beforeSubInfo.subTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span v-if="entryType !== 'cfda'" :class="(fieldChange.management?fieldChange.management.econType:false) ? 'font-color':''">
                <el-form-item label="经济性质:">
                  <span>{{beforeSubInfo.econTypeStr ? beforeSubInfo.econTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="entryType === 'cfda' && cfdaType === 'WORKSHOP'" :class="(fieldChange.management?fieldChange.management.prodFormStr:false) ? 'font-color':''">
                <el-form-item label="生产形式:">
                  <span>{{beforeSubInfo.prodFormStr ? beforeSubInfo.prodFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.manageState:false) ? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{beforeSubInfo.manageStateStr ? beforeSubInfo.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.realityAddr:false) ? 'font-color':''">
                <el-form-item label="真实经营地址:">
                  <span>{{beforeSubInfo.realityAddr ? beforeSubInfo.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType == 'cfda' && (cfdaType === 'CFDARESTAURANT' ||  cfdaType === 'SALE')" class="row">
              <span :class="(fieldChange.management?fieldChange.management.projectMainStr:false) ? 'font-color':''">
                <el-form-item label="主营项目:">
                  <span style="max-width:380px;">{{beforeSubInfo.projectMainStr ? beforeSubInfo.projectMainStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType == 'cfda' && (cfdaType === 'CFDARESTAURANT' ||  cfdaType === 'SALE')" class="row">
              <span :class="(fieldChange.management?fieldChange.management.projectSidStr:false) ? 'font-color':''">
                <el-form-item label="兼营项目:">
                  <span style="max-width:380px;">{{beforeSubInfo.projectSidStr ? beforeSubInfo.projectSidStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType == 'cfda' && cfdaType === 'WORKSHOP'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.prodTypeStr:false) ? 'font-color':''">
                <el-form-item label="生产类别:">
                  <span style="max-width:380px;">{{beforeSubInfo.prodTypeStr ? beforeSubInfo.prodTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType == 'cfda' && cfdaType === 'WORKSHOP'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.prodVarietyStr:false) ? 'font-color':''">
                <el-form-item label="品种明细:">
                  <span style="max-width:380px;">{{beforeSubInfo.prodVarietyStr ? beforeSubInfo.prodVarietyStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType == 'cfda' && cfdaType === 'VENDORS'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.foodSalesStr:false) ? 'font-color':''">
                <el-form-item label="食品销售:">
                  <span style="max-width:380px;">{{beforeSubInfo.foodSalesStr ? beforeSubInfo.foodSalesStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType == 'cfda' && cfdaType === 'VENDORS'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.foodProdStr:false) ? 'font-color':''">
                <el-form-item label="食品制售:">
                  <span style="max-width:380px;">{{beforeSubInfo.foodProdStr ? beforeSubInfo.foodProdStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'PRODUCT'">
              <span :class="(fieldChange.management?fieldChange.management.operType:false) ? 'font-color':''">
                <el-form-item label="经营类别:">
                  <span style="max-width:380px;">{{beforeSubInfo.operTypeStr ? beforeSubInfo.operTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'PRODUCT'">
              <span :class="(fieldChange.management?fieldChange.management.operDetail:false) ? 'font-color':''">
                <el-form-item label="经营明细:">
                  <span style="max-width:380px;">{{beforeSubInfo.operDetailStr ? beforeSubInfo.operDetailStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'CIRCULATION' || beforeSubInfo.entityType == 'RESTAURANT'">
              <span :class="(fieldChange.management?fieldChange.management.operPro:false) ? 'font-color':''">
                <el-form-item label="经营项目:">
                  <span style="max-width:380px;">{{beforeSubInfo.operProStr ? beforeSubInfo.operProStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.detailedEngage:false) ? 'font-color':''">
                <el-form-item label="详细经营信息:">
                  <span style="max-width:380px;">{{beforeSubInfo.detailedEngageStr ? beforeSubInfo.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

          </div>
        </toggle-form>

        <!-- 经营信息 -->
        <toggle-form v-if="fieldChange.management ? fieldChange.management.show : false" title="经营信息（编辑后）">
          <div class="content">

            <div class="row">
              <span v-if="entryType === 'cfda'" :class="(fieldChange.management?fieldChange.management.mngTypeStr:false) ? 'font-color':''">
                <el-form-item label="经营形态:">
                  <span>{{afterSubInfo.mngTypeStr ? afterSubInfo.mngTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.spaceArea:false) ? 'font-color':''">
                <el-form-item label="经营面积:">
                  <span>{{afterSubInfo.spaceArea ? afterSubInfo.spaceArea : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.spaceNature:false) ? 'font-color':''">
                <el-form-item label="场地信息:">
                  <span>{{afterSubInfo.spaceNature ? afterSubInfo.spaceNature : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="afterSubInfo.spaceNature == '租赁'" :class="(fieldChange.management?fieldChange.management.landlordName:false) ? 'font-color':''">
                <el-form-item label="房东名字:">
                  <span>{{afterSubInfo.landlordName ? afterSubInfo.landlordName : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="afterSubInfo.spaceNature == '租赁'" :class="(fieldChange.management?fieldChange.management.landlordPhone:false) ? 'font-color':''">
                <el-form-item label="手机号:">
                  <span>{{afterSubInfo.landlordPhone ? afterSubInfo.landlordPhone : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS'" :class="(fieldChange.management?fieldChange.management.pedlarType:false) ? 'font-color':''">
                <el-form-item label="摊贩类型:">
                  <span>{{afterSubInfo.pedlarType ? (afterSubInfo.pedlarType == 'FLOW' ? '流动摊贩':'固定摊贩') : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && afterSubInfo.pedlarType == 'FLOW'" :class="(fieldChange.management?fieldChange.management.placeBiz:false) ? 'font-color':''">
                <el-form-item label="经营区域:">
                  <span>{{afterSubInfo.placeBiz ? afterSubInfo.placeBiz : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && afterSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?fieldChange.management.placeWork:false) ? 'font-color':''">
                <el-form-item label="加工地址:">
                  <span>{{afterSubInfo.placeWork ? afterSubInfo.placeWork : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && afterSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?fieldChange.management.placeBiz:false) ? 'font-color':''">
                <el-form-item label="经营区域:">
                  <span>{{afterSubInfo.placeBiz ? afterSubInfo.placeBiz : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType == 'VENDORS' && afterSubInfo.pedlarType == 'FIXE'" :class="(fieldChange.management?(fieldChange.management.placeTimeBegin && fieldChange.management.placeTimeEnd):false) ? 'font-color':''">
                <el-form-item label="经营时间段:">
                  <span>{{afterSubInfo.placeTimeBegin ? afterSubInfo.placeTimeBegin : '暂无'}} 到 {{afterSubInfo.placeTimeEnd ? afterSubInfo.placeTimeEnd : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="cfdaType != 'VENDORS' && afterSubInfo.pedlarType != 'FLOW'" :class="(fieldChange.management?fieldChange.management.spaceDstStr:false) ? 'font-color':''">
                <el-form-item label="场所分布:">
                  <span>{{afterSubInfo.spaceDstStr ? afterSubInfo.spaceDstStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.spaceAddr:false) ? 'font-color':''">
                <el-form-item label="经营场所:">
                  <span>{{afterSubInfo.spaceAddr ? afterSubInfo.spaceAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="subEntityType === 'RESTAURANT'">
              <span :class="(fieldChange.management?fieldChange.management.superviseType:false) ? 'font-color':''">
                <el-form-item label="监管类型:">
                  <span>{{afterSubInfo.superviseTypeStr ? afterSubInfo.superviseTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.networkOperation:false) ? 'font-color':''">
                <el-form-item label="网络经营:">
                  <span>{{afterSubInfo.networkOperationStr ? afterSubInfo.networkOperationStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.empNumber:false) ? 'font-color':''">
                <el-form-item label="从业人数:">
                  <span>{{afterSubInfo.empNumber ? afterSubInfo.empNumber : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="entryType !== 'cfda'" :class="(fieldChange.management?fieldChange.management.subType:false) ? 'font-color':''">
                <el-form-item label="主体业态:">
                  <span>{{afterSubInfo.subTypeStr ? afterSubInfo.subTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span v-if="entryType !== 'cfda'" :class="(fieldChange.management?fieldChange.management.econType:false) ? 'font-color':''">
                <el-form-item label="经济性质:">
                  <span>{{afterSubInfo.econTypeStr ? afterSubInfo.econTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span v-if="entryType === 'cfda' && cfdaType === 'WORKSHOP'" :class="(fieldChange.management?fieldChange.management.prodFormStr:false) ? 'font-color':''">
                <el-form-item label="生产形式:">
                  <span>{{afterSubInfo.prodFormStr ? afterSubInfo.prodFormStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.manageState:false) ? 'font-color':''">
                <el-form-item label="营业状态:">
                  <span>{{afterSubInfo.manageStateStr ? afterSubInfo.manageStateStr : '暂无'}}</span>
                </el-form-item>
              </span>
              <span :class="(fieldChange.management?fieldChange.management.realityAddr:false) ? 'font-color':''">
                <el-form-item label="真实经营地址:">
                  <span>{{afterSubInfo.realityAddr ? afterSubInfo.realityAddr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType == 'cfda' && (cfdaType === 'CFDARESTAURANT' ||  cfdaType === 'SALE')" class="row">
              <span :class="(fieldChange.management?fieldChange.management.projectMainStr:false) ? 'font-color':''">
                <el-form-item label="主营项目:">
                  <span style="max-width:380px;">{{afterSubInfo.projectMainStr ? afterSubInfo.projectMainStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType == 'cfda' && (cfdaType === 'CFDARESTAURANT' ||  cfdaType === 'SALE')" class="row">
              <span :class="(fieldChange.management?fieldChange.management.projectSidStr:false) ? 'font-color':''">
                <el-form-item label="兼营项目:">
                  <span style="max-width:380px;">{{afterSubInfo.projectSidStr ? afterSubInfo.projectSidStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType === 'cfda' && cfdaType === 'WORKSHOP'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.prodTypeStr:false) ? 'font-color':''">
                <el-form-item label="生产类别:">
                  <span style="max-width:380px;">{{afterSubInfo.prodTypeStr ? afterSubInfo.prodTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType === 'cfda' && cfdaType === 'WORKSHOP'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.prodVarietyStr:false) ? 'font-color':''">
                <el-form-item label="品种明细:">
                  <span style="max-width:380px;">{{afterSubInfo.prodVarietyStr ? afterSubInfo.prodVarietyStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div v-if="entryType == 'cfda' && cfdaType === 'VENDORS'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.foodSalesStr:false) ? 'font-color':''">
                <el-form-item label="食品销售:">
                  <span style="max-width:380px;">{{afterSubInfo.foodSalesStr ? afterSubInfo.foodSalesStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
            <div v-if="entryType == 'cfda' && cfdaType === 'VENDORS'" class="row">
              <span :class="(fieldChange.management?fieldChange.management.foodProdStr:false) ? 'font-color':''">
                <el-form-item label="食品制售:">
                  <span style="max-width:380px;">{{afterSubInfo.foodProdStr ? afterSubInfo.foodProdStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'PRODUCT'">
              <span :class="(fieldChange.management?fieldChange.management.operType:false) ? 'font-color':''">
                <el-form-item label="经营类别:">
                  <span style="max-width:380px;">{{afterSubInfo.operTypeStr ? afterSubInfo.operTypeStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'PRODUCT'">
              <span :class="(fieldChange.management?fieldChange.management.operDetail:false) ? 'font-color':''">
                <el-form-item label="经营明细:">
                  <span style="max-width:380px;">{{afterSubInfo.operDetailStr ? afterSubInfo.operDetailStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="beforeSubInfo.entityType == 'CIRCULATION' || beforeSubInfo.entityType == 'RESTAURANT'">
              <span :class="(fieldChange.management?fieldChange.management.operPro:false) ? 'font-color':''">
                <el-form-item label="经营项目:">
                  <span style="max-width:380px;">{{afterSubInfo.operProStr ? afterSubInfo.operProStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.management?fieldChange.management.detailedEngage:false) ? 'font-color':''">
                <el-form-item label="详细经营信息:">
                  <span style="max-width:380px;">{{afterSubInfo.detailedEngageStr ? afterSubInfo.detailedEngageStr : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

          </div>
        </toggle-form>

        <!-- 责任落实 -->
        <toggle-form v-if="fieldChange.duty ? fieldChange.duty.show : false" title="责任落实（编辑前）">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.syj:false) ? 'font-color':''">
                <el-form-item label="所属食药所:">
                  <span>{{beforeSubInfo.syjName ? beforeSubInfo.syjName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.grid:false) ? 'font-color':''">
                <el-form-item label="所在网格:">
                  <span>{{beforeSubInfo.gridName ? beforeSubInfo.gridName : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.so:false) ? 'font-color':''">
                <el-form-item label="监管人员:">
                  <span>{{beforeSubInfo.soName ? beforeSubInfo.soName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.soPhone:false) ? 'font-color':''">
                <el-form-item label="监管人员联系方式:">
                  <span>{{beforeSubInfo.soPhone ? beforeSubInfo.soPhone : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.infoAssi:false) ? 'font-color':''">
                <el-form-item label="网格信息员:">
                  <span>{{beforeSubInfo.infoAssi ? beforeSubInfo.infoAssi : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.infoAssiPhone:false) ? 'font-color':''">
                <el-form-item label="信息员联系方式:">
                  <span>{{beforeSubInfo.infoAssiPhone ? beforeSubInfo.infoAssiPhone : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entryType != 'cfda'">
              <span :class="(fieldChange.duty?fieldChange.duty.firstPl:false) ? 'font-color':''">
                <el-form-item label="第一责任人:">
                  <span>{{beforeSubInfo.firstPl ? beforeSubInfo.firstPl : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.firstPlTel:false) ? 'font-color':''">
                <el-form-item label="第一责任人联系方式:">
                  <span>{{beforeSubInfo.firstPlTel ? beforeSubInfo.firstPlTel : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entryType != 'cfda'">
              <span :class="(fieldChange.duty?fieldChange.duty.manager:false) ? 'font-color':''">
                <el-form-item label="管理人员:">
                  <span>{{beforeSubInfo.manager ? beforeSubInfo.manager : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.managerTel:false) ? 'font-color':''">
                <el-form-item label="管理人员联系方式:">
                  <span>{{beforeSubInfo.managerTel ? beforeSubInfo.managerTel : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="fieldChange.duty ? fieldChange.duty.show : false" title="责任落实（编辑后）">
          <div class="content">
            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.syj:false) ? 'font-color':''">
                <el-form-item label="所属食药所:">
                  <span>{{afterSubInfo.syjName ? afterSubInfo.syjName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.grid:false) ? 'font-color':''">
                <el-form-item label="所在网格:">
                  <span>{{afterSubInfo.gridName ? afterSubInfo.gridName : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.so:false) ? 'font-color':''">
                <el-form-item label="监管人员:">
                  <span>{{afterSubInfo.soName ? afterSubInfo.soName : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.soPhone:false) ? 'font-color':''">
                <el-form-item label="监管人员联系方式:">
                  <span>{{afterSubInfo.soPhone ? afterSubInfo.soPhone : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row">
              <span :class="(fieldChange.duty?fieldChange.duty.infoAssi:false) ? 'font-color':''">
                <el-form-item label="网格信息员:">
                  <span>{{afterSubInfo.infoAssi ? afterSubInfo.infoAssi : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.infoAssiPhone:false) ? 'font-color':''">
                <el-form-item label="信息员联系方式:">
                  <span>{{afterSubInfo.infoAssiPhone ? afterSubInfo.infoAssiPhone : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entryType != 'cfda'">
              <span :class="(fieldChange.duty?fieldChange.duty.firstPl:false) ? 'font-color':''">
                <el-form-item label="第一责任人:">
                  <span>{{afterSubInfo.firstPl ? afterSubInfo.firstPl : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.firstPlTel:false) ? 'font-color':''">
                <el-form-item label="第一责任人联系方式:">
                  <span>{{afterSubInfo.firstPlTel ? afterSubInfo.firstPlTel : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>

            <div class="row" v-if="entryType != 'cfda'">
              <span :class="(fieldChange.duty?fieldChange.duty.manager:false) ? 'font-color':''">
                <el-form-item label="管理人员:">
                  <span>{{afterSubInfo.manager ? afterSubInfo.manager : '暂无'}}</span>
                </el-form-item>
              </span>

              <span :class="(fieldChange.duty?fieldChange.duty.managerTel:false) ? 'font-color':''">
                <el-form-item label="管理人员联系方式:">
                  <span>{{afterSubInfo.managerTel ? afterSubInfo.managerTel : '暂无'}}</span>
                </el-form-item>
              </span>
            </div>
          </div>
        </toggle-form>

        <toggle-form v-if="fieldChange.emps ? fieldChange.emps.show : false" title="人员信息（编辑前）">
          <el-table :data="beforeSubInfo.emps" style="width: 100%" v-if="beforeSubInfo.emps && beforeSubInfo.emps.length > 0">

            <el-table-column label="姓名" width="150">
              <template slot-scope="scope">
                <span class="w120">{{scope.row.empName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="身份证号">
              <template slot-scope="scope">
                <span class="200">{{scope.row.empIdNo}}</span>
              </template>

            </el-table-column>

            <el-table-column label="有无健康证明">
              <template slot-scope="scope">
                <span class="120">{{scope.row.hasHealthyCardStr}}</span>
              </template>
            </el-table-column>

            <el-table-column label="健康证号">
              <template slot-scope="scope">
                <span class="200">{{scope.row.healthyCardNo}}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注">
              <template slot-scope="scope">
                <span class="200">{{scope.row.remark}}</span>
              </template>
            </el-table-column>

          </el-table>
        </toggle-form>

        <toggle-form v-if="fieldChange.emps ? fieldChange.emps.show : false" title="人员信息（编辑后）">
          <el-table :data="afterSubInfo.emps" style="width: 100%" v-if="afterSubInfo.emps && afterSubInfo.emps.length > 0">

            <el-table-column label="姓名" width="150">
              <template slot-scope="scope">
                <span class="w120">{{scope.row.empName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="身份证号">
              <template slot-scope="scope">
                <span class="200">{{scope.row.empIdNo}}</span>
              </template>

            </el-table-column>

            <el-table-column label="有无健康证明">
              <template slot-scope="scope">
                <span class="120">{{scope.row.hasHealthyCard === 'YES' ? '有' : '无'}}</span>
              </template>
            </el-table-column>

            <el-table-column label="健康证号">
              <template slot-scope="scope">
                <span class="200">{{scope.row.healthyCardNo}}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注">
              <template slot-scope="scope">
                <span class="200">{{scope.row.remark}}</span>
              </template>
            </el-table-column>

          </el-table>
        </toggle-form>

        <toggle-form v-if="fieldChange.files ? fieldChange.files.show : false" title="附件上传（编辑前）">
          <attachment-upload-detail style="margin-top: 20px;" :options="options" v-model="beforeSubInfo.files"></attachment-upload-detail>
        </toggle-form>
        <toggle-form v-if="fieldChange.files ? fieldChange.files.show : false" title="附件上传（编辑后）">
          <attachment-upload-detail style="margin-top: 20px;" :options="options" v-model="afterSubInfo.files"></attachment-upload-detail>
        </toggle-form>
        <toggle-form title="工单操作记录">
          <div style="text-align: left;font-size:20px;margin:20px 0px 0px 11px">
            <!-- <span>工单类型 : {{this.$route.params.workType}}</span> -->
            <span>工单类型 : {{ workType }}</span>
            <!--  工单类型 -->
          </div>
          <el-table :data="workTableData" style="margin-top:20px" class="table-div">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optType" min-width="100" label="操作类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="state" min-width="100" label="操作结果"></el-table-column>
            <el-table-column show-overflow-tooltip prop="backReason" min-width="120" label="操作备注"></el-table-column>
            <el-table-column show-overflow-tooltip prop="username" min-width="100" label="操作员"></el-table-column>
            <el-table-column show-overflow-tooltip prop="optTime" min-width="100" label="操作日期"></el-table-column>
          </el-table>
        </toggle-form>

      </el-form>
    </div>

  </div>
</template>

<script>

import scroll from "utils/scroll";
import ToggleForm from "components/ToggleForm.vue";
import { getInfoFeldChange, getCfdaInfoFeldChange } from "views/subject/common/utils/InfoFieldChange";
import { changeInfo, getRecordByWorkId } from "api/sub/work.js";
import { getWorkFlowInfo, getRecordByWorkId as getCfdaRecordByWorkId } from "api/cfda/bizWorkflow";
import AttachmentUploadDetail from 'components/AttachmentUploadDetail/index';
import subject from '../common/utils/Contants';

export default {
  props: {
    workId: String,
    workType: String,
    entryType: String,
  },
  components: {
    ToggleForm,
    AttachmentUploadDetail
  },
  mounted() {
    if(this.entryType === 'entity' || !this.entryType) {
      changeInfo(this.workId).then(results => {
        this.afterSubInfo = results.data.afterSubInfo;
        this.beforeSubInfo = results.data.beforeSubInfo;
        this.subEntityType = results.data.beforeSubInfo.entityType
        this.beforeSubInfo.infoAssi = this.beforeSubInfo.infoAssiName;
        this.fieldChange = getInfoFeldChange(this.afterSubInfo, this.beforeSubInfo);
        this.initProgress();
      });

      getRecordByWorkId(this.workId).then((results) => {
        this.workTableData = results.data;
      });
    } else if(this.entryType === 'cfda') {
      getWorkFlowInfo({ workId: this.workId }).then((r) => {
        this.afterSubInfo = r.data.after;
        this.beforeSubInfo = r.data.before;
        this.cfdaType = r.data.cfdaType;
        this.fieldChange = getCfdaInfoFeldChange(this.cfdaType, this.afterSubInfo, this.beforeSubInfo);
        this.initProgress();
      })

      getCfdaRecordByWorkId({ workId: this.workId }).then((results) => {
        this.workTableData = results.data;
      });
    }
  },
  updated() {
    if (this.updatedTag) {
      //滚动效果
      scroll.call(this, 'slideIndex');
    }
  },
  methods: {
    changeData(selected) {
    },
    initProgress() {
      const option = [{
        show: this.fieldChange.based.show,
        title: '基础信息（编辑前）',
      }, {
        show: this.fieldChange.based.show,
        title: '基础信息（编辑后）',
      }, {
        show: this.fieldChange.personCharge.show,
        title: this.entryType == 'cfda'? '经营者信息（编辑前）': '负责人信息（编辑前）',
      }, {
        show: this.fieldChange.personCharge.show,
        title: this.entryType == 'cfda'? '经营者信息（编辑后）': '负责人信息（编辑后）',
      }, {
        show: this.fieldChange.management.show,
        title: '经营信息（编辑前）',
      }, {
        show: this.fieldChange.management.show,
        title: '经营信息（编辑后）',
      }, {
        show: this.fieldChange.duty.show,
        title: '责任落实（编辑前）',
      }, {
        show: this.fieldChange.duty.show,
        title: '责任落实（编辑后）',
      }, {
        show: this.entryType != 'cfda' ? false : this.fieldChange.emps.show,
        title: '人员信息（编辑前）',
      }, {
        show: this.entryType != 'cfda' ? false : this.fieldChange.emps.show,
        title: '人员信息（编辑后）',
      },{
        show: this.entryType != 'cfda' ? false : this.fieldChange.files.show,
        title: '附件上传（编辑前）',
      },{
        show: this.entryType != 'cfda' ? false : this.fieldChange.files.show,
        title: '附件上传（编辑后）',
      }, {
        show: true,
        title: '工单操作记录',
      }];
      this.progress = option.filter(item => item.show === true);
    }
  },
  data() {
    return {
      cfdaType: "",
      subEntityType: "",
      updatedTag: true,
      slideIndex: -1,
      workTableData: [],
      afterSubInfo: {},
      afterSubInfoStr: {},
      beforeSubInfo: {},
      beforeSubInfoStr: {},
      fieldChange: {},
      // 左边悬浮栏的数据
      progress: [
        {show: false, title: '基础信息(编辑后)',},
        {show: false, title: '基础信息(编辑前)',},
        {show: false, title: this.entryType == 'cfda'? '经营者信息（编辑后）': '负责人信息（编辑后）',},
        {show: false, title: this.entryType == 'cfda'? '经营者信息（编辑前）': '负责人信息（编辑前）',},
        {show: false, title: '经营信息(编辑后)',},
        {show: false, title: '经营信息(编辑前)',},
        {show: false, title: '责任落实(编辑后)',},
        {show: false, title: '责任落实(编辑前)',},
        {show: true, title: '工单操作记录',},
      ],
      options:[
        {
          label:"备案申请书",
          field:"FILING_APPLICATION"
        },
        {
          label:"营业执照副本",
          field:"BUSINESS_LICENSE_COPY"
        },
        {
          label:"场地证明",
          field:"PLACE_PROOF"
        },
        {
          label:"健康证",
          field:"HEALTH_CARD"
        },
        {
          label:"身份证",
          field:"IDENTITY_CARD"
        },
      ]
    };
  }
}
</script>

<style lang="scss" scoped>
// 左边悬浮信息栏的样式 start
$c: #0db5ef;

.table-div {
  width: 100%;
  text-align: center;
}

.font-color {
  color: red !important;
}
.font-color label {
  color: red;
}

.left-info {
  width: 210px;
  height: 560px;
  background: #fff;
  position: fixed;
  margin-left: -230px;
  margin-top: -20px;
  // z-index: 2;

  .head-block {
    background: #f2f5f8;
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
    > li {
      border-right: 2px solid #ebf1f5;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      cursor: default;
      &:hover {
        background: #f2f5f8;
      }
      .right {
        color: #a2aab6;
      }
    }
    .activePosition {
      border-right: 2px solid $c;
      .left {
        color: $c;
      }
    }
  }
}
// 左边悬浮信息栏的样式 end

.right-info {
  width: 100%;
}

// .content {
//   padding-left: 25%;
//   margin-top: 20px;
// }
</style>
