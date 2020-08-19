const Layout = () => import('@/components/layout/Layout');

function _import(file) {
  return  require('@/' + file + '.vue').default
};

// 网络餐饮监管 路由
const networkCateringRouter = [{
  name: 'catering',
  path: '/catering',
  component: Layout,
  children: [{ // 商户信息
    name: 'catering.merchantInfo', path: 'merchantInfo',
    component: _import('views/networkCatering/merchantInfo/index'),
  },{
    name: 'catering.merchantAdd', path: 'merchantAdd',
    component: _import('views/networkCatering/merchantInfo/add')
  }, { // 风险预警
    name: 'catering.riskWarning', path: 'riskWarning',
    component: _import('views/networkCatering/riskWarning/index'),
  }, { // 统计分析
    name: 'catering.statisticAnalysis', path: 'statisticAnalysis',
    component: _import('views/networkCatering/statisticAnalysis/index'),
    children: [{
      name: 'catering.statisticAnalysis.statistic', path: 'statistic',
      component: _import('views/networkCatering/statisticAnalysis/statistic'),
    }, {
      name: 'catering.statisticAnalysis.analysis', path: 'analysis',
      component: _import('views/networkCatering/statisticAnalysis/analysis'),
    }]
  }, { // 风险管理
    name: 'catering.confManage', path: 'confManage',
    component: _import('views/networkCatering/confManage/index'),
  },{
    name: 'catering.riskConf', path: 'riskConf',
    component: _import('views/networkCatering/confManage/conf'),
  }]
}];

export default networkCateringRouter;
