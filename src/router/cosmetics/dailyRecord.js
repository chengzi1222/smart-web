const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const dailyRecord = [{
  path: '/cosmetics/dailyRecord', component: Layout,
  children: [{
    name: 'dailyRecord.index', path: 'index', redirect: '/cosmetics/dailyRecord/index/tab',
    component: _import('views/cosmetics/dailyRecord/index'),
    children: [{
      name: 'dailyRecord.tab', path: 'tab',
      component: _import('views/cosmetics/dailyRecord/recordDaily')
    },{
      name: 'dailyRecord.info', path: 'info',
      component: _import('views/cosmetics/dailyRecord/dayInfo')
    },{
      name: 'dailyRecord.add', path: 'add',
      component: _import('views/cosmetics/dailyRecord/dailyadd')
    }]
  }]
},{
  path: '/cosmetics/recordSpecial', component: Layout,
  children: [{
    name: 'recordSpecial.index', path: 'index', redirect: '/cosmetics/recordSpecial/index/tab',
    component: _import('views/cosmetics/dailyRecord/index'),
    children: [{
      name: 'recordSpecial.tab', path: 'tab',
      component: _import('views/cosmetics/dailyRecord/recordSpecial')
    },{
      name: 'recordSpecial.info', path: 'info',
      component: _import('views/cosmetics/dailyRecord/dayInfo')
    },{
      name: 'recordSpecial.add', path: 'add',
      component: _import('views/cosmetics/dailyRecord/dailyadd')
    }]
  }]
}]

export default dailyRecord;