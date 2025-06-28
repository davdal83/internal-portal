// Supabase client already set up in js/supabase.js

document.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await supabase
    .from('leadership_team')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team:', error);
    return;
  }

  // Separate groups by title
  const doContainer = document.getElementById('do-members');
  const asContainer = document.getElementById('as-members');
  const mdContainer = document.getElementById('md-members');

  data.forEach(member => {
    const card = createTeamCard(member);
    if (member.title.toLowerCase().includes('director of operations')) {
      doContainer.appendChild(card);
    } else if (member.title.toLowerCase().includes('area supervisor')) {
      asContainer.appendChild(card);
    } else if (member.title.toLowerCase().includes('marketing director')) {
      mdContainer.appendChild(card);
    }
  });
});

function createTeamCard(member) {
  const card = document.createElement('div');
  card.className = 'team-card';

  // Use member photo or placeholder circle
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

  if (member.bio) {
    const bio = document.createElement('div');
    bio.className = 'team-bio';
    bio.textContent = member.bio;
    card.appendChild(bio);
  }

  return card;
}
