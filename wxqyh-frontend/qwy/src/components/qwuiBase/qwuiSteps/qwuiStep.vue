/** 
  * @param title(默认:'')：步骤文字
  * @param content(默认:'')：步骤主要内容
  * @exmple 
  *     <parent>
  *         <qwui-step title="重置密码">
  *            <div slot="content">
  *              <h1>123</h1>
  *              <div>
  *                <p>456</p>
  *                <p>789</p>
  *              </div>
  *            </div>
  *          </qwui-step>
  *          <qwui-step title="重置密码" content="阿UI博文旧版"></qwui-step>
  *     </parent> 
  */
<template>
    <div 
        class="qwui-step"
        :class="{center:isCenter && !(direction === 'vertical')}"
    >
        <div class="qwui-step_head">
            <div class="qwui-step_iconWrap">
                <slot name="icon">
                    <div 
                        class="qwui-step_defaultIcon"
                        :class="{active: activeIdx >= index}"
                    >{{index + 1}}</div>
                </slot>
            </div>
            <div 
                v-if="direction === 'vertical'"
                class="qwui-step_line_vertical"
                :class="{
                            active: activeIdx > index,
                            dash: isDash
                        }"
            ></div>
            <div 
                v-else
                class="qwui-step_line"
                :class="{
                            active: activeIdx > index,
                            dash: isDash
                        }"
            ></div>
        </div>
        <div class="qwui-step_main">
            <div 
                class="qwui-step_title"
                :class="{active: activeIdx >= index}"
            >
                {{title}}
            </div>
            <div class="qwui-step_content">
                <slot name="content">{{content}}</slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'qwui-step',
    props: {
        // 步骤文字
        title: {
            type: String,
            default: ''
        },

        // 主要内容
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            index: -1
        }
    },
    computed: {
        // 是否居中
        isCenter () {
            return this.$parent.isCenter;
        },

        // 当前到达的步骤idx
        activeIdx () {
            return this.$parent.active;
        },

        // 步骤条方向
        direction () {
            return this.$parent.direction;
        },

        // 连接线是否虚线
        isDash () {
            return this.$parent.isDash;
        }
    },
    beforeCreate() {
        // 将当前步骤加入步骤数组
        this.$parent.steps.push(this);
    }
}
</script>
<style lang="scss">

</style>


