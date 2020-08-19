const Layout = () => import('@/components/layout/Layout');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const traceRouter = [{
  name: 'yb', path: '/yb', component: Layout,
  children: [{
    name: 'yb.main', path: 'main',
    component: _import('views/trace/supervise/main'),
    children: [{
      name: 'yb.monitoring', path: 'monitoring',
      component: _import('views/trace/supervise/monitoring'),
    },{
        name: 'yb.monitoring', path: 'monitoringAll',
      component: _import('views/trace/supervise/monitoringAll'),
    },{
        name: 'yb.monitoring', path: 'monitoringHospital',
      component: _import('views/trace/supervise/monitoringHospital'),
    }, {
      name: 'yb.schoollis', path: 'schoollis',
      component: _import('views/trace/supervise/schoollis'),
    }, {
      name: 'yb.orderlis', path: 'orderlis',
      component: _import('views/trace/supervise/orderlis'),
    }, {
      name: 'yb.supplierlis', path: 'supplierlis',
      component: _import('views/trace/supervise/supplierlis'),
    }, {
      name: 'yb.aptitudeLook', path: 'aptitudeLook',
      component: _import('views/trace/supervise/aptitudeLook'),
    }, {
      name: 'yb.detaillis', path: 'detaillis',
      component: _import('views/trace/supervise/detaillis'),
    }, {
      name: 'yb.source', path: 'source',
      component: _import('views/trace/supervise/source'),
    }]
  }, {
    name: 'yb.gathermain', path: 'gathermain',
    component: _import('views/trace/gather/gathermain'),
    children: [{
      name: 'yb.gather', path: 'gather',
      component: _import('views/trace/gather/gather'),
    }, {
      name: 'yb.pass', path: 'pass',
      component: _import('views/trace/gather/pass'),
    }]
  }, {
    name: 'yb.schfdamain', path: 'schfdamain',
    component: _import('views/trace/schfda/fdaRelationMain'),
    children: [{
      name: 'yb.fdaRelation', path: 'fdaRelation',
      component: _import('views/trace/schfda/fdaRelation'),
    }]
  }, {
    name: 'yb.analyzemain', path: 'analyzemain',
    component: _import('views/trace/analyze/main'),
    children: [{
      name: 'yb.analyze', path: 'analyze',
      component: _import('views/trace/analyze/analyze'),
    }]
  }, {
    name: 'yb.pricemain', path: 'pricemain',
    component: _import('views/trace/price/pricemain'),
    children: [{
      name: 'yb.price', path: 'price',
      component: _import('views/trace/price/price'),
    }, {
      name: 'yb.pricedeta', path: 'pricedeta',
      component: _import('views/trace/price/pricedeta'),
    }]
  }, {
    name: 'yb.bill', path: 'bill',
    component: _import('views/trace/bill/index'),
    children: [{
      name: 'yb.bill.main', path: 'main',
      component: _import('views/trace/bill/gather'),
    }, {
      name: 'yb.bill.detail', path: 'detail',
      component: _import('views/trace/bill/detail'),
    }]
  }, { //猪肉价格
    name: 'yb.pork', path: 'pork',
    component: _import('views/trace/pork/index'),
    children: [{
        name: 'yb.pork.main', path: 'main',
        component: _import('views/trace/pork/list'),
      }]
  }, { // 索票索证
    name: 'yb.ticket', path: 'ticket',
    component: _import('views/trace/ticket/index'),
    children: [{
        name: 'yb.ticket.main', path: 'main',
        component: _import('views/trace/ticket/list'),
      },{
      name: 'yb.ticket.detail', path: 'detail',
      component: _import('views/trace/ticket/detail'),
    }]
  }, {
    name: 'yb.inquire', path: 'inquire',
    component: _import('views/trace/inquire/main'),
    children: [{
      name: 'yb.inquireMain', path: 'inquireMain',
      component: _import('views/trace/inquire/index'),
    }, {
      name: 'yb.cityChart', path: 'cityChart',
      component: _import('views/trace/inquire/cityChart'),
    }, {
      name: 'yb.areaChart', path: 'areaChart',
      component: _import('views/trace/inquire/areaChart'),
    }, {
      name: 'yb.streetChart', path: 'streetChart',
      component: _import('views/trace/inquire/streetChart'),
    }, {
      name: 'yb.marketChart', path: 'marketChart',
      component: _import('views/trace/inquire/marketChart'),
    }, {
      name: 'yb.vendorChart', path: 'vendorChart',
      component: _import('views/trace/inquire/vendorChart'),
    }, {
      name: 'yb.analyzeInfo', path: 'analyzeInfo',
      component: _import('views/trace/inquire/analyzeInfo'),
    }]
  },{
    name: 'yb.newinquire', path: 'newinquire',
    component: _import('views/trace/newinquire/main'),
    children: [{
      name: 'yb.newinquireMain', path: 'newinquireMain',
      component: _import('views/trace/newinquire/index'),
    }, {
      name: 'yb.newcityChart', path: 'newcityChart',
      component: _import('views/trace/newinquire/cityChart'),
    }, {
      name: 'yb.newareaChart', path: 'newareaChart',
      component: _import('views/trace/newinquire/areaChart'),
    }, {
      name: 'yb.newstreetChart', path: 'newstreetChart',
      component: _import('views/trace/newinquire/streetChart'),
    }, {
      name: 'yb.newmarketChart', path: 'newmarketChart',
      component: _import('views/trace/newinquire/marketChart'),
    }, {
      name: 'yb.newvendorChart', path: 'newvendorChart',
      component: _import('views/trace/newinquire/vendorChart'),
    }, {
      name: 'yb.newanalyzeInfo', path: 'newanalyzeInfo',
      component: _import('views/trace/newinquire/analyzeInfo'),
    }]
  }, {
    name: 'yb.dlr', path: 'dlr',
    component: _import('views/trace/dlr/main'),
    children: [{
      name: 'yb.dlrMain', path: 'dlrMain',
      component: _import('views/trace/dlr/index'),
    }, {
      name: 'yb.dlrCityChart', path: 'dlrCityChart',
      component: _import('views/trace/dlr/cityChart'),
    }, {
      name: 'yb.dlrAreaChart', path: 'dlrAreaChart',
      component: _import('views/trace/dlr/areaChart'),
    }, {
      name: 'yb.dlrMarketChart', path: 'dlrMarketChart',
      component: _import('views/trace/dlr/marketChart'),
    }, {
      name: 'yb.dlrVendorChart', path: 'dlrVendorChart',
      component: _import('views/trace/inquire/vendorChartYb'),
    }, {
      name: 'yb.dlrAnalyzeInfo', path: 'dlranalyzeInfoYb',
      component: _import('views/trace/inquire/analyzeInfoYb'),
    }]
  }, {
    name: 'yb.farm', path: 'farm',
    component: _import('views/trace/farm/main'),
    children: [{
      name: 'yb.farmMain', path: 'farmMain',
      component: _import('views/trace/farm/index'),
    }, {
      name: 'yb.farmCityChart', path: 'farmCityChart',
      component: _import('views/trace/farm/cityChart'),
    }, {
      name: 'yb.farmAreaChart', path: 'farmAreaChart',
      component: _import('views/trace/farm/areaChart'),
    }, {
      name: 'yb.farmMarketChart', path: 'farmMarketChart',
      component: _import('views/trace/farm/marketChart'),
    }, {
      name: 'yb.farmStreetChart', path: 'farmStreetChart',
      component: _import('views/trace/farm/streetChart')
    }, {
      name: 'yb.farmAnalyzeInfo', path: 'farmAnalyzeInfo',
      component: _import('views/trace/farm/farmAnalyzeInfo'),
    }, {
      name: 'yb.farmVendorChart', path: 'farmVendorChart',
      component: _import('views/trace/farm/farmVendorChart'),
    }]
  },{
    name:'yb.pastFoodIndex', path: 'pastFoodIndex',component: _import('views/trace/pastFood/indexRouter'),
    redirect: 'pastFoodIndex/pastFood',
    children: [{
      name: 'yb.pastFood', path: 'pastFood',
      component: _import('views/trace/pastFood/index'),
    },{
      name: 'yb.pastList', path: 'list',
      component: _import('views/trace/pastFood/list'),
    }]
  },{
    name: 'yb.closedLoop', path: 'closedLoop',
    component: _import('views/trace/closedLoop/closedLoopRelation/index'),
  },{
    name: 'yb.daysItem', path: 'daysItem',
    component: _import('views/trace/closedLoop/daysItem/daysItem'),
  },{
    name: 'yb.noteList', path: 'noteList',
    component: _import('views/trace/closedLoop/noteList/noteList'),
  }, {
    name: 'yb.newfarm', path: 'newfarm',
    component: _import('views/trace/newfarm/main'),
    children: [{
      name: 'yb.newfarmMain', path: 'newfarmMain',
      component: _import('views/trace/newfarm/index'),
    }, {
      name: 'yb.newfarmCityChart', path: 'newfarmCityChart',
      component: _import('views/trace/newfarm/cityChart'),
    }, {
      name: 'yb.newfarmAreaChart', path: 'newfarmAreaChart',
      component: _import('views/trace/newfarm/areaChart'),
    }, {
      name: 'yb.newfarmMarketChart', path: 'newfarmMarketChart',
      component: _import('views/trace/newfarm/marketChart'),
    }, {
      name: 'yb.newfarmStreetChart', path: 'newfarmStreetChart',
      component: _import('views/trace/newfarm/streetChart')
    }, {
      name: 'yb.newfarmAnalyzeInfo', path: 'newfarmAnalyzeInfo',
      component: _import('views/trace/newfarm/farmAnalyzeInfo'),
    }, {
      name: 'yb.newfarmVendorChart', path: 'newfarmVendorChart',
      component: _import('views/trace/newfarm/farmVendorChart'),
    }]
  },{
    name: 'yb.outScope', path: 'outScope',
    component: _import('views/trace/outScope/index'),
  },{ // 食安指数考核
    name: 'yb.foodAssess', path: 'foodAssess',
    component: _import('views/trace/foodAssess/index'),
  }, {
    name: 'yb.foodAssess.list', path: 'foodAssess/list',
    component: _import('views/trace/foodAssess/list'),
  }]
},{
  name: 'yb.carMap', path: '/yb/carMap',
  component: _import('views/trace/supervise/carMap'),
}];

export default traceRouter;
