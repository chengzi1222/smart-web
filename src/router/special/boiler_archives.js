const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //锅炉档案
  name: 'specialBoiler_BoilerArchives', path: '/specialBoiler/Boilerarchives', component: Layout,redirect: '/specialBoiler/Boilerarchives/indexTable',
  children: [
    {
      name: 'specialBoiler_BoilerArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialBoiler_BoilerArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialBoiler_BoilerArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialBoiler_BoilerArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }, {
      name: 'specialBoiler_BoilerArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }
  ]
}, {
  //检验报告管理
    name: 'surveyReport', path: '/specialBoiler/surveyreport', component: Layout, redirect: '/specialBoiler/surveyreport/indexTable',
  children: [
    {
      name: 'specialBoiler_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
