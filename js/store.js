// Globals
let storeId = null;
let isAdmin = false;

// Wait for DOM loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Get store ID from URL query param
  const params = new URLSearchParams(window.location.search);
  storeId = params.get("id");
  if (!storeId) {
    alert("No store ID specified");
    window.location.href = "dashboard.html";
    return;
  }

  await checkSession();
});

// Check if logged in and get user email & admin status
async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return;
    }
    const email = data.session.user.email;
    document.getElementById("user-email").innerText = email;

    // Check if admin
    isAdmin = await checkIfAdmin(email);
    if (isAdmin) {
      document.getElementById("admin-upload").style.display = "block";
    }

    await loadStoreInfo();
    await loadPhotos();

    // Hook upload form
    document.getElementById("upload-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const file = document.getElementById("image-file").files[0];
      if (!file) return;
      await uploadImage(file);
    });
  } catch (error) {
    console.error("Session error:", error);
    window.location.href = "login.html";
  }
}

// Check admin table for email
async function checkIfAdmin(email) {
  const { data, error } = await supabaseClient
    .from("admins")
    .select("email")
    .eq("email", email)
    .single();
  return data !== null && !error;
}

// Load store info section
async function loadStoreInfo() {
  const { data: store, error } = await supabaseClient
    .from("stores")
    .select("*")
    .eq("id", storeId)
    .single();

  if (error || !store) {
    alert("Failed to load store info");
    return;
  }

  const infoSection = document.getElementById("store-info");
  infoSection.innerHTML = `
    <h2>${store.store_name} (Store #${store.store_number})</h2>
    <p><strong>General Manager:</strong> ${store.general_manager}</p>
    <p><strong>Address:</strong> ${store.store_address}</p>
    <p><strong>Phone:</strong> ${formatPhoneNumber(store.phone_number)}</p>
  `;
}

// Load photos for this store
async function loadPhotos() {
  const { data: photos, error } = await supabaseClient
    .from("photos")
    .select("*")
    .eq("store_id", storeId);

  const photosContainer = document.getElementById("photos-container");
  photosContainer.innerHTML = "";

  if (!photos || photos.length === 0) {
    photosContainer.innerText = "No photos uploaded yet.";
    return;
  }

  photos.forEach(photo => {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-wrapper";

    const img = document.createElement("img");
    img.src = photo.image_url;
    img.alt = `Store photo`;
    img.onclick = () => openLightbox(photo.image_url);
    wrapper.appendChild(img);

    if (isAdmin) {
      const delBtn = document.createElement("button");
      delBtn.className = "delete-photo-btn";
      delBtn.title = "Delete photo";
      delBtn.innerText = "×";
      delBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm("Delete this photo?")) {
          await deletePhoto(photo.id, photo.image_url);
          loadPhotos();
        }
      };
      wrapper.appendChild(delBtn);
    }

    photosContainer.appendChild(wrapper);
  });
}

// Format phone number helper
function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  const str = phoneNum.toString().replace(/\D/g, "");
  if (str.length !== 10) return phoneNum;
  return `(${str.slice(0,3)}) ${str.slice(3,6)}-${str.slice(6)}`;
}

// Upload image to Supabase storage and insert record
async function uploadImage(file) {
  const progress = document.getElementById("upload-progress");
  progress.innerText = "Uploading...";

  const fileExt = file.name.split(".").pop();
  const fileName = `${storeId}/${Date.now()}.${fileExt}`;

  try {
    const { error: uploadError } = await supabaseClient
      .storage
      .from("store-photos")
      .upload(fileName, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseClient
      .storage
      .from("store-photos")
      .getPublicUrl(fileName);

    // Insert DB record
    const { error: insertError } = await supabaseClient
      .from("photos")
      .insert([{ store_id: storeId, image_url: urlData.publicUrl }]);

    if (insertError) throw insertError;

    progress.innerText = "Upload complete.";
    document.getElementById("upload-form").reset();
    loadPhotos();

  } catch (error) {
    console.error("Upload error:", error);
    progress.innerText = `Upload failed: ${error.message || error}`;
  }
}

// Delete photo file and DB record
async function deletePhoto(photoId, imageUrl) {
  try {
    const url = new URL(imageUrl);
    const pathIndex = url.pathname.indexOf("/store-photos/");
    if (pathIndex === -1) throw new Error("Invalid image URL");
    const filePath = url.pathname.substring(pathIndex + 1); // remove leading "/"

    const { error: storageError } = await supabaseClient
      .storage
      .from("store-photos")
      .remove([filePath]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabaseClient
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (dbError) throw dbError;

    alert("Photo deleted.");
  } catch (error) {
    alert("Failed to delete photo: " + (error.message || error));
  }
}

// Lightbox functions
function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  lbImg.src = src;
  lb.style.display = "flex";
}
function closeLightbox(e) {
  e.stopPropagation();
  document.getElementById("lightbox").style.display = "none";
}

// Logout and back
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
function goBack() {
  window.location.href = "dashboard.html";
}
