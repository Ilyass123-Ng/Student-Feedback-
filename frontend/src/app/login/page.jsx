'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, Zap, BookOpen, Star, Users } from 'lucide-react';

// Statistiques affichées sur le panneau de gauche
const STATS = [
  { icon: BookOpen, label: 'Cours', value: '12+' },
  { icon: Star,     label: 'Note Moyenne', value: '4.8' },
  { icon: Users,    label: 'Étudiants', value: '300+' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser({ email, password });
      // On utilise la fonction login du contexte pour enregistrer le token
      login(res.data.token);
      router.push('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe invalide.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      <div className="row w-100 m-0">
        
        {/* ── PANNEAU GAUCHE (Visuel et Infos) ─────────────────── */}
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
              Apprenez le cloud-native<br />
              <span className="text-primary">en pratiquant.</span>
            </h1>
            <p className="lead text-secondary">
              Des microservices réels. Des pipelines DevOps concrets. Une vraie croissance de carrière.
            </p>
          </div>

          <div className="row g-3 z-1">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="col-4">
                <div className="card bg-dark bg-opacity-50 border-secondary p-3 text-center">
                  <Icon size={20} className="text-primary mb-2 mx-auto" />
                  <div className="h4 fw-bold mb-0">{value}</div>
                  <div className="small text-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PANNEAU DROIT (Formulaire de Connexion) ──────────── */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center p-4">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <div className="mb-4">
              <h2 className="fw-bold text-white">Connexion</h2>
              <p className="text-secondary">Bon retour — reprenez là où vous vous étiez arrêté.</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small text-uppercase fw-bold">Adresse Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Mail size={18} />
                  </span>
                  <input type="email" className="form-control bg-dark border-secondary text-white" placeholder="vous@exemple.com"
                    value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label text-secondary small text-uppercase fw-bold">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <Lock size={18} />
                  </span>
                  <input type="password" className="form-control bg-dark border-secondary text-white" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={loading}>
                {loading ? 'Connexion...' : 'Continuer'} <ArrowRight size={18} className="ms-1" />
              </button>
            </form>

            <hr className="my-5 border-secondary" />

            <p className="text-center text-secondary">
              Vous n'avez pas de compte ?{' '}
              <Link href="/register" className="text-primary fw-bold text-decoration-none">
                En créer un →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
