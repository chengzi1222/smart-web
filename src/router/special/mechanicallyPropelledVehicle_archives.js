const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //专用机动车辆档案
  name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives', path: '/specialmechanicallyPropelledVehicle/mechanicallyPropelledVehiclearchives', component: Layout,redirect: '/specialmechanicallyPropelledVehicle/mechanicallyPropelledVehiclearchives/indexTable',
  children: [
    {
      name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialmechanicallyPropelledVehicle_mechanicallyPropelledVehicleArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
    name: 'surveyReport', path: '/specialmechanicallyPropelledVehicle/surveyreport', component: Layout, redirect: '/specialmechanicallyPropelledVehicle/surveyreport/indexTable',
  children: [
    {
      name: 'specialmechanicallyPropelledVehicle_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
