const Layout = () => import('@/components/layout/Layout')
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
}

// 医疗器械-等级评定
const medicalDevicesRating = [{
  name: 'medicalDevices.rating',
  path: '/medicalDevices/rating',
  component: Layout,
  children: [
    // 质量等级
    {
      name: 'medicalDevices.rating.quantifyLevel',
      path: 'quantifyLevel',
      component: _import('views/medicalDevices/rating/quantifyLevelList')
    }
  ]
}];

export default medicalDevicesRating
