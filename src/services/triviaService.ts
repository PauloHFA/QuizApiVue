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

// Função para tratar erros da API
function handleApiError(error: unknown, customMessage?: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 429) {
      throw new Error('Por favor, aguarde alguns segundos antes de tentar novamente. A API tem um limite de requisições.')
    }
    if (status === 404) {
      throw new Error('Recurso não encontrado. Por favor, verifique os parâmetros.')
    }
    if (status && status >= 500) {
      throw new Error('Erro no servidor. Por favor, tente novamente mais tarde.')
    }
    throw new Error(error.response?.data?.message || customMessage || 'Erro ao fazer requisição para a API')
  }
  throw error
}

// Função para validar a resposta da API
function validateResponse(response: TriviaResponse) {
  switch (response.response_code) {
    case 0:
      return // Sucesso
    case 1:
      throw new Error('Não há perguntas suficientes para os critérios selecionados. Por favor, tente outros filtros.')
    case 2:
      throw new Error('Parâmetros inválidos fornecidos.')
    case 3:
      throw new Error('Token não encontrado.')
    case 4:
      throw new Error('Token expirado. Por favor, reinicie o quiz.')
    default:
      throw new Error('Erro desconhecido ao buscar perguntas.')
  }
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
      validateResponse(response.data)
      return response.data
    } catch (error) {
      handleApiError(error, 'Erro ao buscar perguntas')
    }
  },

  async getCategories() {
    try {
      await waitForRateLimit()
      const response = await axios.get<{ trivia_categories: Category[] }>(`${BASE_URL}/api_category.php`)
      return response.data.trivia_categories
    } catch (error) {
      handleApiError(error, 'Erro ao buscar categorias')
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
      handleApiError(error, 'Erro ao buscar contagem da categoria')
    }
  },

  async getGlobalCount() {
    try {
      await waitForRateLimit()
      const response = await axios.get(`${BASE_URL}/api_count_global.php`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Erro ao buscar contagem global')
    }
  },

  async getSessionToken() {
    try {
      await waitForRateLimit()
      const response = await axios.get<{ token: string }>(`${BASE_URL}/api_token.php?command=request`)
      return response.data.token
    } catch (error) {
      handleApiError(error, 'Erro ao obter token de sessão')
    }
  },

  async resetSessionToken(token: string) {
    try {
      await waitForRateLimit()
      const response = await axios.get(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
      return response.data
    } catch (error) {
      handleApiError(error, 'Erro ao resetar token de sessão')
    }
  }
} 