const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const specialRouter = [{
  //使用单位档案
  name: 'special_EmployArchives', path: '/special/employarchives', component: Layout, redirect: '/special/employarchives/indexTable',
  children: [
    {
      name: 'special_EmployArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/useUnit/indexTable')
    }, {
      name: 'special_EmployArchives_infoIndex', path: 'infoIndex', component: _import('views/special/archives/useUnit/infoIndex')
    }
  ]
},{
  //检验单位档案
  name: 'special_TestArchives', path: '/special/testarchives', component: Layout, redirect: '/special/testarchives/indexTable',
  children: [
    {
      name: 'special_TestArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/testUnit/indexTable')
    }
  ]
}, {
  //维保单位档案
  name: 'special_MaintenanceArchives', path: '/special/maintenancearchives', component: Layout, redirect: '/special/maintenancearchives/indexTable',
  children: [
    {
      name: 'special_MaintenanceArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/maintenanceUnit/indexTable')
    }
  ]
}, {
  //楼盘档案
  name: 'specialElevator_HousesArchives', path: '/specialElevator/housesarchives', component: Layout, redirect: '/specialElevator/housesarchives/indexTable',
  children: [
    {
      name: 'specialElevator_HousesArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/houses/indexTable')
    }
  ]
}, {
  //电梯档案
  name: 'specialElevator_ElevatorArchives', path: '/specialElevator/elevatorarchives', component: Layout,redirect: '/specialElevator/elevatorarchives/indexTable',
  children: [
    {
      name: 'specialElevator_ElevatorArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialElevator_ElevatorArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialElevator_ElevatorArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialElevator_ElevatorArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialElevator_ElevatorArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //涉密电梯档案
  name: 'specialElevator_secretElevatorArchives', path: '/specialElevator/secretelevatorarchives', component: Layout,redirect: '/specialElevator/secretelevatorarchives/indexTable',
  children: [
    {
      name: 'specialElevator_secretElevatorArchives_indexTable', path: 'indexTable', component: _import('views/special/archives/management/indexTable')
    }, {
      name: 'specialElevator_secretElevatorArchives_add', path: 'add', component: _import('views/special/archives/management/add')
    }, {
      name: 'specialElevator_secretElevatorArchives_info', path: 'info', component: _import('views/special/archives/management/info')
    }, {
      name: 'specialElevator_secretElevatorArchives_import', path: 'import', component: _import('views/special/archives/management/import')
    }, {
      name: 'specialElevator_secretElevatorArchives_editInfo', path: 'editInfo', component: _import('views/special/archives/management/infoComm/editInfo')
    }
  ]
}, {
  //检验报告管理
  name: 'surveyReport', path: '/specialElevator/surveyreport', component: Layout, redirect: '/specialElevator/surveyreport/indexTable',
  children: [
    {
      name: 'specialElevator_Surveyreport_indexTable', path: 'indexTable', component: _import('views/special/archives/surveyreport/indexTable')
    }
  ]
}]

export default specialRouter;
