"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  CreditCard,
  Landmark,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Types
interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

interface MobileWallet {
  id: string;
  provider: "mtn" | "airtel" | "glo" | "9mobile";
  phoneNumber: string;
  name: string;
}

interface WithdrawalData {
  amount: number;
  method: "bank" | "mobile";
  provider: "paystack" | "flutterwave";
  bankAccount?: BankAccount;
  mobileWallet?: MobileWallet;
  pin?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const WithdrawalPage: React.FC = () => {
  const [step, setStep] = useState<
    "form" | "confirm" | "processing" | "success" | "error"
  >("form");
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({
    amount: 0,
    method: "bank",
    provider: "paystack",
  });
  const [userBalance, setUserBalance] = useState(150000); // Mock balance
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [mobileWallets, setMobileWallets] = useState<MobileWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setBankAccounts([
      {
        id: "1",
        bankName: "GTBank",
        accountNumber: "0123456789",
        accountName: "John Doe",
      },
      {
        id: "2",
        bankName: "Access Bank",
        accountNumber: "0987654321",
        accountName: "John Doe",
      },
    ]);

    setMobileWallets([
      {
        id: "1",
        provider: "mtn",
        phoneNumber: "08123456789",
        name: "John Doe",
      },
      {
        id: "2",
        provider: "airtel",
        phoneNumber: "08987654321",
        name: "John Doe",
      },
    ]);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const validateForm = (): boolean => {
    if (!withdrawalData.amount || withdrawalData.amount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    if (withdrawalData.amount > userBalance) {
      setError("Insufficient balance");
      return false;
    }

    if (withdrawalData.amount < 1000) {
      setError("Minimum withdrawal amount is ₦1,000");
      return false;
    }

    if (withdrawalData.method === "bank" && !withdrawalData.bankAccount) {
      setError("Please select a bank account");
      return false;
    }

    if (withdrawalData.method === "mobile" && !withdrawalData.mobileWallet) {
      setError("Please select a mobile wallet");
      return false;
    }

    return true;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) return;

    setStep("processing");
    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock API call to your backend
      const response = await mockWithdrawalAPI(withdrawalData);

      if (response.success) {
        setStep("success");
      } else {
        setError(response.message);
        setStep("error");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual implementation
  const mockWithdrawalAPI = async (
    data: WithdrawalData
  ): Promise<ApiResponse> => {
    // This is where you'd integrate with Paystack or Flutterwave APIs
    console.log("Withdrawal request:", data);
    return { success: true, message: "Withdrawal successful" };
  };

  const resetForm = () => {
    setStep("form");
    setError("");
    setWithdrawalData({
      amount: 0,
      method: "bank",
      provider: "paystack",
    });
  };

  if (step === "processing") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Withdrawal
          </h2>
          <p className="text-gray-600">
            Please wait while we process your withdrawal request...
          </p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Withdrawal Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your withdrawal of {formatCurrency(withdrawalData.amount)} has been
            processed successfully.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Withdrawal
          </button>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Withdrawal Failed
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setStep("form")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Withdraw Funds</h1>
        <p className="opacity-90">
          Available Balance: {formatCurrency(userBalance)}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₦
            </span>
            <input
              type="number"
              value={withdrawalData.amount || ""}
              onChange={(e) => {
                setError("");
                setWithdrawalData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }));
              }}
              placeholder="0.00"
              className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum withdrawal: ₦1,000
          </p>
        </div>

        {/* Payment Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Provider
          </label>
          <div className="relative">
            <button
              onClick={() => setShowProviderDropdown(!showProviderDropdown)}
              className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="capitalize">{withdrawalData.provider}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {showProviderDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {["paystack", "flutterwave"].map((provider) => (
                  <button
                    key={provider}
                    onClick={() => {
                      setWithdrawalData((prev) => ({
                        ...prev,
                        provider: provider as "paystack" | "flutterwave",
                      }));
                      setShowProviderDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 capitalize"
                  >
                    {provider}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Withdrawal Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdrawal Method
          </label>
          <div className="relative">
            <button
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
              className="w-full flex items-center justify-between px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <div className="flex items-center gap-2">
                {withdrawalData.method === "bank" ? (
                  <Landmark className="w-5 h-5 text-gray-400" />
                ) : (
                  <Smartphone className="w-5 h-5 text-gray-400" />
                )}
                <span>
                  {withdrawalData.method === "bank"
                    ? "Bank Account"
                    : "Mobile Wallet"}
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {showMethodDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    setWithdrawalData((prev) => ({
                      ...prev,
                      method: "bank",
                      mobileWallet: undefined,
                    }));
                    setShowMethodDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Landmark className="w-4 h-4" />
                  Bank Account
                </button>
                <button
                  onClick={() => {
                    setWithdrawalData((prev) => ({
                      ...prev,
                      method: "mobile",
                      bankAccount: undefined,
                    }));
                    setShowMethodDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile Wallet
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bank Account Selection */}
        {withdrawalData.method === "bank" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank Account
            </label>
            <div className="space-y-2">
              {bankAccounts.map((account) => (
                <label
                  key={account.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="bankAccount"
                    checked={withdrawalData.bankAccount?.id === account.id}
                    onChange={() =>
                      setWithdrawalData((prev) => ({
                        ...prev,
                        bankAccount: account,
                      }))
                    }
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {account.bankName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {account.accountNumber} • {account.accountName}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Wallet Selection */}
        {withdrawalData.method === "mobile" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mobile Wallet
            </label>
            <div className="space-y-2">
              {mobileWallets.map((wallet) => (
                <label
                  key={wallet.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="mobileWallet"
                    checked={withdrawalData.mobileWallet?.id === wallet.id}
                    onChange={() =>
                      setWithdrawalData((prev) => ({
                        ...prev,
                        mobileWallet: wallet,
                      }))
                    }
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {wallet.provider}
                    </div>
                    <div className="text-sm text-gray-600">
                      {wallet.phoneNumber} • {wallet.name}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Transaction PIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction PIN
          </label>
          <input
            type="password"
            maxLength={4}
            placeholder="Enter 4-digit PIN"
            value={withdrawalData.pin || ""}
            onChange={(e) =>
              setWithdrawalData((prev) => ({ ...prev, pin: e.target.value }))
            }
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={loading || !withdrawalData.amount}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </div>
          ) : (
            `Withdraw ${
              withdrawalData.amount
                ? formatCurrency(withdrawalData.amount)
                : "₦0"
            }`
          )}
        </button>

        <div className="text-xs text-gray-500 text-center">
          By proceeding, you agree to our withdrawal terms and conditions.
          Processing may take 1-3 business days.
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
