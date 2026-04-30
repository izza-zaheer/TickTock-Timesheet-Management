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
        <div class="user-dropdown" v-if="menuOpen" v-click-outside="closeMenu">
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

const user = computed(() => authStore.currentUser)
const initials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const menuOpen = ref(true)
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  console.log("toggle", menuOpen.value);
}
function closeMenu() { menuOpen.value = false }

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Simple click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (e) => {
      if (!el.contains(e.target)) binding.value()
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
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar-logo {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  text-decoration: none;
  letter-spacing: -0.3px;
  flex-shrink: 0;
}

.navbar-nav {
  display: flex;
  gap: 4px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover,
.nav-link--active {
  color: #1e293b;
  background: #f1f5f9;
}

.navbar-user {
  margin-left: auto;
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  font-family: inherit;
  transition: background 0.15s;
}

.user-btn:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.user-chevron {
  font-size: 11px;
  color: #94a3b8;
}

/* ── Dropdown ──────────────────────────── */
.user-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-width: 200px;
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.dropdown-email {
  font-size: 12px;
  color: #94a3b8;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 0;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item--danger {
  color: #dc2626;
}

.dropdown-item--danger:hover {
  background: #fef2f2;
}
</style>
