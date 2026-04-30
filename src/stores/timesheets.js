import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTimesheets, getTimesheetById,
  getEntriesByWeekId, MOCK_PROJECTS, MOCK_WORK_TYPES
} from '@/data/mockData'

export const useTimesheetStore = defineStore('timesheets', () => {
  const timesheets = ref([])
  const entries    = ref([])
  const loading    = ref(false)
  const error      = ref(null)

  // ── Timesheets ───────────────────────────────────────────────
  async function fetchTimesheets() {
    loading.value = true
    error.value   = null
    try {
      // Simulate API latency
      await new Promise(r => setTimeout(r, 400))
      timesheets.value = getTimesheets()
    } catch (e) {
      error.value = 'Failed to load timesheets'
    } finally {
      loading.value = false
    }
  }

  // ── Entries ──────────────────────────────────────────────────
  async function fetchEntries(weekId) {
    loading.value = true
    error.value   = null
    try {
      await new Promise(r => setTimeout(r, 300))
      entries.value = getEntriesByWeekId(weekId)
    } catch (e) {
      error.value = 'Failed to load entries'
    } finally {
      loading.value = false
    }
  }

  function addEntry(weekId, entryData) {
    const newEntry = {
      id: `e-${Date.now()}`,
      weekId,
      date: new Date().toISOString().split('T')[0],
      ...entryData
    }
    entries.value.push(newEntry)

    // Update week status to in_progress if it was missing/pending
    const week = timesheets.value.find(t => t.id === weekId)
    if (week && (week.status === 'missing' || week.status === 'pending')) {
      week.status = 'in_progress'
    }
    if (week) {
      week.totalHours = (week.totalHours || 0) + entryData.hours
    }
    return newEntry
  }

  function updateEntry(entryId, entryData) {
    const idx = entries.value.findIndex(e => e.id === entryId)
    if (idx !== -1) {
      entries.value[idx] = { ...entries.value[idx], ...entryData }
    }
  }

  function deleteEntry(entryId) {
    entries.value = entries.value.filter(e => e.id !== entryId)
  }

  return {
    timesheets, entries, loading, error,
    fetchTimesheets, fetchEntries,
    addEntry, updateEntry, deleteEntry,
    projects: MOCK_PROJECTS,
    workTypes: MOCK_WORK_TYPES,
  }
})
