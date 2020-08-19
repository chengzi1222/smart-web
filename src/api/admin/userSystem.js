import http from 'utils/http';

// -------------------------------用户体系=》其他设置-------------------------------------------------------------------
/**
 * 直属部门列表
 */
export function getSubDeptPaging(num,size) {
    return http({
      method: 'get',
      url: '/admin/subDept/paging?pageNum='+num+'&pageSize='+size
    });
  }
  /**
 * 职务列表
 */
export function getPostPaging(num,size) {
    return http({
      method: 'get',
      url: '/admin/post/paging?pageNum='+num+'&pageSize='+size
    });
  }
  
    /**
 * 直属部门启动或者激活
 */
export function getIsEnable_directly(id,enable) {
    return http({
      method: 'post',
      url: '/admin/subDept/opt',
      params:{
        "subDeptId":id,
        "enable":enable
      }
    });
  }
    /**
 * 职务启动或者激活
 */
export function getIsEnable_duty(id,enable) {
    return http({
      method: 'post',
      url: '/admin/post/opt',
      params:{
        "postId":id,
        "enable":enable
      }
    });
  }

      /**
 * 直属部门删除
 */
export function del_directly(id) {
    return http({
      method: 'post',
      url: '/admin/subDept/delete',
      params:{
        "subDeptId":id
      }
    });
  }
/**
 * 职务删除
 */
export function del_duty(id) {
    return http({
      method: 'post',
      url: '/admin/post/delete',
      params:{
        "postId":id
      }
    });
  }

          /**
 * 直属部门添加和编辑
 */
export function add_directly(obj) {
    let url=obj.opt=='add'?'/admin/subDept/add':'/admin/subDept/update';
    return http({
        method: 'post',
        url: url,
        data:{
            'name':obj.name,
            'remark':obj.remark,
            'id':obj.id
        }
      });
  }
/**
 * 职务添加和编辑
 */
export function add_duty(obj) {
    let url=obj.opt=='add'?'/admin/post/add':'/admin/post/update';
    return http({
        method: 'post',
        url: url,
        data:{
            'name':obj.name,
            'remark':obj.remark,
            'id':obj.id
        }
      });
  }
  
        /**
 * 获取穿梭框数据
 */
export function getData_transfer(t,id) {
    let url=t=='directly'?'/admin/subDept/subDeptUserTransferData/find':'/admin/post/postUserTransferData/find'
    let obj=t=='directly'?{"subDeptId":id}:{"postId":id}
    return http({
      method: 'get',
      url: url,
      params:obj
    });
  }
/**
 * 职务和直属部门跟新人员
 */
export function userUpdate(t,id,ids) {
  let url=t=='directly'?'/admin/subDept/user/update/'+id:'/admin/post/user/update/'+id
    return http({
      method: 'post',
      url: url,
      data:ids
      
    });
  }