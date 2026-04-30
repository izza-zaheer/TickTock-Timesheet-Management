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
                    <button class="entry-menu-btn" @click="toggleEntryMenu(entry.id)">
                      <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <div class="entry-menu" v-if="openMenuId === entry.id" v-click-outside="closeMenu">
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

const weekId  = route.params.weekId
const week    = computed(() => getTimesheetById(weekId))

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
function toggleEntryMenu(id) {
  console.log(id);
   openMenuId.value = openMenuId.value === id ? null : id }
function closeMenu() { openMenuId.value = null }

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
    el._handler = (e) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) }
}

onMounted(() => store.fetchEntries(weekId))
</script>

<style scoped>
.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 4px 0;
}
.back-btn:hover { color: #1e293b; }

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 60px;
}

/* ── Week header ───────────────────────── */
.week-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

.week-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.week-dates {
  font-size: 13px;
  color: #64748b;
}

.week-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hours-info { display: flex; flex-direction: column; gap: 6px; min-width: 160px; }
.hours-label { font-size: 13px; font-weight: 600; color: #1e293b; text-align: right; }
.hours-bar { width: 160px; height: 8px; border-radius: 4px; }

/* ── Day groups ───────────────────────── */
.days-list { overflow: hidden; }

.day-group { padding: 20px 24px; }
.day-group--bordered { border-bottom: 1px solid #e2e8f0; }

.day-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.entries-list { display: flex; flex-direction: column; gap: 0; }

.entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}
.entry-row:last-child { border-bottom: none; }

.entry-desc {
  font-size: 13px;
  color: #1e293b;
  flex: 1;
}

.entry-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.entry-hours {
  font-size: 13px;
  color: #64748b;
  min-width: 40px;
  text-align: right;
}

.entry-tag {
  font-size: 11px;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

/* ── Entry context menu ───────────────── */
.entry-menu-wrap { position: relative; }

.entry-menu-btn {
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.entry-menu-btn:hover { background: #f1f5f9; color: #475569; }

.entry-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  min-width: 130px;
  z-index: 50;
  overflow: hidden;
}

.entry-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  color: #374151;
}
.entry-menu-item:hover { background: #f8fafc; }
.entry-menu-item--danger { color: #dc2626; }
.entry-menu-item--danger:hover { background: #fef2f2; }

/* ── Add task ─────────────────────────── */
.add-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px dashed #93c5fd;
  border-radius: 6px;
  color: #2563eb;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 14px;
  cursor: pointer;
  margin-top: 12px;
  width: 100%;
  justify-content: center;
  transition: background 0.15s;
}
.add-task-btn:hover { background: #dbeafe; }

/* ── Empty week ───────────────────────── */
.empty-week {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 24px;
  text-align: center;
  color: #64748b;
}

/* ── Footer ───────────────────────────── */
.page-footer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  margin-top: 40px;
}
</style>
