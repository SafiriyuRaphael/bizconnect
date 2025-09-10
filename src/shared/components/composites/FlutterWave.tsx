// src/app/components/modals/FlutterwaveCheckout.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductsItemsPageProps } from "../../../../types";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import usePaymentsApi from "@/shared/hooks/usePaymentsApi";

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: any) => void;
    closeFlutterwaveCheckout?: () => void;
  }
}

interface FlutterwaveResponse {
  status: string;
  transaction_id?: string;
  tx_ref?: string;
  [key: string]: any;
}

const FlutterwaveCheckout = ({
  productItem,
  quantity,
}: {
  productItem: ProductsItemsPageProps;
  quantity: number;
}) => {
  const { data: session } = useSession();
  const { makePayment } = usePaymentsApi();
  const [loading, setLoading] = useState(false);
  const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    script.onload = () => setFlutterwaveLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!flutterwaveLoaded || !window.FlutterwaveCheckout) {
      console.error("Flutterwave SDK not loaded");
      return;
    }
    if (!session?.user?.email) {
      alert("Please log in to proceed with payment.");
      return;
    }

    setLoading(true);

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: `tx_${Date.now()}`,
      amount: Number(productItem.price) * quantity,
      currency: "NGN",
      customer: {
        email: session.user.email,
        name: session.user.name || productItem.user.businessName,
        id: (session.user.id || session.user.email).replace(/\./g, "_"),
      },
      customizations: {
        title: `Purchase: ${productItem.title}`,
        description: `Payment for ${quantity} x ${productItem.title}`,
        logo: productItem.user.logo || "/default-logo.png",
      },
      callback: async (response: FlutterwaveResponse) => {
        console.log("Payment response:", response);
        setLoading(false);
        if (response.status === "successful") {
          makePayment.mutate({
            paymentProvider: "flutterwave",
            tx_ref: response.tx_ref!,
            itemId: productItem._id!,
            // 🛑 Don't send to Flutterwave — just send to your backend
            buyerId: session.user.id,
            sellerId: productItem.userId!,
            price: Number(productItem.price),
            quantity,
          });
          window.closeFlutterwaveCheckout?.();
        }
      },
      onclose: () => {
        console.log("Payment popup closed");
        setLoading(false);
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          <Lock className="w-5 h-5" />
          Pay ₦{(Number(productItem.price) * quantity).toFixed(2)} via
          Flutterwave
        </>
      )}
    </button>
  );
};

export default FlutterwaveCheckout;
