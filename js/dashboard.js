document.addEventListener('DOMContentLoaded', async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not authenticated:', userError);
    return;
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }

    if (profile?.role === 'admin') {
      const adminPanel = document.getElementById('admin-tools');
      if (adminPanel) {
        adminPanel.style.display = 'block';
      }
    }
  } catch (err) {
    console.error('Unexpected error in dashboard.js:', err);
  }
});
