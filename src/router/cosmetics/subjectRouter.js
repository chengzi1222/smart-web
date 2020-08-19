const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const cosmeticsArchivesRouter = [
    {
    path: '/cosmetics/:type', name: 'cosmetics_subject1', component: Layout,
    children: [
      {
        path: 'archives', name: 'cosmetics_subject.archives', component: MainTwo,
        // component: _import('views/cosmetics/subject/Archives/index'),
        redirect: '/cosmetics/:type/archives/sub',
        children:[
          {
            path: 'sub', name: 'cosmetics_subject.add',
           component: _import('views/cosmetics/subject/Archives/index'),
          },
          {
            path: 'add', name: 'cosmetics_subject.add',
            component: _import('views/cosmetics/subject/add/add')
          },
          {
            path:'detail',name:'cosmetics_subject.detail',
            component: _import('views/cosmetics/subject/add/infoTab'),
          },
        ]
      },
      {
        path:'subStatistics',name:'cosmetics_subject.subStatistics',
        component: _import('views/cosmetics/subject/subStatistics/index'),
      }]
    },
    {
      path: '/cosmetics/subject/:type', name: 'cosmetics_import', component: Layout,
      children: [
        {
          path:'import',name:'cosmetics_subject.import',
          component: _import('views/cosmetics/subject/import/archive'),
        }]
    },
      {
        path: '/cosmeticsSub', name: 'cosmetics主体地图', component: Layout,
        children: [{
        name: 'cosmetics.subMap', path: 'subMap',
        component: _import('views/cosmetics/sub/cosmeticsMap'),
        },{
          name: 'cosmetics.statisticalForm', path: 'statisticalForm',
          component: _import('views/cosmetics/subject/subStatistics/statisticalForm'),
        },
        {
          name: 'cosmetics.sub.statistics', path: 'subject/statistics', 
          component: _import('views/cosmetics/subject/subStatistics/statistics'),
        }]
      }
];

export default cosmeticsArchivesRouter;
