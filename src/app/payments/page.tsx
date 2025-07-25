"use client";
import React, { useState, useEffect } from "react";

interface PaymentData {
  email: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  name: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-blue-500 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-2 border-l-2 border-b-2 border-white transform rotate-45 -translate-y-0.5"></div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Your business consultation has been confirmed
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm font-medium text-gray-500 mb-1">
              Transaction ID
            </p>
            <p className="text-lg font-mono text-gray-900">{transactionId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95"
            >
              Continue
            </button>
            <button
              onClick={() => {
                /* Handle download receipt */
              }}
              className="w-full border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-blue-50 transition-all"
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BizconPayment: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<
    "card" | "paypal" | "crypto"
  >("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId] = useState(`BZC-${Date.now()}`);
  const [formData, setFormData] = useState<PaymentData>({
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/.{1,4}/g);
    return matches ? matches.join(" ") : v;
  };

  const formatExpiry = (value: string): string => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    let formattedValue = value;

    if (field === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.email ||
      !formData.cardNumber ||
      !formData.expiry ||
      !formData.cvv ||
      !formData.name
    ) {
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 2500);
  };

  const isFormValid =
    formData.email &&
    formData.cardNumber &&
    formData.expiry &&
    formData.cvv &&
    formData.name;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-10 max-w-2xl w-full relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-blue-500 mb-3 tracking-tight">
                BizConnect
              </h1>
              <p className="text-gray-600 text-lg">Secure Business Payment</p>
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    TechSolutions Pro
                  </h3>
                  <p className="text-gray-600">Premium Business Consultation</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Payment Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">
                    Business Strategy Consultation
                  </span>
                  <span className="text-gray-900 font-semibold">$299.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Platform Fee</span>
                  <span className="text-gray-900 font-semibold">$14.95</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Processing Fee</span>
                  <span className="text-gray-900 font-semibold">$9.05</span>
                </div>
                <div className="border-t-2 border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      $323.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "card", label: "Credit Card" },
                  { id: "paypal", label: "PayPal" },
                  { id: "crypto", label: "Crypto" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`p-4 rounded-xl border-2 text-center transition-all font-semibold ${
                      selectedMethod === method.id
                        ? "border-blue-900 bg-blue-900 text-white shadow-lg transform scale-105"
                        : "border-blue-200 hover:border-blue-300 text-blue-700 bg-white hover:shadow-md"
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white text-lg"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange("cardNumber", e.target.value)
                  }
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white text-lg font-mono"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-semibold text-gray-900 mb-3"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    value={formData.expiry}
                    onChange={(e) =>
                      handleInputChange("expiry", e.target.value)
                    }
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white text-lg font-mono"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-semibold text-gray-900 mb-3"
                  >
                    Security Code
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white text-lg font-mono"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-400 transition-all bg-white text-lg"
                  placeholder="John Doe"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isProcessing}
                className={`w-full py-5 px-8 rounded-xl font-bold text-lg transition-all transform ${
                  isFormValid && !isProcessing
                    ? "bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  `Complete Payment • $323.00`
                )}
              </button>
            </div>

            {/* Security Info */}
            <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Bank Level Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionId={transactionId}
      />
    </>
  );
};

export default BizconPayment;
