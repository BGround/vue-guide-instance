<template>
  <div class="field-content" ref="checkBoxDrop">
    <div class="drop-down" @click="setPopup(true, $event)"
         :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}">
      <span
        class="drop-down-label">{{choiceVal(field.value)}}</span>
      <span class="drop-down-icon"></span>
    </div>
    <div class="choice-list-pc" ref="choiceList">
      <choiceList v-if="showPopup && !isMobile"
                  v-on:listenShow="setPopup()"
                  v-on:getItem="setValue"
                  :selectQuota="selectQuota"
                  :field="field"
                  :width="width"
                  :showSearch="field.choices.length >= 20 "
      ></choiceList>
    </div>


  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  import {setFieldShowHide} from  'vpModule/js/form/getData.js'
  import choiceList from './choiceList.vue'

  export default {
    name: 'CheckBoxDropField',
    props: ['field', 'isChildField'],
    components: {
      choiceList
    },
    data() {
      return {
        showPopup: false,
        map: {},
        width: "auto",
      }
    },
    created() {
      this.field.value = this.field.value || []
      this.field.choices.forEach(choice => {
        this.map[choice._id] = choice.value
        if (this.selectQuota[choice._id] && this.selectQuota[choice._id].selectedNum >= choice.quota) {
          if (this.field.value.indexOf(choice._id) != -1) {
            this.field.value.splice(this.field.value.indexOf(choice._id), 1);
          }
        }
      })
    },
    mounted() {
      if (this.field.show) {
        this.setRelate(this.field.value);
      }
    },
    computed: {
      selectQuota() {
        return this.$store.state.formBase.selectQuota || {};
      },
      fieldVal() {
        return this.field.value || [];
      },
      isMobile() {
        return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
      }
    },
    methods: {
      setPopup(value, e) {
        if (this.field.disabled || this.field.readonly) return;
        if (value) {
          var drop = this.$refs.checkBoxDrop,
            height = drop.offsetHeight,
            listHeight = this.field.choices.length * 32 > 200 ? 200 : this.field.choices.length * 32,
            winHeight = document.documentElement.clientHeight || document.documentElement.clientHeight,
            searchHeight = this.field.choices.length >= 20 ? 56 : 0;
          this.width = drop.offsetWidth + 'px';
          if (winHeight - e.y < height + listHeight + 32) {
            this.$refs.choiceList.style.marginTop = -(listHeight + height + 40 + searchHeight) + 'px';
          } else {
            this.$refs.choiceList.style.marginTop = "0px"
          }
        }
        this.showPopup = value;
      },
      choiceVal(arr) {
        if (!Array.isArray(arr) || !arr.length) return '请选择';
        var choiceVal = [];
        arr.forEach(key => {
          choiceVal.push(this.map[key]);
        })
        return choiceVal.join(',')
      },
      setValue(value) {
        var key = this.field._id;
        this.$emit('change', {key, value})
        this.setRelate(value);
        field_validation(this.field);
      }
      ,
      setRelate(val) {
        //判断是否是显示逻辑字段,如果是显示逻辑设置的字段
        var relateMatch = this.$store.state.formBase.relateMatch;
        var relateMap = this.$store.state.formBase.relateMap;
        var relateAllMap = this.$store.state.formBase.relateAllMap;
        var formData = this.$store.state.formBase.data;
        var schema = this.$store.state.formBase.schema;
        if (relateMatch.indexOf(this.field._id) != -1) {
          //显示和隐藏字段,通过choices获取显示字段
          var showArry = [];
          var hideArry = [];
          this.field.choices.forEach(function (item) {
            var relateIds = item.relate_show_ids || [];
            if (val.indexOf(item._id) == -1) {
              relateIds.forEach(function (i) {
                hideArry.push(i);
                relateMap[i] && hideArry.push(relateMap[i])
              })
            }
          });
          //所有可显示的字段
          schema.forEach(field => {
            //字段在hideArry 或 不显示字段 或 不是逻辑字段
            if (hideArry.includes(field._id) || !field.show || !relateMatch.includes(field._id)) return;
            //多选是数组
            if (Array.isArray(field.value)) {
              field.value.forEach(item => {
                relateAllMap[item] && showArry.push(...relateAllMap[item])
              })
              //单选/下拉 是String
            } else {
              relateAllMap[field.value] && showArry.push(...relateAllMap[field.value]);
            }
          })
          var obj = {};

          function showRecursion(arry) {
            if (!arry) return;
            var newArry = [];
            arry.forEach(function (item) {
              newArry.push(item);
            });
            for (var key in relateMap) {
              if (arry.indexOf(key) != -1) {
                //显示的值有数据
                var selectValue = formData[key];
                if (selectValue && typeof selectValue == 'string') {
                  newArry = newArry.concat(showRecursion(relateAllMap[selectValue]))
                } else if (selectValue instanceof Array && selectValue.length) {
                  selectValue.forEach(function (i) {
                    newArry = newArry.concat(showRecursion(relateAllMap[i]))
                  })
                }

              }
            }
            return newArry;
          }

          function hideRecursion(arry) {
            if (!arry) return;
            var newArry = [];
            arry.forEach(function (item) {
              newArry.push(item);
            });
            for (var key in relateMap) {
              if (arry.indexOf(key) != -1) {
                newArry = newArry.concat(hideRecursion(relateMap[key]))
              }
            }
            return newArry;
          }

          //隐藏字段
          var newHideArry = hideRecursion(hideArry);
          newHideArry.forEach(function (i) {
            obj[i] = false;
          });
          //显示字段
          var newShowArry = showRecursion(showArry);
          newShowArry.forEach(function (i) {
            obj[i] = true;
          });
          setFieldShowHide(this.$store, obj);
        }
      }
    }
  }
</script>
<style scoped>
  .choice-list-pc {
    position: absolute;
  }

  select {
    background: #fff;
    font-family: -apple-system-font, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  }
</style>
