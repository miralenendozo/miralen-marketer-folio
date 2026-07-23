const profileDetails = {
  strategy: {
    title: "Content-led growth",
    body: "Campaign planning, content calendars, community engagement, and reporting that keeps marketing decisions grounded in results."
  },
  funnels: {
    title: "Sales systems support",
    body: "Go High Level landing pages, lead routing, email campaigns, automations, and sales follow-up flows built to move prospects forward."
  },
  creative: {
    title: "Creative that ships",
    body: "Social graphics, promotional materials, short-form videos, copy, and campaign assets prepared for consistent publishing."
  }
};

const serviceDetails = {
  social: {
    title: "Social Media Strategy",
    body: "Best for brands that need consistent posting, community management, clear reporting, and content direction across social channels.",
    bullets: ["Content calendar planning", "Facebook page and group management", "Performance reporting and campaign direction"]
  },
  funnels: {
    title: "Funnels & GHL",
    body: "Best for campaigns that need a clean path from traffic to lead capture, follow-up, and sales conversations.",
    bullets: ["Go High Level landing pages", "Email and social campaign setup", "Lead routing and sales workflow support"]
  },
  seo: {
    title: "SEO & Lead Generation",
    body: "Best for teams that need research, outreach, nurturing, appointment setting, and practical support for prospecting.",
    bullets: ["SEO and keyword research", "Personalized reach-outs", "Appointment setting and cold calling support"]
  },
  creative: {
    title: "Creative Production",
    body: "Best for brands that need campaign visuals, edited video, copy, and promotional assets ready for publishing.",
    bullets: ["Graphic design for social and campaigns", "Short-form video editing", "Flyers, press releases, and marketing materials"]
  }
};

const introGate = document.querySelector(".intro-gate");
const startPortfolioButton = document.querySelector("[data-start-portfolio]");
const minimeAssistant = document.querySelector(".minime-assistant");
let introDismissed = false;
let introAnimating = false;
const introTravelDuration = 760;
const introScrollGuardDuration = 1120;
const introMinimeScale = 1.58;

function syncIntroMinimePosition() {
  if (!minimeAssistant || !document.body.classList.contains("intro-active")) return;

  const styles = getComputedStyle(minimeAssistant);
  const right = Number.parseFloat(styles.right) || 0;
  const bottom = Number.parseFloat(styles.bottom) || 0;
  const baseCenterX = window.innerWidth - right - (minimeAssistant.offsetWidth / 2);
  const baseBottomY = window.innerHeight - bottom;
  const targetCenterX = window.innerWidth / 2;
  const targetCenterY = window.innerHeight / 2;

  document.documentElement.style.setProperty("--minime-intro-x", `${targetCenterX - baseCenterX}px`);
  document.documentElement.style.setProperty(
    "--minime-intro-y",
    `${targetCenterY - baseBottomY + ((introMinimeScale * minimeAssistant.offsetHeight) / 2)}px`
  );
}

function dismissIntro(event) {
  if (event?.cancelable) event.preventDefault();
  if (introAnimating || introDismissed || !introGate || !document.body.classList.contains("intro-active")) return;

  introAnimating = true;
  introDismissed = true;
  syncIntroMinimePosition();
  window.removeEventListener("keydown", handleIntroKeydown);
  window.scrollTo({ top: 0, behavior: "auto" });
  document.documentElement.classList.add("intro-scroll-guard");
  document.body.classList.add("intro-revealing", "intro-scroll-guard");

  window.setTimeout(() => {
    document.body.classList.remove("intro-active", "intro-revealing");
    document.body.classList.add("intro-dismissed");
    introGate.setAttribute("hidden", "");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, introTravelDuration);

  window.setTimeout(() => {
    document.documentElement.classList.remove("intro-scroll-guard");
    document.body.classList.remove("intro-scroll-guard");
    introAnimating = false;
    window.removeEventListener("wheel", handleIntroScroll);
    window.removeEventListener("touchmove", handleIntroScroll);
  }, introScrollGuardDuration);
}

syncIntroMinimePosition();
window.addEventListener("resize", syncIntroMinimePosition);

startPortfolioButton?.addEventListener("click", dismissIntro);

function handleIntroScroll(event) {
  if (!introAnimating && !document.body.classList.contains("intro-active")) return;
  dismissIntro(event);
}

window.addEventListener("wheel", handleIntroScroll, { passive: false });
window.addEventListener("touchmove", handleIntroScroll, { passive: false });

function handleIntroKeydown(event) {
  const scrollKeys = ["ArrowDown", "PageDown", " ", "Home", "End"];
  if (scrollKeys.includes(event.key)) dismissIntro(event);
}

window.addEventListener("keydown", handleIntroKeydown);

const profileNote = document.querySelector("#profile-note");
const profileChips = document.querySelectorAll(".profile-chip");

profileChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const detail = profileDetails[chip.dataset.profile];
    if (!detail || !profileNote) return;

    profileChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    profileNote.innerHTML = `
      <p class="profile-note-title">${detail.title}</p>
      <p>${detail.body}</p>
    `;
  });
});

const serviceDetail = document.querySelector("#service-detail");
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  card.addEventListener("click", () => updateService(card));
  const button = card.querySelector("button");
  button?.addEventListener("focus", () => updateService(card));
});

function updateService(card) {
  const detail = serviceDetails[card.dataset.service];
  if (!detail || !serviceDetail) return;

  serviceCards.forEach((item) => {
    item.classList.remove("is-active");
    item.querySelector("button")?.setAttribute("aria-selected", "false");
  });

  card.classList.add("is-active");
  card.querySelector("button")?.setAttribute("aria-selected", "true");
  serviceDetail.innerHTML = `
    <p class="eyebrow">Active Service</p>
    <h3>${detail.title}</h3>
    <p>${detail.body}</p>
    <ul>${detail.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

const timelineItems = document.querySelectorAll(".timeline-item");

timelineItems.forEach((item) => {
  const toggle = item.querySelector(".timeline-toggle");
  toggle?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    timelineItems.forEach((entry) => {
      entry.classList.remove("is-open");
      entry.querySelector(".timeline-toggle")?.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

const workCarousel = document.querySelector(".work-carousel");
const workCarouselShell = document.querySelector(".work-carousel-shell");
const workCards = [...document.querySelectorAll(".work-card")];
const workCarouselPrev = document.querySelector("[data-carousel-prev]");
const workCarouselNext = document.querySelector("[data-carousel-next]");
const modal = document.querySelector("#work-modal");
const modalImage = document.querySelector("#modal-image");
const modalCategory = document.querySelector("#modal-category");
const modalTitle = document.querySelector("#modal-title");
const modalSummary = document.querySelector("#modal-summary");
let activeWorkIndex = 0;
let lastFocusedElement = null;
let activeSlideIndex = 0;
let workCarouselTimer = null;

workCards.forEach((card, index) => {
  card.addEventListener("click", (event) => {
    if (card.matches("[data-video-work]") || event.target.closest(".video-showcase")) return;
    openWork(index);
  });
  card.addEventListener("keydown", (event) => {
    if (event.target !== card || card.matches("[data-video-work]")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openWork(index);
  });
});

function goToWorkSlide(index) {
  if (!workCarousel || !workCards.length) return;

  activeSlideIndex = (index + workCards.length) % workCards.length;
  const slide = workCards[activeSlideIndex];
  workCarousel.scrollTo({
    left: slide.offsetLeft - workCarousel.offsetLeft,
    behavior: "smooth"
  });
}

function startWorkCarousel() {
  if (!workCarousel || workCarouselTimer || !workCards.length) return;
  const playingVideo = document.querySelector(".video-showcase-item:not([hidden])");
  if (playingVideo && !playingVideo.paused) return;

  workCarouselTimer = window.setInterval(() => {
    goToWorkSlide(activeSlideIndex + 1);
  }, 3400);
}

function stopWorkCarousel() {
  if (!workCarouselTimer) return;

  window.clearInterval(workCarouselTimer);
  workCarouselTimer = null;
}

workCarouselShell?.addEventListener("mouseenter", stopWorkCarousel);
workCarouselShell?.addEventListener("mouseleave", startWorkCarousel);
workCarouselShell?.addEventListener("focusin", stopWorkCarousel);
workCarouselShell?.addEventListener("focusout", startWorkCarousel);
workCarousel?.addEventListener("scroll", () => {
  const carouselLeft = workCarousel.getBoundingClientRect().left;
  activeSlideIndex = workCards.reduce((closestIndex, card, index) => {
    const closestDistance = Math.abs(workCards[closestIndex].getBoundingClientRect().left - carouselLeft);
    const cardDistance = Math.abs(card.getBoundingClientRect().left - carouselLeft);
    return cardDistance < closestDistance ? index : closestIndex;
  }, 0);
});

workCarouselPrev?.addEventListener("click", () => {
  stopWorkCarousel();
  goToWorkSlide(activeSlideIndex - 1);
});

workCarouselNext?.addEventListener("click", () => {
  stopWorkCarousel();
  goToWorkSlide(activeSlideIndex + 1);
});

const videoCarousel = document.querySelector("[data-video-carousel]");
const videoItems = [...(videoCarousel?.querySelectorAll(".video-showcase-item") || [])];
const videoDots = [...(videoCarousel?.querySelectorAll("[data-video-dot]") || [])];
const videoCount = videoCarousel?.querySelector(".video-showcase-count");
let activeVideoIndex = 0;

function showVideo(index) {
  if (!videoItems.length) return;

  activeVideoIndex = (index + videoItems.length) % videoItems.length;
  videoItems.forEach((video, videoIndex) => {
    const isActive = videoIndex === activeVideoIndex;
    if (!isActive) video.pause();
    video.hidden = !isActive;
    video.classList.toggle("is-active", isActive);
  });
  videoDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeVideoIndex;
    dot.classList.toggle("is-active", isActive);
    if (isActive) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  if (videoCount) videoCount.textContent = `${activeVideoIndex + 1} / ${videoItems.length}`;
}

videoCarousel?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (event.target.closest("[data-video-prev]")) showVideo(activeVideoIndex - 1);
  if (event.target.closest("[data-video-next]")) showVideo(activeVideoIndex + 1);

  const dot = event.target.closest("[data-video-dot]");
  if (dot) showVideo(Number(dot.dataset.videoDot));
});

videoItems.forEach((video) => video.addEventListener("play", stopWorkCarousel));

startWorkCarousel();

document.querySelector("[data-modal-next]")?.addEventListener("click", () => {
  openWork((activeWorkIndex + 1) % workCards.length, true);
});

document.querySelector("[data-modal-prev]")?.addEventListener("click", () => {
  openWork((activeWorkIndex - 1 + workCards.length) % workCards.length, true);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeWork);
});

document.addEventListener("keydown", (event) => {
  if (!modal?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeWork();
  if (event.key === "ArrowRight") openWork((activeWorkIndex + 1) % workCards.length, true);
  if (event.key === "ArrowLeft") openWork((activeWorkIndex - 1 + workCards.length) % workCards.length, true);
});

function openWork(index, keepFocus = false) {
  const card = workCards[index];
  if (!card || !modal || !modalImage || !modalCategory || !modalTitle || !modalSummary) return;

  activeWorkIndex = index;
  modalImage.src = card.dataset.workImage;
  modalImage.alt = `${card.dataset.workTitle} preview`;
  modalCategory.textContent = card.dataset.workCategory;
  modalTitle.textContent = card.dataset.workTitle;
  modalSummary.textContent = card.dataset.workSummary;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  stopWorkCarousel();

  if (!keepFocus) lastFocusedElement = document.activeElement;
  if (!keepFocus) modal.querySelector(".modal-close")?.focus();
}

function closeWork() {
  if (!modal) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  startWorkCarousel();
  lastFocusedElement?.focus?.();
}

const minimeToggle = document.querySelector(".minime-toggle");
const minimePopout = document.querySelector("#minime-popout");
const minimeSprite = document.querySelector("[data-minime-sprite]");
const minimeFrames = [
  "assets/minime/1.png",
  "assets/minime/2.png",
  "assets/minime/3.png",
  "assets/minime/4.png",
  "assets/minime/5.png",
  "assets/minime/6.png",
  "assets/minime/7.png",
  "assets/minime/8.png"
];
let minimeFrameIndex = 0;
let minimeTimer = null;

function setMinimeOpen(isOpen) {
  if (!minimeAssistant || !minimeToggle || !minimePopout) return;

  minimeAssistant.classList.toggle("is-open", isOpen);
  minimeToggle.setAttribute("aria-expanded", String(isOpen));
  minimePopout.setAttribute("aria-hidden", String(!isOpen));
}

function startMinimeAnimation() {
  if (!minimeSprite || minimeTimer) return;

  minimeTimer = window.setInterval(() => {
    minimeFrameIndex = (minimeFrameIndex + 1) % minimeFrames.length;
    minimeSprite.src = minimeFrames[minimeFrameIndex];
  }, 420);
}

function stopMinimeAnimation() {
  if (minimeTimer) {
    window.clearInterval(minimeTimer);
    minimeTimer = null;
  }

  minimeFrameIndex = 0;
  if (minimeSprite) minimeSprite.src = minimeFrames[0];
}

startMinimeAnimation();

minimeToggle?.addEventListener("click", () => {
  setMinimeOpen(!minimeAssistant?.classList.contains("is-open"));
});

document.addEventListener("click", (event) => {
  if (!minimeAssistant?.classList.contains("is-open")) return;
  if (minimeAssistant.contains(event.target)) return;
  setMinimeOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMinimeOpen(false);
});
