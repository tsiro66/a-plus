import type { APIRoute } from 'astro';
import { RESEND_API_KEY } from 'astro:env/server';
import footer from '../../content/pages/footer.json';

export const prerender = false;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FROM = 'A+ Website Contact Form <contact@a-plus.gr>';
const TO = [footer.email];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, url }) => {
  // Same-origin only
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  // Honeypot — bots fill hidden field, humans can't
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return json({ ok: true }); // pretend success, drop silently
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';

  if (!name || name.length > 100) {
    return json({ ok: false, error: 'name' }, 400);
  }
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'email' }, 400);
  }
  if (phone.length > 40) {
    return json({ ok: false, error: 'phone' }, 400);
  }
  if (!message || message.length > 5000) {
    return json({ ok: false, error: 'message' }, 400);
  }

  const text = [
    `Νέο μήνυμα από τη φόρμα επικοινωνίας`,
    ``,
    `Όνομα: ${name}`,
    `Email: ${email}`,
    `Τηλέφωνο: ${phone || '—'}`,
    ``,
    `Μήνυμα:`,
    message,
  ].join('\n');

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject: `Φόρμα επικοινωνίας — ${name}`,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error:', res.status, detail);
      return json({ ok: false, error: 'send_failed' }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Resend request failed:', err);
    return json({ ok: false, error: 'send_failed' }, 502);
  }
};
