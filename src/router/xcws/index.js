const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return require('@/' + file + '.vue').default
};

const xcwsWarnRouter = [{
    name: 'xcwsWarnStatistics',
    path: '/xcwsWarnStatistics',
    component: _import('views/xcws/warnStatistics/index'),
  }, {
    name: 'xcwsWarn',
    path: '/xcwsWarn',
    component: Layout,
    children: [{
        name: 'xcwsWarn.food',
        path: 'food',
        component: _import('views/xcws/warn/food/index'),
      },
      {
        name: 'xcwsWarn.foodDetail',
        path: 'food/detail',
        component: _import('views/xcws/warn/food/detail'),
      }, {
        name: 'xcwsWarn.healthCert',
        path: 'healthCert',
        component: _import('views/xcws/warn/healthCert/index'),
      },
      {
        name: 'xcwsWarn.healthCertDetail',
        path: 'healthCert/detail',
        component: _import('views/xcws/warn/healthCert/detail'),
      }, {
        name: 'xcwsWarn.licence',
        path: 'licence',
        component: _import('views/xcws/warn/licence/index'),
      },
      {
        name: 'xcwsWarn.licenceDetail',
        path: 'licence/detail',
        component: _import('views/xcws/warn/licence/detail'),
      }, {
        name: 'xcwsWarn.trace',
        path: 'trace',
        component: _import('views/xcws/warn/trace/index'),
      },
      {
        name: 'xcwsWarn.traceDetail',
        path: 'trace/detail',
        component: _import('views/xcws/warn/trace/detail'),
      }, {
        name: 'xcwsWarn.check',
        path: 'check',
        component: _import('views/xcws/warn/check/index'),
      },
      {
        name: 'xcwsWarn.checkDetail',
        path: 'check/detail',
        component: _import('views/xcws/warn/check/detail'),
      }, {
        name: 'xcwsWarn.complaint',
        path: 'complaint',
        component: _import('views/xcws/warn/complaint/index'),
      },
      {
        name: 'xcwsWarn.complaintDetail',
        path: 'complaint/detail',
        component: _import('views/xcws/warn/complaint/detail'),
      }, {
        name: 'xcwsWarn.supervise',
        path: 'supervise',
        component: _import('views/xcws/warn/supervise/index'),
      },
      {
        name: 'xcwsWarn.superviseDetail',
        path: 'supervise/detail',
        component: _import('views/xcws/warn/supervise/detail'),
      }, {
        name: 'xcwsWarn.kitchen',
        path: 'kitchen',
        component: _import('views/xcws/warn/kitchen/index'),
      },
      {
        name: 'xcwsWarn.kitchenDetail',
        path: 'kitchen/detail',
        component: _import('views/xcws/warn/kitchen/detail'),
      },
        {
            name:'xcwsWarn.AIWarnList',
            path:'AIWarnList',
            component:_import('views/xcws/warn/AIWarn/index')
        },
        {
            name:'xcwsWarn.AIWarnDetail',
            path:'AIWarnList/detail',
            component:_import('views/xcws/warn/AIWarn/detail')
        },
        {
          name:'xcwsWarn.anomalyDetail',
          path:'AIWarnList/anomalyDetail',
          component:_import('views/xcws/warn/AIWarn/anomalyDetail')
        },
    ]
  },
  { // 短信预警配置
    name: 'messageWarn',
    path: '/messageWarn',
    component: Layout,
    children: [{
        name: 'messageWarn.warnModules',
        path: 'warnModules',
        component: _import('views/xcws/messageWarn/warnModules/index'),
      },
      {
        name: 'messageWarn.warnPhone',
        path: 'warnPhone',
        component: _import('views/xcws/messageWarn/warnPhone/index'),
      }
    ]
  },
  {
    name: 'xcws',
    path: '/xcws',
    component: Layout,
    children: [{
        name: 'xcws.areaAssess',
        path: 'areaAssess',
        component: _import('views/xcws/areaAssess/index'),
      },
      {
        name: 'xcws.subjectAssess',
        path: 'subjectAssess',
        component: _import('views/xcws/subjectAssess/index'),
      },
      {
        name: 'xcws.subjectAssessDetail',
        path: 'subjectAssess/detail',
        component: _import('views/xcws/subjectAssess/detail'),
      }
    ]
  },
]

export default xcwsWarnRouter;
