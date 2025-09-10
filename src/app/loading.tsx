"use client";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center z-50">
      {/* Main loading container */}
      <div className="relative flex flex-col items-center">
        {/* Animated puzzle piece loader */}
        <div className="relative w-24 h-24 mb-8">
          {/* Puzzle piece 1 - Top piece */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-lg animate-puzzle-float-1">
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          {/* Puzzle piece 2 - Left spine */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-x-5 w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-lg animate-puzzle-float-2">
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>

          {/* Puzzle piece 3 - Right connection */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 translate-x-1 w-6 h-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded shadow-lg animate-puzzle-float-3">
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>

          {/* Puzzle piece 4 - Bottom piece */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg shadow-lg animate-puzzle-float-4">
            <div className="absolute -top-1 left-1/3 w-2 h-2 bg-blue-700 rounded-full"></div>
            <div className="absolute -top-1 right-1/3 w-2 h-2 bg-blue-700 rounded-full"></div>
          </div>

          {/* Center connection point */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>

          {/* Floating connection nodes */}
          <div className="absolute -top-2 -left-2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-slow"></div>
          <div className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-medium"></div>
          <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-blue-600 rounded-full animate-float-fast"></div>
          <div className="absolute -bottom-2 -right-2 w-1.5 h-1.5 bg-blue-700 rounded-full animate-float-slow"></div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BizConnect
          </h2>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-1 h-1 bg-blue-700 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>

        {/* Loading progress bar */}
        <div className="w-64 h-1 bg-blue-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full animate-loading-bar"></div>
        </div>

        {/* Loading message */}
        <p className="mt-4 text-slate-600 text-sm animate-fade-in-up">
          Connecting businesses together...
        </p>

        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border border-blue-200 rounded-full animate-spin-slow opacity-30"></div>
          <div className="absolute w-40 h-40 border border-blue-300 rounded-full animate-spin-reverse opacity-20"></div>
        </div>
      </div>

      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-200 rounded-full animate-float-bg-1 opacity-60"></div>
        <div className="absolute top-32 right-32 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-bg-2 opacity-40"></div>
        <div className="absolute bottom-40 left-40 w-2.5 h-2.5 bg-blue-400 rounded-full animate-float-bg-3 opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-500 rounded-full animate-float-bg-4 opacity-70"></div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes puzzle-float-1 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-8px) rotate(2deg);
          }
        }

        @keyframes puzzle-float-2 {
          0%,
          100% {
            transform: translateX(-50%) translateX(-20px) translateY(0px)
              rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateX(-20px) translateY(-6px)
              rotate(-2deg);
          }
        }

        @keyframes puzzle-float-3 {
          0%,
          100% {
            transform: translateX(-50%) translateX(4px) translateY(0px)
              rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateX(4px) translateY(-4px)
              rotate(1deg);
          }
        }

        @keyframes puzzle-float-4 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-10px) rotate(-1deg);
          }
        }

        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-bg-1 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, -10px);
          }
        }

        @keyframes float-bg-2 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(-40px, 20px);
          }
        }

        @keyframes float-bg-3 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(20px, -40px);
          }
          75% {
            transform: translate(-30px, -20px);
          }
        }

        @keyframes float-bg-4 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(25px, -15px);
          }
        }

        .animate-puzzle-float-1 {
          animation: puzzle-float-1 3s ease-in-out infinite;
        }
        .animate-puzzle-float-2 {
          animation: puzzle-float-2 3s ease-in-out infinite 0.5s;
        }
        .animate-puzzle-float-3 {
          animation: puzzle-float-3 3s ease-in-out infinite 1s;
        }
        .animate-puzzle-float-4 {
          animation: puzzle-float-4 3s ease-in-out infinite 1.5s;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 3s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 12s linear infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-float-bg-1 {
          animation: float-bg-1 15s ease-in-out infinite;
        }
        .animate-float-bg-2 {
          animation: float-bg-2 12s ease-in-out infinite;
        }
        .animate-float-bg-3 {
          animation: float-bg-3 18s ease-in-out infinite;
        }
        .animate-float-bg-4 {
          animation: float-bg-4 10s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
