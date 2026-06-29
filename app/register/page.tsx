"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "../lib/supabase";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
} from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

   const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
  emailRedirectTo:
  "https://rayos-global-emporium-zrv7.vercel.app/auth/callback",
    data: {
      full_name: name,
    },
  },
});

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Registration successful!\n\nPlease check your email and click Verify Email."
    );

    router.push("/login");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.75), rgba(0,0,0,.75)), url('/login-bg.jpg')",
      }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            RAYOS
          </h1>

          <p className="text-gray-300">
            Global Emporium
          </p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Create Account
          </h2>

          <p className="text-gray-400 mt-2">
            Join Rayos Global Emporium
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-gray-400 outline-none focus:border-yellow-400"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-gray-400 outline-none focus:border-yellow-400"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-12 text-white placeholder:text-gray-400 outline-none focus:border-yellow-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-yellow-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>

      </div>
    </main>
  );
}
