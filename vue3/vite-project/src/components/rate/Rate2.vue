<template>
    <div :style="fontstyle">
        <h1>你的评分是{{props.value}}</h1>
        <div class="rate" @mouseout="mouseOut">
            <span @mouseover="mouseOver(num)" v-for="num in 5" :key="num">☆</span> <!-- 这里不能换行显示 -->
            <span class="hollow" :style="fontwidth">
                <span @click="onRate(num)" @mouseover="mouseOver(num)" v-for="num in 5" :key="num">★</span> <!-- 这里不能换行显示 -->
            </span>
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref} from 'vue'

let props = defineProps({
    value: Number,
    theme: {type: String, defaule: 'blue'}
})

const themeObj = {  
    'black': '#00',  
    'white': '#fff',  
    'red': '#f5222d',  
    'orange': '#fa541c',  
    'yellow': '#fadb14',  
    'green': '#73d13d',  
    'blue': '#40a9ff'
}

let width = ref(props.value)

function mouseOut() {
    width.value = props.value
}

function mouseOver(i) {
    width.value = i
}

const fontwidth = computed(() => `width: ${width.value}em`)

let fontstyle = computed(() => {
    return `color: ${themeObj[props.theme]}`;
})

let emits = defineEmits(["update-rate"])
function onRate(i) {
    emits("update-rate", i)
}

</script>

<style scoped>
.rate {
  position: relative;
  display: inline-block;
}
.rate > span.hollow {
  position: absolute;
  display: inline-block;
  top: 0;
  left: 0;
  width: 0;
  overflow: hidden;
}
</style>