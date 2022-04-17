<template>
    <div>
        <h1 @click="add">{{count}}</h1>
        <input type="text" v-model="title" @keydown.enter="addTodo" />
        <ul v-if="todos.length">
            <li v-for="todo in todos">
                <input type="checkbox" v-model="todo.done" />
                <span :class="{done: todo.done}"> {{ todo.title }} </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
let count = ref(1)
let color = ref('red')
let title = ref('')
let todos = ref([{title: 'vue3', done: false}])

function add() {
    count.value++
    color.value = Math.random() > 0.5 ? 'blue' : 'red'
}
function addTodo() {
    todos.value.push({
        title: title.value,
        done: false
    })
    title.value = ""
}

</script>

<style scoped>
    ul {
        list-style: none;
    }
    h1 {
        color: v-bind(color);
    }
</style>




