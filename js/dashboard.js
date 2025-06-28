// dashboard.js
import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE'  // Replace with your anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Format US phone numbers (e.g. 9046417272 → (904) 641-7272)
function formatPhoneNumber(phone) {
  if (!phone) return ''
  const cleaned = ('' + phone).replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

// Load all stores and render
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

  storesList.innerHTML = ''  // Clear previous content

  if (!stores || stores.length === 0) {
    storesList.innerHTML = '<li>No stores found.</li>'
    return
  }

  stores.forEach(store => {
    const li = document.createElement('li')
    li.className = 'store-item'

    // Store avatar image
    const img = document.createElement('img')
    img.className = 'store-avatar'
    img.src = store.photo_url || 'images/default-store.jpg'
    img.alt = `Store ${store.store_number} photo`

    // Store info container
    const infoDiv = document.createElement('div')
    infoDiv.className = 'store-info'

    const storeName = document.createElement('h3')
    storeName.textContent = store.store_name || 'Unnamed Store'

    const storeDetails = document.createElement('p')
    storeDetails.textContent = `Store ${store.store_number} | ${formatPhoneNumber(store.phone_number)}`

    const gm = document.createElement('p')
    gm.textContent = `General Manager: ${store.general_manager || 'N/A'}`

    // Append info elements
    infoDiv.appendChild(storeName)
    infoDiv.appendChild(storeDetails)
    infoDiv.appendChild(gm)

    // Append image and info to list item
    li.appendChild(img)
    li.appendChild(infoDiv)

    // Append to stores list
    storesList.appendChild(li)
  })
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadStores()
})
