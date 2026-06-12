"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuth } from "../adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const success = adminAuth.login(password);

    if (success) {
      router.push("/admin"); // go to dashboard
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-white/10 p-8 rounded-xl w-96">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 mb-4 rounded bg-white/10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black py-3 rounded font-bold"
        >
          Login
        </button>

      </div>
    </div>
  );
}