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
  display: flex;
  min-height: 100vh;
}

/* ── Left panel ───────────────────────── */
.login-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px 24px;
}

.login-form-wrap {
  width: 100%;
  max-width: 340px;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 28px;
}

.field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.field-error {
  color: #dc2626;
  font-size: 12px;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.field-checkbox label {
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.auth-error {
  margin-bottom: 16px;
}

.sign-in-btn {
  background: #2563eb !important;
  border-color: #2563eb !important;
  font-weight: 600 !important;
  padding: 10px !important;
}

.login-hint {
  margin-top: 20px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

/* ── Right panel ──────────────────────── */
.login-right {
  flex: 1;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}

.brand-content {
  max-width: 360px;
  color: #fff;
}

.brand-name {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.brand-desc {
  font-size: 14px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Responsive ───────────────────────── */
@media (max-width: 700px) {
  .login-page    { flex-direction: column; }
  .login-right   { padding: 40px 24px; min-height: 260px; }
  .login-left    { padding: 40px 24px; }
  .brand-name    { font-size: 28px; }
}
</style>
