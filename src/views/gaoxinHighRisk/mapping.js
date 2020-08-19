export function getMapping() {
    return {
        "handle": {
            "01": "确认存在问题, 并整改",
            "02": "未发现问题,解除预警",
            "03": "预警过期,系统自动解除"
        },
        "handle2": {
            "01": "确认存在问题, 并整改",
            "02": "未发现问题,解除预警",
            "06": "数据未上传，已补传相关数据",
            "03": "预警过期,系统自动解除"
        },
        "handle3": {
            "04": "无效投诉建议，解除预警",
            "05": "投诉建议已反馈解决，解除预警",
            "03": "预警过期,系统自动解除"
        },
        "disposeDept":{
            "ENTITY":'责任主体',
            "SUPERVISION":'监管部门',
            "SYS":'系统'
        },
        "warning": {
            "01": "产业经营数据分析",
            "0101": "疑似过期食品",
            "0102": "溯源异常",
            "010201":"溯源率过低",
            "010202":"肉蛋禽类采购异常",
            "010203":"粮油采购异常",
            "010204":"蔬菜类采购异常",
            "0103": "后厨管理异常",
            "010301": "晨检率异常",
            "010302": "陪餐率异常",
            "010303": "清洗消毒异常",
            "010304": "垃圾处理异常",
            "010305": "留样异常",
            "02": "AI物联网设备识别",
            "0201": "检测异常",
            "020101": "检测超标",
            "020102": "多次未检",
            "0202":"AI摄像头预警",
            "020201":"无帽子",
            "020202":"无手套",
            "020203":"无口罩",
            "020204":"玩手机",
            "020205":"老鼠",
            "020206":"抽烟",
            "020207":"陌生人进入",
            "03": "政府监督",
            "0301": "监管检查预警",
            "030101":"日常检查",
            "030102":"专项检查",
            "030103":"双随机检查",
            "030104":"整改复查",
            "0302": "健康证",
            '030201':"健康证过期",
            '030202':"健康证即将过期",
            "0303": "许可证",
            '030301':"许可证过期",
            '030302':"许可证即将过期",
            "04": "溯源异常",
            "0401": "投诉建议预警"
        },
        "type": {
            "KINDSC": "幼儿园",
            "PRISC": "小学",
            "MIDSC": "初中",
            "HIGSC": "高中",
            "UNVSC": "大学",
            "HSPT": "医院",
            "CORP": "企事业单位",
            "GOV": "政府机关",
            "RSTNT": "社会餐饮",
            "SPMKT": "商超",
            "HOTEL": "酒店",
            "WSMKT": "批发",
            "FMMKT": "农贸",
            "PERSON": "个体",
            "XJBT": "新疆生产建设兵团"
        },
        "scType": {
            "PUBLIC":"公立",
            "PRIVATE":"私立"
        },
        "risk": {
            "01":"暂无风险",
            "02":"低风险",
            "03":"中风险",
            "04":"高风险"
        },
        "problem": {
            "01": "环境卫生",
            "02": "人员管理",
            "03": "食材问题",
            "04": "菜品问题",
            "05": "其它问题"
        },
        "feedback":{
            "01":"待反馈",
            "02":"已反馈",
            "03":"已关闭",
            "04":"撤销"
        }

    }

}
