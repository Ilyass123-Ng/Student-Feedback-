'use client';

import { useEffect, useState } from 'react';
import { getCourseById, getFeedbackByCourse, addFeedback, updateFeedback, deleteFeedback } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { Star, MessageSquare, Send, AlertCircle, UserCircle, ArrowLeft, Trash2, Edit2, X } from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [commentaire, setCommentaire] = useState('');
  const [note, setNote] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await getCourseById(id);
      setCourse(data);
      const res = await getFeedbackByCourse(data.title);
      setFeedbacks(Array.isArray(res.data) ? res.data : []);
    } catch { setError('Course not found'); }
  };

  useEffect(() => { load(); }, [id]);

  const submitFeedback = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      if (editingId) await updateFeedback(course.title, { id_feedback: editingId, commentaire, note });
      else await addFeedback(course.title, { commentaire, note });
      setCommentaire(''); setNote(5); setEditingId(null);
      load();
    } catch { setError('Failed to submit. Please login.'); }
    finally { setLoading(false); }
  };

  const del = async (feedbackId) => {
    try { await deleteFeedback(course.title, { id_feedback: feedbackId }); load(); setDeletingId(null); }
    catch { alert('Delete failed'); }
  };

  const startEdit = (fb) => {
    setEditingId(fb._id);
    setCommentaire(fb.commentaire);
    setNote(fb.note);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (error) return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <AlertCircle size={48} className="text-secondary opacity-25 mb-3" />
      <h3 className="fw-bold text-white mb-2">Cours introuvable</h3>
      <p className="text-secondary mb-4">Ce cours n'existe pas ou a été supprimé.</p>
      <Link href="/courses" className="btn btn-primary px-4 fw-bold">Retour aux cours</Link>
    </div>
  );

  if (!course) return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const avg = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.note, 0) / feedbacks.length).toFixed(1)
    : null;

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        
        {/* Back */}
        <Link href="/courses" className="btn btn-link p-0 mb-4 text-secondary text-decoration-none small d-flex align-items-center gap-2">
          <ArrowLeft size={16} /> Back to courses
        </Link>

        {/* Course card */}
        <div className="card p-4 p-md-5 mb-4 border-secondary text-white bg-dark bg-opacity-25">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.65rem' }}>{course.category}</span>
            {avg && (
              <span className="d-flex align-items-center gap-1 small fw-bold text-warning">
                <Star size={14} className="fill-warning" /> {avg}
                <span className="text-secondary fw-normal ms-1">({feedbacks.length} reviews)</span>
              </span>
            )}
          </div>
          <h1 className="fw-bold mb-3">{course.title}</h1>
          <p className="lead text-secondary mb-4">{course.description}</p>
          <div className="d-flex align-items-center gap-2 small text-secondary">
            <UserCircle size={18} /> {course.instructor}
          </div>
        </div>

        {/* Feedback list */}
        <div className="card p-4 mb-4 border-secondary text-white bg-dark bg-opacity-25">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Reviews ({feedbacks.length})
          </h5>
          
          {feedbacks.length === 0 ? (
            <p className="text-center text-secondary py-4 small">No reviews yet. Be the first!</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {feedbacks.map(fb => (
                <div key={fb._id} className="p-3 rounded bg-white bg-opacity-5 border border-secondary border-opacity-25 relative group">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14}
                          className={s <= fb.note ? 'text-warning fill-warning' : 'text-secondary opacity-50'} />
                      ))}
                      <span className="text-secondary ms-2" style={{ fontSize: '10px' }}>
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="d-flex gap-2 opacity-50 hover-opacity-100 align-items-center">
                        {deletingId === fb._id ? (
                          <div className="d-flex gap-1">
                            <button type="button" onClick={(e) => { e.stopPropagation(); del(fb._id); }} className="btn btn-sm btn-danger py-0 px-2 small fw-bold" style={{ fontSize: '10px' }}>Confirm</button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="btn btn-sm btn-outline-secondary py-0 px-2 small" style={{ fontSize: '10px' }}>No</button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => startEdit(fb)} className="btn btn-sm p-0 text-info border-0">
                              <Edit2 size={14} />
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(fb._id); }} className="btn btn-sm p-0 text-danger border-0">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mb-0 small text-secondary">{fb.commentaire}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit form */}
        {isAuthenticated ? (
          <div className="card p-4 border-secondary text-white bg-dark bg-opacity-25">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{editingId ? 'Edit your review' : 'Leave a review'}</h5>
              {editingId && (
                <button onClick={() => { setEditingId(null); setCommentaire(''); setNote(5); }} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 py-1">
                  <X size={14} /> Cancel Edit
                </button>
              )}
            </div>
            {error && <div className="alert alert-danger small py-2 d-flex align-items-center gap-2"><AlertCircle size={16} /> {error}</div>}
            <form onSubmit={submitFeedback}>
              <div className="d-flex align-items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button type="button" key={s} onClick={() => setNote(s)} className="btn p-0 border-0">
                    <Star size={24} className={s <= note ? 'text-warning fill-warning' : 'text-secondary opacity-25'} style={{ transition: '0.2s' }} />
                  </button>
                ))}
                <span className="ms-2 small text-secondary">{note}/5</span>
              </div>
              <div className="mb-3">
                <textarea className="form-control bg-dark border-secondary text-white small" rows="3" placeholder="Share your experience…"
                  value={commentaire} onChange={e => setCommentaire(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 fw-bold small px-4" disabled={loading}>
                <Send size={16} /> {loading ? 'Saving…' : (editingId ? 'Update review' : 'Submit review')}
              </button>
            </form>
          </div>
        ) : (
          <div className="card p-4 text-center border-secondary bg-dark bg-opacity-10">
            <p className="small text-secondary mb-0">
              <Link href="/login" className="text-primary fw-bold text-decoration-none">Sign in</Link> to leave a review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
