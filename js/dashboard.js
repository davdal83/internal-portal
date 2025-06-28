import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// === Supabase config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// === Format phone number (904) 555-1234 ===
function formatPhone(phone) {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

// === Render store cards ===
function renderStores(stores) {
  const container = document.getElementById('stores-list')
  container.innerHTML = ''

  stores.forEach(store => {
    const div = document.createElement('div')
    div.className = 'store-card'

    div.style.backgroundImage = `url(${store.store_photo_url || 'images/default-store.jpg'})`

    const overlay = document.createElement('div')
    overlay.className = 'store-card-overlay'

    overlay.innerHTML = `
      <h3>${store.name}</h3>
      <p>Store ${store.store_number} &nbsp; ${formatPhone(store.phone_number)}</p>
      <p><strong>General Manager:</strong> ${store.gm_name || 'N/A'}</p>
    `

    div.appendChild(overlay)
    container.appendChild(div)
  })
}

// === Load user & determine access ===
async function loadUser() {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData?.session) {
    window.location.href = 'login.html'
    return
  }

  const userId = sessionData.session.user.id

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, first_name, store_number')
    .eq('id', userId)
    .single()

  if (userError || !userData) {
    alert('Error loading user profile')
    return
  }

  document.getElementById('welcome-message').textContent = `Welcome, ${userData.first_name}!`

  if (userData.role === 'admin') {
    document.getElementById('admin-link').style.display = 'block'
    document.getElementById('admin-return-container').style.display = 'block'
  }

  loadStores()
}

// === Load all stores in numerical order ===
async function loadStores() {
  const { data: allStores, error } = await supabase
    .from('stores')
    .select('*')
    .order('store_number')

  if (error || !allStores) {
    console.error('Error fetching stores:', error)
    document.getElementById('stores-list').innerHTML = '<p>Error loading stores.</p>'
    return
  }

  renderStores(allStores)
}

// === Handle logout & initialize ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) window.location.href = 'login.html'
  })

  loadUser()
})
