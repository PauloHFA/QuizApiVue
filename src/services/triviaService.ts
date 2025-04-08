import axios from 'axios'

const BASE_URL = 'https://opentdb.com'

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
    const params = new URLSearchParams()
    params.append('amount', amount.toString())
    if (category) params.append('category', category.toString())
    if (difficulty) params.append('difficulty', difficulty)
    if (type) params.append('type', type)

    const response = await axios.get<TriviaResponse>(`${BASE_URL}/api.php?${params.toString()}`)
    return response.data
  },

  async getCategories() {
    const response = await axios.get<{ trivia_categories: Category[] }>(`${BASE_URL}/api_category.php`)
    return response.data.trivia_categories
  },

  async getCategoryCount(categoryId: number) {
    const response = await axios.get<{ category_question_count: CategoryCount }>(
      `${BASE_URL}/api_count.php?category=${categoryId}`
    )
    return response.data.category_question_count
  },

  async getGlobalCount() {
    const response = await axios.get(`${BASE_URL}/api_count_global.php`)
    return response.data
  },

  async getSessionToken() {
    const response = await axios.get(`${BASE_URL}/api_token.php?command=request`)
    return response.data.token
  },

  async resetSessionToken(token: string) {
    const response = await axios.get(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
    return response.data
  }
} 