"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentHeading, setCurrentHeading] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const headings = [
    "CONNECTING BUSINESS AND BUYERS IN ONE ECOSYSTEM",
    "WHERE INNOVATION MEETS OPPORTUNITY",
    "BUILD, SHOWCASE, AND GROW YOUR BUSINESS",
    "EXPLORE, DISCOVER, AND ENGAGE WITH THE BEST BUSINESSES",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentHeading((prev) => (prev + 1) % headings.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [headings.length]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden pt-28">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/homepage.jpg')] bg-cover bg-center opacity-20 bg-blend-overlay"></div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col justify-center items-center min-h-[calc(100vh-100px)] text-center px-6">
        <div className="max-w-6xl mx-auto">
          {/* Animated heading */}
          <div className="mb-8 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <Sparkles className="text-yellow-400 animate-pulse" size={24} />
            </div>
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, #60a5fa, #34d399, #fbbf24)",
                backgroundSize: "200% 200%",
                animation: "gradient 3s ease infinite",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {headings[currentHeading]}
            </h1>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-4xl mx-auto leading-relaxed">
            BizConnect helps you{" "}
            <span className="text-blue-400 font-semibold">list</span>,{" "}
            <span className="text-cyan-400 font-semibold">manage</span>, and{" "}
            <span className="text-green-400 font-semibold">transact</span>,
            whether you&apos;re offering services or shopping for them.
          </p>

          {/* CTA Button */}
          <div className="relative">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform duration-300"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl"></div>
              </div>
            </Link>

            {/* Floating indicator dots */}
            <div className="flex justify-center gap-2 mt-8">
              {headings.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentHeading
                      ? "bg-blue-400 w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
