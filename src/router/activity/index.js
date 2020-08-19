const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const activityRouter = [{
  name: 'activity', path: '/activity', component: Layout,
  children: [{
      name: 'activity.taskList', path: 'taskList',
      component: _import('views/activity/taskList')
    }, {
      name: 'statisticIndex', path: 'statisticIndex', component: _import('views/activity/statisticAnalysis/index'),
    },{
      name: 'activity.taskAdd', path: 'taskAdd',
      component: _import('views/activity/taskAdd'),
    },{
      name: 'activity.taskInfo', path: 'taskInfo',
      component: _import('views/activity/taskInfo'),
    }, {
      name: 'activity.supplier', path: 'supplier',
      component: _import('views/activity/supplier/supplierTab'),
    },{
      name: 'boxLunch.info', path: 'boxinfo',
      component: _import('views/activity/box/info')
    }, {
      name: 'activity.reception', path: 'reception',
      component: _import('views/activity/supplier/receptionTab'),
    }, 
    ,{
      name: 'record.everydayDetail', path: 'everydayDetail',
      component: _import('views/activity/checkRecord/detail/everydayDetail'),
    },
    {
      name: 'record.riskDetail', path: 'riskDetail',
      component: _import('views/activity/checkRecord/detail/riskDetail'),
    },{
      name: 'activity.recordList', path: 'recordList',
      component: _import('views/activity/recordList'),
      redirect: '/activity/recordList/boxLunch',
      children: [{
        name: 'record.boxLunch', path: 'boxLunch',
        component: _import('views/activity/box/list')
      },{
        name: 'record.everyday', path: 'everyday',
        component: _import('views/activity/checkRecord/list/everyday'),
      },{
        name: 'record.risk', path: 'risk',
        component: _import('views/activity/checkRecord/list/risk'),
      }]
    }, {
      name: 'activity.table', path: 'table',
      component: _import('views/activity/table/config'),
    }, {
      name: 'activity.dataManage', path: 'dataManage',
      component: _import('views/activity/statisticAnalysis/dataManage'),
    }]
}];

export default activityRouter;
