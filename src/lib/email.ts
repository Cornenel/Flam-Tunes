// Email notification utilities
// TODO: Integrate with your email service (SendGrid, Resend, etc.)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email notification
 * This is a placeholder - integrate with your email service
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // TODO: Implement email sending
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'Flam Tunes <noreply@flamtunes.com>',
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html,
  // });

  console.log("Email would be sent:", options);
  return true;
}

/**
 * Send submission status update email to artist
 */
export async function sendSubmissionStatusEmail(
  artistEmail: string,
  artistName: string,
  trackTitle: string,
  status: "APPROVED" | "REJECTED" | "UNDER_REVIEW",
  adminNotes?: string
): Promise<boolean> {
  const statusMessages: Record<string, { subject: string; message: string }> =
    {
      APPROVED: {
        subject: "🎉 Your Track Has Been Approved!",
        message: `Great news! Your track "${trackTitle}" has been approved and is now in rotation on Flam Tunes!`,
      },
      REJECTED: {
        subject: "Update on Your Track Submission",
        message: `Unfortunately, your track "${trackTitle}" was not approved for rotation at this time.`,
      },
      UNDER_REVIEW: {
        subject: "Your Track is Under Review",
        message: `Your track "${trackTitle}" is currently being reviewed by our team.`,
      },
    };

  const statusInfo = statusMessages[status];
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e, #ff1744); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎵 Flam Tunes</h1>
          </div>
          <div class="content">
            <h2>${statusInfo.subject}</h2>
            <p>Hi ${artistName},</p>
            <p>${statusInfo.message}</p>
            ${adminNotes ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>` : ""}
            <p>You can view all your submissions and their status in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://flamtunes.com"}/artist/dashboard">artist dashboard</a>.</p>
            <p>Thank you for sharing your music with Flam Tunes!</p>
            <p>Best regards,<br>The Flam Tunes Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: artistEmail,
    subject: statusInfo.subject,
    html,
    text: `${statusInfo.message}\n\n${adminNotes ? `Admin Notes: ${adminNotes}\n\n` : ""}View your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL || "https://flamtunes.com"}/artist/dashboard`,
  });
}

