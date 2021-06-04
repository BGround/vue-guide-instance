<template>
    <div>
        <div class="selectBox" v-show="boxShow">
            <div class="selectContent qwui-border_bottom">
                <label
                    v-for="(value,key) in options" :key="key"
                    :for="value.value"
                    class="qwui-border_bottom">
                <input type="radio"
                        :key="key"
                        :value="key"
                        :id="value.value"
                        v-model="radioValue"
                        name="radio"
                        class="icon_check">
                    {{value.text}}
                </label>
            </div>

            <!--显示特定对象-->
            <user_add class="qwui-user_add" :userselect="dataBase.selectConfig" @deleteTag="deleteTag"></user_add>
            <!--选择人员-->
            <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"
                :tagSelect="true"
                @chooseDone="chooseDone"></user_select>
            <!--操作按钮-->
            <button_group :fixed="true">
                <button_item type="default" text="关闭" @buttonClick="cancelSelected"></button_item>
                <button_item type="primary" text="确定" @buttonClick="confirmSelected"></button_item>
            </button_group>
        </div>

    </div>
</template>
<script>
import user_add from '@/components/add/user_select_build';
import user_select from '@/components/base/user_or_dept_select';
import button_group from '@/components/base/button/button_group';
import button_item from '@/components/base/button/button';
export default {
    props: {
        boxShow: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: {}
        },
    },
    data(){
        return{
            dataBase,
        }
    },
    computed: {
        toPersonList(){
            return this.dataBase.selectConfig.selectList["toPersonList"];
        },
        radioValue:{
            get(){
                return this.$store.state.rules.rang;
            },
            set(val){
                this.$store.commit('updateRang', val)
            }
        }
    },
    watch: {
        radioValue(val) {
            if(val==3){
                this.toPersonList.title="特定人员和部门";
            }else {
                this.toPersonList.title="";
            }
        }
    },
    mounted() {
      if(this.radioValue==3) {
        this.toPersonList.title="特定人员和部门";
      }
    },
    methods:{
        // 特定对象关闭
        cancelSelected(){
            var self = this;
            if(self.radioValue == '3'&&!self.toPersonList.userSelected.length && !self.toPersonList.deptSelected.length &&
                !self.toPersonList.tagSelected.length){
                var btn={
                    primaryBtn:{name:'确定', callBack:()=>{
                        self.radioValue = '1';
                        self.$emit('update:boxShow', false);
                    }},
                    defaultBtn:{name:"取消", callBack:null},
                };
                _.alert('提示','您未选择任何部门或人,将默认选择所有人',btn);
            } else {
                self.$emit('update:boxShow', false);
            }
        },
        // 特定对象确定
        confirmSelected(){
            var self = this;
            if(self.radioValue == '3'&&!self.toPersonList.userSelected.length && !self.toPersonList.deptSelected.length
                && !self.toPersonList.tagSelected.length){
                _.alert('提示','您未选择任何部门或人')
                return;
            }
            self.$emit('confirmSelected', self.radioValue)
            self.$emit('update:boxShow', false);
        },
        // 返回数据
        chooseDone(val){
            if(val.tag.data.length > 0) {
                this.toPersonList.tagSelected=[];
                val.tag.data.forEach(item => {
                    this.toPersonList.tagSelected.push(item);
                });
            }
        },
        // 删除标签
        deleteTag(id,index,signIndex){
            this.toPersonList.tagSelected.splice(index,1);
        },
    },
    components:{
        user_add,
        user_select,
        button_group,
        button_item
    }
}
</script>
<style scoped>
@media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F5F5F5;
    overflow-y: scroll;
    
  }
  .selectBox::-webkit-scrollbar { width: 0 !important }
  .selectContent {
    padding-left: 15px;
    background-color: #fff;
  }
  .selectBox label {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
  }
  .selectBox .qwui-border_bottom:last-child:after{
    border: none;
  }
  .qwui-check_btn {
    margin-right: 10px;
  }
.qwui-selectType_wrap {
    position: fixed;
    width: 100%;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #F7F8FA;
    z-index: 4;
}
/*操作按钮*/
.qwui-btn_box {
    background-color: #fff;
}
.qwui-user_add{
    margin-bottom: 60px;
}

</style>
