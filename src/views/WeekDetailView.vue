<template>
  <div>
    <AppNavbar />

    <main class="page-wrap">
      <!-- Back -->
      <button class="back-btn" @click="router.back()">
        <i class="pi pi-arrow-left"></i> Back to timesheets
      </button>

      <!-- Loading -->
      <div v-if="store.loading" class="loading-wrap">
        <ProgressSpinner style="width:40px;height:40px" />
      </div>

      <template v-else-if="week">
        <!-- Week header -->
        <div class="week-header card">
          <div class="week-header-left">
            <h1 class="week-title">This week's timesheet</h1>
            <p class="week-dates">{{ formatDateRange(week.startDate, week.endDate) }}</p>
          </div>
          <div class="week-header-right">
            <div class="hours-info">
              <span class="hours-label">{{ week.totalHours }}/{{ week.targetHours }} hrs</span>
              <ProgressBar
                :value="Math.min(100, Math.round((week.totalHours / week.targetHours) * 100))"
                :showValue="true"
                class="hours-bar"
              />
            </div>
            <Button
              label="Add Entry"
              icon="pi pi-plus"
              @click="openAddModal"
              style="background:#2563eb; border-color:#2563eb;"
              size="small"
            />
          </div>
        </div>

        <!-- Daily groups -->
        <div class="days-list card" v-if="groupedEntries.length">
          <div
            v-for="(group, idx) in groupedEntries"
            :key="group.date"
            class="day-group"
            :class="{ 'day-group--bordered': idx < groupedEntries.length - 1 }"
          >
            <!-- Day label -->
            <div class="day-label">{{ formatShortDate(group.date) }}</div>

            <!-- Entries -->
            <div class="entries-list">
              <div
                v-for="entry in group.entries"
                :key="entry.id"
                class="entry-row"
              >
                <span class="entry-desc">{{ entry.project }}</span>
                <div class="entry-right">
                  <span class="entry-hours">{{ entry.hours }} hrs</span>
                  <span class="entry-tag">{{ entry.typeOfWork }}</span>
                  <div class="entry-menu-wrap">
                    <button class="entry-menu-btn" @click="toggleEntryMenu(entry.id, $event)">
                      <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <div class="entry-menu" v-if="openMenuId === entry.id" v-click-outside="closeMenuIfClickedOutside">
                      <button class="entry-menu-item" @click="editEntry(entry)">
                        <i class="pi pi-pencil"></i> Edit
                      </button>
                      <button class="entry-menu-item entry-menu-item--danger" @click="confirmDelete(entry)">
                        <i class="pi pi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add task for this day -->
            <button class="add-task-btn" @click="openAddModal">
              <i class="pi pi-plus"></i> Add new task
            </button>
          </div>
        </div>

        <!-- Empty week -->
        <div v-else class="card empty-week">
          <i class="pi pi-calendar" style="font-size:28px;color:#94a3b8"></i>
          <p>No entries this week yet.</p>
          <Button label="Add your first entry" icon="pi pi-plus" @click="openAddModal"
            style="background:#2563eb;border-color:#2563eb;" size="small" />
        </div>
      </template>

      <!-- Week not found -->
      <div v-else class="card empty-week">
        <p>Week not found.</p>
        <Button label="Go back" @click="router.back()" severity="secondary" size="small" />
      </div>
    </main>

    <!-- Footer -->
    <footer class="page-footer">© 2024 tentwenty. All rights reserved.</footer>

    <!-- Entry modal -->
    <EntryModal
      v-model="showModal"
      :weekId="weekId"
      :entry="editingEntry"
      @hide="editingEntry = null"
    />

    <!-- Confirm delete -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTimesheetStore } from '@/stores/timesheets'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { formatDateRange, formatShortDate, getTimesheetById } from '@/data/mockData'

import AppNavbar      from '@/components/AppNavbar.vue'
import EntryModal     from '@/components/EntryModal.vue'
import Button         from 'primevue/button'
import ProgressBar    from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import ConfirmDialog  from 'primevue/confirmdialog'

const route   = useRoute()
const router  = useRouter()
const store   = useTimesheetStore()
const confirm = useConfirm()
const toast   = useToast()

const weekId   = route.params.weekId
const baseWeek = computed(() => getTimesheetById(weekId))
const week     = computed(() => {
  if (!baseWeek.value) return null
  const totalHours = store.entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0)
  return {
    ...baseWeek.value,
    totalHours,
  }
})

// ── Group entries by date ───────────────────────────────────────
const groupedEntries = computed(() => {
  const map = {}
  store.entries.forEach(e => {
    if (!map[e.date]) map[e.date] = []
    map[e.date].push(e)
  })
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, entries]) => ({ date, entries }))
})

// ── Modal ───────────────────────────────────────────────────────
const showModal    = ref(false)
const editingEntry = ref(null)

function openAddModal() {
  editingEntry.value = null
  showModal.value    = true
}

function editEntry(entry) {
  editingEntry.value = entry
  showModal.value    = true
  closeMenu()
}

// ── Context menu ────────────────────────────────────────────────
const openMenuId = ref(null)
function toggleEntryMenu(id, event) {
  event.stopPropagation()
  openMenuId.value = openMenuId.value === id ? null : id
}
function closeMenu() { openMenuId.value = null }
function closeMenuIfClickedOutside(event) {
  // Check if click was on any entry menu button
  const buttons = document.querySelectorAll('.entry-menu-btn')
  for (let btn of buttons) {
    if (btn.contains(event.target)) return
  }
  closeMenu()
}

// ── Delete ──────────────────────────────────────────────────────
function confirmDelete(entry) {
  closeMenu()
  confirm.require({
    message: 'Are you sure you want to delete this entry?',
    header:  'Delete entry',
    icon:    'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept() {
      store.deleteEntry(entry.id)
      toast.add({ severity: 'success', summary: 'Entry deleted', life: 3000 })
    }
  })
}

// ── click-outside directive ─────────────────────────────────────
const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) }
}

onMounted(() => store.fetchEntries(weekId))
</script>

<style scoped>
.back-btn {
  @apply flex items-center gap-1.5 bg-none border-none text-sm text-slate-500 cursor-pointer mb-5 py-1;
  font: inherit;
}
.back-btn:hover { @apply text-slate-800; }

.loading-wrap {
  @apply flex justify-center py-16;
}

/* ── Week header ───────────────────────── */
.week-header {
  @apply flex items-center justify-between p-5 px-6 mb-4 flex-wrap gap-4;
}

.week-title {
  @apply text-lg font-bold text-slate-800 mb-1;
}

.week-dates {
  @apply text-sm text-slate-500;
}

.week-header-right {
  @apply flex items-center gap-4 flex-wrap;
}

.hours-info { @apply flex flex-col gap-1.5; min-width: 10rem; }
.hours-label { @apply text-sm font-semibold text-slate-800 text-right; }
.hours-bar { @apply w-40 h-4 rounded; }

/* ── Day groups ───────────────────────── */
.days-list { @apply overflow-hidden; }

.day-group { @apply p-5 px-6; }
.day-group--bordered { @apply border-b border-slate-200; }

.day-label {
  @apply text-sm font-semibold text-slate-800 mb-3;
}

.entries-list { @apply flex flex-col gap-0; }

.entry-row {
  @apply flex items-center justify-between py-2.5 border-b border-slate-100;
}
.entry-row:last-child { @apply border-b-0; }

.entry-desc {
  @apply text-sm text-slate-800 flex-1;
}

.entry-right {
  @apply flex items-center gap-2.5;
}

.entry-hours {
  @apply text-sm text-slate-500 min-w-10 text-right;
}

.entry-tag {
  @apply text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium whitespace-nowrap;
}

/* ── Entry context menu ───────────────── */
.entry-menu-wrap { @apply relative; }

.entry-menu-btn {
  @apply w-7 h-7 bg-none border-none cursor-pointer text-slate-400 rounded hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center;
}

.entry-menu {
  @apply absolute right-0 top-5 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden;
  min-width: 8rem;
}

.entry-menu-item {
  @apply w-full flex items-center gap-2 p-2.5 px-3.5 bg-none border-none text-sm cursor-pointer text-left text-gray-700;
  font: inherit;
}
.entry-menu-item:hover { @apply bg-slate-50; }
.entry-menu-item--danger { @apply text-red-600; }
.entry-menu-item--danger:hover { @apply bg-red-50; }

/* ── Add task ─────────────────────────── */
.add-task-btn {
  @apply flex items-center gap-1.5 bg-blue-50 border border-dashed border-blue-300 rounded-md text-blue-600 text-sm font-medium p-2 px-3.5 cursor-pointer mt-3 w-full justify-center transition-colors duration-150 hover:bg-blue-100;
  font: inherit;
}

/* ── Empty week ───────────────────────── */
.empty-week {
  @apply flex flex-col items-center justify-center gap-4 p-16 px-6 text-center text-slate-500;
}

/* ── Footer ───────────────────────────── */
.page-footer {
  @apply text-center text-xs text-slate-400 py-6 border-t border-slate-200 mt-10;
}
</style>
