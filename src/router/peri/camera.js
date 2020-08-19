const Layout = () => import("@/components/layout/Layout");
// const _import = require('../_import_' + process.env.NODE_ENV);
function _import(file) {
  return require("@/" + file + ".vue").default;
}

const caremaRouter = [
  {
    path: "/AICamera/AIScreen",
    name: "AICamera.AIScreen",
    component: _import("views/peri/AICamera/AIScreen4"),
  },
  {
    path: "/AICamera/AIScreenV101",
    name: "AICamera.AIScreenV101",
    component: _import("views/peri/AICamera/AIScreen2"),
  },
  {
    path: "/AICamera/AIScreenV1",
    name: "AICamera.AIScreenV1",
    component: _import("views/peri/AICamera/AIScreen3"),
  },
  {
    path: "/AICamera/subScreen",
    name: "AICamera.subScreen",
    component: _import("views/peri/AICamera/subScreen"),
  },
  {
    path: "/AIRule",
    component: Layout,
    children: [
      {
        name: "AIRule",
        path: "",
        component: _import("views/peri/AIRule/index"),
      },
      {
        name: "AIRule.setting",
        path: "setting",
        component: _import("views/peri/AIRule/setting"),
      },
    ],
  },
  {
    path: "/camera",
    component: Layout,
    children: [
      {
        name: "camera",
        path: "",
        component: _import("views/peri/camera/show_list"),
      },
      {
        name: "camera.detail",
        path: "detail",
        component: _import("views/peri/camera/show_detail"),
      },
      {
        name: "camera.manage",
        path: "manage",
        component: _import("views/peri/camera/manage_list"),
      },
      {
        name: "camera.manage.detail",
        path: "manage/detail",
        component: _import("views/peri/camera/show_detail"),
      },
      {
        name: "camera.manage.edit",
        path: "manage/edit",
        component: _import("views/peri/camera/manage_edit"),
      },
      {
        name: "camera.manage.face",
        path: "manage/face",
        component: _import("views/peri/face/admin"),
      },
      {
        name: "camera.screenshot",
        path: "screenshot",
        component: _import("views/peri/camera/screenshot_list"),
      },
      {
        name: "camera.privatecloud",
        path: "privatecloud",
        component: _import("views/peri/camera/privatecloud_list"),
      },
      {
        name: "camera.privatecloud.add",
        path: "privatecloud/add",
        component: _import("views/peri/camera/privatecloud_edit"),
      },
      {
        name: "camera.privatecloud.edit",
        path: "privatecloud/edit",
        component: _import("views/peri/camera/privatecloud_edit"),
      },
      {
        name: "camera.privatecloud.detail",
        path: "privatecloud/detail",
        component: _import("views/peri/camera/privatecloud_edit"),
      },
    ],
  },
  {
    path: "/cameraList",
    name: "cameraList",
    component: _import("views/peri/cameraList"),
  },
  {
    path: "/faceList",
    name: "face_list",
    component: Layout,
    redirect: "/faceList/faceIndex",
    children: [
      {
        path: "faceIndex",
        name: "face_index",
        component: _import("views/peri/face/index"),
      },
      {
        path: "faceAdmin",
        name: "face_admin",
        component: _import("views/peri/face/admin"),
      },
    ],
  },
  {
    path: "/alarm",
    name: "alarm",
    component: Layout,
    children: [
      {
        path: "index",
        name: "alarm_index",
        component: _import("views/peri/alarm/index"),
      },
    ],
  },
  // 传感器管理
  {
    name: "sensor",
    path: "/sensor",
    component: Layout,
    children: [
      {
        name: "sensor.maintain",
        path: "maintain",
        component: _import("views/peri/sensor/maintain/index"),
      },
      {
        name: "sensor.maintain.update",
        path: "maintain/update",
        component: _import("views/peri/sensor/maintain/update"),
      },
      {
        name: "sensor.maintain.detail",
        path: "maintain/detail",
        component: _import("views/peri/sensor/maintain/detail"),
      },
      {
        name: "sensor.record",
        path: "record",
        component: _import("views/peri/sensor/record/index"),
      },
      // {
      //   name: 'sensor.parameters', path: 'parameters',
      //   component: _import('views/peri/sensor/parameters/index')
      // }, {
      //   name: 'sensor.manufacturer', path: 'manufacturer',
      //   component: _import('views/peri/sensor/manufacturer/index')
      // }
    ],
  },
];

export default caremaRouter;
