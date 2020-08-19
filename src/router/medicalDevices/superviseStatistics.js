const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const superviseStatisticsRouter = [
    {
      path: '/medicalDevices/subjects/', name: 'maai_form', component: Layout, 
      children: [
        {path: 'subForm', name: 'maai.subForm', component:_import('views/medicalDevices/subject/subForm/form') ,},
      ]
    },
    {
      path: '/medicalDevices/patrol/situation', name: 'maai_situation_statistics', component: Layout,
      children: [
        {path: 'statistics', name: 'maai.situation.statistics', component:_import('views/medicalDevices/superviseStatistics/statistics') ,}
        ,{path: 'subForm', name: 'maai.subForm', component:_import('views/medicalDevices/subject/subForm/form') ,}
      ]
    },
    {
      path: '/medicalDevices/patrol', name: 'maai_specialStatis', component: Layout,
      children: [
        {path: 'specialStatis', name: 'maai.specialStatis', component:_import('views/medicalDevices/superviseStatistics/specialStatis') ,}
      ]
    },
];

export default superviseStatisticsRouter;
