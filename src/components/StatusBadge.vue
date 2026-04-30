<template>
  <span :class="['badge', `badge--${status}`]">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true }
})

const LABELS = {
  completed:   'COMPLETED',
  incomplete:  'INCOMPLETE',
  missing:     'MISSING',
  in_progress: 'IN PROGRESS',
  pending:     'PENDING',
}

const label = computed(() => LABELS[props.status] || props.status.toUpperCase())
</script>
