const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
}

const mediPatrolRouter = [{
  name: 'mediPatrol', path: '/medipatrol', component: Layout,
  children: [{
    name: 'mediPatrolTable', path: 'table', component: MainTwo, redirect: '/medipatrol/table/list',
    children: [{
      name: 'mediPatrolTableList', path: 'list',
      component: _import('views/medi/patrol/project/table_list'),
    }, {
      name: 'mediPatrolDetail', path: 'detail',
      component: _import('views/medi/patrol/project/DetailedList'),
    }, {
      name: 'mediPatrolContextList', path: 'context',
      component: _import('views/medi/patrol/project/context_list'),
    }, {
      name: 'mediPatrolProjectList', path: 'project',
      component: _import('views/medi/patrol/project/project_list'),
    }]
  }, {
    name: 'mediPatrolRecord',
    path: 'record',
    component: MainTwo,
    redirect: '/medipatrol/record/daily/list',
    children: [{
      name: 'mediPatrolRecordDailyList', path: 'daily/list',
      component: _import('views/medi/patrol/record/recordDaily'),
    }, {
      name: 'mediPatrolRecordAdd', path: 'add',
      component: _import('views/medi/patrol/record/dailyadd'),
    }, {
      name: 'mediPatrolRecordDetail', path: 'detail',
      component: _import('views/medi/patrol/record/dayInfo'),
    },{
      name: 'mediPatrol.record.special', path: 'special/list',
      component: _import('views/medi/patrol/record/recordSpecial'),
    },
    {
        name: 'mediPatrol.record.special.add', path: 'special/add',
        component: _import('views/medi/patrol/project/specialadd'),
    },{
        name: 'mediPatrol.record.detail', path: 'special/detail',
        component: _import('views/medi/patrol/project/dayInfo'),
    }]
  }, {
    name: 'mediRepatrolRecord',
    path: 'repatrol',
    component: MainTwo,
    redirect: '/medipatrol/repatrol/list',
    children: [{
      name: 'mediRepatrolRecordList', path: 'list',
      component: _import('views/medi/patrol/repatrol/list'),
    }, {
      name: 'mediRepatrolRecordAd', path: ':curd/:repatrolRecordId',
      component: _import('views/medi/patrol/repatrol/ad'),
    }]
  },{
    name: 'daily', path: 'daily/config',
    component: _import('views/medi/patrol/plan/DailyConfig')
  },{
    name: 'mediSpecial', path: 'special/',component: MainTwo, redirect: '/medipatrol/special/list',
    children: [{
      name: 'specialListMedi', path: 'list',
      component: _import('views/medi/patrol/plan/planSpecial')
    },
    {
      name: 'medi.specialStatis', path: 'specialStatis',
      component: _import('views/medi/sub/specialStatis/index'),
    },{
      name: 'specialAdd', path: 'add',
      component: _import('views/medi/patrol/plan/planSpecialAdd')
    },{
      name: 'specialInfo', path: 'info',
      component: _import('views/medi/patrol/plan/planSpecialInfo')
    }],
  }]
}]

export default mediPatrolRouter;
