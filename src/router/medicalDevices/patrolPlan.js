const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};
/*医疗器械-专项计划管理*/
const medicalDevicesPatrolPlan = [
  {name: 'medicalDevices.PatrolPlan', path: '/medicalDevices/patrolPlan', component: Layout,
    children: [{
      name: 'medicalDevices.specialPlan', path: 'special',component: MainTwo, redirect: '/medicalDevices/patrolPlan/special/list',
        children: [{
          name: 'medicalDevices.specialList', path: 'list',
          component: _import('views/medicalDevices/patrolPlan/planSpecial')
        },
        {
          name: 'medicalDevices.specialAdd', path: 'add',
          component: _import('views/medicalDevices/patrolPlan/planSpecialAdd')
        },{
          name: 'medicalDevices.specialInfo', path: 'info',
          component: _import('views/medicalDevices/patrolPlan/planSpecialInfo')
        }]
    }]
  },
  {name: 'medicalDevices.patrol.repatrol', path: '/medicalDevices/patrol', component: Layout,
    children:[{
      name: 'medicalDevices.RepatrolRecord',path: 'repatrol',component: MainTwo,
      redirect: '/medicalDevices/patrol/repatrol/list',
      children: [{
        name: 'medicalDevices.RepatrolRecordList', path: 'list',
        component: _import('views/medicalDevices/repatrol/list'),
      }, {
        name: 'medicalDevices.RepatrolRecordAdd', path: 'add',
        component: _import('views/medicalDevices/repatrol/ad'),
      }, {
        name: 'medicalDevices.RepatrolRecordInfo', path: 'info',
        component: _import('views/medicalDevices/repatrol/info'),
      }]
    }]
  }
];



export default medicalDevicesPatrolPlan;
