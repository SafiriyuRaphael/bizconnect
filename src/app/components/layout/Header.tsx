"use client";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/95 border-b border-gray-200/50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group cursor-pointer">
            <div className="size-12 sm:size-14 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40">
              <Image
                src="/bizcon.png"
                alt="BizConnect Logo"
                width={1200}
                height={1000}
                className="object-contain w-full h-full rounded-xl"
                priority
              />
            </div>
            <span className="ml-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
              BizConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex gap-2 items-center">
              {["Home", "About", "Categories"].map((item, index) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="relative px-5 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-300 group rounded-lg"
                  >
                    <span className="relative z-10 font-medium">{item}</span>
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                    {/* Bottom border animation */}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300 rounded-full"></div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Sign In Button */}
            <Link
              href="/auth/login"
              className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group overflow-hidden border border-white/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign In
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 rounded-lg hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-0 rotate-90"
                    : "opacity-100 rotate-0"
                }`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 border-t border-gray-200">
            <ul className="space-y-2">
              {["Home", "About", "Categories"].map((item, index) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-lg font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Sign In Button */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Sign In
                <ArrowRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
