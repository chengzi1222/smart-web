import http from "utils/http";
import qs from "qs";

/**
 *
 * @param eid 主体id
 * @param bid 草稿id
 */
export function getData(eid,workId,bid,entityType) {
  return http({
    loadOption:{
      text:"加载中..."
    },
    method: 'post',
    url: 'sub/add/getdata',
    data: qs.stringify({
      entityId:eid,
      workId:workId,
      backupId:bid,
      entityType:entityType
    })
  });
}

export function addSub(data) {
  return http({
    method: 'post',
    loadOption:{
      text:"加载中..."
    },
    url: 'sub/add/submit',
    data: data
  });
}

export function edit(params) {
  let detailedEngage = params.detailedEngage;
  if (detailedEngage){
    for(let i=0; i<detailedEngage.length; i++){
      if (detailedEngage[i]){
        detailedEngage[i].parent = null;
      }
    }
    params.detailedEngage = detailedEngage;
  }
  return http({
    method: 'post',
    loadOption:{
      text:"加载中..."
    },
    url: 'mywork/edit',
    data: params
  });
}

export function getGrid(syj) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/get/grid',
    data: qs.stringify({syj:syj})
  });
}

export function getSoEmp(grid) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/get/so/emp',
    data: qs.stringify({grid:grid})
  });
}

export function getInfoAssi(grid) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/get/info/assi',
    data: qs.stringify({grid:grid})
  });
}

export function getLicenceno(creditCode,entityId,natureType) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/common/getentity/licenceno',
    data: qs.stringify({creditCode:creditCode,entityId:entityId,natureType: natureType})
  });
}

export function getCreditinfo(creditCode) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/getentity/creditinfo',
    data: qs.stringify({creditCode:creditCode})
  });
}

export function getOperTypes(types,zdcode) {
  return http({
    loading: false,
    method:'post',
    url:'sub/add/getopertypes',
    data:{types:types,zdcode:zdcode}
  })
}
/**
 * 根据Code查询集合
 * @param code 字典code
 * @param name 模糊查询条件
 * @param types 不需要查询出的code
 */
export function getProd(code,name,types) {
  return http({
    loading: false,
    method:'post',
    url:'sub/add/getprod',
    data:{code:code,name:name,types:types}
  })
}

/**
 * 自动保存
 * @param e entity
 */
export function autosaveback(e) {
  return http({
    loading: false,
    method:'post',
    url:'sub/add/autosaveback',
    data:e
  })
}

/**
 * 保存草稿
 * @param e entity
 */
export function saveback(e) {
  return http({
    loading: false,
    method:'post',
    url:'sub/add/saveback',
    data:e
  })
}

export function getBackupPage(entityType,page,size) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/getbacks',
    data: qs.stringify({entityType:entityType,page:page,size:size})
  });
}

export function removeBackup(bid){
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/removebacks',
    data: qs.stringify({bid:bid})
  });
}

export function getBackupCount(entityType) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/backupcount',
    data: qs.stringify({entityType:entityType})
  });
}

export function getOperDetail(zdcode,operdetails) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/getoperdetail',
    data: {operdetails:operdetails,
      zdcode:zdcode}
  });
}

export function getToDayCnt(entityType) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/gettodaycnt',
    data: qs.stringify({entityType:entityType})
  });
}

export function getAutoSave(entityType) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/getautosave',
    data: qs.stringify({entityType:entityType})
  });
}


/* 路由整改API */
export function getSubBycreditCode(creditCode, entityId) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/common/entity/creditCode',
    data: qs.stringify({creditCode:creditCode, entityId:entityId})
  });
}

export function saveEntityInfo(data) {
  return http({
    method: 'post',
    loading: true,
    loadOption:{
      text:"加载中..."
    },
    url: 'sub/add/save',
    data: data
  });
}

export function getTowns(data) {
  return http({
    method: 'get',
    loadOption:{
      text:"加载中..."
    },
    url: 'sub/add/towns',
  });
}

export function getBackupNumTotal(entityType) {
  return http({
    loading: false,
    method: 'get',
    url: 'sub/add/backupNumTotal/' + entityType,
  });
}


export function getSupervisor(syjId, gridId) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/add/get/so/supervisor',
    data: qs.stringify({syjId:syjId, gridId:gridId})
  });
}

export function countLicence(params) {
  return http({
    loading: false,
    method: 'post',
    url: 'sub/common/countLicence',
    data: qs.stringify(params)
  });
}



