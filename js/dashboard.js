async function loadStores() {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) {
    window.location.href = 'login.html'
    return
  }
  const userId = sessionData.session.user.id
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('store_number')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    console.error('User store not found')
    return
  }

  const assignedStoreNumber = user.store_number

  if (assignedStoreNumber) {
    // Fetch assigned store first
    const { data: assignedStore } = await supabase
      .from('stores')
      .select('*')
      .eq('store_number', assignedStoreNumber)

    // Fetch all other stores except assigned
    const { data: otherStores } = await supabase
      .from('stores')
      .select('*')
      .neq('store_number', assignedStoreNumber)
      .order('store_number')

    const storesList = [...assignedStore, ...otherStores]
    // Mark assigned store for styling
    if (storesList.length > 0) storesList[0].isAssigned = true

    renderStores(storesList)

  } else {
    // No assigned store, fetch all in numerical order
    const { data: allStores } = await supabase
      .from('stores')
      .select('*')
      .order('store_number')

    renderStores(allStores)
  }
}
