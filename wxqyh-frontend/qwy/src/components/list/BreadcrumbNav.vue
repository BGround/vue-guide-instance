<!-- 组件说明:
*      navigationArray： [{name, icon}]对象数组，name表示导航名称（必须项），icon表示导航图片(非必须,ps: 只要填图标名称就可以, 不需要前缀)，index表示导航层级
*      navigateTo:       function，导航跳转，点击导航栏时，返回所点击的数组对象---navArray[index]
*    示例:
*      <breadcrumbNav :navArray=""  @navigateTo=""></breadcrumbNav>
*      
-->
<template>
    <div class="breadcrumbNav">
        <div class="navigation inline-block"
            v-for="(navigation, index) in navArray" 
            :key="navigation.id"
            :class="{ pl20: navigation.icon }" 
            v-if="navShow(index)">
                <div class="ellipsis inline-block" v-if="showEllipsis(index)">...</div>
                <img class="img inline-block" :src="'@/assets/images/' + navigation.icon" v-if="navigation.icon && !showEllipsis(index)">
                <div class="navName ellipsis inline-block" 
                    :class="{ active: index == navArray.length - 1 }"
                    @click="navTo(index)"
                    v-if="!showEllipsis(index)">{{navigation.name}}</div><div class="cutting-line inline-block" v-if="navArray[index + 1]">/</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'breadcrumbNav',
    props: ['navArray'],
    methods: {
        navTo(index) {
            if( index == this.navArray.length - 1 ) {
                return 
            }
            this.navArray.splice(index + 1)
            this.$emit('navigateTo', this.navArray[index])
        },
        // 导航数组超过六条， 只显示第一条和最后四条，中间的省略
        navShow(index) {
            let len = this.navArray.length
            if(len > 6 && index > 1 && index < len - 4 ) {
                return false
            }
            return true
        },
        // 是否展示省略
        showEllipsis(index) {
            return this.navArray.length > 6 &&  index == 1
        }
    }
}
</script>

<style scoped>
    .navigation {
        position: relative;
    }
    .img {
        position: absolute;
        left: 0;
        top: 50%;
        width: 18px;
        height: 18px;
        transform: translateY(-50%);
    }
    .navName {
        color: #999999;
        max-width: 100px;
        cursor: pointer;
    }
    .navName:hover {
        color: #f87b00;
    }
    .navName.active:hover {
        color: #444;
    }
    .cutting-line {
        color: #999999;
        padding: 0 5px;
    }
    .inline-block {
        display: inline-block;
        vertical-align: bottom;
    }
    .active {
        color: #444;
        cursor: default;
    }
</style>
