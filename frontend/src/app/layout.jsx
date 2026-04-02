// src/app/layout.jsx
// Hada l'layout l'assasi dial l'application dialna.
// K-t-wrappi ga3 les pages b'auth provider w navbar.

import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap design
import "./globals.css"; // CSS global
import { AuthProvider } from "@/context/AuthContext"; // Provider dial l'authentification
import Navbar from "@/components/Navbar"; // L'navbar

const inter = Inter({ subsets: ["latin"] });

// Metadata dial l'application
export const metadata = {
  title: "CloudLearn — Plateforme de Cours",
  description: "Application de gestion de cours Cloud Native",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* AuthProvider bach n-share l'auth state m3a ga3 l'app */}
        <AuthProvider>
          <Navbar />
          {/* Main content dial kolla page */}
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
