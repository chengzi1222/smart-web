import {
    getEnums
} from 'api/common';
export function getPublic() {
    return {
        "quarter": {
            '1': '第一季度',
            '2': '第二季度',
            '3': '第三季度',
            '4': '第四季度',
        },
        "trainingListAssessStatus": {
            '1': '未创建',
            '2': '考核中',
            '3': '已完成',
            '4': '待启动',
        },
        "assessStatus": {
            '1': '待启动',
            '2': '考核中',
            '3': '已完成',
        },
        "assessResult": {
            '1': '优秀',
            '2': '良好',
            '3': '合格',
            '4': '不合格',
            '5': '未参加',
        },
        "trainingStatus": {
            '1': '培训中',
            '2': '已完成',
            '3': '待启动',
        },
        "studyStatus": {
            '0': '未开始',
            '1': '学习中',
            '2': '已完成',
            '3': '未完成',
        },
        "isPublic": {
            '1': '是',
            '0': '否',
        },
        'isApplyPeople': {
            '1': '是',
            '0': '否',
        },
        'status': {
            '1': '启动',
            '0': '待启动',
        },
        'questionsStatus': {
            '1': '启动',
            '0': '禁用',
        },
        "assessPeopleType": {
            '1': '已参加培训人员',
            '0': '未参加培训人员',
        },
        "peopleType": {
            '01': '负责人',
            '02': '管理人员',
            '03': '从业人员',
            '04': '其他人员',
        },
        "pumpType": {
            '0': '随机考题',
            '1': '统一考题',
        }, 

    }

}
export function againTimeArr() {
    let arr=[]
    for(let i=1;i<=10;i++){
        arr.push({
            key:i,
            name:i+'次'
        })
    }
    arr.push({
        key:-2,
        name:'不限次数'
    })
    return arr
}
export async function getEntityType() {
    let r = await getEnums(['com.ybveg.govx.enums.food.licaibao.BuyerTypeEnum'], false)
    if (r.status) {
        let arr=r.data.map(obj=>obj.key)
        let data =r.data
        data.splice(arr.indexOf('XJBT'), 1)
        return data
    } else {
        return []
    }
}
export function getYear() {
    let mydate = new Date();
    let now=mydate.getFullYear()+3
    let arr=[]
    for(let i=2018;i<now;i++){
        arr.push(i)
    }
    // let arr = [mydate.getFullYear() - 2, mydate.getFullYear() - 1, mydate.getFullYear(), mydate.getFullYear() + 1, mydate.getFullYear() + 2]
    return arr
}