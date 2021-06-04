<template>
  <div class="tipInput">
    <content-input :type="type"
                   v-model="searchValue"
                   :placeholder="dealPlaceholder"
                   :selectList="selectList"
                   :maxCount="maxCount"
                   @search="dealSearch">
      <person-label v-for="(item, index) in selectList"
                    :key="index"
                    :src="item.icon"
                    :name="item.label"
                    :value="item.value"
                    @delete="dealDelete"
                    deleteIcon></person-label>
    </content-input>
    <tip-content class="tipContainer"
                 :optionList="optionList"
                 ref="tip"
                 @select="dealSelectItem"></tip-content>

  </div>
</template>

<script>
import ContentInput from "./contentInput";
import TipContent from "./tipContent";
import PersonLabel from "@/module/crm/components/qw-person-label/qw-person-label";
const EVENT_INPUT = "input";
const EVENT_SEARCH = "search";
export default {
  components: {
    ContentInput,
    TipContent,
    PersonLabel
  },
  props: {
    optionList: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    type: {
      type: String,
      default: "search"
    },
    placeholder: [String],
    maxCount: {
      type: Number,
      default: 1
    },
    defaultList: {
      type: Array
    }
  },
  data() {
    return {
      searchValue: "",
      selectList: [],
      dealPlaceholder: this.placeholder
    };
  },
  watch: {
    searchValue(newV) {
      this.$emit(EVENT_INPUT, newV);
    },
    defaultList(list) {
      this.selectList = JSON.parse(JSON.stringify(list));
    }
  },
  methods: {
    dealSelectItem(val) {
      this.selectList.push(val);
      this.searchValue = "";
      this.dealPlaceholder = "";
    },
    dealSearch() {
      this.$emit(EVENT_SEARCH, this.selectList);
    },
    dealDelete(deleteValue) {
      let deletedIndex;
      this.selectList.forEach((item, index) => {
        item["value"] === deleteValue;
        deletedIndex = index;
      });
      this.selectList.splice(deletedIndex, 1);
    },
    init() {
      this.searchValue = "";
      this.dealPlaceholder = this.placeholder;
      this.selectList = [];
    }
  }
};
</script>
<style lang='scss' scoped>
.tipInput {
  display: inline-block;
  position: relative;
  .tipContainer {
    position: absolute;
    top: 40px;
  }
}
</style>
