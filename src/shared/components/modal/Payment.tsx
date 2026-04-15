import { useState } from "react";
import { Shield, X, Lock } from "lucide-react";
import Image from "next/image";
import PaystackCheckout from "./Paystack";
import FlutterwaveCheckout from "../composites/FlutterWave";
import { ProductsItemsPageProps } from "../../../../types";
import { useProductStore } from "@/shared/store/useProductsStore";
import formatPrice from "@/shared/utils/formatPrice";

export default function PaymentModal({
  productItem,
  quantity,
}: {
  productItem: ProductsItemsPageProps;
  quantity: number;
}) {
  const {
    showPaymentModal,
    setShowPaymentModal,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  } = useProductStore();
  const subtotal = Number(productItem.price) * quantity;
  const serviceFee = subtotal * 0.02;
  const total = subtotal + serviceFee;

  if (!showPaymentModal || !productItem) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Complete Purchase
            </h3>
            <button className="text-gray-500 hover:text-gray-700">
              <X
                className="w-6 h-6"
                onClick={() => setShowPaymentModal(false)}
              />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={productItem.media?.[0]?.url || "/fallbackproduct.png"}
                alt={productItem.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">
                  {productItem.title}
                </h4>
                <p className="text-gray-600 text-sm">Quantity: {quantity}</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(Number(subtotal.toFixed(2)))}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Escrow Protection Fee</span>
                <span>{formatPrice(Number(serviceFee.toFixed(2)))}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(Number(total.toFixed(2)))}</span>
              </div>
            </div>
          </div>

          {/* Escrow Information */}
          {productItem.useEscrow && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">
                    Escrow Protection
                  </h4>
                  <p className="text-sm text-green-800 mb-2">
                    Your payment is held securely until you confirm receipt and
                    satisfaction with the item.
                  </p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Money held safely until delivery confirmed</li>
                    <li>• Full refund if item not as described</li>
                    <li>• Dispute resolution available</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Choose Payment Method
            </h4>
            <div className="space-y-3">
              {/* Paystack Option */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="paystack"
                  checked={selectedPaymentMethod === "paystack"}
                  onChange={(e) =>
                    setSelectedPaymentMethod(e.target.value as "paystack")
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedPaymentMethod === "paystack"
                      ? "border-[#00C3F7] bg-[#00C3F7]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPaymentMethod === "paystack" && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div className="flex items-center gap-3 justify-between">
                  <Image
                    src="/paystack.png"
                    alt="Pay with Paystack"
                    height={140}
                    width={140}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Paystack</div>
                    <div className="text-sm text-gray-500">
                      Pay with cards, bank transfer, USSD
                    </div>
                  </div>
                </div>
              </label>

              {/* Flutterwave Option */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="flutterwave"
                  checked={selectedPaymentMethod === "flutterwave"}
                  onChange={(e) =>
                    setSelectedPaymentMethod(e.target.value as "flutterwave")
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedPaymentMethod === "flutterwave"
                      ? "border-orange-600 bg-orange-600"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPaymentMethod === "flutterwave" && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div className="flex items-center gap-3 w-28 sm:w-96">
                  <Image
                    src="/flutterwave.png"
                    alt="Pay with Paystack"
                    height={140}
                    width={140}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Flutterwave</div>
                    <div className="text-sm text-gray-500">
                      Secure payments across Africa
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Button */}
          {selectedPaymentMethod === "paystack" ? (
            <PaystackCheckout productItem={productItem} quantity={quantity} />
          ) : (
            <FlutterwaveCheckout
              productItem={productItem}
              quantity={quantity}
            />
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
            <Lock className="w-4 h-4" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            By completing this purchase, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
