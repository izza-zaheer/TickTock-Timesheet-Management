<template>
  <div>
    <AppNavbar />

    <main class="page-wrap">
      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Your Timesheets</h1>

        <!-- Filters -->
        <div class="filters-row">
          <Select
            v-model="filterStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Status"
            showClear
            class="filter-select"
          />
          <Select
            v-model="filterDateRange"
            :options="dateRangeOptions"
            option-label="label"
            option-value="value"
            placeholder="Date Range"
            showClear
            class="filter-select"
          />
          <Select
            v-model="perPage"
            :options="perPageOptions"
            option-label="label"
            option-value="value"
            class="filter-select"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="card table-card">
        <DataTable
          :value="paginatedRows"
          :loading="store.loading"
          stripedRows
          class="timesheet-table"
          size="small"
        >
          <!-- Week # -->
          <Column field="weekNumber" header="WEEK #" sortable style="width:auto">
            <template #body="{ data }">
              <span class="week-num">{{ data.weekNumber }}</span>
            </template>
          </Column>

          <!-- Date range -->
          <Column field="dateRange" header="DATE" sortable>
            <template #body="{ data }">
              {{ formatDateRange(data.startDate, data.endDate) }}
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="STATUS" sortable style="width:auto">
            <template #body="{ data }">
              <StatusBadge :status="data.status" />
            </template>
          </Column>

          <!-- Actions -->
          <Column header="ACTIONS" style="width:120px">
            <template #body="{ data }">
              <button class="action-link" @click="goToWeek(data)">
                {{ getActionLabel(data.status) }}
              </button>
            </template>
          </Column>

          <!-- Empty state -->
          <template #empty>
            <div class="empty-state">
              <i class="pi pi-calendar empty-icon"></i>
              <p>No timesheets found</p>
            </div>
          </template>
        </DataTable>

        <!-- Pagination -->
        <div class="table-footer">
          <span class="per-page-label">{{ perPage }} per page</span>
          <Paginator
            v-model:first="paginatorFirst"
            :rows="perPage"
            :totalRecords="filteredRows.length"
            :rowsPerPageOptions="[]"
            template="PrevPageLink PageLinks NextPageLink"
            class="table-paginator"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTimesheetStore } from '@/stores/timesheets'
import { formatDateRange } from '@/data/mockData'

import AppNavbar   from '@/components/AppNavbar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import DataTable   from 'primevue/datatable'
import Column      from 'primevue/column'
import Select      from 'primevue/select'
import Paginator   from 'primevue/paginator'

const router = useRouter()
const store  = useTimesheetStore()

// ── Filters ─────────────────────────────────────────────────────
const filterStatus = ref(null)
const filterDateRange = ref(null)
const perPage      = ref(5)
const paginatorFirst = ref(0)

const statusOptions = [
  { label: 'Completed',   value: 'completed' },
  { label: 'Incomplete',  value: 'incomplete' },
  { label: 'Missing',     value: 'missing' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending',     value: 'pending' },
]

const dateRangeOptions = [
  { label: 'January 2026', value: '2026-01' },
  { label: 'February 2026', value: '2026-02' },
  { label: 'March 2026', value: '2026-03' },
]

const perPageOptions = [
  { label: '5 per page',  value: 5 },
  { label: '10 per page', value: 10 },
  { label: '20 per page', value: 20 },
]

// Reset to page 1 when filter changes
watch(filterStatus, () => { paginatorFirst.value = 0 })
watch(filterDateRange, () => { paginatorFirst.value = 0 })

// ── Filtered + paginated data ────────────────────────────────────
const filteredRows = computed(() => {
  let filtered = store.timesheets

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(t => t.status === filterStatus.value)
  }

  // Filter by date range
  if (filterDateRange.value) {
    filtered = filtered.filter(t => t.startDate.startsWith(filterDateRange.value))
  }

  return filtered
})

const paginatedRows = computed(() => {
  const start = paginatorFirst.value
  return filteredRows.value.slice(start, start + perPage.value)
})

// ── Action label ────────────────────────────────────────────────
function getActionLabel(status) {
  const map = { completed: 'View', incomplete: 'Update', missing: 'Create', in_progress: 'Update', pending: 'Create' }
  return map[status] || 'View'
}

// ── Navigation ──────────────────────────────────────────────────
function goToWeek(row) {
  router.push(`/dashboard/${row.id}`)
}

// ── Load data ───────────────────────────────────────────────────
onMounted(() => {
  store.fetchTimesheets()
})
</script>

<style scoped>
.page-header {
  @apply mb-8 animate-[slideDown_0.3s_ease-out];
}

.page-title {
  @apply text-3xl font-extrabold text-slate-900 mb-5 -tracking-wide;
}

.filters-row {
  @apply flex items-center gap-2.5 flex-wrap bg-slate-50 p-4 rounded-lg border border-slate-200;
}

.filter-select {
  @apply min-w-[10rem];
}

.table-card {
  @apply overflow-hidden animate-[slideUp_0.3s_ease-out];
}

.week-num {
  @apply font-bold text-blue-600 text-sm;
}

.empty-state {
  @apply flex flex-col items-center justify-center p-16 px-6 text-slate-400 gap-4;
}

.empty-icon {
  @apply text-5xl opacity-60;
}

.empty-state p {
  @apply text-sm font-medium;
}

.table-footer {
  @apply flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50;
}

.per-page-label {
  @apply text-xs text-slate-500 font-medium;
}

.table-paginator {
  @apply border-none bg-transparent p-0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    @apply text-2xl;
  }

  .filters-row {
    @apply flex-col items-stretch;
  }

  .filter-select {
    @apply min-w-0 w-full;
  }

  .table-footer {
    @apply flex-col gap-3 text-center;
  }
}
</style>
