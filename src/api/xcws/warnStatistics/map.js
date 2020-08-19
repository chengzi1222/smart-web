import http from "utils/http";

// 获取地图主体
export function getMapList(params) {
    return http({
        method: 'POST',
        url: '/ewcenter/bigScreen/areaEntity/page',
        params: params
    });
}

// 获取地图主体
export function pageDemo() {
    return http({
        method: 'POST',
        url: '/ewcenter/bigScreen/areaEntity/pageDemo',
        params: {
            'lat':30.5926203981,
            'lng':104.0387662631,
            'maxDistance':5000,
            'riskRateList':'02,03,04',
            'size':100
        }
    });
}