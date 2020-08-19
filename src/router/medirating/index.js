const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const mediRatingRouter = [{
  name: 'medirating', path: '/medirating', component: Layout,
  children: [{
    path: 'quantifyLevel', component: MainTwo,
    children: [{
      name: 'medirating.quantifyLevel', path: '',
      component: _import('views/medi/rating/quantifyLevelList'),
    }]
  }, {
    path: 'riskLevel', component: MainTwo,
    children: [{
      name: 'medirating.riskLevel', path: '',
      component: _import('views/medi/rating/riskLevelList'),
    }]
  },]
}]

export default mediRatingRouter;
