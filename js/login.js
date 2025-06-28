import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form')
  const message = document.getElementById('message')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    message.style.color = '#710500'
    message.textContent = ''

    const email = form.email.value.trim()
    const password = form.password.value.trim()

    if (!email || !password) {
      message.textContent = 'Please enter both email and password.'
      return
    }

    message.textContent = 'Logging in...'

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      message.textContent = `Error: ${error.message}`
      return
    }

    message.style.color = '#2D5C2A'
    message.textContent = 'Login successful! Redirecting...'

    setTimeout(() => {
      window.location.href = 'dashboard.html' // update this as you build your dashboard
    }, 1200)
  })
})

  // Modal handling
  const openSignup = document.querySelector('a[href="signup.html"]')
  const closeSignup = document.getElementById('close-signup')
  const signupModal = document.getElementById('signup-modal')
  
  openSignup.addEventListener('click', (e) => {
    e.preventDefault()
    signupModal.classList.add('active')
  })
  
  closeSignup.addEventListener('click', () => {
    signupModal.classList.remove('active')
  })
  
  window.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.classList.remove('active')
    }
  })
