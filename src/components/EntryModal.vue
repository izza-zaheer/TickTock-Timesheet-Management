<template>
  <Dialog
    v-model:visible="visible"
    :header="isEdit ? 'Edit Entry' : 'Add New Entry'"
    modal
    :closable="true"
    :style="{ width: '460px' }"
    @hide="resetForm"
  >
    <form @submit.prevent="handleSubmit" novalidate class="entry-form">

      <!-- Select Project -->
      <div class="field">
        <label>Select Project <span class="required">*</span>
          <i class="pi pi-question-circle field-icon"></i>
        </label>
        <Select
          v-model="form.project"
          :options="store.projects"
          placeholder="Project Name"
          :invalid="!!errors.project"
          fluid
        />
        <small class="field-error" v-if="errors.project">{{ errors.project }}</small>
      </div>

      <!-- Type of Work -->
      <div class="field">
        <label>Type of Work <span class="required">*</span>
          <i class="pi pi-question-circle field-icon"></i>
        </label>
        <Select
          v-model="form.typeOfWork"
          :options="store.workTypes"
          placeholder="Bug fixes"
          :invalid="!!errors.typeOfWork"
          fluid
        />
        <small class="field-error" v-if="errors.typeOfWork">{{ errors.typeOfWork }}</small>
      </div>

      <!-- Task Description -->
      <div class="field">
        <label>Task description <span class="required">*</span></label>
        <Textarea
          v-model="form.description"
          placeholder="Write text here ..."
          :invalid="!!errors.description"
          rows="4"
          fluid
          autoResize
        />
        <small class="field-hint">A note for extra info</small>
        <small class="field-error" v-if="errors.description">{{ errors.description }}</small>
      </div>

      <!-- Hours stepper -->
      <div class="field">
        <label>Hours <span class="required">*</span></label>
        <div class="hours-stepper">
          <button type="button" class="step-btn" @click="decHours">
            <i class="pi pi-minus"></i>
          </button>
          <span class="hours-value">{{ form.hours }}</span>
          <button type="button" class="step-btn" @click="incHours">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <small class="field-error" v-if="errors.hours">{{ errors.hours }}</small>
      </div>

    </form>

    <!-- Footer -->
    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="visible = false" />
      <Button
        :label="isEdit ? 'Save changes' : 'Add entry'"
        @click="handleSubmit"
        :loading="saving"
        style="background:#2563eb; border-color:#2563eb;"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useTimesheetStore } from '@/stores/timesheets'
import { useToast } from 'primevue/usetoast'

import Dialog   from 'primevue/dialog'
import Select   from 'primevue/select'
import Textarea from 'primevue/textarea'
import Button   from 'primevue/button'

const props = defineProps({
  modelValue: Boolean,           // v-model for visibility
  weekId:     { type: String, required: true },
  entry:      { type: Object, default: null }, // null = add, object = edit
})

const emit = defineEmits(['update:modelValue'])

const store  = useTimesheetStore()
const toast  = useToast()
const saving = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isEdit = computed(() => !!props.entry)

// ── Form state ──────────────────────────────────────────────────
const form = reactive({ project: '', typeOfWork: '', description: '', hours: 1 })
const errors = reactive({ project: '', typeOfWork: '', description: '', hours: '' })

// Populate form when editing
watch(() => props.entry, (entry) => {
  if (entry) {
    form.project     = entry.project
    form.typeOfWork  = entry.typeOfWork
    form.description = entry.description
    form.hours       = entry.hours
  }
}, { immediate: true })

function resetForm() {
  form.project = ''; form.typeOfWork = ''; form.description = ''; form.hours = 1
  errors.project = ''; errors.typeOfWork = ''; errors.description = ''; errors.hours = ''
}

function decHours() { if (form.hours > 1) form.hours-- }
function incHours() { if (form.hours < 24) form.hours++ }

// ── Validation ──────────────────────────────────────────────────
function validate() {
  let valid = true
  errors.project = errors.typeOfWork = errors.description = errors.hours = ''

  if (!form.project)     { errors.project = 'Project is required'; valid = false }
  if (!form.typeOfWork)  { errors.typeOfWork = 'Type of work is required'; valid = false }
  if (!form.description.trim()) { errors.description = 'Description is required'; valid = false }
  if (form.hours < 1)   { errors.hours = 'At least 1 hour required'; valid = false }

  return valid
}

// ── Submit ──────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validate()) return
  saving.value = true
  await new Promise(r => setTimeout(r, 300))

  const payload = {
    project:     form.project,
    typeOfWork:  form.typeOfWork,
    description: form.description,
    hours:       form.hours,
  }

  if (isEdit.value) {
    store.updateEntry(props.entry.id, payload)
    toast.add({ severity: 'success', summary: 'Entry updated', life: 3000 })
  } else {
    store.addEntry(props.weekId, payload)
    toast.add({ severity: 'success', summary: 'Entry added', life: 3000 })
  }

  saving.value = false
  visible.value = false
}
</script>

<style scoped>
.entry-form { @apply flex flex-col gap-0.5; }

.field {
  @apply flex flex-col gap-1.5 mb-3.5;
}

.field label {
  @apply text-sm font-medium text-gray-700 flex items-center gap-1;
}

.required { @apply text-red-600; }
.field-icon { @apply text-slate-400 text-xs; }
.field-hint { @apply text-xs text-slate-400; }
.field-error { @apply text-xs text-red-600; }

/* ── Hours stepper ──────────────── */
.hours-stepper {
  @apply flex items-center gap-0 border border-gray-300 rounded-md overflow-hidden w-fit;
}

.step-btn {
  @apply w-9 h-9 bg-slate-50 border-none cursor-pointer text-xs text-gray-700 flex items-center justify-center transition-colors duration-150 hover:bg-slate-200;
}

.hours-value {
  @apply min-w-12 text-center text-sm font-semibold text-slate-800 border-l border-r border-gray-300 py-2 px-1;
}
</style>
