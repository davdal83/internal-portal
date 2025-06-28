import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    alert('Error loading user data')
    return
  }

  document.getElementById('welcome-message').textContent = `Welcome, ${userData.first_name}!`

  if (userData.role === 'admin') {
    document.getElementById('admin-link').style.display = 'block'
    document.getElementById('admin-return-container').style.display = 'block'
  }

  loadStores(userData)
}

async function loadStores(userData) {
  let storesList = []

  if (userData.role === 'admin' || !userData.store_number) {
    const { data: allStores, error } = await supabase
      .from('stores')
      .select('*')
      .order('store_number')

    if (error) {
      console.error('Error fetching stores:', error)
    }

    storesList = allStores || []
  } else {
    const { data: assignedStore, error: aErr } = await supabase
      .from('stores')
      .select('*')
      .eq('store_number', userData.store_number)

    const { data: otherStores, error: oErr } = await supabase
      .from('stores')
      .select('*')
      .neq('store_number', userData.store_number)
      .order('store_number')

    if (aErr || oErr) {
      console.error('Error fetching stores:', aErr || oErr)
    }

    storesList = [...(assignedStore || []), ...(otherStores || [])]

    if (storesList.length > 0) {
      storesList[0].isAssigned = true
    }
  }

  renderStores(storesList)
}

function renderStores(stores) {
  const container = document.getElementById('stores-list')
  container.innerHTML = ''

  if (!stores.length) {
    container.innerHTML = '<p>No stores found.</p>'
    return
  }

  stores.forEach(store => {
    const div = document.createElement('div')
    div.className = 'store-card'
    if (store.isAssigned) {
      div.classList.add('assigned-store')
    }

    // Set background image
    div.style.backgroundImage = `url(${store.store_photo_url || 'images/default-store.jpg'})`
    div.style.backgroundSize = 'cover'
    div.style.backgroundPosition = 'center'

    // Overlay with store details
    const overlay = document.createElement('div')
    overlay.className = 'store-card-overlay'

    overlay.innerHTML = `
      <h3>${store.name}</h3>
      <p>Store ${store.store_number} ${store.phone_number ? `&nbsp;&nbsp;${store.phone_number}` : ''}</p>
      <p><strong>General Manager:</strong> ${store.gm_name || 'N/A'}</p>
    `

    div.appendChild(overlay)
    container.appendChild(div)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-btn').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) window.location.href = 'login.html'
  })

  loadUser()
})
