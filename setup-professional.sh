#!/bin/bash

echo "🔧 PROFESSIONAL OTP SYSTEM SETUP"
echo "================================"

echo ""
echo "📧 STEP 1: Configure Gmail App Password"
echo "----------------------------------------"
echo "1. Go to: https://myaccount.google.com/security"
echo "2. Enable 2-Factor Authentication"
echo "3. Go to 'App passwords'"
echo "4. Generate app password for 'Mail'"
echo "5. Copy the 16-character password"
echo ""

read -p "Enter your Gmail address: " GMAIL
read -p "Enter your Gmail App Password: " APP_PASSWORD

# Update server.py with real credentials
sed -i "s/your-email@gmail.com/$GMAIL/g" server.py
sed -i "s/your-app-password/$APP_PASSWORD/g" server.py

echo ""
echo "✅ Email configuration updated!"
echo ""
echo "🚀 STEP 2: Install dependencies"
echo "-------------------------------"

pip install flask flask-cors

echo ""
echo "🎯 STEP 3: Start the professional server"
echo "---------------------------------------"
echo "The server will run on: http://localhost:5000"
echo "OTP emails will be sent via SMTP to real email addresses"
echo ""
echo "To make it public, run in new tab:"
echo "ssh -R 80:localhost:5000 nokey@localhost.run"
echo ""

python server.py
