// Initialize Supabase client AFTER the supabase library has loaded (global `supabase` object)
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

// Create supabase client using global `supabase` exposed by CDN
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data, error } = await supabaseClient
      .from('leadership_team')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching team data:', error);
      return;
    }

    const doContainer = document.getElementById('do-members');
    const asContainer = document.getElementById('as-members');
    const mdContainer = document.getElementById('md-members');

    data.forEach(member => {
      const card = createTeamCard(member);
      const title = member.title.toLowerCase();

      if (title.includes('director of operations')) {
        doContainer.appendChild(card);
      } else if (title.includes('area supervisor')) {
        asContainer.appendChild(card);
      } else if (title.includes('marketing director')) {
        mdContainer.appendChild(card);
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
});

function createTeamCard(member) {
  const card = document.createElement('div');
  card.className = 'team-card';

  const img = document.createElement('img');
  img.className = 'team-photo';
  img.src = member.photo_url || 'images/placeholder-profile.png';
  img.alt = `${member.name} photo`;
  card.appendChild(img);

  const name = document.createElement('div');
  name.className = 'team-name';
  name.textContent = member.name;
  card.appendChild(name);

  const title = document.createElement('div');
  title.className = 'team-title';
  title.textContent = member.title;
  card.appendChild(title);

  // Add email element
  if (member.email) {
    const email = document.createElement('div');
    email.className = 'team-email';
    email.textContent = member.email;
    card.appendChild(email);
  }

  if (member.bio) {
    const bio = document.createElement('div');
    bio.className = 'team-bio';
    bio.textContent = member.bio;
    card.appendChild(bio);
  }

  return card;
}
