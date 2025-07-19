"use client";
import { Menu, X, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthButton from "../ui/AuthButton";
import { useSession } from "next-auth/react";
import { useUnreadMessages } from "@/hook/useUnreadMessages";

export default function Navbar() {
  const {unreadMessages}= useUnreadMessages()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const { data: session } = useSession();



  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 left-0 w-full z-50 backdrop-blur-md bg-white/95 border-b border-gray-200/50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group cursor-pointer">
            <div className="size-10 sm:size-12 lg:size-14 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40">
              <Image
                src="/bizcon.png"
                alt="BizConnect Logo"
                width={1200}
                height={1000}
                className="object-contain w-full h-full rounded-xl"
                priority
              />
            </div>
            <span className="ml-2 sm:ml-3 text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
              BizConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <ul className="flex gap-1 lg:gap-2 items-center">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="relative px-3 lg:px-5 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-300 group rounded-lg flex items-center gap-2"
                  >
                    <span className="relative z-10 font-medium flex items-center gap-1.5">
                      <span className="text-sm lg:text-base">{item.name}</span>
                    </span>

                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>

                    {/* Bottom border animation */}
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300 rounded-full"></div>
                  </Link>
                </li>
              ))}

              {/* Desktop Messages Link */}
              <li>
                <Link
                  href="/chat"
                  className={`relative px-3 lg:px-5 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-300 group rounded-lg flex items-center gap-2 ${
                    !isLoggedIn ? "hidden" : ""
                  }`}
                >
                  <span className="relative z-10 font-medium flex items-center gap-1.5">
                    <MessageCircle size={16} className="text-blue-500" />
                    <span className="text-sm lg:text-base">Messages</span>
                  </span>

                  {/* Notification Badge */}
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}

                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>

                  {/* Bottom border animation */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-4/5 group-hover:left-[10%] transition-all duration-300 rounded-full"></div>
                </Link>
              </li>
            </ul>

            {/* Sign In Button */}
            <div className="ml-2 lg:ml-4">
              <AuthButton isLoggedIn={isLoggedIn} session={session} />
            </div>
          </nav>

          {/* Mobile Messages & Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Messages Button */}
            <Link
              href="/messages"
              className={`relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 rounded-lg hover:bg-gray-100 ${
                !isLoggedIn ? "hidden" : ""
              }`}
            >
              <MessageCircle size={24} className="text-blue-500" />
              {/* Mobile Notification Badge */}
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {unreadMessages > 99 ? "99+" : unreadMessages}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 rounded-lg hover:bg-gray-100"
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
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="py-4 border-t border-gray-200">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative flex items-center justify-between px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 rounded-lg font-medium group"
                  >
                    <span className="flex items-center gap-2">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Sign In Button */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <AuthButton isLoggedIn={isLoggedIn} session={session} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
