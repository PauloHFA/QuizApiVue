<script setup lang="ts">
import { ref } from 'vue'

const description = ref('Esta é uma aplicação para criar e gerenciar perguntas de forma simples e eficiente.')
</script>

<template>
  <div class="about">
    <h1>Sobre o Projeto</h1>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--color-text);
}
</style> 