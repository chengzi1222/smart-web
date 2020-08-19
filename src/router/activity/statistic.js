const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const statisticRouter = [{
  name: 'statistic', path: '/activity/statistic', component: Layout,
  children: [{
    name: 'camerAd', path: 'camerAd', component: _import('views/activity/statisticAnalysis/cameraAd'),
  }]
}];

export default statisticRouter;
