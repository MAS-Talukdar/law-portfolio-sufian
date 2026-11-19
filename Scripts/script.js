// =================================
// 1. DARK / LIGHT THEME
// =================================

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("portfolio-theme");

const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;

const initialTheme = savedTheme || (systemPrefersDark ? "light" : "dark");

document.documentElement.setAttribute("data-theme", initialTheme);

function updateThemeButton() {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  themeToggle.textContent = currentTheme === "dark" ? "☾" : "☀";

  themeToggle.setAttribute(
    "aria-label",
    currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);

  localStorage.setItem("portfolio-theme", newTheme);

  updateThemeButton();
});

// =================================
// 2. MOBILE NAVIGATION
// =================================


const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Toggle mobile menu
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");

  navLinks.classList.toggle("hidden", !isOpen);

  menuToggle.setAttribute("aria-expanded", isOpen);

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close menu after clicking a navigation link
document.querySelectorAll("#nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    navLinks.classList.add("hidden");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

/* =================================
   3. CONTACT FORM - EMAILJS
================================= */

// Initialize EmailJS
emailjs.init({
  publicKey: "cA1tFls21XQ8eT58I",
});

// Contact Form Elements
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const buttonText = document.getElementById("button-text");

// Contact Form Submission
contactForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Honeypot spam check
  const honeypot = contactForm.querySelector('[name="website"]');

  if (honeypot && honeypot.value.trim() !== "") {
    console.warn("Spam submission blocked.");
    return;
  }

  // Prevent duplicate submissions
  if (submitBtn.disabled) return;

  // Loading state
  submitBtn.disabled = true;
  buttonText.innerHTML = '<span class="spinner"></span>Sending...';

  formStatus.className = "";
  formStatus.textContent = "";

  // Prepare timestamp
  const receivedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  });

  // Prepare EmailJS parameters
  const templateParams = {
    from_name: contactForm.elements["from_name"].value,
    from_email: contactForm.elements["from_email"].value,
    subject: contactForm.elements["subject"].value,
    message: contactForm.elements["message"].value,
    received_at: receivedAt,
  };

  try {
    // Send email through EmailJS
    await emailjs.send("service_c11drsf", "template_j457aco", templateParams);

    // Success message
    formStatus.className = "success";

    formStatus.textContent =
      "✓ Thank you! Your message has been sent successfully. I will get back to you soon.";

    // Clear form
    contactForm.reset();
  } catch (error) {
    // Error message
    console.error("EmailJS Error:", error);

    formStatus.className = "error";

    formStatus.textContent =
      "Sorry! Your message could not be sent. Please try again.";
  } finally {
    // Restore button
    submitBtn.disabled = false;

    buttonText.textContent = "Send Message";
  }
});

// =================================
// 3. AUTOMATIC COPYRIGHT YEAR
// =================================

document.getElementById("year").textContent = new Date().getFullYear();
