<template>
    <div>Home</div>
    <TodoList />
    <!-- 评分星星测试用例 -->
    <!-- <Rate :value="scope"/> -->
    <!-- <Rate v-bind:value="scope" theme="red"> -->
    <Rate :value="scope" theme="orange" />
    <Rate v-bind:value="scope" theme="red" @update-rate="update" />
</template>

<script setup>
import TodoList from '../components/TodoList.vue'
import Rate from '../components/rate/Rate2.vue'
import {ref} from 'vue'

let scope = ref(4)

function update(num) {
    scope.value = num
}
</script>
