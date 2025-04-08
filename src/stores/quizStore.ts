import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { triviaService, type Question, type Category } from '../services/triviaService'

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref<Question[]>([])
  const categories = ref<Category[]>([])
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sessionToken = ref<string | null>(null)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
  const totalQuestions = computed(() => questions.value.length)

  async function fetchCategories() {
    try {
      loading.value = true
      categories.value = await triviaService.getCategories()
    } catch (err) {
      error.value = 'Erro ao carregar categorias'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuestions(amount: number = 10, category?: number, difficulty?: string, type?: string) {
    try {
      loading.value = true
      const response = await triviaService.getQuestions(amount, category, difficulty, type)
      questions.value = response.results
      currentQuestionIndex.value = 0
      score.value = 0
    } catch (err) {
      error.value = 'Erro ao carregar perguntas'
    } finally {
      loading.value = false
    }
  }

  async function getSessionToken() {
    try {
      sessionToken.value = await triviaService.getSessionToken()
    } catch (err) {
      error.value = 'Erro ao obter token de sessão'
    }
  }

  async function resetSessionToken() {
    if (sessionToken.value) {
      try {
        await triviaService.resetSessionToken(sessionToken.value)
        sessionToken.value = null
      } catch (err) {
        error.value = 'Erro ao resetar token de sessão'
      }
    }
  }

  function answerQuestion(answer: string) {
    if (currentQuestion.value.correct_answer === answer) {
      score.value++
    }
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++
    }
  }

  function resetQuiz() {
    questions.value = []
    currentQuestionIndex.value = 0
    score.value = 0
    error.value = null
  }

  return {
    questions,
    categories,
    currentQuestion,
    currentQuestionIndex,
    score,
    loading,
    error,
    sessionToken,
    isLastQuestion,
    totalQuestions,
    fetchCategories,
    fetchQuestions,
    getSessionToken,
    resetSessionToken,
    answerQuestion,
    resetQuiz
  }
}) 