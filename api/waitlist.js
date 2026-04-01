// api/waitlist.js
// Vercel Serverless Function for Billdocket waitlist signups
// Sends a notification email to you when someone joins

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  // Format timestamp
  const now = new Date();
  const timestamp = now.toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/London'
  });

  // Build notification email HTML
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin:0; padding:40px 20px; background-color:#f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 16px rgba(15,14,12,0.07);">
    
    <!-- Header -->
    <tr>
      <td style="background:#0f0e0c; padding:20px 24px;">
        <span style="color:#f0c060; font-size:12px; font-family:monospace; letter-spacing:0.05em;">🎉 NEW WAITLIST SIGNUP</span>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding:28px 24px;">
        <h1 style="margin:0 0 20px; font-size:20px; font-weight:700; color:#0f0e0c;">
          Someone joined the Billdocket waitlist!
        </h1>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="padding:12px 16px; background:#f7f5f0; border-radius:8px; margin-bottom:8px;">
              <span style="font-size:11px; color:#5a5650; text-transform:uppercase; letter-spacing:0.05em;">Email Address</span>
              <br>
              <strong style="font-size:16px; color:#0f0e0c;">${email}</strong>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="padding:12px 16px; background:#f7f5f0; border-radius:8px;">
              <span style="font-size:11px; color:#5a5650; text-transform:uppercase; letter-spacing:0.05em;">Source</span>
              <br>
              <strong style="font-size:14px; color:#0f0e0c;">${source || 'Unknown'}</strong>
            </td>
          </tr>
        </table>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:12px 16px; background:#f7f5f0; border-radius:8px;">
              <span style="font-size:11px; color:#5a5650; text-transform:uppercase; letter-spacing:0.05em;">Signed Up</span>
              <br>
              <strong style="font-size:14px; color:#0f0e0c;">${timestamp}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background:#f7f5f0; padding:16px 24px; border-top:1px solid #e3e0d8;">
        <p style="margin:0; font-size:12px; color:#5a5650;">
          This notification was sent from <strong>tools.billionstudio.co.uk</strong>
        </p>
      </td>
    </tr>
    
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Billdocket Waitlist <noreply@billionstudio.co.uk>',
        to: ['info@billionstudio.co.uk'],  // ← 改做你想收 notification 嘅 email
        subject: `🎉 New Waitlist Signup: ${email}`,
        html: emailHtml,
        reply_to: email,  // 可以直接 reply 俾用戶
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to process signup' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
