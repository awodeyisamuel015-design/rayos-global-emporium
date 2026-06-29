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
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
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

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-400">
            RAYOS
          </h1>

          <p className="text-gray-300 mt-1">
            Global Emporium
          </p>
        </div>

        {/* Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Welcome Back 👋
          </h2>

          <p className="text-gray-400 mt-2">
            Login to continue shopping.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-gray-400 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Password */}
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-yellow-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-yellow-400 py-3 font-bold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          {/* Register */}
          <p className="text-center text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-yellow-400 hover:underline"
            >
              Create one
            </Link>
          </p>

        </form>
      </div>
    </main>
  );
}
