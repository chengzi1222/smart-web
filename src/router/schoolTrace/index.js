// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return  require('@/' + file + '.vue').default
};

const schoolTraceRouter = [
  {
    name: 'indexH5', path: '/indexH5', redirect: '/schoolTrace/video',
    component: _import('views/schoolTrace/indexH5'),
    children:[
      {
        name: 'schoolTrace', path: '/schoolTrace', redirect: '/schoolTrace/video',
        component: _import('views/schoolTrace/index'),
        children:[
          {
            name:'license', path: '/schoolTrace/license',
            component: _import('views/schoolTrace/license'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'menu', path: '/schoolTrace/menu',
            component: _import('views/schoolTrace/menu'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'video', path: '/schoolTrace/video',
            component: _import('views/schoolTrace/video'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'trace', path: '/schoolTrace/trace',
            component: _import('views/schoolTrace/trace'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'inspected', path: '/schoolTrace/inspected',
            component: _import('views/schoolTrace/inspected'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'accompany', path: '/schoolTrace/accompany',
            component: _import('views/schoolTrace/accompany'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'clean', path: '/schoolTrace/clean',
            component: _import('views/schoolTrace/clean'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'reserved', path: '/schoolTrace/reserved',
            component: _import('views/schoolTrace/reserved'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'trash', path: '/schoolTrace/trash',
            component: _import('views/schoolTrace/trash'),
            meta: {
                title: '溯源H5'
            },
          },
          {
            name:'training', path: '/schoolTrace/training',
            component: _import('views/schoolTrace/training'),
            meta: {
                title: '溯源H5'
            },
          },
            {
                name:'delivery', path: '/schoolTrace/delivery',
                component: resolve => require(['@/views/schoolTrace/delivery'], resolve),
                meta: {
                    title: '溯源H5'
                },
            },
            {
                name:'warehouse', path: '/schoolTrace/warehouse',
                component: resolve => require(['@/views/schoolTrace/warehouse'], resolve),
                meta: {
                    title: '溯源H5'
                },
            },
            {
                name:'additive', path: '/schoolTrace/additive',
                component: resolve => require(['@/views/schoolTrace/additive'], resolve),
                meta: {
                    title: '溯源H5'
                },
            },
            {
                name:'rule', path: '/schoolTrace/rule',
                component: resolve => require(['@/views/schoolTrace/rule'], resolve),
                meta: {
                    title: '溯源H5'
                },
            }
        ]
      },
      {
        name: 'schoolTrace.cleanInfo', path: '/schoolTrace/cleanInfo',
        component: _import('views/schoolTrace/cleanInfo'),
        meta: {
            title: '溯源H5'
        },
      },
      {
        name: 'schoolTrace.trainingInfo', path: '/schoolTrace/trainingInfo',
        component: _import('views/schoolTrace/trainingInfo'),
        meta: {
            title: '溯源H5'
        },
      },
      {
        name: 'schoolTrace.trashInfo', path: '/schoolTrace/trashInfo',
        component: _import('views/schoolTrace/trashInfo'),
        meta: {
            title: '溯源H5'
        },
      },
      {
        name: 'schoolTrace.reservedInfo', path: '/schoolTrace/reservedInfo',
        component: _import('views/schoolTrace/reservedInfo'),
        meta: {
            title: '溯源H5'
        },
      },
        {
            name:'schoolTrace.deliveryInfo', path: '/schoolTrace/deliveryInfo',
            component: resolve => require(['@/views/schoolTrace/deliveryInfo'], resolve),
            meta: {
                title: '溯源H5'
            },
        },
        {
            name:'schoolTrace.warehouseInfo', path: '/schoolTrace/warehouseInfo',
            component: resolve => require(['@/views/schoolTrace/warehouseInfo'], resolve),
            meta: {
                title: '溯源H5'
            },
        },
        {
            name:'schoolTrace.additiveInfo', path: '/schoolTrace/additiveInfo',
            component: resolve => require(['@/views/schoolTrace/additiveInfo'], resolve),
            meta: {
                title: '溯源H5'
            },
        }
    ]
  }
]

export default schoolTraceRouter;
