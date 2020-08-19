import Vue from "vue";
import Router from "vue-router";

import adminRouter from './admin'; //后台管理 路由
import cfdaRouter from './cfda'; //三小管理 路由
import supportRouter from './support'; //组织架构 路由
import subRouter from './sub'; //主图系统 路由
import subjectRouter from './subject'; //一般主体
import myworkRouter from './mywork'; //我的工单 路由
import periCamera from './peri/camera'; //阳光厨房 路由
import patrolRouter from './patrol'; //巡查
import enforceRouter from './enforce'; //行政处罚
import traceRouter from './trace'; //溯源监管
import ratingRouter from './rating'; //等级评定
import mediRatingRouter from './medirating'; // 等级评定
import randomRouter from './random'; //双随机任务
import newsRouter from './news'; //新闻资讯
import mediRouter from './medi'; // 药品
import subStatisticsRouter from './medi/subStatistics'; // 药品主体统计分析
import mediPatrolRouter from './medipatrol'; // 药品巡查
import activityRouter from './activity'; // 药品巡查
import statisticRouter from './activity/statistic'; // 重大活动保障统计分析
import bigDataRouter from './bigData'; //大数据
import mediSubRouter from './medi/mediSub'; //药品主体地图
import cosmeticsArchivesRouter from './cosmetics/subjectRouter'; //化妆品档案与添加
import cosmeticsWork from './cosmetics/workFlow'; //化妆品主体
import cosmeticsPatrolPlan from './cosmetics/patrolPlan'; //化妆品专项计划管理
import cosmeticsGistForm from './cosmetics/gistForm'; //化妆品巡查要点表
import cosmeticsDailyStrategy from './cosmetics/dailyStrategy'; //化妆品日常巡查策略
import cosmeticsDailyRecord from './cosmetics/dailyRecord'; //化妆品日常巡查记录
import medicalDevicesArchivesRouter from './medicalDevices/subjectRouter'; //医疗器械主体相关
import medicalDevicesFileAudit from './maai/workflow'; //医疗器械编辑审核
import medicalDevicesPatrol from './medicalDevices/patrol'; //医疗器械日常策略
import subjectData from './bigData/subjectData'; //智慧城市大屏
import medicalDevicesGistForm from './medicalDevices/gistForm'; //医疗器械巡查要点表
import medicalDevicesRecord from './maai/record'; //医疗器械记录
import medicalDevicesPatrolPlan from './medicalDevices/patrolPlan'; //医疗器械专项计划管理
import medicalDevicesRating from './medicalDevices/rating'; //医疗器械-等级评定
import superviseStatisticsRouter from './medicalDevices/superviseStatistics'; //医疗器械主体报表和监管统计分析，报表
import specialElevatorRouter from './special/elevator_archives'; //特种设备电梯档案
import specialBoilerRouter from './special/boiler_archives'; //特种设备锅炉档案
import specialPressureVesselRouter from './special/pressureVessel_archives'; //特种设备压力容器档案
import specialPressurePipingRouter from './special/pressurePiping_archives'; //特种设备压力管道档案
import specialHoistingMachineryRouter from './special/hoistingMachinery_archives'; //特种设备起重机械档案
import specialpassengerRopewayRouter from './special/passengerRopeway_archives'; //特种设备客运索道档案
import specialLargePlaygroundRouter from './special/largePlayground_archives'; //特种设备大型游乐设施档案
import specialMechanicallyPropelledVehicleRouter from './special/mechanicallyPropelledVehicle_archives'; //特种设备专用机动车辆档案
import schoolTraceRouter from './schoolTrace'; //校餐卫士学校H5
import guardRouter from './guard' // 校餐卫士主体汇总
import guardRestRouter from './guardRest' // 放心食安主体汇总
import xcwsWarnRouter from './xcws' //校餐卫士预警
import assessRouter from './assess' //考核培训
import networkCateringRouter from "./networkCatering"; // 网络餐饮监管
import xchc from './xchc'; //现场核查


// const allRouter = [
// 'admin',   // 后台管理 路由
// 'cfda',  // 业务系统 三小模块路由
// 'support',  // 支撑系统路由
// 'sub',  // 支撑系统路由
// 'mywork',   // 主体路由
// 'peri/camera',// 主体路由
// 'patrol', // 主体路由
// 'enforce', //行政执法路由
// 'trace'   //溯源监管路由
// ];

// const _import = require('./_import_' + process.env.NODE_ENV);
function _import(file) {
  return require('@/' + file + '.vue').default
}
const LayoutTwo = () => import('@/components/layout/LayoutTwo'); // 没有左边菜单

Vue.use(Router);
const routerMap = [
  ...adminRouter, // 后台管理
  ...cfdaRouter, // 三小
  ...supportRouter, // 支持系统(组织架构)
  ...myworkRouter, // 我的工单
  ...subRouter, // 主体系统
  ...periCamera, // 阳光厨房
  ...patrolRouter, // 巡查
  ...enforceRouter, // 行政处罚
  ...traceRouter, // 溯源监管
  ...subjectRouter, // 一般主体
  ...ratingRouter, // 等级评定
  ...randomRouter, // 双随机任务
  ...newsRouter, // 新闻资讯
  ...mediRouter, //药品
  ...subStatisticsRouter, // 药品主体统计分析
  ...mediPatrolRouter, //药品巡查
  ...mediRatingRouter, // 等级评定
  ...activityRouter, //重大活动保障
  ...statisticRouter, //重大活动保障统计分析
  ...bigDataRouter, //大数据
  ...mediSubRouter, //药品主体地图
  ...cosmeticsArchivesRouter, //化妆品档案与添加
  ...cosmeticsWork, //化妆品主体
  ...cosmeticsPatrolPlan, //化妆品专项计划管理
  ...cosmeticsGistForm, //化妆品巡查要点表
  ...cosmeticsDailyStrategy, //化妆品日常巡查策略
  ...cosmeticsDailyRecord, //化妆品日常巡查记录
  ...medicalDevicesArchivesRouter, //医疗器械主体相关
  ...medicalDevicesFileAudit, //医疗器械编辑审核
  ...medicalDevicesPatrol, //医疗器械日常策略
  ...subjectData, //智慧城市大屏
  ...medicalDevicesGistForm, //医疗器械巡查要点表
  ...medicalDevicesRecord, //医疗器械记录
  ...medicalDevicesPatrolPlan, //医疗器械专项计划管理
  ...medicalDevicesRating, //医疗器械-等级评定
  ...superviseStatisticsRouter, //医疗器械主体报表和监管统计分析，报表
  ...specialElevatorRouter, //特种设备电梯档案
  ...specialBoilerRouter, //特种设备锅炉档案
  ...specialPressureVesselRouter, //特种设备压力容器档案
  ...specialPressurePipingRouter, //特种设备压力管道档案
  ...specialHoistingMachineryRouter, //特种设备起重机械档案
  ...specialpassengerRopewayRouter, //特种设备客运索道档案
  ...specialLargePlaygroundRouter, //特种设备大型游乐设施档案
  ...specialMechanicallyPropelledVehicleRouter, //特种设备专用机动车辆档案
  ...schoolTraceRouter, //校餐卫士学校H5
  ...guardRouter, // 校餐卫士主体汇总
  ...guardRestRouter, // 放心食安主体汇总
  ...xcwsWarnRouter, //校餐卫士预警
  ...assessRouter, //考核培训
  ...networkCateringRouter, // 网络餐饮监管 
  ...xchc, //现场核查
  // 其他路由在上面引入
  ...[{ // 默认路由
      name: "login",
      path: "/login",
      component: _import('views/Login')
    },
    { // 默认路由
      name: "kashiLogin",
      path: "/kashiLogin",
      component: _import('views/kashiLogin')
    }, {
      name: 'index.welcome',
      path: '/',
      component: _import('views/dashboard/Welcome'),
    }, {
      name: 'index',
      path: '/dashboard',
      component: LayoutTwo,
      redirect: '/dashboard',
      children: [{
        name: 'index.dashboard',
        path: '/dashboard',
        component: _import('views/dashboard/index'),
      }]
    }, {
      name: 'component.common',
      path: '/component/common', // 小组件路由
      component: _import('components/common/index'),
    }, {
      name: 'appH5',
      path: '/appH5', // 小组件路由
      component: _import('views/news/app_webview/h5'),
      meta: {
        title: '资讯详情'
      },
    }, {
      name: 'specialAccount',
      path: '/specialAccount', // 溯源监管阳光厨房登陆固定账号
      component: _import('views/specialAccount/index'),
    }, {
      name: 'gaoxinHome',
      path: '/gaoxinHome', // 高新登录页
      component: _import('views/gaoxinHome'),
    }, {
      name: 'gaoxinHighRisk',
      path: '/gaoxinHighRisk', // 高新高风险
      component: _import('views/gaoxinHighRisk/index'),
    }
  ],
];
export default routerMap;