const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //起重机械档案
  name: 'specialhoistingMachinery_hoistingMachineryArchives', path: '/specialhoistingMachinery/hoistingMachineryarchives', component: Layout,redirect: '/specialhoistingMachinery/hoistingMachineryarchives/indexTable',
  children: [
    {
      name: 'specialhoistingMachinery_hoistingMachineryArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialhoistingMachinery_hoistingMachineryArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialhoistingMachinery_hoistingMachineryArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialhoistingMachinery_hoistingMachineryArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialhoistingMachinery_hoistingMachineryArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/specialhoistingMachinery/surveyreport', component: Layout, redirect: '/specialhoistingMachinery/surveyreport/indexTable',
  children: [
    {
      name: 'specialhoistingMachinery_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
