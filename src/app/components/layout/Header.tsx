"use client";
import {
  Menu,
  X,
  MessageCircle,
  Bell,
  Wallet,
  Heart,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import AuthButton from "../ui/AuthButton";
import { signOut, useSession } from "next-auth/react";
import { useUnreadMessages } from "@/hook/useUnreadMessages";
import ProfileImage from "./ProfileImage";
import getVerificationStatus from "@/lib/business/getVerificationStatus";
import { VerificationStatusProps } from "../../../../types";
import usePaymentsApi from "@/hook/usePaymentsApi";
import WalletModal from "./WalletDropdown";

export default function Navbar() {
  const { unreadMessages } = useUnreadMessages();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New order received", time: "2m ago", unread: true },
    { id: 2, message: "Payment confirmed", time: "1h ago", unread: true },
    {
      id: 3,
      message: "Profile updated successfully",
      time: "3h ago",
      unread: false,
    },
  ]);
  const [wishlistCount, setWishlistCount] = useState(12);
  const [verification, setVerification] = useState<
    VerificationStatusProps | string | null
  >(null);

  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const { data: session } = useSession();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/home" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  const isLoggedIn = !!session?.user;
  const unreadNotifications = notifications.filter((n) => n.unread).length;

  // Don't show header for admin users
  if (session?.user.userRole === "admin") {
    return null;
  }

  useEffect(() => {
    fetchVerificationStatus();
  }, [session?.user.id]);

  const fetchVerificationStatus = async () => {
    try {
      const status = await getVerificationStatus(session?.user.id);
      setVerification(status || null);
    } catch (error) {
      console.error("Failed to fetch verification status:", error);
      setVerification(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200/30 shadow-xl shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo Section */}
            <Link href="/" className="flex items-center group cursor-pointer">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt=""
                  className="size-10 sm:size-12 rounded-xl p-0.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/25"
                />
              </div>
              <div className="ml-3">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
                  BizConnect
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">
                  Business Network
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Main Navigation Links */}
              <ul className="flex gap-1 items-center">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group rounded-lg ${
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {pathname === item.href && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              {isLoggedIn && (
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  {/* Messages */}
                  <Link
                    href="/chat"
                    className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg group"
                    title="Messages"
                  >
                    <MessageCircle size={20} />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg group"
                      title="Notifications"
                    >
                      <Bell size={20} />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Wallet */}
                  {typeof verification === "object" &&
                    verification?.status === "approved" && <WalletModal />}

                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    className="relative p-2.5 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 rounded-lg group"
                    title="Wishlist & Favorites"
                  >
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
                    >
                      <ProfileImage
                        logo={session.user.logo}
                        user={{
                          businessName: session.user.businessName,
                          fullName: session.user.name,
                        }}
                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      />
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-300 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900">
                            {session?.user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session?.user?.email}
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            href={`/profile/${session.user.id}`}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                          <Link
                            href={`/profile/${session.user.id}/escrow`}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <ShoppingBag size={16} />
                            My Orders
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                            onClick={() => {
                              signOut({ callbackUrl: "/auth/login" });
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Auth Button for non-logged in users */}
              {!isLoggedIn && (
                <div
                  className="pl-4 border-l border-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <AuthButton isLoggedIn={isLoggedIn} session={session} />
                </div>
              )}
            </nav>

            {/* Mobile Right Section */}
            <div className="md:hidden flex items-center gap-1">
              {isLoggedIn && (
                <>
                  {/* Mobile Messages */}
                  <Link
                    href="/chat"
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg"
                  >
                    <MessageCircle size={20} />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadMessages > 99 ? "99+" : unreadMessages}
                      </span>
                    )}
                  </Link>

                  {/* Mobile Notifications */}
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg">
                    <Bell size={20} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 rounded-lg ml-1"
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    size={20}
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
              isMobileMenuOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <nav className="py-4 border-t border-gray-100">
              {/* Mobile Navigation Links */}
              <ul className="space-y-1 px-4">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 transition-all duration-300 rounded-lg font-medium ${
                        pathname === item.href
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile User Section */}
              {isLoggedIn && (
                <div className="px-4 pt-4 mt-4 border-t border-gray-100 space-y-2">
                  {typeof verification === "object" &&
                    verification?.status === "approved" && (
                      <div>
                        <WalletModal/>
                      </div>
                    )}

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 rounded-lg font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={20} />
                      <span>Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* Mobile Auth Section */}
              <div className="px-4 pt-4 mt-4 border-t border-gray-100">
                <AuthButton isLoggedIn={isLoggedIn} session={session} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
