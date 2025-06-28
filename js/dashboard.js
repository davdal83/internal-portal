import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// === Supabase config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

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
    if (store.isAssigned) div.classList.add('assigned-store')

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

  // Show welcome
  document.getElementById('welcome-message').textContent = `Welcome, ${userData.first_name}!`

  // Show admin tools if admin
  if (userData.role === 'admin') {
    document.getElementById('admin-link').style.display = 'block'
    document.getElementById('admin-return-container').style.display = 'block'
  }

  loadStores(userData)
}

// === Load and prioritize store list ===
async function loadStores(user) {
  let storeList = []

  const { data: allStores, error } = await supabase
    .from('stores')
    .select('*')
    .order('store_number')

  if (error || !allStores) {
    console.error('Error fetching stores:', error)
    document.getElementById('stores-list').innerHTML = '<p>Error loading stores.</p>'
    return
  }

  // Assigned store first (if not admin)
  if (user.role !== 'admin' && user.store_number) {
    const assignedIndex = allStores.findIndex(s => s.store_number == user.store_number)
    if (assignedIndex !== -1) {
      const assigned = allStores.splice(assignedIndex, 1)[0]
      assigned.isAssigned = true
      storeList.push(assigned)
    }
  }

  // Append rest
  storeList = [...storeList, ...allStores]
  renderStores(storeList)
}

// === Handle logout ===
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) window.location.href = 'login.html'
  })

  loadUser()
})
