/* ============================================================
   SENTINEL SECURITY — Site JavaScript
   Handles: mobile nav, scroll state, FAQ accordion, form
   validation, mailto generation, scroll reveal, back-to-top,
   active nav link, smooth scrolling.
   ============================================================ */

/* ---------- Contact Configuration ----------
   The owner should replace these with real contact details.
   ------------------------------------------------------- */
const CONTACT = {
  phone: "+1 (509) 707-8477",
  email: "sentinel@trust-partners.net",
};

/* ---------- Utility: populate contact links ---------- */
function populateContactLinks() {
  document.querySelectorAll("[data-contact-phone]").forEach((el) => {
    el.textContent = CONTACT.phone;
    el.href = `tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`;
  });
  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    el.textContent = CONTACT.email;
    el.href = `mailto:${CONTACT.email}`;
  });
}

/* ---------- Navigation: scroll state ---------- */
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Navigation: mobile toggle ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const mobile = document.querySelector(".nav-mobile");
  const overlay = document.querySelector(".nav-overlay");
  if (!toggle || !mobile) return;

  const closeNav = () => {
    toggle.classList.remove("open");
    mobile.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    document.body.classList.remove("nav-open");
  };

  const openNav = () => {
    toggle.classList.add("open");
    mobile.classList.add("open");
    if (overlay) overlay.classList.add("open");
    document.body.classList.add("nav-open");
  };

  toggle.addEventListener("click", () => {
    if (mobile.classList.contains("open")) closeNav();
    else openNav();
  });

  if (overlay) overlay.addEventListener("click", closeNav);

  mobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobile.classList.contains("open")) closeNav();
  });
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const allLinks = document.querySelectorAll(".nav-links a, .nav-mobile-links a");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      items.forEach((other) => {
        other.classList.remove("open");
        const otherAnswer = other.querySelector(".faq-answer");
        const otherQuestion = other.querySelector(".faq-question");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
      });
      // Open clicked
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---------- Scroll Reveal ---------- */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) btn.classList.add("visible");
      else btn.classList.remove("visible");
    },
    { passive: true }
  );
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const successMsg = form.querySelector(".form-success");
  const fields = form.querySelectorAll("[data-required]");

  const setError = (group, msg) => {
    group.classList.add("error");
    const errEl = group.querySelector(".form-error");
    if (errEl) errEl.textContent = msg;
  };

  const clearError = (group) => {
    group.classList.remove("error");
    const errEl = group.querySelector(".form-error");
    if (errEl) errEl.textContent = "";
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      const group = field.closest(".form-group");
      if (group) clearError(group);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (successMsg) successMsg.classList.remove("visible");
    let valid = true;

    fields.forEach((field) => {
      const group = field.closest(".form-group");
      if (!group) return;
      const val = field.value.trim();

      if (!val) {
        setError(group, "This field is required.");
        valid = false;
      } else if (field.type === "email" && !validateEmail(val)) {
        setError(group, "Please enter a valid email address.");
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector(".form-group.error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Build mailto link
    const getVal = (name) => {
      const el = form.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : "";
    };

    const fullName = getVal("full-name");
    const email = getVal("email");
    const phone = getVal("phone");
    const service = getVal("service");
    const location = getVal("location");
    const date = getVal("preferred-date");
    const message = getVal("message");

    const subject = `Protection Request — ${fullName} — ${service}`;
    const body = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Service Required: ${service}`,
      `Location: ${location || "Not provided"}`,
      `Preferred Date: ${date || "Not provided"}`,
      "",
      "Message:",
      message || "No message provided.",
    ].join("\n");

    const mailtoLink = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;

    if (successMsg) {
      successMsg.classList.add("visible");
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* ---------- Year in footer ---------- */
function initFooterYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Init all ---------- */
document.addEventListener("DOMContentLoaded", () => {
  populateContactLinks();
  initNavScroll();
  initMobileNav();
  initActiveNav();
  initFAQ();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  initFooterYear();
});
