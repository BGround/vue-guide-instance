<template>
  <div>
    <div class="clearfix mt20 mb10 navigation-box">
      <ul class="property" @click="belongChange">
        <!--<li :class="{'active': searchValue == undefined || searchValue == ''}"-->
            <!--:data-value="''">全部</li>-->
        <li v-if="title">{{title}}</li>
        <li v-for="item in currBelong"
            :key="item.value"
            :class="{'active': searchValue == item.value}"
            :data-value="item.value"
            @click="choseStatus(item)">{{item.text}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'searchHeadBar',
    props:{
      currBelong: {
        type: Array,
        required: true
      },
      title:{
        type: String,
        default:''
      },
      searchValue:{
        type: String,
        default:''
      }
    },
    data() {
      return {
//        searchValue:'',

    }
    },
    methods: {
      belongChange(e){
        console.log(e);
      },
      choseStatus(item){
//        this.searchValue = item.value;
        this.$emit('chose',item);
      },
    }
  }
</script>
<style scoped>
  .navigation-box {
    line-height: 22px;
  }
  .property li {
    float: left;
    padding-right: 15px;
    cursor: pointer;
  }
  .property li:hover, .property li.active {
    color: #F87B00;
  }
</style>
