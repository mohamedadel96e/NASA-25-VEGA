const nodemailer = require('nodemailer');
// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Email templates
const emailTemplates = {
  emailVerification: (otp, name) => ({
    subject: 'NASA VEGA - Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #2a5298; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #2a5298; letter-spacing: 8px; margin: 10px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 NASA VEGA</div>
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Welcome to NASA VEGA - Space Habitat Design Tool! To complete your registration, please verify your email address using the code below:</p>
            
            <div class="otp-box">
              <p><strong>Your Verification Code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>If you didn't create an account with NASA VEGA, please ignore this email.</p>
            
            <div class="footer">
              <p>This is an automated message from NASA VEGA Space Habitat Design Tool.</p>
              <p>Ready to design the future of space exploration? 🌌</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NASA VEGA - Email Verification
      
      Hello ${name}!
      
      Welcome to NASA VEGA - Space Habitat Design Tool! To complete your registration, please verify your email address using the code below:
      
      Verification Code: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't create an account with NASA VEGA, please ignore this email.
      
      Ready to design the future of space exploration?
    `
  }),
  // Upcoming templates: password reset, login verification
  passwordReset: (otp, name) => ({
    subject: 'NASA VEGA - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #dc3545; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 8px; margin: 10px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 NASA VEGA</div>
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your NASA VEGA account. Use the code below to reset your password:</p>
            
            <div class="otp-box">
              <p><strong>Your Reset Code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and consider changing your password if you suspect unauthorized access.
            </div>
            
            <div class="footer">
              <p>This is an automated message from NASA VEGA Space Habitat Design Tool.</p>
              <p>Keep exploring the cosmos! 🌌</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NASA VEGA - Password Reset Request
      
      Hello ${name}!
      
      We received a request to reset your password for your NASA VEGA account. Use the code below to reset your password:
      
      Reset Code: ${otp}
      
      This code will expire in 10 minutes.
      
      Security Notice: If you didn't request a password reset, please ignore this email and consider changing your password if you suspect unauthorized access.
      
      Keep exploring the cosmos!
    `
  }),

  loginVerification: (otp, name) => ({
    subject: 'NASA VEGA - Login Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Verification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #28a745; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #28a745; letter-spacing: 8px; margin: 10px 0; }
          .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 NASA VEGA</div>
            <h1>Login Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Someone is trying to log in to your NASA VEGA account. If this is you, please use the verification code below:</p>
            
            <div class="otp-box">
              <p><strong>Your Login Code:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <p>If you didn't attempt to log in, please secure your account immediately.</p>
            
            <div class="footer">
              <p>This is an automated message from NASA VEGA Space Habitat Design Tool.</p>
              <p>Welcome back, space explorer! 🌌</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      NASA VEGA - Login Verification
      
      Hello ${name}!
      
      Someone is trying to log in to your NASA VEGA account. If this is you, please use the verification code below:
      
      Login Code: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't attempt to log in, please secure your account immediately.
      
      Welcome back, space explorer!
    `
  })
};

// Send email function
// We just build it without any queue system for now (queue System is a future enhancement)
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data.otp, data.name);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Verify email service setup
const verifyEmailService = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service is ready'.green);
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  generateOTP,
  verifyEmailService,
  emailTemplates
};