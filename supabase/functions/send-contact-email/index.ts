import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, company, phone, email, product, message } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: settings } = await supabase
      .from('site_settings')
      .select('form_email, email')
      .eq('id', 1)
      .single()

    const recipient = settings?.form_email || settings?.email
    if (!recipient) {
      throw new Error('Alıcı email adresi tanımlanmamış. Lütfen admin panelden form_email ayarlayın.')
    }

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) {
      throw new Error('RESEND_API_KEY tanımlanmamış.')
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#1c2b3a;border-bottom:2px solid #2e6da4;padding-bottom:8px;">Yeni Teklif Talebi</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#555;width:140px;"><strong>Ad Soyad</strong></td><td style="padding:8px 0;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Kurum / Şirket</strong></td><td style="padding:8px 0;">${company || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Telefon</strong></td><td style="padding:8px 0;">${phone || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>E-posta</strong></td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Ürün / Konu</strong></td><td style="padding:8px 0;">${product || '—'}</td></tr>
        </table>
        <div style="margin-top:16px;">
          <strong style="color:#555;">Mesaj:</strong>
          <p style="background:#f4f6f8;padding:12px 16px;border-radius:8px;line-height:1.6;">${message || '—'}</p>
        </div>
        <p style="font-size:12px;color:#999;margin-top:24px;">Bu mesaj HAVEK web sitesi iletişim formu üzerinden gönderilmiştir.</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'HAVEK İletişim Formu <onboarding@resend.dev>',
        to: [recipient],
        reply_to: email,
        subject: `Teklif Talebi: ${product || 'Genel'} — ${name}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend hatası: ${err}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
