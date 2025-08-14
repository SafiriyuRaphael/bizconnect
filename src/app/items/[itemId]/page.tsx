import getProductsById from "@/lib/products/getProductsById";
import { redirect } from "next/navigation";
import React from "react";
import ItemPage from "../components/ItemPage";
import getProductIds from "@/lib/products/getIds";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

type Params = {
  params: Promise<{ itemId: string }>;
};

export async function generateStaticParams() {
  const productIds = await getProductIds({});
  return productIds?.ids?.map((itemId: string) => ({
    itemId,
  }));
}

export default async function page({ params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/login");
  }

  const itemId = (await params).itemId;

  const item = await getProductsById({ id: itemId });
  console.log("items", item);

  const productItem = item.item;

  return <ItemPage productItem={productItem} />;
}
