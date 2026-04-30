// ── Users ──────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'user-1', name: 'Izza Zaheer',   email: 'izza@gmail.com', password: 'izza1224' },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
]

// ── Weekly Timesheets ──────────────────────────────────────────
export const MOCK_TIMESHEETS = [
  { id: 'week-1',  weekNumber: 1,  startDate: '2026-01-01', endDate: '2026-01-05',  status: 'completed',   totalHours: 40, targetHours: 40 },
  { id: 'week-2',  weekNumber: 2,  startDate: '2026-01-08', endDate: '2026-01-12',  status: 'completed',   totalHours: 40, targetHours: 40 },
  { id: 'week-3',  weekNumber: 3,  startDate: '2026-01-15', endDate: '2026-01-19',  status: 'incomplete',  totalHours: 28, targetHours: 40 },
  { id: 'week-4',  weekNumber: 4,  startDate: '2026-01-22', endDate: '2026-01-26',  status: 'completed',   totalHours: 40, targetHours: 40 },
  { id: 'week-5',  weekNumber: 5,  startDate: '2026-01-29', endDate: '2026-02-02',  status: 'missing',     totalHours: 0,  targetHours: 40 },
  { id: 'week-6',  weekNumber: 6,  startDate: '2026-02-05', endDate: '2026-02-09',  status: 'completed',   totalHours: 40, targetHours: 40 },
  { id: 'week-7',  weekNumber: 7,  startDate: '2026-02-12', endDate: '2026-02-16',  status: 'incomplete',  totalHours: 20, targetHours: 40 },
  { id: 'week-8',  weekNumber: 8,  startDate: '2026-02-19', endDate: '2026-02-23',  status: 'missing',     totalHours: 0,  targetHours: 40 },
  { id: 'week-9',  weekNumber: 9,  startDate: '2026-02-26', endDate: '2026-03-01',  status: 'in_progress', totalHours: 16, targetHours: 40 },
  { id: 'week-10', weekNumber: 10, startDate: '2026-03-04', endDate: '2026-03-08',  status: 'pending',     totalHours: 0,  targetHours: 40 },
  { id: 'week-11', weekNumber: 11, startDate: '2026-03-11', endDate: '2026-03-15',  status: 'completed',   totalHours: 40, targetHours: 40 },
  { id: 'week-12', weekNumber: 12, startDate: '2026-03-18', endDate: '2026-03-22',  status: 'missing',     totalHours: 0,  targetHours: 40 },
]

// ── Entries per week ───────────────────────────────────────────
export const MOCK_ENTRIES = [
  // week-3
  { id: 'e-1',  weekId: 'week-3', date: '2026-01-15', project: 'Homepage Development', typeOfWork: 'Development',   description: 'Built hero section and navigation', hours: 4 },
  { id: 'e-2',  weekId: 'week-3', date: '2026-01-15', project: 'Homepage Development', typeOfWork: 'Code Review',    description: 'Reviewed PRs from team',            hours: 4 },
  { id: 'e-3',  weekId: 'week-3', date: '2026-01-16', project: 'Admin Dashboard',      typeOfWork: 'Development',   description: 'Responsive layout for mobile',      hours: 4 },
  { id: 'e-4',  weekId: 'week-3', date: '2026-01-16', project: 'Admin Dashboard',      typeOfWork: 'Bug Fixes',     description: 'Fixed table overflow issue',         hours: 4 },
  { id: 'e-5',  weekId: 'week-3', date: '2026-01-17', project: 'Homepage Development', typeOfWork: 'Design Review', description: 'Design QA with Figma specs',         hours: 4 },
  { id: 'e-6',  weekId: 'week-3', date: '2026-01-17', project: 'Admin Dashboard',      typeOfWork: 'Development',   description: 'Added pagination to data tables',   hours: 4 },
  { id: 'e-7',  weekId: 'week-3', date: '2026-01-18', project: 'Homepage Development', typeOfWork: 'Development',   description: 'Animations and transitions',         hours: 4 },
  // week-4
  { id: 'e-8',  weekId: 'week-4', date: '2026-01-22', project: 'Admin Dashboard',      typeOfWork: 'Development',   description: 'Dashboard charts integration',      hours: 8 },
  { id: 'e-9',  weekId: 'week-4', date: '2026-01-23', project: 'Admin Dashboard',      typeOfWork: 'Development',   description: 'User management module',            hours: 8 },
  { id: 'e-10', weekId: 'week-4', date: '2026-01-24', project: 'Mobile App',           typeOfWork: 'Development',   description: 'Login and onboarding screens',      hours: 8 },
  { id: 'e-11', weekId: 'week-4', date: '2026-01-25', project: 'Mobile App',           typeOfWork: 'Development',   description: 'Push notification integration',     hours: 8 },
  { id: 'e-12', weekId: 'week-4', date: '2026-01-26', project: 'Mobile App',           typeOfWork: 'Testing',       description: 'E2E testing on iOS and Android',    hours: 8 },
]

// ── Projects & Work Types (for dropdowns) ──────────────────────
export const MOCK_PROJECTS = [
  'Homepage Development',
  'Admin Dashboard',
  'Mobile App',
  'API Integration',
  'Design System',
]

export const MOCK_WORK_TYPES = [
  'Development',
  'Bug Fixes',
  'Code Review',
  'Design Review',
  'Testing',
  'Documentation',
  'Meetings',
]

// ── Helpers ────────────────────────────────────────────────────
export function getUserByEmail(email) {
  return MOCK_USERS.find(u => u.email === email)
}

export function getTimesheets() {
  return [...MOCK_TIMESHEETS]
}

export function getTimesheetById(id) {
  return MOCK_TIMESHEETS.find(t => t.id === id)
}

export function getEntriesByWeekId(weekId) {
  return MOCK_ENTRIES.filter(e => e.weekId === weekId)
}

export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const month = start.toLocaleString('en-US', { month: 'long' })
  return `${start.getDate()} - ${end.getDate()} ${month}, ${start.getFullYear()}`
}

export function formatShortDate(date) {
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' })
}
