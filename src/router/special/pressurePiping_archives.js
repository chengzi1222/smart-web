const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //压力管道档案
  name: 'specialpressurePiping_pressurePipingArchives', path: '/specialpressurePiping/pressurePipingarchives', component: Layout,redirect: '/specialpressurePiping/pressurePipingarchives/indexTable',
  children: [
    {
      name: 'specialpressurePiping_pressurePipingArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialpressurePiping_pressurePipingArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialpressurePiping_pressurePipingArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialpressurePiping_pressurePipingArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialpressurePiping_pressurePipingArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/specialpressurePiping/surveyreport', component: Layout, redirect: '/specialpressurePiping/surveyreport/indexTable',
  children: [
    {
      name: 'specialpressurePiping_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
