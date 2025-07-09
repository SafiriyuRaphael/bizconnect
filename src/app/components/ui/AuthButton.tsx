"use client";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";

export default function AuthButton() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isLoginPage = pathname === "/auth/login";
  const isLoggedIn = !!session?.user;

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

  const logo = session.user.logo;
  const businessName = session.user.businessName;
  const name = session.user.name;
  const username = session.user.username;

  console.log("Session bruh:", session);

  const fallbackAlt = businessName || name || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);

  return (
    <Link href={`/profile/${username}`}>
      {logo ? (
        <CldImage
          alt={fallbackAlt}
          src={logo}
          width={40}
          height={40}
          className="rounded-full hover:scale-110 transition-transform duration-300"
          crop={{
            type: "thumb",
            source: true,
          }}
        />
      ) : (
        <Image
          src={fallbackSrc}
          alt={fallbackAlt}
          width={40}
          height={40}
          className="rounded-full hover:scale-110 transition-transform duration-300"
        />
      )}
    </Link>
  );
}
