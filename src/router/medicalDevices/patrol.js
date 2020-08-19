const Layout = () => import('@/components/layout/Layout')
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
}

const medicalDevicesPatrol = [{
    path: '/medicalDevices/patrol', component: Layout,
    children: [
        {
            name: 'medicalDevices.patrol.daily', path: 'daily',
            component: _import('views/medicalDevices/daily/index')
        }
    ]
}]

export default medicalDevicesPatrol