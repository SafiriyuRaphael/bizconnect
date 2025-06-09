import { ArrowRight, HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-10 backdrop-blur-md bg-white/10 border-b border-white/20">
      <div className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center group cursor-pointer">
          <div className=" size-14 rounded-xl group-hover:scale-110 transition-transform duration-300 object-cover">
            <Image
              src="/bizcon.png"
              alt="logo"
              width={1200}
              height={1000}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            BizConnect
          </span>
        </div>

        <nav className="flex items-center gap-8">
          <ul className="flex gap-6 items-center">
            {["Home", "About", "Categories"].map((item, index) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/login" : `/${item.toLowerCase()}`}
                  className="relative px-4 py-2 text-white/90 hover:text-white transition-all duration-300 group"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign In
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
