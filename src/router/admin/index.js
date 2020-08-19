const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const adminRouter = [{
  path: '/admin', name: 'admin', component: Layout,  // 注释重定向 登录用户不知道分配了那个页面权限
  children: [{
    name: 'admin.depts', path: 'depts',
    component: _import('views/admin/dept_list'),
  }, {
    name: 'admin.users', path: 'users',
    component: _import('views/admin/user_list'),
  }, {
    name: 'admin.menus', path: 'menus',
    component: _import('views/admin/menu_list'),
  }, {
    name: 'admin.modules', path: 'modules',
    component: _import('views/admin/module_list'),
  }, {
    name: 'admin.roles.preset', path: 'roles/preset',
    component: _import('views/admin/role_custom_list'),
  }, {
    name: 'admin.roles.system', path: 'roles/system',
    component: _import('views/admin/role_list'),
  }]
}, {
  name: 'dict', path: '/dict', component: Layout,
  children: [{
    name: 'dict.type', path: 'type',
    component: _import('views/admin/dict_type_list'),
  }, {
    name: 'dict.manager', path: 'manager',
    component: _import('views/admin/dict_list'),
  }, {
    name: 'dict.manager.curd', path: 'manager/:curd',
    component: _import('views/admin/dict_ade'),
  }, {
    name: 'dict.user', path: 'user',
    component: _import('views/admin/dict_user_list'),
  }, {
    name: 'dict.user.curd', path: 'user/:curd',
    component: _import('views/admin/dict_user_ade'),
  }]
},{
  name: 'sys.password', path: '/reset',
  component: _import('views/admin/changepassword/index'),
}, {
  path: '/version', component: Layout,
  children: [{
    name: 'version', path: 'list',  // 列表
    component: _import('views/admin/version_list' )
  },{
    name: 'version.add', path: 'add', // 增加
    component: _import('views/admin/version_add')
  },{
    name: 'version.edit', path: 'edit', // 编辑
    component: _import('views/admin/version_add')
  }, {
    name: 'version.detail', path: 'detail', // 详情
    component: _import('views/admin/version_add')
  }
  ]
},{
  path: '/home', component: Layout,
  children: [{
    name: 'home', path: 'list',  // 列表
    component: _import('views/admin/home/list' )
  },{
    name: 'home.add', path: 'add', // 增加
    component: _import('views/admin/home/save')
  },{
    name: 'home.edit', path: 'edit', // 编辑
    component: _import('views/admin/home/save')
  }, {
    name: 'home.detail', path: 'detail', // 详情
    component: _import('views/admin/home/detail')
  }
  ]
},{
  path: '/admin/userSystem', name: 'userSystem', component: Layout,  // 用户体系相关路由
  children: [{
    name: 'userSystem.otherSettings', path: 'otherSettings',
    component: _import('views/admin/userSystem/otherSettings/list'),
  }]
}]

export default adminRouter;
