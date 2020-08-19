const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //客运索道档案
  name: 'specialpassengerRopeway_passengerRopewayArchives', path: '/specialpassengerRopeway/passengerRopewayarchives', component: Layout,redirect: '/specialpassengerRopeway/passengerRopewayarchives/indexTable',
  children: [
    {
      name: 'specialpassengerRopeway_passengerRopewayArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialpassengerRopeway_passengerRopewayArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialpassengerRopeway_passengerRopewayArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialpassengerRopeway_passengerRopewayArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialpassengerRopeway_passengerRopewayArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/specialpassengerRopeway/surveyreport', component: Layout, redirect: '/specialpassengerRopeway/surveyreport/indexTable',
  children: [
    {
      name: 'specialpassengerRopeway_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
