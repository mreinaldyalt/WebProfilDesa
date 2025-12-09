// ===================== KONFIG DASAR =====================
const defaultConfig = {
  background_color: "#0f172a",
  surface_color: "#1e293b",
  text_color: "#e2e8f0",
  primary_action_color: "#10b981",
  secondary_action_color: "#3b82f6",
  font_family: "Inter",
  font_size: 16,

  header_title: "Perumahan Taman Kebayoran Tambun Selatan",
  header_subtitle:
    "Perumahan Taman Kebayoran RW 13, Kec. Tambun Selatan, Kab. Bekasi",
  about_title: "Tentang Perumahan Kami",
  about_body:
    "Perumahan Taman Kebayoran Tambun Selatan adalah Perumahan yang terletak di wilayah strategis dengan akses mudah namun tetap mempertahankan suasana pedesaan yang asri. Masyarakat kami menjunjung tinggi nilai-nilai gotong royong, kearifan lokal, dan keagamaan yang kuat.",
  activities_title: "Kegiatan Rutin Perumahan",
  activities_body:
    "Berbagai kegiatan rutin seperti pengajian mingguan, kerja bakti bulanan, pelatihan UMKM, festival budaya, dan kegiatan pemuda diadakan untuk mempererat kebersamaan dan meningkatkan kesejahteraan warga.",



  gallery_title: "Galeri Kegiatan Perumahan",
  calendar_section_title: "Kalender Kegiatan Tahunan",
  calendar_intro_text:
    "Lihat dan kelola jadwal kegiatan Perumahan sepanjang tahun. Perangkat Perumahan dapat masuk mode edit dengan kata sandi khusus.",
  footer_text:
    "Perumahan Taman Kebayoran Tambun Selatan • Bersama Membangun Lingkungan yang Lebih Baik",
};

const uiRefs = {
  root: null,
  mainWrapper: null,
  headerTitle: null,
  headerSubtitle: null,
  aboutTitle: null,
  aboutBody: null,
  activitiesTitle: null,
  activitiesBody: null,
  galleryTitle: null,
  footerText: null,
  profileNavBtn: null,
  calendarNavBtn: null,
  calendarSectionTitle: null,
  themeToggle: null,
  galleryContainer: null,
    calendarIntro: null,
  calendarYearLabel: null,
  calendarMonthSelect: null,   // 🔽 baru
  calendarGridContainer: null,
  calendarPrevYearBtn: null,
  calendarNextYearBtn: null,
calendarMonthSelect: null,

  // 🔽 tambahan untuk mobile menu
      mobileNavFab: null,
  mobileNavOverlay: null,
  mobileNavPanel: null,
  mobileNavThreshold: 0,
  mobileProfileLink: null,
  mobileCalendarLink: null,
  mobileEditLink: null, // 🔽 tombol "Mode Edit" di menu melayang HP

  // 🔽 FAB untuk toggle tema di HP
  mobileThemeFab: null,
};

let currentYear = new Date().getFullYear();
// bulan sekarang (0 = Januari, 11 = Desember)
let currentMonth = new Date().getMonth();
const EDIT_PASSWORD = "kknubhara";
let hasEditAccess = false;
let hasGalleryEditAccess = false;
let isLightTheme = false;

// 🔽 track menu aktif sekarang
let currentActiveMenu = "profile";


// ===================== CLOUDINARY CONFIG =====================
// ganti value cloud_name & upload_preset sesuai akun Cloudinary lu
const CLOUDINARY_CLOUD_NAME = "dycgyzhc0";
const CLOUDINARY_UPLOAD_PRESET = "desa_unsigned";

// ===================== CLOUDINARY UPLOAD HELPER =====================
async function uploadImageToCloudinary(file) {
  if (!file) return null;

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.error("Cloudinary upload error:", await res.text());
    throw new Error("Upload ke Cloudinary gagal");
  }

  const data = await res.json();
  return data.secure_url;
}

let heroImageUrl = "";

// 🔽 URL logo utama (kalau kosong pakai icon default)
let logoImageUrl = "";

let aboutDescription =
  "Perumahan Taman Kebayoran Tambun Selatan adalah Perumahan yang terletak di wilayah strategis dengan akses mudah namun tetap mempertahankan suasana pedesaan yang asri. Masyarakat kami menjunjung tinggi nilai-nilai gotong royong, kearifan lokal, dan keagamaan yang kuat.";
let activitiesDescription =
  "Berbagai kegiatan rutin seperti pengajian mingguan, kerja bakti bulanan, pelatihan UMKM, festival budaya, dan kegiatan pemuda diadakan untuk mempererat kebersamaan dan meningkatkan kesejahteraan warga.";

// ===================== BAGIAN DOKUMENTASI (SECTIONS) =====================
let docSections = [
  // default 1 bagian awal (galeri sekarang)
  { id: 1, title: defaultConfig.gallery_title },
];

let activeSectionId = 1;


// ===================== PERSISTENSI STATE (Firestore) =====================
const COLLECTION_NAME = "desa_config";
const DOCUMENT_ID = "global_state";

// semua default masuk ke bagian pertama (id = 1)
const galleryItems = [
  {
    id: 1,
    sectionId: 1,
    imageUrl: "",
    caption: "Kerja bakti membersihkan lingkungan Perumahan",
  },
  {
    id: 2,
    sectionId: 1,
    imageUrl: "",
    caption: "Pengajian rutin mingguan bersama warga",
  },
  {
    id: 3,
    sectionId: 1,
    imageUrl: "",
    caption: "Pelatihan UMKM produk lokal Perumahan",
  },
  {
    id: 4,
    sectionId: 1,
    imageUrl: "",
    caption: "Perayaan hari besar keagamaan",
  },
  {
    id: 5,
    sectionId: 1,
    imageUrl: "",
    caption: "Festival budaya dan seni tradisional",
  },
  {
    id: 6,
    sectionId: 1,
    imageUrl: "",
    caption: "Kegiatan pemuda dan olahraga Perumahan",
  },
];
let calendarEvents = {};

async function loadState() {
  try {
    if (!window.desaDb) {
      console.warn("Firestore belum siap, gunakan state default.");
      return;
    }

    const docRef = window.desaDb
      .collection(COLLECTION_NAME)
      .doc(DOCUMENT_ID);
    const snap = await docRef.get();

    if (!snap.exists) {
      return;
    }

    const state = snap.data();

        if (typeof state.heroImageUrl === "string") {
      heroImageUrl = state.heroImageUrl;
    }

    // 🔽 logo
    if (typeof state.logoImageUrl === "string") {
      logoImageUrl = state.logoImageUrl;
    }

    if (typeof state.aboutDescription === "string") {
      aboutDescription = state.aboutDescription;
    }
    if (typeof state.activitiesDescription === "string") {
      activitiesDescription = state.activitiesDescription;
    }

        if (Array.isArray(state.galleryItems) && state.galleryItems.length > 0) {
      galleryItems.length = 0;
      state.galleryItems.forEach((item) => {
        if (item && typeof item.id === "number") {
          galleryItems.push({
            id: item.id,
            // 🔽 kalau data lama belum punya sectionId, anggap masuk bagian 1
            sectionId: typeof item.sectionId === "number" ? item.sectionId : 1,
            imageUrl: item.imageUrl || "",
            caption: item.caption || "",
          });
        }
      });
    }

            if (state.calendarEvents && typeof state.calendarEvents === "object") {
      // kosongkan dulu objek lokal biar gak nyangkut data lama
      Object.keys(calendarEvents).forEach((k) => delete calendarEvents[k]);

      Object.keys(state.calendarEvents).forEach((k) => {
        calendarEvents[k] = Array.isArray(state.calendarEvents[k])
          ? state.calendarEvents[k]
          : [];
      });
    }

        // 🔽 load bagian dokumentasi (sections)
    if (Array.isArray(state.docSections) && state.docSections.length > 0) {
      docSections = state.docSections
        .filter((s) => s && typeof s.id === "number")
        .map((s) => ({
          id: s.id,
          title: s.title || "Bagian Tanpa Judul",
        }));
    } else {
      // fallback default satu bagian
      docSections = [{ id: 1, title: defaultConfig.gallery_title }];
    }

    if (typeof state.activeSectionId === "number") {
      activeSectionId = state.activeSectionId;
    } else {
      activeSectionId = docSections[0]?.id || 1;
    }

    // 🔽 BERSIHKAN FOTO YANG SECTION-NYA SUDAH TIDAK ADA
    if (Array.isArray(galleryItems) && galleryItems.length > 0) {
      const validSectionIds = new Set(docSections.map((s) => s.id));
      let removedSomething = false;

      for (let i = galleryItems.length - 1; i >= 0; i--) {
        const sid = galleryItems[i].sectionId;
        // kalau sectionId bukan number, atau id-nya tidak ditemukan di docSections → buang
        if (typeof sid !== "number" || !validSectionIds.has(sid)) {
          galleryItems.splice(i, 1);
          removedSomething = true;
        }
      }

      // kalau ada yang dibersihkan, langsung simpan state baru (sekali saja)
      if (removedSomething) {
        await saveState();
      }
    }

        if (typeof state.isLightTheme === "boolean") {
      isLightTheme = state.isLightTheme;
    }

    if (typeof state.currentYear === "number") {
      currentYear = state.currentYear;
    }

    if (typeof state.currentMonth === "number") {
      currentMonth = state.currentMonth;
    }


  } catch (err) {
    console.error("Gagal load state dari Firestore:", err);
  }
}

async function saveState() {
  try {
    if (!window.desaDb) {
      console.warn("Firestore belum siap, state tidak disimpan ke server.");
      return;
    }

    // 🔽 bersihkan calendarEvents: hanya kirim tanggal yang ada kegiatannya
    const cleanCalendarEvents = {};
    Object.keys(calendarEvents).forEach((k) => {
      const arr = calendarEvents[k];
      if (Array.isArray(arr) && arr.length > 0) {
        cleanCalendarEvents[k] = arr;
      }
    });
            const state = {
      heroImageUrl,
      // 🔽 simpan logo juga
      logoImageUrl,
      aboutDescription,
      activitiesDescription,
      galleryItems,
            calendarEvents: cleanCalendarEvents,
      isLightTheme,
      currentYear,
      currentMonth,   // 🔽 simpan bulan terakhir

      // 🔽 bagian dokumentasi
      docSections,
      activeSectionId,

    };

    const docRef = window.desaDb
      .collection(COLLECTION_NAME)
      .doc(DOCUMENT_ID);

    // ⬇️ PENTING: overwrite penuh dokumen, tanpa merge
    await docRef.set(state);

    // (opsional) debug:
    // console.log("STATE TERSIMPAN:", state);
  } catch (err) {
    console.error("Gagal save state ke Firestore:", err);
  }
}




// ===================== UTIL SVG & PATTERN =====================
function createModernIcon() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("w-12", "h-12");

  const circle1 = document.createElementNS(svgNS, "circle");
  circle1.setAttribute("cx", "50");
  circle1.setAttribute("cy", "50");
  circle1.setAttribute("r", "35");
  circle1.setAttribute("fill", "none");
  circle1.setAttribute("stroke", "#10b981");
  circle1.setAttribute("stroke-width", "3");
  svg.appendChild(circle1);

  const circle2 = document.createElementNS(svgNS, "circle");
  circle2.setAttribute("cx", "50");
  circle2.setAttribute("cy", "50");
  circle2.setAttribute("r", "25");
  circle2.setAttribute("fill", "none");
  circle2.setAttribute("stroke", "#3b82f6");
  circle2.setAttribute("stroke-width", "2");
  svg.appendChild(circle2);

  const rect1 = document.createElementNS(svgNS, "rect");
  rect1.setAttribute("x", "35");
  rect1.setAttribute("y", "35");
  rect1.setAttribute("width", "30");
  rect1.setAttribute("height", "30");
  rect1.setAttribute("rx", "3");
  rect1.setAttribute("fill", "#10b981");
  rect1.setAttribute("opacity", "0.3");
  svg.appendChild(rect1);

  const line1 = document.createElementNS(svgNS, "line");
  line1.setAttribute("x1", "50");
  line1.setAttribute("y1", "20");
  line1.setAttribute("x2", "50");
  line1.setAttribute("y2", "80");
  line1.setAttribute("stroke", "#3b82f6");
  line1.setAttribute("stroke-width", "2");
  svg.appendChild(line1);

  const line2 = document.createElementNS(svgNS, "line");
  line2.setAttribute("x1", "20");
  line2.setAttribute("y1", "50");
  line2.setAttribute("x2", "80");
  line2.setAttribute("y2", "50");
  line2.setAttribute("stroke", "#3b82f6");
  line2.setAttribute("stroke-width", "2");
  svg.appendChild(line2);

  return svg;
}

function createRiceFieldSVG() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("w-full", "h-full", "opacity-10", "absolute", "inset-0");

  for (let i = 0; i < 15; i++) {
    const x = (i % 5) * 40 + 10;
    const y = Math.floor(i / 5) * 60 + 20;

    const stem = document.createElementNS(svgNS, "line");
    stem.setAttribute("x1", x);
    stem.setAttribute("y1", y + 30);
    stem.setAttribute("x2", x);
    stem.setAttribute("y2", y);
    stem.setAttribute("stroke", "#22c55e");
    stem.setAttribute("stroke-width", "2");
    svg.appendChild(stem);

    for (let j = 0; j < 3; j++) {
      const grain = document.createElementNS(svgNS, "circle");
      grain.setAttribute("cx", x + (j - 1) * 3);
      grain.setAttribute("cy", y - j * 3);
      grain.setAttribute("r", "2");
      grain.setAttribute("fill", "#fbbf24");
      svg.appendChild(grain);
    }
  }

  return svg;
}

function createBatikPattern() {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("w-full", "h-full", "opacity-5", "absolute", "inset-0");

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const x = i * 40 + 20;
      const y = j * 40 + 20;

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "15");
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "#fbbf24");
      circle.setAttribute("stroke-width", "1");
      svg.appendChild(circle);

      const innerCircle = document.createElementNS(svgNS, "circle");
      innerCircle.setAttribute("cx", x);
      innerCircle.setAttribute("cy", y);
      innerCircle.setAttribute("r", "8");
      innerCircle.setAttribute("fill", "none");
      innerCircle.setAttribute("stroke", "#22c55e");
      innerCircle.setAttribute("stroke-width", "1");
      svg.appendChild(innerCircle);
    }
  }

  return svg;
}

// ===================== BUILD STATIC LAYOUT =====================
function buildStaticLayout() {
  const root = document.getElementById("app-root");
  root.className = "h-full w-full";

  const wrapper = document.createElement("div");
  wrapper.id = "main-wrapper";
  wrapper.className =
    "h-full w-full flex flex-col overflow-auto transition-colors duration-500 relative";

  // background pattern
  wrapper.appendChild(createBatikPattern());

  // rain
  const rainContainer = document.createElement("div");
  rainContainer.className =
    "fixed inset-0 pointer-events-none z-0 overflow-hidden";
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement("div");
    drop.className = "rain-drop";
    drop.style.left = Math.random() * 100 + "%";
    drop.style.animationDuration = Math.random() * 1 + 1 + "s";
    drop.style.animationDelay = Math.random() * 2 + "s";
    rainContainer.appendChild(drop);
  }
  wrapper.appendChild(rainContainer);

  // grass
  const grassContainer = document.createElement("div");
  grassContainer.className =
    "fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-0 overflow-hidden";
  for (let i = 0; i < 80; i++) {
    const blade = document.createElement("div");
    blade.className = "grass-blade";
    blade.style.left = i * 1.25 + "%";
    blade.style.height = Math.random() * 40 + 20 + "px";
    blade.style.animationDuration = Math.random() * 2 + 3 + "s";
    blade.style.animationDelay = Math.random() * 2 + "s";
    blade.style.opacity = Math.random() * 0.3 + 0.1;
    grassContainer.appendChild(blade);
  }
  wrapper.appendChild(grassContainer);

  // ===== HEADER =====
const header = document.createElement("header");
header.className =
  "w-full z-10 backdrop-blur-md bg-opacity-90 shadow-lg md:sticky md:top-0";

  const navBar = document.createElement("nav");
  navBar.className = "w-full border-b border-yellow-500/20";

  const navInner = document.createElement("div");
navInner.className =
  // padding & gap di-press sedikit
  "max-w-7xl mx-auto px-4 py-2 md:px-6 md:py-4 flex items-center justify-between gap-2 md:gap-4";

  const brandWrap = document.createElement("div");
  brandWrap.className = "flex items-center gap-4";

      const iconWrap = document.createElement("div");
  iconWrap.className =
    // kasih ukuran fix biar bener-bener bulat
    "w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center shadow-lg float-animation relative overflow-hidden";

  // 🔽 IMG LOGO (kalau user upload)
  const logoImg = document.createElement("img");
  logoImg.id = "desa-logo-img";
  logoImg.className =
    // selalu isi penuh lingkaran tapi tetap jaga rasio
    "w-full h-full rounded-full object-contain hidden";
  logoImg.alt = "Logo Perumahan";
  iconWrap.appendChild(logoImg);

  // 🔽 ICON DEFAULT (kalau belum ada logo)
  const defaultIcon = createModernIcon();
  defaultIcon.id = "desa-logo-default";
  // samakan ukurannya dengan container
  defaultIcon.classList.remove("w-12", "h-12");
  defaultIcon.classList.add("w-full", "h-full");
  iconWrap.appendChild(defaultIcon);

  // 🔽 klik bulatan ini untuk ganti logo (hanya saat mode edit)
  iconWrap.style.cursor = "pointer";
  iconWrap.addEventListener("click", () => {
    if (hasGalleryEditAccess) {
      editLogoImage();
    }
  });

  const brandText = document.createElement("div");
  brandText.className = "flex flex-col";

  const titleEl = document.createElement("h1");
titleEl.id = "header-title";
titleEl.className =
  "text-lg md:text-2xl font-bold tracking-tight leading-snug fade-up";

const subtitleEl = document.createElement("p");
subtitleEl.id = "header-subtitle";
subtitleEl.className =
  "text-xs md:text-base opacity-90 mt-0.5 max-w-2xl leading-snug fade-up fade-up-delay-1";

  subtitleEl.textContent = defaultConfig.header_subtitle;

  brandText.appendChild(titleEl);
  brandText.appendChild(subtitleEl);

  brandWrap.appendChild(iconWrap);
  brandWrap.appendChild(brandText);

  const themeToggle = document.createElement("button");
themeToggle.id = "theme-toggle";
themeToggle.type = "button";
themeToggle.className =
  // disembunyikan di HP, tampil di md ke atas
  "hidden md:inline-flex focus-outline px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-xs md:text-sm";

  themeToggle.setAttribute("aria-label", "Ganti tema terang/gelap");
themeToggle.textContent = "🌙 Mode Terang";

  navInner.appendChild(brandWrap);
  navInner.appendChild(themeToggle);
  navBar.appendChild(navInner);

  // menu bar
  const menuBar = document.createElement("div");
  menuBar.className =
    "w-full bg-gradient-to-r from-yellow-500/10 to-green-500/10";

  const menuInner = document.createElement("div");
menuInner.className =
  "max-w-7xl mx-auto px-4 py-2 md:px-6 md:py-3 flex items-center justify-between gap-2 md:gap-4";


  const menuLeft = document.createElement("div");
  menuLeft.className = "flex items-center gap-3";

  const profileBtn = document.createElement("button");
profileBtn.id = "nav-profile";
profileBtn.type = "button";
profileBtn.className =
  "focus-outline px-4 py-2 md:px-6 md:py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 text-xs md:text-sm";

  profileBtn.textContent = "🏡 Profil Perumahan";

  const calendarBtn = document.createElement("button");
calendarBtn.id = "nav-calendar";
calendarBtn.type = "button";
calendarBtn.className =
  "focus-outline px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 text-xs md:text-sm";

  calendarBtn.textContent = "📅 Kalender Kegiatan";

  menuLeft.appendChild(profileBtn);
  menuLeft.appendChild(calendarBtn);

  const editGalleryBtn = document.createElement("button");
editGalleryBtn.id = "edit-gallery-toggle";
editGalleryBtn.type = "button";
editGalleryBtn.className =
  "focus-outline px-4 py-2 md:px-5 md:py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 text-xs md:text-sm";

  editGalleryBtn.textContent = "🔒 Mode Edit";

  menuInner.appendChild(menuLeft);
  menuInner.appendChild(editGalleryBtn);
  menuBar.appendChild(menuInner);

  header.appendChild(navBar);
  header.appendChild(menuBar);

  // ===== MAIN =====
  const main = document.createElement("main");
  main.className = "flex-1 w-full";
  const mainInner = document.createElement("div");
  mainInner.className =
    "max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16";

  const profileSection = document.createElement("section");
  profileSection.id = "section-profile";
  profileSection.setAttribute("aria-labelledby", "about-title");
  profileSection.className = "flex flex-col gap-12";

  // hero
  const heroImageContainer = document.createElement("div");
heroImageContainer.id = "hero-image-container";
heroImageContainer.className =
  "w-full rounded-3xl overflow-hidden shadow-2xl relative fade-up";

const heroHeight = window.innerWidth < 640 ? "260px" : "380px";
heroImageContainer.style.height = heroHeight;


  const heroGradient = document.createElement("div");
  heroGradient.id = "hero-gradient";
  heroGradient.className =
    "absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-blue-500/20 to-purple-500/30";

  const heroPattern = document.createElement("div");
  heroPattern.id = "hero-pattern";
  heroPattern.className = "absolute inset-0";
  heroPattern.appendChild(createRiceFieldSVG());

  const heroOverlay = document.createElement("div");
  heroOverlay.className =
    "absolute inset-0 flex items-center justify-center bg-black/20";

  const heroContent = document.createElement("div");
  heroContent.className = "text-center z-10 px-6";

  const heroTitle = document.createElement("h2");
  heroTitle.className =
    "text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg";
  heroTitle.textContent = "Selamat Datang";

  const heroDesc = document.createElement("p");
  heroDesc.className =
    "text-lg md:text-xl text-white/95 drop-shadow-md max-w-2xl mx-auto";
  heroDesc.textContent = "";

  heroContent.appendChild(heroTitle);
  heroContent.appendChild(heroDesc);

  heroOverlay.appendChild(heroContent);
  heroImageContainer.appendChild(heroGradient);
  heroImageContainer.appendChild(heroPattern);
  heroImageContainer.appendChild(heroOverlay);

  // about & activities
  const contentGrid = document.createElement("div");
  contentGrid.className =
    "grid grid-cols-1 md:grid-cols-2 gap-8 fade-up fade-up-delay-2";

  // about card
  const aboutCard = document.createElement("div");
  aboutCard.className =
    "rounded-2xl p-8 shadow-xl relative overflow-hidden";

  const aboutBg = document.createElement("div");
  aboutBg.className = "absolute inset-0 opacity-5";
  aboutBg.appendChild(createBatikPattern());
  aboutCard.appendChild(aboutBg);

  const aboutContent = document.createElement("div");
  aboutContent.className = "relative z-10";

  const aboutIcon = document.createElement("div");
  aboutIcon.className = "text-4xl mb-4";
  aboutIcon.textContent = "🏘️";

  const aboutTitle = document.createElement("h3");
  aboutTitle.id = "about-title";
  aboutTitle.className = "text-2xl font-bold mb-4";
  aboutTitle.textContent = defaultConfig.about_title;

  const aboutBody = document.createElement("p");
  aboutBody.id = "about-body";
  aboutBody.className = "text-base leading-relaxed opacity-90";
  aboutBody.textContent = aboutDescription;

  const aboutEditBtn = document.createElement("button");
  aboutEditBtn.id = "edit-about-btn";
  aboutEditBtn.type = "button";
  aboutEditBtn.className =
    "hidden focus-outline mt-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-all";
  aboutEditBtn.textContent = "✏️ Edit Keterangan";

  aboutContent.appendChild(aboutIcon);
  aboutContent.appendChild(aboutTitle);
  aboutContent.appendChild(aboutBody);
  aboutContent.appendChild(aboutEditBtn);
  aboutCard.appendChild(aboutContent);

  // activities card
  const activitiesCard = document.createElement("div");
  activitiesCard.className =
    "rounded-2xl p-8 shadow-xl relative overflow-hidden";

  const actBg = document.createElement("div");
  actBg.className = "absolute inset-0 opacity-5";
  actBg.appendChild(createBatikPattern());
  activitiesCard.appendChild(actBg);

  const actContent = document.createElement("div");
  actContent.className = "relative z-10";

  const actIcon = document.createElement("div");
  actIcon.className = "text-4xl mb-4";
  actIcon.textContent = "🤝";

  const activitiesTitle = document.createElement("h3");
  activitiesTitle.id = "activities-title";
  activitiesTitle.className = "text-2xl font-bold mb-4";
  activitiesTitle.textContent = defaultConfig.activities_title;

  const activitiesBody = document.createElement("p");
  activitiesBody.id = "activities-body";
  activitiesBody.className = "text-base leading-relaxed opacity-90";
  activitiesBody.textContent = activitiesDescription;

  const actEditBtn = document.createElement("button");
  actEditBtn.id = "edit-activities-btn";
  actEditBtn.type = "button";
  actEditBtn.className =
    "hidden focus-outline mt-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:scale-105 transition-all";
  actEditBtn.textContent = "✏️ Edit Keterangan";

  actContent.appendChild(actIcon);
  actContent.appendChild(activitiesTitle);
  actContent.appendChild(activitiesBody);
  actContent.appendChild(actEditBtn);
  activitiesCard.appendChild(actContent);

  contentGrid.appendChild(aboutCard);
  contentGrid.appendChild(activitiesCard);

    // gallery section
  const gallerySection = document.createElement("section");
  gallerySection.className = "fade-up fade-up-delay-3";
  gallerySection.setAttribute("aria-labelledby", "gallery-title");

  // 🔽 BAR BAGIAN DOKUMENTASI
  const sectionManager = document.createElement("div");
  sectionManager.id = "section-manager";
  sectionManager.className = "mb-4 flex flex-col gap-3";

  const sectionRow = document.createElement("div");
  sectionRow.className = "flex flex-wrap items-center gap-2";

  const sectionLabel = document.createElement("p");
  sectionLabel.className = "text-sm font-semibold";
  sectionLabel.textContent = "Bagian Dokumentasi:";

  const sectionButtonsWrap = document.createElement("div");
  sectionButtonsWrap.id = "section-buttons-wrap";
  sectionButtonsWrap.className = "flex flex-wrap items-center gap-2";

  sectionRow.appendChild(sectionLabel);
  sectionRow.appendChild(sectionButtonsWrap);

  const sectionAdminRow = document.createElement("div");
  sectionAdminRow.id = "section-admin-row";
  sectionAdminRow.className =
    "hidden flex flex-wrap items-center gap-2";

  const addSectionBtn = document.createElement("button");
  addSectionBtn.id = "add-section-btn";
  addSectionBtn.type = "button";
  addSectionBtn.className =
    "focus-outline px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-md transition-all hover:scale-105";
  addSectionBtn.textContent = "➕ Tambah Bagian";

  const deleteSectionBtn = document.createElement("button");
  deleteSectionBtn.id = "delete-section-btn";
  deleteSectionBtn.type = "button";
  deleteSectionBtn.className =
    "focus-outline px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-md transition-all hover:scale-105";
  deleteSectionBtn.textContent = "🗑️ Hapus Bagian Ini";

  sectionAdminRow.appendChild(addSectionBtn);
  sectionAdminRow.appendChild(deleteSectionBtn);

  sectionManager.appendChild(sectionRow);
  sectionManager.appendChild(sectionAdminRow);

  // header galeri
  const galleryHeader = document.createElement("div");
  galleryHeader.className = "flex items-center gap-3 mb-6";

  const galleryIcon = document.createElement("span");
  galleryIcon.className = "text-3xl";
  galleryIcon.textContent = "📸";

  const galleryTitle = document.createElement("h2");
  galleryTitle.id = "gallery-title";
  galleryTitle.className = "text-2xl md:text-3xl font-bold";
  galleryTitle.textContent = defaultConfig.gallery_title;

  galleryHeader.appendChild(galleryIcon);
  galleryHeader.appendChild(galleryTitle);

  const galleryContainer = document.createElement("div");
  galleryContainer.id = "gallery-container";
  galleryContainer.className = "grid grid-cols-1 md:grid-cols-3 gap-6";

  // susunan dalam section
  gallerySection.appendChild(sectionManager);
  gallerySection.appendChild(galleryHeader);
  gallerySection.appendChild(galleryContainer);

  profileSection.appendChild(heroImageContainer);
  profileSection.appendChild(contentGrid);
  profileSection.appendChild(gallerySection);


  // calendar section
  const calendarSection = document.createElement("section");
  calendarSection.id = "section-calendar";
  calendarSection.setAttribute("aria-labelledby", "calendar-section-title");
  calendarSection.className = "hidden flex-col gap-8 fade-up";

  const calHeader = document.createElement("div");
  calHeader.className =
    "flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl p-6 shadow-lg";

  const calTitleBlock = document.createElement("div");
  calTitleBlock.className = "flex items-center gap-3";

  const calIcon = document.createElement("span");
  calIcon.className = "text-3xl";
  calIcon.textContent = "📅";

  const calTextBlock = document.createElement("div");

  const calTitle = document.createElement("h2");
  calTitle.id = "calendar-section-title";
  calTitle.className = "text-2xl md:text-3xl font-bold";
  calTitle.textContent = defaultConfig.calendar_section_title;

  const calIntro = document.createElement("p");
  calIntro.id = "calendar-intro";
  calIntro.className = "text-sm opacity-80 mt-1 max-w-2xl";
  calIntro.textContent = defaultConfig.calendar_intro_text;

  calTextBlock.appendChild(calTitle);
  calTextBlock.appendChild(calIntro);
  calTitleBlock.appendChild(calIcon);
  calTitleBlock.appendChild(calTextBlock);

      const calControls = document.createElement("div");
  // 🔽 2 baris: baris 1 = tahun, baris 2 = bulan + mode edit
  calControls.className = "flex flex-col gap-2";

  // ===== ROW 1: TAHUN LALU - 2025 - TAHUN DEPAN =====
  const yearPrev = document.createElement("button");
  yearPrev.id = "calendar-prev-year";
  yearPrev.type = "button";
  yearPrev.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105 text-xs md:text-sm";
  yearPrev.textContent = "← Tahun Lalu";

  const yearLabel = document.createElement("input");
  yearLabel.id = "calendar-year-label";
  yearLabel.type = "number";
  yearLabel.className =
    "px-6 py-2 rounded-full font-bold shadow-lg text-sm md:text-base text-center";
  yearLabel.value = currentYear.toString();
  yearLabel.setAttribute("min", "1900");
  yearLabel.setAttribute("max", "3000");
  yearLabel.setAttribute("aria-label", "Pilih tahun kalender");

  const yearNext = document.createElement("button");
  yearNext.id = "calendar-next-year";
  yearNext.type = "button";
  yearNext.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105 text-xs md:text-sm";
  yearNext.textContent = "Tahun Depan →";

  const yearRow = document.createElement("div");
  yearRow.className =
    "flex flex-wrap items-center justify-center md:justify-end gap-2";
  yearRow.appendChild(yearPrev);
  yearRow.appendChild(yearLabel);
  yearRow.appendChild(yearNext);

  // ===== ROW 2: PILIH BULAN + MODE EDIT =====
  // dropdown / tombol pilih bulan
  const monthSelect = document.createElement("select");
monthSelect.id = "calendar-month-select";
monthSelect.className =
  "px-4 py-2 rounded-full text-xs md:text-sm font-semibold border-2 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-0 bg-transparent md:hidden";

  monthNames.forEach((name, index) => {
    const opt = document.createElement("option");
    opt.value = String(index);
    opt.textContent = name;
    monthSelect.appendChild(opt);
  });

  // set awal ke currentMonth (global yang sudah kita pakai di renderCalendarYear)
  monthSelect.value = String(typeof currentMonth === "number" ? currentMonth : 0);

  const editButton = document.createElement("button");
  editButton.id = "calendar-edit-toggle";
  editButton.type = "button";
  editButton.className =
    "focus-outline px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-xs md:text-sm";
  editButton.textContent = "🔒 Mode Edit";

  const bottomRow = document.createElement("div");
  bottomRow.className =
    "flex flex-wrap items-center justify-center md:justify-end gap-2";
  bottomRow.appendChild(monthSelect);
  bottomRow.appendChild(editButton);

  calControls.appendChild(yearRow);
  calControls.appendChild(bottomRow);

  calHeader.appendChild(calTitleBlock);
  calHeader.appendChild(calControls);

  // simpan referensi (⤵ penting!)
  uiRefs.calendarYearLabel = yearLabel;
  uiRefs.calendarPrevYearBtn = yearPrev;
  uiRefs.calendarNextYearBtn = yearNext;
  uiRefs.calendarMonthSelect = monthSelect;


  const calendarGridContainer = document.createElement("div");
  calendarGridContainer.id = "calendar-grid-container";
  calendarGridContainer.className =
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  calendarSection.appendChild(calHeader);
  calendarSection.appendChild(calendarGridContainer);

  mainInner.appendChild(profileSection);
  mainInner.appendChild(calendarSection);
  main.appendChild(mainInner);

  // footer
  const footer = document.createElement("footer");
  footer.className =
    "w-full border-t border-yellow-500/20 mt-12 bg-gradient-to-r from-yellow-500/5 to-green-500/5";

  const footerInner = document.createElement("div");
  footerInner.className =
    "max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4";

  const footerText = document.createElement("p");
  footerText.id = "footer-text";
  footerText.className = "text-sm opacity-90 text-center md:text-left";
  footerText.textContent = defaultConfig.footer_text;

  const footerNote = document.createElement("p");
  footerNote.className = "text-xs opacity-70 text-center md:text-right";

  const igLink = document.createElement("a");
  igLink.href = "https://www.instagram.com/kknfasilkom5/";
  igLink.target = "_blank";
  igLink.rel = "noopener noreferrer";
  igLink.className = "inline-flex items-center gap-2";
  igLink.innerHTML = "📷 <span>@kknfasilkom5</span>";

  footerNote.appendChild(igLink);

  footerInner.appendChild(footerText);
  footerInner.appendChild(footerNote);
  footer.appendChild(footerInner);

    wrapper.appendChild(header);
  wrapper.appendChild(main);
  wrapper.appendChild(footer);

  // === MOBILE NAV (slide dari kiri, hanya HP) ===
  const mobileNavOverlay = document.createElement("div");
  mobileNavOverlay.id = "mobile-nav-overlay";
  mobileNavOverlay.className =
    "fixed inset-0 z-30 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 md:hidden";

  const mobileNavPanel = document.createElement("div");
  mobileNavPanel.id = "mobile-nav-panel";
  mobileNavPanel.className =
    "absolute left-0 top-0 h-full w-64 max-w-[80%] bg-slate-900 shadow-2xl transform -translate-x-full transition-transform duration-300 flex flex-col";

  const mobileNavHeader = document.createElement("div");
  mobileNavHeader.className =
    "px-5 py-4 border-b border-white/10 flex items-center gap-3";

  const mobileNavTitle = document.createElement("p");
  mobileNavTitle.className =
    "text-sm font-semibold tracking-wide text-white";
  mobileNavTitle.textContent = "Menu Perumahan";

  mobileNavHeader.appendChild(mobileNavTitle);
  mobileNavPanel.appendChild(mobileNavHeader);

    const mobileNavList = document.createElement("div");
  mobileNavList.className = "flex flex-col py-2";

  const mobileProfileBtn = document.createElement("button");
  mobileProfileBtn.type = "button";
  mobileProfileBtn.className =
    "w-full text-left px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors";
  mobileProfileBtn.textContent = "🏡 Profil Perumahan";

  const mobileCalendarBtn = document.createElement("button");
  mobileCalendarBtn.type = "button";
  mobileCalendarBtn.className =
    "w-full text-left px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors";
  mobileCalendarBtn.textContent = "📅 Kalender Kegiatan";

  // 🔽 tombol baru: Mode Edit (galeri & dokumentasi)
  const mobileEditBtn = document.createElement("button");
  mobileEditBtn.type = "button";
  mobileEditBtn.className =
    "w-full text-left px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors";
  mobileEditBtn.textContent = "🔒 Mode Edit";

  mobileNavList.appendChild(mobileProfileBtn);
  mobileNavList.appendChild(mobileCalendarBtn);
  mobileNavList.appendChild(mobileEditBtn); // 🔽 tambahin di list
  mobileNavPanel.appendChild(mobileNavList);
  mobileNavOverlay.appendChild(mobileNavPanel);
  wrapper.appendChild(mobileNavOverlay);

    // Tombol bulat “☰ Menu” di pojok kiri atas (hanya HP)
  const mobileNavFab = document.createElement("button");
  mobileNavFab.id = "mobile-nav-fab";
  mobileNavFab.type = "button";
  mobileNavFab.className =
    "fixed left-4 top-4 z-40 md:hidden px-3 py-2 rounded-full shadow-lg bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 opacity-0 pointer-events-none transition-all duration-300";
  mobileNavFab.innerHTML =
    "<span class='text-base'>☰</span><span>Menu</span>";
  wrapper.appendChild(mobileNavFab);

  // 🔥 FAB untuk toggle tema (pojok kanan atas, ikut scroll, hanya HP)
  const mobileThemeFab = document.createElement("button");
  mobileThemeFab.id = "mobile-theme-fab";
  mobileThemeFab.type = "button";
  mobileThemeFab.className =
    "fixed right-4 top-4 z-40 md:hidden px-3 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center justify-center";
  mobileThemeFab.setAttribute("aria-label", "Ganti tema terang/gelap");
  // isi awal icon-nya, nanti di-update lagi di JS
  mobileThemeFab.textContent = "🌙";
  wrapper.appendChild(mobileThemeFab);

  // baru kita tempel ke root
  root.appendChild(wrapper);

  // simpan referensi
    uiRefs.root = root;
  uiRefs.mainWrapper = wrapper;
  uiRefs.headerTitle = titleEl;
  uiRefs.headerSubtitle = subtitleEl;

  // 🔽 referensi logo
  uiRefs.logoImg = logoImg;
  uiRefs.logoDefaultIcon = defaultIcon;

  uiRefs.aboutTitle = aboutTitle;
  uiRefs.aboutBody = aboutBody;
  uiRefs.activitiesTitle = activitiesTitle;
  uiRefs.activitiesBody = activitiesBody;
    uiRefs.galleryTitle = galleryTitle;
  uiRefs.footerText = footerText;
  uiRefs.profileNavBtn = profileBtn;
  uiRefs.calendarNavBtn = calendarBtn;
  uiRefs.calendarSectionTitle = calTitle;
  uiRefs.themeToggle = themeToggle;
  uiRefs.galleryContainer = galleryContainer;
    uiRefs.calendarIntro = calIntro;
  uiRefs.calendarYearLabel = yearLabel;
  uiRefs.calendarMonthSelect = monthSelect;      // 🔽 baru
  uiRefs.calendarGridContainer = calendarGridContainer;
  uiRefs.calendarPrevYearBtn = yearPrev;
  uiRefs.calendarNextYearBtn = yearNext;


  // 🔽 referensi section manager
  uiRefs.sectionButtonsWrap = sectionButtonsWrap;
  uiRefs.sectionAdminRow = sectionAdminRow;
  uiRefs.addSectionBtn = addSectionBtn;
  uiRefs.deleteSectionBtn = deleteSectionBtn;

  // 🔽 referensi mobile nav
      uiRefs.mobileNavFab = mobileNavFab;
  uiRefs.mobileNavOverlay = mobileNavOverlay;
  uiRefs.mobileNavPanel = mobileNavPanel;
  uiRefs.mobileNavThreshold = header.offsetHeight || 240; // titik scroll kira-kira
  uiRefs.mobileProfileLink = mobileProfileBtn;
  uiRefs.mobileCalendarLink = mobileCalendarBtn;
  uiRefs.mobileEditLink = mobileEditBtn; // 🔽 simpan referensi tombol Mode Edit
  uiRefs.mobileThemeFab = mobileThemeFab;

    setupInteractions();
  setupScrollAnimations();
  renderGallery();
  renderCalendarYear(currentYear);

  // 🔽 render bagian dokumentasi pertama kali
  if (typeof renderDocSections === "function") {
    renderDocSections();
  }
}


// ===================== ANIMASI SCROLL =====================
function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  const animatedElements = document.querySelectorAll(".fade-up");
  animatedElements.forEach((el) => observer.observe(el));
}

// ===================== GALLERY =====================
function renderGallery() {
  if (!uiRefs.galleryContainer) return;
  uiRefs.galleryContainer.innerHTML = "";

  // 🔽 tentukan section aktif (fallback ke pertama kalau null)
  const currentSectionId =
    activeSectionId || (docSections[0] && docSections[0].id) || 1;

  // 🔽 filter foto berdasarkan sectionId
  const itemsForSection = galleryItems.filter(
    (item) => item.sectionId === currentSectionId
  );

  itemsForSection.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className =
      "rounded-2xl overflow-hidden shadow-xl group relative";
    itemDiv.style.height = "240px";
    itemDiv.setAttribute("data-gallery-id", item.id);

    if (item.imageUrl) {
      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.caption;
      img.className =
        "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110";
      img.onerror = function () {
        this.style.display = "none";
        const fallback = document.createElement("div");
        fallback.className =
          "absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-blue-500/30 to-purple-500/40";
        itemDiv.insertBefore(fallback, itemDiv.firstChild);
      };
      itemDiv.appendChild(img);
    } else {
      const imgBg = document.createElement("div");
      imgBg.className =
        "absolute inset-0 bg-gradient-to-br from-emerald-400/40 via-blue-500/30 to-purple-500/40 transition-transform duration-500 group-hover:scale-110";
      itemDiv.appendChild(imgBg);

      const pattern = document.createElement("div");
      pattern.className = "absolute inset-0 opacity-20";
      if (index % 2 === 0) {
        pattern.appendChild(createRiceFieldSVG());
      } else {
        pattern.appendChild(createBatikPattern());
      }
      itemDiv.appendChild(pattern);
    }

    const captionWrap = document.createElement("div");
    captionWrap.className =
      "absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent";
    const caption = document.createElement("p");
    caption.className = "w-full text-sm px-5 py-4 text-white font-medium";
    caption.textContent = item.caption;
    captionWrap.appendChild(caption);

    if (hasGalleryEditAccess) {
      const editControls = document.createElement("div");
      editControls.className =
        "absolute top-3 right-3 flex gap-2 z-10";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className =
        "focus-outline px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white shadow-lg hover:scale-105 transition-all";
      editBtn.textContent = "✏️ Edit";
      editBtn.addEventListener("click", () => editGalleryItem(item.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className =
        "focus-outline px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg hover:scale-105 transition-all";
      deleteBtn.textContent = "🗑️ Hapus";
      deleteBtn.addEventListener("click", () => deleteGalleryItem(item.id));

      editControls.appendChild(editBtn);
      editControls.appendChild(deleteBtn);
      itemDiv.appendChild(editControls);
    }

    itemDiv.appendChild(captionWrap);

    // klik kartu = preview (kecuali tombol edit/hapus)
    itemDiv.addEventListener("click", (e) => {
      if (hasGalleryEditAccess && e.target.closest("button")) {
        return;
      }
      if (item.imageUrl) {
        openImagePreview(item.imageUrl, item.caption);
      }
    });

    uiRefs.galleryContainer.appendChild(itemDiv);
  });

  // kalau admin & tidak ada foto pun, tetap tampil tombol Tambah
  if (hasGalleryEditAccess) {
    const addNewDiv = document.createElement("div");
    addNewDiv.className =
      "rounded-2xl overflow-hidden shadow-xl group relative cursor-pointer hover:scale-105 transition-all duration-300 border-4 border-dashed";
    addNewDiv.style.height = "240px";

    const addContent = document.createElement("div");
    addContent.className =
      "absolute inset-0 flex flex-col items-center justify-center gap-3";

    const addIcon = document.createElement("div");
    addIcon.className = "text-5xl";
    addIcon.textContent = "➕";

    const addText = document.createElement("p");
    addText.className = "text-lg font-semibold";
    addText.textContent = "Tambah Foto Baru";

    addContent.appendChild(addIcon);
    addContent.appendChild(addText);
    addNewDiv.appendChild(addContent);

    addNewDiv.addEventListener("click", () => addNewGalleryItem());

    uiRefs.galleryContainer.appendChild(addNewDiv);

    const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
    addNewDiv.style.borderColor =
      cfg.primary_action_color || defaultConfig.primary_action_color;
    addNewDiv.style.color =
      cfg.text_color || defaultConfig.text_color;
  }
}

function editGalleryItem(id) {
  const item = galleryItems.find((i) => i.id === id);
  if (!item) return;

  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "✏️ Edit Foto Galeri";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-4";

  // === URL FOTO ===
  const urlLabel = document.createElement("label");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Foto (opsional)";

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://example.com/image.jpg";
  urlInput.value = item.imageUrl || "";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  // === FILE BARU ===
  const fileLabel = document.createElement("label");
  fileLabel.className = "text-sm font-semibold";
  fileLabel.textContent = "Upload Foto Baru (opsional)";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  // === CAPTION ===
  const label = document.createElement("label");
  label.className = "text-sm font-semibold";
  label.textContent = "Keterangan Foto";

  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.value = item.caption || "";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  const status = document.createElement("p");
  status.className = "text-xs opacity-70 hidden";
  status.textContent = "Mengupload foto baru...";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan Perubahan";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(fileLabel);
  form.appendChild(fileInput);
  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(status);
  form.appendChild(submit);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let finalUrl = urlInput.value.trim();
    const file = fileInput.files[0];

    try {
      submit.disabled = true;

      if (file) {
        status.classList.remove("hidden");
        finalUrl = await uploadImageToCloudinary(file);
        status.classList.add("hidden");
      }

      item.imageUrl = finalUrl;
      item.caption = textarea.value.trim();

      await saveState();
      host.remove();
      renderGallery();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan.");
      submit.disabled = false;
      status.classList.add("hidden");
    }
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  panel.style.backgroundColor = cfg.surface_color || defaultConfig.surface_color;
  panel.style.color = cfg.text_color || defaultConfig.text_color;
  close.style.backgroundColor = "transparent";
  close.style.borderColor =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  close.style.color =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  urlInput.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  fileInput.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  textarea.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.backgroundColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.color = cfg.background_color || defaultConfig.background_color;
}

function deleteGalleryItem(id) {
  const index = galleryItems.findIndex((i) => i.id === id);
  if (index === -1) return;
  galleryItems.splice(index, 1);
  renderGallery();
  saveState();
}

// ⬇️ TEMPELIN FUNGSI BARU INI DI SINI
function openImagePreview(imageUrl, caption) {
  if (!imageUrl) return; // Kalau gak ada gambar, gak usah apa-apa

  const host = document.createElement("div");
  host.className =
    "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] max-w-3xl rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col gap-3";

  const headerRow = document.createElement("div");
  headerRow.className = "flex items-center justify-between gap-3 mb-2";

  const title = document.createElement("p");
  title.className = "text-sm md:text-base font-semibold";
  title.textContent = caption || "Pratinjau Foto Kegiatan";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className =
    "focus-outline px-3 py-1.5 rounded-full text-xs md:text-sm font-medium shadow-md";
  closeBtn.textContent = "Tutup ✕";
  closeBtn.addEventListener("click", () => host.remove());

  headerRow.appendChild(title);
  headerRow.appendChild(closeBtn);

  const imgWrap = document.createElement("div");
  imgWrap.className = "w-full max-h-[70vh] flex items-center justify-center";

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = caption || "Foto Kegiatan";
  img.className = "max-h-[70vh] max-w-full object-contain rounded-2xl";

  imgWrap.appendChild(img);

  if (caption) {
    const cap = document.createElement("p");
    cap.className = "text-xs md:text-sm opacity-80 mt-1";
    cap.textContent = caption;
    panel.appendChild(headerRow);
    panel.appendChild(imgWrap);
    panel.appendChild(cap);
  } else {
    panel.appendChild(headerRow);
    panel.appendChild(imgWrap);
  }

  host.appendChild(panel);
  document.body.appendChild(host);

  // Klik luar panel = close
  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  // Tema ikut config
  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const surface = cfg.surface_color || defaultConfig.surface_color;
  const textColor = cfg.text_color || defaultConfig.text_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  panel.style.backgroundColor = surface;
  panel.style.color = textColor;
  closeBtn.style.backgroundColor = "transparent";
  closeBtn.style.border = `1px solid ${secondary}`;
  closeBtn.style.color = secondary;
}


function addNewGalleryItem() {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "➕ Tambah Foto Baru";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-4";

  // === URL FOTO (opsional) ===
  const urlLabel = document.createElement("label");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Foto (opsional)";

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://example.com/image.jpg";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  // === FILE UPLOAD (opsional) ===
  const fileLabel = document.createElement("label");
  fileLabel.className = "text-sm font-semibold";
  fileLabel.textContent = "Upload Foto dari HP/Laptop (opsional)";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  // === CAPTION ===
  const captionLabel = document.createElement("label");
  captionLabel.className = "text-sm font-semibold";
  captionLabel.textContent = "Keterangan Foto";

  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.placeholder = "Masukkan keterangan foto...";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  const status = document.createElement("p");
  status.className = "text-xs opacity-70 hidden";
  status.textContent = "Mengupload foto, mohon tunggu...";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "➕ Tambahkan";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(fileLabel);
  form.appendChild(fileInput);
  form.appendChild(captionLabel);
  form.appendChild(textarea);
  form.appendChild(status);
  form.appendChild(submit);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let imageUrl = urlInput.value.trim();
    const caption = textarea.value.trim();
    const file = fileInput.files[0];

    if (!file && !imageUrl) {
      alert("Isi URL foto atau upload file salah satu ya 🙂");
      return;
    }

    try {
      submit.disabled = true;

      if (file) {
        status.classList.remove("hidden");
        imageUrl = await uploadImageToCloudinary(file);
        status.classList.add("hidden");
      }

      const newId = Math.max(...galleryItems.map((i) => i.id), 0) + 1;
      const currentSectionId =
        activeSectionId || (docSections[0] && docSections[0].id) || 1;

      galleryItems.push({
        id: newId,
        sectionId: currentSectionId,
        imageUrl,
        caption,
      });

      await saveState();
      host.remove();
      renderGallery();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan foto. Coba lagi ya.");
      submit.disabled = false;
      status.classList.add("hidden");
    }
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  panel.style.backgroundColor = cfg.surface_color || defaultConfig.surface_color;
  panel.style.color = cfg.text_color || defaultConfig.text_color;
  close.style.backgroundColor = "transparent";
  close.style.borderColor =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  close.style.color =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  urlInput.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  fileInput.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  textarea.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.backgroundColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.color = cfg.background_color || defaultConfig.background_color;
}

// ===================== HERO & DESKRIPSI =====================
function editHeroImage() {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "🖼️ Edit Foto Hero";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  const urlLabel = document.createElement("label");
  urlLabel.setAttribute("for", "hero-url-input");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Foto (https://)";

  const urlInput = document.createElement("input");
  urlInput.id = "hero-url-input";
  urlInput.type = "text";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  urlInput.placeholder = "https://example.com/image.jpg";
  urlInput.value = heroImageUrl;

  const info = document.createElement("p");
  info.className = "text-xs opacity-70";
  info.textContent =
    "Kosongkan untuk menggunakan tampilan default dengan gradient dan pattern.";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(info);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    heroImageUrl = urlInput.value.trim();
    host.remove();
    updateHeroImage();
    saveState();
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  panel.style.backgroundColor = cfg.surface_color || defaultConfig.surface_color;
  panel.style.color = cfg.text_color || defaultConfig.text_color;
  close.style.backgroundColor = "transparent";
  close.style.borderColor =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  close.style.color =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  urlInput.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.backgroundColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.color = cfg.background_color || defaultConfig.background_color;
}

function editLogoImage() {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[420px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "🪪 Ganti Logo Perumahan";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  // URL
  const urlLabel = document.createElement("label");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Logo (https://)";

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  urlInput.placeholder = "https://example.com/logo.png";
  urlInput.value = logoImageUrl || "";

  // FILE
  const fileLabel = document.createElement("label");
  fileLabel.className = "text-sm font-semibold";
  fileLabel.textContent = "Upload Logo dari HP/Laptop (opsional)";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";

  const info = document.createElement("p");
  info.className = "text-xs opacity-70";
  info.textContent =
    "Pilih salah satu: isi URL atau upload file. Logo utama sebaiknya selalu terisi.";

  const status = document.createElement("p");
  status.className = "text-xs opacity-70 hidden";
  status.textContent = "Mengupload logo, mohon tunggu...";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan Logo";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(fileLabel);
  form.appendChild(fileInput);
  form.appendChild(info);
  form.appendChild(status);
  form.appendChild(submit);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let finalUrl = urlInput.value.trim();
    const file = fileInput.files[0];

    if (!file && !finalUrl) {
      alert("Isi URL logo atau upload file salah satu ya 🙂");
      return;
    }

    try {
      submit.disabled = true;

      if (file) {
        status.classList.remove("hidden");
        finalUrl = await uploadImageToCloudinary(file);
        status.classList.add("hidden");
      }

      logoImageUrl = finalUrl;
      updateLogoImage();
      await saveState();
      host.remove();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan logo. Coba lagi ya.");
      submit.disabled = false;
      status.classList.add("hidden");
    }
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const surface = cfg.surface_color || defaultConfig.surface_color;
  const textColor = cfg.text_color || defaultConfig.text_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  panel.style.backgroundColor = surface;
  panel.style.color = textColor;
  close.style.backgroundColor = "transparent";
  close.style.borderColor = secondary;
  close.style.color = secondary;
  urlInput.style.borderColor = primary;
  fileInput.style.borderColor = primary;
  submit.style.backgroundColor = primary;
  submit.style.color = surface;
}


function updateLogoImage() {
  if (!uiRefs.logoImg || !uiRefs.logoDefaultIcon) return;

  if (logoImageUrl) {
    uiRefs.logoImg.src = logoImageUrl;
    uiRefs.logoImg.classList.remove("hidden");
    uiRefs.logoDefaultIcon.style.display = "none";
  } else {
    uiRefs.logoImg.classList.add("hidden");
    uiRefs.logoDefaultIcon.style.display = "";
  }
}

function updateHeroImage() {
  const container = document.getElementById("hero-image-container");
  if (!container) return;

  const gradient = document.getElementById("hero-gradient");
  const pattern = document.getElementById("hero-pattern");

  if (heroImageUrl) {
    if (gradient) gradient.style.display = "none";
    if (pattern) pattern.style.display = "none";

    let img = container.querySelector("img.hero-bg-image");
    if (!img) {
      img = document.createElement("img");
      img.className = "hero-bg-image absolute inset-0 w-full h-full object-cover";
      img.alt = "Hero background";
      img.onerror = function () {
        this.style.display = "none";
        if (gradient) gradient.style.display = "block";
        if (pattern) pattern.style.display = "block";
      };
      container.insertBefore(img, container.firstChild);
    }
    img.src = heroImageUrl;
    img.style.display = "block";
  } else {
    const img = container.querySelector("img.hero-bg-image");
    if (img) img.style.display = "none";
    if (gradient) gradient.style.display = "block";
    if (pattern) pattern.style.display = "block";
  }
}

function editAboutDescription() {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "✏️ Edit Tentang Perumahan";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  const label = document.createElement("label");
  label.setAttribute("for", "about-desc-input");
  label.className = "text-sm font-semibold";
  label.textContent = "Deskripsi";

  const textarea = document.createElement("textarea");
  textarea.id = "about-desc-input";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  textarea.rows = 5;
  textarea.value = aboutDescription;

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan";

  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    aboutDescription = textarea.value.trim();
    document.getElementById("about-body").textContent = aboutDescription;
    host.remove();
    saveState();
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  panel.style.backgroundColor = cfg.surface_color || defaultConfig.surface_color;
  panel.style.color = cfg.text_color || defaultConfig.text_color;
  close.style.backgroundColor = "transparent";
  close.style.borderColor =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  close.style.color =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  textarea.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.backgroundColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.color = cfg.background_color || defaultConfig.background_color;
}

function editActivitiesDescription() {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const title = document.createElement("h2");
  title.className = "text-lg font-bold";
  title.textContent = "✏️ Edit Kegiatan Rutin";

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(title);
  titleRow.appendChild(close);

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  const label = document.createElement("label");
  label.setAttribute("for", "activities-desc-input");
  label.className = "text-sm font-semibold";
  label.textContent = "Deskripsi";

  const textarea = document.createElement("textarea");
  textarea.id = "activities-desc-input";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  textarea.rows = 5;
  textarea.value = activitiesDescription;

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan";

  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    activitiesDescription = textarea.value.trim();
    document.getElementById("activities-body").textContent =
      activitiesDescription;
    host.remove();
    saveState();
  });

  panel.appendChild(titleRow);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  panel.style.backgroundColor = cfg.surface_color || defaultConfig.surface_color;
  panel.style.color = cfg.text_color || defaultConfig.text_color;
  close.style.backgroundColor = "transparent";
  close.style.borderColor =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  close.style.color =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;
  textarea.style.borderColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.backgroundColor =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  submit.style.color = cfg.background_color || defaultConfig.background_color;
}

// ===================== THEME & NAV =====================
function applyTheme(config) {
  const bg = config.background_color || defaultConfig.background_color;
  const surface = config.surface_color || defaultConfig.surface_color;
  const text = config.text_color || defaultConfig.text_color;
  const primary =
    config.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    config.secondary_action_color || defaultConfig.secondary_action_color;
  const fontFamily = config.font_family || defaultConfig.font_family;
  const baseSize = config.font_size || defaultConfig.font_size;

  if (!uiRefs.mainWrapper) return;

  uiRefs.mainWrapper.style.backgroundColor = bg;
  uiRefs.mainWrapper.style.color = text;
  uiRefs.mainWrapper.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;
  uiRefs.mainWrapper.style.fontSize = baseSize + "px";

  const header = uiRefs.mainWrapper.querySelector("header");
  if (header) {
    header.style.backgroundColor = bg;
    header.style.borderColor = primary + "33";
  }

  const h1 = uiRefs.mainWrapper.querySelectorAll("h1");
  h1.forEach((h) => (h.style.fontSize = baseSize * 1.5 + "px"));

  const h2 = uiRefs.mainWrapper.querySelectorAll("h2");
  h2.forEach((h) => (h.style.fontSize = baseSize * 1.4 + "px"));

  const h3 = uiRefs.mainWrapper.querySelectorAll("h3");
  h3.forEach((h) => (h.style.fontSize = baseSize * 1.2 + "px"));

  const cards = uiRefs.mainWrapper.querySelectorAll(
    ".rounded-2xl, .rounded-3xl"
  );
  cards.forEach((c) => {
    if (!c.classList.contains("overflow-hidden")) {
      c.style.backgroundColor = surface;
    }
  });

  uiRefs.themeToggle.style.backgroundColor = primary;
  uiRefs.themeToggle.style.color = bg;

    // 🔽 styling dasar tombol nav dikendalikan helper updateActiveNavStyles
  if (typeof updateActiveNavStyles === "function") {
    updateActiveNavStyles(currentActiveMenu || "profile");
  }

  const editBtn = document.getElementById("calendar-edit-toggle");
  if (editBtn) {
    editBtn.style.backgroundColor = primary;
    editBtn.style.color = bg;
  }

    const yearBtns = [uiRefs.calendarPrevYearBtn, uiRefs.calendarNextYearBtn];
  yearBtns.forEach((btn) => {
    if (btn) {
      btn.style.backgroundColor = "transparent";
      btn.style.borderColor = secondary;
      btn.style.color = secondary;
    }
  });

  if (uiRefs.calendarYearLabel) {
    uiRefs.calendarYearLabel.style.backgroundColor = surface;
    uiRefs.calendarYearLabel.style.color = primary;
    uiRefs.calendarYearLabel.style.borderColor = primary;
  }

  // 🔽 stylenya dropdown bulan (ikut tema)
  if (uiRefs.calendarMonthSelect) {
    uiRefs.calendarMonthSelect.style.backgroundColor = surface;
    uiRefs.calendarMonthSelect.style.color = text;
    uiRefs.calendarMonthSelect.style.borderColor = primary;
  }
}

function updateActiveNavStyles(activeMenu) {
  if (!uiRefs.profileNavBtn || !uiRefs.calendarNavBtn) return;

  const cfg = window.elementSdk
    ? (window.elementSdk.config || defaultConfig)
    : defaultConfig;

  const bg =
    cfg.background_color || defaultConfig.background_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  const setActive = (btn) => {
    btn.style.backgroundColor = primary;
    btn.style.color = bg;
    btn.style.borderColor = primary;
    btn.style.fontWeight = "700";
  };

  const setInactive = (btn) => {
    btn.style.backgroundColor = "transparent";
    btn.style.color = secondary;
    btn.style.borderColor = secondary;
    btn.style.fontWeight = "500";
  };

  if (activeMenu === "calendar") {
    setInactive(uiRefs.profileNavBtn);
    setActive(uiRefs.calendarNavBtn);
  } else {
    // default: profile
    setActive(uiRefs.profileNavBtn);
    setInactive(uiRefs.calendarNavBtn);
  }
}

function setActiveMenu(menu) {
  const profileSection = document.getElementById("section-profile");
  const calendarSection = document.getElementById("section-calendar");

  currentActiveMenu = menu === "calendar" ? "calendar" : "profile";

  if (currentActiveMenu === "profile") {
    profileSection.classList.remove("hidden");
    calendarSection.classList.add("hidden");
  } else {
    profileSection.classList.add("hidden");
    calendarSection.classList.remove("hidden");
  }

  if (typeof updateActiveNavStyles === "function") {
    updateActiveNavStyles(currentActiveMenu);
  }
}

// ===================== KALENDER =====================
const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function getEventsForDate(year, month, day) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  return calendarEvents[key] || [];
}

function setEventsForDate(year, month, day, events) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  if (!events || events.length === 0) {
    delete calendarEvents[key];
  } else {
    calendarEvents[key] = events;
  }
}

// 🔽 render satu kartu bulan
function renderMonthCard(year, month) {
  const monthCard = document.createElement("div");
  monthCard.className =
    "calendar-month-card rounded-2xl p-5 shadow-xl relative overflow-hidden";

  const monthHeader = document.createElement("div");
  monthHeader.className =
    "flex items-center justify-between mb-4 relative z-10";

  const monthNameWrap = document.createElement("div");
  monthNameWrap.className = "flex items-center gap-2";

  const monthIcon = document.createElement("span");
  monthIcon.className = "text-xl";
  const icons = ["🌙", "🌸", "🌱", "🌼", "☀️", "🌻", "🌾", "🍂", "🍁", "🌰", "❄️", "⛄"];
  monthIcon.textContent = icons[month];

  const mName = document.createElement("p");
  mName.className = "text-base font-bold uppercase tracking-wide";
  mName.textContent = monthNames[month];

  monthNameWrap.appendChild(monthIcon);
  monthNameWrap.appendChild(mName);

  const countLabel = document.createElement("span");
  countLabel.className = "text-xs px-3 py-1 rounded-full font-semibold";
  let countEvents = 0;
  Object.keys(calendarEvents).forEach((k) => {
    if (k.startsWith(`${year}-${String(month + 1).padStart(2, "0")}-`)) {
      countEvents += calendarEvents[k].length;
    }
  });
  countLabel.textContent =
    countEvents > 0 ? `${countEvents} kegiatan` : "Kosong";

  monthHeader.appendChild(monthNameWrap);
  monthHeader.appendChild(countLabel);

  const weekRow = document.createElement("div");
  weekRow.className =
    "grid grid-cols-7 gap-1 text-xs font-semibold mb-2 opacity-70";
  ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].forEach((d) => {
    const w = document.createElement("div");
    w.className = "text-center";
    w.textContent = d;
    weekRow.appendChild(w);
  });

  const daysGrid = document.createElement("div");
  daysGrid.className = "grid grid-cols-7 gap-1.5";

  const firstDay = new Date(year, month, 1);
  let startIndex = firstDay.getDay();
  if (startIndex === 0) startIndex = 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i < startIndex; i++) {
    const empty = document.createElement("div");
    empty.className = "h-9";
    daysGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateBtn = document.createElement("button");
    dateBtn.type = "button";
    dateBtn.className =
      "focus-outline h-9 rounded-lg text-xs font-medium flex items-center justify-center transition-all duration-300 hover:scale-110";
    dateBtn.setAttribute("data-year", year.toString());
    dateBtn.setAttribute("data-month", month.toString());
    dateBtn.setAttribute("data-day", day.toString());

    const hasEvents = getEventsForDate(year, month, day).length > 0;
    if (hasEvents) {
      dateBtn.classList.add("ring-2", "font-bold");
    }

    dateBtn.textContent = day.toString();

    dateBtn.addEventListener("click", () => {
      onCalendarDateClick(year, month, day);
    });

    daysGrid.appendChild(dateBtn);
  }

  monthCard.appendChild(monthHeader);
  monthCard.appendChild(weekRow);
  monthCard.appendChild(daysGrid);

  return monthCard;
}

function renderCalendarYear(year) {
  if (!uiRefs.calendarGridContainer) return;
  uiRefs.calendarGridContainer.innerHTML = "";

  // update label tahun
  if (uiRefs.calendarYearLabel) {
    if (uiRefs.calendarYearLabel.tagName === "INPUT") {
      uiRefs.calendarYearLabel.value = year.toString();
    } else {
      uiRefs.calendarYearLabel.textContent = year.toString();
    }
  }

  // kalau ada select bulan, sync value-nya
  if (uiRefs.calendarMonthSelect) {
    uiRefs.calendarMonthSelect.value = String(currentMonth);
  }

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // 🔽 HP: cuma tampilkan 1 bulan (currentMonth)
    const monthCard = renderMonthCard(year, currentMonth);
    uiRefs.calendarGridContainer.appendChild(monthCard);
  } else {
    // 🔽 Desktop/Tablet: 12 bulan penuh
    for (let month = 0; month < 12; month++) {
      const monthCard = renderMonthCard(year, month);
      uiRefs.calendarGridContainer.appendChild(monthCard);
    }
  }

  const configNow = window.elementSdk ? window.elementSdk.config : defaultConfig;
  applyCalendarTheme(configNow);
}

function applyCalendarTheme(config) {
  const surface = config.surface_color || defaultConfig.surface_color;
  const text = config.text_color || defaultConfig.text_color;
  const primary =
    config.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    config.secondary_action_color || defaultConfig.secondary_action_color;

  const monthCards = document.querySelectorAll(".calendar-month-card");
  monthCards.forEach((card) => {
    card.style.backgroundColor = surface;
    card.style.color = text;

    const countLabel = card.querySelector("span.rounded-full");
    if (countLabel) {
      countLabel.style.backgroundColor = primary + "33";
      countLabel.style.color = primary;
    }

    const dateBtns = card.querySelectorAll("button");
    dateBtns.forEach((btn) => {
      btn.style.backgroundColor = "transparent";
      btn.style.color = text;
      if (btn.classList.contains("ring-2")) {
        btn.style.backgroundColor = primary + "22";
        btn.style.borderColor = primary;
        btn.style.color = primary;
      }
    });
  });
}

function onCalendarDateClick(year, month, day) {
  const events = getEventsForDate(year, month, day);
  const dateLabel = `${day} ${monthNames[month]} ${year}`;

  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[480px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const titleWrap = document.createElement("div");
  titleWrap.className = "flex items-center gap-2";

  const dateIcon = document.createElement("span");
  dateIcon.className = "text-2xl";
  dateIcon.textContent = "📅";

  const t = document.createElement("h2");
  t.className = "text-lg font-bold";
  t.textContent = dateLabel;

  titleWrap.appendChild(dateIcon);
  titleWrap.appendChild(t);

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all hover:scale-105 text-sm";
  close.textContent = "Tutup";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(titleWrap);
  titleRow.appendChild(close);

  const list = document.createElement("div");
  list.className = "flex flex-col gap-2 max-h-60 overflow-auto";

  if (events.length === 0) {
    const empty = document.createElement("p");
    empty.className = "text-sm opacity-80 text-center py-4";
    empty.textContent = "Belum ada kegiatan pada tanggal ini.";
    list.appendChild(empty);
  } else {
    events.forEach((ev) => {
      const row = document.createElement("div");
      row.className = "flex items-start gap-3 p-3 rounded-xl text-sm";

      const bullet = document.createElement("span");
      bullet.className = "text-lg";
      bullet.textContent = "✓";

      const text = document.createElement("p");
      text.textContent = ev;

      row.appendChild(bullet);
      row.appendChild(text);
      list.appendChild(row);
    });
  }

  panel.appendChild(titleRow);
  panel.appendChild(list);

  if (hasEditAccess) {
    const form = document.createElement("form");
    form.className = "flex flex-col gap-3 pt-3 border-t";

    const label = document.createElement("label");
    label.setAttribute("for", "event-note-input");
    label.className = "text-sm font-semibold flex items-center gap-2";
    label.innerHTML = "✏️ Tambah/Edit Kegiatan";

    const textarea = document.createElement("textarea");
    textarea.id = "event-note-input";
    textarea.className =
      "w-full rounded-xl px-4 py-3 text-sm bg-transparent border-2";
    textarea.rows = 4;
    textarea.placeholder =
      "Contoh: Rapat koordinasi panitia HUT RI, jam 19.30 di balai Perumahan.";
    textarea.value = events.join("\n");

    const btnRow = document.createElement("div");
    btnRow.className = "flex items-center justify-between gap-3";

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.className =
      "focus-outline px-5 py-2.5 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
    saveBtn.textContent = "💾 Simpan";

                const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className =
      "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all hover:scale-105 text-sm";
    clearBtn.textContent = "🗑️ Hapus Jadwal";
    clearBtn.addEventListener("click", () => {
      // kosongkan textarea
      textarea.value = "";

      // langsung hapus kegiatan di tanggal ini (array kosong)
      setEventsForDate(year, month, day, []);

      // simpan ke Firestore
      saveState();

      // tutup popup dan refresh tampilan kalender
      host.remove();
      renderCalendarYear(currentYear);
    });

    btnRow.appendChild(saveBtn);
    btnRow.appendChild(clearBtn);

    form.appendChild(label);
    form.appendChild(textarea);
    form.appendChild(btnRow);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lines = textarea.value
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      setEventsForDate(year, month, day, lines);
      saveState();
      host.remove();
      renderCalendarYear(currentYear);
    });

    panel.appendChild(form);

    const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
    const surface = cfg.surface_color || defaultConfig.surface_color;
    const textColor = cfg.text_color || defaultConfig.text_color;
    const primary =
      cfg.primary_action_color || defaultConfig.primary_action_color;
    const secondary =
      cfg.secondary_action_color || defaultConfig.secondary_action_color;

    textarea.style.borderColor = primary;
    textarea.style.color = textColor;
    saveBtn.style.backgroundColor = primary;
    saveBtn.style.color = surface;
    clearBtn.style.backgroundColor = "transparent";
    clearBtn.style.borderColor = secondary;
    clearBtn.style.color = secondary;
  } else {
    const info = document.createElement("p");
    info.className = "text-xs opacity-70 pt-3 border-t text-center";
    info.textContent =
      "Untuk mengedit kegiatan, gunakan tombol 'Mode Edit' dengan kata sandi perangkat Perumahan.";
    panel.appendChild(info);
  }

  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const surface = cfg.surface_color || defaultConfig.surface_color;
  const textColor = cfg.text_color || defaultConfig.text_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  panel.style.backgroundColor = surface;
  panel.style.color = textColor;
  close.style.backgroundColor = "transparent";
  close.style.borderColor = secondary;
  close.style.color = secondary;

  const eventRows = list.querySelectorAll("div");
  eventRows.forEach((row) => {
    row.style.backgroundColor = primary + "11";
    row.style.borderLeft = `3px solid ${primary}`;
  });
}

// ===================== PASSWORD PROMPT =====================
function showPasswordPrompt(callback) {
  const host = document.createElement("div");
  host.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-40 backdrop-blur-sm";

  const panel = document.createElement("div");
  panel.className =
    "w-[90%] md:w-[420px] rounded-3xl p-6 shadow-2xl flex flex-col gap-4";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");

  const titleRow = document.createElement("div");
  titleRow.className = "flex items-center justify-between gap-3";

  const titleWrap = document.createElement("div");
  titleWrap.className = "flex items-center gap-2";

  const lockIcon = document.createElement("span");
  lockIcon.className = "text-2xl";
  lockIcon.textContent = "🔐";

  const t = document.createElement("h2");
  t.className = "text-lg font-bold";
  t.textContent = "Masuk Mode Edit";

  titleWrap.appendChild(lockIcon);
  titleWrap.appendChild(t);

  const close = document.createElement("button");
  close.type = "button";
  close.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md text-sm";
  close.textContent = "Batal";
  close.addEventListener("click", () => host.remove());

  titleRow.appendChild(titleWrap);
  titleRow.appendChild(close);

  const info = document.createElement("p");
  info.className = "text-sm opacity-80";
  info.textContent =
    "Masukkan kata sandi khusus perangkat Perumahan untuk mengaktifkan mode edit.";

  const form = document.createElement("form");
  form.className = "flex flex-col gap-3";

  const label = document.createElement("label");
  label.setAttribute("for", "calendar-password");
  label.className = "text-sm font-semibold";
  label.textContent = "Kata Sandi";

  const input = document.createElement("input");
  input.id = "calendar-password";
  input.type = "text";
  input.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  input.placeholder = "Masukkan kata sandi";

  const errorMsg = document.createElement("p");
  errorMsg.className = "text-sm text-red-400 hidden font-medium";
  errorMsg.textContent = "❌ Kata sandi salah. Silakan coba lagi.";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "🔓 Masuk";

  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(errorMsg);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value === EDIT_PASSWORD) {
      host.remove();
      if (typeof callback === "function") callback(true);
    } else {
      errorMsg.classList.remove("hidden");
    }
  });

  panel.appendChild(titleRow);
  panel.appendChild(info);
  panel.appendChild(form);
  host.appendChild(panel);
  document.body.appendChild(host);

  host.addEventListener("click", (e) => {
    if (e.target === host) host.remove();
  });

  const cfg = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const surface = cfg.surface_color || defaultConfig.surface_color;
  const text = cfg.text_color || defaultConfig.text_color;
  const primary =
    cfg.primary_action_color || defaultConfig.primary_action_color;
  const secondary =
    cfg.secondary_action_color || defaultConfig.secondary_action_color;

  panel.style.backgroundColor = surface;
  panel.style.color = text;
  close.style.backgroundColor = "transparent";
  close.style.borderColor = secondary;
  close.style.color = secondary;
  input.style.borderColor = primary;
  input.style.color = text;
  submit.style.backgroundColor = primary;
  submit.style.color = surface;

  input.focus();
}

// ===================== MOBILE NAV (HP) =====================
function openMobileNav() {
  if (!uiRefs.mobileNavOverlay || !uiRefs.mobileNavPanel) return;
  uiRefs.mobileNavOverlay.style.opacity = "1";
  uiRefs.mobileNavOverlay.style.pointerEvents = "auto";
  uiRefs.mobileNavPanel.style.transform = "translateX(0)";
}

function closeMobileNav() {
  if (!uiRefs.mobileNavOverlay || !uiRefs.mobileNavPanel) return;
  uiRefs.mobileNavOverlay.style.opacity = "0";
  uiRefs.mobileNavOverlay.style.pointerEvents = "none";
  uiRefs.mobileNavPanel.style.transform = "translateX(-100%)";
}

// helper untuk ambil posisi scroll yang bener (wrapper, bukan window)
function getScrollY() {
  if (uiRefs.mainWrapper) {
    return uiRefs.mainWrapper.scrollTop || 0;
  }
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

// ===================== INTERAKSI GLOBAL =====================

function setupInteractions() {
  // helper: update label tombol tema (desktop & mobile)
  function updateThemeButtonsLabel() {
    if (uiRefs.themeToggle) {
      uiRefs.themeToggle.textContent = isLightTheme
        ? "🌙 Mode Gelap"   // aksi berikutnya: ke gelap
        : "☀️ Mode Terang"; // aksi berikutnya: ke terang
    }
    if (uiRefs.mobileThemeFab) {
      uiRefs.mobileThemeFab.textContent = isLightTheme ? "🌙" : "☀️";
    }
  }

  function toggleTheme() {
    isLightTheme = !isLightTheme;

    if (isLightTheme) {
      const lightConfig = {
        background_color: "#f0f4f8",
        surface_color: "#ffffff",
        text_color: "#1e293b",
        primary_action_color: "#10b981",
        secondary_action_color: "#3b82f6",
      };
      Object.assign(defaultConfig, lightConfig);
    } else {
      const darkConfig = {
        background_color: "#0f172a",
        surface_color: "#1e293b",
        text_color: "#e2e8f0",
        primary_action_color: "#10b981",
        secondary_action_color: "#3b82f6",
      };
      Object.assign(defaultConfig, darkConfig);
    }

    updateThemeButtonsLabel();
    applyTheme(defaultConfig);
    renderCalendarYear(currentYear);
    saveState();
  }

  // klik tombol tema (desktop)
  if (uiRefs.themeToggle) {
    uiRefs.themeToggle.addEventListener("click", toggleTheme);
  }
  // klik tombol tema FAB di HP
  if (uiRefs.mobileThemeFab) {
    uiRefs.mobileThemeFab.addEventListener("click", toggleTheme);
  }

  // panggil sekali di awal
  updateThemeButtonsLabel();

  uiRefs.profileNavBtn.addEventListener("click", () =>
    setActiveMenu("profile")
  );
  uiRefs.calendarNavBtn.addEventListener("click", () =>
    setActiveMenu("calendar")
  );

      const editGalleryBtn = document.getElementById("edit-gallery-toggle");
  const mobileEditBtn = uiRefs.mobileEditLink;

  // 🔽 helper untuk update teks di kedua tombol
  function updateEditButtonsLabel() {
    const label = hasGalleryEditAccess ? "🔓 Mode Edit" : "🔒 Mode Edit";
    if (editGalleryBtn) editGalleryBtn.textContent = label;
    if (mobileEditBtn) mobileEditBtn.textContent = label;
  }

  // 🔽 fungsi utama toggle mode edit (dipakai desktop & mobile)
  function toggleGalleryEditMode() {
    if (!hasGalleryEditAccess) {
      // mau masuk mode edit → minta password dulu
      showPasswordPrompt((success) => {
        if (!success) return;

        hasGalleryEditAccess = true;
        updateEditButtonsLabel();

        const heroContainer = document.getElementById("hero-image-container");
        if (heroContainer) {
          let heroEditBtn = heroContainer.querySelector("#edit-hero-btn");
          if (!heroEditBtn) {
            heroEditBtn = document.createElement("button");
            heroEditBtn.id = "edit-hero-btn";
            heroEditBtn.type = "button";
            heroEditBtn.className =
              "absolute top-4 right-4 z-20 focus-outline px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 text-white shadow-lg hover:scale-105 transition-all";
            heroEditBtn.textContent = "🖼️ Edit Foto";
            heroEditBtn.addEventListener("click", editHeroImage);
            heroContainer.appendChild(heroEditBtn);
          } else {
            heroEditBtn.classList.remove("hidden");
          }
        }

        const aboutEditBtn = document.getElementById("edit-about-btn");
        if (aboutEditBtn) {
          aboutEditBtn.classList.remove("hidden");
          aboutEditBtn.addEventListener("click", editAboutDescription);
        }

        const actEditBtn = document.getElementById("edit-activities-btn");
        if (actEditBtn) {
          actEditBtn.classList.remove("hidden");
          actEditBtn.addEventListener("click", editActivitiesDescription);
        }

        renderGallery();
        if (typeof onGalleryEditModeChange === "function") {
          onGalleryEditModeChange(true);
        }
      });
    } else {
      // matikan mode edit
      hasGalleryEditAccess = false;
      updateEditButtonsLabel();

      const heroEditBtn = document.getElementById("edit-hero-btn");
      if (heroEditBtn) heroEditBtn.classList.add("hidden");

      const aboutEditBtn = document.getElementById("edit-about-btn");
      if (aboutEditBtn) aboutEditBtn.classList.add("hidden");

      const actEditBtn = document.getElementById("edit-activities-btn");
      if (actEditBtn) actEditBtn.classList.add("hidden");

      renderGallery();
      if (typeof onGalleryEditModeChange === "function") {
        onGalleryEditModeChange(false);
      }
    }
  }

  if (editGalleryBtn) {
    editGalleryBtn.addEventListener("click", toggleGalleryEditMode);
  }

  // 🔽 tombol Mode Edit di menu HP
  if (mobileEditBtn) {
    mobileEditBtn.addEventListener("click", () => {
      toggleGalleryEditMode();
      closeMobileNav(); // biar panel geser nutup setelah dipencet
    });
  }

  const editToggleBtn = document.getElementById("calendar-edit-toggle");
  editToggleBtn.addEventListener("click", () => {
    if (!hasEditAccess) {
      showPasswordPrompt((success) => {
        if (success) {
          hasEditAccess = true;
          editToggleBtn.textContent = "🔓 Keluar Mode Edit";
          renderCalendarYear(currentYear);
        }
      });
    } else {
      hasEditAccess = false;
      editToggleBtn.textContent = "🔒 Mode Edit";
      renderCalendarYear(currentYear);
    }
  });

  uiRefs.calendarPrevYearBtn.addEventListener("click", () => {
    currentYear -= 1;
    renderCalendarYear(currentYear);
    saveState();
  });

  uiRefs.calendarNextYearBtn.addEventListener("click", () => {
    currentYear += 1;
    renderCalendarYear(currentYear);
    saveState();
  });

  // 🔽 pilih bulan (khususnya untuk HP)
  if (uiRefs.calendarMonthSelect) {
    uiRefs.calendarMonthSelect.addEventListener("change", () => {
      const value = parseInt(uiRefs.calendarMonthSelect.value, 10);
      if (!isNaN(value) && value >= 0 && value <= 11) {
        currentMonth = value;
        renderCalendarYear(currentYear);
        saveState();
      }
    });
  }

  // === INPUT MANUAL TAHUN ===
  if (uiRefs.calendarYearLabel && uiRefs.calendarYearLabel.tagName === "INPUT") {
    const yearInput = uiRefs.calendarYearLabel;

    const applyYearInput = () => {
      const value = parseInt(yearInput.value, 10);
      if (!isNaN(value) && value >= 1900 && value <= 3000) {
        currentYear = value;
        renderCalendarYear(currentYear);
        saveState();
      } else {
        yearInput.value = currentYear.toString();
      }
    };

    yearInput.addEventListener("change", applyYearInput);

        yearInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        applyYearInput();
        yearInput.blur();
      }
    });
  }

  // === MOBILE NAV: klik item menu ===
  if (uiRefs.mobileProfileLink) {
    uiRefs.mobileProfileLink.addEventListener("click", () => {
      setActiveMenu("profile");
      closeMobileNav();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

    if (uiRefs.mobileCalendarLink) {
    uiRefs.mobileCalendarLink.addEventListener("click", () => {
      setActiveMenu("calendar");
      closeMobileNav();
      const calendarSection = document.getElementById("section-calendar");
      if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // === BAGIAN DOKUMENTASI (delegasi ke menu.js) ===
  if (uiRefs.addSectionBtn) {
    uiRefs.addSectionBtn.addEventListener("click", addNewSection);
  }
  if (uiRefs.deleteSectionBtn) {
    uiRefs.deleteSectionBtn.addEventListener("click", deleteCurrentSection);
  }

  // === MOBILE NAV: FAB + behaviour scroll ===
  const isMobile = () => window.innerWidth < 768;

  const updateMobileNavFab = () => {
    if (!uiRefs.mobileNavFab) return;

    // kalau sudah tablet/desktop, sembunyikan FAB + tutup menu
    if (!isMobile()) {
      uiRefs.mobileNavFab.style.opacity = "0";
      uiRefs.mobileNavFab.style.pointerEvents = "none";
      closeMobileNav();
      return;
    }

    const threshold = uiRefs.mobileNavThreshold || 240;
    const currentScroll = getScrollY();

    if (currentScroll > threshold) {
      uiRefs.mobileNavFab.style.opacity = "1";
      uiRefs.mobileNavFab.style.pointerEvents = "auto";
    } else {
      uiRefs.mobileNavFab.style.opacity = "0";
      uiRefs.mobileNavFab.style.pointerEvents = "none";
    }
  };

  if (uiRefs.mobileNavFab) {
    uiRefs.mobileNavFab.addEventListener("click", openMobileNav);
  }
  if (uiRefs.mobileNavOverlay) {
    uiRefs.mobileNavOverlay.addEventListener("click", (e) => {
      // klik area gelap di luar panel = tutup
      if (e.target === uiRefs.mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  // dengarkan scroll di wrapper (utama) dan window (cadangan)
  if (uiRefs.mainWrapper) {
    uiRefs.mainWrapper.addEventListener("scroll", updateMobileNavFab);
  }
    window.addEventListener("resize", () => {
    updateMobileNavFab();
    renderCalendarYear(currentYear); // 🔽 rerender kalender sesuai mode baru
  });

  // set awal
  updateMobileNavFab();
}


// ===================== INIT DARI CANVA / STANDALONE =====================
async function initElementSdk() {
  // load state dari Firestore dulu
  await loadState();

  if (!window.elementSdk) {
    // jalan sebagai halaman biasa (tanpa Canva)
    buildStaticLayout();

    // pakai tema terakhir yang tersimpan
        if (isLightTheme) {
      const lightConfig = {
        background_color: "#f0f4f8",
        surface_color: "#ffffff",
        text_color: "#1e293b",
        primary_action_color: "#10b981",
        secondary_action_color: "#3b82f6",
      };
      Object.assign(defaultConfig, lightConfig);
      if (uiRefs.themeToggle) uiRefs.themeToggle.textContent = "🌙 Mode Gelap";
      if (uiRefs.mobileThemeFab) uiRefs.mobileThemeFab.textContent = "🌙";
    } else {
      const darkConfig = {
        background_color: "#0f172a",
        surface_color: "#1e293b",
        text_color: "#e2e8f0",
        primary_action_color: "#10b981",
        secondary_action_color: "#3b82f6",
      };
      Object.assign(defaultConfig, darkConfig);
      if (uiRefs.themeToggle) uiRefs.themeToggle.textContent = "☀️ Mode Terang";
      if (uiRefs.mobileThemeFab) uiRefs.mobileThemeFab.textContent = "☀️";
    }

        applyTheme(defaultConfig);
    setActiveMenu("profile");
    updateHeroImage();
    updateLogoImage();      // 🔽 tambahin ini
    renderCalendarYear(currentYear);
    return;

  }

  window.elementSdk.init({
    defaultConfig,
    onConfigChange: async (config) => {
      if (!uiRefs.mainWrapper) {
        buildStaticLayout();
      }

      uiRefs.headerTitle.textContent =
        config.header_title || defaultConfig.header_title;
      uiRefs.headerSubtitle.textContent =
        config.header_subtitle || defaultConfig.header_subtitle;
      uiRefs.aboutTitle.textContent =
        config.about_title || defaultConfig.about_title;
      uiRefs.aboutBody.textContent =
        config.about_body || defaultConfig.about_body;
      uiRefs.activitiesTitle.textContent =
        config.activities_title || defaultConfig.activities_title;
      uiRefs.activitiesBody.textContent =
        config.activities_body || defaultConfig.activities_body;
      uiRefs.galleryTitle.textContent =
        config.gallery_title || defaultConfig.gallery_title;
      uiRefs.calendarSectionTitle.textContent =
        config.calendar_section_title ||
        defaultConfig.calendar_section_title;
      uiRefs.footerText.textContent =
        config.footer_text || defaultConfig.footer_text;
      uiRefs.calendarIntro.textContent =
        config.calendar_intro_text || defaultConfig.calendar_intro_text;

      applyTheme(config);
    },
    mapToCapabilities: (config) => {
      return {
        recolorables: [
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            },
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            },
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            },
          },
          {
            get: () =>
              config.primary_action_color ||
              defaultConfig.primary_action_color,
            set: (value) => {
              config.primary_action_color = value;
              window.elementSdk.setConfig({ primary_action_color: value });
            },
          },
          {
            get: () =>
              config.secondary_action_color ||
              defaultConfig.secondary_action_color,
            set: (value) => {
              config.secondary_action_color = value;
              window.elementSdk.setConfig({ secondary_action_color: value });
            },
          },
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            config.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          },
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            config.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          },
        },
      };
    },
    mapToEditPanelValues: (config) => {
      return new Map([
        ["header_title", config.header_title || defaultConfig.header_title],
        [
          "header_subtitle",
          config.header_subtitle || defaultConfig.header_subtitle,
        ],
        ["about_title", config.about_title || defaultConfig.about_title],
        ["about_body", config.about_body || defaultConfig.about_body],
        [
          "activities_title",
          config.activities_title || defaultConfig.activities_title,
        ],
        [
          "activities_body",
          config.activities_body || defaultConfig.activities_body,
        ],
        ["gallery_title", config.gallery_title || defaultConfig.gallery_title],
        [
          "calendar_section_title",
          config.calendar_section_title ||
            defaultConfig.calendar_section_title,
        ],
        [
          "calendar_intro_text",
          config.calendar_intro_text || defaultConfig.calendar_intro_text,
        ],
        ["footer_text", config.footer_text || defaultConfig.footer_text],
      ]);
    },
  });

    buildStaticLayout();
  applyTheme(window.elementSdk.config || defaultConfig);
  setActiveMenu("profile");
  updateHeroImage();
  updateLogoImage();   // 🔽 tambahin
  renderCalendarYear(currentYear);
}

// panggil init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initElementSdk);
} else {
  initElementSdk();
}
