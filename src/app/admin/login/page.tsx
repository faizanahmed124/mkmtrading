"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("Email ya password ghalat hai. Dobara koshish karein.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="perspective-container flex min-h-[80vh] items-center justify-center px-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, rotateX: 6, y: 20 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full max-w-sm rounded-md border border-steel-soft bg-panel-raised p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-brass" />
          <h1 className="font-display text-2xl tracking-wide text-cream">
            Admin sign in
          </h1>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-steel bg-panel px-3 py-2 text-cream outline-none focus:border-brass"
            placeholder="admin@example.com"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-silver/70">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-steel bg-panel px-3 py-2 text-cream outline-none focus:border-brass"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="mb-4 text-sm text-signal" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-brass px-6 py-3 text-sm font-medium text-asphalt transition-colors hover:bg-brass-soft disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-xs text-silver/70">
          Admin accounts are created in Supabase directly — there is no
          public sign-up here.
        </p>
      </motion.form>
    </div>
  );
}
