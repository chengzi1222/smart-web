const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const subjectRouter = [
   {
    path: '/xcws/subject/:type/detail', name: 'xcws.subject.restaurant.detail',
    component: _import('views/subject/Detail')
  },
  {
    path: '/subject/product', name: 'subject.product', component: Layout,
    children: [{
      path: 'add', name: 'subject.product.add',
      component: _import('views/subject/product/add')
    },
    {
      path: 'change', name: 'subject.product.change',
      component: _import('views/subject/ChangeIndex')
    }],
  }, {
    path: '/subject/circulation', name: 'subject.circulation', component: Layout,
    children: [{
      path: 'add', name: 'subject.circulation.add',
      component: _import('views/subject/circulation/add')
    },
    {
      path: 'change', name: 'subject.circulation.change',
      component: _import('views/subject/ChangeIndex')
    }],
  }, {
    path: '/subject/restaurant', name: 'subject.restaurant', component: Layout,
    children: [{
      path: 'add', name: 'subject.restaurant.add',
      component: _import('views/subject/restaurant/add')
    },
    {
      path: 'change', name: 'subject.restaurant.change',
      component: _import('views/subject/ChangeIndex')
    }],
  }, {
    path: '/subject/:type', name: 'subject', component: Layout,
    children: [{
      path: 'archives', name: 'subject.archives',
      component: _import('views/subject/Archives')
    }, {
      path: 'archives/detail', name: 'subject.archives.detail',
      component: _import('views/subject/Detail')
    }, {
      // 档案列表中 查看工单详情路由
      path: 'archives/workflow', name: 'subject.archives.workflow',
      component: _import('views/subject/workflow/Detail')
    }, {
      // 工单列表
      path: 'workflow', name: 'subject.workflow',
      component: _import('views/subject/workflow/Workflow')
    }, {
      // 工单详情
      path: 'workflow/detail', name: 'subject.workinfo.detail',
      component: _import('views/subject/workflow/Detail')
    }, {
      // 主体导入
      path: 'import', name: 'subject.import',
      component: _import('views/subject/import/archive')
    }]
  }
]
export default subjectRouter;
