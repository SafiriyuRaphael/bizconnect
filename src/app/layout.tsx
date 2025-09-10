import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import Navbar from "../shared/components/layout/Header";
import { Providers } from "./Providers";
import MessageModal from "../shared/components/modal/MessageModal";
import SocketAndCalls from "@/shared/components/composites/SocketAndCalling";
import { QueryClient } from "@tanstack/react-query";
import QueryErrorHandler from "../shared/components/composites/QueryErrorHandler";
// import { ApiProvider } from "../shared/components/composites/ApiProvider";
import Footer from "../shared/components/layout/Footer";
import { BASEURL } from "@/shared/constants/url";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bizconnect",
  url: `${BASEURL}`,
  logo: `${BASEURL}/BizconnectLogo.svg`,
  sameAs: [
    "https://twitter.com/bizconnect",
    "https://linkedin.com/company/bizconnect",
  ],
};

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bizconnect",
    template: "%s | Bizconnect",
  },
  description:
    "Bizconnect is the modern business service marketplace — network smarter, chat instantly, jump on video or audio calls, showcase products with built-in analytics, and close deals securely with escrow payments. Connect. Collaborate. Grow.",
  keywords: [
    "Bizconnect",
    "business networking",
    "marketplace",
    "video calls",
    "audio calls",
    "chat",
    "escrow payments",
    "business services",
    "product analytics",
    "B2B collaboration",
    "startup tools",
    "freelance marketplace",
  ],
  authors: [{ name: "Bizconnect Team", url: `${BASEURL}` }],
  creator: "Bizconnect",
  publisher: "Bizconnect",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/BizconnectLogo.svg",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASEURL}`,
    siteName: "Bizconnect",
    title: "Bizconnect — Connect. Collaborate. Grow.",
    description:
      "The all-in-one platform for business networking, real-time chat, video & audio calls, product showcases with analytics, and secure escrow payments.",
    images: [
      {
        url: `${BASEURL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Bizconnect App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bizconnect — Connect. Collaborate. Grow.",
    description:
      "Your modern hub for business networking, chat, calls, product analytics, and secure escrow payments — all in one place.",
    site: "@bizconnect",
    creator: "@bizconnect",
    images: [`${BASEURL}/og-image.png`],
  },
  category: "business",
  alternates: {
    canonical: `${BASEURL}`,
    languages: {
      "en-US": `${BASEURL}`,
    },
  },
  other: {
    "script:ld+json": JSON.stringify(orgSchema),
  },
};

const queryClient = new QueryClient();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <Script
        id="org-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <body
        className={`${merriweather.variable} antialiased font-merriweather`}
      >
        <Providers session={session}>
          <QueryErrorHandler>
            <SocketAndCalls />
            <MessageModal />
            <Navbar />
            {children}
            <Footer />
          </QueryErrorHandler>
        </Providers>
      </body>
    </html>
  );
}
