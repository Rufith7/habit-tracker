const API_BASE_URL = 'http://localhost:5001/api'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  })

  let data = {}

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export async function getHabits() {
  return apiRequest('/habits')
}

export async function createHabit({ name, description }) {
  return apiRequest('/habits', {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
    }),
  })
}

export async function createCheckIn(habitId, localDay = null) {
  return apiRequest(`/habits/${habitId}/check-ins`, {
    method: 'POST',
    body: JSON.stringify(
      localDay
        ? {
            localDay,
          }
        : {},
    ),
  })
}

export async function getCheckIns(habitId) {
  return apiRequest(`/habits/${habitId}/check-ins`)
}

export async function deleteCheckIn(habitId, localDay) {
  return apiRequest(
    `/habits/${habitId}/check-ins/${localDay}`,
    {
      method: 'DELETE',
    },
  )
}

export async function getHabitStats(habitId) {
  return apiRequest(`/habits/${habitId}/stats`)
}

export async function registerUser({
  email,
  password,
  timezone,
}) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      timezone,
    }),
  })
}

export async function loginUser({
  email,
  password,
}) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })

  localStorage.setItem('token', data.token)

  return data
}

export async function getCurrentUser() {
  return apiRequest('/auth/me')
}

export function logoutUser() {
  localStorage.removeItem('token')
}