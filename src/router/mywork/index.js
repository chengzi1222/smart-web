const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const myworkRouter = [{
  path: '/mywork', component: Layout,
  children: [{
    name: 'mywork', path: '',
    component: _import('views/mywork/mywork'),
    redirect:'/mywork/cfda',
    children: [{
      name: 'mywork.cfda', path: 'cfda',
      component: _import('views/mywork/cfda/list'),
    }, {
      name: 'mywork.sub', path: ':entityType',
      component: _import('views/mywork/sub/list'),
    }]
  }, {
    name: 'mywork.cfda.detail', path: 'cfda/detail',
    component: _import('views/cfda/workflow/info/index'),
  }, {
    name: 'mywork.cfda.workflow', path: 'cfda/workflow',
    component: _import('views/cfda/workflow/change/change_index')
  }, {
    name: 'mywork.sub.product', path: 'sub/reapply/product',
    component: _import('views/subject/ChangeIndex')
  }, {
    name: 'mywork.sub.circulation', path: 'sub/reapply/circulation',
    component: _import('views/subject/ChangeIndex')
  }, {
    name: 'mywork.sub.restaurant', path: 'sub/reapply/restaurant',
    component: _import('views/subject/ChangeIndex')
  },]
}]

export default myworkRouter;
