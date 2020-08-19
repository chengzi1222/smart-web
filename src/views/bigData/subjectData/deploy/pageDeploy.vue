<template>
  <div>
    <div class="page-tilt">
      <b></b>
      <span>页面配置</span>
    </div>
    <ul class="tab-box">
      <li class="tabLi" v-for="(item,index) in patternLis" :class="index==choose?'li-bott':''" :key="index">
        <div>{{item.name}}</div>
      </li>
      <li class="tab-bott"></li>
    </ul>
    <div style="position:relative;" class="mt20">
      <!-- <span class="explain movePoin" style="left:30%;" title="此标题会显示在控制仓顶部。">说明</span>
      <span class="explain movePoin" style="left:46%;" title="标题前是否要添加区域名称前缀。">说明</span> -->
      <img src="../../../../assets/img/subjectData/i.svg" class="explain movePoin" style="left:26.5%;" title="此标题会显示在控制仓顶部。"/>
      <img src="../../../../assets/img/subjectData/i.svg" class="explain movePoin" style="left:44%;" title="标题前是否要添加区域名称前缀。"/>
      <el-table :data="datas" class="table-div overNone">
        <el-table-column min-width="100" type="expand">
          <template slot-scope="prop" v-if="prop.row.children.length">
            <div style="position:relative;">
              <img src="../../../../assets/img/subjectData/i.svg" class="explain movePoin" style="left:22%;" title="此标题为某个显示模块的标题。"/>
              <img src="../../../../assets/img/subjectData/i.svg" class="explain movePoin" style="left:37%;" title="是否在标题前加上区域名称。"/>
              <img src="../../../../assets/img/subjectData/i.svg" class="explain movePoin" style="left:81%;" title="控制该功能模块的显示位置，1-8的数子，不可重复，必填。"/>
              <el-table :data="prop.row.children" class="table-div">
                <el-table-column show-overflow-tooltipmin-width="100" label="功能模块"></el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="标题">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.redact">{{scope.row.name}}</span>
                    <el-input v-else class="w150" placeholder="请配置标题" :maxlength="1" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="标题前缀">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.redact">{{scope.row.titleIsShow}}</span>
                    <el-select v-else class="w150" v-model="scope.row.titleIsShow">
                      <el-option label="开启" value="开启"></el-option>
                      <el-option label="关闭" value="关闭"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="是否显示">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.redact">{{scope.row.isShow}}</span>
                    <el-select v-else class="w150" v-model="scope.row.isShow">
                      <el-option label="是" value="是"></el-option>
                      <el-option label="否" value="否"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="请求频次">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.redact">{{scope.row.isShow}}</span>
                    <el-select v-else class="w150" v-model="scope.row.isShow">
                      <el-option label="是" value="是"></el-option>
                      <el-option label="否" value="否"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip min-width="100" label="显示位置编号">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.redact">{{scope.row.name}}</span>
                    <el-input v-else class="w150" placeholder="1-8是数字，必填" :maxlength="1" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <a href="javascript:;" v-if="scope.row.redact" @click="submit(scope.row)">保存</a>
                    <a href="javascript:;" v-if="scope.row.redact" @click="cancel(scope.row)">取消</a>
                    <a href="javascript:;" v-if="!scope.row.redact" @click="redact(scope.row)">编辑</a>
                    <a href="javascript:;" v-if="!scope.row.redact">数据池管理</a>
                    <a href="javascript:;" v-if="!scope.row.redact">接口调用</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="页面名称" min-width="80">
          <template slot-scope="scope">
            <span :class="scope.row.children.length == 0 ? 'none':''">{{scope.row.redact}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="100"></el-table-column>
        <el-table-column label="标题前缀" min-width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.redact">{{scope.row.titleIsShow}}</span>
            <el-select v-else class="w150" v-model="scope.row.titleIsShow">
              <el-option label="开启" value="开启"></el-option>
              <el-option label="关闭" value="关闭"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" min-width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.redact">{{scope.row.isShow}}</span>
            <el-select v-else class="w150" v-model="scope.row.isShow">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="显示顺序" min-width="100">
          <template slot-scope="scope">
            <span v-if="!scope.row.redact">{{scope.row.name}}</span>
            <el-input v-else class="w150" placeholder="请输入正整数，必填" :maxlength="2" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.redact" @click="submit(scope.row)">保存</a>
            <a href="javascript:;" v-if="scope.row.redact" @click="cancel(scope.row)">取消</a>
            <a href="javascript:;" v-if="!scope.row.redact" @click="redact(scope.row)">编辑</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        datas:[{
          name: 1,
          redact:false,
          titleIsShow: '开启',
          isShow: '是',
          children:[{
            name: 2,
            redact: false,
            titleIsShow: '开启',
            isShow: '是'
          }]
        }],
        patternLis: [{
          name: '食品',
          index: 0
        }],
        choose: 0,
        tabelRowData:null, //暂存当前编辑行数据
      }
    },
    methods: {
      submit(row){
        debugger
      },
      cancel(row){
        row.name = this.tabelRowData.name;
        row.titleIsShow = this.tabelRowData.titleIsShow;
        row.isShow = this.tabelRowData.isShow;
        row.redact = false;
      },
      redact(row){
        this.tabelRowData = Object.assign({}, row)
        row.redact = true;
      }
    },
    components: {
    }
  }
</script>

<style scoped lang="scss">
  .explain{
    position:absolute;
    top: 15px;
    z-index: 9;
    color: #FF6600;
    /* transform: scale(0.8,0.8); */
    width: 20px;
    height: 20px;
  }
  .none{
    width: 100%;
    display: inline-block;
    padding-left: 50px; 
    margin-left: -50px;
    background: #fff;
    transition: all 200ms;
  }
  .el-table--enable-row-hover tr:hover .none{
    background-color: #f5f7fa;
  }
  
  .tab-box {
    width: 100%;
    display: flex;
    position: relative;
  }
  .tab-box .tabLi {
    width: 110px;
    height: 50px;
    line-height: 50px;
    margin-right: 30px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #9A9A9A;
    text-align: center;
  }
  .tab-box .li-bott {
    border-bottom: 2px solid #0DB5EF;
    z-index: 666;
    position: relative;
  }
</style>
<style lang="sass">
  .overNone .cell,.overNone div{
    overflow: inherit;
  }
  .overNone .el-table__expanded-cell{
    padding: 20px 30px;
  }
</style>