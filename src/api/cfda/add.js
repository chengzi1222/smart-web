import http from "utils/http";
import qs from "qs";

export function addCfda(prams) {
  return http({
    method: 'post',
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    url: 'cfda/add',
    data: prams
  });
}


export function addAutoSave(prams) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/auto/save',
    data: prams
  });
}

export function addBackup(prams) {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: 'post',
    url: 'cfda/add/backup',
    data: prams
  });
}

export function getSyj() {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: 'get',
    url: 'cfda/add/get/syj'
  });
}

export function getGrid(syj) {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: 'post',
    url: 'cfda/add/get/grid',
    data: qs.stringify({ syj: syj })
  });
}

export function getSoEmp(grid) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/so/emp',
    data: qs.stringify({ grid: grid })
  });
}

export function getInfoAssi(grid) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/info/assi',
    data: qs.stringify({ grid: grid })
  });
}

export function getProdType(type) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/prod/type',
    data: qs.stringify({ type: type })
  });
}

export function getProdVariety(variety) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/prod/variety',
    data: qs.stringify({ variety: variety })
  });
}

export function getAutoSave() {
  return http({
    loading: false,
    method: 'get',
    url: 'cfda/add/get/auto/save'
  });
}

export function getTodayCount() {
  return http({
    loading: false,
    method: 'get',
    url: 'cfda/add/get/today/count'
  });
}

export function getBackup(bid) {
  return http({
    loading: true,
    loadOption: {
      text: "加载中..."
    },
    method: 'post',
    url: 'cfda/add/get/backup',
    data: qs.stringify({ bid: bid })
  });
}

export function getBackupPage(page, size) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/backup/page',
    data: qs.stringify({ page: page, size: size })
  });
}

export function removeBackup(bid) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/remove/backup',
    data: qs.stringify({ bid: bid })
  });
}

export function removeFile(id) {
  return http({
    loading: false,
    method: 'DELETE',
    url: 'file/' + id
  });
}

export function getBackupCount() {
  return http({
    loading: false,
    method: 'get',
    url: 'cfda/add/get/backup/count',
  });
}

export function getProd(code, name, types) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/prod',
    data: { code: code, name: name, types: types }
  })
}

export function getProdByList(code, prods) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/prodbylist',
    data: { code: code, prods: prods }
  })
}

export function getProdTypes(types, zdcode) {
  return http({
    loading: false,
    method: 'post',
    url: 'cfda/add/get/getProdTypes',
    data: { types: types, zdcode: zdcode }
  })
}

export function getEntityByCredit(code) {
  return http({
    loading: false,
    method: 'post',
    url: '/cfda/getEntityByCredit',
    data: qs.stringify({ creditCode: code })
  })
}



