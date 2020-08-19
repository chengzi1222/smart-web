const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const guardRestRouter = [{
  name: 'guardRest', path: '/guardRest', component: Layout,
  children: [{
    name: 'guardRest.list', path: 'list',
    component: _import('views/subject/guardRest/Archives'),
  }, {
    name: 'guardRest.license.list', path: 'license/list',
    component: _import('views/subject/guardRest/LicenseManagement'),
  }, {
    name: 'guardRest.complaint.list', path: 'complaint/list',
    component: _import('views/subject/guardRest/ComplaintFeedback'),
  }]
}]

export default guardRestRouter;
