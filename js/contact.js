// js/contact.js

const SUPABASE_URL = 'https://oxvgngohpjpuucsfwvmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmduZ29ocGpwdXVjc2Z3dm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzkyNDgsImV4cCI6MjA2NjU1NTI0OH0.lTD9lI2wUWSxTVBPY4wcdo81O1S87M-ZNqYasAezKQ8';

// Wait until the supabase global is available
async function waitForSupabase() {
  while (typeof supabase === 'undefined') {
    await new Promise((r) => setTimeout(r, 10));
  }
  return supabase;
}

(async () => {
  const supabaseLib = await waitForSupabase();

  const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Now replace all references of 'supabase' with 'client' in your code below

  async function loadLeadership() {
    const { data, error } = await client
      .from('leadership')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading leadership:', error.message);
      return;
    }

    const container = document.querySelector('.leadership-cards');
    if (!container) return;

    container.innerHTML = '';

    data.forEach((person) => {
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

  async function loadStores() {
    const { data, error } = await client
      .from('stores')
      .select('store_number, store_name, store_address')
      .order('store_number', { ascending: true });

    if (error) {
      console.error('Error loading stores:', error.message);
      return;
    }

    const tableBody = document.getElementById('store-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach((store) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${store.store_number}</td>
        <td>${store.store_name}</td>
        <td>${store.store_address}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function showContactSection() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    contactSection.classList.remove('hidden');

    if (!contactSection.dataset.loaded) {
      loadLeadership();
      loadStores();
      contactSection.dataset.loaded = 'true';
    }
  }

  const contactLink = document.getElementById('contact-link');
  if (contactLink) {
    contactLink.addEventListener('click', (event) => {
      event.preventDefault();
      showContactSection();

      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

      document.querySelectorAll('.nav-links a').forEach((link) => link.classList.remove('active'));
      contactLink.classList.add('active');
    });
  }
})();
