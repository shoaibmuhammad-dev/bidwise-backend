const verificationEmailTemplate = (name, verifyUrl) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
    <h2>Hi ${name},</h2>
    <p>Thanks for signing up. Please verify your email address to activate your account.</p>
    <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;">
      Verify Email
    </a>
    <p style="margin-top:20px;color:#666;font-size:13px;">
      This link expires in 24 hours. If you didn't create this account, you can ignore this email.
    </p>
  </div>
`;

module.exports = { verificationEmailTemplate };
