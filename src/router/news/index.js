const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const newsRouter = [{
  name: 'news', path: '/news', component: Layout,
  children: [{
    name: 'news.main', path: 'main',
    component: _import('views/news/main'),
    children: [{
        name: 'news.list', path: 'list',
        component: _import('views/news/newsManage')
    },{
      name: 'news.add', path: 'add',
      component: _import('views/news/newsAdd')
    },{
      name: 'news.edit', path: 'edit',
      component: _import('views/news/newsAdd')
    },{
      name: 'news.sliderAdd', path: 'sliderAdd',
      component: _import('views/news/sliderAdd')
    },{
      name: 'news.sliderEdit', path: 'sliderEdit',
      component: _import('views/news/sliderAdd')
    },{
      name: 'news.newsDetail', path: 'newsDetail',
      component: _import('views/news/newsDetail')
     }, {
      name: 'news.sliderDetail', path: 'sliderDetail',
      component: _import('views/news/sliderDetail')
    }
  ]},
  ]
}];

export default newsRouter;

/*
this.$router.push({
  name: "subject.archives.detail",
  query: {id: lecence.bizId}
});
export default newsRouter;
*/
