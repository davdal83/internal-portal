import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('promotions-list')

  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .gte('expiration_date', new Date().toISOString()) // Show promos expiring today or later
      .order('expiration_date', { ascending: true })

    if (error) throw error

    if (!data.length) {
      container.innerHTML = `<p style="text-align:center; font-weight:600; color:#710500;">No current promotions available. Check back soon!</p>`
      return
    }

    container.innerHTML = data.map(promo => `
      <article class="promo-card">
        <img
          class="promo-image"
          src="${promo.image_url || 'https://picsum.photos/400/250?random=20'}"
          alt="${promo.title}"
        />
        <div class="promo-content">
          <h2 class="promo-title">${promo.title}</h2>
          <p class="promo-description">${promo.description}</p>
          ${promo.promo_code ? `<a href="https://www.papajohns.com" target="_blank" rel="noopener noreferrer" class="promo-code">${promo.promo_code}</a>` : ''}
          <div class="promo-expiration">Expires: ${formatDate(promo.expiration_date)}</div>
        </div>
      </article>
    `).join('')


  } catch (err) {
    container.innerHTML = `<p style="color:red; text-align:center;">Failed to load promotions. Please try again later.</p>`
    console.error('Error loading promotions:', err)
  }
})
