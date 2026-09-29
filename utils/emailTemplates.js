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

const resetPasswordEmailTemplate = (name, resetUrl) => {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Password Reset Request</h2>

      <p>Hi ${name},</p>

      <p>
        We received a request to reset the password for your account.
        Click the button below to create a new password.
      </p>

      <a
        href="${resetUrl}"
       style="display:inline-block;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:6px;"
      >
        Reset Password
      </a>

      <p style="margin-top:20px;color:#666;font-size:13px;">
        This link will expire in 15 minutes and can only be used once.
      </p>

      <p style="margin-top:20px;color:#666;font-size:13px;">
        If you did not request a password reset, you can safely
        ignore this email.
      </p>
    </div>
  `;
};

module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
