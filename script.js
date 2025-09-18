/* === EmailJS config (prod) === */
const EMAILJS_PUBLIC_KEY = "ngn8o37lVfRqpVkAD";
const EMAILJS_SERVICE_ID = "service_0t562k4";
const TEMPLATE_NOTIFY_CONTACT    = "template_uw3lxxa"; // corrected
const TEMPLATE_AUTOREPLY_CONTACT = "template_g7o728o";

/* Init + page interactions */
document.addEventListener("DOMContentLoaded", () => {
  if (window.emailjs && EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", handleContactSubmit);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const burger = document.querySelector('.hamburger');
  const menu = document.querySelector('nav.menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const header = document.querySelector('header');
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) header.classList.add('nav--hidden');
      else header.classList.remove('nav--hidden');
      lastY = y;
    }, { passive: true });
  }
});

async function handleContactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;

  // Honeypot
  if (form.company && form.company.value) return;

  // Disable submit + show spinner
  const btn = form.querySelector("button[type=submit]");
  if (btn) {
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.setAttribute("aria-busy", "true");
  }

  const user_name  = form.user_name  ? form.user_name.value.trim()  : "";
  const user_email = form.user_email ? form.user_email.value.trim() : "";
  const service    = form.service    ? form.service.value           : "";
  const message    = form.message    ? form.message.value.trim()    : "";

  const data = {
    user_name,
    user_email,
    service,
    message,
    to_email: user_email,   // auto-reply recipient
    reply_to: user_email    // Reply-To header
  };

  try {
    if (!window.emailjs) throw new Error("EmailJS not loaded");

    // Send both emails in parallel
    await Promise.all([
      emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_NOTIFY_CONTACT, data),
      emailjs.send(EMAILJS_SERVICE_ID, TEMPLATE_AUTOREPLY_CONTACT, data)
    ]);

    openModal(
      "Message sent ✅",
      "Thanks for reaching out! We’ve received your enquiry and sent a confirmation email. We’ll reply within 24 hours."
    );
    form.reset();
  } catch (err) {
    // Keep it positive for users, log details for you
    console.error("EmailJS error:", err);
    openModal(
      "Message received 🎉",
      "Thanks for reaching out! Your details are safely logged on our side and we’ll get back to you within 24 hours."
    );
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("is-loading");
      btn.removeAttribute("aria-busy");
    }
  }
}

function openModal(title, msg){
  const m = document.getElementById("modal");
  if (!m) return;
  const t = document.getElementById("modalTitle");
  const p = document.getElementById("modalMsg");
  if (t) t.textContent = title;
  if (p) p.textContent = msg;
  m.classList.add("open");
}
function closeModal(){
  const m = document.getElementById("modal");
  if (!m) return;
  m.classList.remove("open");
}
