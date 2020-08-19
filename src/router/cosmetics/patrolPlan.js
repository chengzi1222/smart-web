const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
}

const cosmeticsPatrolPlan = [
  {name: 'cosmetics.Patrol', path: '/cosmetics/patrol', component: Layout,
    children: [{
      name: 'cosmetics.PatrolPlan', path: 'special/',component: MainTwo, redirect: '/cosmetics_patrol/special/list',
        children: [{
          name: 'cosmetics.specialList', path: 'list',
          component: _import('views/cosmetics/patrolPlan/planSpecial')
        },
        {
          name: 'cosmetics.specialAdd', path: 'add',
          component: _import('views/cosmetics/patrolPlan/planSpecialAdd')
        },{
          name: 'cosmetics.specialInfo', path: 'info',
          component: _import('views/cosmetics/patrolPlan/planSpecialInfo')
        },{
          name: 'cosmetics.specialStatis', path: 'specialStatis',
          component: _import('views/cosmetics/patrolPlan/specialStatis')
        }],
    },
    { name: 'cosmetics.RepatrolRecord',path: 'repatrol',component: MainTwo,
      redirect: '/cosmetics_patrol/repatrol/list',
        children: [{
          name: 'cosmetics.RepatrolRecordList', path: 'list',
          component: _import('views/cosmetics/repatrol/list'),
        }, {
          name: 'cosmetics.RepatrolRecordAdd', path: 'add',
          component: _import('views/cosmetics/repatrol/ad'),
        }, {
          name: 'cosmetics.RepatrolRecordInfo', path: 'info',
          component: _import('views/cosmetics/repatrol/info'),
        }]
    },]
  
  },{
    name: 'cosmetics.rating', path: '/cosmetics/rating', component: Layout,
    children: [{
      path: 'quantifyLevel', component: MainTwo,
      children: [{
        name: 'cosmetics.rating.quantifyLevel', path: '',
        component: _import('views/cosmetics/rating/quantifyLevelList'),
      }]
    }, {
      path: 'riskLevel', component: MainTwo,
      children: [{
        name: 'cosmetics.rating.riskLevel', path: '',
        component: _import('views/cosmetics/rating/riskLevelList'),
      }]
    },]
  }]
  

export default cosmeticsPatrolPlan;
