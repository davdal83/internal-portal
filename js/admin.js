// Ensure Supabase client is initialized before this file is loaded
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
      console.log('User is an admin');
      document.getElementById('admin-tools').style.display = 'block';
    } else {
      console.log('User is not an admin');
      document.getElementById('admin-tools').style.display = 'none';
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
});
