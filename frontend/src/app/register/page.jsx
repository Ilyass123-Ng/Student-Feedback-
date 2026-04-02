'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, AlertCircle, CheckCircle, Zap, ShieldCheck, BookOpen, Star } from 'lucide-react';

const PERKS = [
  { icon: BookOpen,    text: 'Access all courses instantly' },
  { icon: Star,        text: 'Rate and review your learning' },
  { icon: ShieldCheck, text: 'Secure JWT-protected account' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try a different email.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      <div className="row w-100 m-0">

        {/* ── LEFT PANEL ───────────────────────────────── */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
          style={{ background: 'linear-gradient(145deg, #0d0f20 0%, #111528 100%)', position: 'relative', overflow: 'hidden' }}>

          <div className="z-1">
            <div className="d-flex align-items-center gap-2 mb-5">
              <div className="bg-primary rounded p-2 d-flex align-items-center justify-content-center shadow">
                <Zap size={20} />
              </div>
              <span className="h4 mb-0 fw-bold">CloudLearn</span>
            </div>

            <h1 className="display-4 fw-bold mb-4">
              Start learning<br />
              <span className="text-primary">for free today.</span>
            </h1>
            <p className="lead text-secondary mb-5">
              Join hundreds of students mastering cloud-native development with real projects.
            </p>

            {/* Perks */}
            <div className="d-flex flex-column gap-3 mb-5">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2 border border-primary border-opacity-25 d-flex align-items-center justify-content-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-secondary small">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="card bg-dark bg-opacity-50 border-secondary p-4 z-1">
            <p className="small text-secondary font-italic mb-3">
              &ldquo;CloudLearn gave me the hands-on architecture experience I needed to land my first cloud role.&rdquo;
            </p>
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small" style={{ width: '28px', height: '28px' }}>S</div>
              <div>
                <div className="small fw-bold">Sarah K.</div>
                <div className="text-secondary" style={{ fontSize: '10px' }}>Cloud Engineer</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────── */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <div className="mb-4">
              <h2 className="fw-bold text-white text-dark">Create account</h2>
              <p className="text-secondary">Free forever. No credit card required.</p>
            </div>

            {error   && <div className="alert alert-danger d-flex align-items-center gap-2 mb-4"><AlertCircle size={18}/> {error}</div>}
            {success && <div className="alert alert-success d-flex align-items-center gap-2 mb-4"><CheckCircle size={18}/> {success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">Last name</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Dupont"
                    value={form.nom} onChange={e => set('nom', e.target.value)} required />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">First name</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Jean"
                    value={form.prenom} onChange={e => set('prenom', e.target.value)} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small text-uppercase fw-bold">Email address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Mail size={18} />
                  </span>
                  <input type="email" className="form-control bg-dark border-secondary text-white" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} required autoFocus />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small text-uppercase fw-bold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Lock size={18} />
                  </span>
                  <input type="password" className="form-control bg-dark border-secondary text-white" placeholder="••••••••"
                    value={form.password} onChange={e => set('password', e.target.value)} required />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small text-uppercase fw-bold">I am a…</label>
                <div className="row g-2">
                  <div className="col-6">
                    <button type="button" onClick={() => set('role', 'student')}
                      className={`btn w-100 ${form.role === 'student' ? 'btn-primary' : 'btn-outline-secondary'}`}>
                      🎓 Student
                    </button>
                  </div>
                  <div className="col-6">
                    <button type="button" onClick={() => set('role', 'admin')}
                      className={`btn w-100 ${form.role === 'admin' ? 'btn-primary' : 'btn-outline-secondary'}`}>
                      🛡️ Admin
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={loading}>
                {loading ? 'Creating…' : 'Create my account'}
              </button>
            </form>

            <hr className="my-5 border-secondary" />

            <p className="text-center text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-primary fw-bold text-decoration-none">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
