from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import smtplib
import random
import os
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
import threading
import time

app = Flask(__name__)
CORS(app)

# Store OTPs temporarily
otp_storage = {}

# Email configuration (USE APP PASSWORDS - NOT YOUR REAL PASSWORD)
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USER = 'ahmedrashim3105@gmail.com'  # Your Gmail
EMAIL_PASS = 'RASHIM0789'     # Gmail App Password

def send_otp_email(receiver_email, otp, username):
    try:
        # Create message
        message = MimeMultipart()
        message['From'] = EMAIL_USER
        message['To'] = receiver_email
        message['Subject'] = 'Sigma Portal - Your Verification Code'
        
        # Email body
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }}
                .container {{ background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 0 auto; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                .otp-code {{ font-size: 32px; font-weight: bold; text-align: center; color: #667eea; margin: 20px 0; }}
                .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Σ Sigma Portal</h1>
                </div>
                <h2>Hello {username},</h2>
                <p>Your verification code for Sigma Portal is:</p>
                <div class="otp-code">{otp}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
                <div class="footer">
                    <p>Best regards,<br>Sigma Portal Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message.attach(MimeText(body, 'html'))
        
        # Send email
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(message)
        server.quit()
        
        print(f"✅ OTP {otp} sent to {receiver_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        return False

@app.route('/')
def serve_index():
    return render_template('index.html')

@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.json
        email = data.get('email')
        username = data.get('username')
        
        if not email or not username:
            return jsonify({'success': False, 'message': 'Email and username are required'})
        
        # Generate OTP
        otp = str(random.randint(100000, 999999))
        
        # Store OTP with timestamp
        otp_storage[email] = {
            'otp': otp,
            'timestamp': time.time(),
            'username': username
        }
        
        # Send OTP via email
        if send_otp_email(email, otp, username):
            return jsonify({
                'success': True, 
                'message': 'OTP sent successfully to your email'
            })
        else:
            return jsonify({
                'success': False, 
                'message': 'Failed to send OTP. Please try again.'
            })
            
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Server error: {str(e)}'
        })

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get('email')
        otp = data.get('otp')
        
        if not email or not otp:
            return jsonify({'success': False, 'message': 'Email and OTP are required'})
        
        # Check if OTP exists and is valid
        if email in otp_storage:
            stored_data = otp_storage[email]
            
            # Check if OTP is correct and not expired (10 minutes)
            if (stored_data['otp'] == otp and 
                time.time() - stored_data['timestamp'] < 600):
                
                # OTP verified successfully
                del otp_storage[email]
                return jsonify({
                    'success': True, 
                    'message': 'OTP verified successfully'
                })
            elif stored_data['otp'] != otp:
                return jsonify({
                    'success': False, 
                    'message': 'Invalid OTP code'
                })
            else:
                return jsonify({
                    'success': False, 
                    'message': 'OTP has expired'
                })
        
        return jsonify({
            'success': False, 
            'message': 'OTP not found or expired'
        })
        
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': f'Server error: {str(e)}'
        })

if __name__ == '__main__':
    # Create templates directory
    os.makedirs('templates', exist_ok=True)
    
    print("🚀 Starting Professional Sigma Portal Server...")
    print("📧 OTP emails will be sent via SMTP")
    print("🌐 Server running on: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
