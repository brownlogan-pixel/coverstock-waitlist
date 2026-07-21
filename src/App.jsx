import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import logo from './logo.png';

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function toE164(formatted) {
  const digits = formatted.replace(/\D/g, '');
  return digits.length === 10 ? `+1${digits}` : null;
}

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | duplicate | error

  const digits = phone.replace(/\D/g, '');
  const ready = name.trim().length > 0 && digits.length === 10;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ready || status === 'loading') return;
    setStatus('loading');

    const e164 = toE164(phone);
    const { error } = await supabase.from('waitlist').insert({ phone: e164, name: name.trim() });

    if (!error) {
      setStatus('success');
    } else if (error.code === '23505') {
      setStatus('duplicate');
    } else {
      setStatus('error');
    }
  }

  return (
    <div style={s.page}>
      {/* Background glow */}
      <div style={s.glowTop} />
      <div style={s.glowBottom} />

      <div style={s.card}>
        {/* Logo */}
        <div style={s.logo}>
          <img src={logo} alt="CoverStock" style={s.logoImg} />
        </div>

        {status === 'success' ? (
          <div style={s.successWrap}>
            <div style={s.successIcon}>✓</div>
            <div style={s.successTitle}>You're on the list.</div>
            <div style={s.successSub}>We'll text you when CoverStock is live in your area.</div>
            <div style={s.successPrize}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🎁</span>
              <div>
                <div style={{ ...s.successPrizeText, fontWeight: 700, marginBottom: 2, color: '#FFA0A0' }}>You're entered for the $50 giveaway.</div>
                <div style={s.successPrizeText}>One waitlist member wins $50 in CoverStock Wallet credits at launch. Winner chosen randomly.</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={s.prizeBadge}>
              <span>🎁</span>
              <span style={s.prizeBadgeText}>$50 Credit Giveaway</span>
            </div>
            <div style={s.eyebrow}>Coming soon</div>
            <h1 style={s.headline}>
              Skip the guessing.<br />Own your night.
            </h1>
            <p style={s.sub}>
              CoverStock lets you buy, sell, and transfer nightlife covers — so you
              always know what you're paying before you get to the door.
            </p>
            <p style={s.prizeLine}>🎁 One lucky sign-up wins $50 in wallet credits at launch.</p>

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.inputWrap}>
                <span style={s.inputPrefix}>👤</span>
                <input
                  style={s.input}
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => { setStatus('idle'); setName(e.target.value); }}
                  autoComplete="name"
                />
              </div>
              <div style={{ ...s.inputWrap, ...(status === 'duplicate' || status === 'error' ? s.inputWrapError : {}) }}>
                <span style={s.inputPrefix}>📱</span>
                <input
                  style={s.input}
                  type="tel"
                  inputMode="numeric"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={e => {
                    setStatus('idle');
                    setPhone(formatPhone(e.target.value));
                  }}
                  autoComplete="tel"
                />
              </div>

              {status === 'duplicate' && (
                <div style={s.errorMsg}>That number is already on the list.</div>
              )}
              {status === 'error' && (
                <div style={s.errorMsg}>Something went wrong. Try again.</div>
              )}

              <button
                type="submit"
                style={{ ...s.btn, opacity: ready && status !== 'loading' ? 1 : 0.45 }}
                disabled={!ready || status === 'loading'}
              >
                {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>

            <p style={s.fine}>No spam. Just a heads-up when we launch.</p>
          </>
        )}
      </div>

      <div style={s.footer}>© {new Date().getFullYear()} CoverStock LLC</div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '8px 16px 24px',
    position: 'relative',
    overflow: 'hidden',
    background: '#07080F',
  },
  glowTop: {
    position: 'fixed',
    top: -200,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,87,88,0.22) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowBottom: {
    position: 'fixed',
    bottom: -300,
    right: -100,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,170,255,0.14) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    width: '100%',
    maxWidth: 340,
    height: 150,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: '100%',
    maxWidth: 340,
    height: 'auto',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    color: '#00AAFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  headline: {
    fontSize: 38,
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 18,
  },
  sub: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 1.65,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 14,
  },
  prizeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'linear-gradient(135deg, rgba(255,87,88,0.16), rgba(204,56,57,0.09))',
    border: '1px solid rgba(255,87,88,0.32)',
    borderRadius: 20,
    padding: '5px 14px',
    marginBottom: 14,
  },
  prizeBadgeText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.65,
    textTransform: 'uppercase',
    color: '#FF8080',
  },
  prizeLine: {
    fontSize: 13,
    color: '#FF8080',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 1.5,
    opacity: 0.9,
  },
  successPrize: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    background: 'linear-gradient(135deg, rgba(255,87,88,0.13), rgba(204,56,57,0.07))',
    border: '1px solid rgba(255,87,88,0.27)',
    borderRadius: 12,
    padding: '12px 16px',
    textAlign: 'left',
    maxWidth: 320,
  },
  successPrizeText: {
    fontSize: 13,
    color: '#FF9090',
    lineHeight: 1.55,
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#0D1020',
    border: '1px solid #1A2236',
    borderRadius: 14,
    padding: '0 16px',
    height: 56,
    transition: 'border-color 0.15s',
  },
  inputWrapError: {
    borderColor: '#EF4444',
  },
  inputPrefix: {
    fontSize: 18,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 17,
    fontWeight: 500,
    letterSpacing: 0.3,
  },
  errorMsg: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: 600,
    paddingLeft: 4,
    marginTop: -4,
  },
  btn: {
    width: '100%',
    height: 56,
    background: 'linear-gradient(135deg, #FF5758, #CC3839)',
    border: 'none',
    borderRadius: 14,
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.1s',
    letterSpacing: 0.2,
  },
  fine: {
    fontSize: 12,
    color: '#334155',
    marginTop: 14,
    textAlign: 'center',
  },
  successWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    background: 'rgba(0,170,255,0.12)',
    border: '2px solid #00AAFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    color: '#00AAFF',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: -0.5,
  },
  successSub: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: 300,
  },
  footer: {
    position: 'fixed',
    bottom: 20,
    fontSize: 12,
    color: '#1E293B',
  },
};
