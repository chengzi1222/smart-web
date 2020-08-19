const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
//import Layout from "components/layout/Layout"; // 有左边菜单
//import MainTwo from "components/layout/MainTwo"; // 有左边菜单
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const subRouter = [{
  path: '/sub', name: '主体管理', component: Layout,
  children: [{
    name: 'subject.map', path: 'map',
    component: _import('views/sub/index'),
  }, {
    name: 'subject.report', path: 'report',   // 统计报表
    component: _import('views/statistics/report_forms'),
  }, {
    name: 'statistics', path: 'statistics/:entityType', component: MainTwo, redirect: '/sub/statistics/:entityType/index',
    children: [{
      name: 'statistics_info', path: 'index',
      component: _import('views/statistics/sub/index'),
    }]
  }]
}]

export default subRouter;
