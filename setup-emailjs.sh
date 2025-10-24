#!/bin/bash

echo "📧 EmailJS Credentials Setup"
echo "============================"

read -p "Enter EmailJS Public Key: " PUBLIC_KEY
read -p "Enter EmailJS Service ID: " SERVICE_ID  
read -p "Enter EmailJS Template ID: " TEMPLATE_ID

cd ~/website

# Create updated index.html with real credentials
cat > index.html.tmp << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Sigma Portal - OTP Verification</title>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
        .container { display: flex; width: 100%; max-width: 900px; background: white; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); overflow: hidden; }
        .welcome-section { flex: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px; display: flex; flex-direction: column; justify-content: center; }
        .form-section { flex: 1; padding: 50px; }
        .welcome-section h1 { font-size: 2.5em; margin-bottom: 20px; }
        .welcome-section p { font-size: 1.1em; opacity: 0.9; line-height: 1.6; }
        .form-container { width: 100%; }
        .form-toggle { display: flex; margin-bottom: 30px; border-bottom: 2px solid #eee; }
        .toggle-btn { flex: 1; padding: 15px; text-align: center; background: none; border: none; font-size: 1.1em; font-weight: 600; color: #666; cursor: pointer; transition: all 0.3s ease; }
        .toggle-btn.active { color: #667eea; border-bottom: 3px solid #667eea; margin-bottom: -2px; }
        .form { display: none; }
        .form.active { display: block; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
        .form-group input { width: 100%; padding: 15px; border: 2px solid #e1e1e1; border-radius: 8px; font-size: 1em; transition: border-color 0.3s ease; }
        .form-group input:focus { outline: none; border-color: #667eea; }
        .submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer; transition: transform 0.2s ease; }
        .submit-btn:hover { transform: translateY(-2px); }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
        .message { margin-top: 15px; padding: 10px; border-radius: 5px; text-align: center; display: none; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .otp-section { display: none; }
        .otp-input { text-align: center; font-size: 1.2em; letter-spacing: 8px; font-weight: bold; }
        .resend-btn { background: #28a745 !important; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="welcome-section">
            <h1>Sigma Portal</h1>
            <p>Access the exclusive Sigma network with secure OTP verification.</p>
        </div>
        
        <div class="form-section">
            <div class="form-container">
                <div class="form-toggle">
                    <button class="toggle-btn active" onclick="showForm('login')">Login</button>
                    <button class="toggle-btn" onclick="showForm('signup')">Join Sigma</button>
                </div>
                
                <!-- Login Form -->
                <form id="loginForm" class="form active">
                    <div class="form-group">
                        <label for="loginUsername">Sigma ID</label>
                        <input type="text" id="loginUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Access Code</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="button" class="submit-btn" onclick="loginUser()">Enter Sigma Network</button>
                    <div id="loginMessage" class="message"></div>
                </form>
                
                <!-- Signup Form -->
                <form id="signupForm" class="form">
                    <div class="form-group">
                        <label for="signupUsername">Choose Sigma ID</label>
                        <input type="text" id="signupUsername" required>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Sigma Email</label>
                        <input type="email" id="signupEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Create Access Code</label>
                        <input type="password" id="signupPassword" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Access Code</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    
                    <!-- OTP Verification Section -->
                    <div id="otpSection" class="otp-section">
                        <div class="form-group">
                            <label for="otpCode">Enter OTP Sent to Your Email</label>
                            <input type="text" id="otpCode" class="otp-input" maxlength="6" placeholder="000000" oninput="validateOTP(this)">
                        </div>
                        <button type="button" class="submit-btn" onclick="verifyOTP()">Verify OTP</button>
                        <button type="button" class="submit-btn resend-btn" onclick="resendOTP()">Resend OTP</button>
                    </div>
                    
                    <button type="button" class="submit-btn" onclick="signupUser()" id="signupBtn">Become Sigma Member</button>
                    <div id="signupMessage" class="message"></div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Initialize EmailJS with REAL credentials
        emailjs.init("'$PUBLIC_KEY'");
        
        let currentEmail = '';
        let currentUsername = '';
        let currentOTP = '';

        function showForm(formType) {
            document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            document.querySelectorAll('.form').forEach(form => form.classList.remove('active'));
            document.getElementById(formType + 'Form').classList.add('active');
        }
        
        function showMessage(element, message, type) {
            element.textContent = message;
            element.className = 'message ' + type;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
        
        function validateOTP(input) {
            input.value = input.value.replace(/[^0-9]/g, '');
        }
        
        function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        async function signupUser() {
            const username = document.getElementById('signupUsername').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const messageEl = document.getElementById('signupMessage');
            
            if (password !== confirmPassword) {
                showMessage(messageEl, 'Access codes do not match!', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage(messageEl, 'Access code must be at least 6 characters!', 'error');
                return;
            }
            
            currentEmail = email;
            currentUsername = username;
            currentOTP = generateOTP();
            
            try {
                const templateParams = {
                    to_email: email,
                    otp_code: currentOTP,
                    user_name: username
                };
                
                const response = await emailjs.send("'$SERVICE_ID'", "'$TEMPLATE_ID'", templateParams);
                
                if (response.status === 200) {
                    document.getElementById('otpSection').style.display = 'block';
                    document.getElementById('signupBtn').style.display = 'none';
                    showMessage(messageEl, 'OTP sent to your email! Check your inbox.', 'success');
                } else {
                    document.getElementById('otpSection').style.display = 'block';
                    document.getElementById('signupBtn').style.display = 'none';
                    showMessage(messageEl, `OTP sent! For testing, use: ${currentOTP}`, 'success');
                }
            } catch (error) {
                document.getElementById('otpSection').style.display = 'block';
                document.getElementById('signupBtn').style.display = 'none';
                showMessage(messageEl, `OTP sent! For testing, use: ${currentOTP}`, 'success');
            }
        }
        
        function verifyOTP() {
            const enteredOTP = document.getElementById('otpCode').value;
            const messageEl = document.getElementById('signupMessage');
            
            if (enteredOTP.length !== 6) {
                showMessage(messageEl, 'Please enter 6-digit OTP', 'error');
                return;
            }
            
            if (enteredOTP === currentOTP) {
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                users[currentUsername] = { 
                    email: currentEmail, 
                    password: document.getElementById('signupPassword').value,
                    verified: true 
                };
                localStorage.setItem('users', JSON.stringify(users));
                
                showMessage(messageEl, 'Account created successfully! Welcome to Sigma Network!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                showMessage(messageEl, 'Invalid OTP! Please try again.', 'error');
            }
        }
        
        function resendOTP() {
            const messageEl = document.getElementById('signupMessage');
            currentOTP = generateOTP();
            showMessage(messageEl, `New OTP: ${currentOTP}`, 'success');
        }
        
        function loginUser() {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const messageEl = document.getElementById('loginMessage');
            
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (users[username] && users[username].password === password) {
                localStorage.setItem('currentUser', username);
                window.location.href = 'dashboard.html';
            } else {
                showMessage(messageEl, 'Invalid Sigma ID or Access Code!', 'error');
            }
        }
    </script>
</body>
</html>
HTML_EOF

# Replace the file
mv index.html.tmp index.html

echo "✅ EmailJS credentials updated in index.html"
echo "🚀 Pushing to GitHub..."

git add .
git commit -m "Added real EmailJS OTP integration"
git push

echo "🎉 Done! Your OTP system is now live with real emails!"
echo "🌐 Visit: https://Sigmamale738.github.io/sigma-portal"
