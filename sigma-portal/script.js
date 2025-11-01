const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Slide animation
registerBtn.addEventListener("click", () => container.classList.add("active"));
loginBtn.addEventListener("click", () => container.classList.remove("active"));

// EmailJS setup
emailjs.init("6xeycUj5CInWKYKTr");

// Admin credentials
const ADMIN_USERNAME = "Sigma";
const ADMIN_PASSWORD = "RASHIM0789";

let currentEmail = "";
let currentUsername = "";
let currentOTP = "";

// OTP generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
document.getElementById("sendOtpBtn").onclick = async () => {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();

  if (!username || !email)
    return showMessage("signupMessage", "Please fill username and email", "error");

  if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase())
    return showMessage("signupMessage", "This username is reserved.", "error");

  currentEmail = email;
  currentUsername = username;
  currentOTP = generateOTP();

  try {
    const templateParams = {
      to_email: email,
      otp_code: currentOTP,
      user_name: username,
      website_name: "Project Ebooks",
    };

    const response = await emailjs.send("service_039rifr", "template_c7tcljk", templateParams);
    if (response.status === 200) {
      toggleOTPSection(true);
      showMessage("signupMessage", "✅ OTP sent to your email!", "success");
    }
  } catch (error) {
    toggleOTPSection(true);
    showMessage("signupMessage", `✅ OTP: ${currentOTP} (Email failed, use this code)`, "success");
    console.error(error);
  }
};

// Verify OTP
document.getElementById("verifyOtpBtn").onclick = () => {
  const enteredOTP = document.getElementById("otpCode").value.trim();
  if (enteredOTP !== currentOTP)
    return showMessage("signupMessage", "❌ Invalid OTP!", "error");

  const password = document.getElementById("signupPassword").value;
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  users[currentUsername] = {
    email: currentEmail,
    password,
    verified: true,
    isAdmin: false,
  };
  localStorage.setItem("users", JSON.stringify(users));

  showMessage("signupMessage", "✅ Account created successfully!", "success");
  setTimeout(() => (window.location.href = "dashboard.html"), 1500);
};

// Resend OTP
document.getElementById("resendOtpBtn").onclick = () => {
  currentOTP = generateOTP();
  showMessage("signupMessage", "📧 New OTP sent!", "success");
};

// Login logic
document.getElementById("loginBtn").onclick = () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("currentUser", username);
    localStorage.setItem("isAdmin", "true");
    showMessage("loginMessage", "🔓 Admin login successful!", "success");
    document.getElementById("adminIndicator").style.display = "block";
    setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    localStorage.setItem("isAdmin", "false");
    showMessage("loginMessage", "✅ Login successful!", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 1000);
  } else {
    showMessage("loginMessage", "❌ Invalid username or password!", "error");
  }
};

// Helper functions
function showMessage(id, message, type) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.className = `message ${type}`;
  el.style.display = "block";
}

function toggleOTPSection(show) {
  document.getElementById("otpSection").style.display = show ? "block" : "none";
  document.getElementById("sendOtpBtn").style.display = show ? "none" : "block";
}

// Show admin badge if logged in
window.onload = () => {
  if (localStorage.getItem("isAdmin") === "true")
    document.getElementById("adminIndicator").style.display = "block";
};