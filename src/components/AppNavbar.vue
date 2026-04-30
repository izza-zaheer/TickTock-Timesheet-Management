<template>
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Logo -->
      <RouterLink to="/dashboard" class="navbar-logo">ticktock</RouterLink>

      <!-- Center nav -->
      <nav class="navbar-nav">
        <RouterLink to="/dashboard" class="nav-link" active-class="nav-link--active">
          Timesheets
        </RouterLink>
      </nav>

      <!-- User menu -->
      <div class="navbar-user">
        <button class="user-btn" @click="toggleMenu" ref="userBtn">
          <span class="user-avatar">{{ initials }}</span>
          <span class="user-name">{{ user?.name }}</span>
          <i class="pi pi-chevron-down user-chevron"></i>
        </button>

        <!-- Dropdown -->
        <div class="user-dropdown" v-if="menuOpen" v-click-outside="closeMenuIfClickedOutside">
          <div class="dropdown-header">
            <span class="dropdown-name">{{ user?.name }}</span>
            <span class="dropdown-email">{{ user?.email }}</span>
          </div>
          <hr class="dropdown-divider" />
          <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
            <i class="pi pi-sign-out"></i> Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const userBtn = ref(null)

const user = computed(() => authStore.currentUser)
const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const menuOpen = ref(false)
function toggleMenu(event) {
  event.stopPropagation()
  menuOpen.value = !menuOpen.value
}
function closeMenu() { 
  menuOpen.value = false 
}
function closeMenuIfClickedOutside(event) {
  // Don't close if click was on the user button
  if (userBtn.value && userBtn.value.contains(event.target)) {
    return
  }
  closeMenu()
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Simple click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (e) => {
      if (!el.contains(e.target)) binding.value(e)
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}
</script>

<style scoped>
.navbar {
  @apply bg-white border-b border-slate-200 sticky top-0 z-50;
}

.navbar-inner {
  @apply max-w-7xl mx-auto px-6 h-14 flex items-center gap-6;
}

.navbar-logo {
  @apply text-lg font-bold text-slate-800 no-underline -tracking-wide shrink-0;
}

.navbar-nav {
  @apply flex gap-1;
}

.nav-link {
  @apply text-sm font-medium text-slate-500 no-underline py-1.5 px-3 rounded-md transition-colors duration-150;
}

.nav-link:hover,
.nav-link--active {
  @apply text-slate-800 bg-slate-100;
}

.navbar-user {
  @apply ml-auto relative;
}

.user-btn {
  @apply flex items-center gap-2 bg-none border-none cursor-pointer py-1.5 px-2 rounded-md transition-colors duration-150;
  font: inherit;
}

.user-btn:hover {
  @apply bg-slate-100;
}

.user-avatar {
  @apply w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center;
}

.user-name {
  @apply text-sm font-medium text-slate-800;
}

.user-chevron {
  @apply text-xs text-slate-400;
}

/* ── Dropdown ──────────────────────────── */
.user-dropdown {
  @apply absolute right-0 top-5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden;
  min-width: 12.5rem;
}

.dropdown-header {
  @apply p-3 px-4 flex flex-col gap-0.5;
}

.dropdown-name {
  @apply text-sm font-semibold text-slate-800;
}

.dropdown-email {
  @apply text-xs text-slate-400;
}

.dropdown-divider {
  @apply border-none border-t border-slate-200 m-0;
}

.dropdown-item {
  @apply w-full flex items-center gap-2 p-2.5 px-4 bg-none border-none text-sm cursor-pointer text-left transition-colors duration-150;
  font: inherit;
}

.dropdown-item:hover {
  @apply bg-slate-50;
}

.dropdown-item--danger {
  @apply text-red-600;
}

.dropdown-item--danger:hover {
  @apply bg-red-50;
}
</style>
