// Handle panel switching
const container = document.getElementById("container");
document.getElementById("register").addEventListener("click", () => container.classList.add("active"));
document.getElementById("login").addEventListener("click", () => container.classList.remove("active"));

// Initialize EmailJS
emailjs.init("6xeycUj5CInWKYKTr");

let currentEmail = "";
let currentUsername = "";
let currentOTP = "";

const ADMIN_USERNAME = "Sigma";
const ADMIN_PASSWORD = "RASHIM0789";

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

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ========== SIGNUP FLOW ==========
document.getElementById("sendOtpBtn").onclick = async () => {
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();

    if (!username || !email)
        return showMessage("signupMessage", "Please fill username and email", "error");

    if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase())
        return showMessage("signupMessage", "This username is reserved for admin.", "error");

    currentEmail = email;
    currentUsername = username;
    currentOTP = generateOTP();

    try {
        const templateParams = {
            to_email: email,
            otp_code: currentOTP,
            user_name: username,
            website_name: "Project Ebooks"
        };

        const response = await emailjs.send("service_039rifr", "template_c7tcljk", templateParams);
        if (response.status === 200) {
            toggleOTPSection(true);
            showMessage("signupMessage", "✅ OTP sent to your email!", "success");
        }
    } catch (error) {
        toggleOTPSection(true);
        showMessage("signupMessage", `✅ OTP: ${currentOTP} (Email failed, use this code)`, "success");
        console.error("EmailJS Error:", error);
    }
};

// Verify OTP
document.getElementById("verifyOtpBtn").onclick = () => {
    const enteredOTP = document.getElementById("otpCode").value.trim();
    if (enteredOTP !== currentOTP)
        return showMessage("signupMessage", "❌ Invalid OTP!", "error");

    const password = document.getElementById("signupPassword").value;
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[currentUsername] = { email: currentEmail, password, verified: true, isAdmin: false };
    localStorage.setItem("users", JSON.stringify(users));

    showMessage("signupMessage", "✅ Account created successfully!", "success");
    setTimeout(() => window.location.href = "dashboard.html", 1500);
};

// Resend OTP
document.getElementById("resendOtpBtn").onclick = () => {
    currentOTP = generateOTP();
    showMessage("signupMessage", "📧 New OTP generated!", "success");
};

// ========== LOGIN FLOW ==========
document.getElementById("loginBtn").onclick = () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Admin login
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("currentUser", username);
        localStorage.setItem("isAdmin", "true");
        showMessage("loginMessage", "🔓 Admin login successful!", "success");
        document.getElementById("adminIndicator").style.display = "block";
        setTimeout(() => (window.location.href = "dashboard.html"), 1000);
        return;
    }

    // Normal users
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

// ========== ADMIN STATUS ==========
window.onload = () => {
    if (localStorage.getItem("isAdmin") === "true")
        document.getElementById("adminIndicator").style.display = "block";
};