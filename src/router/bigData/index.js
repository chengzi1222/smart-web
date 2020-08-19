const LayoutTwo = () => import('@/components/layout/LayoutTwo'); // 没有左边菜单
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const bigDataRouter = [//大数据
  {
    name: 'bigData.foodMap', path: '/foodMap',
    component: _import('views/bigData/foodMap/index'),
  }, 
  {
    name: 'bigData.statisticsMap', path: '/statisticsMap',
    component: _import('views/bigData/foodMap/statisticsMap'),
  }, 
  {
    name: 'bigData.foodStatistics', path: '/foodStatistics',
    component: _import('views/bigData/foodStatistics'),
  },
  {
    name: 'bigData.foodMapA', path: '/foodMapA',
    component: _import('views/bigData/foodMap/foodMapA'),
  }, {
    name: 'bigData.foodMapB', path: '/foodMapB',
    component: _import('views/bigData/foodMap/foodMapB'),
  }, {
    name: 'bigData.emergency', path: '/emergency',
    component: _import('views/bigData/foodMap/emergency'),
  }, {
    name: 'bigData.redBlack', path: '/redBlack',
    component: _import('views/bigData/foodMap/redBlack'),
  }, {
    name: 'bigData.order', path: '/order',
    component: _import('views/bigData/foodMap/order'),
  }, {
    name: 'bigData.xcws.AIAccompanyScreen', path: '/AIAccompanyScreen',
    component: _import('views/bigData/xcws/AIAccompanyScreen'),
  },
  {
    path: '/bigData', name: 'bigData', component: LayoutTwo,
    children: [{
      name: 'bigData.index', path: 'index',
      component: _import('views/bigData/index'),
    },]
  }, {
    name: 'bigData.mediMap', path: '/mediMap',
    component: _import('views/bigData/mediMap/mapIndex'),
  },{
    name: 'bigData.mediMap', path: '/mediMap1',
    component: _import('views/bigData/mediMap/index'),
  },
  { // 天府新区大屏
    name: 'bigData.foodMapTFXQ', path: '/foodMap_tfxq',
    component: _import('views/bigData/foodMap/indexTFXQ'),
  }
]

export default bigDataRouter;
