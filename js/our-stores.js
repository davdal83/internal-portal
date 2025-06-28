import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const tableBody = document.querySelector('#stores-table tbody')

  try {
    const { data, error } = await supabase
      .from('stores')
      .select('store_number, name, address, city, state, zip_code, phone_number')
      .order('store_number', { ascending: true })

    if (error) throw error

    data.forEach(store => {
      const fullAddress = `${store.address}, ${store.city}, ${store.state} ${store.zip_code}`.replace(/\s*,\s*/g, ', ')
      function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
        }
        return phone // fallback if not 10 digits
      }
            
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td data-label="Store #">${store.store_number}</td>
        <td data-label="Location">${store.name}</td>
        <td data-label="Address">${fullAddress}</td>
        <td data-label="Phone Number">${formatPhone(store.phone_number)}</td>
  `
      tableBody.appendChild(tr)
    })
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Failed to load stores. Please try again later.</td></tr>`
    console.error('Error loading stores:', err)
  }
})
