const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const medicalDevicesRecord = [
  {
    path: '/medicalDevices/record', component: Layout,
    children: [
      {
        path: 'daily', redirect: '/medicalDevices/record/daily/tab',
        component: _import('views/medicalDevices/record/index'),
        children: [{
          name: 'maai.dailyRecord.tab', path: 'tab',
          component: _import('views/medicalDevices/record/recordDaily')
        },{
          name: 'maai.dailyRecord.add', path: 'add',
          component: _import('views/medicalDevices/record/add')
        },{ //巡查记录详情
          name: 'maai.dailyRecord.info',path: 'info',
          component: _import('views/medicalDevices/record/recordInfo')
        }]
      },
      {
        path: 'special', redirect: '/medicalDevices/record/special/tab',
        component: _import('views/medicalDevices/record/index'),
        children: [{
          name: 'maai.specialRecord.tab', path: 'tab',
          component: _import('views/medicalDevices/record/recordSpecial')
        },{
          name: 'maai.specialRecord.add', path: 'add',
          component: _import('views/medicalDevices/record/add')
        },{ //巡查记录详情
          name: 'maai.specialRecord.info',path: 'info',
          component: _import('views/medicalDevices/record/recordInfo')
        }]
      }

    ]
  }
];

export default medicalDevicesRecord;
