<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const description = ref('Quiz Perguntas é uma aplicação interativa que utiliza a Open Trivia Database para criar quizzes personalizados. Escolha entre diferentes categorias, níveis de dificuldade e tipos de perguntas para testar seus conhecimentos.')

const features = ref([
  'Perguntas de múltipla escolha e verdadeiro/falso',
  'Diversas categorias de conhecimento',
  'Diferentes níveis de dificuldade',
  'Pontuação em tempo real',
  'Interface intuitiva e responsiva',
  'Feedback imediato das respostas'
])

function goToQuiz() {
  router.push('/')
}
</script>

<template>
  <div class="about">
    <h1>Sobre o Quiz Perguntas</h1>
    <p class="description">{{ description }}</p>
    
    <div class="features">
      <h2>Funcionalidades</h2>
      <ul>
        <li v-for="(feature, index) in features" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>

    <div class="credits">
      <h2>Créditos</h2>
      <p>Este projeto utiliza a <a href="https://opentdb.com" target="_blank" rel="noopener">Open Trivia Database</a> como fonte de perguntas.</p>
    </div>

    <button @click="goToQuiz" class="back-button">
      Voltar ao Quiz
    </button>
  </div>
</template>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin: 2rem 0 1rem;
  color: var(--color-heading);
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--color-text);
  text-align: justify;
}

.features {
  margin: 2rem 0;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
  color: var(--color-text);
  display: flex;
  align-items: center;
}

.features li::before {
  content: '✓';
  color: var(--color-success);
  margin-right: 0.5rem;
  font-weight: bold;
}

.credits {
  margin: 2rem 0;
  padding: 1rem;
  background: var(--color-background);
  border-radius: 8px;
}

.credits a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.credits a:hover {
  text-decoration: underline;
}

.back-button {
  display: block;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}
</style> 