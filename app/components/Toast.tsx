"use client";

import { useEffect, useState } from "react";

type ToastType = {
  id: number;
  message: string;
};

let addToastFn: (msg: string) => void;

export function showToast(message: string) {
  addToastFn?.(message);
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    addToastFn = (message: string) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 space-y-2 z-[9999]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-black text-white px-4 py-3 rounded-xl shadow-lg border border-white/10 animate-slide"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}