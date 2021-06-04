<template>
  <div class="search-header">
    <div class="header">
      <div class="header__scope" @click="handleClickScopeSelector">
        <span>{{scopeName}}</span>
        <img :src="iconArrowDown">
      </div>
      <div class="header__search">
        <qw-search-bar 
          ref="search-bar" 
          v-model="keywordVal" 
          @focus="handleFocus" 
          :placeholder="placeholder" 
          @change="handleChangeSearch" 
          clearable>
        </qw-search-bar>
      </div>
    </div>

</div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import {searchDepatmentList} from '@/module/channelManagement/api/getData';
import regionpicker from './regionpicker'

export default {
  components:{
    'qw-search-bar': window.QUICKWORK.SearchBar,
    'qw-cascade-picker': window.QUICKWORK.CascadePicker,
    regionpicker
  },
  name: 'SearchHeaer',
  props:{
    region: {
      type: String,
      default(){
        return '全国'
      }
    },
    keyword:{
       type: String,
      default(){
        return ''
      }
    },
    placeholder:{
      type: String,
      default(){
        return '请输入'
      }
    }
  },
  data(){
    return{
      iconArrowDown,
      addressData:[],
      scopeName: '',
      keywordVal: '',
    }
  },
  created(){
    this.scopeName = this.region;
    this.keywordVal = this.keyword;
  },
  watch:{
    region(value){
      this.scopeName = value;
    },
    keyword(value){
      this.keywordVal = value;
    },
    keywordVal(value){
      this.$emit('change', this.keywordVal);
    }
  },

  methods:{

    focus(){
      this.$refs['search-bar'].focus();
    },

    handleFocus(){
      this.$emit('focus');
    },

    handleClickScopeSelector(){
      this.$emit('pick');
    },

    handleChangeSearch(){
      // this.$emit('change', this.keywordVal);
    },

  },

}
</script>

<style lang="scss" scoped>
  
  .search-header{
    .header{
      display: flex;
      padding: 12px;
      background: #fff;
    }

    .header__scope{
      height:28px;
      font-size:16px;
      font-weight:500;
      line-height:28px;
      color:rgba(51,51,51,1);
      // width: 68px;
      flex-shrink: 0;
    }

    .header__search{
      width: 100%;
      height: 28px;
      /deep/{
        .qw-search-bar{
          height: 28px;
        }
        .qw-search-bar__prefix,
        .qw-search-bar__input{
          height: 28px;
          line-height: 28px;
        }
        .qw-search-bar__icon.qw-icon-search{
          line-height: 28px;
        }
        .qw-search-bar__clear{
          padding: 5px 8px;
        }
      }
    }

    .header__scope >span{
      max-width: 50px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .header__scope >img{
      width: 12px;
      height: 8px;
      vertical-align: top;
      margin: 10px 10px 10px 4px;
    }
  }

</style>