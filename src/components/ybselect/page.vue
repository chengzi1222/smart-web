<template>
    <div>
        <yb-select
            @getSelectData="getSelectData"
            :selectData="selectData"
            :checkedData="checkedData"
            showFlied="code"
            childFlid="children"
            id='id'
            >
        </yb-select>
    </div>
</template>

<script>
import YbSelect from './YbSelect.vue'

export default {
    beforeMount() {
        let data = [{
            "code": "100",
            "createTime": "2017-09-23 04:34:13",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1000,
            "leaf": "NO",
            "level": 1,
            "name": "testItem",
            "path": "1000",
            "remark": "testRemark"
        },
        {
            "code": "100101",
            "createTime": "2017-09-23 04:33:24",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1001,
            "leaf": "YES",
            "level": 2,
            "name": "item2",
            "path": "1000.1001",
            "remark": "test1"
        },
        {
            "code": "100102",
            "createTime": "2017-09-23 04:32:51",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1002,
            "leaf": "YES",
            "level": 2,
            "name": "item3",
            "path": "1000.1002",
            "remark": "test2"
        },
        {
            "code": "101",
            "createTime": "2017-09-23 04:34:15",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1003,
            "leaf": "NO",
            "level": 1,
            "name": "item4",
            "path": "1003",
            "remark": "test3"
        },
        {
            "code": "101101",
            "createTime": "2017-09-23 04:35:08",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1004,
            "leaf": "YES",
            "level": 2,
            "name": "item5",
            "path": "1003.1004",
            "remark": "test4"
        },
        {
            "code": "101102",
            "createTime": "2017-09-23 04:35:08",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1005,
            "leaf": "NO",
            "level": 2,
            "name": "item5",
            "path": "1003.1004",
            "remark": "test4"
        },
        {
            "code": "101101101",
            "createTime": "2017-09-23 04:36:12",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1006,
            "leaf": "YES",
            "level": 3,
            "name": "item6",
            "path": "1003.1004.1005",
            "remark": "test5"
        },
        {
            "code": "101101102",
            "createTime": "2017-09-23 04:36:12",
            "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
            "enable": "YES",
            "id": 1007,
            "leaf": "YES",
            "level": 3,
            "name": "item6",
            "path": "1003.1004.1005",
            "remark": "test5"
        }
        ]

         let data2 = [
            {
                "code": "100",
                "createTime": "2017-09-23 04:34:13",
                "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
                "enable": "YES",
                "id": 1000,
                "leaf": "NO",
                "level": 1,
                "name": "testItem",
                "path": "1000",
                "remark": "testRemark"
            },
            {
                "code": "100101",
                "createTime": "2017-09-23 04:33:24",
                "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
                "enable": "YES",
                "id": 1001,
                "leaf": "YES",
                "level": 2,
                "name": "item2",
                "path": "1000.1001",
                "remark": "test1"
            },
            {
                "code": "100102",
                "createTime": "2017-09-23 04:32:51",
                "dictId": "c9ac7dde9ddd11e7ae293cbf104428a9",
                "enable": "YES",
                "id": 1002,
                "leaf": "YES",
                "level": 2,
                "name": "item3",
                "path": "1000.1002",
                "remark": "test2"
            },
        ]

        this.selectData = data;
        this.checkedData = data2;
    },
    components: {
        YbSelect
    }
    , data() {
        return {
            selectData: [],//下拉所有数据
            checkedData:[] //回显选中的数据
        }
    },
    methods: {
        // 监听数据
        getSelectData(val){
            console.log(val)
        }
    },
}



</script>

<style scoped lang="sass">

</style>
