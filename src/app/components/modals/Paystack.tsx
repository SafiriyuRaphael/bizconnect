// src/app/components/modals/PaystackCheckout.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductsItemsPageProps } from "../../../../types";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import usePaymentsApi from "@/hook/usePaymentsApi";
import { useMessageModalStore } from "@/store/useMessageModalStore";
import { useRouter } from "next/navigation";

const PaystackCheckout = ({
  productItem,
  quantity,
}: {
  productItem: ProductsItemsPageProps;
  quantity: number;
}) => {
  const { data: session } = useSession();
  const { makePayment } = usePaymentsApi();
  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import("@paystack/inline-js").then((Paystack) => {
      setPaystackLoaded(true);
    });
  }, []);

  const handlePayment = async () => {
    if (!paystackLoaded) {
      console.error("Paystack not loaded yet");
      return;
    }
    if (!session?.user) {
      useMessageModalStore.getState().onOpen({
        title: "User logged out",
        message: "Please log in to proceed with payment.",
        type: "error",
        autoClose: true,
        actions: null,
        autoCloseDelay: 3000,
      });
      router.push("/auth/login");
      return;
    }

    // if (!session?.user?.verified) {
    //   useMessageModalStore.getState().onOpen({
    //     title: "Email Not Verified",
    //     message: "verify your email to continue make transaction",
    //     type: "error",
    //     autoClose: true,
    //     actions: null,
    //   });
    //   router.push(`/profile/${session?.user.id}`);
    //   return;
    // }

    setLoading(true);
    const Paystack = (await import("@paystack/inline-js")).default;
    const popup = new Paystack();
    console.log("this is clicked");

    popup.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: session.user.email!,
      amount: Number(productItem.price) * quantity * 100,
      currency: "NGN",
      onSuccess: async (transaction) => {
        console.log("Payment successful:", transaction);
        makePayment.mutate({
          paymentProvider: "paystack",
          tx_ref: transaction.reference,
          itemId: productItem._id!,
          buyerId: session.user.id,
          sellerId: productItem.userId!,
          price: Number(productItem.price),
          quantity,
        });
        setLoading(false);
      },
      onLoad: (response) => {
        console.log("Popup loaded:", response);
      },
      onCancel: () => {
        console.log("Payment canceled");
        setLoading(false);
      },
      onError: (error) => {
        console.log("Payment error:", error.message);
        setLoading(false);
      },
    });
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[#00C3F7] text-white py-4 rounded-xl font-semibold hover:bg-[#6eb1c4] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          <Lock className="w-5 h-5" />
          Pay ₦{(Number(productItem.price) * quantity).toFixed(2)} via Paystack
        </>
      )}
    </button>
  );
};

export default PaystackCheckout;
