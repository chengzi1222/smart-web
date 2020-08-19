const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const randomRouter = [{
  name: 'random', path: '/random', component: Layout,
  children: [{
    name: 'random.library', path: 'library',
    component: _import('views/random/library/Index'),
  }, {
    name: 'random.library.table', path: 'library/table',
    component: _import('views/random/library/project/TableList'),
  }, {
    name: 'random.library.detail', path: 'library/detail',
    component: _import('views/random/library/project/DetailedList'),
  }, {
    name: 'random.library.project', path: 'library/project',
    component: _import('views/random/library/project/ProjectList'),
  }, {
    name: 'random.library.context', path: 'library/context',
    component: _import('views/random/library/project/ContextList'),
  }]
}, {
  name: 'random.task', path: '/random/task', component: Layout, redirect: '/random/task/list',
  children: [{
    name: 'random.task.list', path: 'list',
    component: _import('views/random/randomTask'),
  }, {
    name: 'random.task.add', path: 'add',
    component: _import('views/random/randomAddContent'),
  },{
    name: 'random.task.edit', path: 'edit',
    component: _import('views/random/randomAddContent'),
  }, {
    name: 'random.task.info', path: 'info',
    component: _import('views/random/taskInfo'),
  }, {
    name: 'random.task.record', path: 'record',
    component: _import('views/random/record/randomRecord'),
  },{
    name: 'random.task.record.detail', path: 'detail',
    component: _import('views/random/record/info'),
  },]
},
{
  name: 'random.executor', path: '/random/executor', component: Layout, redirect: '/random/executor/list',
  children: [{
    name: 'random.executor.list', path: 'list',
    component: _import('views/random/randomTaskExecutor'),
  },{
    name: 'random.executor.record', path: 'record',
    component: _import('views/random/record/randomDeptRecord'),
  },{
    name: 'random.executor.detail', path: 'info',
    component: _import('views/random/record/info'),
  }, {
    name: 'random.task.record.add', path: 'record/add',
    component: _import('views/random/record/Add'),
  }]
}]
export default randomRouter;
