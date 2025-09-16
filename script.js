/* === EmailJS config (replace with your real values) === */
const EMAILJS_PUBLIC_KEY = "ngn8o37lVfRqpVkAD";
const EMAILJS_SERVICE_ID = "service_0t562k4";
const TEMPLATE_NOTIFY_CONTACT = "template_uw3lxxa";
const TEMPLATE_AUTOREPLY_CONTACT = "template_g7o728o";

/* Init + page interactions */
document.addEventListener("DOMContentLoaded", () => {
  // EmailJS init
  if (window.emailjs && !EMAILJS_PUBLIC_KEY.startsWith("ngn8o37lVfRqpVkAD")) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // Contact form handler
  const form = document.getElementById("contactForm");
  if (form) form.addEventListener("submit", handleContactSubmit);

  // Reveal animations
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); } });
  }, {threshold: 0.2});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
});

async function handleContactSubmit(e){
  e.preventDefault();
  const form = e.currentTarget;
  // Honeypot: ignore bots
  if (form.company && form.company.value) return;

  const data = {
    user_name: form.user_name.value.trim(),
    user_email: form.user_email.value.trim(),
    service: form.service.value,
    message: form.message.value.trim()
  };

  try {
    if (!window.emailjs) throw new Error("EmailJS not loaded");
    if (EMAILJS_PUBLIC_KEY.startsWith("ngn8o37lVfRqpVkAD")) throw new Error("Update EmailJS keys");
    await Promise.all([
      emailjs.send(service_0t562k4, template_g7o728o, data),
      emailjs.send(service_0t562k4, template_g7o728o, data)
    ]);
    openModal("Message sent", "Thanks! We've received your enquiry and emailed you a confirmation.");
    form.reset();
  } catch (err) {
    console.error(err);
    openModal("Something went wrong", "Please email info@ubuntucode.africa while we resolve this.");
  }
}

function openModal(title, msg){
  const m = document.getElementById("modal");
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMsg").textContent = msg;
  m.classList.add("open");
}
function closeModal(){ document.getElementById("modal").classList.remove("open"); }
