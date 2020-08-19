export function getInfoFeldChange(afterSubInfo,beforeSubInfo) {
  const natureType = beforeSubInfo.natureType;
  const field = {
    based:{},//基础信息
    personCharge:{},//责任人信息
    management:{},//经营信息
    duty:{}//责任落实
  };
  if (natureType == 'YZYZ'){//有证有照
    //基础信息
    field.based = {
      entityName:beforeSubInfo.entityName == afterSubInfo.entityName ? false : true,
      creditCode:beforeSubInfo.creditCode == afterSubInfo.creditCode ? false : true,
      legalPerson:beforeSubInfo.legalPerson == afterSubInfo.legalPerson ? false : true,
      creditType:beforeSubInfo.creditType == afterSubInfo.creditType ? false : true,
      licence:beforeSubInfo.licence == afterSubInfo.licence ? false : true,
      licDate:beforeSubInfo.licBegin == afterSubInfo.licBegin &&
      beforeSubInfo.licEnd == afterSubInfo.licEnd ? false : true,
      licenceType:beforeSubInfo.licenceType == afterSubInfo.licenceType ? false : true,
      licState:beforeSubInfo.licState == afterSubInfo.licState ? false : true,
      show:true
    };
  }else if(natureType == 'YZWZ'){//有证无照
    //基础信息
    field.based = {
      entityName:beforeSubInfo.entityName == afterSubInfo.entityName ? false : true,
      creditCode:beforeSubInfo.creditCode == afterSubInfo.creditCode ? false : true,
      legalPerson:beforeSubInfo.legalPerson == afterSubInfo.legalPerson ? false : true,
      creditType:beforeSubInfo.creditType == afterSubInfo.creditType ? false : true,
      show:true
    };
  }else if(natureType == 'WZWZ'){//无证无照
    //基础信息
    field.based = {
      entityName:beforeSubInfo.entityName == afterSubInfo.entityName ? false : true,
      show:true
    };
  }


  //
  field.personCharge = {
    corpName:beforeSubInfo.corpName == afterSubInfo.corpName ? false : true,
    mobile:beforeSubInfo.mobile == afterSubInfo.mobile ? false : true,
    censusReg:beforeSubInfo.address == afterSubInfo.address ? false : true,
    idNo:beforeSubInfo.idNo == afterSubInfo.idNo ? false : true,
    address:beforeSubInfo.address == afterSubInfo.address ? false : true,
    show:true
  }

  //经营信息
  field.management = {
    // riskRank:beforeSubInfo.riskRank == afterSubInfo.riskRank ? false : true,
    // quanLevel:beforeSubInfo.quanLevel == afterSubInfo.quanLevel ? false : true,
    spaceArea:beforeSubInfo.spaceArea == afterSubInfo.spaceArea ? false : true,
    spaceDstStr:beforeSubInfo.spaceDst == afterSubInfo.spaceDst ? false : true,
    spaceAddr:beforeSubInfo.spaceAddr == afterSubInfo.spaceAddr ? false : true,
    empNumber:beforeSubInfo.empNumber == afterSubInfo.empNumber ? false : true,
    superviseType:beforeSubInfo.superviseType == afterSubInfo.superviseType ? false : true,
    networkOperation:beforeSubInfo.networkOperation == afterSubInfo.networkOperation ? false : true,
    subType:beforeSubInfo.subType == afterSubInfo.subType ? false : true,
    econType:beforeSubInfo.econType == afterSubInfo.econType ? false : true,
    operType:beforeSubInfo.operType == afterSubInfo.operType ? false : true,
    operDetail:beforeSubInfo.operDetail == afterSubInfo.operDetail ? false : true,
    operPro:(beforeSubInfo.operPro?beforeSubInfo.operPro:false) == (afterSubInfo.operPro?afterSubInfo.operPro:false) ? false : true,
    detailedEngage:beforeSubInfo.detailedEngage == afterSubInfo.detailedEngage ? false : true,
    manageState:beforeSubInfo.manageState == afterSubInfo.manageState ? false : true,
    // APP 实际经营地址编辑
    realityAddr:beforeSubInfo.realityAddr == afterSubInfo.realityAddr ? false : true,
    show:true
  }
  //责任落实
  field.duty = {
    syj:beforeSubInfo.syj == afterSubInfo.syj ? false : true,
    grid:beforeSubInfo.grid == afterSubInfo.grid ? false : true,
    so:beforeSubInfo.so == afterSubInfo.so ? false : true,
    soPhone:beforeSubInfo.soPhone == afterSubInfo.soPhone ? false : true,
    infoAssi:beforeSubInfo.infoAssiPhone == afterSubInfo.infoAssiPhone ? false : true,
    infoAssiPhone:beforeSubInfo.infoAssiPhone == afterSubInfo.infoAssiPhone ? false : true,
    firstPl:beforeSubInfo.firstPl == afterSubInfo.firstPl ? false : true,
    firstPlTel:beforeSubInfo.firstPlTel == afterSubInfo.firstPlTel ? false : true,
    manager:beforeSubInfo.manager == afterSubInfo.manager ? false : true,
    managerTel:beforeSubInfo.managerTel == afterSubInfo.managerTel ? false : true,
    show:true
  }

  for (let group in field){
    let groupData = field[group];
    for (let data in groupData){
      if (groupData[data]){
        field[group].show = true;
        break;
      }
      field[group].show = false;
    }

  }

  return field;
}


export function getCfdaInfoFeldChange(cfdaType, afterSubInfo,beforeSubInfo) {
  let type = cfdaType;
  console.log(type)
  let field = {
    based:{},//基础信息
    personCharge:{},//责任人信息
    management:{},//经营信息
    duty:{},//责任落实
    emps: {}, // 人员信息
    files: {} // 文件信息
  };

  field.based = {
    entityName:beforeSubInfo.entityName == afterSubInfo.entityName ? false : true,
    creditCode:beforeSubInfo.creditCode == afterSubInfo.creditCode ? false : true,
    show: true
  }
  //
  field.personCharge = {
    idNo: beforeSubInfo.idNo == afterSubInfo.idNo ? false : true,
    corpName: beforeSubInfo.corpName == afterSubInfo.corpName ? false : true,
    mobile:beforeSubInfo.mobile == afterSubInfo.mobile ? false : true,
    censusReg:beforeSubInfo.censusReg == afterSubInfo.censusReg ? false : true,
    address:beforeSubInfo.address == afterSubInfo.address ? false : true,
    show:true
  }

  field.management = {
    mngTypeStr:beforeSubInfo.mngTypeStr == afterSubInfo.mngTypeStr ? false : true,
    empNumber:beforeSubInfo.empNumber == afterSubInfo.empNumber ? false : true,
    projectMain:beforeSubInfo.projectMain == afterSubInfo.projectMain ? false : true,
    projectSid:beforeSubInfo.projectSid == afterSubInfo.projectSid ? false : true,
    detailedEngage:beforeSubInfo.detailedEngageStr == afterSubInfo.detailedEngageStr ? false : true,
    manageState:beforeSubInfo.manageState == afterSubInfo.manageState ? false : true,
    spaceArea:beforeSubInfo.spaceArea == afterSubInfo.spaceArea ? false : true,
    spaceDstStr:beforeSubInfo.spaceDst == afterSubInfo.spaceDst ? false : true,
    spaceNature:beforeSubInfo.spaceNature == afterSubInfo.spaceNature ? false : true,
    spaceAddr:beforeSubInfo.spaceAddr == afterSubInfo.spaceAddr ? false : true,
    landlordName:beforeSubInfo.landlordName == afterSubInfo.landlordName ? false : true,
    landlordPhone:beforeSubInfo.landlordPhone == afterSubInfo.landlordPhone ? false : true,
    pedlarType:beforeSubInfo.pedlarType == afterSubInfo.pedlarType ? false : true,
    placeWork:beforeSubInfo.placeWork == afterSubInfo.placeWork ? false : true,
    placeBiz:beforeSubInfo.placeBiz == afterSubInfo.placeBiz ? false : true,
    placeTimeBegin:beforeSubInfo.placeTimeBegin == afterSubInfo.placeTimeBegin ? false : true,
    placeTimeEnd:beforeSubInfo.placeTimeEnd == afterSubInfo.placeTimeEnd ? false : true,
    show:true
  }
  //经营信息
  if(type === 'WORKSHOP') {
    field.management.prodFormStr = beforeSubInfo.prodFormStr == afterSubInfo.prodFormStr ? false : true;
    field.management.prodVarietyStr = beforeSubInfo.prodVarietyStr == afterSubInfo.prodVarietyStr ? false : true;
    field.management.prodTypeStr = beforeSubInfo.prodTypeStr == afterSubInfo.prodTypeStr ? false : true;
    // APP 实际经营地址编辑
    field.management.realityAddr = beforeSubInfo.realityAddr == afterSubInfo.realityAddr ? false : true
  } else if(type === 'CFDARESTAURANT' || type === 'SALE') {
    field.management.projectMainStr = beforeSubInfo.projectMainStr == afterSubInfo.projectMainStr ? false : true;
    field.management.projectSidStr = beforeSubInfo.projectSidStr == afterSubInfo.projectSidStr ? false : true;
    field.management.realityAddr = beforeSubInfo.realityAddr == afterSubInfo.realityAddr ? false : true
  } else if(type === 'VENDORS') {
    field.management.foodSalesStr = beforeSubInfo.foodSalesStr == afterSubInfo.foodSalesStr ? false : true;
    field.management.foodProdStr = beforeSubInfo.foodProdStr == afterSubInfo.foodProdStr ? false : true;
  }

  //场地信息
  // field.place = {
  //   spaceArea:beforeSubInfo.spaceArea == afterSubInfo.spaceArea ? false : true,
  //   spaceDstStr:beforeSubInfo.spaceDst == afterSubInfo.spaceDst ? false : true,
  //   spaceNature:beforeSubInfo.spaceNature == afterSubInfo.spaceNature ? false : true,
  //   spaceAddr:beforeSubInfo.spaceAddr == afterSubInfo.spaceAddr ? false : true,
  //   show:true
  // }

  //责任落实
  field.duty = {
    syj:beforeSubInfo.syj == afterSubInfo.syj ? false : true,
    grid:beforeSubInfo.grid == afterSubInfo.grid ? false : true,
    so:beforeSubInfo.so == afterSubInfo.so ? false : true,
    soPhone:beforeSubInfo.soPhone == afterSubInfo.soPhone ? false : true,
    infoAssi:beforeSubInfo.infoAssi == afterSubInfo.infoAssi ? false : true,
    infoAssiPhone:beforeSubInfo.infoAssiPhone == afterSubInfo.infoAssiPhone ? false : true,
    firstPl:beforeSubInfo.firstPl == afterSubInfo.firstPl ? false : true,
    firstPlTel:beforeSubInfo.firstPlTel == afterSubInfo.firstPlTel ? false : true,
    manager:beforeSubInfo.manager == afterSubInfo.manager ? false : true,
    managerTel:beforeSubInfo.managerTel == afterSubInfo.managerTel ? false : true,
    show:true
  }

  // 人员信息
  field.emps = {
    show: false
  }
  field.emps.show = checkEmps(beforeSubInfo.emps, afterSubInfo.emps)
  // 文件信息
  field.files = {
    show: checkFiles(beforeSubInfo.files, afterSubInfo.files)
  }
  for (let group in field){
    let groupData = field[group];
    for (let data in groupData){
      if (groupData[data]){
        field[group].show = true;
        break;
      }
      field[group].show = false;
    }

  }
  console.log(field)
  return field;
}

export function checkEmps(beforEmps, afterEmps) {
  if (beforEmps && afterEmps) {
    if (beforEmps.length !== afterEmps.length) {
      return true
    }
    for (let i = 0; i < afterEmps.length; i++) {
      let error
      try {
        Object.keys(afterEmps[i]).forEach(function (key) {
          if (key !== 'id' && key !== 'entityId') {
            if (afterEmps[i][key] !== beforEmps[i][key]) {
              throw error = new Error()
            }
          }
        })
      } catch (e) {
        if (e === error) {
          return true
        } else {
          throw e
        }
      }
    }
  } else if ((beforEmps && beforEmps.length > 0) || (afterEmps && afterEmps.length > 0)) {
    return true
  }
  return false
}

export function checkFiles(beforFiles, afterFiles) {
  if (beforFiles && afterFiles) {
    if (beforFiles.length !== afterFiles.length) {
      return true
    }
    for (let i = 0; i < afterFiles.length; i++) {
      let error
      try {
        Object.keys(afterFiles[i]).forEach(function (key) {
          if (afterFiles[i][key] !== beforFiles[i][key]) {
            throw error =  new Error()
          }
        })
      } catch (e) {
        if (e === error) {
          return true
        } else {
          throw e
        }
      }
    }
  } else if ((beforFiles && beforFiles.length > 0) || (afterFiles && afterFiles.length > 0)) {
    return true
  }
  return false
}
