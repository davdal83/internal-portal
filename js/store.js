let storeId = null;
let isAdmin = false;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  storeId = params.get("id");
  if (!storeId) {
    alert("No store ID specified");
    window.location.href = "dashboard.html";
    return;
  }

  await checkSession();
});

async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return;
    }
    const email = data.session.user.email;
    document.getElementById("user-email").innerText = email;

    isAdmin = await checkIfAdmin(email);
    if (isAdmin) {
      document.getElementById("admin-upload").style.display = "block";
    }

    await loadStoreInfo();
    await loadPhotos();

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

async function checkIfAdmin(email) {
  const { data, error } = await supabaseClient
    .from("admins")
    .select("email")
    .eq("email", email)
    .single();
  return data !== null && !error;
}

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

  // Update header container text and background image if possible
  document.getElementById("header-store-name").innerText = store.store_name;
  document.getElementById("header-store-number").innerText = `Store #${store.store_number}`;

  // Try to set a featured header image (if exists)
  // We get first photo for this store as header image
  const { data: photos } = await supabaseClient
    .from("photos")
    .select("image_url")
    .eq("store_id", storeId)
    .limit(1);

  const headerSection = document.getElementById("store-header");

  if (photos && photos.length > 0) {
    headerSection.style.backgroundImage = `url('${photos[0].image_url}')`;
  } else {
    // fallback color if no image
    headerSection.style.backgroundImage = "linear-gradient(135deg, #004d99, #007bff)";
  }

  // Fill store info below header
  const infoSection = document.getElementById("store-info");
  infoSection.innerHTML = `
    <p><strong>General Manager:</strong> ${store.general_manager}</p>
    <p><strong>Address:</strong> ${store.store_address || "N/A"}</p>
    <p><strong>Phone:</strong> ${formatPhoneNumber(store.phone_number)}</p>
  `;
}

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

function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  const str = phoneNum.toString().replace(/\D/g, "");
  if (str.length !== 10) return phoneNum;
  return `(${str.slice(0,3)}) ${str.slice(3,6)}-${str.slice(6)}`;
}

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

async function deletePhoto(photoId, imageUrl) {
  try {
    const url = new URL(imageUrl);
    const pathIndex = url.pathname.indexOf("/store-photos/");
    if (pathIndex === -1) throw new Error("Invalid image URL");
    const filePath = url.pathname.substring(pathIndex + 1);

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

function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

function goBack() {
  window.location.href = "dashboard.html";
}
