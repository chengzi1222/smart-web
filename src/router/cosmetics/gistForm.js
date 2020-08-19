const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const gistForm = [{
  path: '/cosmetics/gistForm', component: Layout,
  children: [{
    name: 'gistForm.index', path: 'index', redirect: '/cosmetics/gistForm/index/gistFormIndex',
    component: _import('views/cosmetics/gistForm/index'),
    children: [{
      name: 'gistForm.gistFormIndex', path: 'gistFormIndex',//巡查要点表
      component: _import('views/cosmetics/gistForm/gistForm'),
    },{
      name: 'gistForm.DetailedList', path: 'DetailedList',//要点详情
      component: _import('views/cosmetics/gistForm/DetailedList'),
    },{
      name: 'gistForm.contextList', path: 'contextList',//要点配置
      component: _import('views/cosmetics/gistForm/context_list'),
    },{
      name: 'gistForm.projectList', path: 'projectList',//编辑巡查项目
      component: _import('views/cosmetics/gistForm/project_list'),
    }]
  }]
}]

export default gistForm;