<template>
  <div class="field-content" ref="checkBoxDrop">
    <div class="drop-down" @click="setPopup(true, $event)"
         :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}">
      <span
        class="drop-down-label">{{map[field.value]?map[field.value]:(field.readonly || field.disabled)?'':'请选择'}}</span>
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
  import {setFieldShowHide} from 'vpModule/js/form/getData'
  import choiceList from './choiceList.vue'

  export default {
    props: ['field'],
    components: {
      choiceList
    },
    data() {
      return {
        showPopup: false,
        map: {},
        width: "auto"
      }
    },
    computed: {
      selectQuota() {
        return this.$store.state.formBase.selectQuota || {};
      },
      isMobile() {
        return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
      }
    },
    created() {
      this.field.choices.forEach(item => {
        if (this.notChoice(item)) {
          this.field.value = '';
        }
        this.map[item._id] = item.value;
      });
    },
    mounted() {
      if (this.field.show) {
        this.setRelate(this.field.value);
      }
    },
    methods: {
      //选项名额已空
      notChoice(item) {
        return this.selectQuota[item._id] && this.selectQuota[item._id].selectedNum >= item.quota
      },
      setPopup(value, e) {
        if (this.field.disabled || this.field.readonly) return;
        if (value) {
          var drop = this.$refs.checkBoxDrop,
            height = drop.offsetHeight,
            listHeight = this.field.choices.length * 32 > 200 ? 200 : this.field.choices.length * 32,
            winHeight = document.documentElement.clientHeight || document.documentElement.clientHeight,
            searchHeight = this.field.choices.length >= 20 ? 56 : 0;
          this.width = drop.offsetWidth + 'px';
          if (winHeight - e.y < height + listHeight) {
            this.$refs.choiceList.style.marginTop = -(listHeight + height + 8 + searchHeight) + 'px';
          } else {
            this.$refs.choiceList.style.marginTop = "0px"
          }
        }
        this.showPopup = value;
      },
      setValue(value) {
        var key = this.field._id;
        this.$emit('change', {key, value})
        this.setRelate(value);
        field_validation(this.field);
      },
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
            if (item._id != val) {
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
</style>
