const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return require('@/' + file + '.vue').default
};

const ratingRouter = [
  {
  name: 'otherRating',
  path: '/otherRating',
  component: Layout,
  children: [{
    path: 'quantifyLevel',
    name: 'otherRating.quantifyLevel',
    component: _import('views/rating/other/quantifyLevelList'),
  }, {
    path: 'riskLevel',
    name: 'otherRating.riskLevel',
    component: _import('views/rating/other/riskLevelList'),
  }]
},
 {
  name: 'restaurantRating',
  path: '/restaurantRating',
  component: Layout,
  children: [{
      path: 'dynamic',
      name: 'restaurantRating.dynamic',
      component: MainTwo,
      redirect: '/restaurantRating/dynamic/list',
      children: [{
        path: 'list',
        name: 'restaurantRating.dynamic.list',
        component: _import('views/rating/restaurant/dynamic/list'),
      },
      {
        path: 'ratings',
        name: 'restaurantRating.dynamic.ratings',
        component: _import('views/rating/restaurant/dynamic/ratings'),
      },
      {
        path: 'ratingsRecord',
        name: 'restaurantRating.dynamic.ratingsRecord',
        component: _import('views/rating/restaurant/dynamic/ratingsRecord'),
      },
      {
        path: 'ratingsDetail',
        name: 'restaurantRating.dynamic.ratingsDetail',
        component: _import('views/rating/restaurant/dynamic/ratingsDetail'),
      }]
    },
    {
      path: 'static',
      name: 'restaurantRating.static',
      component: MainTwo,
      redirect: '/restaurantRating/static/list',
      children: [{
        path: 'list',
        name: 'restaurantRating.static.list',
        component: _import('views/rating/restaurant/static/list'),
      },
      {
        path: 'ratings',
        name: 'restaurantRating.static.ratings',
        component: _import('views/rating/restaurant/static/ratings'),
      },
      {
        path: 'ratingsRecord',
        name: 'restaurantRating.static.ratingsRecord',
        component: _import('views/rating/restaurant/static/ratingsRecord'),
      },]
    }, {
      path: 'pointManage',
      name: 'restaurantRating.pointManage',
      component: MainTwo,
      redirect: '/restaurantRating/pointManage/list',
      children: [{
        path: 'list',
        name: 'restaurantRating.pointManage.list',
        component: _import('views/rating/restaurant/pointManage/list'),
      },
      {
        path: 'detail',
        name: 'restaurantRating.pointManage.detail',
        component: _import('views/rating/restaurant/pointManage/detail'),
      },
      {
        path: 'add',
        name: 'restaurantRating.pointManage.add',
        component: _import('views/rating/restaurant/pointManage/add'),
      },
      {
        path: 'edit',
        name: 'restaurantRating.pointManage.edit',
        component: _import('views/rating/restaurant/pointManage/edit'),
      }]
    }, {
      path: 'sub',
      name: 'restaurantRating.sub',
      component: MainTwo,
      redirect: '/restaurantRating/sub/list',
      children: [{
        path: 'list',
        name: 'restaurantRating.sub.list',
        component: _import('views/rating/restaurant/sub/list'),
      },
      {
        path: 'riskLevelDetail',
        name: 'restaurantRating.sub.riskLevelDetail',
        component: _import('views/rating/restaurant/sub/riskLevelDetail'),
      }]
    },
    {
      path: 'subManage',
      name: 'restaurantRating.subManage',
      component: _import('views/rating/restaurant/subManage'),
    }, {
      path: 'strategy',
      name: 'restaurantRating.strategy',
      component: _import('views/rating/restaurant/strategy'),
    },
  ]
}
]

export default ratingRouter;