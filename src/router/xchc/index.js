const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return require('@/' + file + '.vue').default
};

const xchcRouter = [{
    name: 'xchc',
    path: '/xchc',
    component: Layout,
    children: [{
        name: 'xchc.pointManage',
        path: 'pointManage',
        component: MainTwo, redirect: '/xchc/pointManage/list',
        children:[{
          name:'xchc.pointManage.list',path:'list',
          component: _import('views/onSiteInspect/pointManage/list'),
        },{
          name:'xchc.pointManage.add',path:'add',
          component: _import('views/onSiteInspect/pointManage/add'),
        },{
          name:'xchc.pointManage.edit',path:'edit',
          component: _import('views/onSiteInspect/pointManage/edit'),
        },{
          name:'xchc.pointManage.detail',path:'detail',
          component: _import('views/onSiteInspect/pointManage/detail'),
        },{
          name:'xchc.pointManage.setting',path:'setting',
          component: _import('views/onSiteInspect/pointManage/setting'),
        }]
      },
      {
        name: 'xchc.subManage',
        path: 'subManage',
        component:MainTwo, redirect:'/xchc/subManage/list',
        children:[{
          name:'xchc.subManage.list', path:'list',
          component: _import('views/onSiteInspect/subManage/list'),
        },{
          name:'xchc.subManage.checkRecord', path:'checkRecord',
          component: _import('views/onSiteInspect/subManage/checkRecord'),
        },{
          name: 'xchc.allDetails.subManage', path: 'allDetails',
          component: _import('views/onSiteInspect/com/allDetails'),
        }]
      },
      {
        name: 'xchc.taskManage',
        path: 'taskManage',
        component:MainTwo, redirect:'/xchc/taskManage/list',
        children:[{
          name:'xchc.taskManage.list',path:'list',
          component: _import('views/onSiteInspect/taskManage/list'),
        },{
          name:'xchc.taskManage.inspect',path:'inspect',
          component: _import('views/onSiteInspect/taskManage/inspect'),
        }]
      },
      {
        name: 'xchc.inspectRecord',
        path: 'inspectRecord',
        component: MainTwo, redirect: '/xchc/inspectRecord/list',
        children: [{
          name: 'xchc.inspectRecord.list', path: 'list',
          component: _import('views/onSiteInspect/inspectRecord/list'),
        },{
          name: 'xchc.allDetails.inspectRecord', path: 'allDetails',
          component: _import('views/onSiteInspect/com/allDetails'),
        }]
      },
      {
        name: 'xchc.revManage',
        path: 'revManage',
        component: MainTwo, redirect: '/xchc/revManage/list',
        children: [{
          name: 'xchc.revManage.list', path: 'list',
          component: _import('views/onSiteInspect/revManage/list'),
        },{
          name: 'xchc.revManage.ad', path: 'ad',
          component: _import('views/onSiteInspect/revManage/ad'),
        },{
          name: 'xchc.revManage.audit', path: 'audit',
          component: _import('views/onSiteInspect/revManage/audit'),
        },{
          name: 'xchc.allDetails.revManage', path: 'allDetails',
          component: _import('views/onSiteInspect/com/allDetails'),
        }]
      },
    ]
  }
]

export default xchcRouter;
