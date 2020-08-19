const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const supportRouter = [{
  name: 'support', path: '/support', component: Layout,
  children: [{
    path: 'depts', component: MainTwo, // 部门管理
    children: [{
      name: 'support.depts', path: '/',
      component: _import('views/support/dept/index'),
    }, {
      name: "support.depts.add", path: "add",
      component: _import('views/support/organize/dept_add'),
    }, {
      name: "support.depts.edit", path: "edit",
      component: _import('views/support/organize/dept_edit'),
    }]
  }, {
    path: 'users', component: MainTwo,
    children: [{
      name: 'support.users', path: '/',
      component: _import('views/support/user/index'),
    }, {
      name: "support.users.edit", path: "edit",
      component: _import('views/support/organize/user_edit'),
    }, {
      name: "support.users.add", path: "add",
      component: _import('views/support/organize/user_add'),
    }]
  }, {
    path: 'userquery', component: MainTwo,
    children: [{
      name: "support.userquery", path: '/',
      component: _import('views/support/usersearch/index'),
    }, {
      name: "support.userquery.add", path: "add",
      component: _import('views/support/organize/user_add'),
    }, {
      name: "support.userquery.edit", path: "edit",
      component: _import('views/support/organize/user_edit'),
    }]
  }, {
    path: 'roles', component: MainTwo,
    children: [{
      name: 'support.roles', path: '/',
      component: _import('views/support/role_list'),
    }, {
      name: 'support.roles.curd', path: ':curd',
      component: _import('views/medicalDevices/permission/permission'),
    }]
  }]
}]

export default supportRouter;
