const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const workFlowRouter = [{
  path: '/cosmeticswork', component: Layout,
  children: [{
    name: 'myWorkIndex', path: 'myWorkIndex', redirect: 'myWorkIndex/mywork/production',
    component: _import('views/cosmetics/workFlow/indexWork'),
    children: [{
      name: 'cosmetics.myWork', path: 'mywork',//我的工单
      component: _import('views/cosmetics/workFlow/index'),
      children: [{
        name: 'cosmetics.production', path: 'production', //生产主体
        component: _import('views/cosmetics/workFlow/production'),
      }, {
        name: 'cosmetics.manage', path: 'manage',//经营主体
        component: _import('views/cosmetics/workFlow/manage'),
      }, {
        name: 'cosmetics.use', path: 'use',//使用主体
        component: _import('views/cosmetics/workFlow/use'),
      }]
    }, {
        name: 'myWorkIndex.compile', path: 'compile',//审核
      component: _import('views/cosmetics/workFlow/workInfo'),
    }]
  },{
    name: 'editors.production', path: 'editorsProduction', redirect: 'editorsProduction/editors', //生产主体
    component: _import('views/cosmetics/editors/index'),
    children: [{
      name: 'production.editors', path: 'editors',//编辑审核
      component: _import('views/cosmetics/editors/editorsProduction')
    }, {
      name: 'production.compile', path: 'compile',//审核
      component: _import('views/cosmetics/workFlow/workInfo'),
    }]
  },{
    name: 'editors.manage', path: 'editorsManage', redirect: 'editorsManage/editors', //经营主体
    component: _import('views/cosmetics/editors/index'),
    children: [{
      name: 'manage.editors', path: 'editors',//编辑审核
      component: _import('views/cosmetics/editors/editors')
    }, {
      name: 'manage.compile', path: 'compile',//审核
      component: _import('views/cosmetics/workFlow/workInfo'),
    }]
  },{
    name: 'editors.use', path: 'editorsUse', redirect: 'editorsUse/editors', //使用主体
    component: _import('views/cosmetics/editors/index'),
    children: [{
      name: 'use.editors', path: 'editors',//编辑审核
      component: _import('views/cosmetics/editors/editors')
    }, {
      name: 'use.compile', path: 'compile',//审核
      component: _import('views/cosmetics/workFlow/workInfo'),
    }]
  }]
}]

export default workFlowRouter;