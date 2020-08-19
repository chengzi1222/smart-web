export const ENTITY_TYPE = {
  COSMETIC: '化妆品' // 化妆品主体
}

  
export const COSMETIC_ENTITY_TYPE = {
  COSMETIC_MANAGER: '经营主体',
  COSMETIC_PRODUCT: '生产主体',
  COSMETIC_EMPLOY:  '使用主体'
}
/**
 * 主体特有tab
 */
export const PRIVATE_TAB = {
  COSMETIC: {
    COSMETIC_MANAGER: [

    ],
    COSMETIC_EMPLOY: [
      
    ],
    COSMETIC_PRODUCT: [
      
    ]
  }
}
/**
 * 主体共有tab
 */
export const PUBLIC_TAB = [
  {name: '主体信息', tab: 'entityInfo'},
  {name: '备案编辑记录', tab: 'backupEditRecord'},
  // {name: '巡查记录', tab: 'patrolRecord'}
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

export function getTitle(entityType, ext) {
  return EXT[ext] + '-' +ENTITY_TYPE['COSMETIC'] + COSMETIC_ENTITY_TYPE[entityType]
}

export function getTabs(entityType, ext) {
  console.log(entityType, ext)
  return PRIVATE_EXT[ext].concat(PUBLIC_TAB.concat(PRIVATE_TAB['COSMETIC'][entityType]))
}

export function getEntityName(entityType, entityTypeExt) {
  return ENTITY_TYPE[entityType] + COSMETIC_ENTITY_TYPE[entityTypeExt]
}
