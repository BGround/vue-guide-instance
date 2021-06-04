<template>
    <div class="approval-item" @click="handleClick">
      <div v-if="isShowCheckbox" class="checkbox">
        <input type="checkbox" v-model="checked" @click.stop @change="handleChange" class="icon_check">
      </div>
      <div class="content">
        <p class="title">{{getInfo.title}}</p>
        <div class="desc">
          {{getInfo.publisher}} | {{getInfo.summary }}
        </div>
      </div>
    </div>
</template>

<script>
    import cherryCheckbox from "@/module/product/components/cherryCheckbox";
    export default {
        name: "approvalItem",
        filters:{
            formatDate(value){
                return value ? value.substring(0,10) : '-'
            }
        },
        components: {
            cherryCheckbox,
        },
        model:{
            event: 'change',
            prop: 'value',
        },
        props: {
            value: {
                type: Boolean,
                default(){
                    return false;
                }
            },
            info:{
                type: Object,
                default(){
                    return {};
                }
            },
            showCheckbox:{
                type: Boolean,
                default(){
                    return false;
                }
            }
        },
        data() {
            return {
                checked: this.value,
                isShowCheckbox: this.showCheckbox,
            }
        },
        computed:{
            getInfo(){
                return this.info
            }
        },
        watch:{
            showCheckbox(value){
                this.isShowCheckbox = value
            }
        },
        methods: {
            handleChange(){
                this.$emit('change', this.checked);
            },

            handleClick(){
                this.$emit('click', this.getInfo)
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
  .approval-item{
    height: 70px;
    display: flex;
    /*justify-content: center;*/
    background: #ffffff;
    align-items: center;
    padding: 0 20px;
    position: relative;

    &:after{
      content: " ";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background: #ddd;
      transform: scaleY(0.5)
    }

    &:before{
      content: " ";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background: #ddd;
      transform: scaleY(0.5)
    }

    .checkbox{
      width: 36px;
      display: flex;
      justify-content: center;
    }
    .title{
      font-size: 16px;
      max-width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc{
      color: #aaaaaa;
    }
  }
  .approval-item{

  }
</style>
