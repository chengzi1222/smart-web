const Layout = () => import('@/components/layout/Layout');
const MainTwo = () => import('@/components/layout/MainTwo');
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const guardRouter = [{
  name: 'guard', path: '/guard', component: Layout,
  children: [{
    name: 'guard.list', path: 'list',
    component: _import('views/subject/guard/Archives'),
  }, {
    name: 'guard.license.list', path: 'license/list',
    component: _import('views/subject/guard/LicenseManagement'),
  }, {
    name: 'guard.complaint.list', path: 'complaint/list',
    component: _import('views/subject/guard/ComplaintFeedback'),
  }]
},
]

export default guardRouter;
