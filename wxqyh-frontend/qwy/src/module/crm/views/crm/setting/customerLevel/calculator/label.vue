<template>
    <div :class="{ 'param-label': type == 'param', 'operators-label': type == 'operators'  }" >
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: "param"
        }
    }
}
</script>

<style lang="scss" scoped >
    .label{
        display: inline-block;
        border-radius: 4px;                        
        cursor: pointer;
    }   
    .param-label{
        @extend .label;     
        height: 34px;
        line-height: 34px;
        padding: 0px 21px;      
        font-size: 12px;       
        color: #F87B00;
        background-color: #FBEFE1;
    }
    .operators-label{
        @extend .label;
        width: 34px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        font-size: 22px;            
        color: #4784FF;
        background-color: #ebf0ff;
    }
</style>
