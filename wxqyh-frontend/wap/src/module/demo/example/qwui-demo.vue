<template>
  <div>
    默认选中第二个，底部100%：
    <vue-group-tab selected="1" full>
      <vue-tab text="just"></vue-tab>
      <vue-tab text="like"></vue-tab>
      <vue-tab text="this"></vue-tab>
<!--      <vue-tab text="you"></vue-tab>
      <vue-tab text="are"></vue-tab>
      <vue-tab text="favorite"></vue-tab>
      <vue-tab text="medicine"></vue-tab>-->
    </vue-group-tab>


    默认选中第二个，底部100%：
    <vue-group-tab :selected="selected" @click="click" ref="tabGroup">
      <vue-tab :text="item.text" :classification="item.classification" :point="index == 0 ? true : false" v-for="(item,index) in data"></vue-tab>
    </vue-group-tab>

    <div>
      <button @click="tryThis">xxxx</button>
    </div>
  </div>
</template>
<script>
  import vueTab from '@/components/base/qwuiTab/tab.vue'
  import vueGroupTab from '@/components/base/qwuiTab/tab_group'
  export default {
    components:{
      vueTab,vueGroupTab
    },
    data(){
      return{
        selected:0,
        data:[
        ]
      }
    },
    created(){
      var self = this;
      setTimeout(function () {
        self.data = [
          {text:'just', classification:'我的'},
          {text:'like', classification:'我的'},
          {text:'this', classification:'他的'},
          {text:'you', classification:'他的'},
          {text:'are', classification:'我的'},
          {text:'favorite', classification:'我的'},
          {text:'medicine', classification:'我的'},
          {text:'朝', classification:'我的'},
          {text:'超人', classification:'我的'},
          {text:'不会', classification:'我的'},
          {text:'飞', classification:'我的'},
          {text:'明明', classification:'我的'},
          {text:'黑色', classification:'我的'},
        ];
      },1000);
    },
    methods:{
      click(val,text,index){
        if(this.data.length > 0){
          console.log(val,text,index)
        }
      },
      tryThis(){
        this.selected = 2
      }
    }
  }
</script>
