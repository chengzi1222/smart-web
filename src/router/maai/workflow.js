const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const medicalDevicesFileAudit = [
  {
    path: '/medicalDevices/fileAudit', name: 'medicalDevices_fileAudit', component: Layout,
    children: [
      {
        path: 'mywork', name: 'medicalDevices_fileAudit.workFlow', redirect: '/medicalDevices/fileAudit/mywork/production',
        component: _import('views/medicalDevices/fileAudit/workFlow/index'),
        children: [{
          path: 'production', name: 'medicalDevices_fileAudit.production',//生产
          component: _import('views/medicalDevices/fileAudit/workFlow/production')
        },{
          path: 'manage', name: 'medicalDevices_fileAudit.manage',//经营
          component: _import('views/medicalDevices/fileAudit/workFlow/manage')
        },{
          path: 'use', name: 'medicalDevices_fileAudit.use',//使用
          component: _import('views/medicalDevices/fileAudit/workFlow/use')
        },{
          path: 'info', name: 'medicalDevices_fileAudit.info',//详情
          component: _import('views/medicalDevices/fileAudit/workInfo')
        }]
      },{
        path: 'rework',name: 'medicalDevices_sub.rework',//重新申请
        component: _import('views/medicalDevices/subject/Archives/infoTab')
      }, {
        path: 'editorsProduction', name: 'production.editors',redirect: '/medicalDevices/fileAudit/editorsProduction/index',
        component: _import('views/medicalDevices/fileAudit/editAudit/index'),
        children: [
        {
            name: 'maai.production.index', path: 'index',//生产列表
            component: _import('views/medicalDevices/fileAudit/editAudit/editors'),
        },
        {
          name: 'maai.production.compile', path: 'compile',//生产审核
          component: _import('views/medicalDevices/fileAudit/workInfo'),
        }],
      }, {
        path: 'editorsManage', name: 'manage.editors',redirect: '/medicalDevices/fileAudit/editorsManage/index',
        component: _import('views/medicalDevices/fileAudit/editAudit/index'),
        children: [
          {
            name: 'maai.manage.index', path: 'index',//经营列表
            component: _import('views/medicalDevices/fileAudit/editAudit/editors'),
          },
          {
            name: 'maai.manage.compile', path: 'compile',//经营审核
            component: _import('views/medicalDevices/fileAudit/workInfo'),
          }],
      }, {
        path: 'editorsUse', name: 'use.editors',redirect: '/medicalDevices/fileAudit/editorsUse/index',
        component: _import('views/medicalDevices/fileAudit/editAudit/index'),
        children: [
          {
            name: 'maai.use.index', path: 'index',//使用列表
            component: _import('views/medicalDevices/fileAudit/editAudit/editors'),
          },
          {
            name: 'maai.use.compile', path: 'compile',//使用审核
            component: _import('views/medicalDevices/fileAudit/workInfo'),
          }],
      }
    ]
  }
];

export default medicalDevicesFileAudit;
