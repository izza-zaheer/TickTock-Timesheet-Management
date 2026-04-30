<template>
  <div class="container">
    
    <!-- Left Side -->
    <div class="left-panel">
      <h2 class="title">Welcome back</h2>

      <div class="input-group">
        <label>Email</label>
        <InputText v-model="email" placeholder="name@example.com" class="w-full" />
      </div>

      <div class="input-group">
        <label>Password</label>
        <Password v-model="password" :feedback="false" toggleMask class="w-full" />
      </div>

      <div style="margin-bottom:15px;">
        <Checkbox v-model="remember" binary />
        <label style="margin-left:8px;">Remember me</label>
      </div>

      <Button label="Sign in" class="w-full" @click="login" />
    </div>

    <!-- Right Side -->
    <div class="right-panel">
      <div class="right-title">ticktock</div>
      <div class="right-text">
        Introducing ticktock, our cutting-edge timesheet web application designed 
        to revolutionize how you manage employee work hours. With ticktock, you 
        can effortlessly track and monitor employee attendance and productivity 
        from anywhere, anytime, using any internet-connected device.
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// PrimeVue Components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'

const email = ref('')
const password = ref('')
const remember = ref(false)

const login = () => {
  console.log({
    email: email.value,
    password: password.value,
    remember: remember.value
  })
}
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>