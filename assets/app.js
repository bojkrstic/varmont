    // Drawer
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("drawerOverlay");
    const closeDrawer = document.getElementById("closeDrawer");
    const drawerLinks = document.querySelectorAll(".drawerLink");

    function openDrawer(){
      document.body.classList.add("drawerOpen");
      menuBtn?.setAttribute("aria-expanded","true");
      overlay?.setAttribute("aria-hidden","false");
    }
    function closeDrawerFn(){
      document.body.classList.remove("drawerOpen");
      menuBtn?.setAttribute("aria-expanded","false");
      overlay?.setAttribute("aria-hidden","true");
    }
    menuBtn?.addEventListener("click", openDrawer);
    overlay?.addEventListener("click", closeDrawerFn);
    closeDrawer?.addEventListener("click", closeDrawerFn);
    drawerLinks.forEach(a => a.addEventListener("click", closeDrawerFn));
    document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeDrawerFn(); });

    // i18n (ср ћир/лат + енг + нем)
    const langToggle = document.getElementById("langToggle");
    const langMenu = document.getElementById("langMenu");
    const langSwitcherEl = document.getElementById("langSwitcher");
    const langLabel = document.getElementById("langLabel");
    const storedLang = localStorage.getItem("preferredLang");
    const supportedLangs = ["cyrl","lat","en","de"];
    const langLabels = { cyrl:"SR · Ћир", lat:"SR · Lat", en:"EN", de:"DE" };
    const langAriaLabels = {
      cyrl:"Промени језик",
      lat:"Promeni jezik",
      en:"Change language",
      de:"Sprache wechseln"
    };
    const langNames = {
      cyrl:"Српски (Ћирилица)",
      lat:"Српски (Latinica)",
      en:"English",
      de:"Deutsch"
    };
    let currentLang = supportedLangs.includes(storedLang) ? storedLang : "cyrl";

    function renderLangMenu(){
      if(!langMenu) return;
      langMenu.innerHTML = "";
      supportedLangs.forEach((code) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.lang = code;
        btn.setAttribute("role","option");
        btn.textContent = langNames[code] || code.toUpperCase();
        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          applyLanguage(code);
          closeLangMenu();
        });
        langMenu.appendChild(btn);
      });
    }

    function updateLangMenuActive(){
      if(!langMenu) return;
      langMenu.querySelectorAll("button").forEach((btn) => {
        const active = btn.dataset.lang === currentLang;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    function openLangMenu(){
      if(!langSwitcherEl) return;
      langSwitcherEl.classList.add("open");
      langToggle?.setAttribute("aria-expanded","true");
    }
    function closeLangMenu(){
      if(!langSwitcherEl) return;
      langSwitcherEl.classList.remove("open");
      langToggle?.setAttribute("aria-expanded","false");
    }

    function applyLanguage(lang){
      const resolved = supportedLangs.includes(lang) ? lang : "cyrl";
      const htmlLang = resolved === "en"
        ? "en"
        : resolved === "de"
          ? "de"
          : resolved === "lat"
            ? "sr-Latn"
            : "sr";
      document.documentElement.lang = htmlLang;

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        const mode = el.dataset.i18nMode === "html" ? "html" : "text";
        const t = translations[key]?.[resolved];
        if(!t) return;
        if(mode === "html") el.innerHTML = t;
        else el.textContent = t;
      });

      document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        const pairs = el.dataset.i18nAttr.split(",").map(s=>s.trim()).filter(Boolean);
        pairs.forEach((pair) => {
          const [attr, key] = pair.split(":").map(s=>s.trim());
          const t = translations[key]?.[resolved];
          if(attr && key && t !== undefined) el.setAttribute(attr, t);
        });
      });

      document.title = translations.pageTitle[resolved];
      const metaDesc = document.querySelector('meta[name="description"]');
      if(metaDesc) metaDesc.setAttribute("content", translations.metaDescription[resolved]);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const twTitle = document.querySelector('meta[name="twitter:title"]');
      const twDesc = document.querySelector('meta[name="twitter:description"]');
      ogTitle?.setAttribute("content", translations.pageTitle[resolved]);
      ogDesc?.setAttribute("content", translations.metaDescription[resolved]);
      twTitle?.setAttribute("content", translations.pageTitle[resolved]);
      twDesc?.setAttribute("content", translations.metaDescription[resolved]);

      if(langLabel) langLabel.textContent = langLabels[resolved] || langLabels.cyrl;
      if(langToggle){
        langToggle.dataset.lang = resolved;
        langToggle.setAttribute("aria-label", langAriaLabels[resolved] || langAriaLabels.cyrl);
      }

      localStorage.setItem("preferredLang", resolved);
      currentLang = resolved;
      updateLangMenuActive();
    }

    renderLangMenu();
    applyLanguage(currentLang);

    langToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      if(langSwitcherEl?.classList.contains("open")) closeLangMenu();
      else openLangMenu();
    });
    langMenu?.addEventListener("click", (event) => event.stopPropagation());
    document.addEventListener("click", (event) => {
      if(!langSwitcherEl) return;
      if(langSwitcherEl.contains(event.target)) return;
      closeLangMenu();
    });
    document.addEventListener("keydown", (event) => {
      if(event.key === "Escape") closeLangMenu();
    });

    // WhatsApp form
    const quickForm = document.getElementById("quickForm");
    if (quickForm) {
      quickForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = quickForm.elements["name"].value.trim();
        const phone = quickForm.elements["phone"].value.trim();
        const message = quickForm.elements["message"].value.trim();
        const greeting = translations.waGreeting[currentLang] || translations.waGreeting.cyrl;
        const phoneLabel = translations.waPhone[currentLang] || translations.waPhone.cyrl;

        const composed = [
          `${greeting} ${name}.`,
          `${phoneLabel}: ${phone}.`,
          message
        ].filter(Boolean).join("\n");

        const url = `https://wa.me/381631900120?text=${encodeURIComponent(composed)}`;
        window.open(url, "_blank", "noopener");
        quickForm.reset();
      });
    }

    // Hero karusel
    const carousel = document.querySelector(".heroCarousel");
    if (carousel) {
      const slides = [...carousel.querySelectorAll(".heroSlide")];
      const dots = [...carousel.querySelectorAll(".heroDots button")];
      const previous = carousel.querySelector(".heroArrowPrev");
      const next = carousel.querySelector(".heroArrowNext");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let activeSlide = 0;
      let rotation;

      const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === activeSlide));
        dots.forEach((dot, dotIndex) => {
          const isActive = dotIndex === activeSlide;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
      };
      const stopRotation = () => window.clearInterval(rotation);
      const startRotation = () => {
        if (!reducedMotion) rotation = window.setInterval(() => showSlide(activeSlide + 1), 6000);
      };
      const restartRotation = () => { stopRotation(); startRotation(); };

      previous?.addEventListener("click", () => { showSlide(activeSlide - 1); restartRotation(); });
      next?.addEventListener("click", () => { showSlide(activeSlide + 1); restartRotation(); });
      dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); restartRotation(); }));
      carousel.addEventListener("mouseenter", stopRotation);
      carousel.addEventListener("mouseleave", startRotation);
      carousel.addEventListener("focusin", stopRotation);
      carousel.addEventListener("focusout", startRotation);
      showSlide(0);
      startRotation();
    }
