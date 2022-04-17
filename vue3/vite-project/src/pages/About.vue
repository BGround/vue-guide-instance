<template>
  <div>
    <h1>About</h1>
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
import {ref, computed, watchEffect} from 'vue'
let title = ref('')
console.log(localStorage.getItem('todos'))
console.log(JSON.parse(localStorage.getItem('todos')))
let todos = ref(JSON.parse(localStorage.getItem('todos') || '[]'))

watchEffect(() => {
  console.log(todos.value)
  localStorage.setItem('todos', JSON.stringify(todos.value))
  console.log('todos 值有变化')
})

function addTodo() {
  todos.value.push({
    title: title.value,
    done: false
  })
  title.value = ""
}



</script>

<style>
  ul {
    list-style: none;
  }

</style>