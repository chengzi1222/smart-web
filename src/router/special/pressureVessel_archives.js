const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //压力容器档案
    name: 'specialpressureVessel_pressureVesselArchives', path: '/specialpressureVessel/pressureVesselarchives', component: Layout, redirect: '/specialpressureVessel/pressureVesselarchives/indexTable',
  children: [
    {
      name: 'specialpressureVessel_pressureVesselArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialpressureVessel_pressureVesselArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialpressureVessel_pressureVesselArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialpressureVessel_pressureVesselArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialpressureVessel_pressureVesselArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/specialpressureVessel/surveyreport', component: Layout, redirect: '/specialpressureVessel/surveyreport/indexTable',
  children: [
    {
      name: 'specialpressureVessel_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
