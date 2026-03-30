// api/send-email.js
// Vercel Serverless Function for sending late payment calculation results via Resend

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    to_email,
    invoice_amount,
    days_overdue,
    daily_rate,
    interest,
    compensation,
    comp_reason,
    total,
    invoice_status
  } = req.body;

  // Validate email
  if (!to_email || !to_email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  // Build email HTML
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 16px rgba(15,14,12,0.07);">
          
          <!-- Header -->
          <tr>
            <td style="background:#0f0e0c; padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://billionstudio.co.uk/logo.png" alt="Billion Studio" height="32" style="height:32px;">
                  </td>
                  <td align="right" style="color:#f0c060; font-size:11px; font-family:monospace; letter-spacing:0.05em;">
                    LATE PAYMENT CALCULATOR
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 8px; font-size:22px; font-weight:700; color:#0f0e0c;">
                Your Late Payment Claim Summary
              </h1>
              <p style="margin:0; font-size:14px; color:#5a5650;">
                Based on the Late Payment of Commercial Debts Act 1998
              </p>
            </td>
          </tr>
          
          <!-- Results -->
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 8px;">
                
                <tr>
                  <td style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <span style="font-size:13px; color:#5a5650;">Invoice Amount</span>
                  </td>
                  <td align="right" style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <strong style="font-size:15px; color:#0f0e0c;">${invoice_amount}</strong>
                  </td>
                </tr>
                
                <tr>
                  <td style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <span style="font-size:13px; color:#5a5650;">Days Overdue</span>
                  </td>
                  <td align="right" style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <strong style="font-size:15px; color:#0f0e0c;">${days_overdue}</strong>
                  </td>
                </tr>
                
                <tr>
                  <td style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <span style="font-size:13px; color:#5a5650;">Daily Interest Rate</span>
                  </td>
                  <td align="right" style="background:#f7f5f0; padding:12px 16px; border-radius:8px;">
                    <strong style="font-size:15px; color:#0f0e0c;">${daily_rate}</strong>
                  </td>
                </tr>
                
                <tr>
                  <td style="background:#edf7f2; padding:12px 16px; border-radius:8px; border:1px solid #b8e8cc;">
                    <span style="font-size:13px; color:#1a7a4a;">Statutory Interest</span>
                  </td>
                  <td align="right" style="background:#edf7f2; padding:12px 16px; border-radius:8px; border:1px solid #b8e8cc;">
                    <strong style="font-size:15px; color:#1a7a4a;">${interest}</strong>
                  </td>
                </tr>
                
                ${compensation ? `
                <tr>
                  <td style="background:#edf7f2; padding:12px 16px; border-radius:8px; border:1px solid #b8e8cc;">
                    <span style="font-size:13px; color:#1a7a4a;">Fixed Compensation</span>
                    <br><span style="font-size:11px; color:#5a5650;">${comp_reason}</span>
                  </td>
                  <td align="right" style="background:#edf7f2; padding:12px 16px; border-radius:8px; border:1px solid #b8e8cc;">
                    <strong style="font-size:15px; color:#1a7a4a;">${compensation}</strong>
                  </td>
                </tr>
                ` : ''}
                
              </table>
            </td>
          </tr>
          
          <!-- Total -->
          <tr>
            <td style="padding:16px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e0c; border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <span style="font-size:13px; color:rgba(255,255,255,0.65);">Total You Can Claim</span>
                    <br><span style="font-size:11px; color:rgba(255,255,255,0.45);">Invoice ${invoice_status} · on top of original amount</span>
                  </td>
                  <td align="right" style="padding:18px 20px;">
                    <strong style="font-size:22px; color:#ffffff;">${total}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none; border-top:1px solid #e3e0d8; margin:0;">
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px; font-size:14px; color:#5a5650; line-height:1.6;">
                <strong style="color:#0f0e0c;">Tired of chasing late payments?</strong><br>
                Billdocket helps UK tradespeople send professional invoices with automatic late payment reminders — so you get paid on time, every time.
              </p>
              <a href="https://billionstudio.co.uk/billdocket?utm_source=calculator&utm_medium=email" style="display:inline-block; background:#c84b2f; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:8px; font-size:14px; font-weight:600;">
                Join the Waitlist →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:#f7f5f0; padding:20px 32px; border-top:1px solid #e3e0d8;">
              <p style="margin:0; font-size:11px; color:#5a5650; line-height:1.5;">
                This calculation is based on the current Bank of England base rate (3.75%) giving a statutory rate of 11.75% p.a. Rates change periodically — always verify at <a href="https://www.gov.uk" style="color:#c84b2f;">GOV.UK</a> before issuing a claim. This does not constitute legal or financial advice.
              </p>
              <p style="margin:16px 0 0; font-size:11px; color:#5a5650;">
                © ${new Date().getFullYear()} <a href="https://billionstudio.co.uk" style="color:#0f0e0c; text-decoration:none; font-weight:600;">Billion Studio</a> · Free Tools for UK Small Businesses
              </p>
            </td>
          </tr>
          
        </table>
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
        from: 'Billion Studio <noreply@billionstudio.co.uk>',
        to: [to_email],
        subject: 'Your Late Payment Claim Calculation',
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
