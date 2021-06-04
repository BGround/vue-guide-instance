<template>
  <div class="group-item">
    <i class="homeicon" 
      :style="[listItem.picPath ? {color: JSON.parse(listItem.picPath).color} : {color: '#5f9ff3'}]" 
      :class="[listItem.picPath ? 'bd-b-' + JSON.parse(listItem.picPath).icon : 'bd-b-chucha']">
    </i>
    <h3 class="item-title">{{listItem.typeName}}</h3>
    <i class="icon-go"></i>
  </div>
</template>

<script>
export default {
  props: {
    listItem: {
      type: Object,
      default: {}
    },
    showInfoFrame: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    };
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../../assets/images/';
.group-item {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  padding: 14px 56px 14px 14px;
  box-sizing: border-box;
  background: #fff;
  .homeicon {
    display: block;
    font-size: 24px;
    margin-right: 12px;
  }
  .item-title {
    flex: 1;
    height:22px;
    font-size:16px;
    font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
    font-weight:400;
    color:rgba(10,23,53,1);
    line-height:22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .icon-go {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 14px;
    margin: auto;
    background-image: url($baseURL + 'icon_a-common_arrowright@2x.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
}
</style>