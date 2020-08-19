export const ENTITY_TYPE = {
  MAAI: '医疗器械'
}


export const MAAI_ENTITY_TYPE = {
  MAAI_MANAGER: '经营主体',
  MAAI_PRODUCT: '生产主体',
  MAAI_EMPLOY:  '使用主体'
}
/**
 * 主体特有tab
 */
export const PRIVATE_TAB = {
  MAAI: {
    MAAI_MANAGER: [

    ],
    MAAI_EMPLOY: [

    ],
    MAAI_PRODUCT: [

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
  return EXT[ext] + '-' +ENTITY_TYPE['MAAI'] + MAAI_ENTITY_TYPE[entityType]
}

export function getTabs(entityType, ext) {
  console.log(entityType, ext)
  return PRIVATE_EXT[ext].concat(PUBLIC_TAB.concat(PRIVATE_TAB['MAAI'][entityType]))
}
