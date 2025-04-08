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
  const progress = computed(() => (currentQuestionIndex.value + 1) / questions.value.length * 100)

  async function fetchCategories() {
    try {
      if (categories.value.length > 0) return // Evita requisições desnecessárias
      
      loading.value = true
      error.value = null
      categories.value = await triviaService.getCategories()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar categorias'
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchQuestions(amount: number = 10, category?: number, difficulty?: string, type?: string) {
    try {
      // Validações
      if (amount < 1 || amount > 50) {
        throw new Error('O número de perguntas deve estar entre 1 e 50')
      }

      loading.value = true
      error.value = null
      const response = await triviaService.getQuestions(amount, category, difficulty, type)
      
      if (!response.results || response.results.length === 0) {
        throw new Error('Não foi possível carregar as perguntas. Por favor, tente novamente.')
      }

      questions.value = response.results
      currentQuestionIndex.value = 0
      score.value = 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar perguntas'
      questions.value = []
      throw err // Propaga o erro para tratamento no componente
    } finally {
      loading.value = false
    }
  }

  async function getSessionToken() {
    try {
      if (sessionToken.value) return // Evita requisições desnecessárias
      
      error.value = null
      sessionToken.value = await triviaService.getSessionToken()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao obter token de sessão'
      sessionToken.value = null
    }
  }

  async function resetSessionToken() {
    if (!sessionToken.value) return

    try {
      error.value = null
      await triviaService.resetSessionToken(sessionToken.value)
      sessionToken.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao resetar token de sessão'
    }
  }

  function answerQuestion(answer: string) {
    if (!currentQuestion.value) return
    
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
    progress,
    fetchCategories,
    fetchQuestions,
    getSessionToken,
    resetSessionToken,
    answerQuestion,
    resetQuiz
  }
}) 