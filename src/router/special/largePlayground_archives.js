const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //游乐设施档案
  name: 'speciallargePlayground_largePlaygroundArchives', path: '/speciallargePlayground/largePlaygroundarchives', component: Layout,redirect: '/speciallargePlayground/largePlaygroundarchives/indexTable',
  children: [
    {
      name: 'speciallargePlayground_largePlaygroundArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'speciallargePlayground_largePlaygroundArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'speciallargePlayground_largePlaygroundArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'speciallargePlayground_largePlaygroundArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'speciallargePlayground_largePlaygroundArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/speciallargePlayground/surveyreport', component: Layout, redirect: '/speciallargePlayground/surveyreport/indexTable',
  children: [
    {
      name: 'speciallargePlayground_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
