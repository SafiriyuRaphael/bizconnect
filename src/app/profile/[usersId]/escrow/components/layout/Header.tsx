import { Download, RefreshCw, Shield } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Escrow Management
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Transaction oversight & dispute resolution
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
