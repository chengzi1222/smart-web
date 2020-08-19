const Layout = () => import('@/components/layout/Layout');

function _import(file) {
  return require('@/' + file + '.vue').default
};

const assessRouter = [{
  name: 'assess',
  path: '/assess',
  component: Layout,
  children: [ {
      name: 'assess.questions',
      path: 'questions',
      component: _import('views/assess/questions/view'),
      redirect: '/assess/questions/list',
      children: [{
        name: 'assess.questions',
        path: 'list',
        component: _import('views/assess/questions/index'),
      }, {
        name: 'assess.questionAdd',
        path: 'add',
        component: _import('views/assess/questions/add'),
      }, {
        name: 'assess.questionsDetail',
        path: 'detail',
        component: _import('views/assess/questions/detail'),
      }, ]
    },
    {
      name: 'assess.personnel',
      path: 'personnel',
      component: _import('views/assess/personnel/view'),
      redirect: '/assess/personnel/list',
      children: [{
          name: 'assess.personnel',
          path: 'list',
          component: _import('views/assess/personnel/index'),
        }, {
          name: 'assess.personnelAdd',
          path: 'add',
          component: _import('views/assess/personnel/add'),
        },
        {
          name: 'assess.personnelDetail',
          path: 'detail',
          component: _import('views/assess/personnel/detail'),
        },
      ]
    },
    {
      name: 'assess.training',
      path: 'training',
      component: _import('views/assess/training/view'),
      redirect: '/assess/training/list',
      children: [{
          name: 'assess.training',
          path: 'list',
          component: _import('views/assess/training/index'),
        }, {
          name: 'assess.trainingAdd',
          path: 'add',
          component: _import('views/assess/training/add'),
        },
        {
          name: 'assess.trainingDetail',
          path: 'detail',
          component: _import('views/assess/training/detail'),
        },
        {
          name: 'assess.trainingRecord',
          path: 'record',
          component: _import('views/assess/training/record'),
        }
      ]
    },
    {
      name: 'assess.index',
      path: 'index',
      component: _import('views/assess/assess/view'),
      redirect: '/assess/index/list',
      children: [{
          name: 'assess.index',
          path: 'list',
          component: _import('views/assess/assess/index'),
        }, {
          name: 'assess.assessAdd',
          path: 'add',
          component: _import('views/assess/assess/add'),
        },
        {
          name: 'assess.assessDetail',
          path: 'detail',
          component: _import('views/assess/assess/detail'),
        },
        {
          name: 'assess.assessRecord',
          path: 'record',
          component: _import('views/assess/assess/record'),
        },
        {
          name: 'assess.assessRecordDetail',
          path: 'recordDetail',
          component: _import('views/assess/assess/recordDetail'),
        }
      ]
    },
    {
      name: 'assess.curriculum',
      path: 'curriculum',
      component: _import('views/assess/curriculum/view'),
      redirect: '/assess/curriculum/list',
      children: [{
          name: 'assess.curriculum',
          path: 'list',
          component: _import('views/assess/curriculum/index'),
        }, {
          name: 'assess.curriculumAdd',
          path: 'add',
          component: _import('views/assess/curriculum/add'),
        },
        {
          name: 'assess.curriculumDetail',
          path: 'detail',
          component: _import('views/assess/curriculum/detail'),
        },
      ]
    },
    {
      name: 'assess.publicTraining',
      path: 'publicTraining',
      component: _import('views/assess/publicTraining/view'),
      redirect: '/assess/publicTraining/list',
      children: [{
          name: 'assess.publicTraining',
          path: 'list',
          component: _import('views/assess/publicTraining/index'),
        }, {
          name: 'assess.publicTrainingAdd',
          path: 'add',
          component: _import('views/assess/publicTraining/add'),
        },
        {
          name: 'assess.publicTrainingDetail',
          path: 'detail',
          component: _import('views/assess/publicTraining/detail'),
        },
      ]
    },
    {
      name: 'assess.publicIndex',
      path: 'publicIndex',
      component: _import('views/assess/publicAssess/view'),
      redirect: '/assess/publicIndex/list',
      children: [{
          name: 'assess.publicIndex',
          path: 'list',
          component: _import('views/assess/publicAssess/index'),
        }, {
          name: 'assess.publicAssessAdd',
          path: 'add',
          component: _import('views/assess/publicAssess/add'),
        },
        {
          name: 'assess.publicAssessDetail',
          path: 'detail',
          component: _import('views/assess/publicAssess/detail'),
        },
      ]
    },

    {
      name: 'assess.videoLibrary',
      path: 'videoLibrary',
      component: _import('views/assess/videoLibrary/list'),
    },
  ]
}, ]

export default assessRouter;