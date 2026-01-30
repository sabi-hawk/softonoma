import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, businessPhone, companyName, email, message } = body;

    // Validate required fields
    if (!name || !businessPhone || !companyName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get email configuration from environment variables
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.EMAIL || "contact@softonoma.com";
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPassword = process.env.SMTP_PASSWORD || "";

    // If SMTP credentials are not provided, return an error
    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials not configured");
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
              .header {
                background-color: #2a445e;
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                margin: -20px -20px 20px -20px;
              }
              .field {
                margin-bottom: 15px;
                padding: 10px;
                background-color: #edf2f7;
                border-radius: 4px;
              }
              .field-label {
                font-weight: bold;
                color: #f3aa20;
                margin-bottom: 5px;
              }
              .field-value {
                color: #121e29;
              }
              .message-box {
                padding: 15px;
                background-color: #edf2f7;
                border-left: 4px solid #f3aa20;
                border-radius: 4px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="field-label">Business Phone:</div>
                <div class="field-value">${businessPhone}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Company Name:</div>
                <div class="field-value">${companyName}</div>
              </div>
              
              <div class="message-box">
                <div class="field-label">Message:</div>
                <div class="field-value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Business Phone: ${businessPhone}
Company Name: ${companyName}

Message:
${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}

