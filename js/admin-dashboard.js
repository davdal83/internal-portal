import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkAdmin() {
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData?.session) {
    window.location.href = 'login.html'
    return
  }

  const userId = sessionData.session.user.id

  const { data: userData, error } = await supabase
    .from('users')
    .select('role, first_name')
    .eq('id', userId)
    .single()

  if (error || !userData || userData.role !== 'admin') {
    alert('Unauthorized - Admins only')
    window.location.href = 'login.html'
    return
  }

  // Optional welcome update
  document.getElementById('welcome-message')?.textContent = `Welcome, ${userData.first_name}!`
}

checkAdmin()

// Sidebar toggle and navigation
const sidebar = document.getElementById('sidebar')
const toggleBtn = document.getElementById('sidebar-toggle')
const navItems = document.querySelectorAll('.sidebar-nav ul li')
const sectionTitle = document.getElementById('section-title')
const sectionContent = document.getElementById('section-content')

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed')
})

// Sidebar navigation handling
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'))
    item.classList.add('active')
    sectionTitle.textContent = item.textContent

    switch (item.dataset.section) {
      case 'dashboard':
        sectionContent.innerHTML = '<p>Welcome to your admin dashboard. Select a section from the sidebar.</p>'
        break
      case 'users':
        sectionContent.innerHTML = '<p><em>User management coming soon.</em></p>'
        break
      case 'stores':
        sectionContent.innerHTML = '<p><em>Store management coming soon.</em></p>'
        break
      case 'docs':
        sectionContent.innerHTML = '<p><em>Document upload coming soon.</em></p>'
        break
      case 'settings':
        sectionContent.innerHTML = '<p><em>Settings coming soon.</em></p>'
        break
      case 'user-dashboard':
        window.location.href = 'dashboard.html'
        break
      default:
        sectionContent.innerHTML = '<p>Select a section.</p>'
    }
  })
})
