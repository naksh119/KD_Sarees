import nodemailer from 'nodemailer';

export function getFrontendBaseUrl() {
  return (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
}

export function buildPasswordResetUrl(token) {
  return `${getFrontendBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
}

export function buildVerifyEmailUrl(token) {
  return `${getFrontendBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  if (!isSmtpConfigured()) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const brandName = () => process.env.EMAIL_BRAND_NAME || 'KD Sarees';

const fromAddress = () => {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  return `"${brandName()}" <${from}>`;
};

/**
 * @returns {Promise<{ sent: boolean, resetUrl: string }>}
 */
export async function sendPasswordResetEmail({ to, resetToken }) {
  const resetUrl = buildPasswordResetUrl(resetToken);
  const transport = createTransport();
  if (!transport) {
    console.warn(
      '[email] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS). Password reset email not sent.'
    );
    return { sent: false, resetUrl };
  }
  try {
    await transport.sendMail({
      from: fromAddress(),
      to,
      subject: `${brandName()} — Reset your password`,
      text: `Hello,\n\nWe received a request to reset your ${brandName()} account password.\n\nOpen this link (valid 30 minutes):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n`,
      html: `<p>Hello,</p><p>We received a request to reset your <strong>${brandName()}</strong> account password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes.</p><p>If you did not request this, you can ignore this email.</p>`,
    });
    return { sent: true, resetUrl };
  } catch (err) {
    console.error('[email] sendPasswordResetEmail failed:', err?.message || err);
    return { sent: false, resetUrl };
  }
}

/**
 * @returns {Promise<{ sent: boolean, verifyUrl: string }>}
 */
export async function sendVerificationEmail({ to, verifyToken }) {
  const verifyUrl = buildVerifyEmailUrl(verifyToken);
  const transport = createTransport();
  if (!transport) {
    console.warn(
      '[email] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS). Verification email not sent.'
    );
    return { sent: false, verifyUrl };
  }
  try {
    await transport.sendMail({
      from: fromAddress(),
      to,
      subject: `${brandName()} — Verify your email`,
      text: `Hello,\n\nThanks for signing up at ${brandName()}.\n\nVerify your email by opening this link (valid 24 hours):\n${verifyUrl}\n\nIf you did not create an account, you can ignore this email.\n`,
      html: `<p>Hello,</p><p>Thanks for signing up at <strong>${brandName()}</strong>.</p><p><a href="${verifyUrl}">Verify your email</a></p><p>This link expires in 24 hours.</p><p>If you did not create an account, you can ignore this email.</p>`,
    });
    return { sent: true, verifyUrl };
  } catch (err) {
    console.error('[email] sendVerificationEmail failed:', err?.message || err);
    return { sent: false, verifyUrl };
  }
}
