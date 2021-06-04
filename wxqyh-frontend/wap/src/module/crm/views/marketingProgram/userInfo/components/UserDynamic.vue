<template>
  <div class="user-dynamic_container">
    <div class="user-dynamic_block"
         v-for="(item,index) in list"
         :key="index">
      <div class="user-dynamic_date">{{ item.time }}</div>
      <div class="user-dynamic_item"
           v-for="(_item,_index) in item.dynamicsList"
           :key="_index">
        <img class="user-dynamic_type"
             v-if="_item.dynamicsType === '0'"
             src="~assets/images/icon_business_check.svg" />
        <img class="user-dynamic_type"
             v-if="_item.dynamicsType === '1'"
             src="~assets/images/icon_business_transmit.svg" />
        <img class="user-dynamic_type"
             v-if="_item.dynamicsType === '2'"
             src="~assets/images/icon_business_zang.svg" />
        <img class="user-dynamic_type"
             v-if="_item.dynamicsType === '3'"
             src="~assets/images/icon_business_save.svg" />
        <div class="user-dynamic_content">
          <div class="user-dynamic_text">{{ _item.description }}</div>
          <div class="user-dynamic_time">{{ _item.createTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.user-dynamic_container {
  width: 100%;
  height: 100%;
  padding: 0 14px;
  box-sizing: border-box;
}

.user-dynamic_block {
  margin-bottom: 36px;
}

.user-dynamic_date {
  font-size: 14px;
  color: #85868f;
  line-height: 20px;
  margin: 12px 0;
}

.user-dynamic_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
}

.user-dynamic_type {
  width: 32px;
  height: 32px;
  margin-right: 11px;
}

.user-dynamic_content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-dynamic_text {
  display: inline-block;
  font-size: 15px;
  color: #343434;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  line-height: 15px;
  margin-top: 1px;
}

.user-dynamic_time {
  font-size: 12px;
  color: #b2b9c8;
  line-height: 12px;
  margin-top: 4px;
}
</style>
