const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const gistForm = [{
  path: '/medicalDevices/medicalDevicesGistForm', component: Layout,
  children: [{
    name: 'medicalDevicesGistForm.index', path: 'index', redirect: '/medicalDevices/medicalDevicesGistForm/index/gistFormIndex',
    component: _import('views/medicalDevices/gistForm/index'),
    children: [{
      name: 'medicalDevicesGistForm.gistFormIndex', path: 'gistFormIndex',//巡查要点表
      component: _import('views/medicalDevices/gistForm/gistForm'),
    },{
      name: 'medicalDevicesGistForm.DetailedList', path: 'DetailedList',//要点详情
      component: _import('views/medicalDevices/gistForm/DetailedList'),
    },{
      name: 'medicalDevicesGistForm.contextList', path: 'contextList',//要点配置
      component: _import('views/medicalDevices/gistForm/context_list'),
    },{
      name: 'medicalDevicesGistForm.projectList', path: 'projectList',//编辑巡查项目
      component: _import('views/medicalDevices/gistForm/project_list'),
    }]
  }]
}]

export default gistForm;
