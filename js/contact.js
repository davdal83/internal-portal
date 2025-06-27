// js/contact.js
// Fetches both leadership cards and store table from Supabase

// Supabase setup
const SUPABASE_URL = 'https://oxvnggohpjpuucsfwvmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmduZ29ocGpwdXVjc2Z3dm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzkyNDgsImV4cCI6MjA2NjU1NTI0OH0.lTD9lI2wUWSxTVBPY4wcdo81O1S87M-ZNqYasAezKQ8';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load leadership cards from Supabase
async function loadLeadership() {
  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error loading leadership:', error.message);
    return;
  }

  const container = document.querySelector('.leadership-cards');
  if (!container) return;

  container.innerHTML = ''; // Clear existing cards

  data.forEach(person => {
    const card = document.createElement('div');
    card.classList.add('contact-card');

    card.innerHTML = `
      ${person.photo_url ? `<img src="${person.photo_url}" alt="${person.name}" class="leader-photo">` : ''}
      <h3>${person.title}</h3>
      <p>Name: ${person.name}</p>
      <p>Email: <a href="mailto:${person.email}">${person.email}</a></p>
      <p>Phone: <a href="tel:${person.phone}">${person.phone}</a></p>
    `;

    container.appendChild(card);
  });
}

// Load store table from Supabase
async function loadStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('store_number, store_name, store_address')
    .order('store_number', { ascending: true });

  if (error) {
    console.error('Error loading stores:', error.message);
    return;
  }

  const tableBody = document.getElementById('store-table-body');
  if (!tableBody) return;

  data.forEach(sto
