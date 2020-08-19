const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const mediSubRouter = [
  {
    path: '/mediSub', name: 'medi主体管理', component: Layout,
    children: [{
    name: 'medi.subMap', path: 'subMap',
    component: _import('views/medi/sub/mediMap'),
    }]
  }
]

export default mediSubRouter;
