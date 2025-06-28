import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkAdmin() {
  const user = supabase.auth.getUser()
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) {
    // Not logged in
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

  // Show welcome message
  document.getElementById('welcome-message').textContent = `Welcome, ${userData.first_name}!`
}

checkAdmin()
