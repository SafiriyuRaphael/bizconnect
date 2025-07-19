"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import ProfileImage from "../layout/ProfileImage";
import { Session } from "next-auth";

interface Props {
  isLoggedIn: boolean;
  session: Session | null;
}

export default function AuthButton({ isLoggedIn, session }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/auth/login";

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  if (!isLoggedIn) {
    return (
      <Link
        href={isLoginPage ? "/auth/register" : "/auth/login"}
        className="relative px-14 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 group overflow-hidden border border-white/10"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isLoginPage ? "Sign Up" : "Sign In"}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </Link>
    );
  }

  const logo = session?.user.logo;
  const businessName = session?.user.businessName;
  const name = session?.user.name;
  const userId = session?.user.id;

  console.log("Session bruh:", session);

  const fallbackAlt = businessName || name || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);

  return (
    <Link href={`/profile/${userId}`}>
      <ProfileImage
        fallbackAlt={fallbackAlt}
        fallbackSrc={fallbackSrc}
        logo={logo}
      />
    </Link>
  );
}
