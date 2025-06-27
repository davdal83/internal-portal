// Lightbox open
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = src;
  lightbox.style.display = "flex";
}

// Lightbox close
function closeLightbox(event) {
  if (event) event.stopPropagation();
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
}

// Format phone number
function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  let phoneStr = phoneNum.toString().replace(/\D/g, "");
  if (phoneStr.length !== 10) return phoneStr;
  return `(${phoneStr.slice(0,3)}) ${phoneStr.slice(3,6)}-${phoneStr.slice(6)}`;
}

// Check if user is an admin
async function checkIfAdmin(userEmail) {
  const { data, error } = await supabaseClient
    .from("admins")
    .select("email")
    .eq("email", userEmail)
    .single();

  return data !== null && !error;
}

// Load all stores
async function loadStores() {
  const { data: stores, error } = await supabaseClient.from("stores").select("*");
  const container = document.getElementById("stores-list");
  const storeSelect = document.getElementById("store-select");

  if (error || !stores) {
    container.innerText = "Error loading stores.";
    return;
  }

  container.innerHTML = "";
  storeSelect.innerHTML = '<option value="" disabled selected>Choose a store</option>';

  for (const store of stores) {
    const storeDiv = document.createElement("div");
    storeDiv.className = "store";
    storeDiv.innerHTML = `
      <h4>${store.store_number} – ${store.store_name}</h4>
      <p>
        <strong>Address:</strong> ${store.store_address}<br>
        <strong>Phone:</strong> ${formatPhoneNumber(store.phone_number)}<br>
        <strong>GM:</strong> ${store.general_manager}
      </p>
      <div id="photos-for-store-${store.id}">Loading photos...</div>
    `;

    container.appendChild(storeDiv);
    storeSelect.appendChild(new Option(`${store.store_number} – ${store.store_name}`, store.id));

    loadPhotos(store.id);
  }
}

// Load photos for a specific store
async function loadPhotos(storeId) {
  const { data: photos } = await supabaseClient
    .from("photos")
    .select("*")
    .eq("store_id", storeId);

  const photosDiv = document.getElementById(`photos-for-store-${storeId}`);
  photosDiv.innerHTML = "";

  if (!photos || photos.length === 0) {
    photosDiv.innerText = "No photos uploaded yet.";
    return;
  }

  for (const photo of photos) {
    const img = document.createElement("img");
    img.src = photo.image_url;
    img.onclick = () => openLightbox(photo.image_url);
    img.alt = `Store ${storeId}`;
    photosDiv.appendChild(img);
  }
}

// Upload image
async function uploadImage(storeId, file) {
  const progress = document.getElementById("upload-progress");
  const fileExt = file.name.split(".").pop();
  const fileName = `${storeId}/${Date.now()}.${fileExt}`;

  let { error: uploadError } = await supabaseClient
    .storage
    .from("store-photos")
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    progress.innerText = "Upload failed.";
    return;
  }

  const { data: { publicUrl } } = supabaseClient
    .storage
    .from("store-photos")
    .getPublicUrl(fileName);

  await supabaseClient.from("photos").insert([
    { store_id: storeId, image_url: publicUrl }
  ]);

  progress.innerText = "Upload complete.";
  loadPhotos(storeId);
  document.getElementById("upload-form").reset();
}

// Check login session
async function checkSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const email = session.user.email;
  document.getElementById("user-email").innerText = email;

  const isAdmin = await checkIfAdmin(email);
  if (isAdmin) {
    document.getElementById("admin-panel").style.display = "block";
  }

  document.getElementById("stores-section").style.display = "block";
  loadStores();
}

// Logout
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Form submit
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const storeId = document.getElementById("store-select").value;
  const file = document.getElementById("image-file").files[0];
  if (!storeId || !file) return;

  uploadImage(storeId, file);
});

checkSession();
