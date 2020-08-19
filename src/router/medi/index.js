const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const mediRouter = [{
  path: '/medi', component: Layout,
  children: [{
    name: 'medi.subject.list', path: 'subject/:type/list',
    component: _import('views/medi/subject/list')
  }, {
    name: 'medi.subject.add', path: 'subject/:type/add',
    component: _import('views/medi/subject/add')
  },{
    name: 'medi.subject.import', path: 'subject/:type/import',
    component: _import('views/medi/subject/import/archive')
  }, {
    name: 'medi.subject.archive', path: 'subject/:type/detail',
    component: _import('views/medi/subject/archive')
  },{
    name: 'warning', path: 'warning/list',
    component: _import('views/warning/warningTask')
  },{
    name: 'warning.add', path: 'warning/add',
    component: _import('views/warning/warningTaskAdd')
  },{
    name: 'warning.detail', path: 'warning/detail',
    component: _import('views/warning/warningTaskDetail')
  }, {
    name: 'warning.situation', path: 'warning/situation',
    component: _import('views/warning/situation')
  }, {
    name: 'workflow', path: 'workflow',
    component: _import('views/medi/workflow/main'),
    children: [{
      name: 'list', path: ':type/list',
      component: _import('views/medi/workflow/list'),
    },{
      name: 'medi.workflow.workflow_auditInfo', path: 'first',
      component: _import('views/medi/workflow/first/index'),
    },{
      name: 'medi.workflow.workflow_workInfo', path: 'change',
      component: _import('views/medi/workflow/change/index'),
    },{
      name: 'medi.workflow.mywork', path: 'mywork',
      component: _import('views/medi/workflow/mywork'),
    },{
      name: 'medi.workflow.rework', path: 'rework',
      component: _import('views/medi/workflow/rework')
    }]
  }, {
    name: 'enterprise', path: 'enterprise/:type/list',
    component: _import('views/medi/enterprise/list')
  }, {
    name: 'enterprise.user', path: 'user/list',
    component: _import('views/medi/enterprise/userList')
  }, {
    name: 'warning.info', path: 'warning/info',
    component: _import('views/medi/warning/info')
  }]
}]

export default mediRouter;
