<template>
    <div>
        <h1>你的评分是{{props.value}}</h1>
        {{rate}}
    </div>
</template>

<script setup>
import { defineProps, computed} from 'vue'

let props = defineProps({
    value: Number
})
let rate = computed(() => {
    return "★★★★★☆☆☆☆☆".slice(5 - props.value, 10 - props.value)
}
    
) 
</script>
