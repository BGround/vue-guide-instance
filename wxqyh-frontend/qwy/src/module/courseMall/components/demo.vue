<template>
  <div class="demo-block">
      <div>
        <h1>输入框</h1>
        <div class="demo-block">
          <p>文本框</p>
          <qwui-input inputType="textarea" @input='changeInput' :isFocus="isFocus"></qwui-input>
        </div>
        <div class="demo-block">
          <p>普通输入框(带错误提示)</p>
          <qwui-input inputType="text" @input='changeInput' :isWarning="isWarning" warningTips="标题不能为空"></qwui-input>
        </div>
        <div class="demo-block">
          <p>排序号输入框</p>
          <qwui-input inputType="sort" @input='changeInput' defaultVal="0"></qwui-input>
        </div>
        <div class="demo-block">
          <p>禁止输入框</p>
          <qwui-input inputType="forbidden" @input='changeInput'></qwui-input>
        </div>
        <div class="demo-block">
          <p>搜索输入框</p>
          <qwui-input inputType="search" @search='changeInput'></qwui-input>
        </div>
        <div class="demo-block">
          <p>树形选择器输入框</p>
          <qwui-input inputType="tree" @input='changeInput'></qwui-input>
        </div>
      </div>
      <div>
        <h1>按钮</h1>
        <div class='demo-block'>
          <p>基本按钮</p>
          <qwui-button>取消</qwui-button>
          <qwui-button>三个字</qwui-button>
          <qwui-button disabled>不可点击</qwui-button>
          <qwui-button type='primary'>四个文字</qwui-button>
          <qwui-button plain>四个文字</qwui-button>
        </div>
        <div class='demo-block'>
          <p>大小按钮</p>
          <qwui-button type='primary' size='large'>开设必学课</qwui-button>
          <qwui-button size='small'>大小small</qwui-button>
          <qwui-button type='primary' size='small'>大小</qwui-button>
        </div>
        <div class='demo-block'>
          <p>文字按钮</p>
          <qwui-button type='text'>普通文字状态</qwui-button>
          <qwui-button type='text-primary'>普通文字状态</qwui-button>
        </div>
        <div class='demo-block'>
          <p>特殊按钮</p>
          <qwui-button type='large-solid-round' @click='setUp'>免费安装</qwui-button>
          <qwui-button type='large-plain-round' plain>+ 创建分组和固定流程</qwui-button>
          <qwui-button type='medium-plain-round' plain>表单流程</qwui-button>
        </div>
      </div>
      <div>
        <h1>下拉选择框</h1>
        <div class="demo-block">
          <qwui-select @selectItem="selectItem" :dataList="optionData"></qwui-select>
          <qwui-select @selectItem="selectItem" :dataList="optionData" borderType="rightAngle"></qwui-select>
        </div>
      </div>
      <div>
        <h1>开关</h1>
        <div class="demo-block">
          <qwui-switch :defaultStatus="defaultStatus" @change="change"></qwui-switch>
        </div>
      </div>
      <div>
        <h1>面包屑</h1>
        <div class="demo-block">
          <qwui-breadcrumb @handleClick="normalClick" :isBack="isFocus">
            <template slot="btn">
              <qwui-button @click="normalClick">返回</qwui-button>
            </template>
            <template slot="item">
              <qwui-breadcrumb-item :to="{path:'/'}">首页</qwui-breadcrumb-item>
              <qwui-breadcrumb-item><a href="http://www.baidu.com">活动列表</a></qwui-breadcrumb-item>
              <qwui-breadcrumb-item>活动详情</qwui-breadcrumb-item>
            </template>
          </qwui-breadcrumb>
        </div>
      </div>
      <div>
        <h1>步骤条</h1>
        <div class="demo-block">
          <qwui-steps :isCenter="defaultStatus" :active="active" :isDash="defaultStatus">
            <qwui-step title="验证方式"></qwui-step>
            <qwui-step title="重置密码" content="阿UI博文旧版"></qwui-step>
            <qwui-step title="完成"></qwui-step>
          </qwui-steps>
        </div>
        <div class="demo-block" style="height:300px">
          <qwui-steps :active="active" direction="vertical" :isCenter="defaultStatus" :isDash="defaultStatus">
            <qwui-step title="验证方式"></qwui-step>
            <qwui-step title="重置密码">
              <div slot="content">
                <h1>123</h1>
                <div>
                  <p>456</p>
                  <p>789</p>
                </div>
              </div>
            </qwui-step>
            <qwui-step title="完成"></qwui-step>
          </qwui-steps>
        </div>
      </div>
      <div class="demo-block" style="margin-top:20px;">
        <h1>单选框</h1>
        <div class="mt5">
          <p>基本单选</p>
          <qwui-radio v-model="radioValue" label="上海">上海</qwui-radio>
          <qwui-radio v-model="radioValue" label="广州">广州</qwui-radio>
        </div>
        <div class="mt5">
          <p>禁用状态</p>
          <qwui-radio v-model="radioValue1" label="苹果" disabled>苹果</qwui-radio>
          <qwui-radio v-model="radioValue1" label="香蕉" disabled>香蕉</qwui-radio>
        </div>
        <div class="mt5">
          <p>带边框</p>
          <qwui-radio v-model="radioValue2" label="电视机" border @change="chooseRadio">电视机</qwui-radio>
          <qwui-radio v-model="radioValue2" label="电脑" border @change="chooseRadio">电脑</qwui-radio>
          <qwui-radio v-model="radioValue3" label="粤菜" border disabled>粤菜</qwui-radio>
          <qwui-radio v-model="radioValue3" label="湘菜" border disabled>湘菜</qwui-radio>
        </div>
      </div>
      <div class="demo-block">
        <h1>复选框</h1>
        <p>基本复选框</p>
        <qwui-checkbox v-model="checked">杯子</qwui-checkbox>
        <p>禁用</p>
        <qwui-checkbox v-model="checked1" disabled>杯子</qwui-checkbox>
        <qwui-checkbox v-model="checked2" disabled>杯子</qwui-checkbox>
        <p>多选框组</p>
        <qwui-checkbox-group>
          <qwui-checkbox label="复选框 A" disabled></qwui-checkbox>
          <qwui-checkbox label="复选框 B" disabled></qwui-checkbox>
          <qwui-checkbox label="复选框 C" disabled></qwui-checkbox>
        </qwui-checkbox-group>
      </div>
      <div>
        <h1>下拉菜单</h1>
        <div class="demo-block">
          <qwui-dropdown @itemClick="change">
            <qwui-dropdown-item val="a">从模板新建</qwui-dropdown-item>
            <qwui-dropdown-item val="b">从Excel新建</qwui-dropdown-item>
            <qwui-dropdown-item val="c">+新建分组</qwui-dropdown-item>
          </qwui-dropdown>
          <qwui-dropdown @itemClick="change">
            <qwui-dropdown-item val="haha">新建</qwui-dropdown-item>
            <qwui-dropdown-item val="keke">再新建</qwui-dropdown-item>
            <qwui-dropdown-item val="nana">
              <div>12234</div>
            </qwui-dropdown-item>
          </qwui-dropdown>
        </div>
      </div>
  </div>
</template>
<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch'
import qwuiBreadcrumb from '@/components/qwuiBase/qwuiBreadcrumb/qwuiBreadcrumb'
import qwuiBreadcrumbItem from '@/components/qwuiBase/qwuiBreadcrumb/qwuiBreadcrumbItem'
import qwuiSteps from '@/components/qwuiBase/qwuiSteps/qwuiSteps'
import qwuiStep from '@/components/qwuiBase/qwuiSteps/qwuiStep'
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import qwuiCheckboxGroup from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckboxGroup'
import qwuiDropdown from '@/components/qwuiBase/QwuiDropdown/QwuiDropdown'
import qwuiDropdownItem from '@/components/qwuiBase/QwuiDropdown/QwuiDropdownItem'
export default {
    data(){
        return {
          isWarning: true,
          isFocus: false,
          optionData: [
              {
                  val: '1',
                  optionName: '分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1分组1'
              },
              {
                  val: '2',
                  optionName: '分组2'
              },
              {
                  val: '3',
                  optionName: '分组3'
              },
              {
                  val: '4',
                  optionName: '分组4'
              },
              {
                  val: '5',
                  optionName: '分组5'
              },
              {
                  val: '6',
                  optionName: '分组6'
              }
          ],
          defaultStatus: true,
          active: 0,
          radioValue:'上海',//单选按钮默认选择
          radioValue1:'苹果',//单选按钮默认选择
          radioValue2:'电视机',//单选按钮默认选择
          radioValue3:'粤菜',
          checked:true,//默认复选框选中
          checked1:false,//默认复选框选中
          checked2:true,//默认复选框选中
          checkList:['复选框 A','复选框 B']
        }
    },
    components: {
      qwuiInput,
      qwuiButton,
      qwuiSelect,
      qwuiSwitch,
      qwuiBreadcrumb,
      qwuiBreadcrumbItem,
      qwuiSteps,
      qwuiStep,
      qwuiRadio,
      qwuiCheckbox,
      qwuiCheckboxGroup,
      qwuiStep,
      qwuiDropdown,
      qwuiDropdownItem
    },
    methods: {
        changeInput(text){
            console.log(text);
        },
        setUp(){
          this.isFocus = true;
          console.log('安装成功');
          this.active++;
        },
        selectItem(optionName, val){
          console.log(optionName, val);
        },
        change(status){
          console.log(status);
        },
        normalClick(){
          console.log(666);
        },
        chooseRadio(value){
          console.log(value,'chooseRadio')
        }
    }
}
</script>
<style scoped lang="scss">
.demo-block {
    padding:10px;
}
h1{
  font-size: 20px;
  font-weight: bold;
}
.icon_wrap{
  width: 24px;
  height: 24px;
  background: url(../../../assets/images/ic_file_24.png) no-repeat center;
}
</style>


