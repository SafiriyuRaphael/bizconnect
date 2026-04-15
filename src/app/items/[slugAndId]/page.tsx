import getProductsById from "@/lib/products/getProductsById";
import { redirect } from "next/navigation";
import React from "react";
import ItemPage from "../components/ItemPage";
import getProductIds from "@/lib/products/getIds";
import { auth } from "@/auth";
import Script from "next/script";
import { ProductsItemsPageProps } from "../../../../types";
import slugify from "@/shared/utils/slugify";
import { BASEURL } from "@/shared/constants/url";

type Params = {
  params: Promise<{ slugAndId: string }>;
};

// export async function generateStaticParams() {
//   const productIds = await getProductIds({});
//   return productIds?.ids.map(
//     ({ id, title }: { id: string; title: string }) => ({
//       slugAndId: `${slugify(title)}-${id}`,
//     }),
//   );
// }

export async function generateMetadata({ params }: Params) {
  const slugAndId = (await params).slugAndId;
  const id = slugAndId.split("-").pop()!;
  const product = await getProductsById({ id });

  const item: ProductsItemsPageProps | null = product?.item || null;

  if (!item) {
    return {
      title: "Not Found | Bizconnect",
      description: "This listing could not be found on Bizconnect.",
    };
  }

  const isService = item.type === "service";

  return {
    title: `${item.title} | ${isService ? "Service" : "Product"} on Bizconnect`,
    description:
      item.description ||
      `Discover trusted ${isService ? "services" : "products"} like ${
        item.title
      } on Bizconnect. 
       Verified businesses, secure escrow, and real customer reviews.`,
    openGraph: {
      title: `${item.title} | ${
        isService ? "Service" : "Product"
      } on Bizconnect`,
      description:
        item.description ||
        `Get ${item.title} with escrow-protected transactions on Bizconnect.`,
      url: `${BASEURL}/item/${item._id}`,
      siteName: "Bizconnect",
      images: item.media?.length
        ? item.media.map((m) => ({ url: m.url }))
        : [{ url: "/fallbackproduct.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | ${
        isService ? "Service" : "Product"
      } on Bizconnect`,
      description:
        item.description ||
        `Check out this ${isService ? "service" : "product"} on Bizconnect.`,
      images: item.media?.[0]?.url || "/fallbackproduct.png",
    },
  };
}

export default async function page({ params }: Params) {
  // const session = await auth();

  const slugAndId = (await params).slugAndId;
  const id = slugAndId.split("-").pop()!;

  // if (!session?.user) {
  //   redirect(
  //     `/auth/login?callbackUrl=${encodeURIComponent(`/items/${slugAndId}`)}`
  //   );
  // }

  const item = await getProductsById({ id });

  const productItem = item.item;

  return (
    <>
      {" "}
      <Script
        id="listing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productItem.type === "service"
              ? {
                  "@context": "https://schema.org",
                  "@type": "Service",
                  name: productItem.title,
                  description: productItem.description,
                  provider: {
                    "@type": "Organization",
                    name:
                      productItem.user.businessName ||
                      productItem.user.fullName,
                    logo: productItem.user.logo,
                  },
                  areaServed: "NG",
                  offers: {
                    "@type": "Offer",
                    url: `${BASEURL}/item/${productItem._id}`,
                    priceCurrency: "NGN",
                    price: productItem.price,
                    availability: productItem.isAvailable
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                  },
                }
              : {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: productItem.title,
                  description: productItem.description,
                  image: productItem.media?.map((m) => m.url) || [],
                  brand: {
                    "@type": "Organization",
                    name: "Bizconnect",
                    logo: productItem.user.logo,
                  },
                  offers: {
                    "@type": "Offer",
                    url: `${BASEURL}/item/${slugAndId}`,
                    priceCurrency: "NGN",
                    price: productItem.price,
                    availability: productItem.isAvailable
                      ? "https://schema.org/InStock"
                      : "https://schema.org/OutOfStock",
                    seller: {
                      "@type": "Organization",
                      name:
                        productItem.user.businessName ||
                        productItem.user.fullName,
                    },
                  },
                },
          ),
        }}
      />
      <ItemPage productItem={productItem} />
    </>
  );
}
