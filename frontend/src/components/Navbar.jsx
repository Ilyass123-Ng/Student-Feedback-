'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, LayoutGrid, Zap, Star, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark border-bottom border-secondary sticky-top px-3">
      <div className="container-fluid">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <div className="bg-primary rounded p-1 shadow">
            <Zap size={18} className="text-white" />
          </div>
          <span className="fw-bold h5 mb-0">CloudLearn</span>
        </Link>

        {/* Links & Auth */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-2">
            <li>
              <Link href="/courses" className="nav-link small fw-medium text-white">
                <LayoutGrid size={14} className="me-1" /> Courses
              </Link>
            </li>
            <li>
              <Link href="/courses?filter=top" className="nav-link small fw-medium text-warning d-flex align-items-center gap-1">
                <Star size={14} className="fill-warning" /> Top Rated
              </Link>
            </li>
            {isAuthenticated && !isAdmin && (
              <li>
                <Link href="/profile" className="nav-link small fw-medium text-info d-flex align-items-center gap-1">
                  <MessageSquare size={14} /> Mes Avis
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link href="/admin" className="nav-link small fw-medium text-primary">
                  <Shield size={14} className="me-1" /> Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <Link href="/profile" className="d-flex align-items-center gap-2 py-1 px-2 rounded border border-secondary text-decoration-none hover-bg-secondary">
                  <div className="bg-primary rounded-circle text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                    {user?.nom?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="small text-white d-none d-lg-inline">{user?.nom || 'User'}</span>
                  <span className="badge bg-primary text-uppercase" style={{ fontSize: '9px' }}>{user?.role}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
                  <LogOut size={14} /> <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link href="/login" className="btn btn-sm btn-outline-secondary">Sign in</Link>
                <Link href="/register" className="btn btn-sm btn-primary px-3">Start</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
