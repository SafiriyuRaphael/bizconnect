import React, { useState, useRef, useEffect } from "react";
import {
  Wallet,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import usePaymentsApi from "@/shared/hooks/usePaymentsApi";
import formatPrice from "@/shared/utils/formatPrice";

const WalletDropdown = ({ isMobile = false }) => {
  const { wallet } = usePaymentsApi();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [copiedBalance, setCopiedBalance] = useState(false);
  const [copiedLocked, setCopiedLocked] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        walletRef.current &&
        !walletRef.current.contains(event.target as Node)
      ) {
        setIsWalletOpen(false);
      }
    };

    if (isWalletOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWalletOpen]);

  if (!wallet) return null; // Ensure wallet data is available before rendering

  const copyBalance = () => {
    navigator.clipboard.writeText(wallet?.wallet.balance.toString());
    setCopiedBalance(true);
    setTimeout(() => setCopiedBalance(false), 2000);
  };

  const copyLocked = () => {
    navigator.clipboard.writeText(wallet?.wallet.locked.toString());
    setCopiedLocked(true);
    setTimeout(() => setCopiedLocked(false), 2000);
  };

  const availableBalance = wallet?.wallet.balance - wallet?.wallet.locked;

  if (isMobile) {
    return (
      <button
        onClick={() => setIsWalletOpen(!isWalletOpen)}
        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg font-medium w-full"
      >
        <div className="flex items-center gap-3">
          <Wallet size={20} />
          <span>Wallet</span>
        </div>
        <span className="text-blue-600 font-semibold">
          {formatPrice(availableBalance)}
        </span>
      </button>
    );
  }

  return (
    <div className="relative" ref={walletRef}>
      {/* Desktop Wallet Trigger Button */}
      <button
        onClick={() => setIsWalletOpen(!isWalletOpen)}
        className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg group flex items-center gap-2"
        title={`Wallet Balance: ${formatPrice(wallet?.wallet.balance)}`}
      >
        <Wallet size={20} />
        <span className="hidden xl:block text-sm font-semibold text-blue-600">
          {showBalance ? formatPrice(availableBalance) : "•••"}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-300 ${
            isWalletOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isWalletOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-blue-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Wallet size={16} className="text-white" />
                </div>
                <span className="font-semibold text-sm">Wallet Balance</span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  wallet?.wallet.status === "active"
                    ? "bg-green-500/20 text-green-100"
                    : "bg-red-500/20 text-red-100"
                }`}
              >
                {wallet?.wallet.status === "active" ? (
                  <>
                    <Unlock size={10} />
                    Active
                  </>
                ) : (
                  <>
                    <Lock size={10} />
                    Locked
                  </>
                )}
              </div>
            </div>

            {/* Available Balance */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs mb-1">Available Balance</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    {showBalance ? formatPrice(availableBalance) : "••••••••"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                      title={showBalance ? "Hide balance" : "Show balance"}
                    >
                      {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button
                      onClick={copyBalance}
                      className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                      title="Copy balance"
                    >
                      {copiedBalance ? (
                        <Check size={12} className="text-green-300" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="p-3 space-y-2">
            {/* Total Balance Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-900 font-medium text-sm">
                    Total Balance
                  </p>
                  <p className="text-blue-600 text-xs">Complete wallet funds</p>
                </div>
                <p className="text-lg font-bold text-blue-900">
                  {showBalance
                    ? formatPrice(wallet?.wallet.balance || 0)
                    : "••••••••"}
                </p>
              </div>
            </div>

            {/* Locked Balance Card (if any) */}
            {wallet?.wallet && wallet?.wallet.locked > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-900 font-medium text-sm">
                      Locked Funds
                    </p>
                    <p className="text-orange-600 text-xs">
                      Temporarily unavailable
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-orange-900">
                      {showBalance
                        ? formatPrice(wallet?.wallet.locked || 0)
                        : "••••••"}
                    </p>
                    <button
                      onClick={copyLocked}
                      className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-all duration-200"
                      title="Copy locked amount"
                    >
                      {copiedLocked ? (
                        <Check size={10} className="text-green-600" />
                      ) : (
                        <Copy size={10} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Currency</span>
                <span className="font-semibold text-gray-900 bg-white px-2 py-1 rounded">
                  {wallet?.wallet.currency || "NGN"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-1">
              <p className="text-xs text-gray-500">
                🔒 Secure & encrypted wallet
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
