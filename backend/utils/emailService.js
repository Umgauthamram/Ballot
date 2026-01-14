import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendCredentialsEmail = async (email, name, studentId, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Ballot Voting Credentials',
    html: `
      <div style="background-color: #000000; color: #ffffff; font-family: 'Courier New', Courier, monospace; padding: 40px; border: 1px solid #333;">
        <h2 style="color: #4ade80; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #4ade80; padding-bottom: 10px; margin-top: 0;">Ballot Secure System</h2>
        
        <p style="color: #cccccc; margin-top: 20px;">Identity Verified: <strong>${name}</strong></p>
        <p style="color: #cccccc;">Your secure voting credentials have been generated.</p>
        
        <div style="background-color: #111111; border: 1px solid #333; padding: 20px; margin: 30px 0;">
          <div style="margin-bottom: 15px;">
            <div style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Student / User ID</div>
            <div style="color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${studentId}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <div style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Registered Email</div>
            <div style="color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: 1px;">${email}</div>
          </div>
          
          <div>
            <div style="color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Temporary Access Key</div>
            <div style="color: #4ade80; font-size: 24px; font-weight: bold; letter-spacing: 2px;">${password}</div>
          </div>
        </div>

        <p style="color: #eab308; font-size: 12px; text-transform: uppercase;">
          <strong>Security Action Required:</strong> You must change your password immediately upon first login.
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; color: #666; font-size: 10px;">
          BALLOT SYSTEM • SECURE COMMUNICATION • DO NOT REPLY
        </div>
      </div>
    `
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Skipping email send (Credentials not set). Mock email content:');
      console.log(JSON.stringify(mailOptions, null, 2));
      return;
    }
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Email send failed:', error);
  }
};
