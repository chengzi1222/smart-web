<template>
  <el-table :data="data" border style="width: 100%" :row-style="showTr">
    <!--  column每个字段对象 index为每列  -->
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :min-width="(index == 6 ||index==0 || index ==1)?250:100"
                     :label="column.text">
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level"
              class="ms-tree-space" :key="levelIndex"></span>
        <!-- 切换树按钮 通过是否有子和列数来决定是否出现  -->
        <el-button style="padding:2px 3px;width:22px" type="text"
                   class="button is-outlined is-primary is-small"
                   v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <!-- 按钮的每种状态根据行展开数据来决定  -->
          <i v-if="scope.row._expanded" class="el-icon-caret-right" aria-hidden="true"></i>
          <i v-if="!scope.row._expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
        </el-button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <!--{{scope.row[column.dataIndex]}}-->

        <el-input
          v-if="showOption.open && scope.row.id==showOption.id &&  showOption.exclude.indexOf(column.dataIndex)<0"
          class="w125"
          v-model="scope.row[column.dataIndex]">
        </el-input>
        <span v-else>
          {{scope.row[column.dataIndex]}}
        </span>

      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
      <template slot-scope="scope">

        <!-- 点击按钮，将按钮的当前行数据和当前行的索引，以及数组和全局对象传过去  -->
        <span v-if="item.show?item.show(scope.row):true" v-for="(item,i) in buttons" :key="i"
              size="small" type="text" class="control-btn" :class="item.type"
              @click="item.event(scope.row,scope.$index,scope.store.states.data,scope)">
          <span v-if="showOption.open && scope.row.id==showOption.id && item.text=='编辑'">
             保存
          </span>
          <span v-else>
             {{item.text}}
          </span>

        </span>

      </template>
    </el-table-column>
  </el-table>
</template>
<script>

  import Utils from 'utils/dataTranslate.js'
  import vue from "vue"
  import qs from 'qs';
  import http from 'utils/http';


  export default {
    name: 'tree-grid',
    data(){
      return {
        indexLis:[]
      }
    },
    props: {
      /** showOption 参数说明
       * 是否必须: 否
       * 参数类型: 对象
       * 参数键值对说明:
       *          {
       *          id, // 需要渲染为行内编辑的 数据行 id值 (如 {id:1,name='二狗',age=13}, id就应为1)
       *          exclude: [],// 需要排除的 行内编辑 数据列 列名字(字段名) 字符串数组类型 默认不排除
       *          open: false // 行内编辑启用状态,默认为 false
       *          }
       *
       */
      showOption: {
        type: Object,
        required: false,//默认不传递该参数 不启用行内编辑功能
        default: function () {
          return {
            id: -1,
            exclude: [],
            open: false
          }
        }
      },
      buttons: {
        type: Array,
        default: function () {
          return []
        }
      },
      handleData: {
        type: Function,
        default: function () {

        }
      },
      // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      // 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
      // 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
      // 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return true
        }
      }
    },
    computed: {
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = [];

          data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)

          return data
        }
        return me.dataSource
      }
    },
    methods: {
      // 显示行
      showTr: function (row, index) {
//        this.data[index].isEdit = true;
        let show = (row._parent ? (!row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级
      async toggle(trIndex) {
        // debugger
        let me = this
        let record = me.data[trIndex]   //拿到被点击当前行的数据

        //展开的时候才去请求新数据
        if (record._expanded && record.ajaxHttp) {
          // 测试用的请求
          let res = await record.ajaxHttp(record.params);

          //处理数据
          this.handleData(res.data);

          //调用设置新数据的函数。
          this.setNewData(this, res.data, trIndex, record._level)
          record._expanded = !record._expanded
        } else {
          this.setNewData(this, [], trIndex, record._level)
          record._expanded = !record._expanded
        }

      },
      // 显示层级关系的空格和图标
      spaceIconShow(index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow(index, record) {

        let me = this
        if (record.isHasChildren && index === 0) {
          return true
        }
        return false
      },
      // 递归寻找需要删除的子元素长度
      DelLen(currentTrData) {
        var len = 0;
        //递归遍历需要删除的子元素长度
        (function changeDelLen(currentTrData) {
          if (currentTrData.children && currentTrData.children.length > 0) {
            len += currentTrData.children.length;
            for (var i in currentTrData.children) {
              if (currentTrData.children[i].hasOwnProperty("children")) {
                changeDelLen(currentTrData.children[i]);
              }
            }
          }
        })(currentTrData)
        return len;
      },
      //参数1上下文this；参数2点击请求的新子数据；参数3为当前行的索引；参数4当前行所属树层级
      setNewData(context, newdata, trIndex, level) {
        //转换新数据
        var datahandled = Utils.MSDataTransfer.treeToArray(newdata, context.data[trIndex], level,
          context.defaultExpandAll);

        var len = this.DelLen(context.data[trIndex]);

        // 如果当前点击行有子的话先删除子。
        if (len > 0) {
          context.data.splice(trIndex + 1, len);
        }

        //把新的子挂载到当前点击行
        context.data[trIndex].children = datahandled

        //追加新子值到数组中去
        for (var i = (datahandled.length - 1); i >= 0; i--) {
          context.data.splice(trIndex + 1, 0, datahandled[i])
        }
      },
    }
  }
</script>
<style scoped lang="sass">
  /* 操作按钮的样式 */
  .control-btn {
    margin: 0 2px;
    cursor: pointer;
  }

  .control-btn:hover {
    opacity: 0.7;
  }

  span.success {
    color: #13ce66;
  }

  span.warning {
    color: #f7ba2a;
  }

  span.danger {
    color: #ff4949;
  }

  span.primary {
    color: #50bfff;
  }

  .el-button--text {
    background: transparent !important;
  }

  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 25px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }
</style>
