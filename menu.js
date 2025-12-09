// menu.js
// Fitur: Bagian Dokumentasi di atas galeri
// Memakai variabel global dari app.js: docSections, activeSectionId, uiRefs, saveState, defaultConfig

function renderDocSections() {
  if (!uiRefs || !uiRefs.sectionButtonsWrap) return;

  const wrap = uiRefs.sectionButtonsWrap;
  wrap.innerHTML = "";

  if (!Array.isArray(docSections) || docSections.length === 0) {
    // kalau tidak ada bagian sama sekali, sembunyikan section galeri
    if (uiRefs.galleryContainer) {
      const gallerySection = uiRefs.galleryContainer.closest("section");
      if (gallerySection) {
        gallerySection.style.display = "none";
      }
    }
    return;
  }

  // pastikan selalu ada activeSectionId yang valid
  if (!docSections.some((s) => s.id === activeSectionId)) {
    activeSectionId = docSections[0].id;
  }

  // pastikan section galeri kelihatan
  if (uiRefs.galleryContainer) {
    const gallerySection = uiRefs.galleryContainer.closest("section");
    if (gallerySection) {
      gallerySection.style.display = "";
    }
  }

  docSections.forEach((sec) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "focus-outline px-3 py-1.5 rounded-full text-xs md:text-sm font-medium shadow-sm transition-all hover:scale-105";

    btn.textContent = sec.title || "Tanpa Judul";

    if (sec.id === activeSectionId) {
      btn.style.backgroundColor =
        defaultConfig.primary_action_color || "#10b981";
      btn.style.color = defaultConfig.background_color || "#0f172a";
      btn.style.fontWeight = "700";

      // judul galeri ikut nama bagian aktif
      if (uiRefs.galleryTitle) {
        uiRefs.galleryTitle.textContent = sec.title || "Galeri";
      }
    } else {
      btn.style.backgroundColor = "transparent";
      btn.style.color = defaultConfig.text_color || "#e2e8f0";
      btn.style.border = `1px solid ${
        defaultConfig.secondary_action_color || "#3b82f6"
      }`;
      btn.style.fontWeight = "500";
    }

    btn.addEventListener("click", () => {
  // ganti section aktif
  activeSectionId = sec.id;

  // refresh tampilan tombol-tombol bagian
  renderDocSections();

  // 🔽 setiap ganti bagian, galeri juga di-render ulang
  if (typeof renderGallery === "function") {
    renderGallery();
  }

  // simpan ke Firestore
  saveState();
});


    wrap.appendChild(btn);
  });
}

// Tambah bagian baru
function addNewSection() {
  const name = prompt("Nama bagian dokumentasi baru:");
  if (!name) return;

  const title = name.trim();
  if (!title) return;

  const nextId =
    docSections.length > 0
      ? Math.max(...docSections.map((s) => s.id)) + 1
      : 1;

  docSections.push({ id: nextId, title });
  activeSectionId = nextId;

  renderDocSections();
  saveState();
}

// Hapus bagian yang sedang aktif
function deleteCurrentSection() {
  if (!Array.isArray(docSections) || docSections.length === 0) return;

  const current = docSections.find((s) => s.id === activeSectionId);
  if (!current) return;

  const ok = confirm(
    `Yakin ingin menghapus bagian "${current.title}" beserta semua foto di dalamnya?`
  );
  if (!ok) return;

  const removedId = current.id;

  // 🔽 1) hapus bagian dari daftar section
  docSections = docSections.filter((s) => s.id !== removedId);

  // 🔽 2) hapus SEMUA foto yang punya sectionId = bagian ini
  if (Array.isArray(galleryItems) && galleryItems.length > 0) {
    for (let i = galleryItems.length - 1; i >= 0; i--) {
      if (galleryItems[i].sectionId === removedId) {
        galleryItems.splice(i, 1);
      }
    }
  }

  // 🔽 3) atur activeSectionId baru
  if (docSections.length > 0) {
    activeSectionId = docSections[0].id;
  } else {
    activeSectionId = null;
  }

  // 🔽 4) refresh tampilan
  renderDocSections();
  if (typeof renderGallery === "function") {
    renderGallery();
  }

  // 🔽 5) simpan ke Firestore (state sudah bersih)
  saveState();
}



// Dipanggil dari app.js ketika mode edit galeri ON/OFF
function onGalleryEditModeChange(isOn) {
  if (!uiRefs || !uiRefs.sectionAdminRow) return;

  if (isOn) {
    // Mode edit AKTIF → tampilkan tombol
    // "➕ Tambah Bagian" & "🗑️ Hapus Bagian Ini"
    uiRefs.sectionAdminRow.classList.remove("hidden");
  } else {
    // Mode edit MATI → sembunyikan lagi
    uiRefs.sectionAdminRow.classList.add("hidden");
  }

  // Opsional: setiap kali mode berubah, refresh tampilan list bagian
  if (typeof renderDocSections === "function") {
    renderDocSections();
  }
}

// bikin global biar bisa dipanggil dari app.js
window.onGalleryEditModeChange = onGalleryEditModeChange;

