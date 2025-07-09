"use client";
import React from "react";
import { ArrowLeft, FileText, Shield, Users, Gavel } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsAndConditions() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Terms and Conditions
            </h1>
            <p className="text-gray-600 text-lg">
              Please read these terms carefully before using BizConnect
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: June 20, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 leading-relaxed">
                Welcome to BizConnect! These Terms and Conditions govern your
                use of our platform. BizConnect helps you list, manage, and
                transact, whether you&apos;re offering services or shopping for them.
                By using BizConnect, you agree to be bound by these terms.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    1. About BizConnect
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  BizConnect is a digital marketplace platform that connects
                  service providers with customers. Our platform facilitates
                  secure transactions, helps manage service listings, and
                  fosters meaningful business connections in a trusted
                  environment.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    2. Acceptance of Terms
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By creating an account or using BizConnect, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms and our Privacy Policy.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm mb-0">
                    <strong>Important:</strong> If you do not agree to these
                    Terms, please do not use our services.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Eligibility
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use BizConnect, you must:
                </p>
                <ul className="text-gray-700 space-y-2 ml-6">
                  <li>
                    • Be at least 18 years old or have parental/guardian consent
                  </li>
                  <li>• Have the legal capacity to enter into contracts</li>
                  <li>
                    • Provide accurate and complete information during
                    registration
                  </li>
                  <li>
                    • Not be prohibited from using our services under applicable
                    laws
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. User Accounts
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.1 Account Creation
                </h3>
                <ul className="text-gray-700 space-y-2 ml-6 mb-4">
                  <li>• You must create an account to access most features</li>
                  <li>
                    • You are responsible for maintaining account security
                  </li>
                  <li>• All information must be accurate and current</li>
                  <li>• You are responsible for all account activities</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.2 Account Security
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm mb-0">
                    <strong>Security Notice:</strong> Immediately notify us of
                    any unauthorized account access. Never share your login
                    credentials with others.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Platform Services
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.1 Service Listings
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Service providers may list their services on BizConnect. All
                  listings must be accurate, complete, and lawful. We reserve
                  the right to remove listings that violate these Terms.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.2 Transactions
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-0">
                    <strong>Important:</strong> BizConnect facilitates
                    transactions but is not a party to them. Users are
                    responsible for fulfilling their contractual obligations.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Gavel className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    6. Prohibited Conduct
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You agree NOT to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="text-gray-700 space-y-2 ml-6">
                    <li>• Violate any applicable laws</li>
                    <li>• Post false or misleading content</li>
                    <li>• Engage in fraudulent practices</li>
                    <li>• Harass or harm other users</li>
                  </ul>
                  <ul className="text-gray-700 space-y-2 ml-6">
                    <li>• Use the platform for illegal activities</li>
                    <li>• Attempt unauthorized system access</li>
                    <li>• Interfere with platform functionality</li>
                    <li>• Manipulate ratings or reviews</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Payment Terms
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may charge fees for certain services. All fees are clearly
                  disclosed before charging and are generally non-refundable.
                  Payment processing is handled through secure third-party
                  providers.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Disclaimers and Limitations
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 text-sm mb-2">
                    <strong>Service Disclaimer:</strong> BizConnect is provided
                    &quot;as is&quot; without warranties. We do not guarantee
                    uninterrupted service or the quality of listed services.
                  </p>
                  <p className="text-gray-800 text-sm mb-0">
                    <strong>Limitation of Liability:</strong> Our liability is
                    limited to the maximum extent permitted by law and shall not
                    exceed fees paid in the last 12 months.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Modifications
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these Terms at any time. Significant changes
                  will be communicated via email or platform notification.
                  Continued use constitutes acceptance of modified Terms.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Contact Information
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have questions about these Terms and Conditions,
                    please contact us:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Email:</strong> legal@bizconnect.com
                    </p>
                    <p>
                      <strong>Support:</strong> support@bizconnect.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 text-center">
                <p className="text-lg font-semibold mb-2">
                  Remember: This is a Legal Contract
                </p>
                <p className="text-blue-100">
                  Please read these terms carefully and contact us if you have
                  any questions before using BizConnect.
                </p>
                <p className="text-blue-200 text-sm mt-4">
                  Simplifying transactions, fostering connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>&copy; 2025 BizConnect. All rights reserved.</p>
      </div>
    </div>
  );
}
