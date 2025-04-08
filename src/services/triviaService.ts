import axios from 'axios'

const BASE_URL = 'https://opentdb.com'
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 5000 // 5 segundos entre requisições

// Função para garantir o intervalo mínimo entre requisições
async function waitForRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

export interface Question {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface Category {
  id: number
  name: string
}

export interface TriviaResponse {
  response_code: number
  results: Question[]
}

export interface CategoryCount {
  total_question_count: number
  total_easy_question_count: number
  total_medium_question_count: number
  total_hard_question_count: number
}

export const triviaService = {
  async getQuestions(amount: number = 10, category?: number, difficulty?: string, type?: string) {
    try {
      await waitForRateLimit()
      const params = new URLSearchParams()
      params.append('amount', amount.toString())
      if (category) params.append('category', category.toString())
      if (difficulty) params.append('difficulty', difficulty)
      if (type) params.append('type', type)

      const response = await axios.get<TriviaResponse>(`${BASE_URL}/api.php?${params.toString()}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  },

  async getCategories() {
    try {
      await waitForRateLimit()
      const response = await axios.get<{ trivia_categories: Category[] }>(`${BASE_URL}/api_category.php`)
      return response.data.trivia_categories
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  },

  async getCategoryCount(categoryId: number) {
    try {
      await waitForRateLimit()
      const response = await axios.get<{ category_question_count: CategoryCount }>(
        `${BASE_URL}/api_count.php?category=${categoryId}`
      )
      return response.data.category_question_count
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  },

  async getGlobalCount() {
    try {
      await waitForRateLimit()
      const response = await axios.get(`${BASE_URL}/api_count_global.php`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  },

  async getSessionToken() {
    try {
      await waitForRateLimit()
      const response = await axios.get(`${BASE_URL}/api_token.php?command=request`)
      return response.data.token
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  },

  async resetSessionToken(token: string) {
    try {
      await waitForRateLimit()
      const response = await axios.get(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
      }
      throw error
    }
  }
} 