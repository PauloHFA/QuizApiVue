<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'

const title = ref('Bem-vindo ao Gerador de Perguntas')
</script>

<template>
  <main>
    <h1>{{ title }}</h1>
    <HelloWorld msg="Crie e gerencie suas perguntas" />
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
}
</style> 