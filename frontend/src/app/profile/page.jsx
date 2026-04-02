'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile, getStudentFeedback } from '@/lib/api';
import { User, Mail, Shield, Save, AlertCircle, CheckCircle2, MessageSquare, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ 
    nom: user?.nom || '', 
    prenom: user?.prenom || '', 
    email: user?.email || '' 
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getStudentFeedback().then(res => setFeedbacks(res.data)).catch(() => {});
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div className="container py-5 text-center text-secondary">Connectez-vous pour voir votre profil.</div>
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      await updateProfile(form);
      setUser({ ...user, ...form });
      setMessage({ type: 'success', text: 'Profil mis à jour !' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <h1 className="fw-bold text-white mb-2 text-center">Mon Profil</h1>
        <p className="text-secondary mb-5 text-center text-uppercase small ls-wide">Paramètres & Historique</p>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mb-4 py-2 small`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-7">
            <div className="card border-secondary bg-dark bg-opacity-25 p-4 text-white shadow-lg h-100">
              <h5 className="fw-bold mb-4 small text-primary text-uppercase">Informations Personnelles</h5>
              <form onSubmit={handleUpdate} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-bold" style={{ fontSize: '10px' }}>NOM</label>
                  <input type="text" className="form-control bg-dark border-secondary text-white small" 
                    value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-secondary fw-bold" style={{ fontSize: '10px' }}>PRÉNOM</label>
                  <input type="text" className="form-control bg-dark border-secondary text-white small" 
                    value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required />
                </div>
                <div className="col-12">
                  <label className="form-label small text-secondary fw-bold" style={{ fontSize: '10px' }}>EMAIL</label>
                  <input type="email" className="form-control bg-dark border-secondary text-white small" 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div className="col-12 mt-4">
                  <button disabled={loading} className="btn btn-primary w-100 fw-bold d-flex gap-2 justify-content-center align-items-center">
                    <Save size={18} /> {loading ? 'Envoi...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* User Stats / Info */}
          <div className="col-lg-5">
            <div className="card border-secondary bg-dark bg-opacity-25 p-4 text-white h-100">
              <h5 className="fw-bold mb-4 small text-primary text-uppercase">Détails du compte</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="small text-secondary">Rôle</div>
                    <div className="fw-bold text-uppercase" style={{ fontSize: '12px' }}>{user?.role}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-info bg-opacity-10 text-info">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="small text-secondary">Avis donnés</div>
                    <div className="fw-bold" style={{ fontSize: '12px' }}>{feedbacks.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedbacks History */}
          <div className="col-12 mt-4">
            <div className="card border-secondary bg-dark bg-opacity-10 p-4 text-white">
              <h5 className="fw-bold mb-4 small text-primary text-uppercase d-flex align-items-center gap-2">
                <MessageSquare size={16} /> Mes derniers avis
              </h5>
              {feedbacks.length === 0 ? (
                <p className="text-secondary small mb-0 opacity-50">Vous n'avez pas encore laissé d'avis.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {feedbacks.map(fb => (
                    <div key={fb._id} className="p-3 rounded bg-white bg-opacity-5 border border-secondary border-opacity-25">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex gap-1 text-warning">
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= fb.note ? 'fill-warning' : 'opacity-25'} />)}
                        </div>
                        <span className="text-secondary" style={{ fontSize: '10px' }}>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="small mb-0 text-secondary italic">"{fb.commentaire}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
