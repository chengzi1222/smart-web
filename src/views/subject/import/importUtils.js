export const ENTITY_TYPE = {
    MEDICINE: '药品', // 药品主体
    FOOD: '食品',
    COSMETIC:'化妆品',
    MAAI:'医疗器械'
}

export const FOOD_ENTITY_TYPE = {
    PRODUCT: '生产主体',
    CIRCULATION: '流通主体',
    RESTAURANT: '餐饮主体'
}

export const MEDI_ENTITY_TYPE = {
    MEDICINE_MANAGER: "经营主体",
    MEDICINE_EMPLOY: "使用主体"
}
export const COSMETIC_ENTITY_TYPE = {
  COSMETIC_MANAGER: "经营主体",
  COSMETIC_PRODUCT: "生产主体",
  COSMETIC_EMPLOY: "使用主体"
}
export const MAAI_ENTITY_TYPE = {
  MAAI_MANAGER: "经营主体",
  MAAI_PRODUCT: "生产主体",
  MAAI_EMPLOY: "使用主体"
}

export const FOOD_LICENCE_TYPE = {
    PRODUCT: 'com.ybveg.govx.enums.ProduceLicenceTypeEnum',
    CIRCULATION: 'com.ybveg.govx.enums.FlowLicenceTypeEnum',
    RESTAURANT: 'com.ybveg.govx.enums.FoodLicenceTypeEnum'
}

export function getTitle (entityType, entityTypeExt) {

    let ext = ''
    if (entityType.toUpperCase() === 'FOOD') {
        ext = FOOD_ENTITY_TYPE[entityTypeExt.toUpperCase()]
    } else if (entityType.toUpperCase() === 'MEDICINE') {
        ext = MEDI_ENTITY_TYPE[entityTypeExt.toUpperCase()]
    } else if(entityType.toUpperCase()==='COSMETIC'){
      ext = COSMETIC_ENTITY_TYPE[entityTypeExt.toUpperCase()]
    } else if (entityType.toUpperCase() === 'MAAI') {
      ext = MAAI_ENTITY_TYPE[entityTypeExt.toUpperCase()]
    }else {

    }
    return ENTITY_TYPE[entityType.toUpperCase()] + ext
}

export function getLicenceTypeEnum(entityType, entityTypeExt) {
    if (entityType === 'FOOD') {
        return FOOD_LICENCE_TYPE[entityTypeExt]
    }
}
