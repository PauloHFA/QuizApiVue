import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Question {
  id: number
  text: string
  createdAt: Date
}

export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref<Question[]>([])

  function addQuestion(text: string) {
    const newQuestion: Question = {
      id: Date.now(),
      text,
      createdAt: new Date()
    }
    questions.value.push(newQuestion)
  }

  function removeQuestion(id: number) {
    const index = questions.value.findIndex(q => q.id === id)
    if (index !== -1) {
      questions.value.splice(index, 1)
    }
  }

  return {
    questions,
    addQuestion,
    removeQuestion
  }
}) 