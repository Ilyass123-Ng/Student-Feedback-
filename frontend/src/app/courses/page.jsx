'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCourses, searchCourses, getCoursesByCategory, getTopCourses } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Search, BookOpen, UserCircle, ChevronLeft, ChevronRight, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';

const CATS = ['All', 'Top Rated', 'Développement Web', 'Cloud', 'DevOps', 'Data Science', 'Sécurité'];

function CoursesList() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('filter') === 'top' ? 'Top Rated' : 'All';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ q: '', cat: 'All', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();

  // --- Sync URL Params ---
  useEffect(() => {
    const cat = searchParams.get('filter') === 'top' ? 'Top Rated' : 'All';
    setFilter(f => ({ ...f, cat, q: '' }));
  }, [searchParams]);

  // --- Fetch Data ---
  const load = async () => {
    setLoading(true);
    try {
      let res;
      if (filter.q) res = await searchCourses(filter.q);
      else if (filter.cat === 'Top Rated') res = await getTopCourses();
      else if (filter.cat !== 'All') res = await getCoursesByCategory(filter.cat);
      else res = await getCourses(filter.page);

      const data = Array.isArray(res.data) ? res.data : (res.data.courses || []);
      setCourses(data);
      setTotalPages(res.data.totalPages || 1);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const updateFilter = (upd) => setFilter(f => ({ ...f, ...upd, page: upd.page || 1 }));

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold text-white display-5">Courses</h1>
        <p className="text-secondary lead">Browse all available learning resources</p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto mb-4" style={{ maxWidth: '600px' }}>
        <div className="input-group input-group-lg bg-dark border border-secondary rounded overflow-hidden">
          <span className="input-group-text bg-transparent border-0 text-secondary pe-0">
            <Search size={20} />
          </span>
          <input type="text" className="form-control bg-transparent border-0 text-white placeholder-secondary small"
            placeholder="Search courses by title..." value={filter.q} onChange={e => updateFilter({ q: e.target.value })} />
        </div>
      </div>

      {/* Categories */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {CATS.map(c => (
          <button key={c} onClick={() => updateFilter({ cat: c })}
            className={`btn btn-sm px-3 rounded-pill fw-bold transition-all ${filter.cat === c ? 'btn-primary' : 'btn-outline-secondary border-opacity-25 text-secondary'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (!courses || courses.length === 0) ? (
        <div className="text-center py-5 text-secondary">
          <BookOpen size={48} className="mb-3 opacity-25" />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {courses.map(c => (
            <div key={c._id} className="col">
              <div className="card h-100 p-4 border-secondary text-white bg-dark bg-opacity-25">
                <div className="mb-3">
                  <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.65rem' }}>{c.category}</span>
                </div>
                <h5 className="fw-bold mb-3">{c.title}</h5>
                <p className="small text-secondary mb-4 flex-grow-1">{c.description}</p>
                <div className="mt-auto d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <UserCircle size={16} />{c.instructor}
                  </div>
                  {isAuthenticated && (
                    <Link href={`/courses/${c._id}`} className="btn btn-link p-0 text-primary text-decoration-none small d-flex align-items-center gap-1">
                      <MessageSquare size={14} /> Feedback
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!filter.q && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
              <button onClick={() => updateFilter({ page: filter.page - 1 })} disabled={filter.page === 1}
                className="btn btn-outline-secondary border-opacity-25 text-white px-4 small">Previous</button>
              <span className="small text-secondary">Page {filter.page} of {totalPages}</span>
              <button onClick={() => updateFilter({ page: filter.page + 1 })} disabled={filter.page === totalPages}
                className="btn btn-outline-secondary border-opacity-25 text-white px-4 small">Next</button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <CoursesList />
    </Suspense>
  );
}
