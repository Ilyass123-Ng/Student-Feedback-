'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BookOpen, Layers, Lock, Star } from 'lucide-react';

// Composants de caractéristiques pour la page d'accueil
const FEATURES = [
  { icon: BookOpen, title: 'Cours Structurés', desc: 'Des programmes conçus par des experts sur Cloud, DevOps et architecture.' },
  { icon: Star,     title: 'Avis des Pairs',       desc: 'Partagez vos retours et guidez les futurs étudiants.' },
  { icon: Lock,     title: 'Accès Sécurisé',  desc: 'Sécurisé par JWT avec des niveaux de permissions granulaires.' },
  { icon: Layers,   title: 'Microservices',       desc: 'Construit sur une architecture réelle de microservices.' },
];

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <div className="container py-5">
      {/* ── Section Héro (Introduction) ────────────────────── */}
      <section className="text-center py-5">
        <div className="badge rounded-pill bg-dark border border-secondary text-secondary mb-4 p-2 px-3">
          <span className="bg-primary rounded-circle d-inline-block me-2" style={{ width: '8px', height: '8px' }} />
          Plateforme d'Apprentissage Cloud Native
        </div>

        <h1 className="display-3 fw-bold text-white mb-4">
          Maîtrisez le cloud,
          <br />
          <span className="gradient-text">déployez plus vite.</span>
        </h1>

        <p className="lead text-secondary max-w-xl mx-auto mb-5">
          Une plateforme moderne construite sur des microservices. Des vrais cours, des vrais avis, une vraie architecture.
        </p>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-center align-items-center">
          <Link href="/courses" className="btn btn-primary btn-lg px-4">
            Explorer les cours <ArrowRight size={18} className="ms-1" />
          </Link>
          {!isAuthenticated && (
            <Link href="/register" className="btn btn-outline-secondary btn-lg px-4">
              Créer un compte gratuit
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="btn btn-outline-info btn-lg px-4">
              Tableau de Bord Admin →
            </Link>
          )}
        </div>
      </section>

      {/* ── Grille des Fonctionnalités ─────────────────────── */}
      <section className="row g-4 py-5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="col-12 col-sm-6 col-lg-3">
            <div className="card h-100 p-4 border-secondary text-white bg-dark bg-opacity-25">
              <div className="mb-3 d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded p-2" style={{ width: '40px', height: '40px' }}>
                <Icon size={20} className="text-primary" />
              </div>
              <h5 className="fw-bold mb-2">{title}</h5>
              <p className="small text-secondary mb-0">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
