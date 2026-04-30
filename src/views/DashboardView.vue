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
          <Column field="weekNumber" header="WEEK #" sortable style="width:100px">
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
          <Column field="status" header="STATUS" sortable style="width:160px">
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
const perPage      = ref(5)
const paginatorFirst = ref(0)

const statusOptions = [
  { label: 'Completed',   value: 'completed' },
  { label: 'Incomplete',  value: 'incomplete' },
  { label: 'Missing',     value: 'missing' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending',     value: 'pending' },
]

const perPageOptions = [
  { label: '5 per page',  value: 5 },
  { label: '10 per page', value: 10 },
  { label: '20 per page', value: 20 },
]

// Reset to page 1 when filter changes
watch(filterStatus, () => { paginatorFirst.value = 0 })

// ── Filtered + paginated data ────────────────────────────────────
const filteredRows = computed(() => {
  if (!filterStatus.value) return store.timesheets
  return store.timesheets.filter(t => t.status === filterStatus.value)
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
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 140px;
}

.table-card {
  overflow: hidden;
}

.week-num {
  font-weight: 600;
  color: #1e293b;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #94a3b8;
  gap: 12px;
}

.empty-icon {
  font-size: 32px;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
}

.per-page-label {
  font-size: 13px;
  color: #64748b;
}

.table-paginator {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}
</style>
