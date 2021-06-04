<template>
    <div class="approval-item" @click="handleClick">
      <div class="content">
        <p class="title">{{getInfo.title}}</p>
        <div class="desc">
          {{getInfo.personName}} | {{getInfo.summary}}
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
            }
        },
        data() {
            return {
                checked: this.value,
            }
        },
        computed:{
            getInfo(){
                return this.info
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
    display: flex;
    /*justify-content: center;*/
    background: #ffffff;
    align-items: center;
    padding: 10px 20px;
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
