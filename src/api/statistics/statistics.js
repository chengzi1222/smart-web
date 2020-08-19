import http from 'utils/http';
import qs from 'qs';

/**
 *
 * @param bType BIZType 主体类型(all,cfda,entity)
 * @param eType EntityType 经营主体类型(生产,流通,餐饮)
 * @param riskRank  风险等级
 * @param spaceDst  场所分布
 * @param quanLevel 量化等级
 */
export function reportForms(bType,eType,riskRank,spaceDst,quanLevel,sub) {
  return http({
    method: 'post',
    url: 'statistics/reportforms',
    data: qs.stringify({
      sub:sub,
      bType:bType,
      eType:eType,
      riskRank:riskRank,
      spaceDst:spaceDst,
      quanLevel:quanLevel
    })
  });
}

export function workForms(params) {
  return http({
    method: 'post',
    url: 'statistics/workForms',
    data:params
  });
}

export function getDicts(sub) {
  return http({
    method: 'post',
    url: 'statistics/dict',
    data:qs.stringify({
      sub:sub
    })
  });
}

export function exportFile(title,remake,type,bType,eType,riskRank,spaceDst,quanLevel,sub) {
  return http({
    method: 'POST',
    url: 'statistics/export',
    data: qs.stringify({
      remake:remake,
      title:title,
      sub:sub,
      type:type,
      bType:bType,
      eType:eType,
      riskRank:riskRank,
      spaceDst:spaceDst,
      quanLevel:quanLevel
    })
  });
}

export function exportWorkFile(params) {
  return http({
    method: 'POST',
    url: 'statistics/exportWorkFile',
    data: params
  });
}

export function cfdaNumberTotal() {
  return http({
    method: 'get',
    url: 'statistics/cfdaNumberTotal',
  });
}

export function cfdaByType(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByType',
    data:params
  });
}

export function cfdaByRisk(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByRisk',
    data:params
  });
}

export function cfdaByQuantify(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByQuantify',
    data:params
  });
}

export function cfdaByArea(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByArea',
    data:params
  });
}

export function cfdaByPlace(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByPlace',
    data:params
  });
}

export function cfdaByTrend(params) {
  return http({
    method: 'post',
    url: 'statistics/cfdaByTrend',
    data:params
  });
}

/**
 *  获取区域
 */
export function getdeptGrid() {
  return http({
    method: 'post',
    url: 'cfda/entity/grid/getByDept'
  });
}

/**
 *  获取部门
 */
export function getDept() {
  return http({
    method: 'get',
    url: 'statistics/getDept'
  });
}

export function exportTitleGenerate(name,select,value){
  if (value == ''){
    return name + "(全部)"
  }
  for (let i = 0; i < select.length; i++){
    if (select[i].code == value){
      return name + "(" + select[i].name +")"
    }
  }
}


