<template>
  <div class="login-page">
    <!-- Left: Form -->
    <div class="login-left">
      <div class="login-form-wrap">
        <h1 class="login-title">Welcome back</h1>

        <form @submit.prevent="handleSubmit" novalidate>
          <!-- Email -->
          <div class="field">
            <label for="email">Email</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
              :invalid="!!errors.email"
              fluid
              autocomplete="email"
            />
            <small class="field-error" v-if="errors.email">{{ errors.email }}</small>
          </div>

          <!-- Password -->
          <div class="field">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="form.password"
              :feedback="false"
              :invalid="!!errors.password"
              toggleMask
              fluid
              placeholder="••••••••••"
              autocomplete="current-password"
            />
            <small class="field-error" v-if="errors.password">{{ errors.password }}</small>
          </div>

          <!-- Remember me -->
          <div class="field-checkbox">
            <Checkbox v-model="form.remember" inputId="remember" :binary="true" />
            <label for="remember">Remember me</label>
          </div>

          <!-- API Error -->
          <Message v-if="authError" severity="error" :closable="false" class="auth-error">
            {{ authError }}
          </Message>

          <!-- Submit -->
          <Button
            type="submit"
            label="Sign in"
            :loading="loading"
            fluid
            class="sign-in-btn"
          />
        </form>

        <p class="login-hint">
          Demo: <strong>john@example.com</strong> / <strong>password123</strong>
        </p>
      </div>
    </div>

    <!-- Right: Brand panel -->
    <div class="login-right">
      <div class="brand-content">
        <h2 class="brand-name">ticktock</h2>
        <p class="brand-desc">
          Introducing ticktock, our cutting-edge timesheet web application designed
          to revolutionize how you manage employee work hours. With ticktock, you
          can effortlessly track and monitor employee attendance and productivity
          from anywhere, anytime, using any internet-connected device.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import InputText from 'primevue/inputtext'
import Password  from 'primevue/password'
import Checkbox  from 'primevue/checkbox'
import Button    from 'primevue/button'
import Message   from 'primevue/message'

const router    = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '', remember: false })
const errors    = reactive({ email: '', password: '' })
const authError = ref('')
const loading   = ref(false)

function validate() {
  errors.email    = ''
  errors.password = ''
  let valid = true

  if (!form.email) {
    errors.email = 'Email is required'; valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'; valid = false
  }
  if (!form.password) {
    errors.password = 'Password is required'; valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'; valid = false
  }
  return valid
}

async function handleSubmit() {
  authError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await new Promise(r => setTimeout(r, 500)) // simulate network
    authStore.login(form.email, form.password)
    router.push('/dashboard')
  } catch (e) {
    authError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  @apply flex min-h-screen;
}

/* ── Left panel ───────────────────────── */
.login-left {
  @apply flex-1 flex items-center justify-center bg-white p-10 px-6;
}

.login-form-wrap {
  @apply w-full max-w-sm;
}

.login-title {
  @apply text-xl font-bold text-slate-800 mb-7;
}

.field {
  @apply mb-4 flex flex-col gap-1.5;
}

.field label {
  @apply text-sm font-medium text-gray-700;
}

.field-error {
  @apply text-red-600 text-xs;
}

.field-checkbox {
  @apply flex items-center gap-2 mb-5;
}

.field-checkbox label {
  @apply text-sm text-gray-700 cursor-pointer;
}

.auth-error {
  @apply mb-4;
}

.sign-in-btn {
  @apply bg-blue-600 border-blue-600 font-semibold py-2.5;
}

.login-hint {
  @apply mt-5 text-xs text-slate-400 text-center;
}

/* ── Right panel ──────────────────────── */
.login-right {
  @apply flex-1 bg-blue-600 flex items-center justify-center p-12 px-10;
}

.brand-content {
  @apply max-w-sm text-white;
}

.brand-name {
  @apply text-4xl font-bold mb-5 -tracking-wide;
}

.brand-desc {
  @apply text-sm leading-relaxed text-blue-100;
}

/* ── Responsive ───────────────────────── */
@media (max-width: 700px) {
  .login-page    { @apply flex-col; }
  .login-right   { @apply p-10 px-6 min-h-64; }
  .login-left    { @apply p-10 px-6; }
  .brand-name    { @apply text-2xl; }
}
</style>
