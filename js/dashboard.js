// dashboard.js

const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = supabaseJs.createClient(supabaseUrl, supabaseAnonKey)

// Format phone number as (xxx) xxx-xxxx
function formatPhoneNumber(phone) {
  if (!phone) return ''
  const cleaned = ('' + phone).replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

async function loadStores() {
  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .order('store_number', { ascending: true })

  if (error) {
    console.error('Error loading stores:', error)
    alert('Failed to load stores. Please try again later.')
    return
  }

  const storesList = document.getElementById('stores-list')
  if (!storesList) {
    console.error('No element with id "stores-list" found in DOM.')
    return
  }

  storesList.innerHTML = ''

  if (!stores || stores.length === 0) {
    storesList.innerHTML = '<li>No stores found.</li>'
    return
  }

  stores.forEach(store => {
    const li = document.createElement('li')
    li.className = 'store-item'

    const img = document.createElement('img')
    img.className = 'store-avatar'
    img.src = store.photo_url || 'images/default-store.jpg'
    img.alt = `Store ${store.store_number} photo`

    const infoDiv = document.createElement('div')
    infoDiv.className = 'store-info'

    const storeName = document.createElement('h3')
    storeName.textContent = store.store_name || 'Unnamed Store'

    const storeDetails = document.createElement('p')
    storeDetails.textContent = `Store ${store.store_number} | ${formatPhoneNumber(store.phone_number)}`

    const gm = document.createElement('p')
    gm.textContent = `General Manager: ${store.general_manager || 'N/A'}`

    infoDiv.appendChild(storeName)
    infoDiv.appendChild(storeDetails)
    infoDiv.appendChild(gm)

    li.appendChild(img)
    li.appendChild(infoDiv)

    storesList.appendChild(li)
  })
}

// Logout button event
document.getElementById('logout-button').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert('Logout failed: ' + error.message)
    return
  }
  window.location.href = 'login.html'
})

// Optionally, set a welcome message for the user
async function setWelcomeMessage() {
  const user = supabase.auth.getUser()
  if (user) {
    const sessionUser = (await user).data.user
    if (sessionUser && sessionUser.email) {
      const welcomeEl = document.getElementById('welcome-message')
      if (welcomeEl) welcomeEl.textContent = `Welcome, ${sessionUser.email}`
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadStores()
  setWelcomeMessage()
})
