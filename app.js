// ===================== KONFIG DASAR =====================
const defaultConfig = {
  background_color: "#0f172a",
  surface_color: "#1e293b",
  text_color: "#e2e8f0",
  primary_action_color: "#10b981",
  secondary_action_color: "#3b82f6",
  font_family: "Inter",
  font_size: 16,

  header_title: "Desa Setiamekar Tambun Selatan",
  header_subtitle:
    "Desa Setiamekar RW 13 , Kec. Tambun Selatan, Kab. Bekasi",
  about_title: "Tentang Desa Kami",
  about_body:
    "Desa Setiamekar Tambun Selatan adalah desa yang terletak di wilayah strategis dengan akses mudah namun tetap mempertahankan suasana pedesaan yang asri. Masyarakat kami menjunjung tinggi nilai-nilai gotong royong, kearifan lokal, dan keagamaan yang kuat.",
  activities_title: "Kegiatan Rutin Desa",
  activities_body:
    "Berbagai kegiatan rutin seperti pengajian mingguan, kerja bakti bulanan, pelatihan UMKM, festival budaya, dan kegiatan pemuda diadakan untuk mempererat kebersamaan dan meningkatkan kesejahteraan warga.",
  gallery_title: "Galeri Kegiatan Desa",
  calendar_section_title: "Kalender Kegiatan Tahunan",
  calendar_intro_text:
    "Lihat dan kelola jadwal kegiatan desa sepanjang tahun. Perangkat desa dapat masuk mode edit dengan kata sandi khusus.",
  footer_text:
    "Desa Setiamekar Tambun Selatan • Bersama Membangun Desa yang Lebih Baik",
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
  calendarGridContainer: null,
  calendarPrevYearBtn: null,
  calendarNextYearBtn: null,
};

let currentYear = new Date().getFullYear();
const calendarEvents = {};
const EDIT_PASSWORD = "KKNUBHARA";
let hasEditAccess = false;
let hasGalleryEditAccess = false;
let isLightTheme = false;

let heroImageUrl = "";
let aboutDescription =
  "Desa Setiamekar Tambun Selatan adalah desa yang terletak di wilayah strategis dengan akses mudah namun tetap mempertahankan suasana pedesaan yang asri. Masyarakat kami menjunjung tinggi nilai-nilai gotong royong, kearifan lokal, dan keagamaan yang kuat.";
let activitiesDescription =
  "Berbagai kegiatan rutin seperti pengajian mingguan, kerja bakti bulanan, pelatihan UMKM, festival budaya, dan kegiatan pemuda diadakan untuk mempererat kebersamaan dan meningkatkan kesejahteraan warga.";

const galleryItems = [
  { id: 1, imageUrl: "", caption: "Kerja bakti membersihkan lingkungan desa" },
  { id: 2, imageUrl: "", caption: "Pengajian rutin mingguan bersama warga" },
  { id: 3, imageUrl: "", caption: "Pelatihan UMKM produk lokal desa" },
  { id: 4, imageUrl: "", caption: "Perayaan hari besar keagamaan" },
  { id: 5, imageUrl: "", caption: "Festival budaya dan seni tradisional" },
  { id: 6, imageUrl: "", caption: "Kegiatan pemuda dan olahraga desa" },
];

// ===================== PERSISTENSI STATE (localStorage) =====================
const STORAGE_KEY = "desaSetiamekarStateV1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);

    if (typeof state.heroImageUrl === "string") {
      heroImageUrl = state.heroImageUrl;
    }
    if (typeof state.aboutDescription === "string") {
      aboutDescription = state.aboutDescription;
    }
    if (typeof state.activitiesDescription === "string") {
      activitiesDescription = state.activitiesDescription;
    }

    // galleryItems: kita replace isi array
    if (Array.isArray(state.galleryItems) && state.galleryItems.length > 0) {
      galleryItems.length = 0;
      state.galleryItems.forEach((item) => {
        if (item && typeof item.id === "number") {
          galleryItems.push({
            id: item.id,
            imageUrl: item.imageUrl || "",
            caption: item.caption || "",
          });
        }
      });
    }

    // calendarEvents: copy semua key
    if (state.calendarEvents && typeof state.calendarEvents === "object") {
      Object.keys(state.calendarEvents).forEach((k) => {
        calendarEvents[k] = Array.isArray(state.calendarEvents[k])
          ? state.calendarEvents[k]
          : [];
      });
    }
  } catch (err) {
    console.error("Gagal load state:", err);
  }
}

function saveState() {
  try {
    const state = {
      heroImageUrl,
      aboutDescription,
      activitiesDescription,
      galleryItems,
      calendarEvents,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Gagal save state:", err);
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
    "w-full sticky top-0 z-10 backdrop-blur-md bg-opacity-90 shadow-lg";

  const navBar = document.createElement("nav");
  navBar.className = "w-full border-b border-yellow-500/20";

  const navInner = document.createElement("div");
  navInner.className =
    "max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4";

  const brandWrap = document.createElement("div");
  brandWrap.className = "flex items-center gap-4";

  const iconWrap = document.createElement("div");
  iconWrap.className =
    "rounded-full p-3 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center shadow-lg float-animation";
  iconWrap.appendChild(createModernIcon());

  const brandText = document.createElement("div");
  brandText.className = "flex flex-col";

  const titleEl = document.createElement("h1");
  titleEl.id = "header-title";
  titleEl.className = "text-xl md:text-2xl font-bold tracking-tight fade-up";
  titleEl.textContent = defaultConfig.header_title;

  const subtitleEl = document.createElement("p");
  subtitleEl.id = "header-subtitle";
  subtitleEl.className =
    "text-sm md:text-base opacity-90 mt-1 max-w-2xl fade-up fade-up-delay-1";
  subtitleEl.textContent = defaultConfig.header_subtitle;

  brandText.appendChild(titleEl);
  brandText.appendChild(subtitleEl);

  brandWrap.appendChild(iconWrap);
  brandWrap.appendChild(brandText);

  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.type = "button";
  themeToggle.className =
    "focus-outline px-5 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-sm";
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
    "max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 py-3";

  const menuLeft = document.createElement("div");
  menuLeft.className = "flex items-center gap-3";

  const profileBtn = document.createElement("button");
  profileBtn.id = "nav-profile";
  profileBtn.type = "button";
  profileBtn.className =
    "focus-outline px-6 py-2.5 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 text-sm";
  profileBtn.textContent = "🏡 Profil Desa";

  const calendarBtn = document.createElement("button");
  calendarBtn.id = "nav-calendar";
  calendarBtn.type = "button";
  calendarBtn.className =
    "focus-outline px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm";
  calendarBtn.textContent = "📅 Kalender Kegiatan";

  menuLeft.appendChild(profileBtn);
  menuLeft.appendChild(calendarBtn);

  const editGalleryBtn = document.createElement("button");
  editGalleryBtn.id = "edit-gallery-toggle";
  editGalleryBtn.type = "button";
  editGalleryBtn.className =
    "focus-outline px-5 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm";
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
  heroImageContainer.style.height = "400px";

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
  heroDesc.textContent =
    "";

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
  calControls.className = "flex flex-wrap items-center gap-3";

  const yearPrev = document.createElement("button");
  yearPrev.id = "calendar-prev-year";
  yearPrev.type = "button";
  yearPrev.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105 text-sm";
  yearPrev.textContent = "← Tahun Lalu";

  const yearLabel = document.createElement("div");
  yearLabel.id = "calendar-year-label";
  yearLabel.className =
    "px-6 py-2 rounded-full font-bold shadow-lg text-base";
  yearLabel.textContent = currentYear.toString();

  const yearNext = document.createElement("button");
  yearNext.id = "calendar-next-year";
  yearNext.type = "button";
  yearNext.className =
    "focus-outline px-4 py-2 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105 text-sm";
  yearNext.textContent = "Tahun Depan →";

  const editButton = document.createElement("button");
  editButton.id = "calendar-edit-toggle";
  editButton.type = "button";
  editButton.className =
    "focus-outline px-5 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-sm";
  editButton.textContent = "🔒 Mode Edit";

  calControls.appendChild(yearPrev);
  calControls.appendChild(yearLabel);
  calControls.appendChild(yearNext);
  calControls.appendChild(editButton);

  calHeader.appendChild(calTitleBlock);
  calHeader.appendChild(calControls);

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
  footerNote.textContent =
    "Website Profil Desa • Dibuat dengan Canva Code";

  footerInner.appendChild(footerText);
  footerInner.appendChild(footerNote);
  footer.appendChild(footerInner);

  wrapper.appendChild(header);
  wrapper.appendChild(main);
  wrapper.appendChild(footer);
  root.appendChild(wrapper);

  // simpan referensi
  uiRefs.root = root;
  uiRefs.mainWrapper = wrapper;
  uiRefs.headerTitle = titleEl;
  uiRefs.headerSubtitle = subtitleEl;
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
  uiRefs.calendarGridContainer = calendarGridContainer;
  uiRefs.calendarPrevYearBtn = yearPrev;
  uiRefs.calendarNextYearBtn = yearNext;

  setupInteractions();
  setupScrollAnimations();
  renderGallery();
  renderCalendarYear(currentYear);
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

  galleryItems.forEach((item, index) => {
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
    uiRefs.galleryContainer.appendChild(itemDiv);
  });

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
  form.className = "flex flex-col gap-3";

  const urlLabel = document.createElement("label");
  urlLabel.setAttribute("for", "gallery-url-input");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Foto (https://)";

  const urlInput = document.createElement("input");
  urlInput.id = "gallery-url-input";
  urlInput.type = "text";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  urlInput.placeholder = "https://example.com/image.jpg";
  urlInput.value = item.imageUrl || "";

  const label = document.createElement("label");
  label.setAttribute("for", "gallery-caption-input");
  label.className = "text-sm font-semibold";
  label.textContent = "Keterangan Foto";

  const textarea = document.createElement("textarea");
  textarea.id = "gallery-caption-input";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  textarea.rows = 3;
  textarea.value = item.caption;

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "💾 Simpan Perubahan";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    item.imageUrl = urlInput.value.trim();
item.caption = textarea.value.trim();
host.remove();
renderGallery();
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
  form.className = "flex flex-col gap-3";

  const urlLabel = document.createElement("label");
  urlLabel.setAttribute("for", "new-gallery-url");
  urlLabel.className = "text-sm font-semibold";
  urlLabel.textContent = "URL Foto (https://)";

  const urlInput = document.createElement("input");
  urlInput.id = "new-gallery-url";
  urlInput.type = "text";
  urlInput.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  urlInput.placeholder = "https://example.com/image.jpg";

  const label = document.createElement("label");
  label.setAttribute("for", "new-gallery-caption");
  label.className = "text-sm font-semibold";
  label.textContent = "Keterangan Foto";

  const textarea = document.createElement("textarea");
  textarea.id = "new-gallery-caption";
  textarea.className =
    "w-full px-4 py-3 rounded-xl text-sm border-2 bg-transparent";
  textarea.rows = 3;
  textarea.placeholder = "Masukkan keterangan foto...";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className =
    "focus-outline px-5 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 text-sm";
  submit.textContent = "➕ Tambahkan";

  form.appendChild(urlLabel);
  form.appendChild(urlInput);
  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const caption = textarea.value.trim();
    const imageUrl = urlInput.value.trim();
    if (caption) {
  const newId = Math.max(...galleryItems.map((i) => i.id), 0) + 1;
  galleryItems.push({ id: newId, imageUrl, caption });
  host.remove();
  renderGallery();
  saveState();
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
  title.textContent = "✏️ Edit Tentang Desa";

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

  uiRefs.profileNavBtn.style.backgroundColor = primary;
  uiRefs.profileNavBtn.style.color = bg;

  uiRefs.calendarNavBtn.style.backgroundColor = "transparent";
  uiRefs.calendarNavBtn.style.borderColor = secondary;
  uiRefs.calendarNavBtn.style.color = secondary;

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
}

function setActiveMenu(menu) {
  const profileSection = document.getElementById("section-profile");
  const calendarSection = document.getElementById("section-calendar");

  if (menu === "profile") {
    profileSection.classList.remove("hidden");
    calendarSection.classList.add("hidden");
    uiRefs.profileNavBtn.style.fontWeight = "700";
    uiRefs.calendarNavBtn.style.fontWeight = "500";
  } else {
    profileSection.classList.add("hidden");
    calendarSection.classList.remove("hidden");
    uiRefs.profileNavBtn.style.fontWeight = "500";
    uiRefs.calendarNavBtn.style.fontWeight = "700";
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

function renderCalendarYear(year) {
  if (!uiRefs.calendarGridContainer) return;
  uiRefs.calendarGridContainer.innerHTML = "";
  uiRefs.calendarYearLabel.textContent = year.toString();

  for (let month = 0; month < 12; month++) {
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
    countLabel.textContent = countEvents > 0 ? `${countEvents} kegiatan` : "Kosong";

    monthHeader.appendChild(monthNameWrap);
    monthHeader.appendChild(countLabel);

    const weekRow = document.createElement("div");
    weekRow.className = "grid grid-cols-7 gap-1 text-xs font-semibold mb-2 opacity-70";
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
    uiRefs.calendarGridContainer.appendChild(monthCard);
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
      "Contoh: Rapat koordinasi panitia HUT RI, jam 19.30 di balai desa.";
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
    clearBtn.textContent = "🗑️ Hapus Semua";
    clearBtn.addEventListener("click", () => {
      textarea.value = "";
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
      "Untuk mengedit kegiatan, gunakan tombol 'Mode Edit' dengan kata sandi perangkat desa.";
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
    "Masukkan kata sandi khusus perangkat desa untuk mengaktifkan mode edit.";

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

// ===================== INTERAKSI GLOBAL =====================
function setupInteractions() {
  uiRefs.themeToggle.addEventListener("click", () => {
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
      uiRefs.themeToggle.textContent = "🌙 Mode Gelap";
    } else {
      const darkConfig = {
        background_color: "#0f172a",
        surface_color: "#1e293b",
        text_color: "#e2e8f0",
        primary_action_color: "#10b981",
        secondary_action_color: "#3b82f6",
      };
      Object.assign(defaultConfig, darkConfig);
      uiRefs.themeToggle.textContent = "☀️ Mode Terang";
    }
    applyTheme(defaultConfig);
    renderCalendarYear(currentYear);
  });

  uiRefs.profileNavBtn.addEventListener("click", () =>
    setActiveMenu("profile")
  );
  uiRefs.calendarNavBtn.addEventListener("click", () =>
    setActiveMenu("calendar")
  );

  const editGalleryBtn = document.getElementById("edit-gallery-toggle");
  editGalleryBtn.addEventListener("click", () => {
    if (!hasGalleryEditAccess) {
      showPasswordPrompt((success) => {
        if (success) {
          hasGalleryEditAccess = true;
          editGalleryBtn.textContent = "🔓 Keluar Mode Edit";

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
        }
      });
    } else {
      hasGalleryEditAccess = false;
      editGalleryBtn.textContent = "🔒 Edit Galeri";

      const heroEditBtn = document.getElementById("edit-hero-btn");
      if (heroEditBtn) heroEditBtn.classList.add("hidden");

      const aboutEditBtn = document.getElementById("edit-about-btn");
      if (aboutEditBtn) aboutEditBtn.classList.add("hidden");

      const actEditBtn = document.getElementById("edit-activities-btn");
      if (actEditBtn) actEditBtn.classList.add("hidden");

      renderGallery();
    }
  });

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
  });

  uiRefs.calendarNextYearBtn.addEventListener("click", () => {
    currentYear += 1;
    renderCalendarYear(currentYear);
  });
}

// ===================== INIT DARI CANVA / STANDALONE =====================
function initElementSdk() {
  // load state dari localStorage dulu
  loadState();

  if (!window.elementSdk) {
  // jalan sebagai halaman biasa (tanpa Canva)
  buildStaticLayout();
  applyTheme(defaultConfig);
  setActiveMenu("profile");
  updateHeroImage();          // <<< TAMBAHKAN BARIS INI
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
}

// panggil init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initElementSdk);
} else {
  initElementSdk();
}
