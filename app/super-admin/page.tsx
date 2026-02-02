"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  Building2,
  Activity,
  Server,
} from "lucide-react";

type AdminUser = {
  id: number;
  email: string;
  role: string;
};

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/admin-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Accès refusé");
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Chargement...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const stats = [
    {
      title: "Admins",
      value: "6",
      icon: ShieldCheck,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Entreprises",
      value: "18",
      icon: Building2,
      color: "from-emerald-500 to-green-600",
    },
    {
      title: "Utilisateurs",
      value: "1 284",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Système",
      value: "OK",
      icon: Server,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Contrôle global de la plateforme
        </p>
      </div>

      {/* Infos Super Admin */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm opacity-80">Connecté en tant que</p>
        <p className="text-lg font-semibold">{user?.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
          {user?.role}
        </span>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité système */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">
            Activité système
          </h3>

          <ul className="space-y-3 text-sm text-slate-600">
            <li>🟢 Tous les services sont opérationnels</li>
            <li>👤 Nouvel admin_company ajouté</li>
            <li>🏢 Nouvelle entreprise enregistrée</li>
            <li>🔐 Permissions vérifiées</li>
          </ul>
        </div>

        {/* État global */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-semibold mb-2">État global</h3>
          <p className="text-sm opacity-90">
            La plateforme fonctionne normalement.
            Aucune alerte critique détectée.
          </p>
        </div>
      </div>
    </div>
  );
}
