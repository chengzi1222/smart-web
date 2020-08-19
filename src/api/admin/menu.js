import http from 'utils/http';
import qs from 'qs';

/*
 * 获取菜单分页
 *
 * */
export function page(page) {
  let data = page;
  return http({
    method: 'post',
    url: 'admin/menu/page',
    data
  });
}
/*
 * 获取菜单列表
 *
 * */
export function list(pid) {
  let data = qs.stringify(list[i].id);
  return http({
    method: 'post',
    url: 'admin/menu/list',
    data
  });
}

/*
 * 添加菜单
 *
 * */
export function addMenu(menu) {
  let data = menu;
  return http({
    method: 'post',
    url: 'admin/menu/add',
    data
  });
}

/*
 * 编辑菜单
 *
 * */
export function editMenu(menu) {
  let data = menu;
  return http({
    method: 'post',
    url: 'admin/menu/edit',
    data
  });
}

/*
 * 删除菜单
 *
 * */
export function delMenu(menu) {
  let data = menu;
  return http({
    method: 'post',
    url: 'admin/menu/del',
    data
  });
}

/*
 * 菜单关联模块
 *
 * */
export function addMenuModule(params) {
  let data = params;
  return http({
    method: 'post',
    url: 'admin/menu/addMenuModule',
    data
  });
}
