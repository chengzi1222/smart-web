const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const subStatisticsRouter = [{
  name: 'subStatistic', path: '/medi/subStatistics', component: Layout,
  children: [{
    name: 'index_manager', path: 'index_manager', component: _import('views/medi/subStatistics/index')
  },{
    name: 'index_employ', path: 'index_employ', component: _import('views/medi/subStatistics/index')
  },{
    name: 'statisticalForm', path: 'statisticalForm', component: _import('views/medi/subStatistics/statisticalForm')
  },{
      name: 'statistics', path: 'statistics', component: _import('views/medi/subStatistics/statistics')
  }]
}];

export default subStatisticsRouter;
