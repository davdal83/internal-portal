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
    document.getElementById('admin-return').style.display = 'block'
  }

  loadStores(userData.store_number)
}

async function loadStores(assignedStoreNumber) {
  let storesList = []

  if (assignedStoreNumber) {
    // Fetch assigned store first
    const { data: assignedStore, error: assignedError } = await supabase
      .from('stores')
      .select('*')
      .eq('store_number', assignedStoreNumber)

    if (assignedError) {
      console.error('Error fetching assigned store:', assignedError)
    }

    // Fetch other stores except assigned
    const { data: otherStores, error: otherError } = await supabase
      .from('stores')
      .select('*')
      .neq('store_number', assignedStoreNumber)
      .order('store_number')

    if (otherError) {
      console.error('Error fetching other stores:', otherError)
    }

    storesList = [...(assignedStore || []), ...(otherStores || [])]

    if (storesList.length > 0) {
      storesList[0].isAssigned = true
    }
  } else {
    // No assigned store, fetch all
    const { data: allStores, error: allError } = await supabase
      .from('stores')
      .select('*')
      .order('store_number')

    if (allError) {
      console.error('Error fetching stores:', allError)
    }

    storesList = allStores || []
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

    div.innerHTML = `
      <h3>${store.name} (${store.store_number})</h3>
      <p>${store.address}</p>
    `

    container.appendChild(div)
  })
}

// Run on page load
loadUser()
