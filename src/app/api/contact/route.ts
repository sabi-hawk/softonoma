import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const isDev = process.env.NODE_ENV === "development";

function envStr(value: string | undefined): string {
  return (value || "").trim().replaceAll(/^["']|["']$/g, "");
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, businessPhone, companyName, email, message } = body;

    if (!name || !businessPhone || !companyName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const recipientEmail = envStr(process.env.CONTACT_EMAIL || process.env.EMAIL) || "contact@softonoma.com";
    const smtpHost = envStr(process.env.SMTP_HOST) || "smtp.gmail.com";
    const smtpPort = Number.parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = envStr(process.env.SMTP_USER);
    const smtpPassword = envStr(process.env.SMTP_PASSWORD);

    if (!smtpUser || !smtpPassword) {
      if (isDev) console.error("[Contact API] SMTP credentials missing (SMTP_USER / SMTP_PASSWORD)");
      return NextResponse.json(
        { success: false, error: "Email service not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    const isGmail = smtpHost.toLowerCase() === "smtp.gmail.com";
    const transporter = nodemailer.createTransport(
      isGmail
        ? {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { user: smtpUser, pass: smtpPassword },
        }
        : {
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPassword },
          ...(smtpPort === 587 && { tls: { rejectUnauthorized: true } }),
        }
    );

    try {
      await transporter.verify();
    } catch (verifyError) {
      const msg = verifyError instanceof Error ? verifyError.message : "SMTP verification failed";
      if (isDev) console.error("[Contact API] Verify error:", verifyError);
      return NextResponse.json(
        {
          success: false,
          error: isDev ? `Email server connection failed: ${msg}` : "Email server connection failed. Please try again later.",
        },
        { status: 500 }
      );
    }

    const safe = {
      name: escapeHtml(String(name)),
      email: escapeHtml(String(email)),
      companyName: escapeHtml(String(companyName)),
      businessPhone: escapeHtml(String(businessPhone)),
      message: escapeHtml(String(message)).replaceAll("\n", "<br>"),
    };

    const mailOptions = {
      from: `"${String(name).replaceAll(/["\\]/g, "")}" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Contact form: ${String(companyName).replaceAll(/\s+/g, " ").trim().slice(0, 100)}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #121e29;
      background: linear-gradient(99.01deg, #2a445e -0.67%, #f3aa20);
      padding: 40px 20px;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(99.01deg, #2a445e -0.67%, #1e2f3f 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(243, 170, 32, 0.1) 0%, transparent 70%);
      animation: pulse 15s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.3; }
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      position: relative;
      z-index: 1;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #f3aa20;
      font-size: 14px;
      margin-top: 8px;
      position: relative;
      z-index: 1;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .intro-text {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(18, 30, 41, 0.1);
    }
    .field-group {
      margin-bottom: 24px;
    }
    .field {
      background: #edf2f7;
      border-radius: 12px;
      padding: 18px 20px;
      border-left: 4px solid #f3aa20;
      transition: all 0.3s ease;
    }
    .field:hover {
      background: #e2e8f0;
      transform: translateX(4px);
    }
    .field-label {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #4a5568;
      margin-bottom: 6px;
      display: block;
    }
    .field-value {
      font-size: 16px;
      color: #121e29;
      font-weight: 500;
    }
    .field-value a {
      color: #f3aa20;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .field-value a:hover {
      color: #2a445e;
      text-decoration: underline;
    }
    .message-section {
      margin-top: 32px;
      background: linear-gradient(135deg, #ffffff 0%, #edf2f7 100%);
      border-radius: 12px;
      padding: 24px;
      border: 2px solid rgba(18, 30, 41, 0.1);
      position: relative;
    }
    .message-section::before {
      content: '';
      position: absolute;
      top: -16px;
      left: 20px;
      background: #f3aa20;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      box-shadow: 0 4px 14px 0 rgba(42, 68, 94, 0.3);
    }
    .message-label {
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #2a445e;
      margin-bottom: 12px;
      display: block;
    }
    .message-content {
      white-space: pre-wrap;
      line-height: 1.8;
      color: #121e29;
      font-size: 15px;
      padding: 16px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid rgba(18, 30, 41, 0.1);
    }
    .footer {
      background: #edf2f7;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid rgba(18, 30, 41, 0.1);
    }
    .footer p {
      font-size: 13px;
      color: #4a5568;
      margin: 0;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #f3aa20, transparent);
      margin: 30px 0;
      opacity: 0.3;
    }
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px; }
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .header h1 { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>Contact Form Submission</h1>
      <p>Website contact form — details below</p>
    </div>
    
    <div class="content">
      <p class="intro-text">
        A new submission has been received via the website contact form.
      </p>
      
      <div class="field-group">
        <div class="field">
          <span class="field-label">Full Name</span>
          <div class="field-value">${safe.name}</div>
        </div>
      </div>
      
      <div class="field-group">
        <div class="field">
          <span class="field-label">Email Address</span>
          <div class="field-value">
            <a href="mailto:${safe.email}">${safe.email}</a>
          </div>
        </div>
      </div>
      
      <div class="field-group">
        <div class="field">
          <span class="field-label">Business Phone</span>
          <div class="field-value">${safe.businessPhone}</div>
        </div>
      </div>
      
      <div class="field-group">
        <div class="field">
          <span class="field-label">Company Name</span>
          <div class="field-value">${safe.companyName}</div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="message-section">
        <span class="message-label">Message</span>
        <div class="message-content">${safe.message}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Sent via website contact form — ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
</body>
</html>`,
      text: `Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nBusiness Phone: ${businessPhone}\nCompany Name: ${companyName}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (isDev) console.error("[Contact API] Send error:", error);
    return NextResponse.json(
      {
        success: false,
        error: isDev ? `Failed to send message: ${errorMessage}` : "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
