'use client';

import { useEffect, useState } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Check, Shield, BookOpen } from 'lucide-react';

const empty = { title: '', description: '', category: '', instructor: '' };

export default function AdminPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      const { data } = await getCourses(1, 100);
      setCourses(Array.isArray(data) ? data : (data.courses || []));
    } catch { setCourses([]); }
  };

  useEffect(() => {
    if (!isAuthenticated) return router.push('/login');
    if (!isAdmin) return router.push('/courses');
    load();
  }, [isAdmin, isAuthenticated]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingId) await updateCourse(editingId, form);
      else await addCourse(form);
      setForm(empty); setEditingId(null); setShowForm(false);
      load();
    } finally { setLoading(false); }
  };

  const del = async (id) => {
    try { await deleteCourse(id); load(); setDeletingId(null); }
    catch { alert('Error deleting'); }
  };

  const startEdit = (c) => { 
    setForm(c); setEditingId(c._id); setShowForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '1000px' }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Shield size={20} className="text-primary" />
              <h2 className="fw-bold mb-0 text-white">Admin Dashboard</h2>
            </div>
            <p className="text-secondary small mb-0">{(courses?.length || 0)} course{(courses?.length !== 1) ? 's' : ''} total</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 small fw-bold"
            onClick={() => { setEditingId(null); setForm(empty); setShowForm(true); }}>
            <Plus size={16} /> New course
          </button>
        </div>

        {/* Form panel */}
        {showForm && (
          <div className="card p-4 mb-4 border-secondary text-white bg-dark bg-opacity-25 shadow-lg">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0">{editingId ? 'Edit course' : 'New course'}</h5>
              <button onClick={() => setShowForm(false)} className="btn btn-link text-secondary p-0 border-0">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">Title</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Intro to Cloud…"
                    value={form.title} onChange={e => set('title', e.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">Category</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Cloud, DevOps…"
                    value={form.category} onChange={e => set('category', e.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">Instructor</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Jane Doe"
                    value={form.instructor} onChange={e => set('instructor', e.target.value)} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small text-uppercase fw-bold">Description</label>
                  <input className="form-control bg-dark border-secondary text-white" placeholder="Short description…"
                    value={form.description} onChange={e => set('description', e.target.value)} required />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 fw-bold small" disabled={loading}>
                  <Check size={16} /> {loading ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-outline-secondary small fw-bold" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="card border-secondary text-white bg-dark bg-opacity-25 overflow-hidden">
          {(!courses || courses.length === 0) ? (
            <div className="text-center py-5">
              <BookOpen size={48} className="text-secondary opacity-25 mb-3" />
              <p className="text-secondary small">No courses yet. Add one above!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead className="table-light opacity-75">
                  <tr className="small text-uppercase">
                    <th className="px-4 py-3">Title</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Instructor</th>
                    <th className="text-end px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c._id} className="border-secondary border-opacity-10">
                      <td className="px-4 fw-bold text-white small">{c.title}</td>
                      <td><span className="badge bg-primary text-uppercase" style={{ fontSize: '0.65rem' }}>{c.category}</span></td>
                      <td className="text-secondary small">{c.instructor}</td>
                      <td className="px-4 text-end">
                        <div className="d-flex justify-content-end gap-2 align-items-center">
                          {deletingId === c._id ? (
                            <div className="d-flex gap-1 animate-fadeIn">
                              <button type="button" onClick={(e) => { e.stopPropagation(); del(c._id); }} className="btn btn-sm btn-danger py-0 px-2 small fw-bold" style={{ fontSize: '10px' }}>Confirm</button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="btn btn-sm btn-outline-secondary py-0 px-2 small" style={{ fontSize: '10px' }}>No</button>
                            </div>
                          ) : (
                            <>
                              <button type="button" onClick={(e) => { e.stopPropagation(); startEdit(c); }} className="btn btn-sm btn-outline-info p-1 px-2 border-opacity-50">
                                <Pencil size={14} />
                              </button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(c._id); }} className="btn btn-sm btn-outline-danger p-1 px-2 border-opacity-50">
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
