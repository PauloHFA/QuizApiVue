import { createRouter, createWebHistory } from 'vue-router'
import Quiz from '../components/Quiz.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'quiz',
      component: Quiz,
      meta: {
        title: 'Quiz Perguntas'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'Sobre - Quiz Perguntas'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Atualiza o título da página quando a rota muda
router.beforeEach((to, from, next) => {
  document.title = to.meta.title?.toString() || 'Quiz Perguntas'
  next()
})

export default router 