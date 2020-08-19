/**
 * 工单状态
 * @type {{PEND_REVIEW: string, ALREADY_FILE: string, ALREADY_REJECT: string, ALREADY_REVOKE: string}}
 */
export const WORK_STATUS = {
  PEND_REVIEW: 'PEND_REVIEW', //待审核
  ALREADY_FILE: 'ALREADY_FILE', //已归档
  ALREADY_REJECT: 'ALREADY_REJECT', //已驳回
  ALREADY_REVOKE: 'ALREADY_REVOKE', //已撤销
};

/**
 * 三小流程，记录当前父级所属菜单
 * 用于备案记录查看详情路由跳转，为info时子通知父刷新数据，不跳转路由
 * @see views/cfda/details/workflow_record.vue #85
 * @type {{archives: string, work: string, myWork: string, info: string}}
 */
export const CURRENT_ENTITY_MENU = {
  archives: 'archives', //档案菜单
  work: 'workflow', //工单菜单
  myWork: 'mywork', //我的工单菜单
  /**
   * @see views/cfda/workflow/info/index.vue
   */
  info: 'none',
};

/**
 * 三小所有操作类型
 * 用于点击tab选项显示或隐藏子组件
 * @type {{change: string, entity: string, record: string, delay: string, first: string}}
 */
export const INFO_TYPE = {
  change: 'change',//变更
  entity: 'entity',//主体
  record: 'record',//备案变动记录
  delay: 'delay',//延续
  first: 'first',//首次申请
  edit: 'edit',//编辑
  entityPatrolRecord: 'entityPatrolRecord', // 主体巡查记录
  entityPunishRecord: 'entityPunishRecord'// 主体处罚记录
};

/**
 * 根据操作类型生成tab动态选项卡
 * @param type 操作类型
 * @param entityType 主体类型，用于重新申请显示或隐藏子组件
 * @returns {Array}
 * @constructor
 */
export function InfoTab(type,entityType) {
  let lists = [];
  if (type == "CHANGE") {
    lists.push({ tabName: '变更申请', entityType: entityType, key: INFO_TYPE.change});
    lists.push({ tabName: '主体信息', entityType: 'NONE', key: INFO_TYPE.entity});
    lists.push({ tabName: '备案编辑记录', entityType: 'NONE', key: INFO_TYPE.record});
    lists.push({ tabName: '巡查记录', entityType: 'NONE', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', entityType: 'NONE', key: INFO_TYPE.entityPunishRecord});
  } else if (type == "DELAY") {
    lists.push({ tabName: '延续申请', key: INFO_TYPE.delay},);
    lists.push({ tabName: '主体信息', key: INFO_TYPE.entity});
    lists.push({ tabName: '备案编辑记录', key: INFO_TYPE.record});
    lists.push({ tabName: '巡查记录', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', key: INFO_TYPE.entityPunishRecord});
  } else if (type == 'FIRST') {
    lists.push({ tabName: '主体信息', entityType: entityType, key: INFO_TYPE.first});
    lists.push({ tabName: '巡查记录', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', key: INFO_TYPE.entityPunishRecord});
  } else if (type == 'EDIT') {
    lists.push({ tabName: '主体信息', entityType: entityType, key: INFO_TYPE.first});
    lists.push({ tabName: '巡查记录', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', key: INFO_TYPE.entityPunishRecord});
  } else if (type == "CANCEL") {
    lists.push({ tabName: '主体信息', entityType: entityType, key: INFO_TYPE.first});
    lists.push({ tabName: '备案编辑记录', key: INFO_TYPE.record});
    lists.push({ tabName: '巡查记录', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', key: INFO_TYPE.entityPunishRecord});
  }else if(type == 'INFO'){
    lists.push({tabName: '主体信息', key: INFO_TYPE.entity});
    lists.push({ tabName: '备案编辑记录', key: INFO_TYPE.record});
    lists.push({ tabName: '巡查记录', key: INFO_TYPE.entityPatrolRecord});
    lists.push({ tabName: '处罚记录', key: INFO_TYPE.entityPunishRecord});
  }
  return lists;
}
