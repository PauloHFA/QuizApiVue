<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuizStore } from '../stores/quizStore'
import type { Category } from '../services/triviaService'

const quizStore = useQuizStore()
const selectedCategory = ref<number | undefined>()
const selectedDifficulty = ref<string | undefined>()
const selectedType = ref<string | undefined>()
const amount = ref(10)
const showMenu = ref(true)
const showResultsModal = ref(false)
const lastAnswer = ref<string | null>(null)

const difficulties = ['easy', 'medium', 'hard']
const types = ['multiple', 'boolean']

onMounted(async () => {
  await quizStore.fetchCategories()
})

async function startQuiz() {
  showMenu.value = false
  showResultsModal.value = false
  lastAnswer.value = null
  await quizStore.fetchQuestions(
    amount.value,
    selectedCategory.value,
    selectedDifficulty.value,
    selectedType.value
  )
}

function handleAnswer(answer: string) {
  if (quizStore.isLastQuestion) {
    lastAnswer.value = answer
    if (answer === quizStore.currentQuestion?.correct_answer) {
      quizStore.score++
    }
    showResultsModal.value = true
  } else {
    quizStore.answerQuestion(answer)
  }
}

function resetToMenu() {
  quizStore.resetQuiz()
  showMenu.value = true
  showResultsModal.value = false
  lastAnswer.value = null
}

function restartQuiz() {
  quizStore.resetQuiz()
  showResultsModal.value = false
  lastAnswer.value = null
  startQuiz()
}

function calculateScore() {
  const percentage = (quizStore.score / quizStore.totalQuestions) * 100
  if (percentage >= 80) return 'Excelente!'
  if (percentage >= 60) return 'Bom!'
  if (percentage >= 40) return 'Razoável'
  return 'Pode melhorar'
}
</script>

<template>
  <div class="quiz-container">
    <div v-if="showMenu" class="quiz-setup">
      <h2>Configurar Quiz</h2>
      
      <div class="form-group">
        <label for="amount">Número de Perguntas:</label>
        <input
          id="amount"
          v-model="amount"
          type="number"
          min="1"
          max="50"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="category">Categoria:</label>
        <select id="category" v-model="selectedCategory" class="form-control">
          <option :value="undefined">Qualquer Categoria</option>
          <option
            v-for="category in quizStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="difficulty">Dificuldade:</label>
        <select id="difficulty" v-model="selectedDifficulty" class="form-control">
          <option :value="undefined">Qualquer Dificuldade</option>
          <option v-for="diff in difficulties" :key="diff" :value="diff">
            {{ diff }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="type">Tipo:</label>
        <select id="type" v-model="selectedType" class="form-control">
          <option :value="undefined">Qualquer Tipo</option>
          <option v-for="type in types" :key="type" :value="type">
            {{ type === 'multiple' ? 'Múltipla Escolha' : 'Verdadeiro/Falso' }}
          </option>
        </select>
      </div>

      <button @click="startQuiz" class="start-button" :disabled="quizStore.loading">
        {{ quizStore.loading ? 'Carregando...' : 'Iniciar Quiz' }}
      </button>
    </div>

    <div v-else class="quiz-content">
      <div v-if="quizStore.currentQuestion" class="question-container">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${((quizStore.currentQuestionIndex + 1) / quizStore.totalQuestions) * 100}%` }"
          ></div>
        </div>
        
        <div class="question-header">
          <span class="question-number">Pergunta {{ quizStore.currentQuestionIndex + 1 }} de {{ quizStore.totalQuestions }}</span>
          <span class="score">Pontuação: {{ quizStore.score }}</span>
        </div>

        <h2 class="question-text" v-html="quizStore.currentQuestion.question"></h2>
        
        <div class="answers">
          <button
            v-for="(answer, index) in [
              ...quizStore.currentQuestion.incorrect_answers,
              quizStore.currentQuestion.correct_answer
            ].sort(() => Math.random() - 0.5)"
            :key="index"
            @click="handleAnswer(answer)"
            class="answer-button"
            :class="{
              'correct-answer': quizStore.isLastQuestion && answer === quizStore.currentQuestion.correct_answer,
              'incorrect-answer': quizStore.isLastQuestion && lastAnswer === answer && answer !== quizStore.currentQuestion.correct_answer
            }"
            v-html="answer"
          ></button>
        </div>
      </div>
    </div>

    <!-- Modal de Resultados -->
    <div v-if="showResultsModal" class="modal-overlay" @click.self="showResultsModal = false">
      <div class="modal-content">
        <h2>Quiz Concluído!</h2>
        <div class="score-display">
          <div class="score-circle">
            <span class="score-percentage">{{ Math.round((quizStore.score / quizStore.totalQuestions) * 100) }}%</span>
            <span class="score-text">{{ calculateScore() }}</span>
          </div>
          <p class="score-details">Você acertou {{ quizStore.score }} de {{ quizStore.totalQuestions }} perguntas</p>
        </div>
        <div class="result-actions">
          <button @click="resetToMenu" class="menu-button">
            <span class="button-icon">🏠</span>
            <span>Voltar ao Menu</span>
          </button>
          <button @click="restartQuiz" class="restart-button">
            <span class="button-icon">🔄</span>
            <span>Jogar Novamente</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="quizStore.error" class="error-message">
      {{ quizStore.error }}
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-setup {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(107, 33, 168, 0.2);
}

.start-button,
.restart-button,
.menu-button {
  background: var(--color-primary);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.start-button:hover,
.restart-button:hover,
.menu-button:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
}

.start-button:disabled {
  background: var(--color-surface);
  cursor: not-allowed;
  transform: none;
}

.question-container {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 6px;
  background: var(--color-background);
  border-radius: 3px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  color: var(--color-text-secondary);
}

.question-text {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.answers {
  display: grid;
  gap: 1rem;
}

.answer-button {
  background: var(--color-background);
  border: 2px solid var(--color-accent);
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  color: var(--color-text);
  font-size: 1.1rem;
}

.answer-button:hover {
  background: var(--color-accent);
  transform: translateX(5px);
}

.quiz-results {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: var(--color-background);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 4px solid var(--color-primary);
}

.score-percentage {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-primary);
}

.score-text {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
}

.score-details {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--color-text-secondary);
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.menu-button {
  background: var(--color-surface);
  border: 2px solid var(--color-primary);
}

.error-message {
  color: var(--color-error);
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: var(--color-surface);
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  animation: scaleIn 0.3s ease-out;
}

.correct-answer {
  background: var(--color-success) !important;
  color: white !important;
  border-color: var(--color-success) !important;
}

.incorrect-answer {
  background: var(--color-error) !important;
  color: white !important;
  border-color: var(--color-error) !important;
}

.answer-button {
  transition: all 0.3s ease;
}

.answer-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style> 