const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const dailyStrategy = [{
  path: '/cosmetics/dailyStrategy', component: Layout,
  children: [{
    name: 'dailyStrategy.index', path: 'index',
    component: _import('views/cosmetics/dailyStrategy/DailyConfig')
  }]
}]

export default dailyStrategy;