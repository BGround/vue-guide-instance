<template>
    <div :style="fontstyle">
        <h1>你的评分是{{props.value}}</h1>
        {{rate}}
    </div>
</template>

<script setup>
import { defineProps, computed} from 'vue'

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

let rate = computed(() => 
    "★★★★★☆☆☆☆☆".slice(5 - props.value, 10 - props.value)
)

let fontstyle = computed(() => {
    return `color: ${themeObj[props.theme]}`;
})

</script>
