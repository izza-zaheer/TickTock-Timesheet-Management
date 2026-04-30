import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserByEmail } from '@/data/mockData'

export const useAuthStore = defineStore('auth', () => {
  // State — hydrate from sessionStorage on load
  const user = ref(JSON.parse(sessionStorage.getItem('tt_user') || 'null'))

  // Getters
  const isLoggedIn  = computed(() => !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  function login(email, password) {
    const found = getUserByEmail(email)
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password')
    }
    // Store safe user (no password)
    const safeUser = { id: found.id, name: found.name, email: found.email }
    user.value = safeUser
    sessionStorage.setItem('tt_user', JSON.stringify(safeUser))
    return safeUser
  }

  function logout() {
    user.value = null
    sessionStorage.removeItem('tt_user')
  }

  return { user, isLoggedIn, currentUser, login, logout }
})
