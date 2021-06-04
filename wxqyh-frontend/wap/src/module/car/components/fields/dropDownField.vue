<template>
  <div class="field-content" v-if="field.status != '0'">
    <div class="drop-down flex">
      <span class="title ellipsis">{{field.optionName}}
        <span v-if="field.isMust && (field.isMust == '1' || field.isMust == '3') && !readonly" class="qwui-required_mark">*</span>
      </span>
      <input v-if="!readonly" type="text" class="text-field"
             readonly unselectable="on" onfocus="this.blur()"
             v-model="selectedValue"
             :id="'field-'+field.id"
             :placeholder="newPlaceholder"
             @click="setPopup(true)">
      <div class="text-field" v-if="readonly">{{value}}</div>
      <span class="drop-down-icon" v-if="!readonly" @click="setPopup(true)"></span>
    </div>
    <div class="bg-popop-list" v-if="showPopup" @click="setPopup(false)">
      <popupList
        @listenShow="setPopup"
        @getItem="setValue"
        :field="field"
        :currentIndex.sync="currentIndex"></popupList>
    </div>

  </div>
</template>
<script>
  import popupList from './popupList.vue'
  export default {
    name: 'dropDownField',
    props: {
      field: {
        type: Object,
        required: true
      },
      value: {
        type: String,
        default: ''
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      maxLength:{
        type: Number,
        default: 15
      }
    },
    components: {
      popupList,
    },
    data() {
      return {
        showPopup:false,
        currentIndex: -1,
        newPlaceholder: '',
        selectedValue: ''
      }
    },
    mounted() {
      this.selectedValue = this.value
      if(this.placeholder) {
        this.newPlaceholder = this.placeholder
      }
    },
    updated() {
      if(this.field.list) { //初始化有值的时候点选
        this.field.list.forEach((item, index) => {
          if(item.name === this.selectedValue) {
            this.currentIndex = index
            return false
          }
        });
      }
    },
    methods: {
      setPopup(value){
        if(this.readonly) return
        this.showPopup = value
      },
      setValue(item){
        let key = this.field.itemId
        let value = item.name
        this.selectedValue = value ? value : ' ' //初始选项值为空时传空字符串
        this.$emit('change', {key, value}, item.id)
      },
      changeIndex(index) {
        this.currentIndex = index
      }
    },
    watch: {
      value: function(newVal) {
        this.selectedValue = newVal
        if(this.field.list) { //初始化有值的时候点选
          this.field.list.forEach((item, index) => {
            if(item.name === newVal) {
              this.currentIndex = index
              return false
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
     .bg-popop-list {
       width: 740px;
       margin: 0 auto;
     }
   }
  .field-content {
    width: 100%;
    padding: 12px 0;
  }
  .flex {
    display: flex;
  }
  .field-content .text-field {
    flex: 1;
    width: 100%;
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #0A1735;
    background: #fff;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .field-content .title {
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
    margin-right: 20px;
    max-width: 120px;
  }
  input.text-field, .drop-down-icon {
    cursor: pointer;
  }
  .bg-popop-list {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .2);
    z-index: 11;
  }
  .drop-down .drop-down-icon {
    float: right;
    margin-top: 2px;
    width: 16px;
    height: 16px;
    background:url(~assets/images/car/icon-a-public_arrow-right.png) no-repeat center;
    background-size: 100%;
  }
  /*input.placeholder颜色*/
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #D2D5DB;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D2D5DB;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D2D5DB;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #D2D5DB;
  }
  /*修改placeholder颜色*/
  .error-tip::-webkit-input-placeholder{
    color: #FF586D;
  }
  .error-tip::-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-ms-input-placeholder{
    color: #FF586D;
  }
</style>
