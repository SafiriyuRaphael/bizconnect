import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import getUserByUsername from "@/app/[businessprofile]/api/getUsersByUsername";
import UsersProfile from "./components";
import getAllUsername from "@/app/[businessprofile]/api/getAllUsername";
import { Metadata } from "next";
import { BASEURL } from "@/shared/constants/url";
import Script from "next/script";

type Params = {
  params: Promise<{ businessprofile: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const username = (await params).businessprofile;
  const user = await getUserByUsername(username);
  // console.log(user);

  if (!user) {
    return {
      title: "Profile Not Found | Bizconnect",
      description: `We couldn't find a Bizconnect profile for ${username}.`,
      robots: { index: false, follow: false },
    };
  }
  const avatar = user.logo || `${BASEURL}/og-image.png`;
  const profileUrl = `${BASEURL}/${username}`;

  const fullName = user.businessName || user.fullName;
  const bio =
    user.businessDescription ||
    `${fullName} is a member of Bizconnect — the modern business service marketplace.`;

  return {
    title: `${fullName} | Bizconnect`,
    description: bio,
    openGraph: {
      type: "profile",
      locale: "en_US",
      url: profileUrl,
      siteName: "Bizconnect",
      title: `${fullName} | Bizconnect`,
      description: bio,
      images: [
        {
          url: avatar,
          width: 400,
          height: 400,
          alt: `${fullName}'s profile picture`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} | Bizconnect`,
      description: bio,
      images: [avatar],
    },
    applicationName: "Bizconnect",
    alternates: {
      canonical: profileUrl,
    },
  };
}

// export const dynamic = "force-dynamic";

// export async function generateStaticParams() {
//   const usernames = await getAllUsername();
//   return usernames.usernames.map((username: string) => ({
//     businessprofile: username,
//   }));
// }

export default async function page({ params }: Params) {
  const session = await auth();
  const username = (await params).businessprofile;

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(`/` + username)}`);
  }

  // if (session.user.username !== username) {
  //   redirect("/auth/login");
  // }

  const user = await getUserByUsername(username);

  if (!user) notFound();

  const profileUrl = `${BASEURL}/${username}`;

  const fullName = user.businessName || user.fullName;

  const schema = {
    "@context": "https://schema.org",
    "@type": user.businessName ? "Organization" : "Person",
    "@id": profileUrl,
    name: user.businessName || user.fullName,
    url: profileUrl,
    image: user.logo || `${BASEURL}/og-image.png`,
    sameAs: [user.website].filter(Boolean),
    worksFor: !user.businessName
      ? {
          "@type": "Organization",
          name: "Bizconnect",
          url: `${BASEURL}`,
        }
      : undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Bizconnect",
        item: BASEURL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: fullName,
        item: profileUrl,
      },
    ],
  };

  return (
    <>
      {" "}
      <Script
        id="person-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([schema, breadcrumbSchema]),
        }}
      />
      <UsersProfile user={user} session={session.user} />{" "}
    </>
  );
}
