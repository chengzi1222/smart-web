const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const enforceRouter = [{
  name: 'enforce', path: '/enforce', component: Layout,
  children: [{
    path: 'punish', component: MainTwo,
    children: [{
      name: 'enforce.punish', path: '',
      component: _import('views/enforce/punishList'),
    }, {
      name: 'enforce.punish.add', path: 'add',
      component: MainTwo, component: _import('views/enforce/punishAdd'),
    }, {
      name: 'enforce.punish.detail', path: 'detail',
      component: _import('views/enforce/punishDetail'),
    }]
  }, {
    path: 'criminalCase', component: MainTwo,
    children: [{
      name: 'enforce.criminalCase', path: '',
      component: _import('views/enforce/criminalCaseList'),
    }, {
      name: 'enforce.criminalCase.detail', path: 'detail',
      component: _import('views/enforce/criminalCaseDetail'),
    }, {
      name: 'enforce.criminalCase.add', path: 'add',
      component: _import('views/enforce/criminalCaseAdd'),
    }]
  }]
}]

export default enforceRouter;
