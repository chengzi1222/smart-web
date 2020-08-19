const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const subjectDataRouter = [
  {
    path: '/deploy', component: Layout,
    children: [{
      name: 'subjectData.deploy.total', path: 'totalDeploy',
      component: _import('views/bigData/subjectData/deploy/totalDeploy'),
    },{
      name: 'subjectData.deploy.page', path: 'pageDeploy',
      component: _import('views/bigData/subjectData/deploy/pageDeploy'),
    }]
  },
  {
    name: 'subjectData.foodConsole', path: '/subjectData/foodConsole',
    component: _import('views/bigData/subjectData/components/food/console'),
  },
  {
    name: 'subjectData.4k', path: '/subjectData/4k',
    component: _import('views/bigData/subjectData/components/food/4kTrace/index_4k'),
  },
  {
    name: 'subjectData.foodSubData', path: '/subjectData/foodSubData',
    component: _import('views/bigData/subjectData/components/food/foodsub/index'),
  }, {
    name: 'subjectData.one', path: '/subjectData/one',
    component: _import('views/bigData/subjectData/components/food/typeDistribution'),
  }, {
    name: 'subjectData.onePlus', path: '/subjectData/onePlus',
    component: _import('views/bigData/subjectData/components/one/type'),
  }, {
    name: 'subjectData.grow', path: '/subjectData/grow',
    component: _import('views/bigData/subjectData/components/one/grow'),
  }, {
    name: 'subjectData.subject', path: '/subjectData/subject',
    component: _import('views/bigData/subjectData/components/one/subject'),
  }, {
    name: 'subjectData.host', path: '/subjectData/host',
    component: _import('views/bigData/subjectData/components/food/foodsub/zhouyi/mapA'),
  }, {
    name: 'subjectData.two', path: '/subjectData/two',
    component: _import('views/bigData/subjectData/components/food/growthTrend'),
  }, {
    name: 'subjectData.three', path: '/subjectData/three',
    component: _import('views/bigData/subjectData/components/food/subjectDistribution'),
  }, {
    name: 'subjectData.five', path: '/subjectData/five',
    component: _import('views/bigData/subjectData/components/food/dataDistribution'),
  }, {
    name: 'subjectData.six', path: '/subjectData/six',
    component: _import('views/bigData/subjectData/components/food/Sudoku'),
  }, {
    name: 'subjectData.seven', path: '/subjectData/seven',
    component: _import('views/bigData/subjectData/components/food/Unit'),
  },{
    name: 'subjectData.layout4x4', path: '/subjectData/layout4x4',
    component: _import('views/bigData/subjectData/structure/4x4'),
  },{//四川省智慧城市食品概览
    name: 'subjectData.overview', path: '/subjectData/overview',
    component: _import('views/bigData/subjectData/components/food/overview/index'),
  },{
    name: 'subjectData.layout4x4', path: '/subjectData/map3',
    component: _import('views/bigData/subjectData/components/food/foodsub/zhouyi/mapSource'),
  },
  {//天府新区大屏
    name: 'subjectData.overviewTFXQ', path: '/subjectData/overview_tfxq',
    component: _import('views/bigData/subjectData/components/food/overviewTFXQ/index'),
  },
  {
    name: 'subjectData.foodSubTFXQ', path: '/subjectData/foodsub_tfxq',
    component: _import('views/bigData/subjectData/components/food/foodsub/indexTFXQ'),
  },
  {
    name: 'subjectData.kitchenTFXQ', path: '/subjectData/kitchen_tfxq',
    component: _import('views/bigData/subjectData/components/food/overviewTFXQ/kitchen'),
  }
]

export default subjectDataRouter;