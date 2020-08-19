export const ENTITY_TYPE = {
  MEDICINE: '药品' // 药品主体
}

export const MEDI_ENTITY_TYPE = {
  MEDICINE_MANAGER: '经营主体',
  MEDICINE_PRODUCT: '生产主体',
  MEDICINE_EMPLOY:  '使用主体'
}
/**
 * 主体特有tab
 */
export const PRIVATE_TAB = {
  MEDICINE: {
    MEDICINE_MANAGER: [

    ],
    MEDICINE_EMPLOY: [
      
    ]
  }
}
/**
 * 主体共有tab
 */
export const PUBLIC_TAB = [
  {name: '主体信息', tab: 'entityInfo'},
  {name: '备案编辑记录', tab: 'backupEditRecord'},
  {name: '巡查记录', tab: 'patrolRecord'}
  // {name: '处罚记录', tab: 'punishRecord'},
]

export const EXT = {
  INFO: '档案详情',
  CHANGE: '编辑',
  REWORK:'重新申请',
}

export const PRIVATE_EXT = {
  INFO: [

  ],
  CHANGE: [
    {name: '编辑申请', tab: 'change'}
  ],
  REWORK: [
    {name: '重新申请', tab: 'rework'}
  ]
}

export function getTitle(entityType, entityTypeExt, ext) {
  return EXT[ext] + '-' +ENTITY_TYPE[entityType] + MEDI_ENTITY_TYPE[entityTypeExt]
}

export function getTabs(entityType, entityTypeExt, ext) {
  return PRIVATE_EXT[ext].concat(PUBLIC_TAB.concat(PRIVATE_TAB[entityType][entityTypeExt]))
}

export function getEntityName(entityType, entityTypeExt) {
  return ENTITY_TYPE[entityType] + MEDI_ENTITY_TYPE[entityTypeExt]
}
