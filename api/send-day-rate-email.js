// api/send-day-rate-email.js
// Vercel Serverless Function for sending day rate calculator results via Resend
// Mirrors the style of api/send-email.js — uses fetch + RESEND_API_KEY env var

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    to_email,
    day_rate,
    hourly,
    half_day,
    billable_days,
    real_hourly,
    gross,
    take_home,
    tax_buffer,
    pension,
    costs,
    emp_equiv,
  } = req.body;

  if (!to_email || !to_email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

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
                    <img src="https://tools.billionstudio.co.uk/images/logo.png" alt="Billion Studio" height="32" style="height:32px;">
                  </td>
                  <td align="right" style="color:#f0c060; font-size:11px; font-family:monospace; letter-spacing:0.05em;">
                    DAY RATE CALCULATOR
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:32px 32px 20px;">
              <h1 style="margin:0 0 8px; font-size:22px; font-weight:700; color:#0f0e0c;">
                Your Freelancer Day Rate Results
              </h1>
              <p style="margin:0; font-size:14px; color:#5a5650;">
                Your true minimum rate — accounting for tax, pension, costs and non-billable time.
              </p>
            </td>
          </tr>

          <!-- Magic number -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e0c; border-radius:10px;">
                <tr>
                  <td style="padding:24px; text-align:center;">
                    <p style="margin:0 0 4px; font-size:11px; color:rgba(255,255,255,0.45); font-family:monospace; text-transform:uppercase; letter-spacing:0.1em;">✦ Your Magic Number</p>
                    <p style="margin:0 0 4px; font-size:48px; font-weight:800; color:#ffffff; line-height:1;">${day_rate}<span style="font-size:20px;">/day</span></p>
                    <p style="margin:0 0 16px; font-size:13px; color:rgba(255,255,255,0.45);">${billable_days} billable days/year</p>
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="padding:0 4px;">
                          <span style="background:rgba(255,255,255,0.1); border-radius:20px; padding:5px 12px; font-size:12px; color:rgba(255,255,255,0.7); font-family:monospace; white-space:nowrap;">Hourly: <strong style="color:#f0c060;">${hourly}</strong></span>
                        </td>
                        <td style="padding:0 4px;">
                          <span style="background:rgba(255,255,255,0.1); border-radius:20px; padding:5px 12px; font-size:12px; color:rgba(255,255,255,0.7); font-family:monospace; white-space:nowrap;">Half-day: <strong style="color:#f0c060;">${half_day}</strong></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Annual breakdown -->
          <tr>
            <td style="padding:0 32px 8px;">
              <h2 style="margin:0 0 14px; font-size:13px; font-weight:700; color:#0f0e0c; text-transform:uppercase; letter-spacing:0.06em; font-family:monospace;">Annual Breakdown</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 6px;">

                <tr>
                  <td style="background:#edf7f2; padding:11px 14px; border-radius:8px; border:1px solid #b8e8cc;">
                    <span style="font-size:13px; color:#1a7a4a;">Take-home salary</span>
                  </td>
                  <td align="right" style="background:#edf7f2; padding:11px 14px; border-radius:8px; border:1px solid #b8e8cc;">
                    <strong style="font-size:14px; color:#1a7a4a; font-family:monospace;">${take_home}</strong>
                  </td>
                </tr>

                <tr>
                  <td style="background:#fdf6e8; padding:11px 14px; border-radius:8px; border:1px solid #f0d090;">
                    <span style="font-size:13px; color:#b87a1a;">Tax &amp; NI buffer</span>
                  </td>
                  <td align="right" style="background:#fdf6e8; padding:11px 14px; border-radius:8px; border:1px solid #f0d090;">
                    <strong style="font-size:14px; color:#b87a1a; font-family:monospace;">${tax_buffer}</strong>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f7f5f0; padding:11px 14px; border-radius:8px;">
                    <span style="font-size:13px; color:#5a5650;">Pension contribution</span>
                  </td>
                  <td align="right" style="background:#f7f5f0; padding:11px 14px; border-radius:8px;">
                    <strong style="font-size:14px; color:#0f0e0c; font-family:monospace;">${pension}</strong>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f7f5f0; padding:11px 14px; border-radius:8px;">
                    <span style="font-size:13px; color:#5a5650;">Business costs</span>
                  </td>
                  <td align="right" style="background:#f7f5f0; padding:11px 14px; border-radius:8px;">
                    <strong style="font-size:14px; color:#0f0e0c; font-family:monospace;">${costs}</strong>
                  </td>
                </tr>

                <tr>
                  <td style="background:#fdf0ed; padding:12px 14px; border-radius:8px; border:1px solid #f0c4b8;">
                    <strong style="font-size:13px; color:#0f0e0c;">Total gross income needed</strong>
                  </td>
                  <td align="right" style="background:#fdf0ed; padding:12px 14px; border-radius:8px; border:1px solid #f0c4b8;">
                    <strong style="font-size:15px; color:#c84b2f; font-family:monospace;">${gross}</strong>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Reality check -->
          <tr>
            <td style="padding:16px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0; border-radius:8px; border-left:4px solid #c84b2f;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 6px; font-size:12px; font-family:monospace; text-transform:uppercase; letter-spacing:0.06em; color:#5a5650;">The Reality Check</p>
                    <p style="margin:0; font-size:13px; color:#5a5650; line-height:1.6;">
                      Your real take-home works out to <strong style="color:#c84b2f;">${real_hourly}/hour</strong>. 
                      To earn the same take-home as a salaried employee, you'd need a job paying around 
                      <strong style="color:#0f0e0c;">${emp_equiv}/year</strong> — with the employer covering 
                      pension and both sides of National Insurance.
                    </p>
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

          <!-- Tips -->
          <tr>
            <td style="padding:24px 32px;">
              <h2 style="margin:0 0 12px; font-size:13px; font-weight:700; color:#0f0e0c; text-transform:uppercase; letter-spacing:0.06em; font-family:monospace;">3 Things to Do Now</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate; border-spacing:0 6px;">
                <tr>
                  <td style="background:#f7f5f0; padding:10px 14px; border-radius:8px; font-size:13px; color:#5a5650;">
                    <strong style="color:#0f0e0c;">This is your floor</strong> — never accept less than ${day_rate}/day
                  </td>
                </tr>
                <tr>
                  <td style="background:#f7f5f0; padding:10px 14px; border-radius:8px; font-size:13px; color:#5a5650;">
                    <strong style="color:#0f0e0c;">Add 15–20%</strong> as your opening ask — negotiation is always expected
                  </td>
                </tr>
                <tr>
                  <td style="background:#f7f5f0; padding:10px 14px; border-radius:8px; font-size:13px; color:#5a5650;">
                    <strong style="color:#0f0e0c;">Review annually</strong> — inflation silently erodes your rate if you don't raise it
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e0c; border-radius:10px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 4px; font-size:11px; color:#f0c060; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em;">Coming Soon from Billion Studio</p>
                    <p style="margin:0 0 8px; font-size:15px; font-weight:700; color:#ffffff;">Stop chasing late payments manually</p>
                    <p style="margin:0 0 16px; font-size:13px; color:rgba(255,255,255,0.55); line-height:1.6;">
                      Billdocket helps UK freelancers send professional invoices with automatic payment reminders.
                    </p>
                    <a href="https://billionstudio.co.uk/billdocket?utm_source=day-rate-calculator&utm_medium=email" 
                       style="display:inline-block; background:#c84b2f; color:#ffffff; text-decoration:none; padding:11px 22px; border-radius:8px; font-size:13px; font-weight:600;">
                      Join the Billdocket Waitlist →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f7f5f0; padding:20px 32px; border-top:1px solid #e3e0d8;">
              <p style="margin:0; font-size:11px; color:#5a5650; line-height:1.5;">
                This is an estimate only and does not constitute financial or tax advice. Always consult a qualified accountant for your specific circumstances.
              </p>
              <p style="margin:12px 0 0; font-size:11px; color:#5a5650;">
                © ${new Date().getFullYear()} <a href="https://billionstudio.co.uk" style="color:#0f0e0c; text-decoration:none; font-weight:600;">Billion Studio</a> · Free Tools for UK Freelancers
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
        subject: `Your Freelancer Day Rate: ${day_rate}/day — Billion Studio`,
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
