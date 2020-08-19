const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const medicalDevicesArchivesRouter = [
    {
      path: '/medicalDevices/subject/:type', name: 'medicalDevices_import', component: Layout,
      children: [
        {
          path:'import',name:'medicalDevices_subject.import',
          component: _import('views/medicalDevices/subject/import/archive'),
        },
      ]
    },
    {
      path:'/medicalDevices/subject/product',name:'medicalDevices_sub',component: Layout,
      redirect: '/medicalDevices/subject/product/list',
      children:[
        {
         path: 'list', name: 'medicalDevices_sub.product.list',
         component: _import('views/medicalDevices/subject/Archives/product/list'),
        },
        {
          path: 'add', name: 'medicalDevices_sub.product.add',
          component: _import('views/medicalDevices/subject/Archives/product/add'),
         },
         {
           path: 'detail', name: 'medicalDevices_sub.product.detail',
           component: _import('views/medicalDevices/subject/Archives/infoTab'),
          }
      ]
    },
    {
      path:'/medicalDevices/subject/manager',name:'medicalDevices_sub',component: Layout,
      redirect: '/medicalDevices/subject/manager/list',
      children:[
        {
         path: 'list', name: 'medicalDevices_sub.manager.list',
         component: _import('views/medicalDevices/subject/Archives/manager/list'),
        },
        {
          path: 'add', name: 'medicalDevices_sub.manager.add',
          component: _import('views/medicalDevices/subject/Archives/manager/add'),
         },
         {
           path: 'detail', name: 'medicalDevices_sub.manager.detail',
           component: _import('views/medicalDevices/subject/Archives/infoTab'),
          }
      ]
    },
    {
      path:'/medicalDevices/subject/employ',name:'medicalDevices_sub',component: Layout,
      redirect: '/medicalDevices/subject/employ/list',
      children:[
        {
         path: 'list', name: 'medicalDevices_sub.employ.list',
         component: _import('views/medicalDevices/subject/Archives/employ/list'),
        },
        {
          path: 'add', name: 'medicalDevices_sub.employ.add',
          component: _import('views/medicalDevices/subject/Archives/employ/add'),
         },
         {
           path: 'detail', name: 'medicalDevices_sub.employ.detail',
           component: _import('views/medicalDevices/subject/Archives/infoTab'),
          }
      ]
    },
    //主体统计分析
    {
      path: '/medicalDevices/subject/statistic', name: 'medicalDevices_subject_statistic_production', component: Layout,
      children: [
        {
          path: 'production', name:'medicalDevices_subject_statistic.production',
          component: _import('views/medicalDevices/subject/statisticAnalysis/index'),
        }, {
          path: 'manager', name: 'medicalDevices_subject_statistic.manager',
          component: _import('views/medicalDevices/subject/statisticAnalysis/index'),
        }, {
          path: 'employ', name: 'medicalDevices_subject_statistic.employ',
          component: _import('views/medicalDevices/subject/statisticAnalysis/index'),
        },
      ]
    },
    //主体地图
    {
      path: '/medicalDevices/subject/map', name: 'medicalDevices_subject_map', component: Layout,
      children: [
        {
          path: 'subMap', name:'medicalDevices_subject_subMap',
          component: _import('views/medicalDevices/sub/cosmeticsMap'),
        },
      ]
    },
];

export default medicalDevicesArchivesRouter;
