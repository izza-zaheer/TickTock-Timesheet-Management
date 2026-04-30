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
.entry-form { display: flex; flex-direction: column; gap: 2px; }

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required { color: #dc2626; }
.field-icon { color: #94a3b8; font-size: 12px; }
.field-hint { font-size: 11px; color: #94a3b8; }
.field-error { font-size: 12px; color: #dc2626; }

/* ── Hours stepper ──────────────── */
.hours-stepper {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
}

.step-btn {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.step-btn:hover { background: #e2e8f0; }

.hours-value {
  min-width: 48px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  border-left: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
  padding: 8px 4px;
}
</style>
