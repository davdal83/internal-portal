document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey)

  // Elements
  const logoutBtn = document.getElementById('logout-button')
  const returnAdminLink = document.getElementById('return-to-admin')
  const welcomeMsg = document.getElementById('welcome-message')

  // Check user session and role
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    // Not logged in, redirect to login
    window.location.href = 'login.html'
    return
  }

  // Show welcome message
  welcomeMsg.textContent = `Welcome, ${user.email}`

  // Fetch user metadata to determine role
  // Assuming you have a 'users' table with 'id' and 'role' fields matching supabase auth user id
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (roleError) {
    console.warn('Failed to get user role:', roleError.message)
  }

  // Show 'Return to Admin' if user role is 'admin'
  if (userData?.role === 'admin') {
    returnAdminLink.style.display = 'block'
    returnAdminLink.href = 'admin-dashboard.html' // Change as needed
  } else {
    returnAdminLink.style.display = 'none'
  }

  // Logout button handler
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Logout failed: ' + error.message)
      return
    }
    window.location.href = 'login.html'
  })
})
