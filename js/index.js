// js/index.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase config
const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = createClient(supabaseUrl, supabaseKey);

// NAVBAR TOGGLE for mobile menu
function setupNavbarToggle() {
  const toggleButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleButton || !navLinks) return;

  toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggleButton.classList.toggle('open');
  });
}

// LOAD deals from Supabase and display
async function loadDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deals:', error);
    return;
  }

  const grid = document.getElementById('promo-grid');
  if (!grid) return;

  grid.innerHTML = '';

  data.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'promo-card';

    card.innerHTML = `
      <h3>${deal.title}</h3>
      <p>${deal.description || ''}</p>
      ${deal.price ? `<p><strong>Price:</strong> ${deal.price}</p>` : ''}
    `;

    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavbarToggle();
  loadDeals();
});
