// Global isAdmin flag
let isAdmin = false;

// --- Lightbox ---
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = src;
  lightbox.style.display = "flex";
}

function closeLightbox(event) {
  if (event) event.stopPropagation();
  document.getElementById("lightbox").style.display = "none";
}

// --- Format phone number ---
function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  let phoneStr = phoneNum.toString().replace(/\D/g, "");
  if (phoneStr.length !== 10) return phoneStr;
  return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
}

// --- Admin Check ---
async function checkIfAdmin(email) {
  const { data, error } = await supabaseClient
    .from("admins")
    .select("email")
    .eq("email", email)
    .single();

  return data !== null && !error;
}

// --- Load Stores ---
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
      <div id="photos-for-store-${store.id}">Loading photos…</div>
    `;

    container.appendChild(storeDiv);
    storeSelect.appendChild(new Option(`${store.store_number} – ${store.store_name}`, store.id));

    loadPhotos(store.id);
  }
}

// --- Load Photos for a Store ---
async function loadPhotos(storeId) {
  const { data: photos, error } = await supabaseClient
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
    const photoWrapper = document.createElement("div");
    photoWrapper.className = "photo-wrapper";

    const img = document.createElement("img");
    img.src = photo.image_url;
    img.alt = `Store ${storeId}`;
    img.onclick = () => openLightbox(photo.image_url);

    photoWrapper.appendChild(img);

    if (isAdmin) {
      const delBtn = document.createElement("button");
      delBtn.className = "delete-photo-btn";
      delBtn.innerText = "×";
      delBtn.title = "Delete photo";
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this photo?")) {
          await deletePhoto(photo.id, photo.image_url);
          loadPhotos(storeId);
        }
      };
      photoWrapper.appendChild(delBtn);
    }

    photosDiv.appendChild(photoWrapper);
  }
}

// --- Delete Photo ---
async function deletePhoto(photoId, imageUrl) {
  try {
    // Extract storage path from imageUrl
    const url = new URL(imageUrl);
    // Get path after '/store-photos/'
    const pathIndex = url.pathname.indexOf("/store-photos/");
    if (pathIndex === -1) throw new Error("Invalid image URL");

    const filePath = url.pathname.substring(pathIndex + 1); // remove leading '/'

    // Delete file from storage
    const { error: storageError } = await supabaseClient
      .storage
      .from("store-photos")
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete DB record
    const { error: dbError } = await supabaseClient
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (dbError) throw dbError;

    alert("Photo deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    alert(`Failed to delete photo: ${error.message || error}`);
  }
}

// --- Upload Image ---
async function uploadImage(storeId, file) {
  const progress = document.getElementById("upload-progress");
  progress.innerText = "Uploading…";

  const fileExt = file.name.split(".").pop();
  const fileName = `${storeId}/${Date.now()}.${fileExt}`;

  console.log("Uploading to bucket: store-photos →", fileName);

  try {
    const { data, error: uploadError } = await supabaseClient
      .storage
      .from("store-photos")
      .upload(fileName, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseClient
      .storage
      .from("store-photos")
      .getPublicUrl(fileName);

    console.log("Image URL:", urlData?.publicUrl);

    const { error: insertError } = await supabaseClient.from("photos").insert([
      { store_id: storeId, image_url: urlData.publicUrl }
    ]);

    if (insertError) throw insertError;

    progress.innerText = "Upload complete.";
    loadPhotos(storeId);
    document.getElementById("upload-form").reset();

  } catch (error) {
    console.error("Upload error:", error);
    progress.innerText = `Upload failed: ${error.message || error}`;
  }
}

// --- Check Auth Session ---
async function checkSession() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    const email = session.user.email;
    document.getElementById("user-email").innerText = email;

    isAdmin = await checkIfAdmin(email);
    if (isAdmin) {
      document.getElementById("admin-panel").style.display = "block";
    }

    document.getElementById("stores-section").style.display = "block";
    loadStores();
  } catch (error) {
    console.error("Session check error:", error);
    window.location.href = "login.html";
  }
}

// --- Logout ---
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// --- Upload Form Submit ---
document.getElementById("upload-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const storeId = document.getElementById("store-select").value;
  const file = document.getElementById("image-file").files[0];
  if (!storeId || !file) return;
  uploadImage(storeId, file);
});

checkSession();
