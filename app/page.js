'use client';

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const targetDate = new Date("2025-07-23T00:00:00");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function getTimeRemaining() {
    const now = new Date();
    const total = targetDate.getTime() - now.getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { total, days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeLeft(remaining);
      if (remaining.total <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error("Please enter both name and email");
    }

    try {
      setLoading(true);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(`Thanks ${name}, you're on the list!`);
      setName("");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 h-full flex-grow">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 animate-pulse">
          TrustPadi 🚀 We’re Launching Soon
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-xl mb-10">
          Get ready for something amazing. We&apos;re counting down to the big day.
        </p>

        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          {["Days", "Hours", "Minutes", "Seconds"].map((label, i) => (
            <div
              key={label}
              className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl px-5 py-4 shadow-md border border-white/10"
            >
              <div className="text-4xl sm:text-5xl font-mono font-semibold text-blue-400 drop-shadow-sm">
                {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i]
                  .toString()
                  .padStart(2, "0")}
              </div>
              <div className="text-xs uppercase mt-2 tracking-wide text-gray-400">
                {label}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out px-6 py-2 rounded-xl text-white font-semibold shadow-xl focus:outline-none ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {loading ? "Submitting..." : "Notify Me"}
          </button>
        </form>
      </div>
    </div>
  );
}
