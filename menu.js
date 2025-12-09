// menu.js
// Logic khusus BAGIAN DOKUMENTASI (section galeri)

// state pagination & pencarian
let sectionPageSize = 4;      // berapa tombol bagian per halaman
let sectionCurrentPage = 1;   // halaman aktif
let sectionSearchQuery = "";  // kata kunci pencarian

function getCurrentThemeConfig() {
  if (window.elementSdk && window.elementSdk.config) {
    return window.elementSdk.config;
  }
  return defaultConfig;
}

function getFilteredSections() {
  const q = (sectionSearchQuery || "").trim().toLowerCase();
  if (!q) return docSections.slice();

  return docSections.filter((s) =>
    (s.title || "").toLowerCase().includes(q)
  );
}

function renderDocSections() {
  if (!uiRefs.sectionButtonsWrap) return;

  const wrap = uiRefs.sectionButtonsWrap;
  wrap.innerHTML = "";

  const cfg = getCurrentThemeConfig();
  const bg =
    cfg.background_color || defaultConfig.background_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  const filtered = getFilteredSections();
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / sectionPageSize)
  );

  // pastikan halaman tidak lebih dari total
  if (sectionCurrentPage > totalPages) {
    sectionCurrentPage = totalPages;
  }

  const startIndex = (sectionCurrentPage - 1) * sectionPageSize;
  const pageItems = filtered.slice(
    startIndex,
    startIndex + sectionPageSize
  );

  const setActiveStyle = (btn) => {
    btn.style.backgroundColor = primary;
    btn.style.color = bg;
    btn.style.border = `1px solid ${primary}`;
    btn.style.fontWeight = "700";
  };

  const setInactiveStyle = (btn) => {
    btn.style.backgroundColor = "transparent";
    btn.style.color = secondary;
    btn.style.border = `1px solid ${secondary}`;
    btn.style.fontWeight = "500";
  };

  if (pageItems.length === 0) {
    const info = document.createElement("p");
    info.className = "text-xs md:text-sm opacity-70 italic";
    info.textContent = sectionSearchQuery
      ? "Tidak ada folder yang cocok dengan pencarian."
      : "Belum ada bagian dokumentasi.";
    wrap.appendChild(info);
  } else {
    pageItems.forEach((section) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "focus-outline px-4 py-2 rounded-full text-xs md:text-sm shadow-md transition-all duration-300 hover:scale-105";
      btn.textContent = section.title || "Bagian Tanpa Judul";

      if (section.id === activeSectionId) {
        setActiveStyle(btn);
      } else {
        setInactiveStyle(btn);
      }

      btn.addEventListener("click", () => {
        activeSectionId = section.id;
        renderDocSections();
        if (typeof renderGallery === "function") {
          renderGallery();
        }
        saveState();
      });

      wrap.appendChild(btn);
    });
  }

  // tampil / sembunyi bar admin sesuai mode edit
  if (uiRefs.sectionAdminRow) {
    uiRefs.sectionAdminRow.classList.toggle(
      "hidden",
      !hasGalleryEditAccess
    );
  }

  // render pagination (tombol halaman)
  if (uiRefs.sectionPaginationWrap) {
    const pag = uiRefs.sectionPaginationWrap;
    pag.innerHTML = "";

    if (totalPages > 1) {
      for (let p = 1; p <= totalPages; p++) {
        const pBtn = document.createElement("button");
        pBtn.type = "button";
        pBtn.className =
          "focus-outline px-3 py-1 rounded-full text-[11px] md:text-xs shadow-sm";
        pBtn.textContent = p.toString();

        if (p === sectionCurrentPage) {
          pBtn.style.backgroundColor = primary;
          pBtn.style.color = bg;
          pBtn.style.fontWeight = "700";
        } else {
          pBtn.style.backgroundColor = "transparent";
          pBtn.style.color = secondary;
          pBtn.style.border = `1px solid ${secondary}`;
          pBtn.style.fontWeight = "500";
        }

        pBtn.addEventListener("click", () => {
          sectionCurrentPage = p;
          renderDocSections();
        });

        pag.appendChild(pBtn);
      }
    }
  }
}

// dipanggil dari app.js saat input search berubah
function setSectionSearchQuery(q) {
  sectionSearchQuery = q || "";
  sectionCurrentPage = 1; // reset ke halaman 1 setiap ganti pencarian
  renderDocSections();
}

// tambah bagian baru
function addNewSection() {
  const name = prompt("Nama bagian dokumentasi baru:", "Bagian Baru");
  if (!name) return;

  const title = name.trim();
  if (!title) return;

  const newId =
    docSections.length > 0
      ? Math.max(...docSections.map((s) => s.id)) + 1
      : 1;

  docSections.push({
    id: newId,
    title,
  });

  activeSectionId = newId;

  // tentukan halaman tempat bagian baru
  const filtered = getFilteredSections();
  const index = filtered.findIndex((s) => s.id === newId);
  if (index !== -1) {
    sectionCurrentPage = Math.floor(index / sectionPageSize) + 1;
  }

  saveState();
  renderDocSections();
  if (typeof renderGallery === "function") {
    renderGallery();
  }
}

// hapus bagian aktif
function deleteCurrentSection() {
  if (!activeSectionId) return;
  if (docSections.length <= 1) {
    alert("Minimal harus ada satu bagian dokumentasi.");
    return;
  }

  const current = docSections.find((s) => s.id === activeSectionId);
  const ok = confirm(
    `Hapus bagian "${current?.title || "Tanpa Judul"}"?\nSemua foto di bagian ini juga akan ikut dihapus dari tampilan.`
  );
  if (!ok) return;

  // buang semua foto di section ini
  for (let i = galleryItems.length - 1; i >= 0; i--) {
    if (galleryItems[i].sectionId === activeSectionId) {
      galleryItems.splice(i, 1);
    }
  }

  const idx = docSections.findIndex((s) => s.id === activeSectionId);
  if (idx !== -1) {
    docSections.splice(idx, 1);
  }

  const fallback = docSections[Math.max(0, idx - 1)];
  activeSectionId = fallback ? fallback.id : (docSections[0]?.id || null);

  saveState();
  renderDocSections();
  if (typeof renderGallery === "function") {
    renderGallery();
  }
}

// dipanggil dari app.js saat mode edit galeri ON/OFF
function onGalleryEditModeChange(isEdit) {
  if (uiRefs.sectionAdminRow) {
    uiRefs.sectionAdminRow.classList.toggle("hidden", !isEdit);
  }
}
