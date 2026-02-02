"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Building2,
  Save,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ================= TYPES ================= */

interface Company {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  fullname: string;
  email: string;
  role: string;
  company?: Company | null;
  isActive: boolean;
}

/* ================= PAGE ================= */

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_API_URL}users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Impossible de charger l'utilisateur");

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Échec de la mise à jour");
      }

      router.push("/admin/users");
    } catch (err: any) {
      setError(err.message || "Erreur serveur");
    } finally {
      setSaving(false);
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        Chargement...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-xl mt-10 rounded-xl bg-red-50 p-6 text-center">
        <XCircle className="mx-auto mb-2 text-red-600" />
        <p className="text-red-700">{error || "Utilisateur introuvable"}</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier l’utilisateur
          </h1>
          <p className="text-slate-500 text-sm">
            Mettre à jour les informations du compte
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-6 shadow-sm"
      >
        {/* Nom */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Nom complet
          </label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={user.fullname}
              onChange={(e) =>
                setUser({ ...user, fullname: e.target.value })
              }
              className="w-full pl-9 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="w-full pl-9 rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {/* Rôle */}
        <div>
          <label className="text-sm font-medium text-slate-700">Rôle</label>
          <div className="relative mt-1">
            <Shield className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <select
              value={user.role}
              onChange={(e) =>
                setUser({ ...user, role: e.target.value })
              }
              className="w-full pl-9 rounded-lg border px-3 py-2 text-sm"
            >
              <option value="ADMIN_COMPANY">Admin Société</option>
              <option value="MANAGER">Manager</option>
              <option value="PROJECT_MANAGER">Chef de projet</option>
              <option value="USER">Utilisateur</option>
            </select>
          </div>
        </div>

        {/* Société (lecture seule) */}
        <div>
          <label className="text-sm font-medium text-slate-700">Société</label>
          <div className="flex items-center gap-2 mt-1 text-slate-600">
            <Building2 size={16} />
            {user.company?.name || "Indépendant"}
          </div>
        </div>

        {/* Statut */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={user.isActive}
            onChange={(e) =>
              setUser({ ...user, isActive: e.target.checked })
            }
          />
          <span className="text-sm text-slate-700">
            Compte actif
          </span>
          {user.isActive ? (
            <CheckCircle2 className="text-emerald-600" size={16} />
          ) : (
            <XCircle className="text-rose-600" size={16} />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
